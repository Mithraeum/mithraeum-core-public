## IRegistry


Functions related to current game configuration





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

### mightyCreator

```solidity
function mightyCreator() external view returns (address)
```

An address which can configure/reconfigure current game

_Immutable, initialized on the registry creation_




### worldAssetFactory

```solidity
function worldAssetFactory() external view returns (contract IWorldAssetFactory)
```

World asset factory

_During new world asset creation process registry is asked for factory contract_




### globalMultiplier

```solidity
function globalMultiplier() external view returns (uint256)
```

Global multiplier

_Immutable, initialized on the registry creation_




### settlementStartingPrice

```solidity
function settlementStartingPrice() external view returns (uint256)
```

Settlement starting price

_Immutable, initialized on the registry creation_




### OnlyMightyCreator

```solidity
error OnlyMightyCreator()
```

Thrown when attempting to call action which can only be called by mighty creator





### UnknownInputParameter

```solidity
error UnknownInputParameter()
```

Thrown when attempting to call function by providing unknown parameter





### init

```solidity
function init(uint256 globalMultiplier, uint256 settlementStartingPrice) external
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| globalMultiplier | uint256 | Global multiplier |
| settlementStartingPrice | uint256 | Settlement starting price |



### setMightyCreator

```solidity
function setMightyCreator(address newMightyCreator) external
```

Sets new mighty creator

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| newMightyCreator | address | New mighty creator |



### setWorldAssetFactory

```solidity
function setWorldAssetFactory(address worldAssetFactoryAddress) external
```

Sets provided address as world asset factory contract

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAssetFactoryAddress | address | World asset factory address |



### getWorkerCapacityCoefficient

```solidity
function getWorkerCapacityCoefficient(bytes32 buildingTypeId) external pure returns (uint256 workerCapacityCoefficient)
```

Calculates worker capacity coefficient for provided building type id

_Used for internal calculation of max workers for each building_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingTypeId | bytes32 | Building type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| workerCapacityCoefficient | uint256 | Worker capacity coefficient |


### getBasicProductionBuildingCoefficient

```solidity
function getBasicProductionBuildingCoefficient(bytes32 buildingTypeId) external pure returns (uint256 basicProductionBuildingCoefficient)
```

Calculates basic production building coefficient

_used for internal calculation of production result_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingTypeId | bytes32 | Building type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| basicProductionBuildingCoefficient | uint256 | Basic production building coefficient |


### getCorruptionIndexByResource

```solidity
function getCorruptionIndexByResource(bytes32 resourceTypeId) external pure returns (uint256 corruptionIndex)
```

Returns corruptionIndex by resource type id

_Used for calculation of how much corruptionIndex increased/decreased_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Resource type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| corruptionIndex | uint256 | Amount of corruptionIndex per 1 resource (both are in 1e18 precision) |


### getResourceWeight

```solidity
function getResourceWeight(bytes32 resourceTypeId) external pure returns (uint256 resourceWeight)
```

Returns resource weight

_Used for calculation how much prosperity will be produced by resource in treasury_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Resource type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceWeight | uint256 | Resource weight (in 1e0 precision) |


### getRobberyPointsPerDamageMultiplier

```solidity
function getRobberyPointsPerDamageMultiplier() external pure returns (uint256 robberyPointsPerDamageMultiplier)
```

Returns robbery points per damage multiplier

_Used for determination how much robbery points will be given_


| Name | Type | Description |
| ---- | ---- | ----------- |
| robberyPointsPerDamageMultiplier | uint256 | Robbery points per damage multiplier (in 1e18 precision) |


### getRobberyPointsToResourceMultiplier

```solidity
function getRobberyPointsToResourceMultiplier(bytes32 resourceTypeId) external view returns (uint256 robberyPointsToResourceMultiplier)
```

Returns robbery point multiplier by provided resource type id

_Used in calculation how many resources can be exchanged for robbery points_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Resource type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| robberyPointsToResourceMultiplier | uint256 | Robbery point multiplier (in 1e18 precision) |


### getGlobalMultiplier

```solidity
function getGlobalMultiplier() external view returns (uint256 globalMultiplier)
```

Returns global multiplier

_Used everywhere, where time is involved. Essentially determines game speed_


| Name | Type | Description |
| ---- | ---- | ----------- |
| globalMultiplier | uint256 | Global multiplier |


### getUnitStats

```solidity
function getUnitStats(bytes32 unitTypeId) external pure returns (struct IRegistry.UnitStats unitStats)
```

Returns unit stats by provided unit type

_Used everywhere, where game logic based on unit stats_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitStats | struct IRegistry.UnitStats | Unit stats |


### getToTreasuryPercent

```solidity
function getToTreasuryPercent() external pure returns (uint256 toTreasuryPercent)
```

Returns production to treasury percent

_Determines how much of buildings production will go to treasury (if not full)_

| Name | Type | Description |
| ---- | ---- | ----------- |



### getBaseBattleDuration

```solidity
function getBaseBattleDuration() external view returns (uint256 baseBattleDuration)
```

Returns base battle duration

_Used internally to determine how long battle will last_


| Name | Type | Description |
| ---- | ---- | ----------- |
| baseBattleDuration | uint256 | Base battle duration |


### getBattleDurationLosingArmyStunMultiplier

```solidity
function getBattleDurationLosingArmyStunMultiplier() external pure returns (uint256 battleDurationLosingArmyStunMultiplier)
```

Returns battle duration losing army stun multiplier

_Used internally to determine how long stun will last after army lost the battle_


| Name | Type | Description |
| ---- | ---- | ----------- |
| battleDurationLosingArmyStunMultiplier | uint256 | Battle duration losing army stun multiplier |


### getBattleDurationWinningArmyStunMultiplier

```solidity
function getBattleDurationWinningArmyStunMultiplier() external pure returns (uint256 battleDurationWinningArmyStunMultiplier)
```

Returns battle duration winning army stun multiplier

_Used internally to determine how long stun will last after army won the battle_


| Name | Type | Description |
| ---- | ---- | ----------- |
| battleDurationWinningArmyStunMultiplier | uint256 | Battle duration winning army stun multiplier |


### getManeuverDurationStunMultiplier

```solidity
function getManeuverDurationStunMultiplier() external pure returns (uint256 maneuverDurationStunMultiplier)
```

Returns maneuver duration stun multiplier

_Used internally to determine how long stun will last after armies' maneuver_


| Name | Type | Description |
| ---- | ---- | ----------- |
| maneuverDurationStunMultiplier | uint256 | Maneuver duration stun multiplier |


### getBuildingTypeIds

```solidity
function getBuildingTypeIds() external view returns (bytes32[] buildingTypeIds)
```

Returns game building type ids

_Used internally to determine which buildings will be created on placing settlement_


| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingTypeIds | bytes32[] | Building type ids |


### getUnitTypeIds

```solidity
function getUnitTypeIds() external view returns (bytes32[] unitTypeIds)
```

Returns game unit type ids

_Used internally in many places where interaction with units is necessary_


| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeIds | bytes32[] | Unit type ids |


### getGameResources

```solidity
function getGameResources() external view returns (struct IRegistry.GameResource[] resources)
```

Returns game resources

_Used internally to determine upgrade costs and providing initial resources for settlement owner based on his tier_

| Name | Type | Description |
| ---- | ---- | ----------- |



### getGameUnits

```solidity
function getGameUnits() external view returns (struct IRegistry.GameUnit[] units)
```

Returns game units

_Used internally in many places where interaction with units is necessary_


| Name | Type | Description |
| ---- | ---- | ----------- |
| units | struct IRegistry.GameUnit[] | Game units |


### getUnitHiringFortHpMultiplier

```solidity
function getUnitHiringFortHpMultiplier() external pure returns (uint256 unitHiringFortHpMultiplier)
```

Returns unit hiring fort hp multiplier

_Used to determine how much units in army can be presented based on its current fort hp and this parameter_


| Name | Type | Description |
| ---- | ---- | ----------- |
| unitHiringFortHpMultiplier | uint256 | Unit hiring fort hp multiplier |


### getUnitResourceUsagePer1SecondOfDecreasedManeuverDuration

```solidity
function getUnitResourceUsagePer1SecondOfDecreasedManeuverDuration(bytes32 unitTypeId) external pure returns (uint256 unitResourceUsagePer1SecondOfDecreasedManeuverDuration)
```

Returns how much resource unit can take from treasury to reduce maneuver duration

_Used internally to calculate army's maneuver speed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitResourceUsagePer1SecondOfDecreasedManeuverDuration | uint256 | Amount of resource to spend per unit per 1 second of decreased maneuver duration (in 1e18 precision) |


### getProsperityForUnitLiquidation

```solidity
function getProsperityForUnitLiquidation(bytes32 unitTypeId) external pure returns (uint256 prosperityPerUnit)
```

Returns how much prosperity will be given for provided unit type id

_Used internally to calculate how much prosperity will be given_


| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityPerUnit | uint256 | Prosperity amount per one unit (in 1e18 precision) |


### getWorkersForUnitLiquidation

```solidity
function getWorkersForUnitLiquidation(bytes32 unitTypeId) external pure returns (uint256 workersPerUnit)
```

Returns how much workers will be given for provided unit type id

_Used internally to calculate how much workers will be given_


| Name | Type | Description |
| ---- | ---- | ----------- |
| workersPerUnit | uint256 | Workers amount per one unit (in 1e18 precision) |


### getCultistsSummonDelay

```solidity
function getCultistsSummonDelay() external pure returns (uint256 cultistsSummonDelay)
```

Returns cultists summon delay

_Used to determine is cultists can be re-summoned_


| Name | Type | Description |
| ---- | ---- | ----------- |
| cultistsSummonDelay | uint256 | Cultists summon delay (in seconds) |


### getMaxSettlementsPerRegion

```solidity
function getMaxSettlementsPerRegion() external pure returns (uint256 maxSettlementsPerRegion)
```

Returns max settlements that can be placed in one region

_Cultists does not count (so +1 with cultists)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| maxSettlementsPerRegion | uint256 | Max settlements that can be placed in one region |


### getCultistsNoDestructionDelay

```solidity
function getCultistsNoDestructionDelay() external pure returns (uint256 cultistsNoDestructionDelay)
```

Returns interval duration where world is not destructible after recent cultists summon

_Used to determine if destruction is available or not_


| Name | Type | Description |
| ---- | ---- | ----------- |
| cultistsNoDestructionDelay | uint256 | No destruction interval duration (in seconds) |


### getCultistsPerRegionMultiplier

```solidity
function getCultistsPerRegionMultiplier() external pure returns (uint256 cultistsPerRegionMultiplier)
```

Returns value of cultists per region which determines cultists threshold for world destruction

_Used to determine amount of cultists that have to be present for world destruction_


| Name | Type | Description |
| ---- | ---- | ----------- |
| cultistsPerRegionMultiplier | uint256 | Value of cultists per region |


### getMaxCultistsPerRegion

```solidity
function getMaxCultistsPerRegion() external pure returns (uint256 maxCultistsPerRegion)
```

Returns maximum amount of cultists that can be present in region

_Used to determine how many cultists will be summoned_


| Name | Type | Description |
| ---- | ---- | ----------- |
| maxCultistsPerRegion | uint256 | Maximum amount of cultists |


### getCultistUnitTypeId

```solidity
function getCultistUnitTypeId() external pure returns (bytes32 cultistUnitTypeId)
```

Returns unit type id of cultists army

_Determines type of unit in cultists army_


| Name | Type | Description |
| ---- | ---- | ----------- |
| cultistUnitTypeId | bytes32 | Cultists unit type id |


### getBuildingTokenTransferThresholdPercent

```solidity
function getBuildingTokenTransferThresholdPercent() external pure returns (uint256 buildingTokenTransferThresholdPercent)
```

Returns building token transfer threshold percent

_Used to determine is building token transfer allowed based on treasury percent_


| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingTokenTransferThresholdPercent | uint256 | Building token transfer threshold percent |


### getNewSettlementStartingPrice

```solidity
function getNewSettlementStartingPrice() external view returns (uint256 newSettlementStartingPrice)
```

Returns new settlement starting price in settlements market

_Used to determine how much base price for first settlement will be_


| Name | Type | Description |
| ---- | ---- | ----------- |
| newSettlementStartingPrice | uint256 | New settlement starting price |


### getProductionTicksInSecond

```solidity
function getProductionTicksInSecond() external view returns (uint256 ticks)
```

Returns amount of production ticks

_Used for production calculation_


| Name | Type | Description |
| ---- | ---- | ----------- |
| ticks | uint256 | Amount of production ticks |


### getUnitPriceIncreaseForEachUnit

```solidity
function getUnitPriceIncreaseForEachUnit() external pure returns (uint256 numerator, uint256 denominator)
```

Returns unit price increase in unit pool for each extra unit to buy (value returned as numerator and denominator)

_Used for determination of unit price_


| Name | Type | Description |
| ---- | ---- | ----------- |
| numerator | uint256 | Numerator |
| denominator | uint256 | Denominator |


### getMaxAllowedUnitsToBuyPerTransaction

```solidity
function getMaxAllowedUnitsToBuyPerTransaction() external pure returns (uint256 maxAllowedUnitsToBuy)
```

Returns max allowed units to buy per transaction

_Limit specified in order to limit potential price overflows (value is returned in 1e18 precision)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| maxAllowedUnitsToBuy | uint256 | Max allowed units to buy |


### getUnitPriceDropByUnitTypeId

```solidity
function getUnitPriceDropByUnitTypeId(bytes32 unitTypeId) external pure returns (uint256 numerator, uint256 denominator)
```

Returns unit pool price drop per second for provided unit type id (value returned as numerator and denominator)

_Used for determination of current unit pool price_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| numerator | uint256 | Numerator |
| denominator | uint256 | Denominator |


### getWorkerPriceIncreaseForEachWorker

```solidity
function getWorkerPriceIncreaseForEachWorker() external pure returns (uint256 numerator, uint256 denominator)
```

Returns worker pool price drop per second for each worker (value returned as numerator and denominator)

_Used for determination of worker price_


| Name | Type | Description |
| ---- | ---- | ----------- |
| numerator | uint256 | Numerator |
| denominator | uint256 | Denominator |


### getMaxAllowedWorkersToBuyPerTransaction

```solidity
function getMaxAllowedWorkersToBuyPerTransaction() external pure returns (uint256 maxAllowedWorkersToBuy)
```

Returns max allowed workers to buy per transaction

_Limit specified in order to limit potential price overflows (value is returned in 1e18 precision)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| maxAllowedWorkersToBuy | uint256 | Max allowed workers to buy |


### getWorkerPriceDrop

```solidity
function getWorkerPriceDrop() external pure returns (uint256 numerator, uint256 denominator)
```

Returns workers pool price drop per second, provided as numerator and denominator

_Used for determination of current workers pool price_


| Name | Type | Description |
| ---- | ---- | ----------- |
| numerator | uint256 | Numerator |
| denominator | uint256 | Denominator |


### getMaxAdvancedProductionTileBuff

```solidity
function getMaxAdvancedProductionTileBuff() external pure returns (uint256 maxAdvancedProductionTileBuff)
```

Returns max potential advanced production buff gain from capturing tiles

_Used for determination advanced production multiplier_


| Name | Type | Description |
| ---- | ---- | ----------- |
| maxAdvancedProductionTileBuff | uint256 | Max potential advanced production from tile buff |


### getCaptureTileDurationPerTile

```solidity
function getCaptureTileDurationPerTile() external pure returns (uint256 captureTileDurationPerTile)
```

Returns capture tile duration per each tile in distance from settlement to selected tile

_Used to capture tile duration calculation_


| Name | Type | Description |
| ---- | ---- | ----------- |
| captureTileDurationPerTile | uint256 | Capture tile duration per tile |


### getNextCaptureProsperityBasicThreshold

```solidity
function getNextCaptureProsperityBasicThreshold() external pure returns (uint256 nextCaptureProsperityBasicThreshold)
```

Returns next capture prosperity basic threshold

_Used to determine if new bid on captured tile is possible_


| Name | Type | Description |
| ---- | ---- | ----------- |
| nextCaptureProsperityBasicThreshold | uint256 | Next capture prosperity basic threshold |


### getNextCaptureProsperityPerTileThreshold

```solidity
function getNextCaptureProsperityPerTileThreshold() external pure returns (uint256 nextCaptureProsperityPerTileThreshold)
```

Returns next capture prosperity per tile threshold

_Used to determine if new bid on captured tile is possible_


| Name | Type | Description |
| ---- | ---- | ----------- |
| nextCaptureProsperityPerTileThreshold | uint256 | Next capture prosperity per tile threshold |


### getNecessaryProsperityPercentForClaimingTileCapture

```solidity
function getNecessaryProsperityPercentForClaimingTileCapture() external pure returns (uint256 necessaryProsperityPercentForClaimingTileCapture)
```

Returns percent of prosperity that has to be in settlement for claiming captured tile

_Used to determine if tile claim is possible_


| Name | Type | Description |
| ---- | ---- | ----------- |
| necessaryProsperityPercentForClaimingTileCapture | uint256 | Necessary prosperity percent for claiming tile capture |


### getTileCaptureCancellationFee

```solidity
function getTileCaptureCancellationFee() external pure returns (uint256 tileCaptureCancellationFee)
```

Returns tile capture cancellation fee

_Used to determine how much prosperity has to be given in order to cancel tile capture_


| Name | Type | Description |
| ---- | ---- | ----------- |
| tileCaptureCancellationFee | uint256 | Tile capture cancellation fee |


### getMaxCapturedTilesForSettlement

```solidity
function getMaxCapturedTilesForSettlement(uint8 tileBonusType) external pure returns (uint256 maxCapturedTilesForSettlement)
```

Returns max captured tiles for settlement

_Used to determine whether settlement can initiate tile capture_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tileBonusType | uint8 | Tile bonus type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| maxCapturedTilesForSettlement | uint256 | Max captured tiles for settlement with this bonus type |


### getAdvancedProductionTileBonusByVariation

```solidity
function getAdvancedProductionTileBonusByVariation(uint8 tileBonusVariation) external pure returns (bytes32 buildingTypeId, uint256 capacityAmountMultiplier)
```

Returns advanced production tile bonus by variation

_Used to determine tile bonus by tile bonus variation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tileBonusVariation | uint8 | Tile bonus variation |

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingTypeId | bytes32 | Building type id |
| capacityAmountMultiplier | uint256 | Capacity amount multiplier |


### getUnitBattleMultiplierTileBonusByVariation

```solidity
function getUnitBattleMultiplierTileBonusByVariation(uint8 tileBonusVariation) external pure returns (bytes32 unitTypeId, uint256 unitBattleMultiplier)
```

Returns unit battle multiplier tile bonus by variation

_Used to determine tile bonus by tile bonus variation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tileBonusVariation | uint8 | Tile bonus variation |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |
| unitBattleMultiplier | uint256 | Unit battle multiplier |


### getMaxRegionTier

```solidity
function getMaxRegionTier() external pure returns (uint256 maxRegionTier)
```

Returns max region tier

_Used in validation in region tier increase_


| Name | Type | Description |
| ---- | ---- | ----------- |
| maxRegionTier | uint256 | Max region tier |


### getInitialCultistsAmountPerRegionTier

```solidity
function getInitialCultistsAmountPerRegionTier() external pure returns (uint256 initialCultistsAmount)
```

Returns initial cultists amount per region tier

_Used in region activation_


| Name | Type | Description |
| ---- | ---- | ----------- |
| initialCultistsAmount | uint256 | Initial cultists amount |


### getInitialCorruptionIndexAmountPerRegionTier

```solidity
function getInitialCorruptionIndexAmountPerRegionTier() external pure returns (uint256 initialCorruptionIndexAmount)
```

Returns initial corruptionIndex amount per region tier

_Used in region activation and region tier increase handler_


| Name | Type | Description |
| ---- | ---- | ----------- |
| initialCorruptionIndexAmount | uint256 | Initial corruptionIndex amount |


### getSettlementPriceMultiplierPerIncreasedRegionTier

```solidity
function getSettlementPriceMultiplierPerIncreasedRegionTier() external pure returns (uint256 settlementPriceMultiplierPerIncreasedRegionTier)
```

Returns settlement price multiplier per increased region tier

_Used in calculation of new settlement price_


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementPriceMultiplierPerIncreasedRegionTier | uint256 | Settlement price multiplier per increased region tier |


### getStunDurationMultiplierOfCancelledSecretManeuver

```solidity
function getStunDurationMultiplierOfCancelledSecretManeuver() external pure returns (uint256 stunMultiplierOfCancelledSecretManeuver)
```

Returns stun duration multiplier of cancelled secret maneuver

_Used in calculation of stun duration during cancelling secret maneuver_


| Name | Type | Description |
| ---- | ---- | ----------- |
| stunMultiplierOfCancelledSecretManeuver | uint256 | Stun multiplier of cancelled secret maneuver |


### getMaxAllowedRobberyMultiplierIncreaseValue

```solidity
function getMaxAllowedRobberyMultiplierIncreaseValue() external pure returns (uint256 maxAllowedRobberyMultiplierIncreaseValue)
```

Returns max allowed robbery multiplier increase value

_Used in army siege modification_


| Name | Type | Description |
| ---- | ---- | ----------- |
| maxAllowedRobberyMultiplierIncreaseValue | uint256 | Max allowed robbery multiplier increase value |


### getArmyStunDurationPerRobberyMultiplier

```solidity
function getArmyStunDurationPerRobberyMultiplier() external pure returns (uint256 armyStunDurationPerRobberyMultiplier)
```

Returns army stun duration per one point of added robbery multiplier

_Used in army siege modification_


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyStunDurationPerRobberyMultiplier | uint256 | Army stun duration per robbery multiplier |


### getChanceForTileWithBonusByRegionTier

```solidity
function getChanceForTileWithBonusByRegionTier(uint256 regionTier) external pure returns (uint256 chanceForTileWithBonus)
```

Returns chance for tile with bonus by region tier

_Used to determine whether tile has bonus or not_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionTier | uint256 | Region tier |

| Name | Type | Description |
| ---- | ---- | ----------- |
| chanceForTileWithBonus | uint256 | Chance for tile with bonus (in 1e18 precision) |


### getRegionInclusionPrice

```solidity
function getRegionInclusionPrice(uint256 regionTier) external pure returns (uint256 regionInclusionPrice)
```

Returns region inclusion price

_Used to determine amount of token to be taken from msg.sender in order to include region_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionTier | uint256 | Region tier |

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionInclusionPrice | uint256 | Region inclusion price |


### getRegionOwnerSettlementPurchasePercent

```solidity
function getRegionOwnerSettlementPurchasePercent(uint256 regionTier) external pure returns (uint256 percent)
```

Returns region owner settlement purchase percent

_Used to determine amount of tokens to be sent to region owner when another user buys settlement in his region_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionTier | uint256 | Region tier |

| Name | Type | Description |
| ---- | ---- | ----------- |
| percent | uint256 | Percent (in 1e18 precision) |


### getUnitPoolType

```solidity
function getUnitPoolType(bytes32 unitTypeId) external pure returns (bytes32 unitPoolType)
```

Returns unit pool type by unit type id

_Used to determine which implementation of unit pool to use for provided unit type_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitPoolType | bytes32 | Unit pool type |


### getArmyStunDurationByJoiningBattleAtAttackingSide

```solidity
function getArmyStunDurationByJoiningBattleAtAttackingSide() external pure returns (uint256 stunDuration)
```

Returns stun duration army will receive by joining battle at attacking side

_Used to determine stun duration army will receive by joining battle at attacking side_


| Name | Type | Description |
| ---- | ---- | ----------- |
| stunDuration | uint256 | Stun duration |


### getInitialCaptureProsperityBasicValue

```solidity
function getInitialCaptureProsperityBasicValue() external pure returns (uint256 initialCaptureProsperityBasicValue)
```

Returns initial capture prosperity basic value

_Used to determine if new bid on captured tile is possible_


| Name | Type | Description |
| ---- | ---- | ----------- |
| initialCaptureProsperityBasicValue | uint256 | Initial capture prosperity basic value |


### getInitialCaptureProsperityPerTileValue

```solidity
function getInitialCaptureProsperityPerTileValue() external pure returns (uint256 initialCaptureProsperityPerTileValue)
```

Returns initial capture prosperity per tile value

_Used to determine if new bid on captured tile is possible_


| Name | Type | Description |
| ---- | ---- | ----------- |
| initialCaptureProsperityPerTileValue | uint256 | Initial capture prosperity per tile value |


### getMinimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion

```solidity
function getMinimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion() external pure returns (uint256 minimumUserSettlementsCount)
```

Returns minimum user settlements count in neighboring region required to include region

_Used to determine whether region can be included or not_


| Name | Type | Description |
| ---- | ---- | ----------- |
| minimumUserSettlementsCount | uint256 | Minimum user settlements count |


### getSettlementPayToDecreaseCorruptionIndexPenaltyMultiplier

```solidity
function getSettlementPayToDecreaseCorruptionIndexPenaltyMultiplier() external pure returns (uint256 penaltyMultiplier)
```

Returns settlement pay to decrease corruptionIndex penalty multiplier

_Used to determine how much corruptionIndex penalty settlement will endure whenever its corruptionIndex is lowered by paying to reward pool_


| Name | Type | Description |
| ---- | ---- | ----------- |
| penaltyMultiplier | uint256 | Penalty multiplier |


### getMinimumBattleDuration

```solidity
function getMinimumBattleDuration() external pure returns (uint256 minimumBattleDuration)
```

Returns minimum battle duration

_Used to determine battle duration ignoring current world multiplier_


| Name | Type | Description |
| ---- | ---- | ----------- |
| minimumBattleDuration | uint256 | Minimum battle duration |


### getNewSettlementPriceIncreaseMultiplier

```solidity
function getNewSettlementPriceIncreaseMultiplier() external pure returns (uint256 newSettlementPriceIncreaseMultiplier)
```

Returns new settlement price increase multiplier

_Used to determine new settlement purchase price (in 1e18 precision)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| newSettlementPriceIncreaseMultiplier | uint256 | New settlement price increase multiplier |


