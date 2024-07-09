## ISettlementFactory


Contains instance creator function





### create

```solidity
function create(address worldAddress, uint256 epochNumber, string assetName, uint256 ownerTokenId, address zoneAddress, uint32 settlementPosition) external returns (address createdInstanceAddress)
```

Creates Settlement instance and initializes it with specified parameters

_Even though this function is opened, it can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |
| epochNumber | uint256 | Epoch number |
| assetName | string | Name of the battle type (Currently only 'BASIC' and 'OCCULTISTS') |
| ownerTokenId | uint256 | Id of the banner settlement will attach to |
| zoneAddress | address | Address of the zone where settlement will be created |
| settlementPosition | uint32 | Position on which settlement is created |

| Name | Type | Description |
| ---- | ---- | ----------- |
| createdInstanceAddress | address | Created instance address |


## ISettlementFactory


Contains instance creator function





### create

```solidity
function create(address worldAddress, uint256 epochNumber, string assetName, uint256 ownerTokenId, address zoneAddress, uint32 settlementPosition) external returns (address createdInstanceAddress)
```

Creates Settlement instance and initializes it with specified parameters

_Even though this function is opened, it can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |
| epochNumber | uint256 | Epoch number |
| assetName | string | Name of the battle type (Currently only 'BASIC' and 'OCCULTISTS') |
| ownerTokenId | uint256 | Id of the banner settlement will attach to |
| zoneAddress | address | Address of the zone where settlement will be created |
| settlementPosition | uint32 | Position on which settlement is created |

| Name | Type | Description |
| ---- | ---- | ----------- |
| createdInstanceAddress | address | Created instance address |


