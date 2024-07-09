## Army








### currentSettlement

```solidity
contract ISettlement currentSettlement
```

Settlement address to which this army belongs

_Immutable, initialized on the army creation_




### currentPosition

```solidity
uint32 currentPosition
```

Position where army currently stands on

_Updated when army updates position. It does not take into account if army is moving
To proper query current position use #getCurrentPosition_




### destinationPosition

```solidity
uint32 destinationPosition
```

Position to which are is moving to

_Updated when army starts moving. It does not take into account if army is finished move by time
To proper calculate destination position you need to check if army finished movement by comparing current time and movementTiming.endTime_




### battle

```solidity
contract IBattle battle
```

Battle in which army is on

_If army is not in battle returns address(0). It does not take into account if battle is finished but army is not left the battle_




### siege

```solidity
contract ISiege siege
```

Siege in which are army is on

_If army is not in siege returns address(0)_




### movementTiming

```solidity
struct IArmy.MovementTiming movementTiming
```

Movement timings

_Updated when army starts moving. It does not take into account if army is finished move by time_




### movementPath

```solidity
uint32[] movementPath
```

Path army is taken during movement

_Updated when army starts moving. It does not take into account if army is finished move by time
To proper query entire movementPath use #getMovementPath_




### lastDemilitarizationTime

```solidity
uint256 lastDemilitarizationTime
```

Time at which last demilitarization occured

_Updated when #demilitarize is called_




### onlyOwnerOrWorldAssetFromSameEpoch

```solidity
modifier onlyOwnerOrWorldAssetFromSameEpoch()
```



_Allows caller to be only ruler or any world asset_




### init

