## Resource








### tokenName

```solidity
string tokenName
```

Token name

_Immutable, initialized on creation_




### tokenSymbol

```solidity
string tokenSymbol
```

Token symbol

_Immutable, initialized on creation_




### resourceTypeId

```solidity
bytes32 resourceTypeId
```

Resource type id

_Immutable, initialized on creation_




### onlyWorldAssetFromSameEraOrRewardPool

```solidity
modifier onlyWorldAssetFromSameEraOrRewardPool()
```



_Only world asset from same era or reward pool modifier
Modifier is calling internal function in order to reduce contract size_




### constructor

```solidity
constructor() public
```



_Removes error for compiling, default constructor does nothing because its a proxy_




### init

```solidity
function init(bytes initParams) public
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### name

```solidity
function name() public view returns (string)
```







### symbol

```solidity
function symbol() public view returns (string)
```







### mint

```solidity
function mint(address to, uint256 amount) public
```

Mints resource to specified address

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Address which will receive resources |
| amount | uint256 | Amount of resources to mint |



### burn

```solidity
function burn(uint256 amount) public
```







### burnFrom

```solidity
function burnFrom(address account, uint256 amount) public
```







### transfer

```solidity
function transfer(address to, uint256 amount) public returns (bool success)
```

Transferred disabled if trying to transfer to the game building which does not use this resource

_Moves `amount` tokens from the caller's account to `to`.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._




### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) public returns (bool success)
```

Transferred disabled if trying to transfer to the game building which does not use this resource

_Moves `amount` tokens from `from` to `to` using the
allowance mechanism. `amount` is then deducted from the caller's
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._




### spendAllowance

```solidity
function spendAllowance(address owner, address spender, uint256 amount) public
```

Spends allowance (same as ERC20._spendAllowance)

_Even though function is opened, it can be called only by world asset_




### balanceOf

```solidity
function balanceOf(address tokenOwner) public view returns (uint256)
```

If called for building then it returns amount of resource as if building state was applied

_Returns the amount of tokens owned by `account`._




### stateBalanceOf

```solidity
function stateBalanceOf(address tokenOwner) public view returns (uint256 balance)
```

Returns state balance for specified token owner

_Current function returns value of balances 'as is', without recalculation (same as 'balanceOf' you would expect)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenOwner | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| balance | uint256 | Balance for token owner |


### _onlyWorldAssetFromSameEraOrRewardPool

```solidity
function _onlyWorldAssetFromSameEraOrRewardPool() internal view
```



_Allows caller to be only world or world asset or reward pool_




### _isRequiredForBuildingProduction

```solidity
function _isRequiredForBuildingProduction(bytes32 resourceTypeId, address buildingAddress, bool isProducingResource) internal view returns (bool)
```



_Checks if provided resource is required for building production_




### _isRewardPool

```solidity
function _isRewardPool(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is reward pool_




### _isWorldAsset

```solidity
function _isWorldAsset(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is world or world asset_




### _transfer

```solidity
function _transfer(address from, address to, uint256 amount) internal
```

Behaves same as default ERC20._transfer, however if resource is transferred to the building part of the resource is burned according to cultists balance





### _mint

```solidity
function _mint(address to, uint256 amount) internal
```

Behaves same as default ERC20._mint, however if resource is minted to building's production (non producing resource) cultists penalty should be applied





### _burn

```solidity
function _burn(address from, uint256 amount) internal
```

Behaves same as default ERC20._burn





