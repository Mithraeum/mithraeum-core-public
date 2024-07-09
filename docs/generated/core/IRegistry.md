## IRegistry


Functions related to current game configuration





### GameResource








```solidity
struct GameResource {
  string tokenName;
  string tokenSymbol;
  string worldResourceName;
}
```

### GameUnit








```solidity
struct GameUnit {
  string tokenName;
  string tokenSymbol;
  string worldUnitName;
}
```

### ExtraResource








```solidity
struct ExtraResource {
  string resourceName;
  uint256 value;
}
```

### UnitStats








```solidity
struct UnitStats {
  uint256 weaponPowerStage1;
  uint256 armourPowerStage1;
  uint256 weaponPowerStage2;
  uint256 armourPowerStage2;
  uint256 siegePower;
  uint256 siegeMaxSupply;
  uint256 siegeSupport;
}
```

### mightyCreator

```solidity
function mightyCreator() external view returns (address)
```

An address which can configure/reconfigure current game

_Immutable, initialized on the registry creation_




### isFactoryContract

```solidity
function isFactoryContract(address factoryAddress) external view returns (bool)
```

Mapping containing is provided address a factory contract or not

_Updated when #setFactoryContract is called_




### factoryContracts

```solidity
function factoryContracts(bytes32 scriptId) external view returns (address)
```

Mapping containing factory contracts addresses by provided asset types

_Updated when #setFactoryContract is called
During new world asset creation process registry is asked for factory contract for exact world asset type, which will contain creation method for new world asset_




### scriptContracts

```solidity
function scriptContracts(bytes32 scriptId) external view returns (address)
```

Mapping containing assets implementations addresses by provided asset types

_Updated when #setScriptContractName is called
Every worlds assets implementation (code, not data) will be defined by value from this mapping_




### unitsStats

```solidity
function unitsStats(string unitName) external view returns (uint256 weaponPowerStage1, uint256 armourPowerStage1, uint256 weaponPowerStage2, uint256 armourPowerStage2, uint256 siegePower, uint256 siegeMaxSupply, uint256 siegeSupport)
```

Mapping containing units stats by provided unit types

_Updated when #setUnitStats is called_




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



### setFactoryContract

```solidity
function setFactoryContract(bytes32 assetType, address factoryAddress) external
```

Sets provided address as factory contract for provided asset type

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| assetType | bytes32 | Type of the asset |
| factoryAddress | address | Factory address |



### setScriptContractName

```solidity
function setScriptContractName(string assetGroup, string assetType, address implementationAddress) external
```

Sets provided address as implementation for provided asset group and asset type (for ex. group - "settlement", type - "OCCULTISTS")

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| assetGroup | string | Asset group |
| assetType | string | Type of the asset |
| implementationAddress | address | Implementation address |



### setUnitStats

```solidity
function setUnitStats(string unitName, struct IRegistry.UnitStats unitStats) external
```

Sets units stats for provided unit type

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitName | string | Unit type |
| unitStats | struct IRegistry.UnitStats | Unit stats struct |



### getWorkerCapacityCoefficient

```solidity
function getWorkerCapacityCoefficient(string buildingName) external pure returns (uint256 workerCapacityCoefficient)
```

Calculates worker capacity coefficient for provided building type

_Used for internal calculation of max workers for each building_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingName | string | Building type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| workerCapacityCoefficient | uint256 | Worker capacity coefficient |


### hasStartingTreasury

```solidity
function hasStartingTreasury(string buildingName) external pure returns (bool hasStartingTreasury)
```

Calculates if provided building has starting treasury on creation

_Used for determination if treasury should be filled on settlement creation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingName | string | Building type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| hasStartingTreasury | bool | If treasury should be filled |


### getToxicityByResource

```solidity
function getToxicityByResource(string resourceName) external pure returns (uint256 toxicity)
```

Calculates toxicity by resource ratio

_Used for minting/burning toxicity_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Resource name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| toxicity | uint256 | Amount of toxicity per 1 resource (both are in 1e18 precision) |


### getResourceWeight

```solidity
function getResourceWeight(string resourceName) external pure returns (uint256 resourceWeight)
```

Calculates resource weight

_Used for calculation how much prosperity will be produced by resource in treasury, building upgrade costs_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Resource name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceWeight | uint256 | Resource weight (in 1e0 precision) |


### getResourceDifficulty

