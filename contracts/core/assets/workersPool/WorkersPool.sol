// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "../../../libraries/MathExtension.sol";
import "./IWorkersPool.sol";
import "../settlement/ISettlement.sol";
import "../../IRegistry.sol";
import "../../IWorld.sol";
import "../region/IRegion.sol";
import "../WorldAsset.sol";
import "../../../libraries/ABDKMath64x64.sol";

contract WorkersPool is WorldAsset, IWorkersPool {
    /// @inheritdoc IWorkersPool
    IRegion public override relatedRegion;
    /// @inheritdoc IWorkersPool
    uint256 public override lastPurchaseTime;
    /// @inheritdoc IWorkersPool
    uint256 public override workerPrice;

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {
        (
            address regionAddress
        ) = abi.decode(initParams, (address));

        relatedRegion = IRegion(regionAddress);
        lastPurchaseTime = block.timestamp;
        workerPrice = 10e18;
    }

    /// @inheritdoc IWorkersPool
    function calculateProsperityForExactWorkers(uint256 unitsToBuy) public view override returns (uint256, uint256) {
        (uint256 numerator, uint256 denominator) = registry().getWorkerPriceIncreaseForEachWorker();
        int128 priceIncreasePerWorker64 = ABDKMath64x64.divu(numerator, denominator);
        return _calculatePriceShiftForUnits(unitsToBuy, priceIncreasePerWorker64);
    }

    /// @inheritdoc IWorkersPool
    function swapProsperityForExactWorkers(
        address settlementAddress,
        uint256 workersToBuy,
        uint256 maxProsperityToSell
    )
        public
        override
        onlyWorldAssetFromSameEra
        returns (uint256)
    {
        if (workersToBuy == 0 || !MathExtension.isIntegerWithPrecision(workersToBuy, 1e18)) revert CannotHireWorkersInvalidWorkersToBuySpecified();

        ISettlement(settlementAddress).updateProsperityAmount();

        if (workersToBuy > registry().getMaxAllowedWorkersToBuyPerTransaction()) revert CannotHireWorkersExceedingTransactionLimit();

        (uint256 prosperityToSell, uint256 newWorkerPrice) = calculateProsperityForExactWorkers(workersToBuy / 1e18);

        if (prosperityToSell > maxProsperityToSell) revert CannotHireWorkersDueToTheirCostIsHigherThanMaxProsperityToSellSpecified();

        IProsperity prosperity = era().prosperity();
        IWorkers workers = era().workers();

        if (prosperity.balanceOf(settlementAddress) < prosperityToSell) revert CannotHireWorkersDueToNotEnoughProsperityInSettlement();

        prosperity.spend(settlementAddress, prosperityToSell);
        workers.mint(settlementAddress, workersToBuy);

        workerPrice = newWorkerPrice;
        lastPurchaseTime = block.timestamp;

        emit WorkersBought(
            settlementAddress,
            workersToBuy,
            prosperityToSell
        );

        return workersToBuy;
    }

    /// @dev Calculates dropped worker price after last purchase time
    function _getDroppedWorkerPrice() internal view returns (int128) {
        uint256 timestamp = block.timestamp;
        uint256 gameBeginTime = world().gameBeginTime();
        if (timestamp < gameBeginTime) {
            timestamp = gameBeginTime;
        }

        uint256 gameEndTime = world().gameEndTime();
        if (gameEndTime != 0) {
            timestamp = Math.min(timestamp, gameEndTime);
        }

        uint256 _lastPurchaseTime = lastPurchaseTime;
        if (_lastPurchaseTime < gameBeginTime) {
            _lastPurchaseTime = gameBeginTime;
        }

        int128 workerPrice64 = ABDKMath64x64.divu(workerPrice, 1e18);

        if (_lastPurchaseTime >= timestamp) {
            return workerPrice64;
        }

        uint256 secondsPassed = timestamp - _lastPurchaseTime;

        (uint256 numerator, uint256 denominator) = registry().getWorkerPriceDrop();
        int128 priceDropPerSecond64 = ABDKMath64x64.divu(numerator, denominator);
        int128 priceDrop64 = ABDKMath64x64.pow(priceDropPerSecond64, secondsPassed);
        return ABDKMath64x64.mul(workerPrice64, priceDrop64);
    }

    /// @dev Calculates amount of prosperity and new worker price according to amount of workers and price shift per worker interaction with the pool
    function _calculatePriceShiftForUnits(
        uint256 amountOfWorkers,
        int128 priceShiftPerWorker64
    ) internal view returns (uint256, uint256) {
        int128 droppedPrice = _getDroppedWorkerPrice();
        int128 lastWorkerPriceShift64 = ABDKMath64x64.pow(
            priceShiftPerWorker64,
            amountOfWorkers
        );

        int128 sumOfPriceShifts64 = ABDKMath64x64.div(
            ABDKMath64x64.sub(
                lastWorkerPriceShift64,
                ABDKMath64x64.fromUInt(1)
            ),
            ABDKMath64x64.ln(priceShiftPerWorker64)
        );

        int128 prosperityForPriceShift64 = ABDKMath64x64.mul(droppedPrice, sumOfPriceShifts64);
        int128 newWorkerPrice64 = ABDKMath64x64.mul(droppedPrice, lastWorkerPriceShift64);

        uint256 prosperityForPriceShift = uint256(ABDKMath64x64.muli(prosperityForPriceShift64, 1e18));
        uint256 newWorkerPrice = uint256(ABDKMath64x64.muli(newWorkerPrice64, 1e18));

        return (prosperityForPriceShift, newWorkerPrice);
    }
}
