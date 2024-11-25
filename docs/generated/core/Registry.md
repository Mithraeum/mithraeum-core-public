## Registry








### mightyCreator

```solidity
address mightyCreator
```

An address which can configure/reconfigure current game

_Immutable, initialized on the registry creation_




### worldAssetFactory

```solidity
contract IWorldAssetFactory worldAssetFactory
```

World asset factory

_During new world asset creation process registry is asked for factory contract_




### onlyMightyCreator

```solidity
modifier onlyMightyCreator()
```



_Only mighty creator modifier
Modifier is calling internal function in order to reduce contract size_




### init

```solidity
function init() public
```

Proxy initializer

_Called by address which created current instance_




### setMightyCreator

```solidity
function setMightyCreator(address newMightyCreator) public
```

Sets new mighty creator

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| newMightyCreator | address | New mighty creator |



### setWorldAssetFactory

```solidity
function setWorldAssetFactory(address worldAssetFactoryAddress) public
```

Sets provided address as world asset factory contract

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAssetFactoryAddress | address | World asset factory address |



### getGlobalMultiplier

```solidity
function getGlobalMultiplier() public view returns (uint256)
```

Returns global multiplier

_Used everywhere, where time is involved. Essentially determines game speed_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getUnitStats

```solidity
function getUnitStats(bytes32 unitTypeId) public pure returns (struct Config.UnitStats)
```

Returns unit stats by provided unit type

_Used everywhere, where game logic based on unit stats_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct Config.UnitStats |  |


### getRobberyPointsPerDamageMultiplier

```solidity
function getRobberyPointsPerDamageMultiplier() public pure returns (uint256)
```

Returns robbery points per damage multiplier

_Used for determination how much robbery points will be given_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getRobberyPointsToResourceMultiplier

```solidity
function getRobberyPointsToResourceMultiplier(bytes32 resourceTypeId) public view returns (uint256)
```

Returns robbery point multiplier by provided resource type id

_Used in calculation how many resources can be exchanged for robbery points_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Resource type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getWorkerCapacityCoefficient

```solidity
function getWorkerCapacityCoefficient(bytes32 buildingTypeId) public pure returns (uint256)
```

Calculates worker capacity coefficient for provided building type id

_Used for internal calculation of max workers for each building_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingTypeId | bytes32 | Building type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getBuildingUpgradeCostMultiplier

```solidity
function getBuildingUpgradeCostMultiplier(bytes32 buildingTypeId) public pure returns (uint256)
```

Returns building upgrade cost multiplier by provided building type

_Used for internal calculation of building upgrade cost_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingTypeId | bytes32 | Building type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getBasicProductionBuildingCoefficient

```solidity
function getBasicProductionBuildingCoefficient(bytes32 buildingTypeId) public pure returns (uint256)
```

Calculates basic production building coefficient

_used for internal calculation of production result_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingTypeId | bytes32 | Building type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getCorruptionIndexByResource

```solidity
function getCorruptionIndexByResource(bytes32 resourceTypeId) public pure returns (uint256)
```

Returns corruptionIndex by resource type id

_Used for calculation of how much corruptionIndex increased/decreased_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Resource type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getResourceWeight

```solidity
function getResourceWeight(bytes32 resourceTypeId) public pure returns (uint256)
```

Returns resource weight

_Used for calculation how much prosperity will be produced by resource in treasury_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Resource type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getToTreasuryPercent

```solidity
function getToTreasuryPercent() public pure returns (uint256)
```

Returns production to treasury percent

_Determines how much of buildings production will go to treasury (if not full)_

| Name | Type | Description |
| ---- | ---- | ----------- |



### getBaseBattleDuration

```solidity
function getBaseBattleDuration() public pure returns (uint256)
```

Returns base battle duration

_Used internally to determine how long battle will last_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getBattleDurationLosingArmyStunMultiplier

```solidity
function getBattleDurationLosingArmyStunMultiplier() public pure returns (uint256)
```

Returns battle duration losing army stun multiplier

_Used internally to determine how long stun will last after army lost the battle_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getBattleDurationWinningArmyStunMultiplier

```solidity
function getBattleDurationWinningArmyStunMultiplier() public pure returns (uint256)
```

Returns battle duration winning army stun multiplier

_Used internally to determine how long stun will last after army won the battle_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getManeuverStunDuration

```solidity
function getManeuverStunDuration() public pure returns (uint256)
```

Returns maneuver stun duration

_Used internally to determine how long stun will last after armies' maneuver_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getBuildingTypeIds

```solidity
function getBuildingTypeIds() public pure returns (bytes32[])
```

