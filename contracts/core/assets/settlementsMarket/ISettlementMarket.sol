// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../region/IRegion.sol";

/// @title Region settlements market interface
/// @notice Functions to read state/modify state in order to buy settlement
interface ISettlementsMarket {

    // State variables

    /// @notice Region to which this market belongs
    /// @dev Immutable, initialized on the market creation
    function relatedRegion() external view returns (IRegion);

    /// @notice Time at which market was created
    /// @dev Immutable, initialized on the market creation
    function marketCreationTime() external view returns (uint256);

    // Events

    /// @notice Emitted when #buySettlement is called
    /// @param settlementAddress Settlement address
    /// @param settlementCost Settlement cost
    event SettlementBought(address settlementAddress, uint256 settlementCost);

    // Errors

    /// @notice Thrown when attempting to buy settlement for free by mighty creator after game began
    error SettlementCannotBeBoughtForFreeAfterGameBegan();

    /// @notice Thrown when attempting to buy settlement for specified banner nft id and not owning it
    error SettlementCannotBeBoughtForNotOwnerBannerNft();

    /// @notice Thrown when attempting to buy settlement on non existent position
    error SettlementCannotBeBoughtOnNonExistentPosition();

    /// @notice Thrown when attempting to buy settlement on position which is not related to this settlement market
    error SettlementCannotBeBoughtOnPositionWhichIsNotRelatedToThisSettlementMarket();

    /// @notice Thrown when attempting to buy settlement due to new settlement cost is higher than max tokens to use specified
    error SettlementCannotBeBoughtDueToCostIsHigherThanMaxTokensToUseSpecified();

    /// @notice Thrown when attempting to buy settlement due to insufficient value sent (only if world.erc20ForSettlementPurchase == address(0), which is equivalent of native token)
    error SettlementCannotBeBoughtDueInsufficientValueSent();

    // Functions

    /// @notice Updates settlement market state to the current block
    /// @dev Called on every action which are based on settlement market state
    function updateState() external;

    /// @notice Buys settlement in region
    /// @dev Even though function is opened, it can only be called by mighty creator and only before game begin time
    /// @param position Position
    /// @param bannerId MithraeumBanners token id which will represent to which settlement will be attached to
    function buySettlementForFreeByMightyCreator(
        uint64 position,
        uint256 bannerId
    ) external;

    /// @notice Buys settlement in region
    /// @dev Tokens will be deducted from msg.sender
    /// @param position Position
    /// @param bannerId MithraeumBanners token id which will represent to which settlement will be attached to
    /// @param maxTokensToUse Maximum amount of tokens to be withdrawn for settlement
    function buySettlement(
        uint64 position,
        uint256 bannerId,
        uint256 maxTokensToUse
    ) external payable;

    /// @notice Returns amount of tokens new settlement will cost
    /// @dev Calculates cost of placing new settlement in tokens
    /// @param timestamp Time at which calculate new settlement cost. If timestamp=0 -> calculates as block.timestamp
    /// @return cost Amount of tokens new settlement will cost
    function getNewSettlementCost(uint256 timestamp) external view returns (uint256 cost);
}
