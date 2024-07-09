## IBattle


Functions to read state/modify state in order to get current battle parameters and/or interact with it





### BattleTimeInfo








```solidity
struct BattleTimeInfo {
  uint64 beginTime;
  uint64 duration;
  uint64 endTime;
}
```

### position

```solidity
function position() external view returns (uint64)
```

Position at which battle is being held

_Immutable, initialized on the battle creation_




### sideUnitsAmount

```solidity
function sideUnitsAmount(uint256 side, bytes32 unitTypeId) external view returns (uint256 unitsAmount)
```

Mapping that contains units amount by side and unit type

_Updated when army joins side_

| Name | Type | Description |
| ---- | ---- | ----------- |
| side | uint256 | Side of which query units amount (sideA = 1, sideB = 2) |
| unitTypeId | bytes32 | Unit type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsAmount | uint256 | Amount of units by specified side and unit type |


### armyUnitsAmount

```solidity
function armyUnitsAmount(address armyAddress, bytes32 unitTypeId) external view returns (uint256 unitsAmount)
```

Mapping that contains amount of units by army address and unit type

_Updated when army joins battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| unitTypeId | bytes32 | Unit type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsAmount | uint256 | Amount of units by army address and unit type |


### armyUnitsAdditionalMultipliers

```solidity
function armyUnitsAdditionalMultipliers(address armyAddress, bytes32 unitTypeId) external view returns (uint256 unitAmountMultiplier)
```

Mapping that contains unit multiplier by army address and unit type

_Updated when army joins battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| unitTypeId | bytes32 | Unit type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitAmountMultiplier | uint256 | Unit amount multiplier |


### casualties

```solidity
function casualties(uint256 side, bytes32 unitTypeId) external view returns (uint256 casualtiesCount)
```

Mapping that contains amount of casualties

_Updated when #acceptArmyInBattle is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| side | uint256 | Side of which query casualties amount (sideA = 1, sideB = 2) |
| unitTypeId | bytes32 | Unit type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| casualtiesCount | uint256 | Amount of casualties by side and unit type |


### armySide

```solidity
function armySide(address armyAddress) external view returns (uint256 armySide)
```

Mapping that contains side at which joined army is on

_Updated when #acceptArmyInBattle is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |

| Name | Type | Description |
| ---- | ---- | ----------- |
| armySide | uint256 | Side of specified army (sideA = 1, sideB = 2) |


### battleTimeInfo

```solidity
function battleTimeInfo() external view returns (uint64 beginTime, uint64 duration, uint64 endTime)
```

Battle time info

