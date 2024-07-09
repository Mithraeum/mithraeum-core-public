## IGeography








### TileBonusType








```solidity
enum TileBonusType {
  NO_BONUS,
  ADVANCED_PRODUCTION,
  ARMY_BATTLE_STATS
}
```

### TileBonus








```solidity
struct TileBonus {
  enum IGeography.TileBonusType tileBonusType;
  uint8 tileBonusVariation;
}
```

### RegionIncluded

```solidity
event RegionIncluded(uint64 regionId)
```

Emitted when #includeRegion is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| regionId | uint64 | Region id |



### FirstRegionCanOnlyBeIncludedByMightyCreator

```solidity
error FirstRegionCanOnlyBeIncludedByMightyCreator()
```

Thrown when attempting to include first region by non mighty creator address





### CannotIncludeRegionWithInvalidRegionInclusionProofProvided

```solidity
error CannotIncludeRegionWithInvalidRegionInclusionProofProvided()
```

Thrown when attempting to include region by providing invalid region inclusion proof





### CannotIncludeAlreadyIncludedRegion

```solidity
error CannotIncludeAlreadyIncludedRegion()
```

Thrown when attempting to include already included region





### CannotIncludeRegionDueToInsufficientValueSent

```solidity
error CannotIncludeRegionDueToInsufficientValueSent()
```

Thrown when attempting to include region with insufficient value sent (only if world.erc20ForRegionInclusion == address(0), which is equivalent of native token)





### CannotIncludeRegionDueToInsufficientUserSettlementsCountInNeighboringRegion

```solidity
error CannotIncludeRegionDueToInsufficientUserSettlementsCountInNeighboringRegion()
```

Thrown when attempting to include region with insufficient amount of user settlements in neighboring region





### InvalidNeighborDirectionSpecified

```solidity
error InvalidNeighborDirectionSpecified()
```

Thrown when attempting to _getNeighborPosition with invalid neighbor direction. It should not be thrown ever, if it does this will indicate logic error





### InvalidTileBonusConfiguration

```solidity
error InvalidTileBonusConfiguration()
```

Thrown when attempting to calculate tile bonus. It should not be thrown ever, if it does this will indicate logic error





### init

```solidity
function init(address worldAddress) external
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### getRegionOwner

```solidity
function getRegionOwner(uint64 regionId) external view returns (address regionOwner)
```

Returns region owner

_Updated when #includeRegion is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionId | uint64 | Region id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionOwner | address | Region owner |


### getRegionTier

```solidity
function getRegionTier(uint64 regionId) external view returns (uint256 regionTier)
```

Returns region tier

_Updated when #includeRegion is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionId | uint64 | Region id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionTier | uint256 | Region tier |


### getRegionsCount

```solidity
function getRegionsCount() external view returns (uint256 regionsCount)
```

Returns created regions count

_Updated when #includeRegion is called_


| Name | Type | Description |
| ---- | ---- | ----------- |
| regionsCount | uint256 | Regions count |


### includeRegion

```solidity
function includeRegion(uint64 newRegionPosition, uint64 neighborRegionPosition) external payable
```

Includes new region to the game

_In case if there is more than zero regions in the game caller must provide two neighboring positions: first for new region, second of already existing region
In case if zero included regions -> second param is ignored_

| Name | Type | Description |
| ---- | ---- | ----------- |
| newRegionPosition | uint64 | New region position |
| neighborRegionPosition | uint64 | Neighbor region position |



### isRegionIncluded

```solidity
function isRegionIncluded(uint64 regionId) external view returns (bool isRegionIncluded)
```

Checks if region is included to the game

_Used to determine whether region can be activated or not_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionId | uint64 | Region id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| isRegionIncluded | bool | Is region included |


### getRegionIdByPosition

```solidity
function getRegionIdByPosition(uint64 position) external view returns (uint64 regionId, bool isPositionExist)
```

Returns region id by position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Provided position |

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionId | uint64 | Region id |
| isPositionExist | bool | Is position exist (may not exist due to region cavities) |


### getRingPositions

```solidity
function getRingPositions(uint64 position, uint256 radius) external pure returns (uint64[] ringPositions, uint256 ringPositionsLength)
```

Calculates all ring positions by provided position and radius


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |
| radius | uint256 | Ring radius |

| Name | Type | Description |
| ---- | ---- | ----------- |
| ringPositions | uint64[] | Ring positions |
| ringPositionsLength | uint256 | Ring positions length (array is initialized 6 * radius, however not all values should be used) |


### getTileBonus

```solidity
function getTileBonus(bytes32 tileBonusesSeed, uint256 chanceForTileWithBonus, uint64 position) external pure returns (struct IGeography.TileBonus tileBonus)
```

Returns tile bonus by provided position


| Name | Type | Description |
| ---- | ---- | ----------- |
| tileBonusesSeed | bytes32 | Tile bonuses seed |
| chanceForTileWithBonus | uint256 | Chance for tile with bonus (in 1e18 precision) |
| position | uint64 | Position |

| Name | Type | Description |
| ---- | ---- | ----------- |
| tileBonus | struct IGeography.TileBonus | Tile bonus struct |


### getDistanceBetweenPositions

```solidity
function getDistanceBetweenPositions(uint64 position1, uint64 position2) external pure returns (uint64 distance)
```

Calculates distance between positions


| Name | Type | Description |
| ---- | ---- | ----------- |
| position1 | uint64 | First position |
| position2 | uint64 | Second position |



