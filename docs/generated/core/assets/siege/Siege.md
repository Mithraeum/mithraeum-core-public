## Siege








### currentSettlement

```solidity
contract ISettlement currentSettlement
```

Settlement address to which this siege belongs

_Immutable, initialized on the siege creation_




### armyInfo

```solidity
mapping(address => struct ISiege.ArmyInfo) armyInfo
```

Mapping containing army information related to current siege

_Updated when #addUnits, #withdrawUnits, #claimResource, #liqudate is called_




### storedUnits

```solidity
mapping(address => mapping(string => uint256)) storedUnits
```

Mapping containing amount of stored units in siege for specified army

_Updated when #addUnits, #withdrawUnits, #liqudate is called_




### armyLiquidationStartTime

```solidity
mapping(address => uint256) armyLiquidationStartTime
```

Mapping containing time at which army began to be able to be liquidated

_Updated when amount of units in army or siege decreased_




### lastUpdate

```solidity
uint256 lastUpdate
```

Last time at which siege was updated

_Updated when siege parameters related to pointsPerShare were changed_




### pointsPerShare

```solidity
uint256 pointsPerShare
```

Amount of point per share

_Updated when siege parameters related to armies were changed_




### init

```solidity
function init(address settlementAddress) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### getTotalDamageLastPeriod

```solidity
function getTotalDamageLastPeriod() public view returns (uint256)
```

Calculates total damage for period from lastUpdate and block.timestamp



| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getTotalDamageByPeriod

```solidity
function getTotalDamageByPeriod(uint256 _period) public view returns (uint256)
```

Calculates total damage for provided period of time


| Name | Type | Description |
| ---- | ---- | ----------- |
| _period | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### _returnUnitsToArmy

```solidity
function _returnUnitsToArmy(address _to, string _unitName, uint256 _amount) internal
```



_Returns stored units to the army_




### checkLiquidation

```solidity
function checkLiquidation() public
```

Checks and marks msg.sender for liquidation, if it is liquidatable

_Even though function is opened, msg.sender will be taken as army address that will be checked for liquidation, and will be marked as liquidatable_




### _checkLiquidation

```solidity
function _checkLiquidation(address _armyAddress) internal
```



_Checks for liquidation and stores time at which specified army began to be liquidatable_




### canLiquidate

```solidity
function canLiquidate(address _armyAddress) public view returns (bool)
```

Calculates if provided army address can be liquidated from current siege

_Does not take into an account if army's battle is finished and army isn't left the battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### getLiquidationUnits

```solidity
function getLiquidationUnits(address _armyAddress) public view returns (uint256[] res)
```

Calculates amount of units that will be liquidated for specified army address

_Function returns only amounts without types, index in returned array for each unit type is same as in 'registry.getUnits'_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| res | uint256[] |  |


### liquidate

```solidity
function liquidate(address _armyAddress) public
```

Liquidates army

_Can be called by anyone, caller will receive a reward_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |



### addUnits

```solidity
function addUnits(string[] _unitsNames, uint256[] _unitsCount) public
```

Adds units to siege

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _unitsNames | string[] |  |
| _unitsCount | uint256[] |  |



### withdrawUnits

```solidity
function withdrawUnits(string[] _unitsNames, uint256[] _unitsCount) public
```

Withdraws units from siege

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _unitsNames | string[] |  |
| _unitsCount | uint256[] |  |



### calculateTotalSiegeStats

```solidity
function calculateTotalSiegeStats() public view returns (uint256 _power, uint256 _supply)
```

Calculates total siege stats

_Values are calculated for all armies that are present in siege_


| Name | Type | Description |
| ---- | ---- | ----------- |
| _power | uint256 |  |
| _supply | uint256 |  |


### calculateArmySiegeStats

```solidity
function calculateArmySiegeStats(address _armyAddress) public view returns (uint256 _power, uint256 _supply)
```

Calculates army siege stats

_Values are calculated for specified army that is present in siege_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| _power | uint256 |  |
| _supply | uint256 |  |


### calculateSiegeStats

```solidity
function calculateSiegeStats(uint256[] _unitsCount) internal view returns (uint256 power_, uint256 supply_)
```



_Calculates siege stats for specified unitsCount_




### update

```solidity
function update() public
```

Updates current siege to the current state

_Synchronizes health up to current state, produces points for besieging armies_




### systemUpdate

```solidity
function systemUpdate(uint256 _totalDamage) public
```

Updates siege with new amount of damage fort taken

_Even though function is opened, it can be called only by world asset_




### getUserPoints

```solidity
function getUserPoints(address _armyAddress) public view returns (uint256)
```

Calculates amount of points army has

_Uses block.timestamp at #getUserPointsOnTime_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getUserPointsOnTime

```solidity
function getUserPointsOnTime(address _armyAddress, uint256 timestamp) public view returns (uint256)
```

Calculates amount of points army will have at specified time

_If timestamp=0, returns value as if timestamp=block.timestamp_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |
| timestamp | uint256 | Time at which calculate points |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### claimResources

```solidity
function claimResources(address buildingAddress, uint256 _points) public
```

Claims resources for specified points from building related to siege

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of building to rob |
| _points | uint256 |  |



### getStoredUnits

```solidity
function getStoredUnits(address _armyAddress) public view returns (uint256[] res)
```

Returns amount of stored units for specified army in siege

_Function returns only amounts without types, index in returned array for each unit type is same as in 'registry.getUnits'_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| res | uint256[] |  |


## Siege








### currentSettlement

```solidity
contract ISettlement currentSettlement
```

Settlement address to which this siege belongs

_Immutable, initialized on the siege creation_




### armyInfo

```solidity
mapping(address => struct ISiege.ArmyInfo) armyInfo
```

Mapping containing army information related to current siege

_Updated when #addUnits, #withdrawUnits, #claimResource, #liqudate is called_




### storedUnits

```solidity
mapping(address => mapping(string => uint256)) storedUnits
```

Mapping containing amount of stored units in siege for specified army

_Updated when #addUnits, #withdrawUnits, #liqudate is called_




### armyLiquidationStartTime

```solidity
mapping(address => uint256) armyLiquidationStartTime
```

Mapping containing time at which army began to be able to be liquidated

_Updated when amount of units in army or siege decreased_




### lastUpdate

```solidity
uint256 lastUpdate
```

Last time at which siege was updated

_Updated when siege parameters related to pointsPerShare were changed_




### pointsPerShare

```solidity
uint256 pointsPerShare
```

Amount of point per share

_Updated when siege parameters related to armies were changed_




### init

```solidity
function init(address settlementAddress) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### getTotalDamageLastPeriod

