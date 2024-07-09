## ArmyView


Contains helper functions to query army in simple read requests





### ArmyCombinedData








```solidity
struct ArmyCombinedData {
  address id;
  address owner;
  address ownerSettlementId;
  uint32 currentPosition;
  address currentPositionSettlementId;
  address battleId;
  uint256[] units;
  uint256[] besiegingUnits;
  uint256[] onLiquidateArmyUnits;
  uint256 robberyTokensCount;
  uint32[] currentPath;
  uint64 pathStartTime;
  uint64 pathFinishTime;
  address destinationPositionSettlementId;
  uint256 lastDemilitarizationTime;
}
```

### getArmyCombinedData

```solidity
function getArmyCombinedData(address armyAddress, uint256 timestamp) public view returns (struct ArmyView.ArmyCombinedData armyCombinedData)
```

Calculates combined army data

_Provided timestamp takes into account only robberyTokensCount_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| timestamp | uint256 | Timestamp at which robberyTokensCount will be calculated |

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyCombinedData | struct ArmyView.ArmyCombinedData | Army combined data |


## ArmyView


Contains helper functions to query army in simple read requests





### ArmyCombinedData








```solidity
struct ArmyCombinedData {
  address id;
  address owner;
  address ownerSettlementId;
  uint32 currentPosition;
  address currentPositionSettlementId;
  address battleId;
  uint256[] units;
  uint256[] besiegingUnits;
  uint256[] onLiquidateArmyUnits;
  uint256 robberyTokensCount;
  uint32[] currentPath;
  uint64 pathStartTime;
  uint64 pathFinishTime;
  address destinationPositionSettlementId;
  uint256 lastDemilitarizationTime;
}
```

### getArmyCombinedData

```solidity
function getArmyCombinedData(address armyAddress, uint256 timestamp) public view returns (struct ArmyView.ArmyCombinedData armyCombinedData)
```

Calculates combined army data

_Provided timestamp takes into account only robberyTokensCount_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| timestamp | uint256 | Timestamp at which robberyTokensCount will be calculated |

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyCombinedData | struct ArmyView.ArmyCombinedData | Army combined data |


