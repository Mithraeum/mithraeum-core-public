## IUnits


Functions to read state/modify state in order to get current unit parameters and/or interact with it





### tokenName

```solidity
function tokenName() external view returns (string)
```

Token name

_Immutable, initialized on creation_




### tokenSymbol

```solidity
function tokenSymbol() external view returns (string)
```

Token symbol

_Immutable, initialized on creation_




### unitTypeId

```solidity
function unitTypeId() external view returns (bytes32)
```

Unit type id

_Immutable, initialized on creation_




### Disabled

```solidity
error Disabled()
```

Thrown when attempting to call action which is disabled





### mint

```solidity
function mint(address to, uint256 amount) external
```

Mints units to specified address

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Address which will receive units |
| amount | uint256 | Amount of units to mint |



