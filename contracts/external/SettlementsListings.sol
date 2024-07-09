// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "../core/IWorld.sol";

/// @title Settlements listings
/// @notice Functions related to selling settlements for specific amount of tokens
contract SettlementsListings is ReentrancyGuard {
    enum OrderStatus {
        NOT_EXIST,// This status is necessary because of enum-uint cast (0 if empty storage)
        NEW,
        CANCELLED,
        ACCEPTED
    }

    struct SharesInfo {
        bytes32 buildingTypeId;
        uint256 minSharesAmount;
    }

    struct OrderDetails {
        address orderOwner;
        address sellingTokenAddress;
        address allowedAddressToAcceptOrder;
        uint256 orderStartTime;
        uint256 orderEndTime;
        uint256 price;
        uint256 bannerId;
        OrderStatus status;
    }

    /// @notice Banners contract
    /// @dev Immutable, initialized in constructor
    IERC721Enumerable public banners;

    /// @notice World contract
    /// @dev Immutable, initialized in constructor
    IWorld public world;

    /// @notice Mapping containing order id to related OrderDetails struct
    /// @dev Modified when #createOrder or #acceptOrder or #cancelOrder is called
    mapping(uint256 => OrderDetails) public orders;

    /// @notice Mapping containing link from banner id to order id
    /// @dev Modified when #createOrder or #createOrder is called
    mapping(uint256 => uint256) public bannersOrders;

    /// @notice Lastly created order id (0 if no orders is created)
    /// @dev Modified when #createOrder is called
    uint256 public lastOrderId = 0;

    /// @notice Emitted when #createOrder is called
    /// @param orderId Newly created order id
    /// @param bannerId Banner id
    /// @param sellingTokenAddress Selling token address (address(0) if native eth currency is used)
    /// @param price Price
    /// @param allowedAddressToAcceptOrder Allowed address to accept order (address(0) if any address can accept order)
    /// @param orderStartTime Order start time (0 if order is started immediately)
    /// @param orderEndTime Order end time (0 if order is lasting infinitely)
    event OrderCreated(
        uint256 orderId,
        uint256 bannerId,
        address sellingTokenAddress,
        uint256 price,
        address allowedAddressToAcceptOrder,
        uint256 orderStartTime,
        uint256 orderEndTime
    );

    /// @notice Emitted when #cancelOrder is called (can be emitted when #createOrder is called once again after banner owner is changed)
    /// @param orderId Order id
    event OrderCancelled(uint256 orderId);

    /// @notice Emitted when #acceptOrder is called
    /// @param orderId Order id
    event OrderAccepted(uint256 orderId);

    /// @notice Emitted when #modifyOrder is called
    /// @param orderId Order id
    /// @param sellingTokenAddress New selling token address (address(0) if native eth currency is used)
    /// @param price New price
    /// @param allowedAddressToAcceptOrder New allowed address to accept order (address(0) if any address can accept order)
    /// @param orderStartTime New order start time (0 if order is started immediately)
    /// @param orderEndTime New order end time (0 if order is lasting infinitely)
    event OrderModified(
        uint256 orderId,
        address sellingTokenAddress,
        uint256 price,
        address allowedAddressToAcceptOrder,
        uint256 orderStartTime,
        uint256 orderEndTime
    );

    /// @notice Thrown when attempting to create order while not owning banner which will be traded
    error CannotCreateOrderForNotOwnedBanner();

    /// @notice Thrown when attempting to create order for one banner more than once
    error CannotCreateOrderForBannerMoreThanOnce();

    /// @notice Thrown when attempting to accept order with non NEW status
    error CannotAcceptNotNewOrder();

    /// @notice Thrown when attempting to accept order if 'orderDetails.allowedAddressToAcceptOrder' exist and msg.sender is not that address
    error CannotAcceptOrderByNotAllowedAddress();

    /// @notice Thrown when attempting to accept order if 'orderDetails.orderStartTime' exist and order is not started
    error CannotAcceptNotStartedOrder();

    /// @notice Thrown when attempting to accept order if 'orderDetails.orderEndTime' exist and order is already expired
    error CannotAcceptExpiredOrder();

    /// @notice Thrown when attempting to accept order without providing exact amount of tokens for it
    error CannotAcceptOrderByProvidingNotExactPriceForIt();

    /// @notice Thrown when attempting to accept order with shares to receive in the process lower than specified
    error CannotAcceptOrderWithSharesToReceiveLowerThanSpecified();

    /// @notice Thrown when attempting to cancel order if caller is not order owner and order owner owns banner
    error CannotCancelActiveOrderIfCallerNotOrderOwnerAndOrderOwnerOwnsBanner();

    /// @notice Thrown when attempting to cancel non NEW order
    error CannotCancelNonNewOrder();

    /// @notice Thrown when attempting to modify non NEW order
    error CannotModifyNonNewOrder();

    /// @notice Thrown when attempting to modify order by caller who is not order owner
    error CannotModifyOrderByNonOrderOwner();

    constructor(
        address bannersAddress,
        address worldAddress
    ) public {
        banners = IERC721Enumerable(bannersAddress);
        world = IWorld(worldAddress);
    }

    /// @notice Creates settlement order
    /// @dev Creates order for specified amount of tokens
    /// @param bannerId Banner id
    /// @param sellingTokenAddress Selling token address (address(0) if native eth currency is used)
    /// @param price Price
    /// @param allowedAddressToAcceptOrder Allowed address to accept order (address(0) if any address can accept order)
    /// @param orderStartTime Order start time (0 if order is started immediately)
    /// @param orderEndTime Order end time (0 if order is lasting infinitely)
    function createOrder(
        uint256 bannerId,
        address sellingTokenAddress,
        uint256 price,
        address allowedAddressToAcceptOrder,
        uint256 orderStartTime,
        uint256 orderEndTime
    ) public {
        address bannerOwner = banners.ownerOf(bannerId);

        uint256 orderId = bannersOrders[bannerId];
        OrderDetails storage orderDetails = orders[orderId];

        if (orderDetails.status == OrderStatus.NEW && orderDetails.orderOwner != bannerOwner) {
            cancelOrder(orderId);
        }

        if (bannerOwner != msg.sender) revert CannotCreateOrderForNotOwnedBanner();
        if (bannersOrders[bannerId] != 0) revert CannotCreateOrderForBannerMoreThanOnce();

        lastOrderId = lastOrderId + 1;
        bannersOrders[bannerId] = lastOrderId;

        OrderDetails storage newOrderDetails = orders[lastOrderId];

        newOrderDetails.bannerId = bannerId;
        newOrderDetails.orderOwner = msg.sender;
        newOrderDetails.sellingTokenAddress = sellingTokenAddress;
        newOrderDetails.price = price;
        newOrderDetails.status = OrderStatus.NEW;
        newOrderDetails.allowedAddressToAcceptOrder = allowedAddressToAcceptOrder;
        newOrderDetails.orderStartTime = orderStartTime;
        newOrderDetails.orderEndTime = orderEndTime;

        emit OrderCreated(lastOrderId, bannerId, sellingTokenAddress, price, allowedAddressToAcceptOrder, orderStartTime, orderEndTime);
    }

    /// @notice Accepts order
    /// @dev Transfers banner id to msg.sender for provided amount of tokens (if ERC20 - they need to be approved beforehand, if native - they have to be sent to this function)
    /// @param orderId Order id
    /// @param minBuildingsSharesToReceive Minimum amount of building shares to receive with orders' banner
    function acceptOrder(
        uint256 orderId,
        SharesInfo[] memory minBuildingsSharesToReceive
    ) public payable nonReentrant {
        OrderDetails storage orderDetails = orders[orderId];

        if (orderDetails.status != OrderStatus.NEW) revert CannotAcceptNotNewOrder();
        if (orderDetails.allowedAddressToAcceptOrder != address(0) && orderDetails.allowedAddressToAcceptOrder != msg.sender) revert CannotAcceptOrderByNotAllowedAddress();
        if (orderDetails.orderStartTime != 0 && block.timestamp < orderDetails.orderStartTime) revert CannotAcceptNotStartedOrder();
        if (orderDetails.orderEndTime != 0 && block.timestamp > orderDetails.orderEndTime) revert CannotAcceptExpiredOrder();

        bool isNativeCurrency = orderDetails.sellingTokenAddress == address(0);
        if (isNativeCurrency) {
            if (msg.value != orderDetails.price) revert CannotAcceptOrderByProvidingNotExactPriceForIt();
            Address.sendValue(payable(orderDetails.orderOwner), orderDetails.price);
        } else {
            SafeERC20.safeTransferFrom(
                IERC20(orderDetails.sellingTokenAddress),
                msg.sender,
                orderDetails.orderOwner,
                orderDetails.price
            );
        }

        banners.safeTransferFrom(orderDetails.orderOwner, msg.sender, orderDetails.bannerId);

        IDistributions distributions = world.distributions();
        IEra currentEra = world.eras(world.currentEraNumber());
        ISettlement settlement = currentEra.settlementByBannerId(orderDetails.bannerId);

        uint256[] memory distributionIds = new uint256[](minBuildingsSharesToReceive.length);
        uint256[] memory amounts = new uint256[](minBuildingsSharesToReceive.length);

        for (uint256 i = 0; i < minBuildingsSharesToReceive.length; i++) {
            SharesInfo memory minSharesInfo = minBuildingsSharesToReceive[i];
            uint256 distributionId = settlement.buildings(minSharesInfo.buildingTypeId).distributionId();
            uint256 sharesAmountOnOwner = distributions.balanceOf(orderDetails.orderOwner, distributionId);

            if (sharesAmountOnOwner < minSharesInfo.minSharesAmount) revert CannotAcceptOrderWithSharesToReceiveLowerThanSpecified();

            distributionIds[i] = distributionId;
            amounts[i] = sharesAmountOnOwner;
        }

        distributions.safeBatchTransferFrom(
            orderDetails.orderOwner,
            msg.sender,
            distributionIds,
            amounts,
            new bytes(0)
        );

        orderDetails.status = OrderStatus.ACCEPTED;
        bannersOrders[orderDetails.bannerId] = 0;

        emit OrderAccepted(orderId);
    }

    /// @notice Cancels order
    /// @dev Can be called by order owner OR order owner is not banner owner (anyone can cancel order if order is not valid)
    /// @param orderId Order id
    function cancelOrder(
        uint256 orderId
    ) public {
        OrderDetails storage orderDetails = orders[orderId];
        address bannerOwner = banners.ownerOf(orderDetails.bannerId);

        if (orderDetails.status != OrderStatus.NEW) revert CannotCancelNonNewOrder();

        bool isOrderOwner = orderDetails.orderOwner == msg.sender;
        bool isOrderOwnerOwnsBanner = orderDetails.orderOwner == bannerOwner;
        if (!isOrderOwner && isOrderOwnerOwnsBanner) revert CannotCancelActiveOrderIfCallerNotOrderOwnerAndOrderOwnerOwnsBanner();

        orderDetails.status = OrderStatus.CANCELLED;
        bannersOrders[orderDetails.bannerId] = 0;

        emit OrderCancelled(orderId);
    }

    /// @notice Modifies order
    /// @dev Selling token address, price can be modified; banner id cannot be modified
    /// @param orderId Order id
    /// @param sellingTokenAddress New selling token address (address(0) if native eth currency is used)
    /// @param price New price
    /// @param allowedAddressToAcceptOrder New allowed address to accept order (address(0) if any address can accept order)
    /// @param orderStartTime New order start time (0 if order is started immediately)
    /// @param orderEndTime New order end time (0 if order is lasting infinitely)
    function modifyOrder(
        uint256 orderId,
        address sellingTokenAddress,
        uint256 price,
        address allowedAddressToAcceptOrder,
        uint256 orderStartTime,
        uint256 orderEndTime
    ) public {
        OrderDetails storage orderDetails = orders[orderId];

        if (orderDetails.status != OrderStatus.NEW) revert CannotModifyNonNewOrder();
        if (orderDetails.orderOwner != msg.sender) revert CannotModifyOrderByNonOrderOwner();

        orderDetails.sellingTokenAddress = sellingTokenAddress;
        orderDetails.price = price;
        orderDetails.allowedAddressToAcceptOrder = allowedAddressToAcceptOrder;
        orderDetails.orderStartTime = orderStartTime;
        orderDetails.orderEndTime = orderEndTime;

        emit OrderModified(orderId, sellingTokenAddress, price, allowedAddressToAcceptOrder, orderStartTime, orderEndTime);
    }
}
