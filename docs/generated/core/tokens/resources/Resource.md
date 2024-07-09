## Resource








### BUILDING_ASSET_TYPE

```solidity
bytes32 BUILDING_ASSET_TYPE
```

Bytes32 value for any building asset type

_Used for determination if resource went from/to building_




### UNITS_POOL_ASSET_TYPE

```solidity
bytes32 UNITS_POOL_ASSET_TYPE
```

Bytes32 value for any units pool asset type

_Used for determination if resource went from/to units market_




### worldResourceName

```solidity
string worldResourceName
```

Name of the resource inside world.resources

_Used for modification of behaviour of certain functions_




### epochNumber

```solidity
uint256 epochNumber
```

Epoch number

_To which epoch number current resource is related to_




### constructor

```solidity
constructor(address worldAddress, string _tokenName, string _tokenSymbol, string _worldResourceName, uint256 epoch) public
```







### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal
```



_ERC20 _beforeTokenTransfer hook_




### _afterTokenTransfer

```solidity
function _afterTokenTransfer(address from, address to, uint256 amount) internal
```



_ERC20 _afterTokenTransfer hook_




### isRewardPool

```solidity
function isRewardPool(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is reward pool_




### isWorldAsset

```solidity
function isWorldAsset(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is world or world asset_




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


## Resource








### BUILDING_ASSET_TYPE

```solidity
bytes32 BUILDING_ASSET_TYPE
```

Bytes32 value for any building asset type

_Used for determination if resource went from/to building_




### UNITS_POOL_ASSET_TYPE

```solidity
bytes32 UNITS_POOL_ASSET_TYPE
```

Bytes32 value for any units pool asset type

_Used for determination if resource went from/to units market_




### worldResourceName

```solidity
string worldResourceName
```

Name of the resource inside world.resources

_Used for modification of behaviour of certain functions_




### epochNumber

```solidity
uint256 epochNumber
```

Epoch number

_To which epoch number current resource is related to_




### constructor

```solidity
constructor(address worldAddress, string _tokenName, string _tokenSymbol, string _worldResourceName, uint256 epoch) public
```







### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal
```



_ERC20 _beforeTokenTransfer hook_




### _afterTokenTransfer

```solidity
function _afterTokenTransfer(address from, address to, uint256 amount) internal
```



_ERC20 _afterTokenTransfer hook_




### isRewardPool

```solidity
function isRewardPool(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is reward pool_




### isWorldAsset

```solidity
function isWorldAsset(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is world or world asset_




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


