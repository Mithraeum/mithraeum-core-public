## IWorld


Functions to read state/modify state of game world





### WorldInitialized

```solidity
event WorldInitialized(address registryContractAddress, address geographyAddress, address bannersAddress, address blessTokenAddress, address distributionsAddress, address rewardPoolAddress)
```

Emitted when world initialized


| Name | Type | Description |
| ---- | ---- | ----------- |
| registryContractAddress | address | Registry contract address |
| geographyAddress | address | Geography contract address |
| bannersAddress | address | Mithraeum banners contract address |
| blessTokenAddress | address | Bless token address |
| distributionsAddress | address | Distributions token address |
| rewardPoolAddress | address | Reward pool address |



### GameStartTimeUpdated

```solidity
event GameStartTimeUpdated(uint256 timestamp)
```

Emitted when #setGameStartTime is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | New game start time |



### GameFinishTimeUpdated

```solidity
event GameFinishTimeUpdated(uint256 timestamp)
```

Emitted when #setGameFinishTime is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | New game finish time |



### NewWorldEpoch

```solidity
event NewWorldEpoch(address epochAddress, uint256 epochNumber)
```

Emitted when world initialized or #destroyCurrentEpoch is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| epochAddress | address | New epoch address |
| epochNumber | uint256 | New epoch number |



### CurrentEpochNumberUpdated

```solidity
event CurrentEpochNumberUpdated(uint256 epochNumber)
```

Emitted after new epoch initialization


| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | New epoch number |



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




### blessToken

```solidity
function blessToken() external view returns (contract IERC20)
```

Bless token

_Immutable, initialized on creation_




### distributions

```solidity
function distributions() external view returns (contract IDistributions)
```

Distributions token

_Immutable, initialized on creation_




### crossEpochsMemory

```solidity
function crossEpochsMemory() external view returns (contract ICrossEpochsMemory)
```

Cross epochs memory

_Immutable, initialized on creation_




### rewardPool

```solidity
function rewardPool() external view returns (contract IRewardPool)
```

Reward pool

_Immutable, initialized on creation_




### gameStartTime

```solidity
function gameStartTime() external view returns (uint256)
```

Game start time

_Updated when #setGameStartTime is called_




### gameFinishTime

```solidity
function gameFinishTime() external view returns (uint256)
```

Game finish time

_Updated when #setGameFinishTime is called_




### geography

```solidity
function geography() external view returns (contract IGeography)
```

Geography

_Immutable, initialized on creation_




### currentEpochNumber

```solidity
function currentEpochNumber() external view returns (uint256)
```

Current world epoch

_Updated when #destroy is called_




### epochs

```solidity
function epochs(uint256 epochNumber) external view returns (contract IEpoch)
```

World epochs

_Updated when world initialized or #destroy is called_




### worldAssets

```solidity
function worldAssets(uint256 epochNumber, address worldAsset) external view returns (bytes32)
```

Mapping containing world asset type by provided epoch number and address

_Updated when #addWorldAsset is called_




### init

