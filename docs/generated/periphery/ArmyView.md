## ArmyView


Contains helper functions to query army in simple read requests





### ArmyCombinedData








```solidity
struct ArmyCombinedData {
  address id;
  address owner;
  address ownerSettlementId;
  uint64 currentPosition;
  address currentPositionSettlementId;
  uint64 destinationPosition;
  address destinationPositionSettlementId;
  uint64 secretDestinationRegionId;
  bytes32 secretDestinationPosition;
  uint64 maneuverBeginTime;
  uint64 maneuverEndTime;
  address battleId;
  uint256[] units;
  uint256[] besiegingUnits;
  uint256 robberyPoints;
  uint64 stunBeginTime;
  uint64 stunEndTime;
}
```

### getArmyCombinedData

```solidity
function getArmyCombinedData(address armyAddress, uint256 timestamp) public view returns (struct ArmyView.ArmyCombinedData armyCombinedData)
```

Calculates combined army data

_Provided timestamp takes into account robberyPoints, maneuver, battle, stun_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| timestamp | uint256 | Timestamp at which army data will be calculated |

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyCombinedData | struct ArmyView.ArmyCombinedData | Army combined data |


### _getArmyOwner

```solidity
function _getArmyOwner(contract IArmy army) internal view returns (address)
```



_Calculates army owner_




### _isCultistsArmy

```solidity
function _isCultistsArmy(contract IArmy army) internal view returns (bool)
```



_Calculates if army owner is cultists settlement or not_




### _canEndBattleAtProvidedTimestamp

```solidity
function _canEndBattleAtProvidedTimestamp(contract IBattle battle, uint256 timestamp) internal view returns (bool)
```



_Calculates if battle can be ended at provided timestamp_




