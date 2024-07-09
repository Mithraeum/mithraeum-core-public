## TileCapturingSystem








### settlementCapturingTile

```solidity
mapping(address => uint64) settlementCapturingTile
```

Mapping containing settlements' current capturing tile

_Updated when #beginTileCaptureBySettlement or #claimTileCaptureBySettlement, #cancelTileCaptureBySettlement is called_




### tilesInfo

```solidity
mapping(uint64 => struct ITileCapturingSystem.TileInfo) tilesInfo
```

Mapping containing tile info by provided position

_Updated when #beginTileCaptureBySettlement or #claimTileCaptureBySettlement, #cancelTileCaptureBySettlement is called_




### init

```solidity
function init(bytes initParams) public
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### beginTileCapture

```solidity
function beginTileCapture(address settlementAddress, uint64 position, uint256 prosperityStake) public
```

Begins tile capturing

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| position | uint64 | Position |
| prosperityStake | uint256 |  |



### cancelTileCapture

```solidity
function cancelTileCapture(address settlementAddress, uint64 position) public
```

Cancels tile capturing

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| position | uint64 | Position |



### giveUpCapturedTile

```solidity
function giveUpCapturedTile(address settlementAddress, uint64 position) public
```

Gives up captured tile

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| position | uint64 | Position |



### claimTileCapture

```solidity
function claimTileCapture(address settlementAddress, uint64 position) public
```

Claims captured tile

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| position | uint64 | Position |



### getCapturedTilesBySettlementAddress

```solidity
function getCapturedTilesBySettlementAddress(address settlementAddress, uint8 tileBonusType) public view returns (uint64[])
```

Returns positions of captured tiles for provided settlement address

_Returns only claimed tiles_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| tileBonusType | uint8 | Tile bonus type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint64[] |  |


### handleSettlementCreatedOnPosition

```solidity
function handleSettlementCreatedOnPosition(uint64 position) public
```

New settlement handler

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |



### _getTileBonus

```solidity
function _getTileBonus(uint64 regionId, uint64 position) internal view returns (struct IGeography.TileBonus)
```



_Returns tile bonus by position_




### _calculateNextMinProsperityStake

```solidity
function _calculateNextMinProsperityStake(uint256 previousUsurperProsperityStake, uint256 distanceBetweenSettlementAndTile) internal view returns (uint256)
```



_Calculates next min prosperity stake_




### _applyTileBonus

```solidity
function _applyTileBonus(struct IGeography.TileBonus tileBonus, address settlementAddress) internal
```



_Applies tile bonus to_




### _removeTileBonus

```solidity
function _removeTileBonus(struct IGeography.TileBonus tileBonus, address settlementAddress) internal
```



_Removes tile bonus_