Returns game building type ids

_Used internally to determine which buildings will be created on placing settlement_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32[] |  |


### getGameResources

```solidity
function getGameResources() public pure returns (struct Config.GameResource[])
```

Returns game resources

_Used internally to determine upgrade costs and providing initial resources for settlement owner based on his tier_

| Name | Type | Description |
| ---- | ---- | ----------- |



### getGameUnits

```solidity
function getGameUnits() public pure returns (struct Config.GameUnit[])
```

Returns game units

_Used internally in many places where interaction with units is necessary_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct Config.GameUnit[] |  |


### getUnitTypeIds

```solidity
function getUnitTypeIds() public pure returns (bytes32[])
```

Returns game unit type ids

_Used internally in many places where interaction with units is necessary_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32[] |  |


### getUnitHiringFortHpMultiplier

```solidity
function getUnitHiringFortHpMultiplier() public pure returns (uint256)
```

Returns unit hiring fort hp multiplier

_Used to determine how much units in army can be presented based on its current fort hp and this parameter_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getUnitResourceUsagePer1SecondOfDecreasedManeuverDuration

```solidity
function getUnitResourceUsagePer1SecondOfDecreasedManeuverDuration(bytes32 unitTypeId) public pure returns (uint256)
```

Returns how much resource unit can take from treasury to reduce maneuver duration

_Used internally to calculate army's maneuver speed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getProsperityForUnitLiquidation

```solidity
function getProsperityForUnitLiquidation(bytes32 unitTypeId) public pure returns (uint256)
```

Returns how much prosperity will be given for provided unit type id

_Used internally to calculate how much prosperity will be given_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getWorkersForUnitLiquidation

```solidity
function getWorkersForUnitLiquidation(bytes32 unitTypeId) public pure returns (uint256)
```

Returns how much workers will be given for provided unit type id

_Used internally to calculate how much workers will be given_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getCultistsSummonDelay

```solidity
function getCultistsSummonDelay() public pure returns (uint256)
```

Returns cultists summon delay

_Used to determine is cultists can be re-summoned_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getMaxSettlementsPerRegion

```solidity
function getMaxSettlementsPerRegion() public pure returns (uint256)
```

Returns max settlements that can be placed in one region

_Cultists does not count (so +1 with cultists)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getCultistsNoDestructionDelay

```solidity
function getCultistsNoDestructionDelay() public pure returns (uint256)
```

Returns interval duration where world is not destructible after recent cultists summon

_Used to determine if destruction is available or not_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getCultistsPerRegionMultiplier

```solidity
function getCultistsPerRegionMultiplier() public pure returns (uint256)
```

Returns value of cultists per region which determines cultists threshold for world destruction

_Used to determine amount of cultists that have to be present for world destruction_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getMaxCultistsPerRegion

```solidity
function getMaxCultistsPerRegion() public pure returns (uint256)
```

Returns maximum amount of cultists that can be present in region

_Used to determine how many cultists will be summoned_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getCultistUnitTypeId

```solidity
function getCultistUnitTypeId() public pure returns (bytes32)
```

Returns unit type id of cultists army

_Determines type of unit in cultists army_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 |  |


### getBuildingTokenTransferThresholdPercent

```solidity
function getBuildingTokenTransferThresholdPercent() public pure returns (uint256)
```

Returns building token transfer threshold percent

_Used to determine is building token transfer allowed based on treasury percent_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getNewSettlementStartingPrice

```solidity
function getNewSettlementStartingPrice() public view returns (uint256)
```

Returns new settlement starting price in settlements market

_Used to determine how much base price for first settlement will be_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getProductionTicksInSecond

```solidity
function getProductionTicksInSecond() public view returns (uint256)
```

Returns amount of production ticks

_Used for production calculation_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getUnitPriceIncreaseByUnitTypeId

```solidity
function getUnitPriceIncreaseByUnitTypeId(bytes32 unitTypeId) public pure returns (uint256, uint256)
```

Returns unit price increase in unit pool for each extra unit to buy (value returned as numerator and denominator)

_Used for determination of unit price_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


### getMaxAllowedUnitsToBuyPerTransaction

```solidity
function getMaxAllowedUnitsToBuyPerTransaction() public pure returns (uint256)
```

Returns max allowed units to buy per transaction

_Limit specified in order to limit potential price overflows (value is returned in 1e18 precision)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getUnitPriceDropByUnitTypeId

```solidity
function getUnitPriceDropByUnitTypeId(bytes32 unitTypeId) public pure returns (uint256, uint256)
```