```solidity
function getResourceDifficulty(string resourceName) external view returns (uint256 resourceDifficulty)
```

Calculates resource difficulty

_Used for internal calculation of building upgrade costs_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Resource name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceDifficulty | uint256 | Resource difficulty |


### noWoodInUpgradeLvl

```solidity
function noWoodInUpgradeLvl() external pure returns (uint256 noWoodInUpgradeLvl)
```

Returns level from which wood will not be required in building upgrades

_Used for internal calculation of building upgrade costs_


| Name | Type | Description |
| ---- | ---- | ----------- |
| noWoodInUpgradeLvl | uint256 | Level from which wood will not be required in building upgrades |


### oreInUpgradeLvl

```solidity
function oreInUpgradeLvl() external pure returns (uint256 oreInUpgradeLvl)
```

Returns level from which ore will be required in building upgrades

_Used for internal calculation of building upgrade costs_


| Name | Type | Description |
| ---- | ---- | ----------- |
| oreInUpgradeLvl | uint256 | Level from which ore will be required in building upgrades |


### getSiegePowerToSiegePointsMultiplier

```solidity
function getSiegePowerToSiegePointsMultiplier() external pure returns (uint256 siegePowerToSiegePointsMultiplier)
```

Returns siege power to siege siege points multiplier

_Used for determination how much siege points will be given_


| Name | Type | Description |
| ---- | ---- | ----------- |
| siegePowerToSiegePointsMultiplier | uint256 | Siege power to siege siege points multiplier (in 1e18 precision) |


### getSiegePointsToResourceMultiplier

```solidity
function getSiegePointsToResourceMultiplier(string resourceName) external view returns (uint256 siegePointsToResourceMultiplier)
```

Returns siege point multiplier by provided resource

_Used in calculation how many resources can be exchanged for siege points_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Resource name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| siegePointsToResourceMultiplier | uint256 | Siege point multiplier (in 1e18 precision) |


### getRobberyFee

```solidity
function getRobberyFee() external view returns (uint256 robberyFee)
```

Returns robbery fee

_Used in determination how much of resource will be burned during robbery_


| Name | Type | Description |
| ---- | ---- | ----------- |
| robberyFee | uint256 | Robbery fee (in 1e18 precision, where 1e18 is 100%) |


### getGlobalMultiplier

```solidity
function getGlobalMultiplier() external view returns (uint256 globalMultiplier)
```

Returns global multiplier

_Used everywhere, where time is involved. Essentially determines game speed_


| Name | Type | Description |
| ---- | ---- | ----------- |
| globalMultiplier | uint256 | Global multiplier |


### getToReservePercent

```solidity
function getToReservePercent() external pure returns (uint256 toReservePercent)
```

Returns production to reserve percent

_Determines how much of buildings production will go to treasury (if not full)_

| Name | Type | Description |
| ---- | ---- | ----------- |



### getBaseBattleLobbyDuration

```solidity
function getBaseBattleLobbyDuration() external view returns (uint256 baseBattleLobbyDuration)
```

Returns base battle lobby phase duration

_Used internally to determine how long lobby phase will last_


| Name | Type | Description |
| ---- | ---- | ----------- |
| baseBattleLobbyDuration | uint256 | Base battle lobby phase duration |


### getBaseBattleOngoingDuration

```solidity
function getBaseBattleOngoingDuration() external view returns (uint256 baseBattleOngoingDuration)
```

Returns base battle ongoing phase duration

_Used internally to determine how long ongoing phase will last_


| Name | Type | Description |
| ---- | ---- | ----------- |
| baseBattleOngoingDuration | uint256 | Base battle ongoing phase duration |


### getBuildings

```solidity
function getBuildings() external view returns (string[] buildings)
```

Returns game buildings

_Used internally to determine which buildings will be created on placing settlement_


| Name | Type | Description |
| ---- | ---- | ----------- |
| buildings | string[] | Buildings |


### getResources

```solidity
function getResources() external view returns (string[] resources)
```

Returns game resources

_Used internally to determine upgrade costs and providing initial resources for settlement owner based on his tier_

| Name | Type | Description |
| ---- | ---- | ----------- |



### getUnits

```solidity
function getUnits() external view returns (string[] units)
```

Returns game units

_Used internally in many places where interaction with units is necessary_


| Name | Type | Description |
| ---- | ---- | ----------- |
| units | string[] | Game units |


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


