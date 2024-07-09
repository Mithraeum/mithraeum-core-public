## ISiege


Functions to read state/modify state in order to get current siege parameters and/or interact with it





### ArmyInfo








```solidity
struct ArmyInfo {
  uint256 rewardDebt;
  uint256 points;
}
```

### UnitsAdded

```solidity
event UnitsAdded(address from, address settlement, string[] unitsNames, uint256[] unitsCount)
```

Emitted when #addUnits is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | Army address which adds units |
| settlement | address | Settlement address of related siege |
| unitsNames | string[] | Unit types which were added |
| unitsCount | uint256[] | Counts of units which were added |



### UnitsWithdrawn

```solidity
event UnitsWithdrawn(address to, address settlement, string[] unitsNames, uint256[] unitsCount)
```

Emitted when #withdrawUnits is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Army address which receives back its units |
| settlement | address | Settlement address of related siege |
| unitsNames | string[] | Unit types which were withdrawn |
| unitsCount | uint256[] | Counts of units which were withdrawn |



### PointsReceived

```solidity
event PointsReceived(address armyAddress, uint256 pointsReceived)
```

Emitted when #addUnits or #withdrawUnits is called in order to preserve previous amount of points were farmed by the army with previous speed


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address which received siege points |
| pointsReceived | uint256 | Amount of points received |



### PointsSpent

```solidity
event PointsSpent(address armyAddress, uint256 pointsSpent)
```

Emitted when #claimResources is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address which spent siege points |
| pointsSpent | uint256 | Amount of points spent |



### Liquidated

```solidity
event Liquidated(address armyAddress, string unitName, uint256 unitsLiquidated, uint256 unitsWithdrawn)
```

Emitted when #liquidate is called, emitted for every unit type that was liquidated


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address which was liquidated |
| unitName | string | Unit type |
| unitsLiquidated | uint256 | Amount of units liquidated |
| unitsWithdrawn | uint256 | Amount of units returned to the army |



### currentSettlement

```solidity
function currentSettlement() external view returns (contract ISettlement)
```

Settlement address to which this siege belongs

_Immutable, initialized on the siege creation_




### armyInfo

```solidity
function armyInfo(address armyAddress) external view returns (uint256 rewardDebt, uint256 points)
```

Mapping containing army information related to current siege

_Updated when #addUnits, #withdrawUnits, #claimResource, #liqudate is called_




### storedUnits

```solidity
function storedUnits(address armyAddress, string unitName) external view returns (uint256)
```

Mapping containing amount of stored units in siege for specified army

_Updated when #addUnits, #withdrawUnits, #liqudate is called_




### armyLiquidationStartTime

```solidity
function armyLiquidationStartTime(address armyAddress) external view returns (uint256)
```

Mapping containing time at which army began to be able to be liquidated

_Updated when amount of units in army or siege decreased_




### lastUpdate

```solidity
function lastUpdate() external view returns (uint256)
```

Last time at which siege was updated

_Updated when siege parameters related to pointsPerShare were changed_




### pointsPerShare

```solidity
function pointsPerShare() external view returns (uint256)
```

Amount of point per share

_Updated when siege parameters related to armies were changed_




### init