Returns unit pool price drop per second for provided unit type id (value returned as numerator and denominator)

_Used for determination of current unit pool price_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


### getWorkerPriceIncreaseForEachWorker

```solidity
function getWorkerPriceIncreaseForEachWorker() public pure returns (uint256, uint256)
```

Returns worker pool price drop per second for each worker (value returned as numerator and denominator)

_Used for determination of worker price_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


### getMaxAllowedWorkersToBuyPerTransaction

```solidity
function getMaxAllowedWorkersToBuyPerTransaction() public pure returns (uint256)
```

Returns max allowed workers to buy per transaction

_Limit specified in order to limit potential price overflows (value is returned in 1e18 precision)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getWorkerPriceDrop

```solidity
function getWorkerPriceDrop() public pure returns (uint256, uint256)
```

Returns workers pool price drop per second, provided as numerator and denominator

_Used for determination of current workers pool price_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


### getMaxAdvancedProductionTileBuff

```solidity
function getMaxAdvancedProductionTileBuff() public pure returns (uint256)
```

Returns max potential advanced production buff gain from capturing tiles

_Used for determination advanced production multiplier_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getCaptureTileDurationPerTile

```solidity
function getCaptureTileDurationPerTile() public pure returns (uint256)
```

Returns capture tile duration per each tile in distance from settlement to selected tile

_Used to capture tile duration calculation_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getNextCaptureProsperityBasicThreshold

```solidity
function getNextCaptureProsperityBasicThreshold() public pure returns (uint256)
```

Returns next capture prosperity basic threshold

_Used to determine if new bid on captured tile is possible_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getNextCaptureProsperityPerTileThreshold

```solidity
function getNextCaptureProsperityPerTileThreshold() public pure returns (uint256)
```

Returns next capture prosperity per tile threshold

_Used to determine if new bid on captured tile is possible_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getNecessaryProsperityPercentForClaimingTileCapture

```solidity
function getNecessaryProsperityPercentForClaimingTileCapture() public pure returns (uint256)
```

Returns percent of prosperity that has to be in settlement for claiming captured tile

_Used to determine if tile claim is possible_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getTileCaptureCancellationFee

```solidity
function getTileCaptureCancellationFee() public pure returns (uint256)
```

Returns tile capture cancellation fee

_Used to determine how much prosperity has to be given in order to cancel tile capture_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getMaxCapturedTilesForSettlement

```solidity
function getMaxCapturedTilesForSettlement(uint8 tileBonusType) public pure returns (uint256)
```

Returns max captured tiles for settlement

_Used to determine whether settlement can initiate tile capture_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tileBonusType | uint8 | Tile bonus type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getAdvancedProductionTileBonusByVariation

```solidity
function getAdvancedProductionTileBonusByVariation(uint8 variation) public pure returns (bytes32, uint256)
```

Returns advanced production tile bonus by variation

_Used to determine tile bonus by tile bonus variation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| variation | uint8 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 |  |
| [1] | uint256 |  |


### getUnitBattleMultiplierTileBonusByVariation

```solidity
function getUnitBattleMultiplierTileBonusByVariation(uint8 variation) public pure returns (bytes32, uint256)
```

Returns unit battle multiplier tile bonus by variation

_Used to determine tile bonus by tile bonus variation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| variation | uint8 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 |  |
| [1] | uint256 |  |


### getMaxRegionTier

```solidity
function getMaxRegionTier() public pure returns (uint256)
```

Returns max region tier

_Used in validation in region tier increase_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getInitialCultistsAmountByRegionTier

```solidity
function getInitialCultistsAmountByRegionTier(uint256 regionTier) public pure returns (uint256)
```

Returns initial cultists amount by region tier

_Used in region activation_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getInitialCorruptionIndexPerCultistMultiplier

```solidity
function getInitialCorruptionIndexPerCultistMultiplier() public pure returns (uint256)
```

Returns initial corruptionIndex amount per initial cultist multiplier

_Used in region activation and region tier increase handler_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getSettlementPriceMultiplierPerIncreasedRegionTier

```solidity
function getSettlementPriceMultiplierPerIncreasedRegionTier() public pure returns (uint256)
```

Returns settlement price multiplier per increased region tier

_Used in calculation of new settlement price_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getStunDurationOfCancelledSecretManeuver

```solidity
function getStunDurationOfCancelledSecretManeuver() public pure returns (uint256)
```

Returns stun duration of cancelled secret maneuver

_Used in calculation of stun duration during cancelling secret maneuver_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getDemilitarizationCooldown

```solidity
function getDemilitarizationCooldown() public pure returns (uint256)
```

