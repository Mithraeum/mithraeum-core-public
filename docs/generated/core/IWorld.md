## IWorld


Functions to read state/modify state of game world





### registry

```solidity
function registry() external view returns (contract IRegistry)
```

Registry

_Immutable, initialized on creation_




### bannerContract

```solidity
function bannerContract() external view returns (contract IERC721)
```

Banners token

_Immutable, initialized on creation_




### erc20ForSettlementPurchase

```solidity
function erc20ForSettlementPurchase() external view returns (contract IERC20)
```

ERC20 token for settlement purchase

_Immutable, initialized on creation_




### erc20ForRegionInclusion

```solidity
function erc20ForRegionInclusion() external view returns (contract IERC20)
```

ERC20 token for region inclusion

_Immutable, initialized on creation_




### regionOwnershipToken

```solidity
function regionOwnershipToken() external view returns (contract IRegionOwnershipToken)
```

Region ownership token

_Immutable, initialized on creation_




### distributions

```solidity
function distributions() external view returns (contract IDistributions)
```

Distributions token

_Immutable, initialized on creation_




### crossErasMemory

```solidity
function crossErasMemory() external view returns (contract ICrossErasMemory)
```

Cross eras memory

_Immutable, initialized on creation_




### rewardPool

```solidity
function rewardPool() external view returns (contract IRewardPool)
```

Reward pool

_Immutable, initialized on creation_




### gameBeginTime

```solidity
function gameBeginTime() external view returns (uint256)
```

Game begin time

_Updated when #setGameBeginTime is called_




### gameEndTime

```solidity
function gameEndTime() external view returns (uint256)
```

Game end time

_Updated when #setGameEndTime is called_




### geography

```solidity
function geography() external view returns (contract IGeography)
```

Geography

_Immutable, initialized on creation_




### currentEraNumber

```solidity
function currentEraNumber() external view returns (uint256)
```

Current world era

_Updated when #destroy is called_




### eras

```solidity
function eras(uint256 eraNumber) external view returns (contract IEra)
```

World eras

_Updated when world initialized or #destroy is called_




### implementations

```solidity
function implementations(bytes28 assetId) external view returns (address)
```

Mapping containing assets implementations addresses by provided asset id

_Updated when #setImplementations is called
Every worlds assets implementation (code, not data) will be defined by value from this mapping_




### worldAssets

```solidity
function worldAssets(uint256 eraNumber, address worldAsset) external view returns (bytes32)
```

Mapping containing world asset type by provided era number and address

_Updated when #addWorldAsset is called_




### WorldInitialized

```solidity
event WorldInitialized(address registryAddress, address crossErasMemoryAddress, address geographyAddress, address bannersAddress, address erc20ForBuyingSettlementAddress, address erc20ForRegionInclusionAddress, address regionOwnershipTokenAddress, address distributionsAddress, address rewardPoolAddress)
```

Emitted when world initialized


| Name | Type | Description |
| ---- | ---- | ----------- |
| registryAddress | address | Registry contract address |
| crossErasMemoryAddress | address | Cross eras memory address |
| geographyAddress | address | Geography contract address |
| bannersAddress | address | Banners contract address |
| erc20ForBuyingSettlementAddress | address | ERC20 token for settlement purchase address |
| erc20ForRegionInclusionAddress | address | ERC20 token for region inclusion address |
| regionOwnershipTokenAddress | address | Region ownership token address |
| distributionsAddress | address | Distributions token address |
| rewardPoolAddress | address | Reward pool contract address |



### GameBeginTimeUpdated

```solidity
event GameBeginTimeUpdated(uint256 newBeginTime)
```

Emitted when #setGameBeginTime is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| newBeginTime | uint256 | New game begin time |



### GameEndTimeUpdated

```solidity
event GameEndTimeUpdated(uint256 newEndTime)
```

Emitted when #setGameEndTime is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| newEndTime | uint256 | New game end time |



### EraCreated

```solidity
event EraCreated(address newEraAddress, uint256 newEraNumber)
```

Emitted when world initialized or #destroyCurrentEra is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| newEraAddress | address | New era address |
| newEraNumber | uint256 | New era number |



### CurrentEraNumberUpdated

```solidity
event CurrentEraNumberUpdated(uint256 newEraNumber)
```

Emitted after new era initialization


| Name | Type | Description |
| ---- | ---- | ----------- |
| newEraNumber | uint256 | New era number |



### OnlyActiveGame

```solidity
error OnlyActiveGame()
```

Thrown when attempting to call action which can only be called in active game (started and not finished)





### OnlyMightyCreator

```solidity
error OnlyMightyCreator()
```

