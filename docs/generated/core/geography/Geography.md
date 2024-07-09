## Geography








### packedGameTileMap

```solidity
mapping(uint32 => uint256) packedGameTileMap
```

Mapping containing packed tiles by specified slot number

_Each returned element is is packed GameTile structures (8 per slot). Updated when zone is created_




### zonesActivationParams

```solidity
struct IGeography.ZoneActivationParams[] zonesActivationParams
```

Array containing zones activation params

_Value accessible via #getZoneActivationParams_




### onlyMightyCreator

```solidity
modifier onlyMightyCreator()
```



_Allows caller to be only mighty creator_




### init

```solidity
function init(address worldAddress) public
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### getZonesLength

```solidity
function getZonesLength() public view returns (uint256)
```

Returns created zones length

_Updated when #createZone is called_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### createZone

```solidity
function createZone(uint32[] positions, uint16[] tileTypes, uint256 occultistsCoordinateIndex) public
```

Creates zone with provided positions and tile types

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| positions | uint32[] | Zone positions |
| tileTypes | uint16[] | Zone tile types |
| occultistsCoordinateIndex | uint256 | Coordinate index inside 'positions', where occultists will be placed |



### isPathValid

```solidity
function isPathValid(uint32[] path) public view returns (bool)
```

Validates provided path

_Useful for determining positions path according to current hex grid_

| Name | Type | Description |
| ---- | ---- | ----------- |
| path | uint32[] | Path |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### isNeighborTo

```solidity
function isNeighborTo(uint32 position, uint32 neighbor) public pure returns (bool)
```

Calculates if provided position are neighbor to other position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Provided position |
| neighbor | uint32 | Other position |



### getGameTile

```solidity
function getGameTile(uint32 position) public view returns (struct IGeography.GameTile)
```

Calculates gameTile structure from provided position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Provided position |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IGeography.GameTile |  |


### getZoneActivationParams

```solidity
function getZoneActivationParams(uint256 index) public view returns (struct IGeography.ZoneActivationParams)
```

Returns zone activation params for provided zone index

_New values are accessible when #createZone is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| index | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IGeography.ZoneActivationParams |  |


### getNeighborPositions

```solidity
function getNeighborPositions(uint32 position) public pure returns (uint32[])
```

Calculates all neighbor positions by provided position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint32[] |  |


### isVoidSpot

```solidity
function isVoidSpot(uint32 position) internal view returns (bool)
```



_Checks if provided position is 'void'_




### setGameTile

```solidity
function setGameTile(uint32 position, struct IGeography.GameTile gameTile) internal
```



_Sets gameTile by provided position_




### isEven

```solidity
function isEven(uint16 x, uint16) internal pure returns (bool)
```



_Calculates is provided coordinates are 'even' for current hex variant implementation_




### countTrueValues

```solidity
function countTrueValues(bool[] array) internal pure returns (uint256)
```



_Count how much true values are in bool array_




### getPosition

```solidity
function getPosition(uint16 x, uint16 y) internal pure returns (uint32)
```



_Calculates position by coordinates_




### getCoordinates

```solidity
function getCoordinates(uint32 position) internal pure returns (uint16, uint16)
```



_Calculates coordinates by position_




### getPackedTile

```solidity
function getPackedTile(struct IGeography.GameTile gameTile) internal pure returns (uint32)
```



_Packs gameTile struct into 32 bit value_




### getUnpackedTile

```solidity
function getUnpackedTile(uint32 gameTile) internal pure returns (struct IGeography.GameTile)
```



_Unpacks gameTile struct from 32 bit value_




## Geography








### packedGameTileMap

```solidity
mapping(uint32 => uint256) packedGameTileMap
```

Mapping containing packed tiles by specified slot number

_Each returned element is is packed GameTile structures (8 per slot). Updated when zone is created_




### zonesActivationParams

```solidity
struct IGeography.ZoneActivationParams[] zonesActivationParams
```

Array containing zones activation params

_Value accessible via #getZoneActivationParams_




### onlyMightyCreator

```solidity
modifier onlyMightyCreator()
```



_Allows caller to be only mighty creator_




### init

```solidity
function init(address worldAddress) public
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### getZonesLength

```solidity
function getZonesLength() public view returns (uint256)
```

Returns created zones length

_Updated when #createZone is called_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### createZone

```solidity
function createZone(uint32[] positions, uint16[] tileTypes, uint256 occultistsCoordinateIndex) public
```

Creates zone with provided positions and tile types

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| positions | uint32[] | Zone positions |
| tileTypes | uint16[] | Zone tile types |
| occultistsCoordinateIndex | uint256 | Coordinate index inside 'positions', where occultists will be placed |



### isPathValid

```solidity
function isPathValid(uint32[] path) public view returns (bool)
```

Validates provided path

_Useful for determining positions path according to current hex grid_

| Name | Type | Description |
| ---- | ---- | ----------- |
| path | uint32[] | Path |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### isNeighborTo

```solidity
function isNeighborTo(uint32 position, uint32 neighbor) public pure returns (bool)
```

Calculates if provided position are neighbor to other position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Provided position |
| neighbor | uint32 | Other position |



### getGameTile

```solidity
function getGameTile(uint32 position) public view returns (struct IGeography.GameTile)
```

Calculates gameTile structure from provided position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Provided position |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IGeography.GameTile |  |


### getZoneActivationParams

```solidity
function getZoneActivationParams(uint256 index) public view returns (struct IGeography.ZoneActivationParams)
```

Returns zone activation params for provided zone index

_New values are accessible when #createZone is called_

| Name | Type | Description |
| ---- | ---- | ----------- |
| index | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IGeography.ZoneActivationParams |  |


### getNeighborPositions

```solidity
function getNeighborPositions(uint32 position) public pure returns (uint32[])
```

Calculates all neighbor positions by provided position


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint32[] |  |


### isVoidSpot

```solidity
function isVoidSpot(uint32 position) internal view returns (bool)
```



_Checks if provided position is 'void'_




### setGameTile

```solidity
function setGameTile(uint32 position, struct IGeography.GameTile gameTile) internal
```



_Sets gameTile by provided position_




### isEven

```solidity
function isEven(uint16 x, uint16) internal pure returns (bool)
```



_Calculates is provided coordinates are 'even' for current hex variant implementation_




### countTrueValues

```solidity
function countTrueValues(bool[] array) internal pure returns (uint256)
```



_Count how much true values are in bool array_




### getPosition

```solidity
function getPosition(uint16 x, uint16 y) internal pure returns (uint32)
```



_Calculates position by coordinates_




### getCoordinates

```solidity
function getCoordinates(uint32 position) internal pure returns (uint16, uint16)
```



_Calculates coordinates by position_




### getPackedTile

```solidity
function getPackedTile(struct IGeography.GameTile gameTile) internal pure returns (uint32)
```



_Packs gameTile struct into 32 bit value_




### getUnpackedTile

```solidity
function getUnpackedTile(uint32 gameTile) internal pure returns (struct IGeography.GameTile)
```



_Unpacks gameTile struct from 32 bit value_




