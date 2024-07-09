## IWorldAssetFactory


Contains instance creator function





### OnlyWorldOrWorldAsset

```solidity
error OnlyWorldOrWorldAsset()
```

Thrown when attempting to call action which can only be called by world or world asset





### create

```solidity
function create(address worldAddress, uint256 eraNumber, bytes32 assetGroupId, bytes32 assetTypeId, bytes initParams) external returns (address worldAssetAddress)
```

Creates new world asset, sets it into the world and initializes it


| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |
| eraNumber | uint256 | Era number |
| assetGroupId | bytes32 | Asset group id |
| assetTypeId | bytes32 | Asset type id |
| initParams | bytes | Init params |

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAssetAddress | address | World asset address |


