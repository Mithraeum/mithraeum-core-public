## BattleView


Contains helper functions to query battle in simple read requests





### BattleCombinedData








```solidity
struct BattleCombinedData {
  address id;
  uint64 battleBeginTime;
  uint64 battleDuration;
  uint64 battleEndDate;
  address battleSettlementId;
  uint64 battleGamePosition;
  uint256[] side1Casualties;
  uint256[] side2Casualties;
  uint256[] side1UnitsAmount;
  uint256[] side2UnitsAmount;
}
```

### getBattleCombinedData

```solidity
function getBattleCombinedData(address battleAddress) public view returns (struct BattleView.BattleCombinedData battleCombinedData)
```

Calculates combined battle data

_In case of very big battle, this function may not work due to array nature of battle sides_

| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Battle address |

| Name | Type | Description |
| ---- | ---- | ----------- |
| battleCombinedData | struct BattleView.BattleCombinedData | Battle combined data |


### getBattleTimeInfo

```solidity
function getBattleTimeInfo(address battleAddress) public view returns (struct IBattle.BattleTimeInfo battleTimeInfo)
```