### getUnitMaxFoodToSpendOnMove

```solidity
function getUnitMaxFoodToSpendOnMove(string unitName) external pure returns (uint256 unitMaxFoodToSpendOnMove)
```

Returns how much food unit can take from treasury to increase its army movement speed

_Used internally to calculate army's movement speed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitName | string | Unit type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitMaxFoodToSpendOnMove | uint256 | Maximum amount of food to spend on move (in 1e18 precision) |


### getDemilitarizationProsperityPerWeapon

```solidity
function getDemilitarizationProsperityPerWeapon() external pure returns (uint256 prosperityPerWeapon)
```

Returns how much prosperity will be given for each weapon of demilitarization result

_Used internally to calculate how much prosperity will be given_


| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityPerWeapon | uint256 | Prosperity amount per one weapon (in 1e18 precision) |


### getOccultistsSummonDelay

```solidity
function getOccultistsSummonDelay() external pure returns (uint256 occultistsSummonDelay)
```

Returns occultists summon delay

_Used to determine is occultists can be re-summoned_


| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsSummonDelay | uint256 | Occultists summon delay (in seconds) |


### getMaxSettlementPerZone

```solidity
function getMaxSettlementPerZone() external pure returns (uint256 maxSettlementPerZone)
```

Returns max settlement that can be placed in one zone

_Occultists does not count (so +1 with occultists)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| maxSettlementPerZone | uint256 | Max settlement that can be placed in one zone |


### getOccultistsNoDestructionDelay

```solidity
function getOccultistsNoDestructionDelay() external pure returns (uint256 occultistsNoDestructionDelay)
```

Returns interval duration where world is not destructible after recent occultists summon

_Used to determine if destruction is available or not_


| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsNoDestructionDelay | uint256 | No destruction interval duration (in seconds) |


### getOccultistsPerZoneMultiplier

```solidity
function getOccultistsPerZoneMultiplier() external pure returns (uint256 occultistsPerZoneMultiplier)
```

Returns value of occultists per zone which determines occultists threshold for world destruction

_Used to determine amount of occultists that have to be present for world destruction_


| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsPerZoneMultiplier | uint256 | Value of occultists per zone |


### getMaxOccultistsPerZone

```solidity
function getMaxOccultistsPerZone() external pure returns (uint256 maxOccultistsPerZone)
```

Returns maximum amount of occultists that can be present in zone

_Used to determine how many occultists will be summoned_


| Name | Type | Description |
| ---- | ---- | ----------- |
| maxOccultistsPerZone | uint256 | Maximum amount of occultists |


### getOccultistUnitType

```solidity
function getOccultistUnitType() external pure returns (string occultistUnitType)
```

Returns unit type of occultists army

_Determines type of unit in occultists army_


| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistUnitType | string | Occultists unit type |


### getBuildingTokenTransferThresholdPercent

```solidity
function getBuildingTokenTransferThresholdPercent() external pure returns (uint256 buildingTokenTransferThresholdPercent)
```

Returns building token transfer threshold percent

_Used to determine is building token transfer allowed based on treasury percent_


| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingTokenTransferThresholdPercent | uint256 | Building token transfer threshold percent |


### getNewSettlementExtraResources

```solidity
function getNewSettlementExtraResources() external view returns (struct IRegistry.ExtraResource[] extraResources)
```

Returns extra resources which will be minted to user when new settlement is placed

_During settlement creation continent contract uses output from this function to determine how much extra resources to mint_


| Name | Type | Description |
| ---- | ---- | ----------- |
| extraResources | struct IRegistry.ExtraResource[] | Extra resources which will be minted to user when new settlement is placed |


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


### getDemilitarizationCooldown

```solidity
function getDemilitarizationCooldown() external pure returns (uint256 cooldown)
```

Returns army demilitarization cooldown in seconds

_Used for army demilitarization restriction_


| Name | Type | Description |
| ---- | ---- | ----------- |
| cooldown | uint256 | Demilitarization cooldown in seconds |


### getUnitPriceDropByUnitType

```solidity
function getUnitPriceDropByUnitType(string unitType) external pure returns (uint256 numerator, uint256 denominator)
```

Returns unit pool price drop per second for provided unit type, provided as numerator and denominator

_Used for determination of current unit pool price_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitType | string | Unit type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| numerator | uint256 | Numerator |
| denominator | uint256 | Denominator |


