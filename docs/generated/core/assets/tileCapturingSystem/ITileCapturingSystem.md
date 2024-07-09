## ITileCapturingSystem


Functions to read state/modify state in order to get current system parameters and/or interact with it





### TileInfo








```solidity
struct TileInfo {
  address ownerSettlementAddress;
  address usurperSettlementAddress;
  uint256 usurperProsperityStake;
  uint64 usurperCaptureBeginTime;
  uint64 usurperCaptureEndTime;
}
```

### settlementCapturingTile

```solidity
function settlementCapturingTile(address settlementAddress) external view returns (uint64)
```

Mapping containing settlements' current capturing tile

_Updated when #beginTileCaptureBySettlement or #claimTileCaptureBySettlement, #cancelTileCaptureBySettlement is called_




### tilesInfo

```solidity
function tilesInfo(uint64 position) external view returns (address ownerSettlementAddress, address usurperSettlementAddress, uint256 usurperProsperityStake, uint64 usurperCaptureBeginTime, uint64 usurperCaptureEndTime)
```

Mapping containing tile info by provided position

_Updated when #beginTileCaptureBySettlement or #claimTileCaptureBySettlement, #cancelTileCaptureBySettlement is called_




### TileCapturingBegan

```solidity
event TileCapturingBegan(address previousUsurperAddress, uint64 position, address settlementAddress, uint256 prosperityStake, uint64 captureBeginTime, uint64 captureEndTime)
```

Emitted when #beginTileCaptureBySettlement is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| previousUsurperAddress | address | Previous usurper address |
| position | uint64 | Position |
| settlementAddress | address | Settlement address |
| prosperityStake | uint256 | Prosperity stake |
| captureBeginTime | uint64 | Capture begin time |
| captureEndTime | uint64 | Capture end time |



### TileCapturingCancelled

```solidity
event TileCapturingCancelled(uint64 position, address settlementAddress)
```

Emitted when #cancelTileCaptureBySettlement


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |
| settlementAddress | address | Settlement address |



### CapturedTileClaimed

```solidity
event CapturedTileClaimed(address previousSettlementOwnerAddress, uint64 position, address settlementAddress, uint256 prosperityStake)
```

Emitted when #claimTileCaptureBySettlement


| Name | Type | Description |
| ---- | ---- | ----------- |
| previousSettlementOwnerAddress | address | Previous settlement owner address |
| position | uint64 | Position |
| settlementAddress | address | Settlement address |
| prosperityStake | uint256 | Prosperity stake |



### CapturedTileGivenUp

```solidity
event CapturedTileGivenUp(uint64 position, address settlementAddress)
```

Emitted when #giveUpCapturedTile


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |
| settlementAddress | address | Settlement address |



### CannotBeginTileCaptureDueToNonExistentPositionSpecified

```solidity
error CannotBeginTileCaptureDueToNonExistentPositionSpecified()
```

Thrown when attempting to begin tile capture of non existent position





### CannotBeginTileCaptureOnNotActivatedRegion

```solidity
error CannotBeginTileCaptureOnNotActivatedRegion()
```

Thrown when attempting to begin tile capture of position on not activated region





### CannotBeginTileCaptureOnPositionWithSettlement

```solidity
error CannotBeginTileCaptureOnPositionWithSettlement()
```

Thrown when attempting to begin tile capture on position with settlement on it





### CannotBeginTileCaptureBySettlementWhichIsAlreadyCapturingTile

```solidity
error CannotBeginTileCaptureBySettlementWhichIsAlreadyCapturingTile()
```

Thrown when attempting to begin tile capture by settlement which is already capturing tile





### CannotBeginTileCaptureBySettlementAlreadyHavingMaximumCapturedTilesWithSameBonus

```solidity
error CannotBeginTileCaptureBySettlementAlreadyHavingMaximumCapturedTilesWithSameBonus()
```

Thrown when attempting to begin tile capture by settlement which already has maximum allowed tiles with same bonus as specified tile





### CannotBeginTileCaptureOfPositionWithoutBonus

```solidity
error CannotBeginTileCaptureOfPositionWithoutBonus()
```

Thrown when attempting to begin tile capture of position without tile bonus





### CannotBeginTileCaptureDueToNotHavingSpecifiedProsperity

```solidity
error CannotBeginTileCaptureDueToNotHavingSpecifiedProsperity()
```

Thrown when attempting to begin tile capture with not having specified amount of prosperity





### CannotBeginTileCaptureDueToNotReachedNextMinimumProsperityStake

```solidity
error CannotBeginTileCaptureDueToNotReachedNextMinimumProsperityStake()
```

Thrown when attempting to begin tile capture with prosperity stake lower than next minimum prosperity stake





### TileCaptureCannotBeCancelledBySettlementWhichIsNotCurrentTileUsurper

```solidity
error TileCaptureCannotBeCancelledBySettlementWhichIsNotCurrentTileUsurper()
```

Thrown when attempting to cancel tile capture by settlement which is not currently capturing specified tile





### CapturedTileCannotBeGivenUpByNonSettlementOwner

```solidity
error CapturedTileCannotBeGivenUpByNonSettlementOwner()
```

Thrown when attempting to give up captured tile by settlement which is not owner of specified tile





### ClaimTileCaptureCannotBeDoneByNonUsurperSettlement

```solidity
error ClaimTileCaptureCannotBeDoneByNonUsurperSettlement()
```

Thrown when attempting to claim captured tile by settlement which was not capturing specified tile





### ClaimTileCaptureCannotBeDoneAtThisTime

```solidity
error ClaimTileCaptureCannotBeDoneAtThisTime()
```

Thrown when attempting to claim captured tile at this time (it is still capturing)





### ClaimTileCaptureCannotBeDoneWithoutNecessaryProsperity

```solidity
error ClaimTileCaptureCannotBeDoneWithoutNecessaryProsperity()
```

Thrown when attempting to claim captured tile without necessary prosperity in settlement





### UnknownTileBonus

```solidity
error UnknownTileBonus()
```

Thrown when attempting to apply or remove tile bonus. It should not be thrown ever, if it does this will indicate logic error





### beginTileCapture

```solidity
function beginTileCapture(address settlementAddress, uint64 position, uint256 prosperityStake) external
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
function cancelTileCapture(address settlementAddress, uint64 position) external
```

Cancels tile capturing

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| position | uint64 | Position |



### giveUpCapturedTile

```solidity
function giveUpCapturedTile(address settlementAddress, uint64 position) external
```

Gives up captured tile

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| position | uint64 | Position |



### claimTileCapture

```solidity
function claimTileCapture(address settlementAddress, uint64 position) external
```

Claims captured tile

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| position | uint64 | Position |



### getCapturedTilesBySettlementAddress

```solidity
function getCapturedTilesBySettlementAddress(address settlementAddress, uint8 tileBonusType) external view returns (uint64[] positions)
```

Returns positions of captured tiles for provided settlement address

_Returns only claimed tiles_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| tileBonusType | uint8 | Tile bonus type |

| Name | Type | Description |
| ---- | ---- | ----------- |
| positions | uint64[] | Positions of captured tiles |


### handleSettlementCreatedOnPosition

```solidity
function handleSettlementCreatedOnPosition(uint64 position) external
```

New settlement handler

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |



