## Units








### OCCULTISTS_SETTLEMENT_TYPE

```solidity
bytes32 OCCULTISTS_SETTLEMENT_TYPE
```

Bytes 32 value for occultists settlement type

_Used for determination if units went from/to occultists army_




### ARMY_ASSET_TYPE

```solidity
bytes32 ARMY_ASSET_TYPE
```

Bytes32 value for any army asset type

_Used for determination if unit went from/to army_




### UNITS_POOL_ASSET_TYPE

```solidity
bytes32 UNITS_POOL_ASSET_TYPE
```

Bytes32 value for any units market asset type

_Used for determination if unit went from/to units market_




### epochNumber

```solidity
uint256 epochNumber
```

Epoch number

_Immutable, initialized on creation_




### worldUnitName

```solidity
string worldUnitName
```

Name of the unit inside epoch.units

_Immutable, initialized on creation_




### constructor

```solidity
constructor(address worldAddress, string _tokenName, string _tokenSymbol, string _worldUnitName, uint256 epoch) public
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




### isOccultistsArmy

```solidity
function isOccultistsArmy(address armyAddress) internal view returns (bool)
```







### isWorldAsset

```solidity
function isWorldAsset(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is world or world asset_




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




## Units








### OCCULTISTS_SETTLEMENT_TYPE

```solidity
bytes32 OCCULTISTS_SETTLEMENT_TYPE
```

Bytes 32 value for occultists settlement type

_Used for determination if units went from/to occultists army_




### ARMY_ASSET_TYPE

```solidity
bytes32 ARMY_ASSET_TYPE
```

Bytes32 value for any army asset type

_Used for determination if unit went from/to army_




### UNITS_POOL_ASSET_TYPE

```solidity
bytes32 UNITS_POOL_ASSET_TYPE
```

Bytes32 value for any units market asset type

_Used for determination if unit went from/to units market_




### epochNumber

```solidity
uint256 epochNumber
```

Epoch number

_Immutable, initialized on creation_




### worldUnitName

```solidity
string worldUnitName
```

Name of the unit inside epoch.units

_Immutable, initialized on creation_




### constructor

```solidity
constructor(address worldAddress, string _tokenName, string _tokenSymbol, string _worldUnitName, uint256 epoch) public
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




### isOccultistsArmy

```solidity
function isOccultistsArmy(address armyAddress) internal view returns (bool)
```







### isWorldAsset

```solidity
function isWorldAsset(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is world or world asset_




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




