## IWorldAssetStorageAccessor


Contains function to identify world asset group and type





### world

```solidity
function world() external view returns (contract IWorld world)
```

Returns world

_Reads data from proxy's storage_


| Name | Type | Description |
| ---- | ---- | ----------- |
| world | contract IWorld | World |


### eraNumber

```solidity
function eraNumber() external view returns (uint256 eraNumber)
```

Returns era number

_Reads data from proxy's storage_


| Name | Type | Description |
| ---- | ---- | ----------- |
| eraNumber | uint256 | Era number |


### assetGroupId

```solidity
function assetGroupId() external view returns (bytes32 assetGroupId)
```

Returns world asset group id

_Reads data from proxy's storage_


| Name | Type | Description |
| ---- | ---- | ----------- |
| assetGroupId | bytes32 | World asset group id |


### assetTypeId

```solidity
function assetTypeId() external view returns (bytes32 assetTypeId)
```

Returns world asset type id

_Reads data from proxy's storage_


| Name | Type | Description |
| ---- | ---- | ----------- |
| assetTypeId | bytes32 | World asset type id |