```solidity
function init(address settlementAddress) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### getMovementPath

```solidity
function getMovementPath() public view returns (uint32[])
```

Path army is taken during movement

_Useful to get entire movement path rather than querying each path item by index. It does not take into account if army is finished move by time_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint32[] |  |


### updateState

```solidity
function updateState() public
```

Updates army state to the current block

_Called on every action which are based on army state and time_




### canUpdatePosition

```solidity
function canUpdatePosition() internal view returns (bool)
```



_Checks if army can update position at the moment_




### updatePosition

```solidity
function updatePosition() public
```

Updates army position if movement is finished

_Called on every action which are based on army state and time_




### checkLiquidation

```solidity
function checkLiquidation() public
```

Checks army for liquidation, and if it can be liquidated - liquidates it

_Anyone can call that function_




### getOwner

```solidity
function getOwner() public view returns (address)
```

Return owner of the army

_Same as owner of the settlement to which this army belongs_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### burnUnits

```solidity
function burnUnits(string[] unitNames, uint256[] unitsCount) public
```

Burns units from the army

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitNames | string[] | Names of the unit types for burning |
| unitsCount | uint256[] | Amount of units for burning for every unit type |



### speedUpArmyBySpendingFood

```solidity
function speedUpArmyBySpendingFood(uint256 defaultPathTime, uint256 pathLength, uint256 foodToSpendOnFeeding) internal returns (uint256)
```



_Updates farm's treasury, burns food specified for feeding and returns new path time_




### move

```solidity
function move(uint32[] path, uint256 foodToSpendOnFeeding) public
```

Initiates army movement to the settlement

_Even though path can be provided artificial only allowed movement to a settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| path | uint32[] | Path army will take to the settlement |
| foodToSpendOnFeeding | uint256 | Amount of food army will take from current position settlements FARM in order to decrease total time army will take to get to destination position |



### updateFortOnPositionAndGetHealth

```solidity
function updateFortOnPositionAndGetHealth(uint32 position) internal returns (uint256)
```



_Updates fort on current position and returns its health_




### calculateDefaultPathTime

```solidity
function calculateDefaultPathTime(uint32[] path) internal returns (uint256)
```



_Calculates default path time_




### demilitarize

```solidity
function demilitarize(string[] unitNames, uint256[] unitsCount) public
```

Demilitarizes part of the army. Demilitarization provides prosperity to the settlement army is currently staying on

_Even though demilitarization of 0 units may seem reasonable, it is disabled_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitNames | string[] | Names of the unit types for demilitarization |
| unitsCount | uint256[] | Amount of units for demilitarization for every unit type |



### getDecreasedPathTime

```solidity
function getDecreasedPathTime(uint256 pathLength, uint256 defaultPathTime, uint256 foodToSpendOnFeeding, uint256 foodAmountToMaximumSpeed) internal returns (uint256)
```



_Calculates decreased path time by feeding parameters_




### getFoodMovementStats

```solidity
function getFoodMovementStats(uint256 pathLength) internal returns (uint256)
```



_Calculates amount of needed food for maximum speed increase and amount of max allowed food to spend on feeding_




### getUnitsBalance

```solidity
function getUnitsBalance() internal view returns (uint256[] unitsBalances, uint256 totalUnits)
```



_Calculates current army units balance_




### getCurrentPosition

```solidity
function getCurrentPosition() public view returns (uint32)
```

Calculates current position taking to the account #movementTimings

_This method should be used to determine real army position_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint32 |  |


### setInBattle

```solidity
function setInBattle(address _battleAddress) public
```

Sets army is battle

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _battleAddress | address |  |



### newBattle

```solidity
function newBattle(address _targetArmyAddress) public
```

Initiates battle with another army is both are not in battle

_Creates IBattle and sets both armies in created battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _targetArmyAddress | address |  |



### joinBattle

```solidity
function joinBattle(address _battleAddress, bool _isSideA) public
```

Joins current army in battle to the provided side

_Moving army is able to join battle only if caller is another army (drags it into battle)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _battleAddress | address |  |
| _isSideA | bool |  |



### setUnitsInSiege

```solidity
function setUnitsInSiege(string[] _addUnitsNames, uint256[] _addUnitsCount, string[] _removeUnitsNames, uint256[] _removeUnitsCount) public
```

Sets and withdraw units to/from siege

_Provides ability to atomically setup/re-setup siege_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _addUnitsNames | string[] |  |
| _addUnitsCount | uint256[] |  |
| _removeUnitsNames | string[] |  |
| _removeUnitsCount | uint256[] |  |



### startSiege

```solidity
function startSiege(string[] _unitNames, uint256[] _unitsCount) internal
```



_Sets specified units in siege_




### withdrawUnitsFromSiege

```solidity
function withdrawUnitsFromSiege(string[] _unitNames, uint256[] _unitsCount) internal
```



_Withdraws units from siege_




### setSiegeAddress

```solidity
function setSiegeAddress(address _siegeAddress) public
```

Sets army in siege

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _siegeAddress | address |  |



### claimResources

```solidity
function claimResources(address buildingAddress, uint256 _points) public
```

Swaps accumulated robbery tokens in siege for resource

_Amount of points will be taken may be lesser if building does not have resources in its treasury_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of the building treasury of which will be robbed |
| _points | uint256 |  |



### getTotalSiegeSupport

```solidity
function getTotalSiegeSupport() public view returns (uint256 totalSiegeSupport)
```

Calculates total siege support of the army

_For every unit type placed in siege calculates sum of all of them_


| Name | Type | Description |
| ---- | ---- | ----------- |
| totalSiegeSupport | uint256 | Total siege support of the army |


### isHomePosition

```solidity
function isHomePosition() public view returns (bool)
```

Calculates is army on its home position

_Takes into account if army movement is finished_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


## Army








### currentSettlement

```solidity
contract ISettlement currentSettlement
```

Settlement address to which this army belongs

_Immutable, initialized on the army creation_




### currentPosition

```solidity
uint32 currentPosition
```

Position where army currently stands on

_Updated when army updates position. It does not take into account if army is moving
To proper query current position use #getCurrentPosition_




### destinationPosition

```solidity
uint32 destinationPosition
```

Position to which are is moving to

_Updated when army starts moving. It does not take into account if army is finished move by time
To proper calculate destination position you need to check if army finished movement by comparing current time and movementTiming.endTime_




### battle

```solidity
contract IBattle battle
```

Battle in which army is on

_If army is not in battle returns address(0). It does not take into account if battle is finished but army is not left the battle_




### siege

```solidity
contract ISiege siege
```

Siege in which are army is on

_If army is not in siege returns address(0)_




### movementTiming

```solidity
struct IArmy.MovementTiming movementTiming
```

Movement timings

_Updated when army starts moving. It does not take into account if army is finished move by time_




### movementPath

```solidity
uint32[] movementPath
```

Path army is taken during movement

_Updated when army starts moving. It does not take into account if army is finished move by time
To proper query entire movementPath use #getMovementPath_




### lastDemilitarizationTime

```solidity
uint256 lastDemilitarizationTime
```

Time at which last demilitarization occured

_Updated when #demilitarize is called_




### onlyOwnerOrWorldAssetFromSameEpoch

```solidity
modifier onlyOwnerOrWorldAssetFromSameEpoch()
```



_Allows caller to be only ruler or any world asset_




### init

```solidity
function init(address settlementAddress) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### getMovementPath

```solidity
function getMovementPath() public view returns (uint32[])
```

Path army is taken during movement

_Useful to get entire movement path rather than querying each path item by index. It does not take into account if army is finished move by time_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint32[] |  |


### updateState

```solidity
function updateState() public
```

Updates army state to the current block

_Called on every action which are based on army state and time_




### canUpdatePosition

```solidity
function canUpdatePosition() internal view returns (bool)
```



_Checks if army can update position at the moment_




### updatePosition

```solidity
function updatePosition() public
```

Updates army position if movement is finished

_Called on every action which are based on army state and time_




### checkLiquidation

```solidity
function checkLiquidation() public
```

Checks army for liquidation, and if it can be liquidated - liquidates it

_Anyone can call that function_




### getOwner

```solidity
function getOwner() public view returns (address)
```

