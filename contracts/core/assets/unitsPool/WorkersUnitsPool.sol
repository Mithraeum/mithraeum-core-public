// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "../../../libraries/MathExtension.sol";
import "../unitsPool/IUnitsPool.sol";
import "../building/impl/IFort.sol";
import "../WorldAsset.sol";
import "../../../libraries/ABDKMath64x64.sol";
import "../../../const/GameAssetTypes.sol";

contract WorkersUnitsPool is WorldAsset, IUnitsPool {
    /// @inheritdoc IUnitsPool
    IRegion public override relatedRegion;
    /// @inheritdoc IUnitsPool
    uint256 public override lastPurchaseTime;
    /// @inheritdoc IUnitsPool
    bytes32 public override unitTypeId;
    /// @inheritdoc IUnitsPool
    uint256 public override unitPrice;

    /// @dev Only region modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyRelatedRegion() {
        _onlyRelatedRegion();
        _;
    }

    /// @dev Only ruler or world asset modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyRulerOrWorldAsset(address msgSender, address settlementAddress) {
        _onlyRulerOrWorldAsset(msgSender, settlementAddress);
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
        unitPrice = 1e18;
    }

    /// @inheritdoc IUnitsPool
    function calculateTokensForExactUnits(uint256 unitsToBuy) public view override returns (uint256, uint256) {
        return (unitsToBuy * unitPrice, unitPrice);
    }

    /// @inheritdoc IUnitsPool
    function swapTokensForExactUnits(
        address tokensOwner,
        address settlementAddress,
        uint256 unitsToBuy,
        uint256 maxTokensToSell
    ) public override onlyActiveGame onlyRulerOrWorldAsset(msg.sender, settlementAddress) returns (uint256) {
        return _swapWorkersForExactUnits(tokensOwner, msg.sender, settlementAddress, unitsToBuy, maxTokensToSell);
    }

    /// @inheritdoc IUnitsPool
    function swapTokensForExactUnitsByRegion(
        address tokensOwner,
        address msgSender,
        address settlementAddress,
        uint256 unitsToBuy,
        uint256 maxTokensToSell
    ) public override onlyActiveGame onlyRelatedRegion onlyRulerOrWorldAsset(msgSender, settlementAddress) returns (uint256) {
        return _swapWorkersForExactUnits(tokensOwner, msgSender, settlementAddress, unitsToBuy, maxTokensToSell);
    }

    /// @dev Allows caller to be only region
    function _onlyRelatedRegion() internal view {
        if (msg.sender != address(relatedRegion)) revert OnlyRelatedRegion();
    }

    /// @dev Allows caller to be settlement ruler or world asset
    function _onlyRulerOrWorldAsset(address msgSender, address settlementAddress) internal view {
        if (!ISettlement(settlementAddress).isRuler(msgSender) && world().worldAssets(eraNumber(), msgSender) == bytes32(0)) revert OnlyRulerOrWorldAsset();
    }

    /// @dev Core logic related to swapping ingots for exact units
    function _swapWorkersForExactUnits(
        address resourcesOwner,
        address msgSender,
        address settlementAddress,
        uint256 unitsToBuy,
        uint256 maxWorkersToSell
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

        (uint256 workersToSell, uint256 newUnitPrice) = calculateTokensForExactUnits(unitsToBuy / 1e18);

        if (workersToSell > maxWorkersToSell) revert CannotHireUnitsDueToTheirCostIsHigherThanMaxTokensToSellSpecified();

        (, uint64 stunEndTime) = army.stunInfo();
        if (stunEndTime != 0) revert CannotHireUnitsWhileArmyIsStunned();

        IEra _era = era();

        _era.workers().burnFrom(settlementAddress, workersToSell);
        _era.units(unitTypeId).mint(address(army), unitsToBuy);

        unitPrice = newUnitPrice;
        lastPurchaseTime = block.timestamp;

        emit UnitsBought(
            msgSender,
            address(army),
            unitsToBuy,
            workersToSell,
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
