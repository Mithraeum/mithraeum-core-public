## Battle








### position

```solidity
uint32 position
```

Position at which battle is being held

_Immutable, initialized on the battle creation_




### sideA

```solidity
address[] sideA
```

An array of armies joined to side A

_Updated when army joins side A_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### sideB

```solidity
address[] sideB
```

An array of armies joined to side B

_Updated when army joins side B_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### sideUnitsCount

```solidity
mapping(bool => mapping(string => uint256)) sideUnitsCount
```

Mapping that contains units amount by side and unit type

_Updated when army joins side_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### userUnitsCount

```solidity
mapping(address => mapping(string => uint256)) userUnitsCount
```

Mapping that contains amount of units by army address and unit type

_Updated when army joins battle_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### casualties

```solidity
mapping(bool => mapping(string => uint256)) casualties
```

Mapping that contains amount of casualties after battle is finished

_Updated when #startBattle is called_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### isOnSideA

```solidity
mapping(address => bool) isOnSideA
```

Mapping that contains side at which joined army is on

_Updated when #joinBattle is called_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### timing

```solidity
struct IBattle.Timing timing
```

Battle time parameters

_Updated when battle initialized, first armies joined and finished (#initBattle, #joinBattle, #startBattle)_


| Name | Type | Description |
| ---- | ---- | ----------- |


### init

```solidity
function init(address attackerArmyAddress) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| attackerArmyAddress | address | Attacker army address |



### getSideALength

```solidity
function getSideALength() public view returns (uint256)
```

Calculates amount of armies joined to side A

_Basically returns length of sideA array_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getSideBLength

```solidity
function getSideBLength() public view returns (uint256)
```

Calculates amount of armies joined to side B

_Basically returns length of sideA array_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### isJoinTime

```solidity
function isJoinTime() public view returns (bool)
```

Calculates if lobby is opened

_Will be deprecated_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### joinBattle

```solidity
function joinBattle(bool _isSideA) public
```

Join msg.sender in battle

_Even though function is open, only army can join battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _isSideA | bool |  |



### canExitFromBattle

```solidity
function canExitFromBattle() public view returns (bool)
```

Calculates if battle is finished

_Checks if finishTime is set and current block.timestamp > finishTime_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### exitBattle

```solidity
function exitBattle() public
```

Exits battle as msg.sender

_Even though function is open, only army can exit battle_




### calculateUserCasualties

```solidity
function calculateUserCasualties(address armyAddress) public view returns (string[], uint256[])
```

Calculates casualties for specified army

_Provides valid results only for finished battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army presented in battle |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string[] |  |
| [1] | uint256[] |  |


### calculateTimings

```solidity
function calculateTimings(uint256 globalMultiplier, uint256 baseLobbyDuration, uint256 baseOngoingDuration, bool isOccultistsAttacked, uint256 units1, uint256 units2) public view returns (uint64, uint64)
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
| [0] | uint64 |  |
| [1] | uint64 |  |


### getLobbyDuration

```solidity
function getLobbyDuration(bool isOccultistsAttacked) public view returns (uint64)
```

Calculates lobby duration

_Will be deprecated in favor of #calculateTimings_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isOccultistsAttacked | bool | Is occultists attacked |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint64 |  |


### getOngoingDuration

```solidity
function getOngoingDuration(bool isOccultistsAttacked) public view returns (uint64)
```

Calculates lobby duration

_Will be deprecated in favor of #calculateTimings_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isOccultistsAttacked | bool | Is occultists attacked |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint64 |  |


### startBattle

```solidity
function startBattle() public
```

Starts battle

_Even though function is called start battle, it finishes battle calculating and updating casualties_




### _calculateStage1CasualtiesForDron

```solidity
function _calculateStage1CasualtiesForDron() public view returns (struct IBattle.Casualty[] _sideACasualties, struct IBattle.Casualty[] _sideBCasualties, uint256 length)
```



_Calculates casualties for first battle stage_




### _calculateAllCasualties

```solidity
function _calculateAllCasualties() public view returns (struct IBattle.Casualty[], struct IBattle.Casualty[], uint256)
```



_Calculates casualties for all battle stages_




### calculateUnitsCount

```solidity
function calculateUnitsCount(bool _isSideA) internal view returns (uint256 unitsCount)
```



_Calculates total amount of units in specified side_




## Battle








### position

```solidity
uint32 position
```

Position at which battle is being held

_Immutable, initialized on the battle creation_




### sideA

```solidity
address[] sideA
```

An array of armies joined to side A

_Updated when army joins side A_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### sideB

```solidity
address[] sideB
```

An array of armies joined to side B

_Updated when army joins side B_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### sideUnitsCount

```solidity
mapping(bool => mapping(string => uint256)) sideUnitsCount
```

Mapping that contains units amount by side and unit type

_Updated when army joins side_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### userUnitsCount

```solidity
mapping(address => mapping(string => uint256)) userUnitsCount
```

Mapping that contains amount of units by army address and unit type

_Updated when army joins battle_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### casualties

```solidity
mapping(bool => mapping(string => uint256)) casualties
```

Mapping that contains amount of casualties after battle is finished

_Updated when #startBattle is called_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### isOnSideA

```solidity
mapping(address => bool) isOnSideA
```

Mapping that contains side at which joined army is on

_Updated when #joinBattle is called_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### timing

```solidity
struct IBattle.Timing timing
```

Battle time parameters

_Updated when battle initialized, first armies joined and finished (#initBattle, #joinBattle, #startBattle)_


| Name | Type | Description |
| ---- | ---- | ----------- |


### init

```solidity
function init(address attackerArmyAddress) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| attackerArmyAddress | address | Attacker army address |



### getSideALength

```solidity
function getSideALength() public view returns (uint256)
```

Calculates amount of armies joined to side A

_Basically returns length of sideA array_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getSideBLength

```solidity
function getSideBLength() public view returns (uint256)
```

Calculates amount of armies joined to side B

_Basically returns length of sideA array_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### isJoinTime

```solidity
function isJoinTime() public view returns (bool)
```

Calculates if lobby is opened

_Will be deprecated_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### joinBattle

```solidity
function joinBattle(bool _isSideA) public
```

Join msg.sender in battle

_Even though function is open, only army can join battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _isSideA | bool |  |



### canExitFromBattle

```solidity
function canExitFromBattle() public view returns (bool)
```

Calculates if battle is finished

_Checks if finishTime is set and current block.timestamp > finishTime_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### exitBattle

```solidity
function exitBattle() public
```

Exits battle as msg.sender

_Even though function is open, only army can exit battle_




### calculateUserCasualties

```solidity
function calculateUserCasualties(address armyAddress) public view returns (string[], uint256[])
```

Calculates casualties for specified army

_Provides valid results only for finished battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army presented in battle |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string[] |  |
| [1] | uint256[] |  |


### calculateTimings

```solidity
function calculateTimings(uint256 globalMultiplier, uint256 baseLobbyDuration, uint256 baseOngoingDuration, bool isOccultistsAttacked, uint256 units1, uint256 units2) public view returns (uint64, uint64)
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
| [0] | uint64 |  |
| [1] | uint64 |  |


### getLobbyDuration

```solidity
function getLobbyDuration(bool isOccultistsAttacked) public view returns (uint64)
```

Calculates lobby duration

_Will be deprecated in favor of #calculateTimings_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isOccultistsAttacked | bool | Is occultists attacked |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint64 |  |


### getOngoingDuration

```solidity
function getOngoingDuration(bool isOccultistsAttacked) public view returns (uint64)
```

Calculates lobby duration

_Will be deprecated in favor of #calculateTimings_

| Name | Type | Description |
| ---- | ---- | ----------- |
| isOccultistsAttacked | bool | Is occultists attacked |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint64 |  |


### startBattle

```solidity
function startBattle() public
```

Starts battle

_Even though function is called start battle, it finishes battle calculating and updating casualties_




### _calculateStage1CasualtiesForDron

```solidity
function _calculateStage1CasualtiesForDron() public view returns (struct IBattle.Casualty[] _sideACasualties, struct IBattle.Casualty[] _sideBCasualties, uint256 length)
```



_Calculates casualties for first battle stage_




### _calculateAllCasualties

```solidity
function _calculateAllCasualties() public view returns (struct IBattle.Casualty[], struct IBattle.Casualty[], uint256)
```



_Calculates casualties for all battle stages_




### calculateUnitsCount

```solidity
function calculateUnitsCount(bool _isSideA) internal view returns (uint256 unitsCount)
```



_Calculates total amount of units in specified side_




