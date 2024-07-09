## WorldAssetStorage








```solidity
struct WorldAssetStorage {
  address worldAddress;
  uint256 eraNumber;
  bytes28 assetId;
  bytes32 assetGroupId;
  bytes32 assetTypeId;
}
```
## getWorldAssetStorage

```solidity
function getWorldAssetStorage() internal pure returns (struct WorldAssetStorage ds)
```






