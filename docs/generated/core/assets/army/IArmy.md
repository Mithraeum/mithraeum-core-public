## IArmy


Functions to read state/modify state in order to get current army parameters and/or interact with it





### MovementTiming








```solidity
struct MovementTiming {
  uint64 startTime;
  uint64 endTime;
}
```

### UnitsChanged

```solidity
event UnitsChanged(string unitName, uint256 value)
```

Emitted when #burnUnits is called (#demilitarize or #exitBattle)


| Name | Type | Description |
| ---- | ---- | ----------- |
| unitName | string | Name of the unit type |
| value | uint256 | New amount of unit type presented in army |



### UpdatedPosition

```solidity
event UpdatedPosition(address settlementAddress, uint32 position)
```

Emitted when #updatePosition is called (even though event can be emitted only on the next action related to the current army, de-facto army will update position based on 'movementTiming.endTime'


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Address of the settlement where army currently staying on |
| position | uint32 | Position |



### NewBattle

```solidity
event NewBattle(address battleAddress, address targetArmyAddress)
```

Emitted when #newBattle is called. Army which attacks another army will emit this event.


| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Created battle address |
| targetArmyAddress | address | Address of the attacked army |



### JoinedBattle

```solidity
event JoinedBattle(address battleAddress, bool isSideA)
```

Emitted when army joins battle. At the battle creation both armies (attacker and attacked) will emit this event. Attacker army will be side A and at attacked army will be sideB


| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Address of the battle army joined in |
| isSideA | bool | Side to which army joined |



### ExitedFromBattle

```solidity
event ExitedFromBattle(address battleAddress)
```

Emitted when #_exitBattle is called (even though event can be emitted only on the next action related to the current army, de-facto army will exit battle when battle is finished)


| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Address of the battle army was in |



### MovingTo

```solidity
event MovingTo(address destinationSettlement, uint256 movementStartTime, uint256 movementFinishTime, uint32[] path)
```

Emitted when #move is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| destinationSettlement | address | Address of the settlement army is moving to |
| movementStartTime | uint256 | Time at which movement began |
| movementFinishTime | uint256 | Time at which movement will end |
| path | uint32[] | The path army is taken from starting position to destination position |



### currentSettlement

```solidity
function currentSettlement() external view returns (contract ISettlement)
```

Settlement address to which this army belongs

_Immutable, initialized on the army creation_




### currentPosition

```solidity
function currentPosition() external view returns (uint32)
```

Position where army currently stands on

_Updated when army updates position. It does not take into account if army is moving
To proper query current position use #getCurrentPosition_




### destinationPosition

```solidity
function destinationPosition() external view returns (uint32)
```

Position to which are is moving to

_Updated when army starts moving. It does not take into account if army is finished move by time
To proper calculate destination position you need to check if army finished movement by comparing current time and movementTiming.endTime_




### battle

```solidity
function battle() external view returns (contract IBattle)
```

Battle in which army is on

_If army is not in battle returns address(0). It does not take into account if battle is finished but army is not left the battle_




### siege

```solidity
function siege() external view returns (contract ISiege)
```

Siege in which are army is on

_If army is not in siege returns address(0)_




### movementTiming

```solidity
function movementTiming() external view returns (uint64 startTime, uint64 endTime)
```

Movement timings

_Updated when army starts moving. It does not take into account if army is finished move by time_




### movementPath

```solidity
function movementPath(uint256 index) external view returns (uint32)
```

Path army is taken during movement

_Updated when army starts moving. It does not take into account if army is finished move by time
To proper query entire movementPath use #getMovementPath_




### lastDemilitarizationTime

```solidity
function lastDemilitarizationTime() external view returns (uint256)
```

Time at which last demilitarization occured

_Updated when #demilitarize is called_




### init

