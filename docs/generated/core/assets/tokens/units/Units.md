## Units








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




### unitTypeId

```solidity
bytes32 unitTypeId
```

Unit type id

_Immutable, initialized on creation_




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

Mints units to specified address

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Address which will receive units |
| amount | uint256 | Amount of units to mint |



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

Transfer is disabled

_Moves `amount` tokens from the caller's account to `to`.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._




### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) public returns (bool success)
```

Transfer from is disabled

_Moves `amount` tokens from `from` to `to` using the
allowance mechanism. `amount` is then deducted from the caller's
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._




### _isCultistsSettlement

```solidity
function _isCultistsSettlement(contract ISettlement settlement) internal view returns (bool)
```



_Checks if provided settlement cultists settlement or not_




### _isWorldAsset

```solidity
function _isWorldAsset(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is world or world asset_




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




