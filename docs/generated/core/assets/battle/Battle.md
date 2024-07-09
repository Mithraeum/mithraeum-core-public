## Battle








### BattleWithCultistsInitiationInfo








```solidity
struct BattleWithCultistsInitiationInfo {
  bytes32[] maxUnitTypeIdsToAttack;
  uint256[] maxUnitsToAttack;
}
```

### position

```solidity
uint64 position
```

Position at which battle is being held

_Immutable, initialized on the battle creation_




### sideUnitsAmount

```solidity
mapping(uint256 => mapping(bytes32 => uint256)) sideUnitsAmount
```

Mapping that contains units amount by side and unit type

_Updated when army joins side_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### armyUnitsAmount

```solidity
mapping(address => mapping(bytes32 => uint256)) armyUnitsAmount
```

Mapping that contains amount of units by army address and unit type

_Updated when army joins battle_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### armyUnitsAdditionalMultipliers

```solidity
mapping(address => mapping(bytes32 => uint256)) armyUnitsAdditionalMultipliers
```

Mapping that contains unit multiplier by army address and unit type

_Updated when army joins battle_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### casualties

```solidity
mapping(uint256 => mapping(bytes32 => uint256)) casualties
```

Mapping that contains amount of casualties

_Updated when #acceptArmyInBattle is called_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### armySide

```solidity
mapping(address => uint256) armySide
```

Mapping that contains side at which joined army is on

_Updated when #acceptArmyInBattle is called_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### battleTimeInfo

```solidity
struct IBattle.BattleTimeInfo battleTimeInfo
```

Battle time info

_Updated when battle initialized, first armies joined and ended (#initBattle, #acceptArmyInBattle, #endBattle)_


| Name | Type | Description |
| ---- | ---- | ----------- |


### winningSide

```solidity
uint256 winningSide
```

Winning side

_Updated when #endBattle is called_


| Name | Type | Description |
| ---- | ---- | ----------- |


### init

```solidity
function init(bytes initParams) public
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### isLobbyTime

```solidity
function isLobbyTime() public view returns (bool)
```

Calculates if lobby is opened

_Calculates if lobby is opened_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### acceptArmyInBattle

```solidity
function acceptArmyInBattle(address armyAddress, uint256 side) public
```

Accepts army in battle

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| side | uint256 | Side to which army will join |



### canEndBattle

```solidity
function canEndBattle() public view returns (bool)
```

Calculates if battle can be ended

_Checks if endTime is set and current block.timestamp > beginTime + duration_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### isEndedBattle

```solidity
function isEndedBattle() public view returns (bool)
```

Calculates if battle is ended

_Checks if endTime is not zero_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### calculateArmyCasualties

```solidity
function calculateArmyCasualties(address armyAddress) public view returns (bool, uint256[])
```

Calculates casualties for specified army

_Provides valid results only for ended battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army presented in battle |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |
| [1] | uint256[] |  |


### calculateBattleDuration

```solidity
function calculateBattleDuration(uint256 globalMultiplier, uint256 baseBattleDuration, uint256 minimumBattleDuration, bool isCultistsAttacked, uint256 side1UnitsAmount, uint256 side2UnitsAmount, uint256 maxBattleDuration) public view returns (uint64)
```

Calculates battle duration based on specified parameters

_globalMultiplier, baseBattleDuration parameters from registry_

| Name | Type | Description |
| ---- | ---- | ----------- |
| globalMultiplier | uint256 | Global multiplier (from registry) |
| baseBattleDuration | uint256 | Base battle duration (from registry) |
| minimumBattleDuration | uint256 |  |
| isCultistsAttacked | bool | Is cultists attacked |
| side1UnitsAmount | uint256 |  |
| side2UnitsAmount | uint256 |  |
| maxBattleDuration | uint256 | Max allowed battle duration |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint64 |  |


### getBattleDuration

```solidity
function getBattleDuration(bool isCultistsAttacked, uint256 maxBattleDuration, uint256 side1UnitsAmount, uint256 side2UnitsAmount) public view returns (uint64)
```

Calculates battle duration

_Returns same value as #calculateBattlesDuration but without the need to provide all parameters_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isCultistsAttacked | bool | Is cultists attacked |
| maxBattleDuration | uint256 | Max allowed battle duration |
| side1UnitsAmount | uint256 |  |
| side2UnitsAmount | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint64 |  |


### endBattle

```solidity
function endBattle() public
```

Ends battle

_Sets end time_




### calculateStage1Casualties

```solidity
function calculateStage1Casualties() public view returns (uint256[] _side1Casualties, uint256[] _side2Casualties, bytes stageParams)
```

Calculates casualties for first battle stage

_Uses values from battles' sideUnitsAmount in order to calculate casualties (can be executed while battle is still not fully formed)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| _side1Casualties | uint256[] |  |
| _side2Casualties | uint256[] |  |
| stageParams | bytes | Stage params (encoded abi.encode(sideAOffense, sideBOffense, sideADefence, sideBDefence)) |


### calculateStage2Casualties

```solidity
function calculateStage2Casualties(uint256[] stage1Side1Casualties, uint256[] stage1Side2Casualties) public view returns (uint256[] _side1Casualties, uint256[] _side2Casualties, bytes stageParams)
```

Calculates casualties for second battle stage (based on casualties from first battle stage)

_Uses values from battles' sideUnitsAmount in order to calculate casualties (can be executed while battle is still not fully formed)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| stage1Side1Casualties | uint256[] |  |
| stage1Side2Casualties | uint256[] |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| _side1Casualties | uint256[] |  |
| _side2Casualties | uint256[] |  |
| stageParams | bytes | Stage params (encoded abi.encode(sideAOffense, sideBOffense, sideADefence, sideBDefence)) |


### calculateAllCasualties

```solidity
function calculateAllCasualties() public view returns (uint256[], uint256[], uint256)
```

Calculates casualties for all battle stages

_Uses values from battles' sideUnitsAmount in order to calculate casualties (can be executed while battle is still not fully formed)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] |  |
| [1] | uint256[] |  |
| [2] | uint256 |  |


### _calculateSideLossPercentage

```solidity
function _calculateSideLossPercentage(uint256 sideOffence, uint256 sideDefence, uint256 battleDuration, uint256 baseBattleDuration) internal pure returns (uint256)
```



_Calculate side loss percentage (in 1e18 precision)_




### _calculateUnitsAmount

```solidity
function _calculateUnitsAmount(address armyAddress) internal view returns (uint256)
```



_Calculates total amount of units of specified army_




### _calculateAndSaveCasualties

```solidity
function _calculateAndSaveCasualties() internal
```



_Calculates and saves casualties_




### _calculateWinningSide

```solidity
function _calculateWinningSide(bytes stage1Params, bytes stage2Params) internal view returns (uint256)
```



_Calculates winning side by side-stage params_




### _isCultistsArmy

```solidity
function _isCultistsArmy(address armyAddress) internal view returns (bool)
```



_Checks if provided army address belongs to cultists settlement or not_




### _isArmyUnitsExceeds

```solidity
function _isArmyUnitsExceeds(address armyAddress, bytes32[] unitTypeIds, uint256[] maxUnits) internal view returns (bool)
```



_Calculates if provided army has more than specified units_




