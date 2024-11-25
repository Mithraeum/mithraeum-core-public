// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "../../../libraries/MathExtension.sol";
import "../unitsPool/IUnitsPool.sol";
import "../building/impl/IFort.sol";
import "../WorldAsset.sol";
import "../../../libraries/ABDKMath64x64.sol";
import "../../../const/GameAssetTypes.sol";

contract IngotsUnitsPool is WorldAsset, IUnitsPool {
    /// @inheritdoc IUnitsPool
    IRegion public override relatedRegion;
    /// @inheritdoc IUnitsPool
    uint256 public override lastPurchaseTime;
    /// @inheritdoc IUnitsPool
    bytes32 public override unitTypeId;
    /// @inheritdoc IUnitsPool
    uint256 public override unitPrice;

    /// @dev Only related region modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyRelatedRegion() {
        _onlyRelatedRegion();
        _;
    }

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {
        (
            address _regionAddress,
            bytes32 _unitTypeId
        ) = abi.decode(initParams, (address, bytes32));

        relatedRegion = IRegion(_regionAddress);
        unitTypeId = _unitTypeId;
        lastPurchaseTime = block.timestamp;
        unitPrice = Config.getUnitStartingPrice(_unitTypeId);
    }

    /// @inheritdoc IUnitsPool
    function calculateTokensForExactUnits(uint256 unitsToBuy) public view override returns (uint256, uint256) {
        (uint256 numerator, uint256 denominator) = Config.getUnitPriceIncreaseByUnitTypeId(unitTypeId);
        int128 priceIncreasePerUnit64 = ABDKMath64x64.divu(numerator, denominator);
        return _calculatePriceShiftForUnits(unitsToBuy, priceIncreasePerUnit64);
    }

    /// @inheritdoc IUnitsPool
    function swapTokensForExactUnits(
        address tokensOwner,
        address settlementAddress,
        uint256 unitsToBuy,
        uint256 maxTokensToSell
    ) public override onlyActiveGame returns (uint256) {
        return _swapIngotsForExactUnits(tokensOwner, msg.sender, settlementAddress, unitsToBuy, maxTokensToSell);
    }

    /// @inheritdoc IUnitsPool
    function swapTokensForExactUnitsByRegion(
        address tokensOwner,
        address msgSender,
        address settlementAddress,
        uint256 unitsToBuy,
        uint256 maxTokensToSell
    ) public override onlyActiveGame onlyRelatedRegion returns (uint256) {
        return _swapIngotsForExactUnits(tokensOwner, msgSender, settlementAddress, unitsToBuy, maxTokensToSell);
    }

    /// @dev Allows caller to be only related region
    function _onlyRelatedRegion() internal view {
        if (msg.sender != address(relatedRegion)) revert OnlyRelatedRegion();
    }

    /// @dev Calculates dropped price of unit after last purchase time
    function _getUnitDroppedPrice() internal view returns (int128) {
        IWorld _world = world();

        uint256 timestamp = block.timestamp;
        uint256 gameBeginTime = _world.gameBeginTime();
        if (timestamp < gameBeginTime) {
            timestamp = gameBeginTime;
        }

        uint256 gameEndTime = _world.gameEndTime();
        if (gameEndTime != 0) {
            timestamp = Math.min(timestamp, gameEndTime);
        }

        uint256 _lastPurchaseTime = lastPurchaseTime;
        if (_lastPurchaseTime < gameBeginTime) {
            _lastPurchaseTime = gameBeginTime;
        }

        int128 unitPrice64 = ABDKMath64x64.divu(unitPrice, 1e18);

        if (_lastPurchaseTime >= timestamp) {
            return unitPrice64;
        }

        uint256 secondsPassed = timestamp - _lastPurchaseTime;

        (uint256 numerator, uint256 denominator) = Config.getUnitPriceDropByUnitTypeId(unitTypeId);
        int128 priceDropPerSecond64 = ABDKMath64x64.divu(numerator, denominator);
        int128 priceDrop64 = ABDKMath64x64.pow(priceDropPerSecond64, secondsPassed);
        return ABDKMath64x64.mul(unitPrice64, priceDrop64);
    }

    /// @dev Calculates amount of ingots and new unit price according to amount of units and price shift per unit interaction with the pool
    function _calculatePriceShiftForUnits(
        uint256 amountOfUnits,
        int128 priceShiftPerUnit64
    ) internal view returns (uint256, uint256) {
        int128 droppedPrice = _getUnitDroppedPrice();

        int128 ingotsForAmountOfUnits64 = ABDKMath64x64.mul(
            ABDKMath64x64.divu(amountOfUnits, 2),
            ABDKMath64x64.add(
                ABDKMath64x64.mul(droppedPrice, ABDKMath64x64.fromUInt(2)),
                ABDKMath64x64.mul(priceShiftPerUnit64, ABDKMath64x64.fromUInt(amountOfUnits - 1))
            )
        );

        int128 newUnitPrice64 = ABDKMath64x64.add(
            droppedPrice,
            ABDKMath64x64.mul(priceShiftPerUnit64, ABDKMath64x64.fromUInt(amountOfUnits - 1))
        );

        uint256 ingotsForPriceShift = uint256(ABDKMath64x64.muli(ingotsForAmountOfUnits64, 1e18));
        uint256 newUnitPrice = uint256(ABDKMath64x64.muli(newUnitPrice64, 1e18));

        return (ingotsForPriceShift, newUnitPrice);
    }

    /// @dev Core logic related to swapping ingots for exact units
    function _swapIngotsForExactUnits(
        address resourcesOwner,
        address msgSender,
        address settlementAddress,
        uint256 unitsToBuy,
        uint256 maxIngotsToSell
    ) internal returns (uint256) {
        ISettlement settlement = ISettlement(settlementAddress);
        IArmy army = settlement.army();

        settlement.updateFortHealth();
        army.updateState();

        if (army.isManeuvering()) revert CannotHireUnitsWhileArmyIsManeuvering();
        if (!army.isAtHomePosition()) revert CannotHireUnitsWhileArmyIsNotOnHomePosition();
        if (unitsToBuy == 0 || !MathExtension.isIntegerWithPrecision(unitsToBuy, 1e18)) revert CannotHireUnitsInvalidUnitsToBuySpecified();
        if (address(settlement.relatedRegion()) != address(relatedRegion)) revert CannotHireUnitsForArmyWhichSettlementDoesNotBelongToRelatedRegion();
        if (unitsToBuy > _getMaxAllowedToBuy(settlement, army)) revert CannotHireUnitsExceedingArmyUnitsLimit();
        if (unitsToBuy > Config.maxAllowedUnitsToBuyPerTransaction) revert CannotHireUnitsExceedingTransactionLimit();

        (uint256 ingotsToSell, uint256 newUnitPrice) = calculateTokensForExactUnits(unitsToBuy / 1e18);

        if (ingotsToSell > maxIngotsToSell) revert CannotHireUnitsDueToTheirCostIsHigherThanMaxTokensToSellSpecified();

        (, uint64 stunEndTime) = army.stunInfo();
        if (stunEndTime != 0) revert CannotHireUnitsWhileArmyIsStunned();

        IEra _era = era();
        IResource ingots = _era.resources(INGOT_TYPE_ID);
        if (resourcesOwner == address(0)) {
            ingots.burnFrom(msgSender, ingotsToSell);
        } else {
            ingots.spendAllowance(resourcesOwner, msgSender, ingotsToSell);
            ingots.burnFrom(resourcesOwner, ingotsToSell);
        }

        relatedRegion.decreaseCorruptionIndex(
            settlementAddress,
            Config.getCorruptionIndexByResource(INGOT_TYPE_ID) * ingotsToSell / 1e18
        );

        _era.units(unitTypeId).mint(address(army), unitsToBuy);

        unitPrice = newUnitPrice;
        lastPurchaseTime = block.timestamp;

        emit UnitsBought(
            msgSender,
            address(army),
            unitsToBuy,
            ingotsToSell,
            newUnitPrice
        );

        return unitsToBuy;
    }

    /// @dev Returns fort health and its level coefficient
    function _getFortHealthAndLevelCoefficient(ISettlement settlement) internal view returns (uint256, uint256) {
        IFort fort = IFort(address(settlement.buildings(FORT_TYPE_ID)));
        return (fort.health(), fort.getBuildingCoefficient(fort.getBuildingLevel()));
    }

    /// @dev Calculates army total units
    function _getArmyTotalUnits(IArmy army) internal view returns (uint256) {
        bytes32[] memory unitTypeIds = Config.getUnitTypeIds();
        IEra _era = era();

        uint256 totalUnits = 0;
        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            totalUnits += _era.units(unitTypeIds[i]).balanceOf(address(army));
        }

        return totalUnits;
    }

    /// @dev Calculates maximum allowed extra units that can be bought and placed into army given its total units count and fort health
    function _getMaxAllowedToBuy(ISettlement settlement, IArmy army) internal view returns (uint256) {
        (uint256 health, uint256 fortLevelCoefficient) = _getFortHealthAndLevelCoefficient(settlement);
        uint256 currentUnits = _getArmyTotalUnits(army);

        uint256 maxAllowedUnits = MathExtension.roundDownWithPrecision(
            (health * Config.unitHiringFortHpMultiplier / 1e18) / fortLevelCoefficient,
            1e18
        );

        if (currentUnits >= maxAllowedUnits) {
            return 0;
        }

        return maxAllowedUnits - currentUnits;
    }
}
