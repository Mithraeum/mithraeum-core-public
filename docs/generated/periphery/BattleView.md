## BattleView


Contains helper functions to query battle in simple read requests





### BattleCombinedData








```solidity
struct BattleCombinedData {
  address id;
  uint64 battleCreationDate;
  uint64 battleLobbyDuration;
  uint64 battleOngoingDuration;
  uint64 battleFinishDate;
  address battleSettlementId;
  uint32 battleGamePosition;
  uint256[] sideACasualties;
  uint256[] sideBCasualties;
  uint256[] sideAUnitsCount;
  uint256[] sideBUnitsCount;
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


### getBattleTiming

```solidity
function getBattleTiming(address battleAddress) public view returns (struct IBattle.Timing timing)
```







### getSideA

```solidity
function getSideA(address battleAddress) public view returns (address[])
```







### getSideB

```solidity
function getSideB(address battleAddress) public view returns (address[])
```







## BattleView


Contains helper functions to query battle in simple read requests





### BattleCombinedData








```solidity
struct BattleCombinedData {
  address id;
  uint64 battleCreationDate;
  uint64 battleLobbyDuration;
  uint64 battleOngoingDuration;
  uint64 battleFinishDate;
  address battleSettlementId;
  uint32 battleGamePosition;
  uint256[] sideACasualties;
  uint256[] sideBCasualties;
  uint256[] sideAUnitsCount;
  uint256[] sideBUnitsCount;
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


### getBattleTiming

```solidity
function getBattleTiming(address battleAddress) public view returns (struct IBattle.Timing timing)
```







### getSideA

```solidity
function getSideA(address battleAddress) public view returns (address[])
```







### getSideB

```solidity
function getSideB(address battleAddress) public view returns (address[])
```







