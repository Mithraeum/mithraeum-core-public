// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "./ISiege.sol";
import "../battle/IBattle.sol";
import "../building/IBuilding.sol";
import "../../../libraries/MathExtension.sol";
import "../WorldAsset.sol";
import "../building/impl/IFort.sol";
import "../../../const/GameAssetTypes.sol";

contract Siege is WorldAsset, ISiege {
    /// @inheritdoc ISiege
    ISettlement public override relatedSettlement;
    /// @inheritdoc ISiege
    mapping(address => ArmyInfo) public override armyInfo;
    /// @inheritdoc ISiege
    mapping(address => mapping(bytes32 => uint256)) public override besiegingArmyUnitsByType;
    /// @inheritdoc ISiege
    uint256 public override robberyPointsPerOneDamage;
    /// @inheritdoc ISiege
    uint256 public override totalSiegePower;

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {
        (address settlementAddress) = abi.decode(initParams, (address));

        relatedSettlement = ISettlement(settlementAddress);
    }

    /// @inheritdoc ISiege
    function canLiquidateArmyBesiegingUnits(address armyAddress) public view override returns (bool) {
        uint256 armyUnitsSiegePower = calculateArmyUnitsSiegePower(armyAddress);
        return (IArmy(armyAddress).getTotalSiegeSupport() < armyUnitsSiegePower);
    }

    /// @inheritdoc ISiege
    function liquidate(address armyAddress) public override onlyActiveGame {
        relatedSettlement.updateFortHealth();

        IArmy army = IArmy(armyAddress);
        army.updateState();

        if (!canLiquidateArmyBesiegingUnits(armyAddress)) revert SiegeCannotLiquidateArmy();

        bytes32[] memory unitTypeIds = Config.getUnitTypeIds();
        bool[] memory toAddIndication = new bool[](unitTypeIds.length);
        uint256[] memory unitsToLiquidate = new uint256[](unitTypeIds.length);

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            toAddIndication[i] = false;
            unitsToLiquidate[i] = besiegingArmyUnitsByType[armyAddress][unitTypeIds[i]];
        }

        this.modifyArmySiege(
            armyAddress,
            unitTypeIds,
            toAddIndication,
            unitsToLiquidate,
            0
        );

        army.liquidateUnits(unitTypeIds, unitsToLiquidate);

        emit ArmyLiquidated(armyAddress);
    }

    /// @inheritdoc ISiege
    function modifyArmySiege(
        address armyAddress,
        bytes32[] calldata unitTypeIds,
        bool[] calldata toAddIndication,
        uint256[] calldata unitsAmounts,
        uint256 newRobberyMultiplier
    ) public override onlyWorldAssetFromSameEra {
        _updateArmySiegeProgress(armyAddress);

        uint256 oldArmyTotalSiegePower = calculateArmyTotalSiegePower(armyAddress);
        IEra _era = era();

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            uint256 unitsAmount = unitsAmounts[i];
            if (unitsAmount == 0) {
                continue;
            }

            if (!MathExtension.isIntegerWithPrecision(unitsAmount, 1e18)) revert SiegeCannotBeModifiedDueToInvalidUnitsAmountSpecified();

            if (toAddIndication[i]) {
                besiegingArmyUnitsByType[armyAddress][unitTypeIds[i]] += unitsAmount;
                _era.units(unitTypeIds[i]).transferFrom(armyAddress, address(this), unitsAmount);
            } else {
                besiegingArmyUnitsByType[armyAddress][unitTypeIds[i]] -= unitsAmount;
                _era.units(unitTypeIds[i]).transferFrom(address(this), armyAddress, unitsAmount);
            }
        }

        ArmyInfo storage currentArmyInfo = armyInfo[armyAddress];
        currentArmyInfo.robberyMultiplier = newRobberyMultiplier;

        uint256 armyUnitsSiegePower = calculateArmyUnitsSiegePower(armyAddress);
        uint256 newArmyTotalSiegePower = _calculateArmyTotalSiegePower(armyUnitsSiegePower, newRobberyMultiplier);

        currentArmyInfo.pointsDebt = newArmyTotalSiegePower * robberyPointsPerOneDamage;

        if (newArmyTotalSiegePower == 0) {
            currentArmyInfo.robberyMultiplier = 0;
        }

        if (oldArmyTotalSiegePower != newArmyTotalSiegePower) {
            totalSiegePower = totalSiegePower + newArmyTotalSiegePower - oldArmyTotalSiegePower;

            // In case if last army leaves the siege, reset 'robberyPointsPerOneDamage'
            if (totalSiegePower == 0) {
                robberyPointsPerOneDamage = 0;
            }
        }

        emit ArmySiegeModified(
            armyAddress,
            unitTypeIds,
            toAddIndication,
            unitsAmounts,
            newRobberyMultiplier,
            totalSiegePower
        );
    }

    /// @inheritdoc ISiege
    function calculateArmyUnitsSiegePower(address armyAddress) public view override returns (uint256) {
        bytes32[] memory unitTypeIds = Config.getUnitTypeIds();

        uint256 armyUnitsSiegePower = 0;

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            bytes32 unitTypeId = unitTypeIds[i];
            uint256 besiegingUnitsAmount = besiegingArmyUnitsByType[armyAddress][unitTypeId];
            if (besiegingUnitsAmount == 0) {
                continue;
            }

            Config.UnitStats memory unitStats = Config.getUnitStats(unitTypeId);

            armyUnitsSiegePower += (besiegingUnitsAmount * unitStats.siegePower) / 1e18;
        }

        return armyUnitsSiegePower;
    }

    /// @inheritdoc ISiege
    function calculateArmyTotalSiegePower(address armyAddress) public view override returns (uint256) {
        uint256 armyUnitsSiegePower = calculateArmyUnitsSiegePower(armyAddress);

        return _calculateArmyTotalSiegePower(
            armyUnitsSiegePower,
            armyInfo[armyAddress].robberyMultiplier
        );
    }

    /// @inheritdoc ISiege
    function applyDamage(uint256 damage) public override onlyWorldAssetFromSameEra {
        uint256 additionalRobberyPointsPerOneDamageByDamage = _calculateAdditionalRobberyPointsPerOneDamage(damage, totalSiegePower);

        if (additionalRobberyPointsPerOneDamageByDamage == 0) {
            return;
        }

        robberyPointsPerOneDamage += additionalRobberyPointsPerOneDamageByDamage;
    }

    /// @inheritdoc ISiege
    function getArmyRobberyPoints(
        address armyAddress,
        uint256 timestamp
    ) public view override returns (uint256) {
        IFort fort = IFort(address(relatedSettlement.buildings(FORT_TYPE_ID)));
        uint256 damageDone = fort.calculateDamageDone(timestamp);

        uint256 siegePower = totalSiegePower;
        if (siegePower == 0) {
            return 0;
        }

        ArmyInfo storage currentArmyInfo = armyInfo[armyAddress];
        uint256 armyUnitsSiegePower = calculateArmyUnitsSiegePower(armyAddress);
        uint256 armyTotalSiegePower = _calculateArmyTotalSiegePower(armyUnitsSiegePower, currentArmyInfo.robberyMultiplier);

        uint256 additionalRobberyPointsPerOneDamageByDamage = _calculateAdditionalRobberyPointsPerOneDamage(damageDone, siegePower);
        uint256 newRobberyPointsPerOneDamage = robberyPointsPerOneDamage + additionalRobberyPointsPerOneDamageByDamage;
        uint256 pendingPoints = armyTotalSiegePower * newRobberyPointsPerOneDamage - currentArmyInfo.pointsDebt;

        return currentArmyInfo.points + pendingPoints;
    }

    /// @inheritdoc ISiege
    function swapRobberyPointsForResourceFromBuildingTreasury(
        address buildingAddress,
        uint256 maxPointsToSpend
    ) public override onlyWorldAssetFromSameEra {
        address armyAddress = msg.sender;
        _updateArmySiegeProgress(armyAddress);

        IArmy army = IArmy(armyAddress);
        ArmyInfo storage currentArmyInfo = armyInfo[armyAddress];

        if (world().worldAssets(eraNumber(), buildingAddress) != BUILDING_GROUP_TYPE_ID) revert RobberyPointsSwapNotAllowedDueToSpecifiedBuildingAddressIsNotPartOfEra();
        if (currentArmyInfo.points < maxPointsToSpend) revert RobberyPointsSwapNotAllowedDueToWrongMaxPointsToSpendSpecified();

        IBuilding producingResourceBuilding = IBuilding(buildingAddress);

        if (address(relatedSettlement) != address(producingResourceBuilding.relatedSettlement())) revert RobberyPointsSwapNotAllowedDueToSpecifiedBuildingAddressDoesNotBelongToSettlementOfThisSiege();

        uint256 robberyPointsToResourceMultiplier = Config.getRobberyPointsToResourceMultiplier(
            producingResourceBuilding.getProducingResourceTypeId()
        );
        uint256 amountOfResourcesToStealAndBurn = (maxPointsToSpend * robberyPointsToResourceMultiplier) / 1e18;

        producingResourceBuilding.updateState();

        (uint256 stolenAmount, uint256 burnedAmount) = producingResourceBuilding.stealTreasury(
            address(army.relatedSettlement()),
            amountOfResourcesToStealAndBurn
        );
        if (stolenAmount == 0 && burnedAmount == 0) revert RobberyPointsSwapNotAllowedDueToNothingWasStolenAndBurned();

        uint256 pointsSpent = ((stolenAmount + burnedAmount) * 1e18) / robberyPointsToResourceMultiplier;
        currentArmyInfo.points -= pointsSpent;

        emit BuildingRobbed(
            armyAddress,
            buildingAddress,
            stolenAmount,
            burnedAmount,
            pointsSpent,
            currentArmyInfo.points
        );
    }

    /// @inheritdoc ISiege
    function getArmyBesiegingUnitsAmounts(address armyAddress) public view override returns (uint256[] memory) {
        bytes32[] memory unitTypeIds = Config.getUnitTypeIds();
        uint256[] memory unitsAmounts = new uint256[](unitTypeIds.length);

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            unitsAmounts[i] = besiegingArmyUnitsByType[armyAddress][unitTypeIds[i]];
        }

        return unitsAmounts;
    }

    /// @dev Updates army siege progress
    function _updateArmySiegeProgress(address armyAddress) internal {
        relatedSettlement.updateFortHealth();

        ArmyInfo storage currentArmyInfo = armyInfo[armyAddress];
        uint256 armyUnitsSiegePower = calculateArmyUnitsSiegePower(armyAddress);
        uint256 armyTotalSiegePower = _calculateArmyTotalSiegePower(armyUnitsSiegePower, currentArmyInfo.robberyMultiplier);
        uint256 totalArmyRobberyPoints = armyTotalSiegePower * robberyPointsPerOneDamage;
        uint256 pendingRobberyPoints = totalArmyRobberyPoints - currentArmyInfo.pointsDebt;

        if (pendingRobberyPoints > 0) {
            currentArmyInfo.points = currentArmyInfo.points + pendingRobberyPoints;
        }

        currentArmyInfo.pointsDebt = totalArmyRobberyPoints;
    }

    /// @dev Calculates additional robbery points per one damage by damage and total siege power
    function _calculateAdditionalRobberyPointsPerOneDamage(uint256 damage, uint256 siegePower) internal view returns (uint256) {
        if (damage == 0 || siegePower == 0) {
            return 0;
        }

        return ((damage * Config.robberyPointsPerDamageMultiplier) / 1e18) / siegePower;
    }

    /// @dev Calculates army total siege power by armySiegePower from units and robberyMultiplier
    function _calculateArmyTotalSiegePower(uint256 armyUnitsSiegePower, uint256 robberyMultiplier) internal pure returns (uint256) {
        return armyUnitsSiegePower * robberyMultiplier / 1e18;
    }
}
