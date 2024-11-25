## UnknownInputParameter

```solidity
error UnknownInputParameter()
```

Thrown when attempting to call function by providing unknown parameter




## Config








### GameResource








```solidity
struct GameResource {
  string tokenName;
  string tokenSymbol;
  bytes32 resourceTypeId;
}
```

### GameUnit








```solidity
struct GameUnit {
  string tokenName;
  string tokenSymbol;
  bytes32 unitTypeId;
}
```

### UnitStats








```solidity
struct UnitStats {
  uint256 offenseStage1;
  uint256 defenceStage1;
  uint256 offenseStage2;
  uint256 defenceStage2;
  uint256 siegePower;
  uint256 siegeSupport;
}
```

### globalMultiplier

```solidity
uint256 globalMultiplier
```







### newSettlementStartingPrice

```solidity
uint256 newSettlementStartingPrice
```







### cultistsSummonDelay

```solidity
uint256 cultistsSummonDelay
```







### cultistsNoDestructionDelay

```solidity
uint256 cultistsNoDestructionDelay
```







### robberyPointsPerDamageMultiplier

```solidity
uint256 robberyPointsPerDamageMultiplier
```







### toTreasuryPercent

```solidity
uint256 toTreasuryPercent
```







### baseBattleDuration

```solidity
uint256 baseBattleDuration
```







### battleDurationLosingArmyStunMultiplier

```solidity
uint256 battleDurationLosingArmyStunMultiplier
```







### battleDurationWinningArmyStunMultiplier

```solidity
uint256 battleDurationWinningArmyStunMultiplier
```







### maneuverStunDuration

```solidity
uint256 maneuverStunDuration
```







### unitHiringFortHpMultiplier

```solidity
uint256 unitHiringFortHpMultiplier
```







### maxSettlementsPerRegion

```solidity
uint256 maxSettlementsPerRegion
```







### cultistsPerRegionMultiplier

```solidity
uint256 cultistsPerRegionMultiplier
```







### maxCultistsPerRegion

```solidity
uint256 maxCultistsPerRegion
```







### cultistUnitTypeId

```solidity
bytes32 cultistUnitTypeId
```







### buildingTokenTransferThresholdPercent

```solidity
uint256 buildingTokenTransferThresholdPercent
```







### productionTicksInSecond

```solidity
uint256 productionTicksInSecond
```







### maxAllowedUnitsToBuyPerTransaction

```solidity
uint256 maxAllowedUnitsToBuyPerTransaction
```







### maxAllowedWorkersToBuyPerTransaction

```solidity
uint256 maxAllowedWorkersToBuyPerTransaction
```







### maxAdvancedProductionTileBuff

```solidity
uint256 maxAdvancedProductionTileBuff
```







### captureTileInitialDuration

```solidity
uint256 captureTileInitialDuration
```







### captureTileDurationPerTile

```solidity
uint256 captureTileDurationPerTile
```







### nextCaptureProsperityBasicThreshold

```solidity
uint256 nextCaptureProsperityBasicThreshold
```







### nextCaptureProsperityPerTileThreshold

```solidity
uint256 nextCaptureProsperityPerTileThreshold
```







### necessaryProsperityPercentForClaimingTileCapture

```solidity
uint256 necessaryProsperityPercentForClaimingTileCapture
```







### tileCaptureCancellationFee

```solidity
uint256 tileCaptureCancellationFee
```







### maxRegionTier

```solidity
uint256 maxRegionTier
```







### initialCorruptionIndexPerCultistMultiplier

```solidity
uint256 initialCorruptionIndexPerCultistMultiplier
```







### settlementPriceMultiplierPerIncreasedRegionTier

```solidity
uint256 settlementPriceMultiplierPerIncreasedRegionTier
```







### stunDurationOfCancelledSecretManeuver

```solidity
uint256 stunDurationOfCancelledSecretManeuver
```







### maxAllowedRobberyMultiplierIncreaseValue

```solidity
uint256 maxAllowedRobberyMultiplierIncreaseValue
```







### armyStunDurationPerRobberyMultiplier

```solidity
uint256 armyStunDurationPerRobberyMultiplier
```







### armyStunDurationByJoiningBattleAtAttackingSide

```solidity
uint256 armyStunDurationByJoiningBattleAtAttackingSide
```







### initialCaptureProsperityBasicValue

```solidity
uint256 initialCaptureProsperityBasicValue
```







### initialCaptureProsperityPerTileValue

```solidity
uint256 initialCaptureProsperityPerTileValue
```







### minimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion

```solidity
uint256 minimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion
```







### settlementPayToDecreaseCorruptionIndexPenaltyMultiplier

```solidity
uint256 settlementPayToDecreaseCorruptionIndexPenaltyMultiplier
```







### minimumBattleDuration

```solidity
uint256 minimumBattleDuration
```







