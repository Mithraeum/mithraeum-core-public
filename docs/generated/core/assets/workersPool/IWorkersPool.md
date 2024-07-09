## IWorkersPool


Functions to read state/modify state in order to mint workers/swap prosperity for workers





### relatedRegion

```solidity
function relatedRegion() external view returns (contract IRegion)
```

Region to which this pool belongs

_Immutable, initialized on the region creation_




### lastPurchaseTime

```solidity
function lastPurchaseTime() external view returns (uint256)
```

Time at which last purchase is performed

_Updated every time when #swapProsperityForExactWorkers is called_




### workerPrice

```solidity
function workerPrice() external view returns (uint256)
```

Worker price

_Updated every time when #swapProsperityForExactWorkers is called_




### WorkersBought

```solidity
event WorkersBought(address buyerSettlementAddress, uint256 boughtWorkersAmount, uint256 spentProsperityAmount)
```

Emitted when #swapProsperityForExactWorkers is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| buyerSettlementAddress | address | Address of the settlement which bought workers |
| boughtWorkersAmount | uint256 | Amount of workers bought |
| spentProsperityAmount | uint256 | Amount of prosperity spent |



### CannotHireWorkersInvalidWorkersToBuySpecified

```solidity
error CannotHireWorkersInvalidWorkersToBuySpecified()
```

Thrown when attempting to hire workers with invalid workers to buy specified





### CannotHireWorkersDueToTheirCostIsHigherThanMaxProsperityToSellSpecified

```solidity
error CannotHireWorkersDueToTheirCostIsHigherThanMaxProsperityToSellSpecified()
```

Thrown when attempting to hire worker due to their cost is being higher than max prosperity to sell specified





### CannotHireWorkersDueToNotEnoughProsperityInSettlement

```solidity
error CannotHireWorkersDueToNotEnoughProsperityInSettlement()
```

Thrown when attempting to hire workers due to not having enough prosperity in settlement for the purchase





### CannotHireWorkersExceedingTransactionLimit

```solidity
error CannotHireWorkersExceedingTransactionLimit()
```

Thrown when attempting to hire more workers than transaction limit





### swapProsperityForExactWorkers

```solidity
function swapProsperityForExactWorkers(address settlementAddress, uint256 workersToBuy, uint256 maxProsperityToSell) external returns (uint256 workersCount)
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
| workersCount | uint256 | Amount of workers bought by prosperity |


### calculateProsperityForExactWorkers

```solidity
function calculateProsperityForExactWorkers(uint256 workersToBuy) external returns (uint256 prosperityToSell, uint256 newWorkerPrice)
```

Calculates input of prosperity based on output whole amount of workers

_Returns valid output only for integer workersToBuy value (in 1e0 precision)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersToBuy | uint256 | Amount of workers to buy |

| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityToSell | uint256 | Amount of prosperity needed for workersToBuy |
| newWorkerPrice | uint256 | New worker price |


