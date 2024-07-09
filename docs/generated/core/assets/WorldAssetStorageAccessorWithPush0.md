## WorldAssetStorageAccessorWithPush0


Any world asset which requires to identify itself as a specific type should inherit this contract





### world

```solidity
function world() public view virtual returns (contract IWorld)
```

Returns world

_Reads data from proxy's storage_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | contract IWorld |  |


### eraNumber

```solidity
function eraNumber() public view returns (uint256)
```

Returns era number

_Reads data from proxy's storage_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### assetGroupId

```solidity
function assetGroupId() public view returns (bytes32)
```

Returns world asset group id

_Reads data from proxy's storage_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 |  |


### assetTypeId

```solidity
function assetTypeId() public view returns (bytes32)
```

Returns world asset type id

_Reads data from proxy's storage_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 |  |


