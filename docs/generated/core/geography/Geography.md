## Geography








### init

```solidity
function init(address worldAddress) public
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### getRegionOwner

```solidity
function getRegionOwner(uint64 regionId) public view returns (address)
```

Returns region owner

_Updated when #includeRegion is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionId | uint64 | Region id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### getRegionTier

```solidity
function getRegionTier(uint64 regionId) public view returns (uint256)
```

Returns region tier

_Updated when #includeRegion is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionId | uint64 | Region id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getRegionsCount

```solidity
function getRegionsCount() public view returns (uint256)
```

Returns created regions count

_Updated when #includeRegion is called_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### includeRegion

```solidity
function includeRegion(uint64 newRegionPosition, uint64 neighborRegionPosition) public payable
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
function isRegionIncluded(uint64 regionId) public view returns (bool)
```

Checks if region is included to the game

_Used to determine whether region can be activated or not_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionId | uint64 | Region id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### getTileBonus

```solidity
function getTileBonus(bytes32 tileBonusesSeed, uint256 chanceForTileWithBonus, uint64 position) public pure returns (struct IGeography.TileBonus)
```

Returns tile bonus by provided position


| Name | Type | Description |
| ---- | ---- | ----------- |
| tileBonusesSeed | bytes32 | Tile bonuses seed |
| chanceForTileWithBonus | uint256 | Chance for tile with bonus (in 1e18 precision) |
| position | uint64 | Position |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IGeography.TileBonus |  |


### getRegionIdByPosition

```solidity
function getRegionIdByPosition(uint64 position) public view returns (uint64, bool)
```

Returns region id by position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Provided position |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint64 |  |
| [1] | bool |  |


### getRingPositions

```solidity
function getRingPositions(uint64 position, uint256 radius) public pure returns (uint64[], uint256)
```

Calculates all ring positions by provided position and radius


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |
| radius | uint256 | Ring radius |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint64[] |  |
| [1] | uint256 |  |


### getDistanceBetweenPositions

```solidity
function getDistanceBetweenPositions(uint64 position1, uint64 position2) public pure returns (uint64)
```

Calculates distance between positions


| Name | Type | Description |
| ---- | ---- | ----------- |
| position1 | uint64 | First position |
| position2 | uint64 | Second position |



### _isPositionInBounds

```solidity
function _isPositionInBounds(struct GeographyUtils.Oddq oddq) internal pure returns (bool)
```



_Checks if provided position is in game bounds_




### _getNeighborPosition

```solidity
function _getNeighborPosition(struct GeographyUtils.Oddq oddq, uint256 direction) internal pure returns (struct GeographyUtils.Oddq)
```



_Calculates neighbor position of position according to provided direction_




### _areNeighbors

```solidity
function _areNeighbors(uint64 position1, uint64 position2) internal pure returns (bool)
```



_Checks if positions are neighbors_




### _generateRegionTier

```solidity
function _generateRegionTier(uint64 regionId) internal view returns (uint256)
```



_Generates region tier by region id_