```solidity
function init(address settlementAddress) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### update

```solidity
function update() external
```

Updates current siege to the current state

_Synchronizes health up to current state, produces points for besieging armies_




### claimResources

```solidity
function claimResources(address buildingAddress, uint256 points) external
```

Claims resources for specified points from building related to siege

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of building to rob |
| points | uint256 | Amount of points to spend for robbing |



### getTotalDamageByPeriod

```solidity
function getTotalDamageByPeriod(uint256 period) external view returns (uint256 damage)
```

Calculates total damage for provided period of time


| Name | Type | Description |
| ---- | ---- | ----------- |
| period | uint256 | Time period to use to calculate damage |

| Name | Type | Description |
| ---- | ---- | ----------- |
| damage | uint256 | Total damage for provided period of time |


### getTotalDamageLastPeriod

```solidity
function getTotalDamageLastPeriod() external view returns (uint256 damage)
```

Calculates total damage for period from lastUpdate and block.timestamp



| Name | Type | Description |
| ---- | ---- | ----------- |
| damage | uint256 | Total damage for last period |


### systemUpdate

```solidity
function systemUpdate(uint256 totalDamage) external
```

Updates siege with new amount of damage fort taken

_Even though function is opened, it can be called only by world asset_




### addUnits

```solidity
function addUnits(string[] unitsNames, uint256[] unitsCount) external
```

Adds units to siege

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsNames | string[] | Unit types which will be added to siege |
| unitsCount | uint256[] | Amounts of units will be added to siege |



### withdrawUnits

```solidity
function withdrawUnits(string[] unitsNames, uint256[] unitsCount) external
```

Withdraws units from siege

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsNames | string[] | Unit types which will be withdrawn to siege |
| unitsCount | uint256[] | Amounts of units will be withdrawn to siege |



### canLiquidate

```solidity
function canLiquidate(address armyAddress) external view returns (bool canLiquidate)
```

Calculates if provided army address can be liquidated from current siege

_Does not take into an account if army's battle is finished and army isn't left the battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| canLiquidate | bool | Can army be liquidated from current siege |


### checkLiquidation

```solidity
function checkLiquidation() external
```

Checks and marks msg.sender for liquidation, if it is liquidatable

_Even though function is opened, msg.sender will be taken as army address that will be checked for liquidation, and will be marked as liquidatable_




### getLiquidationUnits

```solidity
function getLiquidationUnits(address armyAddress) external view returns (uint256[] units)
```

Calculates amount of units that will be liquidated for specified army address

_Function returns only amounts without types, index in returned array for each unit type is same as in 'registry.getUnits'_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| units | uint256[] | Amount of units that will be liquidated |


### getUserPointsOnTime

```solidity
function getUserPointsOnTime(address armyAddress, uint256 timestamp) external view returns (uint256 points)
```

Calculates amount of points army will have at specified time

_If timestamp=0, returns value as if timestamp=block.timestamp_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |
| timestamp | uint256 | Time at which calculate points |

| Name | Type | Description |
| ---- | ---- | ----------- |
| points | uint256 | Amount of points army will have at specified time |


### getStoredUnits

```solidity
function getStoredUnits(address armyAddress) external view returns (uint256[] units)
```

Returns amount of stored units for specified army in siege

_Function returns only amounts without types, index in returned array for each unit type is same as in 'registry.getUnits'_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| units | uint256[] | Amount of units that army has in siege |


### calculateTotalSiegeStats

```solidity
function calculateTotalSiegeStats() external view returns (uint256 power, uint256 supply)
```

Calculates total siege stats

_Values are calculated for all armies that are present in siege_


| Name | Type | Description |
| ---- | ---- | ----------- |
| power | uint256 | Total power that placed into siege |
| supply | uint256 | Total supply that siege has |


### liquidate

```solidity
function liquidate(address armyAddress) external
```

Liquidates army

_Can be called by anyone, caller will receive a reward_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army to liquidate |



### getUserPoints

```solidity
function getUserPoints(address armyAddress) external returns (uint256 points)
```

Calculates amount of points army has

_Uses block.timestamp at #getUserPointsOnTime_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| points | uint256 | Amount of points army has |


### calculateArmySiegeStats

```solidity
function calculateArmySiegeStats(address armyAddress) external returns (uint256 power, uint256 supply)
```

Calculates army siege stats

_Values are calculated for specified army that is present in siege_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| power | uint256 | Total power that army has |
| supply | uint256 | Total supply that army has |


## ISiege


Functions to read state/modify state in order to get current siege parameters and/or interact with it





### ArmyInfo








```solidity
struct ArmyInfo {
  uint256 rewardDebt;
  uint256 points;
}
```

### UnitsAdded

```solidity
event UnitsAdded(address from, address settlement, string[] unitsNames, uint256[] unitsCount)
```

Emitted when #addUnits is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | Army address which adds units |
| settlement | address | Settlement address of related siege |
| unitsNames | string[] | Unit types which were added |
| unitsCount | uint256[] | Counts of units which were added |



### UnitsWithdrawn

```solidity
event UnitsWithdrawn(address to, address settlement, string[] unitsNames, uint256[] unitsCount)
```

Emitted when #withdrawUnits is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Army address which receives back its units |
| settlement | address | Settlement address of related siege |
| unitsNames | string[] | Unit types which were withdrawn |
| unitsCount | uint256[] | Counts of units which were withdrawn |



### PointsReceived

```solidity
event PointsReceived(address armyAddress, uint256 pointsReceived)
```

Emitted when #addUnits or #withdrawUnits is called in order to preserve previous amount of points were farmed by the army with previous speed


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address which received siege points |
| pointsReceived | uint256 | Amount of points received |



### PointsSpent

```solidity
event PointsSpent(address armyAddress, uint256 pointsSpent)
```

Emitted when #claimResources is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address which spent siege points |
| pointsSpent | uint256 | Amount of points spent |



### Liquidated

```solidity
event Liquidated(address armyAddress, string unitName, uint256 unitsLiquidated, uint256 unitsWithdrawn)
```

Emitted when #liquidate is called, emitted for every unit type that was liquidated


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address which was liquidated |
| unitName | string | Unit type |
| unitsLiquidated | uint256 | Amount of units liquidated |
| unitsWithdrawn | uint256 | Amount of units returned to the army |



### currentSettlement

```solidity
function currentSettlement() external view returns (contract ISettlement)
```

Settlement address to which this siege belongs

_Immutable, initialized on the siege creation_




### armyInfo

```solidity
function armyInfo(address armyAddress) external view returns (uint256 rewardDebt, uint256 points)
```

Mapping containing army information related to current siege

_Updated when #addUnits, #withdrawUnits, #claimResource, #liqudate is called_




### storedUnits

```solidity
function storedUnits(address armyAddress, string unitName) external view returns (uint256)
```

Mapping containing amount of stored units in siege for specified army

_Updated when #addUnits, #withdrawUnits, #liqudate is called_




### armyLiquidationStartTime

```solidity
function armyLiquidationStartTime(address armyAddress) external view returns (uint256)
```

Mapping containing time at which army began to be able to be liquidated

_Updated when amount of units in army or siege decreased_




### lastUpdate

```solidity
function lastUpdate() external view returns (uint256)
```

Last time at which siege was updated

_Updated when siege parameters related to pointsPerShare were changed_




### pointsPerShare

```solidity
function pointsPerShare() external view returns (uint256)
```

Amount of point per share

_Updated when siege parameters related to armies were changed_




### init

```solidity
function init(address settlementAddress) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### update

