## IUnitsPool


Functions to read state/modify state in order to mint units/swap tokens for units





### relatedRegion

```solidity
function relatedRegion() external view returns (contract IRegion)
```

Region to which this pool belongs

_Immutable, initialized on the region creation_




### unitTypeId

```solidity
function unitTypeId() external view returns (bytes32)
```

Unit type id

_Immutable, initialized on the region creation_




### lastPurchaseTime

```solidity
function lastPurchaseTime() external view returns (uint256)
```

Time at which last purchase is performed

_Updated every time when #swapTokensForExactUnits or #swapTokensForExactUnitsByRegion is called_




### unitPrice

```solidity
function unitPrice() external view returns (uint256)
```

Unit price

_Updated every time when #swapTokensForExactUnits or #swapTokensForExactUnitsByRegion is called_




### UnitsBought

```solidity
event UnitsBought(address spender, address armyAddress, uint256 boughtUnitsAmount, uint256 spentTokensAmount, uint256 newUnitPrice)
```

Emitted when #swapTokensForExactUnits or #swapTokensForExactUnitsByRegion is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address which payed tokens |
| armyAddress | address | The address of the army which received units |
| boughtUnitsAmount | uint256 | Amount of units bought |
| spentTokensAmount | uint256 | Spent tokens amount |
| newUnitPrice | uint256 |  |



### OnlyRelatedRegion

```solidity
error OnlyRelatedRegion()
```

Thrown when attempting to call action which can only be called by related region





### OnlyRulerOrWorldAsset

```solidity
error OnlyRulerOrWorldAsset()
```

Thrown when attempting to call action which can only be called by ruler or world asset





### CannotHireUnitsWhileArmyIsManeuvering

```solidity
error CannotHireUnitsWhileArmyIsManeuvering()
```

Thrown when attempting to hire units while army is maneuvering





### CannotHireUnitsWhileArmyIsStunned

```solidity
error CannotHireUnitsWhileArmyIsStunned()
```

Thrown when attempting to hire units while army is stunned





### CannotHireUnitsWhileArmyIsNotOnHomePosition

```solidity
error CannotHireUnitsWhileArmyIsNotOnHomePosition()
```

Thrown when attempting to hire units while army is not on home position





### CannotHireUnitsInvalidUnitsToBuySpecified

```solidity
error CannotHireUnitsInvalidUnitsToBuySpecified()
```

Thrown when attempting to hire units with invalid units to buy specified





### CannotHireUnitsForArmyWhichSettlementDoesNotBelongToRelatedRegion

```solidity
error CannotHireUnitsForArmyWhichSettlementDoesNotBelongToRelatedRegion()
```

Thrown when attempting to hire units in wrong units pool





### CannotHireUnitsExceedingArmyUnitsLimit

```solidity
error CannotHireUnitsExceedingArmyUnitsLimit()
```

Thrown when attempting to hire more units than army limit allows





### CannotHireUnitsExceedingTransactionLimit

```solidity
error CannotHireUnitsExceedingTransactionLimit()
```

Thrown when attempting to hire more units than transaction limit





### CannotHireUnitsDueToTheirCostIsHigherThanMaxTokensToSellSpecified

```solidity
error CannotHireUnitsDueToTheirCostIsHigherThanMaxTokensToSellSpecified()
```

Thrown when attempting to hire units due to their cost is being higher than max tokens to sell specified





### swapTokensForExactUnits

```solidity
function swapTokensForExactUnits(address tokensOwner, address settlementAddress, uint256 unitsToBuy, uint256 maxTokensToSell) external returns (uint256 unitsAmount)
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
| unitsAmount | uint256 | Amount of units bought by tokens |


### swapTokensForExactUnitsByRegion

```solidity
function swapTokensForExactUnitsByRegion(address tokensOwner, address msgSender, address settlementAddress, uint256 unitsToBuy, uint256 maxTokensToSell) external returns (uint256 unitsAmount)
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
| unitsAmount | uint256 | Amount of units bought by tokens |


### calculateTokensForExactUnits

```solidity
function calculateTokensForExactUnits(uint256 unitsToBuy) external view returns (uint256 tokensToSell, uint256 newUnitPrice)
```

Calculates input of tokens based on output whole amount of units

_Returns valid output only for integer unitsToBuy value (in 1e0 precision)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsToBuy | uint256 | Amount of units to buy |

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokensToSell | uint256 | Amount of tokens needed for unitsToBuy |
| newUnitPrice | uint256 | New unit price |


