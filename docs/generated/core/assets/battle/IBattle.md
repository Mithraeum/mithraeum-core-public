## IBattle


Functions to read state/modify state in order to get current battle parameters and/or interact with it





### Casualty








```solidity
struct Casualty {
  uint256 unitSpec;
  uint256 casualties;
}
```

### Timing








```solidity
struct Timing {
  uint64 creationTime;
  uint64 lobbyDuration;
  uint64 ongoingDuration;
  uint64 finishTime;
}
```

### Joined

```solidity
event Joined(address armyAddress, bool isSideA)
```

Emitted when army joined battle


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the joined army |
| isSideA | bool | Side to which army is joined |



### CasualtiesAdded

```solidity
event CasualtiesAdded(bool isSideA, uint256 unitSpec, uint256 casualities)
```

Emitted when #startBattle is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| isSideA | bool | Side of which casualties where added |
| unitSpec | uint256 | Type of unit |
| casualities | uint256 | Amount of casualties |



### Finished

```solidity
event Finished(uint256 finishTime, uint256[] casualitiesA, uint256[] casualitiesB)
```

Emitted when #startBattle is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| finishTime | uint256 | Time at which battle is finished |
| casualitiesA | uint256[] | Amount of total casualties from side A |
| casualitiesB | uint256[] | Amount of total casualties from side B |



### position

```solidity
function position() external view returns (uint32)
```

Position at which battle is being held

_Immutable, initialized on the battle creation_




### sideA

```solidity
function sideA(uint256 index) external view returns (address armyAddress)
```

An array of armies joined to side A

_Updated when army joins side A_

| Name | Type | Description |
| ---- | ---- | ----------- |
| index | uint256 | Index inside the array |

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address at the specified index |


### sideB

```solidity
function sideB(uint256 index) external view returns (address armyAddress)
```

An array of armies joined to side B

_Updated when army joins side B_

| Name | Type | Description |
| ---- | ---- | ----------- |
| index | uint256 | Index inside the array |

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address at the specified index |


### sideUnitsCount

```solidity
function sideUnitsCount(bool isSideA, string unitName) external view returns (uint256 unitsCount)
```

Mapping that contains units amount by side and unit type

_Updated when army joins side_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isSideA | bool | Side of which query units amount (sideA = true, sideB = false) |
| unitName | string | Unit type to query |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsCount | uint256 | Amount of units by specified side and unit type |


### userUnitsCount

```solidity
function userUnitsCount(address armyAddress, string unitName) external view returns (uint256 unitsCount)
```

Mapping that contains amount of units by army address and unit type

_Updated when army joins battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |
| unitName | string | Unit type to query |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsCount | uint256 | Amount of units by army address and unit type |


### casualties

```solidity
function casualties(bool isSideA, string unitName) external view returns (uint256 casualtiesCount)
```

Mapping that contains amount of casualties after battle is finished

_Updated when #startBattle is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isSideA | bool | Side of which query casualties amount (sideA = true, sideB = false) |
| unitName | string | Unit type to query |

| Name | Type | Description |
| ---- | ---- | ----------- |
| casualtiesCount | uint256 | Amount of casualties by side and unit type |


### isOnSideA

```solidity
function isOnSideA(address armyAddress) external view returns (bool isSideA)
```

Mapping that contains side at which joined army is on

_Updated when #joinBattle is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| isSideA | bool | Side of specified army (sideA = true, sideB = false) |


### timing

```solidity
function timing() external view returns (uint64 creationTime, uint64 lobbyDuration, uint64 ongoingDuration, uint64 finishTime)
```

Battle time parameters