## IRegistry


Functions related to current game configuration





### GameResource








```solidity
struct GameResource {
  string tokenName;
  string tokenSymbol;
  string worldResourceName;
}
```

### GameUnit








```solidity
struct GameUnit {
  string tokenName;
  string tokenSymbol;
  string worldUnitName;
}
```

### ExtraResource








```solidity
struct ExtraResource {
  string resourceName;
  uint256 value;
}
```

### UnitStats








```solidity
struct UnitStats {
  uint256 weaponPowerStage1;
  uint256 armourPowerStage1;
  uint256 weaponPowerStage2;
  uint256 armourPowerStage2;
  uint256 siegePower;
  uint256 siegeMaxSupply;
  uint256 siegeSupport;
}
```

### mightyCreator

```solidity
function mightyCreator() external view returns (address)
```

An address which can configure/reconfigure current game

_Immutable, initialized on the registry creation_




### isFactoryContract

```solidity
function isFactoryContract(address factoryAddress) external view returns (bool)
```

Mapping containing is provided address a factory contract or not

_Updated when #setFactoryContract is called_




### factoryContracts

```solidity
function factoryContracts(bytes32 scriptId) external view returns (address)
```

Mapping containing factory contracts addresses by provided asset types

_Updated when #setFactoryContract is called
During new world asset creation process registry is asked for factory contract for exact world asset type, which will contain creation method for new world asset_




### scriptContracts

```solidity
function scriptContracts(bytes32 scriptId) external view returns (address)
```

Mapping containing assets implementations addresses by provided asset types

_Updated when #setScriptContractName is called
Every worlds assets implementation (code, not data) will be defined by value from this mapping_




### unitsStats

```solidity
function unitsStats(string unitName) external view returns (uint256 weaponPowerStage1, uint256 armourPowerStage1, uint256 weaponPowerStage2, uint256 armourPowerStage2, uint256 siegePower, uint256 siegeMaxSupply, uint256 siegeSupport)
```

Mapping containing units stats by provided unit types

_Updated when #setUnitStats is called_




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



### setFactoryContract

```solidity
function setFactoryContract(bytes32 assetType, address factoryAddress) external
```

Sets provided address as factory contract for provided asset type

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| assetType | bytes32 | Type of the asset |
| factoryAddress | address | Factory address |



### setScriptContractName

```solidity
function setScriptContractName(string assetGroup, string assetType, address implementationAddress) external
```

Sets provided address as implementation for provided asset group and asset type (for ex. group - "settlement", type - "OCCULTISTS")

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| assetGroup | string | Asset group |
| assetType | string | Type of the asset |
| implementationAddress | address | Implementation address |



### setUnitStats

```solidity
function setUnitStats(string unitName, struct IRegistry.UnitStats unitStats) external
```

Sets units stats for provided unit type

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitName | string | Unit type |
| unitStats | struct IRegistry.UnitStats | Unit stats struct |



### getWorkerCapacityCoefficient

```solidity
function getWorkerCapacityCoefficient(string buildingName) external pure returns (uint256 workerCapacityCoefficient)
```

Calculates worker capacity coefficient for provided building type

_Used for internal calculation of max workers for each building_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingName | string | Building type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| workerCapacityCoefficient | uint256 | Worker capacity coefficient |


### hasStartingTreasury

```solidity
function hasStartingTreasury(string buildingName) external pure returns (bool hasStartingTreasury)
```

Calculates if provided building has starting treasury on creation

_Used for determination if treasury should be filled on settlement creation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingName | string | Building type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| hasStartingTreasury | bool | If treasury should be filled |


### getToxicityByResource

```solidity
function getToxicityByResource(string resourceName) external pure returns (uint256 toxicity)
```

Calculates toxicity by resource ratio

_Used for minting/burning toxicity_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Resource name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| toxicity | uint256 | Amount of toxicity per 1 resource (both are in 1e18 precision) |


### getResourceWeight

```solidity
function getResourceWeight(string resourceName) external pure returns (uint256 resourceWeight)
```

Calculates resource weight

_Used for calculation how much prosperity will be produced by resource in treasury, building upgrade costs_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Resource name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceWeight | uint256 | Resource weight (in 1e0 precision) |


### getResourceDifficulty

```solidity
function getResourceDifficulty(string resourceName) external view returns (uint256 resourceDifficulty)
```

