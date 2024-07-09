## Workers








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

Mints workers to specified address

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Address which will receive workers |
| amount | uint256 | Amount of units to mint |



### burnFrom

```solidity
function burnFrom(address from, uint256 amount) public
```







### burn

```solidity
function burn(uint256 amount) public
```







### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) public returns (bool)
```



_Moves `amount` tokens from `from` to `to` using the
allowance mechanism. `amount` is then deducted from the caller's
allowance.

Returns a boolean value indicating whether the operation succeeded.

Emits a {Transfer} event._




### _isWorldAsset

```solidity
function _isWorldAsset(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is world or world asset_




### _getSettlementByBuilding

```solidity
function _getSettlementByBuilding(address buildingAddress) internal view returns (address)
```



_Returns this buildings settlement_




### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal
```



_ERC20 _beforeTokenTransfer hook_




