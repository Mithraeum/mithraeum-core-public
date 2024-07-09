## Siege








### relatedSettlement

```solidity
contract ISettlement relatedSettlement
```

Settlement address to which this siege belongs

_Immutable, initialized on the siege creation_




### armyInfo

```solidity
mapping(address => struct ISiege.ArmyInfo) armyInfo
```

Mapping containing army information related to current siege

_Updated when #modifyArmySiege, #swapRobberyPointsForResourceFromBuildingTreasury is called_




### besiegingArmyUnitsByType

```solidity
mapping(address => mapping(bytes32 => uint256)) besiegingArmyUnitsByType
```

Mapping containing amount of stored units in siege for specified army

_Updated when #modifyArmySiege is called_




### robberyPointsPerOneDamage

```solidity
uint256 robberyPointsPerOneDamage
```

Amount of robbery point per one damage

_Updated when siege parameters related to armies were changed_




### totalSiegePower

```solidity
uint256 totalSiegePower
```

Total siege power

_Updated when #modifyArmySiege is called_




### init

```solidity
function init(bytes initParams) public
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### canLiquidateArmyBesiegingUnits

```solidity
function canLiquidateArmyBesiegingUnits(address armyAddress) public view returns (bool)
```

Calculates if besieging units of provided army can be liquidated from current siege

_Does not take into an account if army's battle is ended and army isn't left the battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### liquidate

```solidity
function liquidate(address armyAddress) public
```

Liquidates army

_Can be called by anyone, caller will receive a reward_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army to liquidate |



### modifyArmySiege

```solidity
function modifyArmySiege(address armyAddress, bytes32[] unitTypeIds, bool[] toAddIndication, uint256[] unitsAmounts, uint256 newRobberyMultiplier) public
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



### calculateArmyUnitsSiegePower

```solidity
function calculateArmyUnitsSiegePower(address armyAddress) public view returns (uint256)
```

Calculates army units siege power

_Value are calculated for specified army that is present in siege_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### calculateArmyTotalSiegePower

```solidity
function calculateArmyTotalSiegePower(address armyAddress) public view returns (uint256)
```

Calculates army total siege power (including its current robbery multiplier)

_Value are calculated for specified army that is present in siege_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### applyDamage

```solidity
function applyDamage(uint256 damage) public
```

Updates siege with new amount of damage fort has taken

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| damage | uint256 | Damage which has been done to the settlement |



### getArmyRobberyPoints

```solidity
function getArmyRobberyPoints(address armyAddress, uint256 timestamp) public view returns (uint256)
```

Calculates amount of robbery points army will have at specified time

_If timestamp=0, returns value as if timestamp=block.timestamp_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |
| timestamp | uint256 | Time at which calculate points |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### swapRobberyPointsForResourceFromBuildingTreasury

```solidity
function swapRobberyPointsForResourceFromBuildingTreasury(address buildingAddress, uint256 maxPointsToSpend) public
```

Swaps army robbery points for resources from building in related settlement

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of building to rob |
| maxPointsToSpend | uint256 |  |



### getArmyBesiegingUnitsAmounts

```solidity
function getArmyBesiegingUnitsAmounts(address armyAddress) public view returns (uint256[])
```

Returns amount of besieging units for specified army in siege

_Function returns only amounts without types, index in returned array for each unit type is same as in 'registry.getUnits'_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256[] |  |


### _updateArmySiegeProgress

```solidity
function _updateArmySiegeProgress(address armyAddress) internal
```



_Updates army siege progress_




### _calculateAdditionalRobberyPointsPerOneDamage

```solidity
function _calculateAdditionalRobberyPointsPerOneDamage(uint256 damage, uint256 siegePower) internal view returns (uint256)
```



_Calculates additional robbery points per one damage by damage and total siege power_




### _calculateArmyTotalSiegePower

```solidity
function _calculateArmyTotalSiegePower(uint256 armyUnitsSiegePower, uint256 robberyMultiplier) internal pure returns (uint256)
```



_Calculates army total siege power by armySiegePower from units and robberyMultiplier_