Calculates resource difficulty

_Used for internal calculation of building upgrade costs_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Resource name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceDifficulty | uint256 | Resource difficulty |


### noWoodInUpgradeLvl

```solidity
function noWoodInUpgradeLvl() external pure returns (uint256 noWoodInUpgradeLvl)
```

Returns level from which wood will not be required in building upgrades

_Used for internal calculation of building upgrade costs_


| Name | Type | Description |
| ---- | ---- | ----------- |
| noWoodInUpgradeLvl | uint256 | Level from which wood will not be required in building upgrades |


### oreInUpgradeLvl

```solidity
function oreInUpgradeLvl() external pure returns (uint256 oreInUpgradeLvl)
```

Returns level from which ore will be required in building upgrades

_Used for internal calculation of building upgrade costs_


| Name | Type | Description |
| ---- | ---- | ----------- |
| oreInUpgradeLvl | uint256 | Level from which ore will be required in building upgrades |


### getSiegePowerToSiegePointsMultiplier

```solidity
function getSiegePowerToSiegePointsMultiplier() external pure returns (uint256 siegePowerToSiegePointsMultiplier)
```

Returns siege power to siege siege points multiplier

_Used for determination how much siege points will be given_


| Name | Type | Description |
| ---- | ---- | ----------- |
| siegePowerToSiegePointsMultiplier | uint256 | Siege power to siege siege points multiplier (in 1e18 precision) |


### getSiegePointsToResourceMultiplier

```solidity
function getSiegePointsToResourceMultiplier(string resourceName) external view returns (uint256 siegePointsToResourceMultiplier)
```

Returns siege point multiplier by provided resource

_Used in calculation how many resources can be exchanged for siege points_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Resource name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| siegePointsToResourceMultiplier | uint256 | Siege point multiplier (in 1e18 precision) |


### getRobberyFee

```solidity
function getRobberyFee() external view returns (uint256 robberyFee)
```

Returns robbery fee

_Used in determination how much of resource will be burned during robbery_


| Name | Type | Description |
| ---- | ---- | ----------- |
| robberyFee | uint256 | Robbery fee (in 1e18 precision, where 1e18 is 100%) |


### getGlobalMultiplier

```solidity
function getGlobalMultiplier() external view returns (uint256 globalMultiplier)
```

Returns global multiplier

_Used everywhere, where time is involved. Essentially determines game speed_


| Name | Type | Description |
| ---- | ---- | ----------- |
| globalMultiplier | uint256 | Global multiplier |


### getToReservePercent

```solidity
function getToReservePercent() external pure returns (uint256 toReservePercent)
```

Returns production to reserve percent

_Determines how much of buildings production will go to treasury (if not full)_

| Name | Type | Description |
| ---- | ---- | ----------- |



### getBaseBattleLobbyDuration

```solidity
function getBaseBattleLobbyDuration() external view returns (uint256 baseBattleLobbyDuration)
```

Returns base battle lobby phase duration

_Used internally to determine how long lobby phase will last_


| Name | Type | Description |
| ---- | ---- | ----------- |
| baseBattleLobbyDuration | uint256 | Base battle lobby phase duration |


### getBaseBattleOngoingDuration

```solidity
function getBaseBattleOngoingDuration() external view returns (uint256 baseBattleOngoingDuration)
```

Returns base battle ongoing phase duration

_Used internally to determine how long ongoing phase will last_


| Name | Type | Description |
| ---- | ---- | ----------- |
| baseBattleOngoingDuration | uint256 | Base battle ongoing phase duration |


### getBuildings

```solidity
function getBuildings() external view returns (string[] buildings)
```

Returns game buildings

_Used internally to determine which buildings will be created on placing settlement_


| Name | Type | Description |
| ---- | ---- | ----------- |
| buildings | string[] | Buildings |


### getResources

```solidity
function getResources() external view returns (string[] resources)
```

Returns game resources

_Used internally to determine upgrade costs and providing initial resources for settlement owner based on his tier_

| Name | Type | Description |
| ---- | ---- | ----------- |



### getUnits

```solidity
function getUnits() external view returns (string[] units)
```

Returns game units

_Used internally in many places where interaction with units is necessary_


| Name | Type | Description |
| ---- | ---- | ----------- |
| units | string[] | Game units |


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