_Updated when battle initialized, first armies joined and ended (#initBattle, #acceptArmyInBattle, #endBattle)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| beginTime | uint64 | Time when battle is began |
| duration | uint64 | Battle duration, initialized when first two armies joined |
| endTime | uint64 | Time when battle is ended |


### winningSide

```solidity
function winningSide() external view returns (uint256 winningSide)
```

Winning side

_Updated when #endBattle is called_


| Name | Type | Description |
| ---- | ---- | ----------- |
| winningSide | uint256 | Winning side (no winner = 0, sideA = 1, sideB = 2) |


### ArmyJoined

```solidity
event ArmyJoined(address armyAddress, uint256 side)
```

Emitted when army joined battle


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the joined army |
| side | uint256 | Side to which army is joined (sideA = 1, sideB = 2) |



### BattleEnded

```solidity
event BattleEnded(uint256 endTime)
```

Emitted when #endBattle is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| endTime | uint256 | Time at which battle is ended |



### BattleCannotBeCreatedWhenArmyUnitsExceedDesiredAmountToAttack

```solidity
error BattleCannotBeCreatedWhenArmyUnitsExceedDesiredAmountToAttack()
```

Thrown when attempting to begin battle by attacking army with MAX amount of units to attack, but their value increased to more than MAX





### BattleCannotBeCreatedByDesiringToAttackCultistsArmyWithoutUnits

```solidity
error BattleCannotBeCreatedByDesiringToAttackCultistsArmyWithoutUnits()
```

Thrown when attempting to begin battle by attacking cultists army with desire to draw zero units to the battle





### BattleCannotBeCreatedWithArmiesHavingZeroUnits

```solidity
error BattleCannotBeCreatedWithArmiesHavingZeroUnits()
```

Thrown when attempting to begin battle with armies either of which has zero units





### BattleCannotBeCreatedWhenAttackedArmyIsAlmostOnAnotherPosition

```solidity
error BattleCannotBeCreatedWhenAttackedArmyIsAlmostOnAnotherPosition()
```

Thrown when attempting to start battle by attacking army when maneuver duration left less than minimum battle duration





### BattleCannotAcceptCultistsArmyWhenCultistsAmountChangedToLowerValueThanDesired

```solidity
error BattleCannotAcceptCultistsArmyWhenCultistsAmountChangedToLowerValueThanDesired()
```

Thrown when attempting to accept cultists army to the battle but their amount got smaller than desired to attack





### BattleCannotBeFinishedAtThisTime

```solidity
error BattleCannotBeFinishedAtThisTime()
```

Thrown when attempting to finish battle while time for it has not yet come





### BattleCannotBeFinishedMoreThanOnce

```solidity
error BattleCannotBeFinishedMoreThanOnce()
```

Thrown when attempting to finish battle when it is already finished





### acceptArmyInBattle

```solidity
function acceptArmyInBattle(address armyAddress, uint256 side) external
```

Accepts army in battle

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| side | uint256 | Side to which army will join |



### endBattle

```solidity
function endBattle() external
```

Ends battle

_Sets end time_




### calculateStage1Casualties

```solidity
function calculateStage1Casualties() external view returns (uint256[] sideACasualties, uint256[] sideBCasualties, bytes stageParams)
```

Calculates casualties for first battle stage

_Uses values from battles' sideUnitsAmount in order to calculate casualties (can be executed while battle is still not fully formed)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| sideACasualties | uint256[] | Side A casualties |
| sideBCasualties | uint256[] | Side B casualties |
| stageParams | bytes | Stage params (encoded abi.encode(sideAOffense, sideBOffense, sideADefence, sideBDefence)) |


### calculateStage2Casualties

```solidity
function calculateStage2Casualties(uint256[] stage1SideACasualties, uint256[] stage1SideBCasualties) external view returns (uint256[] sideACasualties, uint256[] sideBCasualties, bytes stageParams)
```

Calculates casualties for second battle stage (based on casualties from first battle stage)

_Uses values from battles' sideUnitsAmount in order to calculate casualties (can be executed while battle is still not fully formed)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| stage1SideACasualties | uint256[] | Stage 1 side A casualties |
| stage1SideBCasualties | uint256[] | Stage 1 side B casualties |

| Name | Type | Description |
| ---- | ---- | ----------- |
| sideACasualties | uint256[] | Side A casualties |
| sideBCasualties | uint256[] | Side B casualties |
| stageParams | bytes | Stage params (encoded abi.encode(sideAOffense, sideBOffense, sideADefence, sideBDefence)) |


### calculateAllCasualties

```solidity
function calculateAllCasualties() external view returns (uint256[] sideACasualties, uint256[] sideBCasualties, uint256 winningSide)
```

Calculates casualties for all battle stages

_Uses values from battles' sideUnitsAmount in order to calculate casualties (can be executed while battle is still not fully formed)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| sideACasualties | uint256[] | Side A casualties |
| sideBCasualties | uint256[] | Side A casualties |
| winningSide | uint256 | Winning side (0 - both sides lost, 1 - side A Won, 2 - side B Won |


### getBattleDuration

```solidity
function getBattleDuration(bool isCultistsAttacked, uint256 maxBattleDuration, uint256 sideAUnitsAmount, uint256 sideBUnitsAmount) external view returns (uint64 battleDuration)
```

Calculates battle duration

_Returns same value as #calculateBattlesDuration but without the need to provide all parameters_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isCultistsAttacked | bool | Is cultists attacked |
| maxBattleDuration | uint256 | Max allowed battle duration |
| sideAUnitsAmount | uint256 | Side A units amount |
| sideBUnitsAmount | uint256 | Side B units amount |

| Name | Type | Description |
| ---- | ---- | ----------- |
| battleDuration | uint64 | Battle duration |


### canEndBattle

```solidity
function canEndBattle() external view returns (bool canEndBattle)
```

Calculates if battle can be ended

_Checks if endTime is set and current block.timestamp > beginTime + duration_


| Name | Type | Description |
| ---- | ---- | ----------- |
| canEndBattle | bool | Can battle be ended |


### isEndedBattle

```solidity
function isEndedBattle() external view returns (bool isEndedBattle)
```

Calculates if battle is ended

_Checks if endTime is not zero_


| Name | Type | Description |
| ---- | ---- | ----------- |
| isEndedBattle | bool | Is ended battle |


### calculateArmyCasualties

```solidity
function calculateArmyCasualties(address armyAddress) external view returns (bool isArmyWon, uint256[] unitsAmounts)
```

Calculates casualties for specified army

_Provides valid results only for ended battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army presented in battle |

| Name | Type | Description |
| ---- | ---- | ----------- |
| isArmyWon | bool | Is army won |
| unitsAmounts | uint256[] | Amount of casualties for related unit types |


### isLobbyTime

```solidity
function isLobbyTime() external view returns (bool isLobbyTime)
```

Calculates if lobby is opened

_Calculates if lobby is opened_


| Name | Type | Description |
| ---- | ---- | ----------- |
| isLobbyTime | bool | Is lobby is opened |


### calculateBattleDuration

```solidity
function calculateBattleDuration(uint256 globalMultiplier, uint256 baseBattleDuration, uint256 minBattleDuration, bool isCultistsAttacked, uint256 units1, uint256 units2, uint256 maxBattleDuration) external view returns (uint64 battleDuration)
```

Calculates battle duration based on specified parameters

_globalMultiplier, baseBattleDuration parameters from registry_

| Name | Type | Description |
| ---- | ---- | ----------- |
| globalMultiplier | uint256 | Global multiplier (from registry) |
| baseBattleDuration | uint256 | Base battle duration (from registry) |
| minBattleDuration | uint256 | Minimum battle duration (from registry) |
| isCultistsAttacked | bool | Is cultists attacked |
| units1 | uint256 | Amount of units from attacker army |
| units2 | uint256 | Amount of units from attacked army |
| maxBattleDuration | uint256 | Max allowed battle duration |

| Name | Type | Description |
| ---- | ---- | ----------- |
| battleDuration | uint64 | Battle duration |


