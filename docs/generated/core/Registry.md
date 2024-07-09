## Registry








### mightyCreator

```solidity
address mightyCreator
```

An address which can configure/reconfigure current game

_Immutable, initialized on the registry creation_




### isFactoryContract

```solidity
mapping(address => bool) isFactoryContract
```

Mapping containing is provided address a factory contract or not

_Updated when #setFactoryContract is called_




### factoryContracts

```solidity
mapping(bytes32 => address) factoryContracts
```

Mapping containing factory contracts addresses by provided asset types

_Updated when #setFactoryContract is called
During new world asset creation process registry is asked for factory contract for exact world asset type, which will contain creation method for new world asset_




### scriptContracts

```solidity
mapping(bytes32 => address) scriptContracts
```

Mapping containing assets implementations addresses by provided asset types

_Updated when #setScriptContractName is called
Every worlds assets implementation (code, not data) will be defined by value from this mapping_




### unitsStats

```solidity
mapping(string => struct IRegistry.UnitStats) unitsStats
```

Mapping containing units stats by provided unit types

_Updated when #setUnitStats is called_




### globalMultiplier

```solidity
uint256 globalMultiplier
```

Global multiplier

_Immutable, initialized on the registry creation_




### settlementStartingPrice

```solidity
uint256 settlementStartingPrice
```

Settlement starting price

_Immutable, initialized on the registry creation_




### onlyMightyCreator

```solidity
modifier onlyMightyCreator()
```



_Allows caller to be only mighty creator_




### init

