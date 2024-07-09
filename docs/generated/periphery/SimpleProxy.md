## SimpleProxyStorage








```solidity
struct SimpleProxyStorage {
  address implementation;
  address owner;
}
```
## getSimpleProxyStorage

```solidity
function getSimpleProxyStorage() internal pure returns (struct SimpleProxyStorage ds)
```






## SimpleProxy


User of current proxy must be aware of simplicity nature of it, in particular case naming collision is not handled in it. Proxy parameters are written as specific slot address





### OwnershipTransferred

```solidity
event OwnershipTransferred(address previousOwner, address newOwner)
```

Emitted when #transferOwnership is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| previousOwner | address | Previous proxy owner |
| newOwner | address | New proxy owner |



### OnlyOwner

```solidity
error OnlyOwner()
```

Thrown when attempting to call action which can only be called by owner





### UnableToTransferOwnershipToZeroAddress

```solidity
error UnableToTransferOwnershipToZeroAddress()
```

Thrown when attempting to transfer ownership to zero address





### onlyOwner

```solidity
modifier onlyOwner()
```



_Only owner modifier
Modifier is calling internal function in order to reduce contract size_




### constructor

```solidity
constructor() public
```







### fallback

```solidity
fallback() external payable
```



_Fallback function that delegates calls to the address returned by `proxyStorage.implementation`. Will run if no other function in the contract matches the call data._




### setImplementation

```solidity
function setImplementation(address _newImpl) public
```

Updates proxy implementation address

_Even though this function is opened, it can only be called by contract owner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _newImpl | address | New implementation address |



### renounceOwnership

```solidity
function renounceOwnership() public virtual
```

Renounces proxy ownership

_Even though this function is opened, it can only be called by contract owner_




### transferOwnership

```solidity
function transferOwnership(address newOwner) public virtual
```

Transfers ownership to another address

_Even though this function is opened, it can only be called by contract owner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| newOwner | address | New owner address |



### _transferOwnership

```solidity
function _transferOwnership(address newOwner) internal virtual
```



_Transfers ownership to another address_




### _onlyOwner

```solidity
function _onlyOwner() internal view
```



_Allows caller to be only owner_