Thrown when attempting to call action which can only be called by mighty creator





### OnlyMightyCreatorOrRewardPool

```solidity
error OnlyMightyCreatorOrRewardPool()
```

Thrown when attempting to call action which can only be called by mighty creator or reward pool





### OnlyFactory

```solidity
error OnlyFactory()
```

Thrown when attempting to call action which can only be called by world asset factory





### CurrentEraCannotBeDestroyedDueToCultistsNoDestructionDelayNotPassed

```solidity
error CurrentEraCannotBeDestroyedDueToCultistsNoDestructionDelayNotPassed()
```

Thrown when attempting to destroy current era while cultists destruction delay not passed since last cultists summon





### CurrentEraCannotBeDestroyedDueCultistsLimitNotReached

```solidity
error CurrentEraCannotBeDestroyedDueCultistsLimitNotReached()
```

Thrown when attempting to destroy current era while cultists limit not reached





### init

```solidity
function init(bytes packedAddresses, bytes28[] assetIds, address[] implementationAddresses) external
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| packedAddresses | bytes | Packed addresses (registry, crossErasMemory, geography, banners, erc20ForSettlementPurchase, erc20ForRegionInclusion, regionOwnershipToken, distributions, rewardPool) |
| assetIds | bytes28[] | Asset ids |
| implementationAddresses | address[] | Implementation addresses |



### addWorldAsset

```solidity
function addWorldAsset(uint256 eraNumber, address worldAssetAddress, bytes32 assetType) external
```

Adds an address as world asset

_Even though function is opened, it can only be called by factory contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| eraNumber | uint256 | Era number |
| worldAssetAddress | address | World asset address |
| assetType | bytes32 | Asset type |



### setImplementations

```solidity
function setImplementations(bytes28[] assetIds, address[] implementationAddresses) external
```

Sets provided address as implementation for provided asset ids

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| assetIds | bytes28[] | Asset ids |
| implementationAddresses | address[] | Implementation addresses |



### mintWorkers

```solidity
function mintWorkers(uint256 eraNumber, address to, uint256 value) external
```

Mints workers to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| eraNumber | uint256 | Era number |
| to | address | Address which will receive workers |
| value | uint256 | Amount of workers to mint |



### mintUnits

```solidity
function mintUnits(uint256 eraNumber, bytes32 unitTypeId, address to, uint256 value) external
```

Mints units to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| eraNumber | uint256 | Era number |
| unitTypeId | bytes32 | Type id of unit to mint |
| to | address | Address which will receive units |
| value | uint256 | Amount of units to mint |



### mintResources

```solidity
function mintResources(uint256 eraNumber, bytes32 resourceTypeId, address to, uint256 value) external
```

Mints resource to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| eraNumber | uint256 | Era number |
| resourceTypeId | bytes32 | Resource type id |
| to | address | Address which will receive resources |
| value | uint256 | Amount of resources to mint |



### setGameEndTime

```solidity
function setGameEndTime(uint256 gameEndTime) external
```

Sets game end time

_Even though function is opened, it can only be called by mighty creator or reward pool_

| Name | Type | Description |
| ---- | ---- | ----------- |
| gameEndTime | uint256 | Game end time |



### setGameBeginTime

```solidity
function setGameBeginTime(uint256 gameBeginTime) external
```

Sets game begin time

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| gameBeginTime | uint256 | Game begin time |



### destroyCurrentEra

```solidity
function destroyCurrentEra() external
```

Destroys current era if conditions are met

_Anyone can call this function_




### getRegionRadius

```solidity
function getRegionRadius() external pure returns (uint64 regionRadius)
```

Returns region radius which is used to determine average region size

_Immutable_


| Name | Type | Description |
| ---- | ---- | ----------- |
| regionRadius | uint64 | Region radius |


### getRegionSeed

```solidity
function getRegionSeed() external pure returns (bytes32 regionSeed)
```

Returns region seed which is used to determine region ids for positions

_Immutable_


| Name | Type | Description |
| ---- | ---- | ----------- |
| regionSeed | bytes32 | Region seed |


### getTileBonusesSeed

```solidity
function getTileBonusesSeed() external pure returns (bytes32 tileBonusesSeed)
```

Returns tile bonuses seed

_Immutable_


| Name | Type | Description |
| ---- | ---- | ----------- |
| tileBonusesSeed | bytes32 | Tile bonuses seed |


### getRegionTierSeed

```solidity
function getRegionTierSeed() external view returns (bytes32 regionTierSeed)
```

Returns region tier seed

_Updated when era is changed_


| Name | Type | Description |
| ---- | ---- | ----------- |
| regionTierSeed | bytes32 | Region tier seed |


