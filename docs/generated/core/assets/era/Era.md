## Era








### regions

```solidity
mapping(uint64 => contract IRegion) regions
```

Mapping containing activated regions by provided region id

_Updated when #activateRegion is called_




### settlementByPosition

```solidity
mapping(uint64 => contract ISettlement) settlementByPosition
```

Mapping containing settlement by provided position

_Updated when new settlement is created_




### settlementByBannerId

```solidity
mapping(uint256 => contract ISettlement) settlementByBannerId
```

Mapping containing settlement address by provided banner id

_Updated when #addUserSettlement is called_




### totalCultists

```solidity
uint256 totalCultists
```

Total cultists

_Updated when #increaseTotalCultists or #decreaseTotalCultists is called_




### creationTime

```solidity
uint256 creationTime
```

Era creation time

_Immutable, initialized on creation_




### workers

```solidity
contract IWorkers workers
```

Workers token

_Updated when #setWorkersContract is called_




### prosperity

```solidity
contract IProsperity prosperity
```

Prosperity token

_Updated when #setProsperityContract is called_




### resources

```solidity
mapping(bytes32 => contract IResource) resources
```

Mapping containing game resources by resource type id

_Updated when #addResource is called_




### units

```solidity
mapping(bytes32 => contract IUnits) units
```

Mapping containing units by unit type id

_Updated when #addUnit is called_




### tileCapturingSystem

```solidity
contract ITileCapturingSystem tileCapturingSystem
```

Tile capturing system

_Updated when #setTileCapturingSystemContract is called_




### init

```solidity
function init(bytes initParams) public
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### activateRegion

```solidity
function activateRegion(uint64 regionId) public
```

Activates region

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionId | uint64 | Region id |



### restoreUserSettlement

```solidity
function restoreUserSettlement(uint64 position) public
```

Restores settlement from previous era by provided position

_Any address can restore user settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |



### createUserSettlement

```solidity
function createUserSettlement(uint64 position, uint64 regionId, uint256 bannerId) public returns (address)
```

Creates user settlement

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |
| regionId | uint64 | Region id to which position belongs |
| bannerId | uint256 | Banners token id which will represent to which settlement will be attached to |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### createSettlementByType

```solidity
function createSettlementByType(uint256 bannerId, uint64 position, uint64 regionId, bytes32 assetTypeId) public returns (address)
```

Creates settlement by type

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| bannerId | uint256 | Banners token id which will represent to which settlement will be attached to |
| position | uint64 | Position |
| regionId | uint64 | Region id to which position belongs |
| assetTypeId | bytes32 | Asset type id |



### increaseTotalCultists

```solidity
function increaseTotalCultists(uint256 value) public
```

Increases total cultists

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 | Amount of cultists minted |



### decreaseTotalCultists

```solidity
function decreaseTotalCultists(uint256 value) public
```

Decreases total cultists

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 | Amount of cultists burned |



### _hasSettlementInRadius

```solidity
function _hasSettlementInRadius(contract IGeography geography, contract ICrossErasMemory crossErasMemory, uint64 position, uint256 radius) internal view returns (bool)
```



_Calculates does any settlement exists in provided radius_




### _hasSettlementInRingRadius

```solidity
function _hasSettlementInRingRadius(contract IGeography geography, contract ICrossErasMemory crossErasMemory, uint64 position, uint256 radius) internal view returns (bool)
```



_Calculates does any settlement exists in provided ring radius_




### _addUserSettlement

```solidity
function _addUserSettlement(contract ICrossErasMemory crossErasMemory, address settlementAddress, bool isNewSettlement) internal
```



_Adds user settlement_




### _placeSettlementOnMap

```solidity
function _placeSettlementOnMap(contract ICrossErasMemory crossErasMemory, address settlementAddress) internal
```



_Places settlement on map_




