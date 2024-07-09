## WorldAssetFactory


Any world asset factory should inherit this abstract factory containing common method to create and set world asset





### onlyWorldOrWorldAsset

```solidity
modifier onlyWorldOrWorldAsset(address worldAddress, uint256 epochNumber)
```



_Allows caller to be only world or world asset_




### createAndSet

```solidity
function createAndSet(address worldAddress, uint256 epochNumber, string assetType, string assetName) internal returns (address)
```



_Creates new world asset with specified world asset params and adds newly created asset to the world_




## WorldAssetFactory


Any world asset factory should inherit this abstract factory containing common method to create and set world asset





### onlyWorldOrWorldAsset

```solidity
modifier onlyWorldOrWorldAsset(address worldAddress, uint256 epochNumber)
```



_Allows caller to be only world or world asset_




### createAndSet

```solidity
function createAndSet(address worldAddress, uint256 epochNumber, string assetType, string assetName) internal returns (address)
```



_Creates new world asset with specified world asset params and adds newly created asset to the world_