### newSettlementPriceIncreaseMultiplier

```solidity
uint256 newSettlementPriceIncreaseMultiplier
```







### startingWorkerPrice

```solidity
uint256 startingWorkerPrice
```







### demilitarizationCooldown

```solidity
uint256 demilitarizationCooldown
```







### workersAmountForBuildingActivation

```solidity
uint256 workersAmountForBuildingActivation
```







### buildingCooldownDurationAfterActivation

```solidity
uint256 buildingCooldownDurationAfterActivation
```







### getInitialCultistsAmountByRegionTier

```solidity
function getInitialCultistsAmountByRegionTier(uint256 regionTier) internal pure returns (uint256)
```







### getUnitStartingPrice

```solidity
function getUnitStartingPrice(bytes32 unitTypeId) internal pure returns (uint256)
```







### getUnitStats

```solidity
function getUnitStats(bytes32 unitTypeId) internal pure returns (struct Config.UnitStats)
```







### getRobberyPointsToResourceMultiplier

```solidity
function getRobberyPointsToResourceMultiplier(bytes32 resourceTypeId) internal pure returns (uint256)
```







### getWorkerCapacityCoefficient

```solidity
function getWorkerCapacityCoefficient(bytes32 buildingTypeId) internal pure returns (uint256)
```







### getBuildingUpgradeCostMultiplier

```solidity
function getBuildingUpgradeCostMultiplier(bytes32 buildingTypeId) internal pure returns (uint256)
```







### getBasicProductionBuildingCoefficient

```solidity
function getBasicProductionBuildingCoefficient(bytes32 buildingTypeId) internal pure returns (uint256)
```







### getCorruptionIndexByResource

```solidity
function getCorruptionIndexByResource(bytes32 resourceTypeId) internal pure returns (uint256)
```







### getResourceWeight

```solidity
function getResourceWeight(bytes32 resourceTypeId) internal pure returns (uint256)
```







### getBuildingTypeIds

```solidity
function getBuildingTypeIds() internal pure returns (bytes32[])
```







### getGameResources

```solidity
function getGameResources() internal pure returns (struct Config.GameResource[])
```







### getGameUnits

```solidity
function getGameUnits() internal pure returns (struct Config.GameUnit[])
```







### getUnitTypeIds

```solidity
function getUnitTypeIds() internal pure returns (bytes32[])
```







### getUnitResourceUsagePer1SecondOfDecreasedManeuverDuration

```solidity
function getUnitResourceUsagePer1SecondOfDecreasedManeuverDuration(bytes32 unitTypeId) internal pure returns (uint256)
```







### getProsperityForUnitLiquidation

```solidity
function getProsperityForUnitLiquidation(bytes32 unitTypeId) internal pure returns (uint256)
```







### getWorkersForUnitLiquidation

```solidity
function getWorkersForUnitLiquidation(bytes32 unitTypeId) internal pure returns (uint256)
```







### getUnitPriceIncreaseByUnitTypeId

```solidity
function getUnitPriceIncreaseByUnitTypeId(bytes32 unitTypeId) internal pure returns (uint256, uint256)
```







### getUnitPriceDropByUnitTypeId

```solidity
function getUnitPriceDropByUnitTypeId(bytes32 unitTypeId) internal pure returns (uint256, uint256)
```







### getWorkerPriceIncreaseForEachWorker

```solidity
function getWorkerPriceIncreaseForEachWorker() internal pure returns (uint256, uint256)
```







### getWorkerPriceDrop

```solidity
function getWorkerPriceDrop() internal pure returns (uint256, uint256)
```







### getMaxCapturedTilesForSettlement

```solidity
function getMaxCapturedTilesForSettlement(uint8 tileBonusType) internal pure returns (uint256)
```







### getAdvancedProductionTileBonusByVariation

```solidity
function getAdvancedProductionTileBonusByVariation(uint8 variation) internal pure returns (bytes32, uint256)
```







### getUnitBattleMultiplierTileBonusByVariation

```solidity
function getUnitBattleMultiplierTileBonusByVariation(uint8 variation) internal pure returns (bytes32, uint256)
```







### getChanceForTileWithBonusByRegionTier

```solidity
function getChanceForTileWithBonusByRegionTier(uint256 regionTier) internal pure returns (uint256)
```







### getRegionInclusionPrice

```solidity
function getRegionInclusionPrice(uint256 regionTier) internal pure returns (uint256)
```







### getRegionOwnerSettlementPurchasePercent

```solidity
function getRegionOwnerSettlementPurchasePercent(uint256 regionTier) internal pure returns (uint256)
```







### getUnitPoolType

```solidity
function getUnitPoolType(bytes32 unitTypeId) internal pure returns (bytes32)
```







### getBuildingActivationPrice

```solidity
function getBuildingActivationPrice() internal pure returns (bytes32[], uint256[])
```