_Updated when battle initialized, first armies joined and finished (#initBattle, #joinBattle, #startBattle)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| creationTime | uint64 | Time when battle is created |
| lobbyDuration | uint64 | Lobby duration, initialized when first two armies joined |
| ongoingDuration | uint64 | Ongoing duration, initialized when first two armies joined |
| finishTime | uint64 | Time when battle is finished |


### init

```solidity
function init(address attackerArmyAddress) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| attackerArmyAddress | address | Attacker army address |



### getSideALength

```solidity
function getSideALength() external view returns (uint256 armiesCount)
```

Calculates amount of armies joined to side A

_Basically returns length of sideA array_


| Name | Type | Description |
| ---- | ---- | ----------- |
| armiesCount | uint256 | Amount of armies joined to side A |


### getSideBLength

```solidity
function getSideBLength() external view returns (uint256 armiesCount)
```

Calculates amount of armies joined to side B

_Basically returns length of sideA array_


| Name | Type | Description |
| ---- | ---- | ----------- |
| armiesCount | uint256 | Amount of armies joined to side B |


### joinBattle

```solidity
function joinBattle(bool isSideA) external
```

Join msg.sender in battle

_Even though function is open, only army can join battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isSideA | bool | Side to which army will join |



### exitBattle

```solidity
function exitBattle() external
```

Exits battle as msg.sender

_Even though function is open, only army can exit battle_




### startBattle

```solidity
function startBattle() external
```

Starts battle

_Even though function is called start battle, it finishes battle calculating and updating casualties_




### getLobbyDuration

```solidity
function getLobbyDuration(bool isOccultistsAttacked) external view returns (uint64 duration)
```

Calculates lobby duration

_Will be deprecated in favor of #calculateTimings_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isOccultistsAttacked | bool | Is occultists attacked |

| Name | Type | Description |
| ---- | ---- | ----------- |
| duration | uint64 | Lobby duration |


### getOngoingDuration

```solidity
function getOngoingDuration(bool isOccultistsAttacked) external view returns (uint64 duration)
```

Calculates lobby duration

_Will be deprecated in favor of #calculateTimings_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isOccultistsAttacked | bool | Is occultists attacked |

| Name | Type | Description |
| ---- | ---- | ----------- |
| duration | uint64 | Ongoing duration |


### canExitFromBattle

```solidity
function canExitFromBattle() external view returns (bool isBattleFinished)
```

Calculates if battle is finished

_Checks if finishTime is set and current block.timestamp > finishTime_


| Name | Type | Description |
| ---- | ---- | ----------- |
| isBattleFinished | bool | Is battle finished |


### calculateUserCasualties

```solidity
function calculateUserCasualties(address armyAddress) external view returns (string[] unitNames, uint256[] unitsCount)
```

Calculates casualties for specified army

_Provides valid results only for finished battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army presented in battle |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitNames | string[] | Unit types |
| unitsCount | uint256[] | Amount of casualties for related unit types |


### isJoinTime

```solidity
function isJoinTime() external view returns (bool isJoinTime)
```

Calculates if lobby is opened

_Will be deprecated_


| Name | Type | Description |
| ---- | ---- | ----------- |
| isJoinTime | bool | Is lobby is opened |


### calculateTimings

```solidity
function calculateTimings(uint256 globalMultiplier, uint256 baseLobbyDuration, uint256 baseOngoingDuration, bool isOccultistsAttacked, uint256 units1, uint256 units2) external view returns (uint64 lobbyDuration, uint64 ongoingDuration)
```

Calculates lobby duration and ongoing duration based on specified parameters

_globalMultiplier, baseLobbyDuration, baseOngoingDuration parameters from registry_

| Name | Type | Description |
| ---- | ---- | ----------- |
| globalMultiplier | uint256 | Global multiplier (from registry) |
| baseLobbyDuration | uint256 | Base lobby duration (from registry) |
| baseOngoingDuration | uint256 | Base ongoing duration (from registry) |
| isOccultistsAttacked | bool | Is occultists attacked |
| units1 | uint256 | Amount of units from attacker army |
| units2 | uint256 | Amount of units from attacked army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| lobbyDuration | uint64 | Lobby duration |
| ongoingDuration | uint64 | Ongoing duration |


## IBattle


Functions to read state/modify state in order to get current battle parameters and/or interact with it





### Casualty








```solidity
struct Casualty {
  uint256 unitSpec;
  uint256 casualties;
}
```

### Timing








```solidity
struct Timing {
  uint64 creationTime;
  uint64 lobbyDuration;
  uint64 ongoingDuration;
  uint64 finishTime;
}
```

### Joined

```solidity
event Joined(address armyAddress, bool isSideA)
```

Emitted when army joined battle


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the joined army |
| isSideA | bool | Side to which army is joined |



### CasualtiesAdded

```solidity
event CasualtiesAdded(bool isSideA, uint256 unitSpec, uint256 casualities)
```

Emitted when #startBattle is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| isSideA | bool | Side of which casualties where added |
| unitSpec | uint256 | Type of unit |
| casualities | uint256 | Amount of casualties |



### Finished

```solidity
event Finished(uint256 finishTime, uint256[] casualitiesA, uint256[] casualitiesB)
```

Emitted when #startBattle is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| finishTime | uint256 | Time at which battle is finished |
| casualitiesA | uint256[] | Amount of total casualties from side A |
| casualitiesB | uint256[] | Amount of total casualties from side B |



### position

```solidity
function position() external view returns (uint32)
```

Position at which battle is being held

_Immutable, initialized on the battle creation_




### sideA

```solidity
function sideA(uint256 index) external view returns (address armyAddress)
```

An array of armies joined to side A

_Updated when army joins side A_

| Name | Type | Description |
| ---- | ---- | ----------- |
| index | uint256 | Index inside the array |

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address at the specified index |


### sideB

```solidity
function sideB(uint256 index) external view returns (address armyAddress)
```

An array of armies joined to side B

_Updated when army joins side B_

| Name | Type | Description |
| ---- | ---- | ----------- |
| index | uint256 | Index inside the array |

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address at the specified index |


### sideUnitsCount

```solidity
function sideUnitsCount(bool isSideA, string unitName) external view returns (uint256 unitsCount)
```

Mapping that contains units amount by side and unit type

_Updated when army joins side_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isSideA | bool | Side of which query units amount (sideA = true, sideB = false) |
| unitName | string | Unit type to query |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsCount | uint256 | Amount of units by specified side and unit type |


### userUnitsCount

```solidity
function userUnitsCount(address armyAddress, string unitName) external view returns (uint256 unitsCount)
```

Mapping that contains amount of units by army address and unit type

_Updated when army joins battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |
| unitName | string | Unit type to query |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsCount | uint256 | Amount of units by army address and unit type |


### casualties

```solidity
function casualties(bool isSideA, string unitName) external view returns (uint256 casualtiesCount)
```

Mapping that contains amount of casualties after battle is finished

_Updated when #startBattle is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isSideA | bool | Side of which query casualties amount (sideA = true, sideB = false) |
| unitName | string | Unit type to query |

| Name | Type | Description |
| ---- | ---- | ----------- |
| casualtiesCount | uint256 | Amount of casualties by side and unit type |


### isOnSideA

```solidity
function isOnSideA(address armyAddress) external view returns (bool isSideA)
```

Mapping that contains side at which joined army is on

_Updated when #joinBattle is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| isSideA | bool | Side of specified army (sideA = true, sideB = false) |


### timing

```solidity
function timing() external view returns (uint64 creationTime, uint64 lobbyDuration, uint64 ongoingDuration, uint64 finishTime)
```

Battle time parameters

_Updated when battle initialized, first armies joined and finished (#initBattle, #joinBattle, #startBattle)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| creationTime | uint64 | Time when battle is created |
| lobbyDuration | uint64 | Lobby duration, initialized when first two armies joined |
| ongoingDuration | uint64 | Ongoing duration, initialized when first two armies joined |
| finishTime | uint64 | Time when battle is finished |


### init

```solidity
function init(address attackerArmyAddress) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| attackerArmyAddress | address | Attacker army address |



### getSideALength

```solidity
function getSideALength() external view returns (uint256 armiesCount)
```

Calculates amount of armies joined to side A

_Basically returns length of sideA array_


| Name | Type | Description |
| ---- | ---- | ----------- |
| armiesCount | uint256 | Amount of armies joined to side A |


### getSideBLength

```solidity
function getSideBLength() external view returns (uint256 armiesCount)
```

Calculates amount of armies joined to side B

_Basically returns length of sideA array_


| Name | Type | Description |
| ---- | ---- | ----------- |
| armiesCount | uint256 | Amount of armies joined to side B |


### joinBattle

```solidity
function joinBattle(bool isSideA) external
```

Join msg.sender in battle

_Even though function is open, only army can join battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isSideA | bool | Side to which army will join |



### exitBattle

```solidity
function exitBattle() external
```

Exits battle as msg.sender

_Even though function is open, only army can exit battle_




### startBattle

```solidity
function startBattle() external
```

Starts battle

_Even though function is called start battle, it finishes battle calculating and updating casualties_




### getLobbyDuration

```solidity
function getLobbyDuration(bool isOccultistsAttacked) external view returns (uint64 duration)
```

Calculates lobby duration

_Will be deprecated in favor of #calculateTimings_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isOccultistsAttacked | bool | Is occultists attacked |

| Name | Type | Description |
| ---- | ---- | ----------- |
| duration | uint64 | Lobby duration |


### getOngoingDuration

```solidity
function getOngoingDuration(bool isOccultistsAttacked) external view returns (uint64 duration)
```

Calculates lobby duration

_Will be deprecated in favor of #calculateTimings_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isOccultistsAttacked | bool | Is occultists attacked |

| Name | Type | Description |
| ---- | ---- | ----------- |
| duration | uint64 | Ongoing duration |


### canExitFromBattle

```solidity
function canExitFromBattle() external view returns (bool isBattleFinished)
```

Calculates if battle is finished

_Checks if finishTime is set and current block.timestamp > finishTime_


| Name | Type | Description |
| ---- | ---- | ----------- |
| isBattleFinished | bool | Is battle finished |


### calculateUserCasualties

```solidity
function calculateUserCasualties(address armyAddress) external view returns (string[] unitNames, uint256[] unitsCount)
```

Calculates casualties for specified army

_Provides valid results only for finished battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army presented in battle |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitNames | string[] | Unit types |
| unitsCount | uint256[] | Amount of casualties for related unit types |


### isJoinTime

```solidity
function isJoinTime() external view returns (bool isJoinTime)
```

Calculates if lobby is opened

_Will be deprecated_


| Name | Type | Description |
| ---- | ---- | ----------- |
| isJoinTime | bool | Is lobby is opened |


### calculateTimings

```solidity
function calculateTimings(uint256 globalMultiplier, uint256 baseLobbyDuration, uint256 baseOngoingDuration, bool isOccultistsAttacked, uint256 units1, uint256 units2) external view returns (uint64 lobbyDuration, uint64 ongoingDuration)
```

Calculates lobby duration and ongoing duration based on specified parameters

_globalMultiplier, baseLobbyDuration, baseOngoingDuration parameters from registry_

| Name | Type | Description |
| ---- | ---- | ----------- |
| globalMultiplier | uint256 | Global multiplier (from registry) |
| baseLobbyDuration | uint256 | Base lobby duration (from registry) |
| baseOngoingDuration | uint256 | Base ongoing duration (from registry) |
| isOccultistsAttacked | bool | Is occultists attacked |
| units1 | uint256 | Amount of units from attacker army |
| units2 | uint256 | Amount of units from attacked army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| lobbyDuration | uint64 | Lobby duration |
| ongoingDuration | uint64 | Ongoing duration |