```solidity
function init(address settlementAddress) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### getMovementPath

```solidity
function getMovementPath() external view returns (uint32[] path)
```

Path army is taken during movement

_Useful to get entire movement path rather than querying each path item by index. It does not take into account if army is finished move by time_


| Name | Type | Description |
| ---- | ---- | ----------- |
| path | uint32[] | Entire path army is taken during movement |


### updateState

```solidity
function updateState() external
```

Updates army state to the current block

_Called on every action which are based on army state and time_




### move

```solidity
function move(uint32[] path, uint256 foodToSpendOnFeeding) external
```

Initiates army movement to the settlement

_Even though path can be provided artificial only allowed movement to a settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| path | uint32[] | Path army will take to the settlement |
| foodToSpendOnFeeding | uint256 | Amount of food army will take from current position settlements FARM in order to decrease total time army will take to get to destination position |



### demilitarize

```solidity
function demilitarize(string[] unitNames, uint256[] unitsCount) external
```

Demilitarizes part of the army. Demilitarization provides prosperity to the settlement army is currently staying on

_Even though demilitarization of 0 units may seem reasonable, it is disabled_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitNames | string[] | Names of the unit types for demilitarization |
| unitsCount | uint256[] | Amount of units for demilitarization for every unit type |



### setInBattle

```solidity
function setInBattle(address battleAddress) external
```

Sets army is battle

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Address of the battle |



### newBattle

```solidity
function newBattle(address armyAddress) external
```

Initiates battle with another army is both are not in battle

_Creates IBattle and sets both armies in created battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army this army will attack |



### joinBattle

```solidity
function joinBattle(address battleAddress, bool isSideA) external
```

Joins current army in battle to the provided side

_Moving army is able to join battle only if caller is another army (drags it into battle)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Battle address army will join |
| isSideA | bool | Side of the battle army will join |



### burnUnits

```solidity
function burnUnits(string[] unitNames, uint256[] unitsCount) external
```

Burns units from the army

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitNames | string[] | Names of the unit types for burning |
| unitsCount | uint256[] | Amount of units for burning for every unit type |



### getCurrentPosition

```solidity
function getCurrentPosition() external view returns (uint32 position)
```

Calculates current position taking to the account #movementTimings

_This method should be used to determine real army position_


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |


### setUnitsInSiege

```solidity
function setUnitsInSiege(string[] addUnitsNames, uint256[] addUnitsCount, string[] removeUnitsNames, uint256[] removeUnitsCount) external
```

Sets and withdraw units to/from siege

_Provides ability to atomically setup/re-setup siege_

| Name | Type | Description |
| ---- | ---- | ----------- |
| addUnitsNames | string[] | Names of the unit types to put in siege |
| addUnitsCount | uint256[] | Amount of units to put in siege for every unit type |
| removeUnitsNames | string[] | Names of the unit types to withdraw from siege |
| removeUnitsCount | uint256[] | Amount of units to withdraw from siege for every unit type |



### claimResources

```solidity
function claimResources(address buildingAddress, uint256 points) external
```

Swaps accumulated robbery tokens in siege for resource

_Amount of points will be taken may be lesser if building does not have resources in its treasury_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of the building treasury of which will be robbed |
| points | uint256 | Amount of points to spend for resources |



### getTotalSiegeSupport

```solidity
function getTotalSiegeSupport() external view returns (uint256 totalSiegeSupport)
```

Calculates total siege support of the army

_For every unit type placed in siege calculates sum of all of them_


| Name | Type | Description |
| ---- | ---- | ----------- |
| totalSiegeSupport | uint256 | Total siege support of the army |


### setSiegeAddress

```solidity
function setSiegeAddress(address siegeAddress) external
```

Sets army in siege

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| siegeAddress | address | Address of the siege |



### getOwner

```solidity
function getOwner() external view returns (address ownerAddress)
```

Return owner of the army

_Same as owner of the settlement to which this army belongs_


| Name | Type | Description |
| ---- | ---- | ----------- |
| ownerAddress | address | Address of the owner of the army |


### updatePosition

```solidity
function updatePosition() external
```

Updates army position if movement is finished

_Called on every action which are based on army state and time_




### isHomePosition

```solidity
function isHomePosition() external view returns (bool isHomePosition)
```

Calculates is army on its home position

_Takes into account if army movement is finished_


| Name | Type | Description |
| ---- | ---- | ----------- |
| isHomePosition | bool | Is army on home position |


## IArmy


Functions to read state/modify state in order to get current army parameters and/or interact with it





### MovementTiming








```solidity
struct MovementTiming {
  uint64 startTime;
  uint64 endTime;
}
```

### UnitsChanged

```solidity
event UnitsChanged(string unitName, uint256 value)
```

Emitted when #burnUnits is called (#demilitarize or #exitBattle)


| Name | Type | Description |
| ---- | ---- | ----------- |
| unitName | string | Name of the unit type |
| value | uint256 | New amount of unit type presented in army |



### UpdatedPosition

```solidity
event UpdatedPosition(address settlementAddress, uint32 position)
```

Emitted when #updatePosition is called (even though event can be emitted only on the next action related to the current army, de-facto army will update position based on 'movementTiming.endTime'


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Address of the settlement where army currently staying on |
| position | uint32 | Position |



### NewBattle

```solidity
event NewBattle(address battleAddress, address targetArmyAddress)
```

Emitted when #newBattle is called. Army which attacks another army will emit this event.


| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Created battle address |
| targetArmyAddress | address | Address of the attacked army |



### JoinedBattle

```solidity
event JoinedBattle(address battleAddress, bool isSideA)
```

Emitted when army joins battle. At the battle creation both armies (attacker and attacked) will emit this event. Attacker army will be side A and at attacked army will be sideB


| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Address of the battle army joined in |
| isSideA | bool | Side to which army joined |



### ExitedFromBattle

```solidity
event ExitedFromBattle(address battleAddress)
```

Emitted when #_exitBattle is called (even though event can be emitted only on the next action related to the current army, de-facto army will exit battle when battle is finished)


| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Address of the battle army was in |



### MovingTo

```solidity
event MovingTo(address destinationSettlement, uint256 movementStartTime, uint256 movementFinishTime, uint32[] path)
```

Emitted when #move is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| destinationSettlement | address | Address of the settlement army is moving to |
| movementStartTime | uint256 | Time at which movement began |
| movementFinishTime | uint256 | Time at which movement will end |
| path | uint32[] | The path army is taken from starting position to destination position |



### currentSettlement

```solidity
function currentSettlement() external view returns (contract ISettlement)
```

Settlement address to which this army belongs

_Immutable, initialized on the army creation_




### currentPosition

```solidity
function currentPosition() external view returns (uint32)
```

Position where army currently stands on

_Updated when army updates position. It does not take into account if army is moving
To proper query current position use #getCurrentPosition_




### destinationPosition

```solidity
function destinationPosition() external view returns (uint32)
```

Position to which are is moving to

_Updated when army starts moving. It does not take into account if army is finished move by time
To proper calculate destination position you need to check if army finished movement by comparing current time and movementTiming.endTime_




### battle

```solidity
function battle() external view returns (contract IBattle)
```

Battle in which army is on

_If army is not in battle returns address(0). It does not take into account if battle is finished but army is not left the battle_




### siege

```solidity
function siege() external view returns (contract ISiege)
```

Siege in which are army is on

_If army is not in siege returns address(0)_




### movementTiming

```solidity
function movementTiming() external view returns (uint64 startTime, uint64 endTime)
```

Movement timings

_Updated when army starts moving. It does not take into account if army is finished move by time_




### movementPath

```solidity
function movementPath(uint256 index) external view returns (uint32)
```

Path army is taken during movement

_Updated when army starts moving. It does not take into account if army is finished move by time
To proper query entire movementPath use #getMovementPath_




### lastDemilitarizationTime

```solidity
function lastDemilitarizationTime() external view returns (uint256)
```

Time at which last demilitarization occured

_Updated when #demilitarize is called_




### init

```solidity
function init(address settlementAddress) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### getMovementPath

