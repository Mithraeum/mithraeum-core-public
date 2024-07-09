## IGeography








### TileType








```solidity
enum TileType {
  VOID,
  SAND,
  ROAD,
  GRASS,
  SWAMP,
  WATER
}
```

### GameTile








```solidity
struct GameTile {
  uint16 zoneId;
  uint16 tileType;
}
```

### ZoneActivationParams








```solidity
struct ZoneActivationParams {
  uint32 occultistsPosition;
}
```

### NewZoneCreated

```solidity
event NewZoneCreated(uint256 zoneIndex, uint32[] positions, uint16[] tileTypes, uint256 occultistsPosition)
```

Emitted when #_createZone is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneIndex | uint256 | Zone index |
| positions | uint32[] | Positions |
| tileTypes | uint16[] | Tile types |
| occultistsPosition | uint256 | Occultists position |



### packedGameTileMap

```solidity
function packedGameTileMap(uint32 slotNumber) external view returns (uint256)
```

Mapping containing packed tiles by specified slot number

_Each returned element is is packed GameTile structures (8 per slot). Updated when zone is created_




### init

```solidity
function init(address worldAddress) external
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### getZonesLength

```solidity
function getZonesLength() external view returns (uint256 zonesLength)
```

Returns created zones length

_Updated when #createZone is called_


| Name | Type | Description |
| ---- | ---- | ----------- |
| zonesLength | uint256 | Zones length |


### isPathValid

```solidity
function isPathValid(uint32[] path) external view returns (bool isValid)
```

Validates provided path

_Useful for determining positions path according to current hex grid_

| Name | Type | Description |
| ---- | ---- | ----------- |
| path | uint32[] | Path |

| Name | Type | Description |
| ---- | ---- | ----------- |
| isValid | bool | Is path valid |


### isNeighborTo

```solidity
function isNeighborTo(uint32 position, uint32 neighbor) external pure returns (bool isNeighbor)
```

Calculates if provided position are neighbor to other position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Provided position |
| neighbor | uint32 | Other position |



### getGameTile

```solidity
function getGameTile(uint32 position) external view returns (struct IGeography.GameTile gameTile)
```

Calculates gameTile structure from provided position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Provided position |

| Name | Type | Description |
| ---- | ---- | ----------- |
| gameTile | struct IGeography.GameTile | Game tile struct |


### getNeighborPositions

```solidity
function getNeighborPositions(uint32 position) external pure returns (uint32[] neighbors)
```

Calculates all neighbor positions by provided position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |

| Name | Type | Description |
| ---- | ---- | ----------- |
| neighbors | uint32[] | Neighbors positions |


### createZone

```solidity
function createZone(uint32[] positions, uint16[] tileTypes, uint256 occultistsCoordinateIndex) external
```

Creates zone with provided positions and tile types

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| positions | uint32[] | Zone positions |
| tileTypes | uint16[] | Zone tile types |
| occultistsCoordinateIndex | uint256 | Coordinate index inside 'positions', where occultists will be placed |



### getZoneActivationParams

```solidity
function getZoneActivationParams(uint256 zoneIndex) external view returns (struct IGeography.ZoneActivationParams params)
```

Returns zone activation params for provided zone index

_New values are accessible when #createZone is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneIndex | uint256 | Zone index |

| Name | Type | Description |
| ---- | ---- | ----------- |
| params | struct IGeography.ZoneActivationParams | Zone activation params struct |


## IGeography








### TileType








```solidity
enum TileType {
  VOID,
  SAND,
  ROAD,
  GRASS,
  SWAMP,
  WATER
}
```

### GameTile








```solidity
struct GameTile {
  uint16 zoneId;
  uint16 tileType;
}
```

### ZoneActivationParams








```solidity
struct ZoneActivationParams {
  uint32 occultistsPosition;
}
```

### NewZoneCreated

```solidity
event NewZoneCreated(uint256 zoneIndex, uint32[] positions, uint16[] tileTypes, uint256 occultistsPosition)
```

Emitted when #_createZone is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneIndex | uint256 | Zone index |
| positions | uint32[] | Positions |
| tileTypes | uint16[] | Tile types |
| occultistsPosition | uint256 | Occultists position |



### packedGameTileMap

```solidity
function packedGameTileMap(uint32 slotNumber) external view returns (uint256)
```

Mapping containing packed tiles by specified slot number

_Each returned element is is packed GameTile structures (8 per slot). Updated when zone is created_




### init

```solidity
function init(address worldAddress) external
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### getZonesLength

```solidity
function getZonesLength() external view returns (uint256 zonesLength)
```

Returns created zones length

_Updated when #createZone is called_


| Name | Type | Description |
| ---- | ---- | ----------- |
| zonesLength | uint256 | Zones length |


### isPathValid

```solidity
function isPathValid(uint32[] path) external view returns (bool isValid)
```

Validates provided path

_Useful for determining positions path according to current hex grid_

| Name | Type | Description |
| ---- | ---- | ----------- |
| path | uint32[] | Path |

| Name | Type | Description |
| ---- | ---- | ----------- |
| isValid | bool | Is path valid |


### isNeighborTo

```solidity
function isNeighborTo(uint32 position, uint32 neighbor) external pure returns (bool isNeighbor)
```

Calculates if provided position are neighbor to other position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Provided position |
| neighbor | uint32 | Other position |



### getGameTile

```solidity
function getGameTile(uint32 position) external view returns (struct IGeography.GameTile gameTile)
```

Calculates gameTile structure from provided position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Provided position |

| Name | Type | Description |
| ---- | ---- | ----------- |
| gameTile | struct IGeography.GameTile | Game tile struct |


### getNeighborPositions

```solidity
function getNeighborPositions(uint32 position) external pure returns (uint32[] neighbors)
```

Calculates all neighbor positions by provided position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |

| Name | Type | Description |
| ---- | ---- | ----------- |
| neighbors | uint32[] | Neighbors positions |


### createZone

```solidity
function createZone(uint32[] positions, uint16[] tileTypes, uint256 occultistsCoordinateIndex) external
```

Creates zone with provided positions and tile types

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| positions | uint32[] | Zone positions |
| tileTypes | uint16[] | Zone tile types |
| occultistsCoordinateIndex | uint256 | Coordinate index inside 'positions', where occultists will be placed |



### getZoneActivationParams

```solidity
function getZoneActivationParams(uint256 zoneIndex) external view returns (struct IGeography.ZoneActivationParams params)
```

Returns zone activation params for provided zone index

_New values are accessible when #createZone is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneIndex | uint256 | Zone index |

| Name | Type | Description |
| ---- | ---- | ----------- |
| params | struct IGeography.ZoneActivationParams | Zone activation params struct |


