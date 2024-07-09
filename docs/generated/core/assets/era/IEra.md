## IEra


Functions to read state/modify state in order to get current era parameters and/or interact with it





### regions

```solidity
function regions(uint64 regionId) external view returns (contract IRegion)
```

Mapping containing activated regions by provided region id

_Updated when #activateRegion is called_




### settlementByPosition

```solidity
function settlementByPosition(uint64 position) external view returns (contract ISettlement)
```

Mapping containing settlement by provided position

_Updated when new settlement is created_




### settlementByBannerId

```solidity
function settlementByBannerId(uint256 bannerId) external view returns (contract ISettlement)
```

Mapping containing settlement address by provided banner id

_Updated when #addUserSettlement is called_




### totalCultists

```solidity
function totalCultists() external view returns (uint256)
```

Total cultists

_Updated when #increaseTotalCultists or #decreaseTotalCultists is called_




### creationTime

```solidity
function creationTime() external view returns (uint256)
```

Era creation time

_Immutable, initialized on creation_




### workers

```solidity
function workers() external view returns (contract IWorkers)
```

Workers token

_Updated when #setWorkersContract is called_




### prosperity

```solidity
function prosperity() external view returns (contract IProsperity)
```

Prosperity token

_Updated when #setProsperityContract is called_




### resources

```solidity
function resources(bytes32 resourceTypeId) external view returns (contract IResource)
```

Mapping containing game resources by resource type id

_Updated when #addResource is called_




### units

```solidity
function units(bytes32 unitTypeId) external view returns (contract IUnits)
```

Mapping containing units by unit type id

_Updated when #addUnit is called_




### tileCapturingSystem

```solidity
function tileCapturingSystem() external view returns (contract ITileCapturingSystem)
```

Tile capturing system

_Updated when #setTileCapturingSystemContract is called_




### ResourceCreated

```solidity
event ResourceCreated(address resourceAddress, bytes32 resourceTypeId)
```

Emitted when era resource is created


| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceAddress | address | Resource address |
| resourceTypeId | bytes32 | Resource type id |



### UnitsCreated

```solidity
event UnitsCreated(address unitsAddress, bytes32 unitTypeId)
```

Emitted when era units is created


| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsAddress | address | Units address |
| unitTypeId | bytes32 | Unit type id |



### WorkersCreated

```solidity
event WorkersCreated(address workersAddress)
```

Emitted when era workers is created


| Name | Type | Description |
| ---- | ---- | ----------- |
| workersAddress | address | Workers address |



### ProsperityCreated

```solidity
event ProsperityCreated(address prosperityAddress)
```

Emitted when era prosperity is created


| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityAddress | address | Prosperity address |



### TileCapturingSystemCreated

```solidity
event TileCapturingSystemCreated(address tileCapturingSystemAddress)
```

Emitted when era tile capturing system is created


| Name | Type | Description |
| ---- | ---- | ----------- |
| tileCapturingSystemAddress | address | Tile capturing system address |



### RegionActivated

```solidity
event RegionActivated(address regionAddress, uint256 regionId)
```

Emitted when #activateRegion is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| regionAddress | address | Region address |
| regionId | uint256 | Region id |



### SettlementCreated

```solidity
event SettlementCreated(address settlementAddress, bytes32 assetTypeId, address regionAddress, uint64 position, uint256 bannerId)
```

Emitted when #newAssetSettlement is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Created settlement address |
| assetTypeId | bytes32 | Asset type id |
| regionAddress | address | Address of the region where settlement is created |
| position | uint64 | Position |
| bannerId | uint256 | Banner id |



### SettlementRestored

```solidity
event SettlementRestored(address settlementAddress, uint64 position)
```

Emitted when #restoreUserSettlement is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| position | uint64 | Position |



### TotalCultistsChanged

```solidity
event TotalCultistsChanged(uint256 newTotalCultists)
```

Emitted when #increaseTotalCultists or #decreaseTotalCultists is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| newTotalCultists | uint256 | New total cultists |



### EraCannotActivateRegionMoreThanOnce

```solidity
error EraCannotActivateRegionMoreThanOnce()
```

Thrown when attempting to activate region more than once





### EraCannotActivateNotIncludedRegion

```solidity
error EraCannotActivateNotIncludedRegion()
```

Thrown when attempting to activate region which is not included to the game





### UserSettlementCannotBeRestoredFromInactiveEra

```solidity
error UserSettlementCannotBeRestoredFromInactiveEra()
```

Thrown when attempting to restore user settlement from inactive era





### UserSettlementCannotBeRestoredIfItsRotten

```solidity
error UserSettlementCannotBeRestoredIfItsRotten()
```

Thrown when attempting to restore user settlement if it is rotten





### UserSettlementCannotBeCreatedOnPositionWithAnotherSettlement

```solidity
error UserSettlementCannotBeCreatedOnPositionWithAnotherSettlement()
```

Thrown when attempting to create user settlement on position with another settlement





### UserSettlementCannotBeCreatedOnPositionWhichIsToCloseToAnotherSettlement

```solidity
error UserSettlementCannotBeCreatedOnPositionWhichIsToCloseToAnotherSettlement()
```

Thrown when attempting to create user settlement on position which is to close to another settlement





### UserSettlementCannotBeCreatedIfBannerNftIdIsAlreadyTakenByAnotherSettlement

```solidity
error UserSettlementCannotBeCreatedIfBannerNftIdIsAlreadyTakenByAnotherSettlement()
```

Thrown when attempting to create user settlement with banner nft id which is already taken by another settlement





### UserSettlementCannotBeCreatedInInactiveEra

```solidity
error UserSettlementCannotBeCreatedInInactiveEra()
```

Thrown when attempting to create user settlement in inactive era





### UserSettlementCannotBeCreatedInRegionWithMaximumAllowedSettlements

```solidity
error UserSettlementCannotBeCreatedInRegionWithMaximumAllowedSettlements()
```

Thrown when attempting to create user settlement in region which already has maximum amount of allowed settlement





### UserSettlementCannotBeCreatedOnPositionWhichIsNotConnectedToAnotherSettlement

```solidity
error UserSettlementCannotBeCreatedOnPositionWhichIsNotConnectedToAnotherSettlement()
```

Thrown when attempting to create user settlement on position which is not connected to another settlement





### activateRegion

```solidity
function activateRegion(uint64 regionId) external
```

Activates region

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionId | uint64 | Region id |



### restoreUserSettlement

```solidity
function restoreUserSettlement(uint64 position) external
```

Restores settlement from previous era by provided position

_Any address can restore user settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |



### createUserSettlement

```solidity
function createUserSettlement(uint64 position, uint64 regionId, uint256 bannerId) external returns (address settlementAddress)
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
| settlementAddress | address | Settlement address |


### createSettlementByType

```solidity
function createSettlementByType(uint256 bannerId, uint64 position, uint64 regionId, bytes32 assetTypeId) external returns (address)
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
function increaseTotalCultists(uint256 value) external
```

Increases total cultists

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 | Amount of cultists minted |



### decreaseTotalCultists

```solidity
function decreaseTotalCultists(uint256 value) external
```

Decreases total cultists

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 | Amount of cultists burned |



