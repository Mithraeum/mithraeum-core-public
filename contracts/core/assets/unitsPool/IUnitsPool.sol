// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../tokens/units/IUnits.sol";
import "../region/IRegion.sol";

/// @title Region units pool interface
/// @notice Functions to read state/modify state in order to mint units/swap tokens for units
interface IUnitsPool {

    // State variables

    /// @notice Region to which this pool belongs
    /// @dev Immutable, initialized on the region creation
    function relatedRegion() external view returns (IRegion);

    /// @notice Unit type id
    /// @dev Immutable, initialized on the region creation
    function unitTypeId() external view returns (bytes32);

    /// @notice Time at which last purchase is performed
    /// @dev Updated every time when #swapTokensForExactUnits or #swapTokensForExactUnitsByRegion is called
    function lastPurchaseTime() external view returns (uint256);

    /// @notice Unit price
    /// @dev Updated every time when #swapTokensForExactUnits or #swapTokensForExactUnitsByRegion is called
    function unitPrice() external view returns (uint256);

    // Events

    /// @notice Emitted when #swapTokensForExactUnits or #swapTokensForExactUnitsByRegion is called
    /// @param spender The address which payed tokens
    /// @param armyAddress The address of the army which received units
    /// @param boughtUnitsAmount Amount of units bought
    /// @param spentTokensAmount Spent tokens amount
    event UnitsBought(
        address spender,
        address armyAddress,
        uint256 boughtUnitsAmount,
        uint256 spentTokensAmount,
        uint256 newUnitPrice
    );

    // Errors

    /// @notice Thrown when attempting to call action which can only be called by related region
    error OnlyRelatedRegion();

    /// @notice Thrown when attempting to call action which can only be called by ruler or world asset
    error OnlyRulerOrWorldAsset();

    /// @notice Thrown when attempting to hire units while army is maneuvering
    error CannotHireUnitsWhileArmyIsManeuvering();

    /// @notice Thrown when attempting to hire units while army is stunned
    error CannotHireUnitsWhileArmyIsStunned();

    /// @notice Thrown when attempting to hire units while army is not on home position
    error CannotHireUnitsWhileArmyIsNotOnHomePosition();

    /// @notice Thrown when attempting to hire units with invalid units to buy specified
    error CannotHireUnitsInvalidUnitsToBuySpecified();

    /// @notice Thrown when attempting to hire units in wrong units pool
    error CannotHireUnitsForArmyWhichSettlementDoesNotBelongToRelatedRegion();

    /// @notice Thrown when attempting to hire more units than army limit allows
    error CannotHireUnitsExceedingArmyUnitsLimit();

    /// @notice Thrown when attempting to hire more units than transaction limit
    error CannotHireUnitsExceedingTransactionLimit();

    /// @notice Thrown when attempting to hire units due to their cost is being higher than max tokens to sell specified
    error CannotHireUnitsDueToTheirCostIsHigherThanMaxTokensToSellSpecified();

    // Functions

    /// @notice Swaps tokens for units
    /// @dev If tokensOwner == address(0) -> tokens will be taken from msg.sender
    /// @dev If tokensOwner != address(0) and tokensOwner has given allowance to msg.sender >= amount of tokens for units -> tokens will be taken from tokensOwner
    /// @param tokensOwner Tokens owner
    /// @param settlementAddress Settlement address, army of which, will receive units
    /// @param unitsToBuy Exact amount of units
    /// @param maxTokensToSell Maximum amount of tokens to be taken for exact amount of units
    /// @return unitsAmount Amount of units bought by tokens
    function swapTokensForExactUnits(
        address tokensOwner,
        address settlementAddress,
        uint256 unitsToBuy,
        uint256 maxTokensToSell
    ) external returns (uint256 unitsAmount);

    /// @notice Swaps tokens for units by region
    /// @dev Even though function is opened it can be called only by region
    /// @dev If tokensOwner == address(0) -> tokens will be taken from msg.sender
    /// @dev If tokensOwner != address(0) and tokensOwner has given allowance to msg.sender >= amount of tokens for units -> tokens will be taken from tokensOwner
    /// @param tokensOwner Tokens owner
    /// @param msgSender msg.sender from region call
    /// @param settlementAddress Settlement address, army of which, will receive units
    /// @param unitsToBuy Exact amount of units
    /// @param maxTokensToSell Maximum amount of tokens to be taken for exact amount of units
    /// @return unitsAmount Amount of units bought by tokens
    function swapTokensForExactUnitsByRegion(
        address tokensOwner,
        address msgSender,
        address settlementAddress,
        uint256 unitsToBuy,
        uint256 maxTokensToSell
    ) external returns (uint256 unitsAmount);

    /// @notice Calculates input of tokens based on output whole amount of units
    /// @dev Returns valid output only for integer unitsToBuy value (in 1e0 precision)
    /// @param unitsToBuy Amount of units to buy
    /// @return tokensToSell Amount of tokens needed for unitsToBuy
    /// @return newUnitPrice New unit price
    function calculateTokensForExactUnits(uint256 unitsToBuy) external view returns (uint256 tokensToSell, uint256 newUnitPrice);
}
