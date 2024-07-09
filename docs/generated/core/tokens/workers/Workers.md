## Workers








### WORKERS_POOL_ASSET_TYPE

```solidity
bytes32 WORKERS_POOL_ASSET_TYPE
```

Bytes32 value for any worker market asset type

_Used for determination if workers went from/to workers market_




### SETTLEMENT_ASSET_TYPE

```solidity
bytes32 SETTLEMENT_ASSET_TYPE
```

Bytes32 value for settlement asset type

_Used for determination if workers went from/to settlement_




### BUILDING_ASSET_TYPE

```solidity
bytes32 BUILDING_ASSET_TYPE
```

Bytes32 value for any building asset type

_Used for determination if workers went from/to building_




### epochNumber

```solidity
uint256 epochNumber
```

Epoch number

_To which epoch number current workers is related to_




### constructor

```solidity
constructor(address worldAddress, uint256 epoch) public
```







### _afterTokenTransfer

```solidity
function _afterTokenTransfer(address from, address to, uint256 amount) internal
```



_ERC20 _afterTokenTransfer hook_




### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal
```



_ERC20 _beforeTokenTransfer hook_




### isWorldAsset

```solidity
function isWorldAsset(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is world or world asset_




### getSettlementByBuilding

```solidity
function getSettlementByBuilding(address buildingAddress) internal view returns (address)
```



_Returns this buildings settlement_




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




## Workers








### WORKERS_POOL_ASSET_TYPE

```solidity
bytes32 WORKERS_POOL_ASSET_TYPE
```

Bytes32 value for any worker market asset type

_Used for determination if workers went from/to workers market_




### SETTLEMENT_ASSET_TYPE

```solidity
bytes32 SETTLEMENT_ASSET_TYPE
```

Bytes32 value for settlement asset type

_Used for determination if workers went from/to settlement_




### BUILDING_ASSET_TYPE

```solidity
bytes32 BUILDING_ASSET_TYPE
```

Bytes32 value for any building asset type

_Used for determination if workers went from/to building_




### epochNumber

```solidity
uint256 epochNumber
```

Epoch number

_To which epoch number current workers is related to_




### constructor

```solidity
constructor(address worldAddress, uint256 epoch) public
```







### _afterTokenTransfer

```solidity
function _afterTokenTransfer(address from, address to, uint256 amount) internal
```



_ERC20 _afterTokenTransfer hook_




### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal
```



_ERC20 _beforeTokenTransfer hook_




### isWorldAsset

```solidity
function isWorldAsset(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is world or world asset_




### getSettlementByBuilding

```solidity
function getSettlementByBuilding(address buildingAddress) internal view returns (address)
```



_Returns this buildings settlement_




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




