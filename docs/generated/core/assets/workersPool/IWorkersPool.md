## IWorkersPool


Functions to read state/modify state in order to mint workers/swap prosperity for workers





### WorkersBought

```solidity
event WorkersBought(address buyer, uint256 workersBought, uint256 prosperitySpent)
```

Emitted when #swapProsperityForExactWorkers or #swapExactProsperityForWorkers is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| buyer | address | The address of settlement which bought workers |
| workersBought | uint256 | Amount of workers bought |
| prosperitySpent | uint256 | Amount of prosperity spent |



### currentZone

```solidity
function currentZone() external view returns (contract IZone)
```

Zone to which this pool belongs

_Immutable, initialized on the zone creation_




### lastPurchaseTime

```solidity
function lastPurchaseTime() external view returns (uint256)
```

Time at which last purchase is performed

_Updated every time when #swapProsperityForExactWorkers is called_




### startingPrice

```solidity
function startingPrice() external view returns (uint256)
```

Starting unit price

_Updated every time when #swapProsperityForExactWorkers is called_




### init

```solidity
function init(address zoneAddress) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneAddress | address | Zone address |



### swapProsperityForExactWorkers

```solidity
function swapProsperityForExactWorkers(uint256 workersToBuy, uint256 maxProsperityToSell) external returns (uint256 workersCount)
```

Swaps prosperity() for exact workers()

_Even though function is opened, it can be executed only by ISettlement because only ISettlement can have prosperity_

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersToBuy | uint256 | Exact amount of workers |
| maxProsperityToSell | uint256 | Maximum amount of prosperity to be taken for exact amount of workers |

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersCount | uint256 | Amount of workers bought by prosperity |


### getAmountIn

```solidity
function getAmountIn(uint256 workersToBuy) external returns (uint256 prosperityToSell, uint256 newStartingPrice)
```

Calculates input of prosperity based on output whole amount of workers

_Returns valid output only for integer workersToBuy value_

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersToBuy | uint256 | Amount of workers to buy |

| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityToSell | uint256 | Amount of prosperity needed for workersToBuy |
| newStartingPrice | uint256 | New starting price |


## IWorkersPool


Functions to read state/modify state in order to mint workers/swap prosperity for workers





### WorkersBought

```solidity
event WorkersBought(address buyer, uint256 workersBought, uint256 prosperitySpent)
```

Emitted when #swapProsperityForExactWorkers or #swapExactProsperityForWorkers is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| buyer | address | The address of settlement which bought workers |
| workersBought | uint256 | Amount of workers bought |
| prosperitySpent | uint256 | Amount of prosperity spent |



### currentZone

```solidity
function currentZone() external view returns (contract IZone)
```

Zone to which this pool belongs

_Immutable, initialized on the zone creation_




### lastPurchaseTime

```solidity
function lastPurchaseTime() external view returns (uint256)
```

Time at which last purchase is performed

_Updated every time when #swapProsperityForExactWorkers is called_




### startingPrice

```solidity
function startingPrice() external view returns (uint256)
```

Starting unit price

_Updated every time when #swapProsperityForExactWorkers is called_




### init

```solidity
function init(address zoneAddress) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneAddress | address | Zone address |



### swapProsperityForExactWorkers

```solidity
function swapProsperityForExactWorkers(uint256 workersToBuy, uint256 maxProsperityToSell) external returns (uint256 workersCount)
```

Swaps prosperity() for exact workers()

_Even though function is opened, it can be executed only by ISettlement because only ISettlement can have prosperity_

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersToBuy | uint256 | Exact amount of workers |
| maxProsperityToSell | uint256 | Maximum amount of prosperity to be taken for exact amount of workers |

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersCount | uint256 | Amount of workers bought by prosperity |


### getAmountIn

```solidity
function getAmountIn(uint256 workersToBuy) external returns (uint256 prosperityToSell, uint256 newStartingPrice)
```

Calculates input of prosperity based on output whole amount of workers

_Returns valid output only for integer workersToBuy value_

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersToBuy | uint256 | Amount of workers to buy |

| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityToSell | uint256 | Amount of prosperity needed for workersToBuy |
| newStartingPrice | uint256 | New starting price |


