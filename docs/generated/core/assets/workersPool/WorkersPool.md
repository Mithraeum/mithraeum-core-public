## WorkersPool








### relatedRegion

```solidity
contract IRegion relatedRegion
```

Region to which this pool belongs

_Immutable, initialized on the region creation_




### lastPurchaseTime

```solidity
uint256 lastPurchaseTime
```

Time at which last purchase is performed

_Updated every time when #swapProsperityForExactWorkers is called_




### workerPrice

```solidity
uint256 workerPrice
```

Worker price

_Updated every time when #swapProsperityForExactWorkers is called_




### init

```solidity
function init(bytes initParams) public
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### calculateProsperityForExactWorkers

```solidity
function calculateProsperityForExactWorkers(uint256 unitsToBuy) public view returns (uint256, uint256)
```

Calculates input of prosperity based on output whole amount of workers

_Returns valid output only for integer workersToBuy value (in 1e0 precision)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsToBuy | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


### swapProsperityForExactWorkers

```solidity
function swapProsperityForExactWorkers(address settlementAddress, uint256 workersToBuy, uint256 maxProsperityToSell) public returns (uint256)
```

Swaps prosperity for exact workers

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| workersToBuy | uint256 | Exact amount of workers |
| maxProsperityToSell | uint256 | Maximum amount of prosperity to be taken for exact amount of workers |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### _getDroppedWorkerPrice

```solidity
function _getDroppedWorkerPrice() internal view returns (int128)
```



_Calculates dropped worker price after last purchase time_




### _calculatePriceShiftForUnits

```solidity
function _calculatePriceShiftForUnits(uint256 amountOfWorkers, int128 priceShiftPerWorker64) internal view returns (uint256, uint256)
```



_Calculates amount of prosperity and new worker price according to amount of workers and price shift per worker interaction with the pool_




