## IngotsUnitsPool








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

_Updated every time when #swapTokensForExactUnits or #swapTokensForExactUnitsByRegion is called_




### unitTypeId

```solidity
bytes32 unitTypeId
```

Unit type id

_Immutable, initialized on the region creation_




### unitPrice

```solidity
uint256 unitPrice
```

Unit price

_Updated every time when #swapTokensForExactUnits or #swapTokensForExactUnitsByRegion is called_




### onlyRelatedRegion

```solidity
modifier onlyRelatedRegion()
```



_Only related region modifier
Modifier is calling internal function in order to reduce contract size_




### init

```solidity
function init(bytes initParams) public
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### calculateTokensForExactUnits

```solidity
function calculateTokensForExactUnits(uint256 unitsToBuy) public view returns (uint256, uint256)
```

Calculates input of tokens based on output whole amount of units

_Returns valid output only for integer unitsToBuy value (in 1e0 precision)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsToBuy | uint256 | Amount of units to buy |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


### swapTokensForExactUnits

```solidity
function swapTokensForExactUnits(address tokensOwner, address settlementAddress, uint256 unitsToBuy, uint256 maxTokensToSell) public returns (uint256)
```

Swaps tokens for units

_If tokensOwner == address(0) -> tokens will be taken from msg.sender
If tokensOwner != address(0) and tokensOwner has given allowance to msg.sender >= amount of tokens for units -> tokens will be taken from tokensOwner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokensOwner | address | Tokens owner |
| settlementAddress | address | Settlement address, army of which, will receive units |
| unitsToBuy | uint256 | Exact amount of units |
| maxTokensToSell | uint256 | Maximum amount of tokens to be taken for exact amount of units |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### swapTokensForExactUnitsByRegion

```solidity
function swapTokensForExactUnitsByRegion(address tokensOwner, address msgSender, address settlementAddress, uint256 unitsToBuy, uint256 maxTokensToSell) public returns (uint256)
```

Swaps tokens for units by region

_Even though function is opened it can be called only by region
If tokensOwner == address(0) -> tokens will be taken from msg.sender
If tokensOwner != address(0) and tokensOwner has given allowance to msg.sender >= amount of tokens for units -> tokens will be taken from tokensOwner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokensOwner | address | Tokens owner |
| msgSender | address | msg.sender from region call |
| settlementAddress | address | Settlement address, army of which, will receive units |
| unitsToBuy | uint256 | Exact amount of units |
| maxTokensToSell | uint256 | Maximum amount of tokens to be taken for exact amount of units |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### _onlyRelatedRegion

```solidity
function _onlyRelatedRegion() internal view
```



_Allows caller to be only related region_




### _ingots

```solidity
function _ingots() internal view returns (contract IResource)
```



_Returns ingots_




### _units

```solidity
function _units() internal view returns (contract IUnits)
```



_Returns units by pool unit type_




### _getUnitDroppedPrice

```solidity
function _getUnitDroppedPrice() internal view returns (int128)
```



_Calculates dropped price of unit after last purchase time_




### _calculatePriceShiftForUnits

```solidity
function _calculatePriceShiftForUnits(uint256 amountOfUnits, int128 priceShiftPerUnit64) internal view returns (uint256, uint256)
```



_Calculates amount of ingots and new unit price according to amount of units and price shift per unit interaction with the pool_




### _swapIngotsForExactUnits

```solidity
function _swapIngotsForExactUnits(address resourcesOwner, address msgSender, address settlementAddress, uint256 unitsToBuy, uint256 maxIngotsToSell) internal returns (uint256)
```



_Core logic related to swapping ingots for exact units_




### _getFortHealthAndLevelCoefficient

```solidity
function _getFortHealthAndLevelCoefficient(contract ISettlement settlement) internal view returns (uint256, uint256)
```



_Returns fort health and its level coefficient_




### _getArmyTotalUnits

```solidity
function _getArmyTotalUnits(contract IArmy army) internal view returns (uint256)
```



_Calculates army total units_




### _getMaxAllowedToBuy

```solidity
function _getMaxAllowedToBuy(contract ISettlement settlement, contract IArmy army) internal view returns (uint256)
```



_Calculates maximum allowed extra units that can be bought and placed into army given its total units count and fort health_




