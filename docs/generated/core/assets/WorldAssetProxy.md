## WorldAssetProxy


Acts as a proxy contract to specified world asset, implementation of which is dereferenced from its creation parameters





### constructor

```solidity
constructor(address worldAddress, uint256 eraNumber, bytes32 assetGroupId, bytes32 assetTypeId) public
```







### fallback

```solidity
fallback() external payable
```



_Fallback function that delegates calls to the address returned by registry script contract. Will run if no other function in the contract matches the call data._




