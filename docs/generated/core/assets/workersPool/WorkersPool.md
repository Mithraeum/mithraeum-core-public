## WorkersPool








### currentZone

```solidity
contract IZone currentZone
```

Zone to which this pool belongs

_Immutable, initialized on the zone creation_




### lastPurchaseTime

```solidity
uint256 lastPurchaseTime
```

Time at which last purchase is performed

_Updated every time when #swapProsperityForExactWorkers is called_




### startingPrice

```solidity
uint256 startingPrice
```

Starting unit price

_Updated every time when #swapProsperityForExactWorkers is called_




### init

```solidity
function init(address zoneAddress) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneAddress | address | Zone address |



### prosperity

```solidity
function prosperity() internal view returns (contract IProsperity)
```



_Returns prosperity_




### workers

```solidity
function workers() internal view returns (contract IWorkers)
```



_Returns workers_




### getDroppedPrice

```solidity
function getDroppedPrice() internal view returns (int128)
```



_Calculates dropped price after last purchase time_




### calculatePriceShiftForUnits

```solidity
function calculatePriceShiftForUnits(uint256 amountOfWorkers, int128 priceShiftPerWorker64) internal view returns (uint256, uint256)
```



_Calculates amount of prosperity and new starting price according to amount of workers and price shift per worker interaction with the pool_




### getAmountIn

```solidity
function getAmountIn(uint256 unitsToBuy) public view returns (uint256, uint256)
```

Calculates input of prosperity based on output whole amount of workers

_Returns valid output only for integer workersToBuy value_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsToBuy | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


### swapProsperityForExactWorkers

```solidity
function swapProsperityForExactWorkers(uint256 workersToBuy, uint256 maxProsperityToSell) public returns (uint256)
```

Swaps prosperity() for exact workers()

_Even though function is opened, it can be executed only by ISettlement because only ISettlement can have prosperity_

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersToBuy | uint256 | Exact amount of workers |
| maxProsperityToSell | uint256 | Maximum amount of prosperity to be taken for exact amount of workers |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


## WorkersPool








### currentZone

```solidity
contract IZone currentZone
```

Zone to which this pool belongs

_Immutable, initialized on the zone creation_




### lastPurchaseTime

```solidity
uint256 lastPurchaseTime
```

Time at which last purchase is performed

_Updated every time when #swapProsperityForExactWorkers is called_




### startingPrice

```solidity
uint256 startingPrice
```

Starting unit price

_Updated every time when #swapProsperityForExactWorkers is called_




### init

```solidity
function init(address zoneAddress) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneAddress | address | Zone address |



### prosperity

```solidity
function prosperity() internal view returns (contract IProsperity)
```



_Returns prosperity_




### workers

```solidity
function workers() internal view returns (contract IWorkers)
```



_Returns workers_




### getDroppedPrice

```solidity
function getDroppedPrice() internal view returns (int128)
```



_Calculates dropped price after last purchase time_




### calculatePriceShiftForUnits

```solidity
function calculatePriceShiftForUnits(uint256 amountOfWorkers, int128 priceShiftPerWorker64) internal view returns (uint256, uint256)
```



_Calculates amount of prosperity and new starting price according to amount of workers and price shift per worker interaction with the pool_




### getAmountIn

```solidity
function getAmountIn(uint256 unitsToBuy) public view returns (uint256, uint256)
```

Calculates input of prosperity based on output whole amount of workers

_Returns valid output only for integer workersToBuy value_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsToBuy | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


### swapProsperityForExactWorkers

```solidity
function swapProsperityForExactWorkers(uint256 workersToBuy, uint256 maxProsperityToSell) public returns (uint256)
```

Swaps prosperity() for exact workers()

_Even though function is opened, it can be executed only by ISettlement because only ISettlement can have prosperity_

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersToBuy | uint256 | Exact amount of workers |
| maxProsperityToSell | uint256 | Maximum amount of prosperity to be taken for exact amount of workers |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