```solidity
function init(address registryContractAddress, address crossEpochsMemoryAddress, address geographyAddress, address bannersAddress, address blessTokenAddress, address distributionsAddress, address rewardPoolAddress) external
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| registryContractAddress | address | Registry contract address |
| crossEpochsMemoryAddress | address | Cross epochs memory address |
| geographyAddress | address | Geography contract address |
| bannersAddress | address | Banners token address |
| blessTokenAddress | address | Bless token address |
| distributionsAddress | address | Distributions token address |
| rewardPoolAddress | address | Reward pool address |



### addWorldAsset

```solidity
function addWorldAsset(uint256 epochNumber, address worldAssetAddress, bytes32 assetType) external
```

Adds an address as world asset

_Even though function is opened, it can only be called by factory contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| worldAssetAddress | address | World asset address |
| assetType | bytes32 | Asset type |



### mintWorkers

```solidity
function mintWorkers(uint256 epochNumber, address to, uint256 value) external
```

Mints workers to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| to | address | Address which will receive workers |
| value | uint256 | Amount of workers to mint |



### mintUnits

```solidity
function mintUnits(uint256 epochNumber, string unitName, address to, uint256 value) external
```

Mints units to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| unitName | string | Type of unit to mint |
| to | address | Address which will receive units |
| value | uint256 | Amount of units to mint |



### mintResources

```solidity
function mintResources(uint256 epochNumber, string resourceName, address to, uint256 value) external
```

Mints resource to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| resourceName | string | Resource name |
| to | address | Address which will receive resources |
| value | uint256 | Amount of resources to mint |



### batchTransferResources

```solidity
function batchTransferResources(uint256 epochNumber, address to, string[] resourcesNames, uint256[] amounts) external
```

Transfers multiple resources to provided address

_Uses msg.sender as resources sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| to | address | An address which will receive resources |
| resourcesNames | string[] | Resources names |
| amounts | uint256[] | Amount of each resources to transfer |



### setGameFinishTime

```solidity
function setGameFinishTime(uint256 gameFinishTime) external
```

Sets game finish time

_Even though function is opened, it can only be called by mighty creator or reward pool_

| Name | Type | Description |
| ---- | ---- | ----------- |
| gameFinishTime | uint256 | Game finish time |



### setGameStartTime

```solidity
function setGameStartTime(uint256 gameStartTime) external
```

Sets game start time

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| gameStartTime | uint256 | Game start time |



### destroyCurrentEpoch

```solidity
function destroyCurrentEpoch() external
```

Destroys current epoch if conditions are met

_Anyone can call this function_




## IWorld


Functions to read state/modify state of game world





### WorldInitialized

```solidity
event WorldInitialized(address registryContractAddress, address geographyAddress, address bannersAddress, address blessTokenAddress, address distributionsAddress, address rewardPoolAddress)
```

Emitted when world initialized


| Name | Type | Description |
| ---- | ---- | ----------- |
| registryContractAddress | address | Registry contract address |
| geographyAddress | address | Geography contract address |
| bannersAddress | address | Mithraeum banners contract address |
| blessTokenAddress | address | Bless token address |
| distributionsAddress | address | Distributions token address |
| rewardPoolAddress | address | Reward pool address |



### GameStartTimeUpdated

```solidity
event GameStartTimeUpdated(uint256 timestamp)
```

Emitted when #setGameStartTime is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | New game start time |



### GameFinishTimeUpdated

```solidity
event GameFinishTimeUpdated(uint256 timestamp)
```

Emitted when #setGameFinishTime is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | New game finish time |



### NewWorldEpoch

```solidity
event NewWorldEpoch(address epochAddress, uint256 epochNumber)
```

Emitted when world initialized or #destroyCurrentEpoch is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| epochAddress | address | New epoch address |
| epochNumber | uint256 | New epoch number |



### CurrentEpochNumberUpdated

```solidity
event CurrentEpochNumberUpdated(uint256 epochNumber)
```

Emitted after new epoch initialization


| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | New epoch number |



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




### blessToken

```solidity
function blessToken() external view returns (contract IERC20)
```

Bless token

_Immutable, initialized on creation_




### distributions

```solidity
function distributions() external view returns (contract IDistributions)
```

Distributions token

_Immutable, initialized on creation_




### crossEpochsMemory

```solidity
function crossEpochsMemory() external view returns (contract ICrossEpochsMemory)
```

Cross epochs memory

_Immutable, initialized on creation_




### rewardPool

```solidity
function rewardPool() external view returns (contract IRewardPool)
```

Reward pool

_Immutable, initialized on creation_




### gameStartTime

```solidity
function gameStartTime() external view returns (uint256)
```

Game start time

_Updated when #setGameStartTime is called_




### gameFinishTime

```solidity
function gameFinishTime() external view returns (uint256)
```

Game finish time

_Updated when #setGameFinishTime is called_




### geography

```solidity
function geography() external view returns (contract IGeography)
```

Continent

_Updated when #addContinent is called_




### currentEpochNumber

```solidity
function currentEpochNumber() external view returns (uint256)
```

Current world epoch

_Updated when #destroy is called_




### epochs

```solidity
function epochs(uint256 epochNumber) external view returns (contract IEpoch)
```

World epochs

_Updated when world initialized or #destroy is called_




### worldAssets

```solidity
function worldAssets(uint256 epochNumber, address worldAsset) external view returns (bytes32)
```

Mapping containing world asset type by provided epoch number and address

_Updated when #addWorldAsset is called_




### init

```solidity
function init(address registryContractAddress, address crossEpochsMemoryAddress, address geographyAddress, address bannersAddress, address blessTokenAddress, address distributionsAddress, address rewardPoolAddress) external
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| registryContractAddress | address | Registry contract address |
| crossEpochsMemoryAddress | address | Cross epochs memory address |
| geographyAddress | address | Geography contract address |
| bannersAddress | address | Banners token address |
| blessTokenAddress | address | Bless token address |
| distributionsAddress | address | Distributions token address |
| rewardPoolAddress | address | Reward pool address |



### addWorldAsset

```solidity
function addWorldAsset(uint256 epochNumber, address worldAssetAddress, bytes32 assetType) external
```

Adds an address as world asset

_Even though function is opened, it can only be called by factory contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| worldAssetAddress | address | World asset address |
| assetType | bytes32 | Asset type |



### mintWorkers

```solidity
function mintWorkers(uint256 epochNumber, address to, uint256 value) external
```

Mints workers to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| to | address | Address which will receive workers |
| value | uint256 | Amount of workers to mint |



### mintUnits

```solidity
function mintUnits(uint256 epochNumber, string unitName, address to, uint256 value) external
```

Mints units to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| unitName | string | Type of unit to mint |
| to | address | Address which will receive units |
| value | uint256 | Amount of units to mint |



### mintResources

```solidity
function mintResources(uint256 epochNumber, string resourceName, address to, uint256 value) external
```

Mints resource to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| resourceName | string | Resource name |
| to | address | Address which will receive resources |
| value | uint256 | Amount of resources to mint |



### batchTransferResources

```solidity
function batchTransferResources(uint256 epochNumber, address to, string[] resourcesNames, uint256[] amounts) external
```

Transfers multiple resources to provided address

_Uses msg.sender as resources sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| to | address | An address which will receive resources |
| resourcesNames | string[] | Resources names |
| amounts | uint256[] | Amount of each resources to transfer |



### setGameFinishTime

```solidity
function setGameFinishTime(uint256 gameFinishTime) external
```

Sets game finish time

_Even though function is opened, it can only be called by mighty creator or reward pool_

| Name | Type | Description |
| ---- | ---- | ----------- |
| gameFinishTime | uint256 | Game finish time |



### setGameStartTime

```solidity
function setGameStartTime(uint256 gameStartTime) external
```

Sets game start time

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| gameStartTime | uint256 | Game start time |



### destroyCurrentEpoch

```solidity
function destroyCurrentEpoch() external
```

Destroys current epoch if conditions are met

_Anyone can call this function_