Return owner of the army

_Same as owner of the settlement to which this army belongs_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### burnUnits

```solidity
function burnUnits(string[] unitNames, uint256[] unitsCount) public
```

Burns units from the army

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitNames | string[] | Names of the unit types for burning |
| unitsCount | uint256[] | Amount of units for burning for every unit type |



### speedUpArmyBySpendingFood

```solidity
function speedUpArmyBySpendingFood(uint256 defaultPathTime, uint256 pathLength, uint256 foodToSpendOnFeeding) internal returns (uint256)
```



_Updates farm's treasury, burns food specified for feeding and returns new path time_




### move

```solidity
function move(uint32[] path, uint256 foodToSpendOnFeeding) public
```

Initiates army movement to the settlement

_Even though path can be provided artificial only allowed movement to a settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| path | uint32[] | Path army will take to the settlement |
| foodToSpendOnFeeding | uint256 | Amount of food army will take from current position settlements FARM in order to decrease total time army will take to get to destination position |



### updateFortOnPositionAndGetHealth

```solidity
function updateFortOnPositionAndGetHealth(uint32 position) internal returns (uint256)
```



_Updates fort on current position and returns its health_




### calculateDefaultPathTime

```solidity
function calculateDefaultPathTime(uint32[] path) internal returns (uint256)
```



_Calculates default path time_




### demilitarize

```solidity
function demilitarize(string[] unitNames, uint256[] unitsCount) public
```

Demilitarizes part of the army. Demilitarization provides prosperity to the settlement army is currently staying on

_Even though demilitarization of 0 units may seem reasonable, it is disabled_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitNames | string[] | Names of the unit types for demilitarization |
| unitsCount | uint256[] | Amount of units for demilitarization for every unit type |



### getDecreasedPathTime

```solidity
function getDecreasedPathTime(uint256 pathLength, uint256 defaultPathTime, uint256 foodToSpendOnFeeding, uint256 foodAmountToMaximumSpeed) internal returns (uint256)
```



_Calculates decreased path time by feeding parameters_




### getFoodMovementStats

```solidity
function getFoodMovementStats(uint256 pathLength) internal returns (uint256)
```



_Calculates amount of needed food for maximum speed increase and amount of max allowed food to spend on feeding_




### getUnitsBalance

```solidity
function getUnitsBalance() internal view returns (uint256[] unitsBalances, uint256 totalUnits)
```



_Calculates current army units balance_




### getCurrentPosition

```solidity
function getCurrentPosition() public view returns (uint32)
```

Calculates current position taking to the account #movementTimings

_This method should be used to determine real army position_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint32 |  |


### setInBattle

```solidity
function setInBattle(address _battleAddress) public
```

Sets army is battle

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _battleAddress | address |  |



### newBattle

```solidity
function newBattle(address _targetArmyAddress) public
```

Initiates battle with another army is both are not in battle

_Creates IBattle and sets both armies in created battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _targetArmyAddress | address |  |



### joinBattle

```solidity
function joinBattle(address _battleAddress, bool _isSideA) public
```

Joins current army in battle to the provided side

_Moving army is able to join battle only if caller is another army (drags it into battle)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _battleAddress | address |  |
| _isSideA | bool |  |



### setUnitsInSiege

```solidity
function setUnitsInSiege(string[] _addUnitsNames, uint256[] _addUnitsCount, string[] _removeUnitsNames, uint256[] _removeUnitsCount) public
```

Sets and withdraw units to/from siege

_Provides ability to atomically setup/re-setup siege_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _addUnitsNames | string[] |  |
| _addUnitsCount | uint256[] |  |
| _removeUnitsNames | string[] |  |
| _removeUnitsCount | uint256[] |  |



### startSiege

```solidity
function startSiege(string[] _unitNames, uint256[] _unitsCount) internal
```



_Sets specified units in siege_




### withdrawUnitsFromSiege

```solidity
function withdrawUnitsFromSiege(string[] _unitNames, uint256[] _unitsCount) internal
```



_Withdraws units from siege_




### setSiegeAddress

```solidity
function setSiegeAddress(address _siegeAddress) public
```

Sets army in siege

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _siegeAddress | address |  |



### claimResources

```solidity
function claimResources(address buildingAddress, uint256 _points) public
```

Swaps accumulated robbery tokens in siege for resource

_Amount of points will be taken may be lesser if building does not have resources in its treasury_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of the building treasury of which will be robbed |
| _points | uint256 |  |



### getTotalSiegeSupport

```solidity
function getTotalSiegeSupport() public view returns (uint256 totalSiegeSupport)
```

Calculates total siege support of the army

_For every unit type placed in siege calculates sum of all of them_


| Name | Type | Description |
| ---- | ---- | ----------- |
| totalSiegeSupport | uint256 | Total siege support of the army |


### isHomePosition

```solidity
function isHomePosition() public view returns (bool)
```

Calculates is army on its home position

_Takes into account if army movement is finished_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