```solidity
function init(uint256 _globalMultiplier, uint256 _settlementStartingPrice) public
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _globalMultiplier | uint256 |  |
| _settlementStartingPrice | uint256 |  |



### setFactoryContract

```solidity
function setFactoryContract(bytes32 id, address addr) public
```

Sets provided address as factory contract for provided asset type

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| id | bytes32 |  |
| addr | address |  |



### setScriptContractName

```solidity
function setScriptContractName(string groupName, string name, address addr) public
```

Sets provided address as implementation for provided asset group and asset type (for ex. group - "settlement", type - "OCCULTISTS")

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| groupName | string |  |
| name | string |  |
| addr | address |  |



### setUnitStats

```solidity
function setUnitStats(string unitName, struct IRegistry.UnitStats _unitStats) public
```

Sets units stats for provided unit type

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitName | string | Unit type |
| _unitStats | struct IRegistry.UnitStats |  |



### getGlobalMultiplier

```solidity
function getGlobalMultiplier() public view returns (uint256)
```

Returns global multiplier

_Used everywhere, where time is involved. Essentially determines game speed_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getSiegePowerToSiegePointsMultiplier

```solidity
function getSiegePowerToSiegePointsMultiplier() public pure returns (uint256)
```

Returns siege power to siege siege points multiplier

_Used for determination how much siege points will be given_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getSiegePointsToResourceMultiplier

```solidity
function getSiegePointsToResourceMultiplier(string resourceName) public view returns (uint256)
```

Returns siege point multiplier by provided resource

_Used in calculation how many resources can be exchanged for siege points_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Resource name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getWorkerCapacityCoefficient

```solidity
function getWorkerCapacityCoefficient(string buildingName) public pure returns (uint256)
```

Calculates worker capacity coefficient for provided building type

_Used for internal calculation of max workers for each building_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingName | string | Building type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### hasStartingTreasury

```solidity
function hasStartingTreasury(string buildingName) public pure returns (bool)
```

Calculates if provided building has starting treasury on creation

_Used for determination if treasury should be filled on settlement creation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingName | string | Building type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### getToxicityByResource

```solidity
function getToxicityByResource(string resourceName) public pure returns (uint256)
```

Calculates toxicity by resource ratio

_Used for minting/burning toxicity_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Resource name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getResourceWeight

```solidity
function getResourceWeight(string resourceName) public pure returns (uint256)
```

Calculates resource weight

_Used for calculation how much prosperity will be produced by resource in treasury, building upgrade costs_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Resource name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getRobberyFee

```solidity
function getRobberyFee() public view returns (uint256)
```

Returns robbery fee

_Used in determination how much of resource will be burned during robbery_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getResourceDifficulty

```solidity
function getResourceDifficulty(string resourceName) public pure returns (uint256)
```

Calculates resource difficulty

_Used for internal calculation of building upgrade costs_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Resource name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### noWoodInUpgradeLvl

```solidity
function noWoodInUpgradeLvl() public pure returns (uint256)
```

Returns level from which wood will not be required in building upgrades

_Used for internal calculation of building upgrade costs_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### oreInUpgradeLvl

```solidity
function oreInUpgradeLvl() public pure returns (uint256)
```

Returns level from which ore will be required in building upgrades

_Used for internal calculation of building upgrade costs_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getToReservePercent

```solidity
function getToReservePercent() public pure returns (uint256)
```

Returns production to reserve percent

_Determines how much of buildings production will go to treasury (if not full)_

| Name | Type | Description |
| ---- | ---- | ----------- |



### getBaseBattleLobbyDuration

```solidity
function getBaseBattleLobbyDuration() public pure returns (uint256)
```

Returns base battle lobby phase duration

_Used internally to determine how long lobby phase will last_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getBaseBattleOngoingDuration

```solidity
function getBaseBattleOngoingDuration() public pure returns (uint256)
```

Returns base battle ongoing phase duration

_Used internally to determine how long ongoing phase will last_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getBuildings

```solidity
function getBuildings() public pure returns (string[])
```

Returns game buildings

_Used internally to determine which buildings will be created on placing settlement_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string[] |  |


### getGameResources

```solidity
function getGameResources() public pure returns (struct IRegistry.GameResource[])
```

Returns game resources

_Used internally to determine upgrade costs and providing initial resources for settlement owner based on his tier_

| Name | Type | Description |
| ---- | ---- | ----------- |



### getGameUnits

```solidity
function getGameUnits() public pure returns (struct IRegistry.GameUnit[])
```

Returns game units

_Used internally in many places where interaction with units is necessary_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IRegistry.GameUnit[] |  |


### getResources

```solidity
function getResources() public pure returns (string[])
```

Returns game resources

_Used internally to determine upgrade costs and providing initial resources for settlement owner based on his tier_

| Name | Type | Description |
| ---- | ---- | ----------- |



### getUnits

```solidity
function getUnits() public pure returns (string[])
```

Returns game units

_Used internally in many places where interaction with units is necessary_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string[] |  |


### getUnitHiringFortHpMultiplier

```solidity
function getUnitHiringFortHpMultiplier() public pure returns (uint256)
```

Returns unit hiring fort hp multiplier

_Used to determine how much units in army can be presented based on its current fort hp and this parameter_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getUnitMaxFoodToSpendOnMove

```solidity
function getUnitMaxFoodToSpendOnMove(string unitName) public pure returns (uint256)
```

Returns how much food unit can take from treasury to increase its army movement speed

_Used internally to calculate army's movement speed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitName | string | Unit type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getDemilitarizationProsperityPerWeapon

```solidity
function getDemilitarizationProsperityPerWeapon() public pure returns (uint256)
```

Returns how much prosperity will be given for each weapon of demilitarization result

_Used internally to calculate how much prosperity will be given_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getOccultistsSummonDelay

```solidity
function getOccultistsSummonDelay() public pure returns (uint256)
```

Returns occultists summon delay

_Used to determine is occultists can be re-summoned_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getMaxSettlementPerZone

```solidity
function getMaxSettlementPerZone() public pure returns (uint256)
```

Returns max settlement that can be placed in one zone

_Occultists does not count (so +1 with occultists)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getOccultistsNoDestructionDelay

```solidity
function getOccultistsNoDestructionDelay() public pure returns (uint256)
```

Returns interval duration where world is not destructible after recent occultists summon

_Used to determine if destruction is available or not_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getOccultistsPerZoneMultiplier

```solidity
function getOccultistsPerZoneMultiplier() public pure returns (uint256)
```

Returns value of occultists per zone which determines occultists threshold for world destruction

_Used to determine amount of occultists that have to be present for world destruction_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getMaxOccultistsPerZone

```solidity
function getMaxOccultistsPerZone() public pure returns (uint256)
```

Returns maximum amount of occultists that can be present in zone

_Used to determine how many occultists will be summoned_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getOccultistUnitType

```solidity
function getOccultistUnitType() public pure returns (string)
```

Returns unit type of occultists army

_Determines type of unit in occultists army_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string |  |


### getBuildingTokenTransferThresholdPercent

```solidity
function getBuildingTokenTransferThresholdPercent() public pure returns (uint256)
```

Returns building token transfer threshold percent

_Used to determine is building token transfer allowed based on treasury percent_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getNewSettlementExtraResources

```solidity
function getNewSettlementExtraResources() public view returns (struct IRegistry.ExtraResource[])
```

Returns extra resources which will be minted to user when new settlement is placed

_During settlement creation continent contract uses output from this function to determine how much extra resources to mint_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IRegistry.ExtraResource[] |  |


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


### getDemilitarizationCooldown

```solidity
function getDemilitarizationCooldown() public pure returns (uint256)
```

Returns army demilitarization cooldown in seconds

_Used for army demilitarization restriction_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getUnitPriceDropByUnitType

```solidity
function getUnitPriceDropByUnitType(string unitType) public pure returns (uint256, uint256)
```

Returns unit pool price drop per second for provided unit type, provided as numerator and denominator

_Used for determination of current unit pool price_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitType | string | Unit type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


