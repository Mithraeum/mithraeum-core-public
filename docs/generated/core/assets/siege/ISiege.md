## ISiege


Functions to read state/modify state in order to get current siege parameters and/or interact with it





### ArmyInfo








```solidity
struct ArmyInfo {
  uint256 robberyMultiplier;
  uint256 pointsDebt;
  uint256 points;
}
```

### relatedSettlement

```solidity
function relatedSettlement() external view returns (contract ISettlement)
```

Settlement address to which this siege belongs

_Immutable, initialized on the siege creation_




### armyInfo

```solidity
function armyInfo(address armyAddress) external view returns (uint256 robberyMultiplier, uint256 pointsDebt, uint256 points)
```

Mapping containing army information related to current siege

_Updated when #modifyArmySiege, #swapRobberyPointsForResourceFromBuildingTreasury is called_




### besiegingArmyUnitsByType

```solidity
function besiegingArmyUnitsByType(address armyAddress, bytes32 unitTypeId) external view returns (uint256)
```

Mapping containing amount of stored units in siege for specified army

_Updated when #modifyArmySiege is called_




### totalSiegePower

```solidity
function totalSiegePower() external view returns (uint256)
```

Total siege power

_Updated when #modifyArmySiege is called_




### robberyPointsPerOneDamage

```solidity
function robberyPointsPerOneDamage() external view returns (uint256)
```

Amount of robbery point per one damage

_Updated when siege parameters related to armies were changed_




### ArmySiegeModified

```solidity
event ArmySiegeModified(address armyAddress, bytes32[] unitTypeIds, bool[] toAddIndication, uint256[] unitsAmounts, uint256 newRobberyMultiplier, uint256 newTotalSiegePower)
```

Emitted when #modifyArmySiege is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| unitTypeIds | bytes32[] | Unit type ids |
| toAddIndication | bool[] | Indication array whether units where added or withdrawn (added = true, withdrawn = false) |
| unitsAmounts | uint256[] | Units amounts |
| newRobberyMultiplier | uint256 | New robbery multiplier |
| newTotalSiegePower | uint256 | New total siege power |



### BuildingRobbed

```solidity
event BuildingRobbed(address armyAddress, address buildingAddress, uint256 stolenAmount, uint256 burnedAmount, uint256 pointsSpent, uint256 newRobberyPointsAmount)
```

Emitted when army robbery points updated


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| buildingAddress | address | Building address |
| stolenAmount | uint256 | Amount of resources stolen |
| burnedAmount | uint256 | Burned amount of resources |
| pointsSpent | uint256 | Amount of points spent |
| newRobberyPointsAmount | uint256 | New robbery points amount |



### ArmyLiquidated

```solidity
event ArmyLiquidated(address armyAddress)
```

Emitted when #liquidate is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address which was liquidated |



### SiegeCannotLiquidateArmy

```solidity
error SiegeCannotLiquidateArmy()
```

Thrown when attempting to liquidate army from siege when it is not liquidatable





### SiegeCannotBeModifiedDueToInvalidUnitsAmountSpecified

```solidity
error SiegeCannotBeModifiedDueToInvalidUnitsAmountSpecified()
```

Thrown when attempting to modify siege units with invalid units amount specified





### RobberyPointsSwapNotAllowedDueToSpecifiedBuildingAddressIsNotPartOfEra

```solidity
error RobberyPointsSwapNotAllowedDueToSpecifiedBuildingAddressIsNotPartOfEra()
```

Thrown when attempting to swap robbery points with wrong building address specified





### RobberyPointsSwapNotAllowedDueToWrongMaxPointsToSpendSpecified

```solidity
error RobberyPointsSwapNotAllowedDueToWrongMaxPointsToSpendSpecified()
```

Thrown when attempting to swap robbery points with wrong max points to spend specified





### RobberyPointsSwapNotAllowedDueToSpecifiedBuildingAddressDoesNotBelongToSettlementOfThisSiege

```solidity
error RobberyPointsSwapNotAllowedDueToSpecifiedBuildingAddressDoesNotBelongToSettlementOfThisSiege()
```

Thrown when attempting to swap robbery points with specified building address not belonging to the settlement of this siege





### RobberyPointsSwapNotAllowedDueToNothingWasStolenAndBurned

```solidity
error RobberyPointsSwapNotAllowedDueToNothingWasStolenAndBurned()
```

Thrown when attempting to swap robbery points in result of which zero resources was stolen and burned





### swapRobberyPointsForResourceFromBuildingTreasury

```solidity
function swapRobberyPointsForResourceFromBuildingTreasury(address buildingAddress, uint256 pointsToSpend) external
```

Swaps army robbery points for resources from building in related settlement

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of building to rob |
| pointsToSpend | uint256 | Amount of points to spend for robbing |



### applyDamage

```solidity
function applyDamage(uint256 damage) external
```

Updates siege with new amount of damage fort has taken

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| damage | uint256 | Damage which has been done to the settlement |



### modifyArmySiege

```solidity
function modifyArmySiege(address armyAddress, bytes32[] unitTypeIds, bool[] toAddIndication, uint256[] unitsAmounts, uint256 newRobberyMultiplier) external
```

Modifies army robbery multiplier

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| unitTypeIds | bytes32[] | Unit type ids |
| toAddIndication | bool[] | Indication array whether to add units or to withdraw (add = true, withdraw = false) |
| unitsAmounts | uint256[] | Units amounts |
| newRobberyMultiplier | uint256 | New robbery multiplier |



### canLiquidateArmyBesiegingUnits

```solidity
function canLiquidateArmyBesiegingUnits(address armyAddress) external view returns (bool canLiquidate)
```

Calculates if besieging units of provided army can be liquidated from current siege

_Does not take into an account if army's battle is ended and army isn't left the battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| canLiquidate | bool | Can army be liquidated from current siege |


### getArmyRobberyPoints

```solidity
function getArmyRobberyPoints(address armyAddress, uint256 timestamp) external view returns (uint256 robberyPoints)
```

Calculates amount of robbery points army will have at specified time

_If timestamp=0, returns value as if timestamp=block.timestamp_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |
| timestamp | uint256 | Time at which calculate points |

| Name | Type | Description |
| ---- | ---- | ----------- |
| robberyPoints | uint256 | Amount of robbery points army will have at specified time |


### getArmyBesiegingUnitsAmounts

```solidity
function getArmyBesiegingUnitsAmounts(address armyAddress) external view returns (uint256[] unitsAmounts)
```

Returns amount of besieging units for specified army in siege

_Function returns only amounts without types, index in returned array for each unit type is same as in 'registry.getUnits'_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsAmounts | uint256[] | Amount of units that army has in siege |


### liquidate

```solidity
function liquidate(address armyAddress) external
```

Liquidates army

_Can be called by anyone, caller will receive a reward_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army to liquidate |



### calculateArmyUnitsSiegePower

```solidity
function calculateArmyUnitsSiegePower(address armyAddress) external returns (uint256 armySiegePower)
```

Calculates army units siege power

_Value are calculated for specified army that is present in siege_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| armySiegePower | uint256 | Army units siege power |


### calculateArmyTotalSiegePower

```solidity
function calculateArmyTotalSiegePower(address armyAddress) external returns (uint256 armyTotalSiegePower)
```

Calculates army total siege power (including its current robbery multiplier)

_Value are calculated for specified army that is present in siege_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyTotalSiegePower | uint256 | Army total siege power |


