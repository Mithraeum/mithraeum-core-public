## StubERC20


Used for development deployments, where specific functions is token must be present for testing convenience. Should not be used in production





### constructor

```solidity
constructor(string name, string symbol) public
```







### mintTo

```solidity
function mintTo(address dstAddress, uint256 amount) public
```

Mints specified amount of tokens to specified address

_Only owner can mint tokens_

| Name | Type | Description |
| ---- | ---- | ----------- |
| dstAddress | address | An address which will receive tokens |
| amount | uint256 | Tokens amount |



### burnFrom

```solidity
function burnFrom(address srcAddress, uint256 amount) public
```

Burns specified amount of tokens from specified address

_Only owner can burn tokens from address_

| Name | Type | Description |
| ---- | ---- | ----------- |
| srcAddress | address | An address from which tokens will be burned |
| amount | uint256 | Tokens amount |