### getUnitMaxFoodToSpendOnMove

```solidity
function getUnitMaxFoodToSpendOnMove(string unitName) external pure returns (uint256 unitMaxFoodToSpendOnMove)
```

Returns how much food unit can take from treasury to increase its army movement speed

_Used internally to calculate army's movement speed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitName | string | Unit type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitMaxFoodToSpendOnMove | uint256 | Maximum amount of food to spend on move (in 1e18 precision) |


### getDemilitarizationProsperityPerWeapon

```solidity
function getDemilitarizationProsperityPerWeapon() external pure returns (uint256 prosperityPerWeapon)
```

Returns how much prosperity will be given for each weapon of demilitarization result

_Used internally to calculate how much prosperity will be given_


| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityPerWeapon | uint256 | Prosperity amount per one weapon (in 1e18 precision) |


### getOccultistsSummonDelay

```solidity
function getOccultistsSummonDelay() external pure returns (uint256 occultistsSummonDelay)
```

Returns occultists summon delay

_Used to determine is occultists can be re-summoned_


| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsSummonDelay | uint256 | Occultists summon delay (in seconds) |


### getMaxSettlementPerZone

```solidity
function getMaxSettlementPerZone() external pure returns (uint256 maxSettlementPerZone)
```

Returns max settlement that can be placed in one zone

_Occultists does not count (so +1 with occultists)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| maxSettlementPerZone | uint256 | Max settlement that can be placed in one zone |


### getOccultistsNoDestructionDelay

```solidity
function getOccultistsNoDestructionDelay() external pure returns (uint256 occultistsNoDestructionDelay)
```

Returns interval duration where world is not destructible after recent occultists summon

_Used to determine if destruction is available or not_


| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsNoDestructionDelay | uint256 | No destruction interval duration (in seconds) |


### getOccultistsPerZoneMultiplier

```solidity
function getOccultistsPerZoneMultiplier() external pure returns (uint256 occultistsPerZoneMultiplier)
```

Returns value of occultists per zone which determines occultists threshold for world destruction

_Used to determine amount of occultists that have to be present for world destruction_


| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsPerZoneMultiplier | uint256 | Value of occultists per zone |


### getMaxOccultistsPerZone

```solidity
function getMaxOccultistsPerZone() external pure returns (uint256 maxOccultistsPerZone)
```

Returns maximum amount of occultists that can be present in zone

_Used to determine how many occultists will be summoned_


| Name | Type | Description |
| ---- | ---- | ----------- |
| maxOccultistsPerZone | uint256 | Maximum amount of occultists |


### getOccultistUnitType

```solidity
function getOccultistUnitType() external pure returns (string occultistUnitType)
```

Returns unit type of occultists army

_Determines type of unit in occultists army_


| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistUnitType | string | Occultists unit type |


### getBuildingTokenTransferThresholdPercent

```solidity
function getBuildingTokenTransferThresholdPercent() external pure returns (uint256 buildingTokenTransferThresholdPercent)
```

Returns building token transfer threshold percent

_Used to determine is building token transfer allowed based on treasury percent_


| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingTokenTransferThresholdPercent | uint256 | Building token transfer threshold percent |


### getNewSettlementExtraResources

```solidity
function getNewSettlementExtraResources() external view returns (struct IRegistry.ExtraResource[] extraResources)
```

Returns extra resources which will be minted to user when new settlement is placed

_During settlement creation continent contract uses output from this function to determine how much extra resources to mint_


| Name | Type | Description |
| ---- | ---- | ----------- |
| extraResources | struct IRegistry.ExtraResource[] | Extra resources which will be minted to user when new settlement is placed |


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


### getDemilitarizationCooldown

```solidity
function getDemilitarizationCooldown() external pure returns (uint256 cooldown)
```

Returns army demilitarization cooldown in seconds

_Used for army demilitarization restriction_


| Name | Type | Description |
| ---- | ---- | ----------- |
| cooldown | uint256 | Demilitarization cooldown in seconds |


### getUnitPriceDropByUnitType

```solidity
function getUnitPriceDropByUnitType(string unitType) external pure returns (uint256 numerator, uint256 denominator)
```

Returns unit pool price drop per second for provided unit type, provided as numerator and denominator

_Used for determination of current unit pool price_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitType | string | Unit type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| numerator | uint256 | Numerator |
| denominator | uint256 | Denominator |


