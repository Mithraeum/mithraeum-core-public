## IResourceFactory


Contains instance creator function





### create

```solidity
function create(address worldAddress, string tokenName, string tokenSymbol, string worldResourceName, uint256 epoch) external returns (address createdInstanceAddress)
```

Creates Resource instance and initializes it with specified parameters

_Even though this function is opened, it can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |
| tokenName | string | Name of the token |
| tokenSymbol | string | Symbol of the token |
| worldResourceName | string | Resource name in world configuration (FOOD/WOOD/ORE/WEAPON) |
| epoch | uint256 | World epoch at which resource will be created |

| Name | Type | Description |
| ---- | ---- | ----------- |
| createdInstanceAddress | address | Created instance address |


## IResourceFactory


Contains instance creator function





### create

```solidity
function create(address worldAddress, string tokenName, string tokenSymbol, string worldResourceName, uint256 epoch) external returns (address createdInstanceAddress)
```

Creates Resource instance and initializes it with specified parameters

_Even though this function is opened, it can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |
| tokenName | string | Name of the token |
| tokenSymbol | string | Symbol of the token |
| worldResourceName | string | Resource name in world configuration (FOOD/WOOD/ORE/WEAPON) |
| epoch | uint256 | World epoch at which resource will be created |

| Name | Type | Description |
| ---- | ---- | ----------- |
| createdInstanceAddress | address | Created instance address |


