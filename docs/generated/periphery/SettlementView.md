## SettlementView


Contains helper read/write requests for interacting with settlement





### distributeAllBuildingsUnharvestedResources

```solidity
function distributeAllBuildingsUnharvestedResources(address settlementAddress) public
```

Distributes all unharvested resources of all settlement buildings to its shareholders

_Caller may pay high amount of gas if there will be a lot of shareholders. Use with caution_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### accumulatedCurrentProsperity

```solidity
function accumulatedCurrentProsperity(address settlementAddress, uint256 timestamp) public view returns (int256)
```

Calculates current prosperity at specified timestamp

_Uses buildings productions to forecast amount of prosperity will settlement will have at specified time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| timestamp | uint256 | Time at which calculate current prosperity |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 | Amount of prosperity at specified time |


### _calculateProsperityByBuilding

```solidity
function _calculateProsperityByBuilding(contract IRegistry registry, contract IBuilding building, uint256 timestamp) internal view returns (uint256)
```



_Calculates prosperity building provides at given timestamp_




