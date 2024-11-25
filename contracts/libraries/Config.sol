// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../const/GameAssetTypes.sol";

/// @notice Thrown when attempting to call function by providing unknown parameter
error UnknownInputParameter();

library Config {

    struct GameResource {
        string tokenName;
        string tokenSymbol;
        bytes32 resourceTypeId;
    }

    struct GameUnit {
        string tokenName;
        string tokenSymbol;
        bytes32 unitTypeId;
    }

    struct UnitStats {
        uint256 offenseStage1;
        uint256 defenceStage1;
        uint256 offenseStage2;
        uint256 defenceStage2;
        uint256 siegePower;
        uint256 siegeSupport;
    }

    uint256 constant public globalMultiplier = 300;
    uint256 constant public newSettlementStartingPrice = 0.01e18;//default is 250e18
    uint256 constant public cultistsSummonDelay = 432000;//5 days, default is 2 weeks
    uint256 constant public cultistsNoDestructionDelay = 3 days;//default is 10 days
    uint256 constant public robberyPointsPerDamageMultiplier = 5e18;
    uint256 constant public toTreasuryPercent = 1e18;
    uint256 constant public baseBattleDuration = 18 hours;
    uint256 constant public battleDurationLosingArmyStunMultiplier = 0.665e18;
    uint256 constant public battleDurationWinningArmyStunMultiplier = 0.335e18;
    uint256 constant public maneuverStunDuration = 8 hours;
    uint256 constant public unitHiringFortHpMultiplier = 2e18;
    uint256 constant public maxSettlementsPerRegion = 40;
    uint256 constant public cultistsPerRegionMultiplier = 5000e18;
    uint256 constant public maxCultistsPerRegion = 10000e18;
    bytes32 constant public cultistUnitTypeId = WARRIOR_TYPE_ID;
    uint256 constant public buildingTokenTransferThresholdPercent = 0.3e18;
    uint256 constant public productionTicksInSecond = maxCultistsPerRegion / 1e18;
    uint256 constant public maxAllowedUnitsToBuyPerTransaction = 5000e18;
    uint256 constant public maxAllowedWorkersToBuyPerTransaction = 5000e18;
    uint256 constant public maxAdvancedProductionTileBuff = 1e18;
    uint256 constant public captureTileInitialDuration = 12 hours;
    uint256 constant public captureTileDurationPerTile = 5 hours;
    uint256 constant public nextCaptureProsperityBasicThreshold = 1.1e18;
    uint256 constant public nextCaptureProsperityPerTileThreshold = 0.1e18;
    uint256 constant public necessaryProsperityPercentForClaimingTileCapture = 1e18;
    uint256 constant public tileCaptureCancellationFee = 0.4e18;
    uint256 constant public maxRegionTier = 4;
    uint256 constant public initialCorruptionIndexPerCultistMultiplier = 5;
    uint256 constant public settlementPriceMultiplierPerIncreasedRegionTier = 2;
    uint256 constant public stunDurationOfCancelledSecretManeuver = 3 days;
    uint256 constant public maxAllowedRobberyMultiplierIncreaseValue = 3e18;
    uint256 constant public armyStunDurationPerRobberyMultiplier = 1 days;
    uint256 constant public armyStunDurationByJoiningBattleAtAttackingSide = 12 hours;
    uint256 constant public initialCaptureProsperityBasicValue = 50e18;
    uint256 constant public initialCaptureProsperityPerTileValue = 5e18;
    uint256 constant public minimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion = 20;
    uint256 constant public settlementPayToDecreaseCorruptionIndexPenaltyMultiplier = 0.5e18;
    uint256 constant public minimumBattleDuration = 10;
    uint256 constant public newSettlementPriceIncreaseMultiplier = 1e18;
    uint256 constant public startingWorkerPrice = 20e18;
    uint256 constant public demilitarizationCooldown = 1 days;
    uint256 constant public workersAmountForBuildingActivation = 2e18;
    uint256 constant public buildingCooldownDurationAfterActivation = 1 days;

    function getInitialCultistsAmountByRegionTier(uint256 regionTier) internal pure returns (uint256) {
        if (regionTier == 1) {
            return 2500e18;
        }

        if (regionTier == 2) {
            return 1500e18;
        }

        if (regionTier == 3) {
            return 750e18;
        }

        if (regionTier == 4) {
            return 250e18;
        }

        revert UnknownInputParameter();
    }

    function getUnitStartingPrice(bytes32 unitTypeId) internal pure returns (uint256) {
        if (unitTypeId == ARCHER_TYPE_ID) {
            return 2e18;
        }

        if (unitTypeId == HORSEMAN_TYPE_ID) {
            return 3e18;
        }

        revert UnknownInputParameter();
    }

    function getUnitStats(bytes32 unitTypeId) internal pure returns (UnitStats memory) {
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

    function getRobberyPointsToResourceMultiplier(bytes32 resourceTypeId) internal pure  returns (uint256) {
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

    function getWorkerCapacityCoefficient(bytes32 buildingTypeId) internal pure  returns (uint256) {
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
   
    function getBuildingUpgradeCostMultiplier(bytes32 buildingTypeId) internal pure  returns (uint256) {
        if (buildingTypeId == FARM_TYPE_ID) {
            return 0.5e18;
        }

        if (buildingTypeId == LUMBERMILL_TYPE_ID) {
            return 1e18;
        }

        if (buildingTypeId == MINE_TYPE_ID) {
            return 2e18;
        }

        if (buildingTypeId == SMITHY_TYPE_ID) {
            return 4e18;
        }

        if (buildingTypeId == FORT_TYPE_ID) {
            return 2e18;
        }

        revert UnknownInputParameter();
    }

    function getBasicProductionBuildingCoefficient(bytes32 buildingTypeId) internal pure  returns (uint256) {
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

    function getCorruptionIndexByResource(bytes32 resourceTypeId) internal pure  returns (uint256) {
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

    function getResourceWeight(bytes32 resourceTypeId) internal pure  returns (uint256) {
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

    function getBuildingTypeIds() internal pure  returns (bytes32[] memory) {
        bytes32[] memory buildingTypeIds = new bytes32[](5);

        buildingTypeIds[0] = FARM_TYPE_ID;
        buildingTypeIds[1] = LUMBERMILL_TYPE_ID;
        buildingTypeIds[2] = MINE_TYPE_ID;
        buildingTypeIds[3] = SMITHY_TYPE_ID;
        buildingTypeIds[4] = FORT_TYPE_ID;

        return buildingTypeIds;
    }

    function getGameResources() internal pure  returns (GameResource[] memory) {
        GameResource[] memory resources = new GameResource[](4);

        resources[0] = GameResource("Mithraeum Food", "mFOOD", FOOD_TYPE_ID);
        resources[1] = GameResource("Mithraeum Wood", "mWOOD", WOOD_TYPE_ID);
        resources[2] = GameResource("Mithraeum Ore", "mORE", ORE_TYPE_ID);
        resources[3] = GameResource("Mithraeum Ingot", "mINGOT", INGOT_TYPE_ID);

        return resources;
    }

    function getGameUnits() internal pure  returns (GameUnit[] memory) {
        GameUnit[] memory gameUnits = new GameUnit[](3);

        gameUnits[0] = GameUnit("Mithraeum Warrior", "mWARRIOR", WARRIOR_TYPE_ID);
        gameUnits[1] = GameUnit("Mithraeum Archer", "mARCHER", ARCHER_TYPE_ID);
        gameUnits[2] = GameUnit("Mithraeum Horseman", "mHORSEMAN", HORSEMAN_TYPE_ID);

        return gameUnits;
    }

    function getUnitTypeIds() internal pure  returns (bytes32[] memory) {
        GameUnit[] memory gameUnits = getGameUnits();
        bytes32[] memory unitTypeIds = new bytes32[](gameUnits.length);

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            unitTypeIds[i] = gameUnits[i].unitTypeId;
        }

        return unitTypeIds;
    }
   
    function getUnitResourceUsagePer1SecondOfDecreasedManeuverDuration(bytes32 unitTypeId) internal pure  returns (uint256) {
        if (unitTypeId == WARRIOR_TYPE_ID) {
            // 6e18 / 5 hours = irrational const, closest approximation
            return 333333333333333;
        }

        if (unitTypeId == ARCHER_TYPE_ID) {
            // 3e18 / 5 hours = irrational const, closest approximation
            return 166666666666666;
        }

        if (unitTypeId == HORSEMAN_TYPE_ID) {
            // 1e18 / 5 hours = irrational const, closest approximation
            return 55555555555555;
        }

        revert UnknownInputParameter();
    }

    function getProsperityForUnitLiquidation(bytes32 unitTypeId) internal pure  returns (uint256) {
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
   
    function getWorkersForUnitLiquidation(bytes32 unitTypeId) internal pure  returns (uint256) {
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

    function getUnitPriceIncreaseByUnitTypeId(bytes32 unitTypeId) internal pure  returns (uint256, uint256) {
        if (unitTypeId == ARCHER_TYPE_ID) {
            return (3, 100);
        }

        if (unitTypeId == HORSEMAN_TYPE_ID) {
            return (5, 100);
        }

        revert UnknownInputParameter();
    }
   
    function getUnitPriceDropByUnitTypeId(bytes32 unitTypeId) internal pure  returns (uint256, uint256) {
        if (unitTypeId == ARCHER_TYPE_ID) {
            //5% drop in 1 day (95% leftover)
            return (9999994063277874, 10000000000000000);
        }

        if (unitTypeId == HORSEMAN_TYPE_ID) {
            //5% drop in 1 day (95% leftover)
            return (9999994063277874, 10000000000000000);
        }

        revert UnknownInputParameter();
    }
   
    function getWorkerPriceIncreaseForEachWorker() internal pure  returns (uint256, uint256) {
        return (1004, 1000);
    }
   
    function getWorkerPriceDrop() internal pure  returns (uint256, uint256) {
        //15% drop in 1 day (85% leftover)
        return (9999981189956406, 10000000000000000);
    }
   
    function getMaxCapturedTilesForSettlement(uint8 tileBonusType) internal pure  returns (uint256) {
        if (tileBonusType == 1) {
            return 2;
        }

        if (tileBonusType == 2) {
            return 1;
        }

        return 0;
    }

    function getAdvancedProductionTileBonusByVariation(uint8 variation) internal pure  returns (bytes32, uint256) {
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
   
    function getUnitBattleMultiplierTileBonusByVariation(uint8 variation) internal pure  returns (bytes32, uint256) {
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
   
    function getChanceForTileWithBonusByRegionTier(uint256 regionTier) internal pure  returns (uint256) {
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
   
    function getRegionInclusionPrice(uint256 regionTier) internal pure  returns (uint256) {
        if (regionTier == 1) {
            return 100000e18;
        }

        if (regionTier == 2) {
            return 200000e18;
        }

        if (regionTier == 3) {
            return 400000e18;
        }

        if (regionTier == 4) {
            return 800000e18;
        }

        revert UnknownInputParameter();
    }

    function getRegionOwnerSettlementPurchasePercent(uint256 regionTier) internal pure  returns (uint256) {
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

    function getUnitPoolType(bytes32 unitTypeId) internal pure  returns (bytes32) {
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

    function getBuildingActivationPrice() internal pure returns (bytes32[] memory, uint256[] memory)
    {
        bytes32[] memory resourceTypeIds = new bytes32[](2);
        uint256[] memory resourcesAmounts = new uint256[](2);

        resourceTypeIds[0] = WOOD_TYPE_ID;
        resourceTypeIds[1] = ORE_TYPE_ID;

        resourcesAmounts[0] = 5e18;
        resourcesAmounts[1] = 5e18;

        return (resourceTypeIds, resourcesAmounts);
    }
}