```solidity
function getTotalDamageLastPeriod() public view returns (uint256)
```

Calculates total damage for period from lastUpdate and block.timestamp



| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getTotalDamageByPeriod

```solidity
function getTotalDamageByPeriod(uint256 _period) public view returns (uint256)
```

Calculates total damage for provided period of time


| Name | Type | Description |
| ---- | ---- | ----------- |
| _period | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### _returnUnitsToArmy

```solidity
function _returnUnitsToArmy(address _to, string _unitName, uint256 _amount) internal
```



_Returns stored units to the army_




### checkLiquidation

```solidity
function checkLiquidation() public
```

Checks and marks msg.sender for liquidation, if it is liquidatable

_Even though function is opened, msg.sender will be taken as army address that will be checked for liquidation, and will be marked as liquidatable_




### _checkLiquidation

```solidity
function _checkLiquidation(address _armyAddress) internal
```



_Checks for liquidation and stores time at which specified army began to be liquidatable_




### canLiquidate

```solidity
function canLiquidate(address _armyAddress) public view returns (bool)
```

Calculates if provided army address can be liquidated from current siege

_Does not take into an account if army's battle is finished and army isn't left the battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### getLiquidationUnits

```solidity
function getLiquidationUnits(address _armyAddress) public view returns (uint256[] res)
```

Calculates amount of units that will be liquidated for specified army address

_Function returns only amounts without types, index in returned array for each unit type is same as in 'registry.getUnits'_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| res | uint256[] |  |


### liquidate

```solidity
function liquidate(address _armyAddress) public
```

Liquidates army

_Can be called by anyone, caller will receive a reward_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |



### addUnits

```solidity
function addUnits(string[] _unitsNames, uint256[] _unitsCount) public
```

Adds units to siege

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _unitsNames | string[] |  |
| _unitsCount | uint256[] |  |



### withdrawUnits

```solidity
function withdrawUnits(string[] _unitsNames, uint256[] _unitsCount) public
```

Withdraws units from siege

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _unitsNames | string[] |  |
| _unitsCount | uint256[] |  |



### calculateTotalSiegeStats

```solidity
function calculateTotalSiegeStats() public view returns (uint256 _power, uint256 _supply)
```

Calculates total siege stats

_Values are calculated for all armies that are present in siege_


| Name | Type | Description |
| ---- | ---- | ----------- |
| _power | uint256 |  |
| _supply | uint256 |  |


### calculateArmySiegeStats

```solidity
function calculateArmySiegeStats(address _armyAddress) public view returns (uint256 _power, uint256 _supply)
```

Calculates army siege stats

_Values are calculated for specified army that is present in siege_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| _power | uint256 |  |
| _supply | uint256 |  |


### calculateSiegeStats

```solidity
function calculateSiegeStats(uint256[] _unitsCount) internal view returns (uint256 power_, uint256 supply_)
```



_Calculates siege stats for specified unitsCount_




### update

```solidity
function update() public
```

Updates current siege to the current state

_Synchronizes health up to current state, produces points for besieging armies_




### systemUpdate

```solidity
function systemUpdate(uint256 _totalDamage) public
```

Updates siege with new amount of damage fort taken

_Even though function is opened, it can be called only by world asset_




### getUserPoints

```solidity
function getUserPoints(address _armyAddress) public view returns (uint256)
```

Calculates amount of points army has

_Uses block.timestamp at #getUserPointsOnTime_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getUserPointsOnTime

```solidity
function getUserPointsOnTime(address _armyAddress, uint256 timestamp) public view returns (uint256)
```

Calculates amount of points army will have at specified time

_If timestamp=0, returns value as if timestamp=block.timestamp_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |
| timestamp | uint256 | Time at which calculate points |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### claimResources

```solidity
function claimResources(address buildingAddress, uint256 _points) public
```

Claims resources for specified points from building related to siege

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of building to rob |
| _points | uint256 |  |



### getStoredUnits

```solidity
function getStoredUnits(address _armyAddress) public view returns (uint256[] res)
```

Returns amount of stored units for specified army in siege

_Function returns only amounts without types, index in returned array for each unit type is same as in 'registry.getUnits'_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _armyAddress | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| res | uint256[] |  |


