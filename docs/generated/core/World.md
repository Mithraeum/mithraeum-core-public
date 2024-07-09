## World








### registry

```solidity
contract IRegistry registry
```

Registry

_Immutable, initialized on creation_




### geography

```solidity
contract IGeography geography
```

Geography

_Immutable, initialized on creation_




### bannerContract

```solidity
contract IERC721 bannerContract
```

Banners token

_Immutable, initialized on creation_




### erc20ForSettlementPurchase

```solidity
contract IERC20 erc20ForSettlementPurchase
```

ERC20 token for settlement purchase

_Immutable, initialized on creation_




### erc20ForRegionInclusion

```solidity
contract IERC20 erc20ForRegionInclusion
```

ERC20 token for region inclusion

_Immutable, initialized on creation_




### regionOwnershipToken

```solidity
contract IRegionOwnershipToken regionOwnershipToken
```

Region ownership token

_Immutable, initialized on creation_




### distributions

```solidity
contract IDistributions distributions
```

Distributions token

_Immutable, initialized on creation_




### crossErasMemory

```solidity
contract ICrossErasMemory crossErasMemory
```

Cross eras memory

_Immutable, initialized on creation_




### rewardPool

```solidity
contract IRewardPool rewardPool
```

Reward pool

_Immutable, initialized on creation_




### gameBeginTime

```solidity
uint256 gameBeginTime
```

Game begin time

_Updated when #setGameBeginTime is called_




### gameEndTime

```solidity
uint256 gameEndTime
```

Game end time

_Updated when #setGameEndTime is called_




### currentEraNumber

```solidity
uint256 currentEraNumber
```

Current world era

_Updated when #destroy is called_




### eras

```solidity
mapping(uint256 => contract IEra) eras
```

World eras

_Updated when world initialized or #destroy is called_




### implementations

```solidity
mapping(bytes28 => address) implementations
```

Mapping containing assets implementations addresses by provided asset id

_Updated when #setImplementations is called
Every worlds assets implementation (code, not data) will be defined by value from this mapping_




### worldAssets

```solidity
mapping(uint256 => mapping(address => bytes32)) worldAssets
```

Mapping containing world asset type by provided era number and address

_Updated when #addWorldAsset is called_




### onlyActiveGame

```solidity
modifier onlyActiveGame()
```



_Only active game modifier
Modifier is calling internal function in order to reduce contract size_




### onlyMightyCreatorOrRewardPool

```solidity
modifier onlyMightyCreatorOrRewardPool()
```



_Only mighty creator or reward pool modifier
Modifier is calling internal function in order to reduce contract size_




### onlyMightyCreator

```solidity
modifier onlyMightyCreator()
```



_Only mighty creator modifier
Modifier is calling internal function in order to reduce contract size_




### onlyFactory

```solidity
modifier onlyFactory()
```



_Only factory modifier
Modifier is calling internal function in order to reduce contract size_




### init

```solidity
function init(bytes packedAddresses, bytes28[] assetIds, address[] implementationAddresses) public
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
function addWorldAsset(uint256 eraNumber, address worldAsset, bytes32 assetType) public
```

Adds an address as world asset

_Even though function is opened, it can only be called by factory contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| eraNumber | uint256 | Era number |
| worldAsset | address |  |
| assetType | bytes32 | Asset type |



### setImplementations

```solidity
function setImplementations(bytes28[] assetIds, address[] implementationAddresses) public
```

Sets provided address as implementation for provided asset ids

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| assetIds | bytes28[] | Asset ids |
| implementationAddresses | address[] | Implementation addresses |



### setGameBeginTime

```solidity
function setGameBeginTime(uint256 value) public
```

Sets game begin time

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 |  |



### setGameEndTime

```solidity
function setGameEndTime(uint256 value) public
```

Sets game end time

_Even though function is opened, it can only be called by mighty creator or reward pool_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 |  |



### mintWorkers

```solidity
function mintWorkers(uint256 eraNumber, address _to, uint256 _value) public
```

Mints workers to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| eraNumber | uint256 | Era number |
| _to | address |  |
| _value | uint256 |  |



### mintUnits

```solidity
function mintUnits(uint256 eraNumber, bytes32 unitTypeId, address to, uint256 value) public
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
function mintResources(uint256 eraNumber, bytes32 resourceTypeId, address to, uint256 value) public
```

Mints resource to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| eraNumber | uint256 | Era number |
| resourceTypeId | bytes32 | Resource type id |
| to | address | Address which will receive resources |
| value | uint256 | Amount of resources to mint |



### destroyCurrentEra

```solidity
function destroyCurrentEra() public
```

Destroys current era if conditions are met

_Anyone can call this function_




### destroyCurrentEraWithoutCondition

```solidity
function destroyCurrentEraWithoutCondition() public
```

TODO FOR TESTS REMOVE AFTER





### getRegionRadius

```solidity
function getRegionRadius() public pure returns (uint64)
```

Returns region radius which is used to determine average region size

_Immutable_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint64 |  |


### getRegionSeed

```solidity
function getRegionSeed() public pure returns (bytes32)
```

Returns region seed which is used to determine region ids for positions

_Immutable_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 |  |


### getTileBonusesSeed

```solidity
function getTileBonusesSeed() public pure returns (bytes32)
```

Returns tile bonuses seed

_Immutable_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 |  |


### getRegionTierSeed

```solidity
function getRegionTierSeed() public view returns (bytes32)
```

Returns region tier seed

_Updated when era is changed_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 |  |


### _onlyActiveGame

```solidity
function _onlyActiveGame() internal view
```



_Allows function to be callable only while game is active (block.timestamp in [beginTime, endTime) or [beginTime, inf)_




### _onlyMightyCreatorOrRewardPool

```solidity
function _onlyMightyCreatorOrRewardPool() internal view
```



_Allows caller to be only mighty creator or reward pool_




### _onlyMightyCreator

```solidity
function _onlyMightyCreator() internal view
```



_Allows caller to be only mighty creator_




### _onlyFactory

```solidity
function _onlyFactory() internal view
```



_Allows caller to be only factory contract_




### _createEra

```solidity
function _createEra(uint256 eraNumber) internal returns (contract IEra)
```



_Creates era_




### _createAndAssignEra

```solidity
function _createAndAssignEra(uint256 eraNumber) internal
```



_Create and assign era_




### _setCurrentEraNumber

```solidity
function _setCurrentEraNumber(uint256 newEraNumber) internal
```



_Sets current era number_




