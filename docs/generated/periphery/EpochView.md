## EpochView








### getUserSettlements

```solidity
function getUserSettlements(address epochAddress, uint256[] ownerTokenIds) public view returns (address[])
```

Returns user settlements by provided banners ids

_Useful to batch query settlement addresses by banners ids_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochAddress | address | Epoch address |
| ownerTokenIds | uint256[] | Banners ids |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | userSettlements Settlement addresses |


### restoreSettlementWithZoneActivation

```solidity
function restoreSettlementWithZoneActivation(address epochAddress, uint32 position) public
```

If necessary activates zone and restores settlement

_Restores settlement on position and activates zone if it is not activated yet_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochAddress | address | Epoch address |
| position | uint32 | Position |



## EpochView








### getUserSettlements

```solidity
function getUserSettlements(address epochAddress, uint256[] ownerTokenIds) public view returns (address[])
```

Returns user settlements by provided banners ids

_Useful to batch query settlement addresses by banners ids_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochAddress | address | Epoch address |
| ownerTokenIds | uint256[] | Banners ids |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] | userSettlements Settlement addresses |


### restoreSettlementWithZoneActivation

```solidity
function restoreSettlementWithZoneActivation(address epochAddress, uint32 position) public
```

If necessary activates zone and restores settlement

_Restores settlement on position and activates zone if it is not activated yet_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochAddress | address | Epoch address |
| position | uint32 | Position |



