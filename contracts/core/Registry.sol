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
    /// @inheritdoc IRegistry
    uint256 public override globalMultiplier;
    /// @inheritdoc IRegistry
    uint256 public override settlementStartingPrice;

    /// @dev Only mighty creator modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyMightyCreator() {
        _onlyMightyCreator();
        _;
    }

    /// @inheritdoc IRegistry
    function init(
        uint256 _globalMultiplier,
        uint256 _settlementStartingPrice
    ) public override initializer {
        mightyCreator = msg.sender;
        globalMultiplier = _globalMultiplier;
        settlementStartingPrice = _settlementStartingPrice;
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
        return globalMultiplier;
    }

    /// @inheritdoc IRegistry
    function getUnitStats(bytes32 unitTypeId) public pure returns (UnitStats memory) {
        if (unitTypeId == WARRIOR_TYPE_ID) {
            return UnitStats({
                offenseStage1: 0,
                defenceStage1: 20,
                offenseStage2: 5,
                defenceStage2: 5,
                siegePower: 11574074074074,//uint256(1e18 / 1 days),
                siegeSupport: 23148148148148//2 * siegePower
            });
        }

        if (unitTypeId == ARCHER_TYPE_ID) {
            return UnitStats({
                offenseStage1: 5,
                defenceStage1: 5,
                offenseStage2: 0,
                defenceStage2: 5,
                siegePower: 11574074074074,//uint256(1e18 / 1 days),
                siegeSupport: 23148148148148//2 * siegePower
            });
        }

        if (unitTypeId == HORSEMAN_TYPE_ID) {
            return UnitStats({
                offenseStage1: 0,
                defenceStage1: 5,
                offenseStage2: 5,
                defenceStage2: 20,
                siegePower: 11574074074074,//uint256(1e18 / 1 days),
                siegeSupport: 23148148148148//2 * siegePower
            });
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getRobberyPointsPerDamageMultiplier() public pure override returns (uint256) {
        return 5e18;
    }

    /// @inheritdoc IRegistry
    function getRobberyPointsToResourceMultiplier(bytes32 resourceTypeId) public view override returns (uint256) {
        if (resourceTypeId == FOOD_TYPE_ID) {
            return 1e18;
        }

        if (resourceTypeId == WOOD_TYPE_ID) {
            return 1e18;
        }

        if (resourceTypeId == ORE_TYPE_ID) {
            return 1e18;
        }

        if (resourceTypeId == INGOT_TYPE_ID) {
            return 1e18;
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getWorkerCapacityCoefficient(bytes32 buildingTypeId) public pure override returns (uint256) {
        if (buildingTypeId == FARM_TYPE_ID) {
            return 10e18;
        }

        if (buildingTypeId == LUMBERMILL_TYPE_ID) {
            return 7e18;
        }

        if (buildingTypeId == MINE_TYPE_ID) {
            return 5e18;
        }

        if (buildingTypeId == SMITHY_TYPE_ID) {
            return 3e18;
        }

        if (buildingTypeId == FORT_TYPE_ID) {
            return 5e18;
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getBasicProductionBuildingCoefficient(bytes32 buildingTypeId) public pure override returns (uint256) {
        if (buildingTypeId == FARM_TYPE_ID) {
            return 0.5e18;
        }

        if (buildingTypeId == LUMBERMILL_TYPE_ID) {
            return 0.43e18;
        }

        if (buildingTypeId == MINE_TYPE_ID) {
            return 0.4e18;
        }

        if (buildingTypeId == SMITHY_TYPE_ID) {
            return 0.33e18;
        }

        if (buildingTypeId == FORT_TYPE_ID) {
            return 0.4e18;
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getCorruptionIndexByResource(bytes32 resourceTypeId) public pure override returns (uint256) {
        if (resourceTypeId == FOOD_TYPE_ID) {
            return 0.3e18;
        }

        if (resourceTypeId == WOOD_TYPE_ID) {
            return 1e18;
        }

        if (resourceTypeId == ORE_TYPE_ID) {
            return 3e18;
        }

        if (resourceTypeId == INGOT_TYPE_ID) {
            return 10e18;
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getResourceWeight(bytes32 resourceTypeId) public pure override returns (uint256) {
        if (resourceTypeId == FOOD_TYPE_ID) {
            return 0.5e18;
        }

        if (resourceTypeId == WOOD_TYPE_ID) {
            return 1e18;
        }

        if (resourceTypeId == ORE_TYPE_ID) {
            return 2e18;
        }

        if (resourceTypeId == INGOT_TYPE_ID) {
            return 3e18;
        }

        return 0;
    }

    /// @inheritdoc IRegistry
    function getToTreasuryPercent() public pure override returns (uint256) {
        return 1e18;
    }

    /// @inheritdoc IRegistry
    function getBaseBattleDuration() public pure override returns (uint256) {
        return 18 hours;
    }

    /// @inheritdoc IRegistry
    function getBattleDurationLosingArmyStunMultiplier() public pure override returns (uint256) {
        return 0.665e18;
    }

    /// @inheritdoc IRegistry
    function getBattleDurationWinningArmyStunMultiplier() public pure override returns (uint256) {
        return 0.335e18;
    }

    /// @inheritdoc IRegistry
    function getManeuverDurationStunMultiplier() public pure override returns (uint256) {
        return 0.6e18;
    }

    /// @inheritdoc IRegistry
    function getBuildingTypeIds() public pure override returns (bytes32[] memory) {
        bytes32[] memory buildingTypeIds = new bytes32[](5);

        buildingTypeIds[0] = FARM_TYPE_ID;
        buildingTypeIds[1] = LUMBERMILL_TYPE_ID;
        buildingTypeIds[2] = MINE_TYPE_ID;
        buildingTypeIds[3] = SMITHY_TYPE_ID;
        buildingTypeIds[4] = FORT_TYPE_ID;

        return buildingTypeIds;
    }

    /// @inheritdoc IRegistry
    function getGameResources() public pure override returns (GameResource[] memory) {
        GameResource[] memory resources = new GameResource[](4);

        resources[0] = GameResource("Mithraeum Food", "mFOOD", FOOD_TYPE_ID);
        resources[1] = GameResource("Mithraeum Wood", "mWOOD", WOOD_TYPE_ID);
        resources[2] = GameResource("Mithraeum Ore", "mORE", ORE_TYPE_ID);
        resources[3] = GameResource("Mithraeum Ingot", "mINGOT", INGOT_TYPE_ID);

        return resources;
    }

    /// @inheritdoc IRegistry
    function getGameUnits() public pure override returns (GameUnit[] memory) {
        GameUnit[] memory gameUnits = new GameUnit[](3);

        gameUnits[0] = GameUnit("Mithraeum Warrior", "mWARRIOR", WARRIOR_TYPE_ID);
        gameUnits[1] = GameUnit("Mithraeum Archer", "mARCHER", ARCHER_TYPE_ID);
        gameUnits[2] = GameUnit("Mithraeum Horseman", "mHORSEMAN", HORSEMAN_TYPE_ID);

        return gameUnits;
    }

    /// @inheritdoc IRegistry
    function getUnitTypeIds() public pure override returns (bytes32[] memory) {
        GameUnit[] memory gameUnits = getGameUnits();
        bytes32[] memory unitTypeIds = new bytes32[](gameUnits.length);

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            unitTypeIds[i] = gameUnits[i].unitTypeId;
        }

        return unitTypeIds;
    }

    /// @inheritdoc IRegistry
    function getUnitHiringFortHpMultiplier() public pure override returns (uint256) {
        return 5e18;
    }

    /// @inheritdoc IRegistry
    function getUnitResourceUsagePer1SecondOfDecreasedManeuverDuration(bytes32 unitTypeId) public pure override returns (uint256) {
        if (unitTypeId == WARRIOR_TYPE_ID) {
            // 1e18 / 5 hours = irrational const
            return 0.000055555e18;
        }

        if (unitTypeId == ARCHER_TYPE_ID) {
            // 1e18 / 20 hours = irrational const
            return 0.000013888e18;
        }

        if (unitTypeId == HORSEMAN_TYPE_ID) {
            // 1e18 / 50 hours = irrational const
            return 0.000005555e18;
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getProsperityForUnitLiquidation(bytes32 unitTypeId) public pure override returns (uint256) {
        if (unitTypeId == WARRIOR_TYPE_ID) {
            return 0e18;
        }

        if (unitTypeId == ARCHER_TYPE_ID) {
            return 3e18;
        }

        if (unitTypeId == HORSEMAN_TYPE_ID) {
            return 4e18;
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getWorkersForUnitLiquidation(bytes32 unitTypeId) public pure override returns (uint256) {
        if (unitTypeId == WARRIOR_TYPE_ID) {
            return 1e18;
        }

        if (unitTypeId == ARCHER_TYPE_ID) {
            return 0e18;
        }

        if (unitTypeId == HORSEMAN_TYPE_ID) {
            return 0e18;
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getCultistsSummonDelay() public pure override returns (uint256) {
        return 2 weeks;
    }

    /// @inheritdoc IRegistry
    function getMaxSettlementsPerRegion() public pure override returns (uint256) {
        return 40;
    }

    /// @inheritdoc IRegistry
    function getCultistsNoDestructionDelay() public pure override returns (uint256) {
        return 10 days;
    }

    /// @inheritdoc IRegistry
    function getCultistsPerRegionMultiplier() public pure override returns (uint256) {
        return 5000e18;
    }

    /// @inheritdoc IRegistry
    function getMaxCultistsPerRegion() public pure override returns (uint256) {
        return 10000e18;
    }

    /// @inheritdoc IRegistry
    function getCultistUnitTypeId() public pure override returns (bytes32) {
        return WARRIOR_TYPE_ID;
    }

    /// @inheritdoc IRegistry
    function getBuildingTokenTransferThresholdPercent() public pure override returns (uint256) {
        return 0.3e18;
    }

    /// @inheritdoc IRegistry
    function getNewSettlementStartingPrice() public view override returns (uint256) {
        return settlementStartingPrice;
    }

    /// @inheritdoc IRegistry
    function getProductionTicksInSecond() public view override returns (uint256) {
        return getMaxCultistsPerRegion() / 1e18;
    }

    /// @inheritdoc IRegistry
    function getUnitPriceIncreaseForEachUnit() public pure override returns (uint256, uint256) {
        return (1004, 1000);
    }

    /// @inheritdoc IRegistry
    function getMaxAllowedUnitsToBuyPerTransaction() public pure override returns (uint256) {
        return 5000e18;
    }

    /// @inheritdoc IRegistry
    function getUnitPriceDropByUnitTypeId(bytes32 unitTypeId) public pure override returns (uint256, uint256) {
        if (unitTypeId == ARCHER_TYPE_ID) {
            //10% drop in 1 day (90% leftover)
            return (9999987805503308, 10000000000000000);
        }

        if (unitTypeId == HORSEMAN_TYPE_ID) {
            //7% drop in 1 day (93% leftover)
            return (9999991600617782, 10000000000000000);
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getWorkerPriceIncreaseForEachWorker() public pure override returns (uint256, uint256) {
        return (1004, 1000);
    }

    /// @inheritdoc IRegistry
    function getMaxAllowedWorkersToBuyPerTransaction() public pure override returns (uint256) {
        return 5000e18;
    }

    /// @inheritdoc IRegistry
    function getWorkerPriceDrop() public pure override returns (uint256, uint256) {
        //7% drop in 1 day (93% leftover)
        return (9999991600617782, 10000000000000000);
    }

    /// @inheritdoc IRegistry
    function getMaxAdvancedProductionTileBuff() public pure override returns (uint256) {
        return 1e18;
    }

    /// @inheritdoc IRegistry
    function getCaptureTileDurationPerTile() public pure override returns (uint256) {
        return 9 hours;
    }

    /// @inheritdoc IRegistry
    function getNextCaptureProsperityBasicThreshold() public pure override returns (uint256) {
        return 1.2e18;
    }

    /// @inheritdoc IRegistry
    function getNextCaptureProsperityPerTileThreshold() public pure override returns (uint256) {
        return 0.05e18;
    }

    /// @inheritdoc IRegistry
    function getNecessaryProsperityPercentForClaimingTileCapture() public pure override returns (uint256) {
        return 0.7e18;
    }

    /// @inheritdoc IRegistry
    function getTileCaptureCancellationFee() public pure override returns (uint256) {
        return 0.25e18;
    }

    /// @inheritdoc IRegistry
    function getMaxCapturedTilesForSettlement(uint8 tileBonusType) public pure override returns (uint256) {
        if (tileBonusType == 1) {
            return 2;
        }

        if (tileBonusType == 2) {
            return 1;
        }

        return 0;
    }

    /// @inheritdoc IRegistry
    function getAdvancedProductionTileBonusByVariation(uint8 variation) public pure override returns (bytes32, uint256) {
        if (variation == 0) {
            return (FARM_TYPE_ID, 0.25e18);
        }

        if (variation == 1) {
            return (FARM_TYPE_ID, 0.4e18);
        }

        if (variation == 2) {
            return (LUMBERMILL_TYPE_ID, 0.3e18);
        }

        if (variation == 3) {
            return (LUMBERMILL_TYPE_ID, 0.6e18);
        }

        if (variation == 4) {
            return (MINE_TYPE_ID, 0.5e18);
        }

        if (variation == 5) {
            return (MINE_TYPE_ID, 0.8e18);
        }

        if (variation == 6) {
            return (SMITHY_TYPE_ID, 0.7e18);
        }

        if (variation == 7) {
            return (SMITHY_TYPE_ID, 1e18);
        }

        if (variation == 8) {
            return (FORT_TYPE_ID, 0.4e18);
        }

        if (variation == 9) {
            return (FORT_TYPE_ID, 0.6e18);
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getUnitBattleMultiplierTileBonusByVariation(uint8 variation) public pure override returns (bytes32, uint256) {
        if (variation == 0) {
            return (WARRIOR_TYPE_ID, 0.3e18);
        }

        if (variation == 1) {
            return (ARCHER_TYPE_ID, 0.5e18);
        }

        if (variation == 2) {
            return (HORSEMAN_TYPE_ID, 1e18);
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getMaxRegionTier() public pure override returns (uint256) {
        return 4;
    }

    /// @inheritdoc IRegistry
    function getInitialCultistsAmountPerRegionTier() public pure override returns (uint256) {
        return 1500e18;
    }

    /// @inheritdoc IRegistry
    function getInitialCorruptionIndexAmountPerRegionTier() public pure override returns (uint256) {
        return getInitialCultistsAmountPerRegionTier() * 5;
    }

    /// @inheritdoc IRegistry
    function getSettlementPriceMultiplierPerIncreasedRegionTier() public pure override returns (uint256) {
        return 2;
    }

    /// @inheritdoc IRegistry
    function getStunDurationMultiplierOfCancelledSecretManeuver() public pure override returns (uint256) {
        return 0.5e18;
    }

    /// @inheritdoc IRegistry
    function getMaxAllowedRobberyMultiplierIncreaseValue() public pure override returns (uint256) {
        return 3e18;
    }

    /// @inheritdoc IRegistry
    function getArmyStunDurationPerRobberyMultiplier() public pure override returns (uint256) {
        return 1 days;
    }

    /// @inheritdoc IRegistry
    function getChanceForTileWithBonusByRegionTier(uint256 regionTier) public pure override returns (uint256) {
        if (regionTier == 1) {
            return 0.04e18;
        }

        if (regionTier == 2) {
            return 0.08e18;
        }

        if (regionTier == 3) {
            return 0.12e18;
        }

        if (regionTier == 4) {
            return 0.15e18;
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getRegionInclusionPrice(uint256 regionTier) public pure override returns (uint256) {
        if (regionTier == 1) {
            return 40000e18;
        }

        if (regionTier == 2) {
            return 80000e18;
        }

        if (regionTier == 3) {
            return 160000e18;
        }

        if (regionTier == 4) {
            return 320000e18;
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getRegionOwnerSettlementPurchasePercent(uint256 regionTier) public pure override returns (uint256) {
        if (regionTier == 1) {
            return 0.4e18;
        }

        if (regionTier == 2) {
            return 0.2e18;
        }

        if (regionTier == 3) {
            return 0.1e18;
        }

        if (regionTier == 4) {
            return 0;
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getUnitPoolType(bytes32 unitTypeId) public pure override returns (bytes32) {
        if (unitTypeId == WARRIOR_TYPE_ID) {
            return WORKERS_UNIT_POOL_TYPE_ID;
        }

        if (unitTypeId == ARCHER_TYPE_ID) {
            return INGOTS_UNIT_POOL_TYPE_ID;
        }

        if (unitTypeId == HORSEMAN_TYPE_ID) {
            return INGOTS_UNIT_POOL_TYPE_ID;
        }

        revert UnknownInputParameter();
    }

    /// @inheritdoc IRegistry
    function getArmyStunDurationByJoiningBattleAtAttackingSide() public pure override returns (uint256) {
        return 12 hours;
    }

    /// @inheritdoc IRegistry
    function getInitialCaptureProsperityBasicValue() public pure override returns (uint256) {
        return 1e18;
    }

    /// @inheritdoc IRegistry
    function getInitialCaptureProsperityPerTileValue() public pure override returns (uint256) {
        return 0.25e18;
    }

    /// @inheritdoc IRegistry
    function getMinimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion() public pure override returns (uint256) {
        return 20;
    }

    /// @inheritdoc IRegistry
    function getSettlementPayToDecreaseCorruptionIndexPenaltyMultiplier() public pure override returns (uint256) {
        return 0.5e18;
    }

    /// @inheritdoc IRegistry
    function getMinimumBattleDuration() public pure override returns (uint256) {
        return 10;
    }

    /// @inheritdoc IRegistry
    function getNewSettlementPriceIncreaseMultiplier() public pure override returns (uint256) {
        return 1.3e18;
    }

    /// @dev Allows caller to be only mighty creator
    function _onlyMightyCreator() internal view {
        if (msg.sender != mightyCreator) revert OnlyMightyCreator();
    }
}