```solidity
function update() external
```

Updates current siege to the current state

_Synchronizes health up to current state, produces points for besieging armies_




### claimResources

```solidity
function claimResources(address buildingAddress, uint256 points) external
```

Claims resources for specified points from building related to siege

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of building to rob |
| points | uint256 | Amount of points to spend for robbing |



### getTotalDamageByPeriod

```solidity
function getTotalDamageByPeriod(uint256 period) external view returns (uint256 damage)
```

Calculates total damage for provided period of time


| Name | Type | Description |
| ---- | ---- | ----------- |
| period | uint256 | Time period to use to calculate damage |

| Name | Type | Description |
| ---- | ---- | ----------- |
| damage | uint256 | Total damage for provided period of time |


### getTotalDamageLastPeriod

```solidity
function getTotalDamageLastPeriod() external view returns (uint256 damage)
```

Calculates total damage for period from lastUpdate and block.timestamp



| Name | Type | Description |
| ---- | ---- | ----------- |
| damage | uint256 | Total damage for last period |


### systemUpdate

```solidity
function systemUpdate(uint256 totalDamage) external
```

Updates siege with new amount of damage fort taken

_Even though function is opened, it can be called only by world asset_




### addUnits

```solidity
function addUnits(string[] unitsNames, uint256[] unitsCount) external
```

Adds units to siege

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsNames | string[] | Unit types which will be added to siege |
| unitsCount | uint256[] | Amounts of units will be added to siege |



### withdrawUnits

```solidity
function withdrawUnits(string[] unitsNames, uint256[] unitsCount) external
```

Withdraws units from siege

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsNames | string[] | Unit types which will be withdrawn to siege |
| unitsCount | uint256[] | Amounts of units will be withdrawn to siege |



### canLiquidate

```solidity
function canLiquidate(address armyAddress) external view returns (bool canLiquidate)
```

Calculates if provided army address can be liquidated from current siege

_Does not take into an account if army's battle is finished and army isn't left the battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| canLiquidate | bool | Can army be liquidated from current siege |


### checkLiquidation

```solidity
function checkLiquidation() external
```

Checks and marks msg.sender for liquidation, if it is liquidatable

_Even though function is opened, msg.sender will be taken as army address that will be checked for liquidation, and will be marked as liquidatable_




### getLiquidationUnits

```solidity
function getLiquidationUnits(address armyAddress) external view returns (uint256[] units)
```

Calculates amount of units that will be liquidated for specified army address

_Function returns only amounts without types, index in returned array for each unit type is same as in 'registry.getUnits'_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| units | uint256[] | Amount of units that will be liquidated |


### getUserPointsOnTime

```solidity
function getUserPointsOnTime(address armyAddress, uint256 timestamp) external view returns (uint256 points)
```

Calculates amount of points army will have at specified time

_If timestamp=0, returns value as if timestamp=block.timestamp_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |
| timestamp | uint256 | Time at which calculate points |

| Name | Type | Description |
| ---- | ---- | ----------- |
| points | uint256 | Amount of points army will have at specified time |


### getStoredUnits

```solidity
function getStoredUnits(address armyAddress) external view returns (uint256[] units)
```

Returns amount of stored units for specified army in siege

_Function returns only amounts without types, index in returned array for each unit type is same as in 'registry.getUnits'_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| units | uint256[] | Amount of units that army has in siege |


### calculateTotalSiegeStats

```solidity
function calculateTotalSiegeStats() external view returns (uint256 power, uint256 supply)
```

Calculates total siege stats

_Values are calculated for all armies that are present in siege_


| Name | Type | Description |
| ---- | ---- | ----------- |
| power | uint256 | Total power that placed into siege |
| supply | uint256 | Total supply that siege has |


### liquidate

```solidity
function liquidate(address armyAddress) external
```

Liquidates army

_Can be called by anyone, caller will receive a reward_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army to liquidate |



### getUserPoints

```solidity
function getUserPoints(address armyAddress) external returns (uint256 points)
```

Calculates amount of points army has

_Uses block.timestamp at #getUserPointsOnTime_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| points | uint256 | Amount of points army has |


### calculateArmySiegeStats

```solidity
function calculateArmySiegeStats(address armyAddress) external returns (uint256 power, uint256 supply)
```

Calculates army siege stats

_Values are calculated for specified army that is present in siege_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| power | uint256 | Total power that army has |
| supply | uint256 | Total supply that army has |


