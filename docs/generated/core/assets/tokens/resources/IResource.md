## IResource


Functions to read state/modify state in order to get current resource parameters and/or interact with it





### tokenName

```solidity
function tokenName() external returns (string)
```

Token name

_Immutable, initialized on creation_




### tokenSymbol

```solidity
function tokenSymbol() external returns (string)
```

Token symbol

_Immutable, initialized on creation_




### resourceTypeId

```solidity
function resourceTypeId() external returns (bytes32)
```

Resource type id

_Immutable, initialized on creation_




### OnlyWorldAssetFromSameEraOrRewardPool

```solidity
error OnlyWorldAssetFromSameEraOrRewardPool()
```

Thrown when attempting to call action which only possible to be called by world asset or reward pool





### ResourceNotAcceptable

```solidity
error ResourceNotAcceptable()
```

Thrown when attempting to transfer resources to building which does not use this resource





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



### spendAllowance

```solidity
function spendAllowance(address owner, address spender, uint256 amount) external
```

Spends allowance (same as ERC20._spendAllowance)

_Even though function is opened, it can be called only by world asset_




