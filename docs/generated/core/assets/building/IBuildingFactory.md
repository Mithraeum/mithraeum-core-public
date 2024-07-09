## IBuildingFactory


Contains instance creator function





### create

```solidity
function create(address worldAddress, uint256 epochNumber, string assetName, address settlementAddress) external returns (address createdInstanceAddress)
```

Creates Building instance and initializes it with specified parameters

_Even though this function is opened, it can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |
| epochNumber | uint256 | Epoch number |
| assetName | string | Name of the building type (Currently 'FARM', 'LUMBERMILL', 'MINE', 'SMITHY', 'FORT') |
| settlementAddress | address | Settlement address |

| Name | Type | Description |
| ---- | ---- | ----------- |
| createdInstanceAddress | address | Created instance address |


## IBuildingFactory


Contains instance creator function





### create

```solidity
function create(address worldAddress, uint256 epochNumber, string assetName, address settlementAddress) external returns (address createdInstanceAddress)
```

Creates Building instance and initializes it with specified parameters

_Even though this function is opened, it can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |
| epochNumber | uint256 | Epoch number |
| assetName | string | Name of the building type (Currently 'FARM', 'LUMBERMILL', 'MINE', 'SMITHY', 'FORT') |
| settlementAddress | address | Settlement address |

| Name | Type | Description |
| ---- | ---- | ----------- |
| createdInstanceAddress | address | Created instance address |