Returns demilitarization cooldown

_Used in determining whether army can be demilitarized at this point_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getMaxAllowedRobberyMultiplierIncreaseValue

```solidity
function getMaxAllowedRobberyMultiplierIncreaseValue() public pure returns (uint256)
```

Returns max allowed robbery multiplier increase value

_Used in army siege modification_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getArmyStunDurationPerRobberyMultiplier

```solidity
function getArmyStunDurationPerRobberyMultiplier() public pure returns (uint256)
```

Returns army stun duration per one point of added robbery multiplier

_Used in army siege modification_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getChanceForTileWithBonusByRegionTier

```solidity
function getChanceForTileWithBonusByRegionTier(uint256 regionTier) public pure returns (uint256)
```

Returns chance for tile with bonus by region tier

_Used to determine whether tile has bonus or not_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionTier | uint256 | Region tier |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getRegionInclusionPrice

```solidity
function getRegionInclusionPrice(uint256 regionTier) public pure returns (uint256)
```

Returns region inclusion price

_Used to determine amount of token to be taken from msg.sender in order to include region_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionTier | uint256 | Region tier |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getRegionOwnerSettlementPurchasePercent

```solidity
function getRegionOwnerSettlementPurchasePercent(uint256 regionTier) public pure returns (uint256)
```

Returns region owner settlement purchase percent

_Used to determine amount of tokens to be sent to region owner when another user buys settlement in his region_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionTier | uint256 | Region tier |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getUnitPoolType

```solidity
function getUnitPoolType(bytes32 unitTypeId) public pure returns (bytes32)
```

Returns unit pool type by unit type id

_Used to determine which implementation of unit pool to use for provided unit type_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 |  |


### getArmyStunDurationByJoiningBattleAtAttackingSide

```solidity
function getArmyStunDurationByJoiningBattleAtAttackingSide() public pure returns (uint256)
```

Returns stun duration army will receive by joining battle at attacking side

_Used to determine stun duration army will receive by joining battle at attacking side_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getInitialCaptureProsperityBasicValue

```solidity
function getInitialCaptureProsperityBasicValue() public pure returns (uint256)
```

Returns initial capture prosperity basic value

_Used to determine if new bid on captured tile is possible_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getInitialCaptureProsperityPerTileValue

```solidity
function getInitialCaptureProsperityPerTileValue() public pure returns (uint256)
```

Returns initial capture prosperity per tile value

_Used to determine if new bid on captured tile is possible_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getCaptureTileInitialDuration

```solidity
function getCaptureTileInitialDuration() public pure returns (uint256)
```

Returns capture tile initial duration

_Used to determine how long tile capturing will last_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getMinimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion

```solidity
function getMinimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion() public pure returns (uint256)
```

Returns minimum user settlements count in neighboring region required to include region

_Used to determine whether region can be included or not_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getSettlementPayToDecreaseCorruptionIndexPenaltyMultiplier

```solidity
function getSettlementPayToDecreaseCorruptionIndexPenaltyMultiplier() public pure returns (uint256)
```

Returns settlement pay to decrease corruptionIndex penalty multiplier

_Used to determine how much corruptionIndex penalty settlement will endure whenever its corruptionIndex is lowered by paying to reward pool_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getMinimumBattleDuration

```solidity
function getMinimumBattleDuration() public pure returns (uint256)
```

Returns minimum battle duration

_Used to determine battle duration ignoring current world multiplier_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getNewSettlementPriceIncreaseMultiplier

```solidity
function getNewSettlementPriceIncreaseMultiplier() public pure returns (uint256)
```

Returns new settlement price increase multiplier

_Used to determine new settlement purchase price (in 1e18 precision)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getBuildingActivationPrice

```solidity
function getBuildingActivationPrice() public pure returns (bytes32[], uint256[])
```

Returns building activation price

_Determines which and how much resources must be taken from user in order to activate building_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32[] |  |
| [1] | uint256[] |  |


### getBuildingCooldownDurationAfterActivation

```solidity
function getBuildingCooldownDurationAfterActivation() public pure returns (uint256)
```

Returns building cooldown duration after building activation

_Determines how long building wont be able to receive upgrades after activation and how long user must wait in order to claim workers for building activation_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getWorkersAmountForBuildingActivation

```solidity
function getWorkersAmountForBuildingActivation() public pure returns (uint256)
```

Returns amount of workers able to be claimed for building activation

_Determines how much workers will be given to the user_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### _onlyMightyCreator

```solidity
function _onlyMightyCreator() internal view
```



_Allows caller to be only mighty creator_




