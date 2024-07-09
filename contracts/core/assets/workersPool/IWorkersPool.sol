// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../region/IRegion.sol";
import "../tokens/workers/IWorkers.sol";
import "../tokens/prosperity/IProsperity.sol";

/// @title Region workers pool interface
/// @notice Functions to read state/modify state in order to mint workers/swap prosperity for workers
interface IWorkersPool {

    // State variables

    /// @notice Region to which this pool belongs
    /// @dev Immutable, initialized on the region creation
    function relatedRegion() external view returns (IRegion);

    /// @notice Time at which last purchase is performed
    /// @dev Updated every time when #swapProsperityForExactWorkers is called
    function lastPurchaseTime() external view returns (uint256);

    /// @notice Worker price
    /// @dev Updated every time when #swapProsperityForExactWorkers is called
    function workerPrice() external view returns (uint256);

    // Events

    /// @notice Emitted when #swapProsperityForExactWorkers is called
    /// @param buyerSettlementAddress Address of the settlement which bought workers
    /// @param boughtWorkersAmount Amount of workers bought
    /// @param spentProsperityAmount Amount of prosperity spent
    event WorkersBought(
        address buyerSettlementAddress,
        uint256 boughtWorkersAmount,
        uint256 spentProsperityAmount
    );

    // Errors

    /// @notice Thrown when attempting to hire workers with invalid workers to buy specified
    error CannotHireWorkersInvalidWorkersToBuySpecified();

    /// @notice Thrown when attempting to hire worker due to their cost is being higher than max prosperity to sell specified
    error CannotHireWorkersDueToTheirCostIsHigherThanMaxProsperityToSellSpecified();

    /// @notice Thrown when attempting to hire workers due to not having enough prosperity in settlement for the purchase
    error CannotHireWorkersDueToNotEnoughProsperityInSettlement();

    /// @notice Thrown when attempting to hire more workers than transaction limit
    error CannotHireWorkersExceedingTransactionLimit();

    // Functions

    /// @notice Swaps prosperity for exact workers
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param settlementAddress Settlement address
    /// @param workersToBuy Exact amount of workers
    /// @param maxProsperityToSell Maximum amount of prosperity to be taken for exact amount of workers
    /// @return workersCount Amount of workers bought by prosperity
    function swapProsperityForExactWorkers(
        address settlementAddress,
        uint256 workersToBuy,
        uint256 maxProsperityToSell
    ) external returns (uint256 workersCount);

    /// @notice Calculates input of prosperity based on output whole amount of workers
    /// @dev Returns valid output only for integer workersToBuy value (in 1e0 precision)
    /// @param workersToBuy Amount of workers to buy
    /// @return prosperityToSell Amount of prosperity needed for workersToBuy
    /// @return newWorkerPrice New worker price
    function calculateProsperityForExactWorkers(uint256 workersToBuy) external returns (uint256 prosperityToSell, uint256 newWorkerPrice);
}
