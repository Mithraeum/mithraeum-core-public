// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ISettlementMarket.sol";
import "../WorldAsset.sol";
import "../../../libraries/ABDKMath64x64.sol";
import "../../../periphery/ProxyReentrancyGuard.sol";

contract SettlementsMarket is WorldAsset, ISettlementsMarket, ProxyReentrancyGuard {
    /// @inheritdoc ISettlementsMarket
    IRegion public override relatedRegion;
    /// @inheritdoc ISettlementsMarket
    uint256 public override marketCreationTime;

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {
        (address regionAddress) = abi.decode(initParams, (address));

        relatedRegion = IRegion(regionAddress);
        marketCreationTime = block.timestamp;
    }

    /// @inheritdoc ISettlementsMarket
    function updateState() public override {
        uint64 regionId = relatedRegion.regionId();

        ICrossErasMemory crossErasMemory = world().crossErasMemory();

        uint256 currentTime = _getCurrentTime();
        if (crossErasMemory.regionSettlementPriceUpdateTime(regionId) == currentTime) {
            return;
        }

        crossErasMemory.changeRegionSettlementPrice(
            regionId,
            getNewSettlementCost(currentTime),
            currentTime
        );
    }

    /// @inheritdoc ISettlementsMarket
    function buySettlementForFreeByMightyCreator(
        uint64 position,
        uint256 bannerId
    ) public override onlyMightyCreator {
        updateState();

        if (block.timestamp >= world().gameBeginTime()) revert SettlementCannotBeBoughtForFreeAfterGameBegan();

        address owner = world().bannerContract().ownerOf(bannerId);
        if (msg.sender != owner) revert SettlementCannotBeBoughtForNotOwnerBannerNft();

        IGeography geography = world().geography();
        (uint64 regionId, bool isPositionExist) = geography.getRegionIdByPosition(position);

        if (!isPositionExist) revert SettlementCannotBeBoughtOnNonExistentPosition();
        if (regionId != relatedRegion.regionId()) revert SettlementCannotBeBoughtOnPositionWhichIsNotRelatedToThisSettlementMarket();

        uint256 newSettlementCost = getNewSettlementCost(block.timestamp);

        address settlementAddress = era().createUserSettlement(
            position,
            regionId,
            bannerId
        );

        // Bump settlement price after purchase
        uint256 bumpedSettlementPrice = newSettlementCost * registry().getNewSettlementPriceIncreaseMultiplier() / 1e18;
        world().crossErasMemory().changeRegionSettlementPrice(
            relatedRegion.regionId(),
            bumpedSettlementPrice,
            block.timestamp
        );

        emit SettlementBought(settlementAddress, 0);
    }

    /// @inheritdoc ISettlementsMarket
    function buySettlement(
        uint64 position,
        uint256 bannerId,
        uint256 maxTokensToUse
    ) public payable override onlyActiveGame nonReentrant {
        updateState();

        address owner = world().bannerContract().ownerOf(bannerId);
        if (msg.sender != owner) revert SettlementCannotBeBoughtForNotOwnerBannerNft();

        IGeography geography = world().geography();
        (uint64 regionId, bool isPositionExist) = geography.getRegionIdByPosition(position);

        if (!isPositionExist) revert SettlementCannotBeBoughtOnNonExistentPosition();
        if (regionId != relatedRegion.regionId()) revert SettlementCannotBeBoughtOnPositionWhichIsNotRelatedToThisSettlementMarket();

        uint256 newSettlementCost = getNewSettlementCost(block.timestamp);
        if (maxTokensToUse < newSettlementCost) revert SettlementCannotBeBoughtDueToCostIsHigherThanMaxTokensToUseSpecified();

        uint256 amountOfTokensGoingToRegionOwner = newSettlementCost * world().registry().getRegionOwnerSettlementPurchasePercent(geography.getRegionTier(regionId)) / 1e18;
        uint256 amountOfTokensGoingToRewardPool = newSettlementCost - amountOfTokensGoingToRegionOwner;

        IERC20 erc20ForSettlementPurchase = world().erc20ForSettlementPurchase();
        if (address(erc20ForSettlementPurchase) == address(0)) {
            if (msg.value < newSettlementCost) revert SettlementCannotBeBoughtDueInsufficientValueSent();
            uint256 valueToSendBack = msg.value > newSettlementCost ? msg.value - newSettlementCost : 0;

            if (valueToSendBack > 0) {
                Address.sendValue(payable(msg.sender), valueToSendBack);
            }

            Address.sendValue(payable(address(world().rewardPool())), amountOfTokensGoingToRewardPool);
            Address.sendValue(payable(address(geography.getRegionOwner(regionId))), amountOfTokensGoingToRegionOwner);
        } else {
            SafeERC20.safeTransferFrom(
                erc20ForSettlementPurchase,
                msg.sender,
                address(world().rewardPool()),
                amountOfTokensGoingToRewardPool
            );

            SafeERC20.safeTransferFrom(
                erc20ForSettlementPurchase,
                msg.sender,
                address(geography.getRegionOwner(regionId)),
                amountOfTokensGoingToRegionOwner
            );
        }

        address settlementAddress = era().createUserSettlement(
            position,
            regionId,
            bannerId
        );

        // Bump settlement price after purchase
        uint256 bumpedSettlementPrice = newSettlementCost * registry().getNewSettlementPriceIncreaseMultiplier() / 1e18;
        world().crossErasMemory().changeRegionSettlementPrice(
            relatedRegion.regionId(),
            bumpedSettlementPrice,
            block.timestamp
        );

        emit SettlementBought(settlementAddress, newSettlementCost);
    }

    /// @inheritdoc ISettlementsMarket
    function getNewSettlementCost(
        uint256 timestamp
    ) public view override returns (uint256) {
        if (timestamp == 0) {
            timestamp = block.timestamp;
        }

        uint64 regionId = relatedRegion.regionId();

        ICrossErasMemory crossErasMemory = world().crossErasMemory();
        uint256 userSettlementsCount = crossErasMemory.regionUserSettlementsCount(regionId);
        uint256 priceUpdateTime = crossErasMemory.regionSettlementPriceUpdateTime(regionId);

        uint256 priceDecayBeginTime = _getPriceDecayBeginTime(world().gameBeginTime(), marketCreationTime, priceUpdateTime);
        uint256 priceDecayEndTime = _getPriceDecayEndTime(timestamp, world().gameEndTime());

        uint256 newSettlementStartingPrice = 0;
        if (priceUpdateTime == 0) {
            uint256 regionTier = world().geography().getRegionTier(regionId);
            newSettlementStartingPrice = registry().getNewSettlementStartingPrice() * (registry().getSettlementPriceMultiplierPerIncreasedRegionTier() ** (regionTier - 1));
        } else {
            newSettlementStartingPrice = crossErasMemory.regionSettlementPrice(regionId);
        }

        if (priceDecayBeginTime >= priceDecayEndTime) {
            return newSettlementStartingPrice;
        }

        uint256 secondsPassed = priceDecayEndTime - priceDecayBeginTime;
        uint256 hoursPassed = secondsPassed / 3600;

        // 10/100 = 0.1 price drop per hour
        // 11/10 = 1.1 price drop slowdown per settlement
        int128 hourPriceDrop64 = ABDKMath64x64.sub(
            ABDKMath64x64.fromUInt(1),
            ABDKMath64x64.div(
                ABDKMath64x64.divu(10, 100),
                ABDKMath64x64.pow(ABDKMath64x64.divu(11, 10), userSettlementsCount)
            )
        );

        int128 closestHourPriceDrop64 = ABDKMath64x64.pow(hourPriceDrop64, hoursPassed);
        int128 nextHourPriceDrop64 = ABDKMath64x64.pow(hourPriceDrop64, hoursPassed + 1);
        int128 currentHourPercentPassed = ABDKMath64x64.divu(secondsPassed % 3600, 3600);

        int128 priceDrop64 = ABDKMath64x64.sub(
            closestHourPriceDrop64,
            ABDKMath64x64.mul(ABDKMath64x64.sub(closestHourPriceDrop64, nextHourPriceDrop64), currentHourPercentPassed)
        );

        return uint256(ABDKMath64x64.muli(priceDrop64, int256(newSettlementStartingPrice)));
    }

    /// @dev Calculates price decay begin time based on provided params
    function _getPriceDecayBeginTime(
        uint256 gameBeginTime,
        uint256 marketCreationTime,
        uint256 priceUpdateTime
    ) internal pure returns (uint256) {
        if (priceUpdateTime == 0) {
            return Math.max(marketCreationTime, gameBeginTime);
        } else {
            return Math.max(gameBeginTime, priceUpdateTime);
        }
    }

    /// @dev Calculates price decay end time based on provided params
    function _getPriceDecayEndTime(
        uint256 timestamp,
        uint256 gameEndTime
    ) internal pure returns (uint256) {
        if (gameEndTime != 0) {
            return Math.min(timestamp, gameEndTime);
        }

        return timestamp;
    }

    /// @dev Calculates current game time, taking into an account game end time
    function _getCurrentTime() internal view returns (uint256) {
        uint256 gameBeginTime = world().gameBeginTime();
        uint256 gameEndTime = world().gameEndTime();
        uint256 timestamp = block.timestamp;

        if (timestamp < gameBeginTime) {
            timestamp = gameBeginTime;
        }

        if (gameEndTime == 0) {
            return timestamp;
        }

        return Math.min(timestamp, gameEndTime);
    }
}