```solidity
function getMovementPath() external view returns (uint32[] path)
```

Path army is taken during movement

_Useful to get entire movement path rather than querying each path item by index. It does not take into account if army is finished move by time_


| Name | Type | Description |
| ---- | ---- | ----------- |
| path | uint32[] | Entire path army is taken during movement |


### updateState

```solidity
function updateState() external
```

Updates army state to the current block

_Called on every action which are based on army state and time_




### move

```solidity
function move(uint32[] path, uint256 foodToSpendOnFeeding) external
```

Initiates army movement to the settlement

_Even though path can be provided artificial only allowed movement to a settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| path | uint32[] | Path army will take to the settlement |
| foodToSpendOnFeeding | uint256 | Amount of food army will take from current position settlements FARM in order to decrease total time army will take to get to destination position |



### demilitarize

```solidity
function demilitarize(string[] unitNames, uint256[] unitsCount) external
```

Demilitarizes part of the army. Demilitarization provides prosperity to the settlement army is currently staying on

_Even though demilitarization of 0 units may seem reasonable, it is disabled_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitNames | string[] | Names of the unit types for demilitarization |
| unitsCount | uint256[] | Amount of units for demilitarization for every unit type |



### setInBattle

```solidity
function setInBattle(address battleAddress) external
```

