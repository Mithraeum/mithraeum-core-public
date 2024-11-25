// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./IRegistry.sol";
import "../const/GameAssetTypes.sol";

contract Registry is IRegistry, Initializable {
    /// @inheritdoc IRegistry
    address public override mightyCreator;
    /// @inheritdoc IRegistry
    IWorldAssetFactory public override worldAssetFactory;

    /// @dev Only mighty creator modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyMightyCreator() {
        _onlyMightyCreator();
        _;
    }

    /// @inheritdoc IRegistry
    function init() public override initializer {
        mightyCreator = msg.sender;
    }

    /// @inheritdoc IRegistry
    function setMightyCreator(address newMightyCreator) public override onlyMightyCreator {
        mightyCreator = newMightyCreator;
    }

    /// @inheritdoc IRegistry
    function setWorldAssetFactory(address worldAssetFactoryAddress) public override onlyMightyCreator {
        worldAssetFactory = IWorldAssetFactory(worldAssetFactoryAddress);
    }

    /// @inheritdoc IRegistry
    function getGlobalMultiplier() public view override returns (uint256) {
        return Config.globalMultiplier;
    }

    /// @inheritdoc IRegistry
    function getUnitStats(bytes32 unitTypeId) public pure returns (Config.UnitStats memory) {
        return Config.getUnitStats(unitTypeId);
    }

    /// @inheritdoc IRegistry
    function getRobberyPointsPerDamageMultiplier() public pure override returns (uint256) {
        return Config.robberyPointsPerDamageMultiplier;
    }

    /// @inheritdoc IRegistry
    function getRobberyPointsToResourceMultiplier(bytes32 resourceTypeId) public view override returns (uint256) {
        return Config.getRobberyPointsToResourceMultiplier(resourceTypeId);
    }

    /// @inheritdoc IRegistry
    function getWorkerCapacityCoefficient(bytes32 buildingTypeId) public pure override returns (uint256) {
        return Config.getWorkerCapacityCoefficient(buildingTypeId);
    }

    /// @inheritdoc IRegistry
    function getBuildingUpgradeCostMultiplier(bytes32 buildingTypeId) public pure override returns (uint256) {
        return Config.getBuildingUpgradeCostMultiplier(buildingTypeId);
    }

    /// @inheritdoc IRegistry
    function getBasicProductionBuildingCoefficient(bytes32 buildingTypeId) public pure override returns (uint256) {
        return Config.getBasicProductionBuildingCoefficient(buildingTypeId);
    }

    /// @inheritdoc IRegistry
    function getCorruptionIndexByResource(bytes32 resourceTypeId) public pure override returns (uint256) {
        return Config.getCorruptionIndexByResource(resourceTypeId);
    }

    /// @inheritdoc IRegistry
    function getResourceWeight(bytes32 resourceTypeId) public pure override returns (uint256) {
        return Config.getResourceWeight(resourceTypeId);
    }

    /// @inheritdoc IRegistry
    function getToTreasuryPercent() public pure override returns (uint256) {
        return Config.toTreasuryPercent;
    }

    /// @inheritdoc IRegistry
    function getBaseBattleDuration() public pure override returns (uint256) {
        return Config.baseBattleDuration;
    }

    /// @inheritdoc IRegistry
    function getBattleDurationLosingArmyStunMultiplier() public pure override returns (uint256) {
        return Config.battleDurationLosingArmyStunMultiplier;
    }

    /// @inheritdoc IRegistry
    function getBattleDurationWinningArmyStunMultiplier() public pure override returns (uint256) {
        return Config.battleDurationWinningArmyStunMultiplier;
    }

    /// @inheritdoc IRegistry
    function getManeuverStunDuration() public pure override returns (uint256) {
        return Config.maneuverStunDuration;
    }

    /// @inheritdoc IRegistry
    function getBuildingTypeIds() public pure override returns (bytes32[] memory) {
        return Config.getBuildingTypeIds();
    }

    /// @inheritdoc IRegistry
    function getGameResources() public pure override returns (Config.GameResource[] memory) {
        return Config.getGameResources();
    }

    /// @inheritdoc IRegistry
    function getGameUnits() public pure override returns (Config.GameUnit[] memory) {
        return Config.getGameUnits();
    }

    /// @inheritdoc IRegistry
    function getUnitTypeIds() public pure override returns (bytes32[] memory) {
        return Config.getUnitTypeIds();
    }

    /// @inheritdoc IRegistry
    function getUnitHiringFortHpMultiplier() public pure override returns (uint256) {
        return Config.unitHiringFortHpMultiplier;
    }

    /// @inheritdoc IRegistry
    function getUnitResourceUsagePer1SecondOfDecreasedManeuverDuration(bytes32 unitTypeId) public pure override returns (uint256) {
        return Config.getUnitResourceUsagePer1SecondOfDecreasedManeuverDuration(unitTypeId);
    }

    /// @inheritdoc IRegistry
    function getProsperityForUnitLiquidation(bytes32 unitTypeId) public pure override returns (uint256) {
        return Config.getProsperityForUnitLiquidation(unitTypeId);
    }

    /// @inheritdoc IRegistry
    function getWorkersForUnitLiquidation(bytes32 unitTypeId) public pure override returns (uint256) {
        return Config.getWorkersForUnitLiquidation(unitTypeId);
    }

    /// @inheritdoc IRegistry
    function getCultistsSummonDelay() public pure override returns (uint256) {
        return Config.cultistsSummonDelay;
    }

    /// @inheritdoc IRegistry
    function getMaxSettlementsPerRegion() public pure override returns (uint256) {
        return Config.maxSettlementsPerRegion;
    }

    /// @inheritdoc IRegistry
    function getCultistsNoDestructionDelay() public pure override returns (uint256) {
        return Config.cultistsNoDestructionDelay;
    }

    /// @inheritdoc IRegistry
    function getCultistsPerRegionMultiplier() public pure override returns (uint256) {
        return Config.cultistsPerRegionMultiplier;
    }

    /// @inheritdoc IRegistry
    function getMaxCultistsPerRegion() public pure override returns (uint256) {
        return Config.maxCultistsPerRegion;
    }

    /// @inheritdoc IRegistry
    function getCultistUnitTypeId() public pure override returns (bytes32) {
        return Config.cultistUnitTypeId;
    }

    /// @inheritdoc IRegistry
    function getBuildingTokenTransferThresholdPercent() public pure override returns (uint256) {
        return Config.buildingTokenTransferThresholdPercent;
    }

    /// @inheritdoc IRegistry
    function getNewSettlementStartingPrice() public view override returns (uint256) {
        return Config.newSettlementStartingPrice;
    }

    /// @inheritdoc IRegistry
    function getProductionTicksInSecond() public view override returns (uint256) {
        return Config.productionTicksInSecond;
    }

    /// @inheritdoc IRegistry
    function getUnitPriceIncreaseByUnitTypeId(bytes32 unitTypeId) public pure override returns (uint256, uint256) {
        return Config.getUnitPriceIncreaseByUnitTypeId(unitTypeId);
    }

    /// @inheritdoc IRegistry
    function getMaxAllowedUnitsToBuyPerTransaction() public pure override returns (uint256) {
        return Config.maxAllowedUnitsToBuyPerTransaction;
    }

    /// @inheritdoc IRegistry
    function getUnitPriceDropByUnitTypeId(bytes32 unitTypeId) public pure override returns (uint256, uint256) {
        return Config.getUnitPriceDropByUnitTypeId(unitTypeId);
    }

    /// @inheritdoc IRegistry
    function getWorkerPriceIncreaseForEachWorker() public pure override returns (uint256, uint256) {
        return Config.getWorkerPriceIncreaseForEachWorker();
    }

    /// @inheritdoc IRegistry
    function getMaxAllowedWorkersToBuyPerTransaction() public pure override returns (uint256) {
        return Config.maxAllowedWorkersToBuyPerTransaction;
    }

    /// @inheritdoc IRegistry
    function getWorkerPriceDrop() public pure override returns (uint256, uint256) {
        return Config.getWorkerPriceDrop();
    }

    /// @inheritdoc IRegistry
    function getMaxAdvancedProductionTileBuff() public pure override returns (uint256) {
        return Config.maxAdvancedProductionTileBuff;
    }

    /// @inheritdoc IRegistry
    function getCaptureTileDurationPerTile() public pure override returns (uint256) {
        return Config.captureTileDurationPerTile;
    }

    /// @inheritdoc IRegistry
    function getNextCaptureProsperityBasicThreshold() public pure override returns (uint256) {
        return Config.nextCaptureProsperityBasicThreshold;
    }

    /// @inheritdoc IRegistry
    function getNextCaptureProsperityPerTileThreshold() public pure override returns (uint256) {
        return Config.nextCaptureProsperityPerTileThreshold;
    }

    /// @inheritdoc IRegistry
    function getNecessaryProsperityPercentForClaimingTileCapture() public pure override returns (uint256) {
        return Config.necessaryProsperityPercentForClaimingTileCapture;
    }

    /// @inheritdoc IRegistry
    function getTileCaptureCancellationFee() public pure override returns (uint256) {
        return Config.tileCaptureCancellationFee;
    }

    /// @inheritdoc IRegistry
    function getMaxCapturedTilesForSettlement(uint8 tileBonusType) public pure override returns (uint256) {
        return Config.getMaxCapturedTilesForSettlement(tileBonusType);
    }

    /// @inheritdoc IRegistry
    function getAdvancedProductionTileBonusByVariation(uint8 variation) public pure override returns (bytes32, uint256) {
        return Config.getAdvancedProductionTileBonusByVariation(variation);
    }

    /// @inheritdoc IRegistry
    function getUnitBattleMultiplierTileBonusByVariation(uint8 variation) public pure override returns (bytes32, uint256) {
        return Config.getUnitBattleMultiplierTileBonusByVariation(variation);
    }

    /// @inheritdoc IRegistry
    function getMaxRegionTier() public pure override returns (uint256) {
        return Config.maxRegionTier;
    }

    /// @inheritdoc IRegistry
    function getInitialCultistsAmountByRegionTier(uint256 regionTier) public pure override returns (uint256) {
        return Config.getInitialCultistsAmountByRegionTier(regionTier);
    }

    /// @inheritdoc IRegistry
    function getInitialCorruptionIndexPerCultistMultiplier() public pure override returns (uint256) {
        return Config.initialCorruptionIndexPerCultistMultiplier;
    }

    /// @inheritdoc IRegistry
    function getSettlementPriceMultiplierPerIncreasedRegionTier() public pure override returns (uint256) {
        return Config.settlementPriceMultiplierPerIncreasedRegionTier;
    }

    /// @inheritdoc IRegistry
    function getStunDurationOfCancelledSecretManeuver() public pure override returns (uint256) {
        return Config.stunDurationOfCancelledSecretManeuver;
    }

    /// @inheritdoc IRegistry
    function getDemilitarizationCooldown() public pure override returns (uint256) {
        return Config.demilitarizationCooldown;
    }

    /// @inheritdoc IRegistry
    function getMaxAllowedRobberyMultiplierIncreaseValue() public pure override returns (uint256) {
        return Config.maxAllowedRobberyMultiplierIncreaseValue;
    }

    /// @inheritdoc IRegistry
    function getArmyStunDurationPerRobberyMultiplier() public pure override returns (uint256) {
        return Config.armyStunDurationPerRobberyMultiplier;
    }

    /// @inheritdoc IRegistry
    function getChanceForTileWithBonusByRegionTier(uint256 regionTier) public pure override returns (uint256) {
        return Config.getChanceForTileWithBonusByRegionTier(regionTier);
    }

    /// @inheritdoc IRegistry
    function getRegionInclusionPrice(uint256 regionTier) public pure override returns (uint256) {
        return Config.getRegionInclusionPrice(regionTier);
    }

    /// @inheritdoc IRegistry
    function getRegionOwnerSettlementPurchasePercent(uint256 regionTier) public pure override returns (uint256) {
        return Config.getRegionOwnerSettlementPurchasePercent(regionTier);
    }

    /// @inheritdoc IRegistry
    function getUnitPoolType(bytes32 unitTypeId) public pure override returns (bytes32) {
        return Config.getUnitPoolType(unitTypeId);
    }

    /// @inheritdoc IRegistry
    function getArmyStunDurationByJoiningBattleAtAttackingSide() public pure override returns (uint256) {
        return Config.armyStunDurationByJoiningBattleAtAttackingSide;
    }

    /// @inheritdoc IRegistry
    function getInitialCaptureProsperityBasicValue() public pure override returns (uint256) {
        return Config.initialCaptureProsperityBasicValue;
    }

    /// @inheritdoc IRegistry
    function getInitialCaptureProsperityPerTileValue() public pure override returns (uint256) {
        return Config.initialCaptureProsperityPerTileValue;
    }

    /// @inheritdoc IRegistry
    function getCaptureTileInitialDuration() public pure override returns (uint256) {
        return Config.captureTileInitialDuration;
    }

    /// @inheritdoc IRegistry
    function getMinimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion() public pure override returns (uint256) {
        return Config.minimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion;
    }

    /// @inheritdoc IRegistry
    function getSettlementPayToDecreaseCorruptionIndexPenaltyMultiplier() public pure override returns (uint256) {
        return Config.settlementPayToDecreaseCorruptionIndexPenaltyMultiplier;
    }

    /// @inheritdoc IRegistry
    function getMinimumBattleDuration() public pure override returns (uint256) {
        return Config.minimumBattleDuration;
    }

    /// @inheritdoc IRegistry
    function getNewSettlementPriceIncreaseMultiplier() public pure override returns (uint256) {
        return Config.newSettlementPriceIncreaseMultiplier;
    }

    /// @inheritdoc IRegistry
    function getBuildingActivationPrice() public pure override returns (bytes32[] memory, uint256[] memory) {
        return Config.getBuildingActivationPrice();
    }

    /// @inheritdoc IRegistry
    function getBuildingCooldownDurationAfterActivation() public pure override returns (uint256) {
        return Config.buildingCooldownDurationAfterActivation;
    }

    /// @inheritdoc IRegistry
    function getWorkersAmountForBuildingActivation() public pure override returns (uint256) {
        return Config.workersAmountForBuildingActivation;
    }

    /// @dev Allows caller to be only mighty creator
    function _onlyMightyCreator() internal view {
        if (msg.sender != mightyCreator) revert OnlyMightyCreator();
    }
}
