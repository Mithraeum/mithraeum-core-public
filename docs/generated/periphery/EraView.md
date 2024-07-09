## EraView








### getUserSettlements

```solidity
function getUserSettlements(address eraAddress, uint256[] bannerIds) public view returns (address[])
```

Returns user settlements by provided banners ids

_Useful to batch query settlement addresses by banners ids_

| Name | Type | Description |
| ---- | ---- | ----------- |
| eraAddress | address | Era address |
| bannerIds | uint256[] | Banners ids |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | userSettlements Settlement addresses |


### restoreSettlementWithRegionActivation

```solidity
function restoreSettlementWithRegionActivation(address eraAddress, uint64 position, uint64 regionId) public
```

If necessary activates region and restores settlement

_Activates region (if it is not activated yet) and restores settlement on position_

| Name | Type | Description |
| ---- | ---- | ----------- |
| eraAddress | address | Era address |
| position | uint64 | Position |
| regionId | uint64 | Region id of position |



### destroySettlementWithRegionActivation

```solidity
function destroySettlementWithRegionActivation(address settlementAddress) public
```

If necessary activates region and destroys settlement

_Activates region (if it is not activated yet) and destroys settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



