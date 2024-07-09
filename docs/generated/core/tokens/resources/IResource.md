## IResource


Functions to read state/modify state in order to get current resource parameters and/or interact with it





### stateBalanceOf

```solidity
function stateBalanceOf(address tokensOwner) external view returns (uint256 balance)
```

Returns state balance for specified token owner

_Current function returns value of balances 'as is', without recalculation (same as 'balanceOf' you would expect)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokensOwner | address | Tokens owner |

| Name | Type | Description |
| ---- | ---- | ----------- |
| balance | uint256 | Balance for token owner |


### mint

```solidity
function mint(address to, uint256 amount) external
```

Mints resource to specified address

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Address which will receive resources |
| amount | uint256 | Amount of resources to mint |



## IResource


Functions to read state/modify state in order to get current resource parameters and/or interact with it





### stateBalanceOf

```solidity
function stateBalanceOf(address tokensOwner) external view returns (uint256 balance)
```

Returns state balance for specified token owner

_Current function returns value of balances 'as is', without recalculation (same as 'balanceOf' you would expect)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokensOwner | address | Tokens owner |

| Name | Type | Description |
| ---- | ---- | ----------- |
| balance | uint256 | Balance for token owner |


### mint

```solidity
function mint(address to, uint256 amount) external
```

Mints resource to specified address

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Address which will receive resources |
| amount | uint256 | Amount of resources to mint |