Sets army is battle

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Address of the battle |



### newBattle

```solidity
function newBattle(address armyAddress) external
```

Initiates battle with another army is both are not in battle

_Creates IBattle and sets both armies in created battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army this army will attack |



### joinBattle

```solidity
function joinBattle(address battleAddress, bool isSideA) external
```

Joins current army in battle to the provided side

_Moving army is able to join battle only if caller is another army (drags it into battle)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Battle address army will join |
| isSideA | bool | Side of the battle army will join |



### burnUnits

```solidity
function burnUnits(string[] unitNames, uint256[] unitsCount) external
```

Burns units from the army

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitNames | string[] | Names of the unit types for burning |
| unitsCount | uint256[] | Amount of units for burning for every unit type |



### getCurrentPosition

```solidity
function getCurrentPosition() external view returns (uint32 position)
```

Calculates current position taking to the account #movementTimings

_This method should be used to determine real army position_


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |


### setUnitsInSiege

```solidity
function setUnitsInSiege(string[] addUnitsNames, uint256[] addUnitsCount, string[] removeUnitsNames, uint256[] removeUnitsCount) external
```

Sets and withdraw units to/from siege

_Provides ability to atomically setup/re-setup siege_

| Name | Type | Description |
| ---- | ---- | ----------- |
| addUnitsNames | string[] | Names of the unit types to put in siege |
| addUnitsCount | uint256[] | Amount of units to put in siege for every unit type |
| removeUnitsNames | string[] | Names of the unit types to withdraw from siege |
| removeUnitsCount | uint256[] | Amount of units to withdraw from siege for every unit type |



### claimResources

```solidity
function claimResources(address buildingAddress, uint256 points) external
```

Swaps accumulated robbery tokens in siege for resource

_Amount of points will be taken may be lesser if building does not have resources in its treasury_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of the building treasury of which will be robbed |
| points | uint256 | Amount of points to spend for resources |



### getTotalSiegeSupport

```solidity
function getTotalSiegeSupport() external view returns (uint256 totalSiegeSupport)
```

Calculates total siege support of the army

_For every unit type placed in siege calculates sum of all of them_


| Name | Type | Description |
| ---- | ---- | ----------- |
| totalSiegeSupport | uint256 | Total siege support of the army |


### setSiegeAddress

```solidity
function setSiegeAddress(address siegeAddress) external
```

Sets army in siege

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| siegeAddress | address | Address of the siege |



### getOwner

```solidity
function getOwner() external view returns (address ownerAddress)
```

Return owner of the army

_Same as owner of the settlement to which this army belongs_


| Name | Type | Description |
| ---- | ---- | ----------- |
| ownerAddress | address | Address of the owner of the army |


### updatePosition

```solidity
function updatePosition() external
```

Updates army position if movement is finished

_Called on every action which are based on army state and time_




### isHomePosition

```solidity
function isHomePosition() external view returns (bool isHomePosition)
```

Calculates is army on its home position

_Takes into account if army movement is finished_


| Name | Type | Description |
| ---- | ---- | ----------- |
| isHomePosition | bool | Is army on home position |


