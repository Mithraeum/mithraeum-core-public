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




### blessToken

```solidity
contract IERC20 blessToken
```

Bless token

_Immutable, initialized on creation_




### distributions

```solidity
contract IDistributions distributions
```

Distributions token

_Immutable, initialized on creation_




### crossEpochsMemory

```solidity
contract ICrossEpochsMemory crossEpochsMemory
```

Cross epochs memory

_Immutable, initialized on creation_




### rewardPool

```solidity
contract IRewardPool rewardPool
```

Reward pool

_Immutable, initialized on creation_




### gameStartTime

```solidity
uint256 gameStartTime
```

Game start time

_Updated when #setGameStartTime is called_




### gameFinishTime

```solidity
uint256 gameFinishTime
```

Game finish time

_Updated when #setGameFinishTime is called_




### currentEpochNumber

```solidity
uint256 currentEpochNumber
```

Current world epoch

_Updated when #destroy is called_




### epochs

```solidity
mapping(uint256 => contract IEpoch) epochs
```

World epochs

_Updated when world initialized or #destroy is called_




### worldAssets

```solidity
mapping(uint256 => mapping(address => bytes32)) worldAssets
```

Mapping containing world asset type by provided epoch number and address

_Updated when #addWorldAsset is called_




### onlyActiveGame

```solidity
modifier onlyActiveGame()
```



_Allows function to be callable only while game is active_




### onlyMightyCreatorOrRewardPool

```solidity
modifier onlyMightyCreatorOrRewardPool()
```



_Allows caller to be only mighty creator or reward pool_




### onlyMightyCreator

```solidity
modifier onlyMightyCreator()
```



_Allows caller to be only mighty creator_




### onlyFactory

```solidity
modifier onlyFactory()
```



_Allows caller to be only factory contract_




### init

```solidity
function init(address registryContractAddress, address crossEpochsMemoryAddress, address geographyAddress, address bannersAddress, address blessTokenAddress, address distributionsAddress, address rewardPoolAddress) public
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
function addWorldAsset(uint256 epochNumber, address worldAsset, bytes32 assetType) public
```

Adds an address as world asset

_Even though function is opened, it can only be called by factory contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| worldAsset | address |  |
| assetType | bytes32 | Asset type |



### setGameStartTime

```solidity
function setGameStartTime(uint256 value) public
```

Sets game start time

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 |  |



### setGameFinishTime

```solidity
function setGameFinishTime(uint256 value) public
```

Sets game finish time

_Even though function is opened, it can only be called by mighty creator or reward pool_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 |  |



### createEpoch

```solidity
function createEpoch(uint256 epochNumber) internal returns (contract IEpoch)
```



_Creates epoch_




### createAndAssignEpoch

```solidity
function createAndAssignEpoch(uint256 epochNumber) internal
```



_Create and assign epoch_




### setCurrentEpochNumber

```solidity
function setCurrentEpochNumber(uint256 newEpochNumber) internal
```



_Sets current epoch number_




### mintWorkers

```solidity
function mintWorkers(uint256 epochNumber, address _to, uint256 _value) public
```

Mints workers to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| _to | address |  |
| _value | uint256 |  |



### mintUnits

```solidity
function mintUnits(uint256 epochNumber, string _unitName, address _to, uint256 _value) public
```

Mints units to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| _unitName | string |  |
| _to | address |  |
| _value | uint256 |  |



### mintResources

```solidity
function mintResources(uint256 epochNumber, string _resourceName, address _to, uint256 _value) public
```

Mints resource to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| _resourceName | string |  |
| _to | address |  |
| _value | uint256 |  |



### batchTransferResources

```solidity
function batchTransferResources(uint256 epochNumber, address to, string[] resourcesNames, uint256[] amounts) public
```

Transfers multiple resources to provided address

_Uses msg.sender as resources sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| to | address | An address which will receive resources |
| resourcesNames | string[] | Resources names |
| amounts | uint256[] | Amount of each resources to transfer |



### destroyCurrentEpoch

```solidity
function destroyCurrentEpoch() public
```

Destroys current epoch if conditions are met

_Anyone can call this function_




### destroyCurrentEpochWithoutCondition

```solidity
function destroyCurrentEpochWithoutCondition() public
```







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

Continent

_Updated when #addContinent is called_




### bannerContract

```solidity
contract IERC721 bannerContract
```

Banners token

_Immutable, initialized on creation_




### blessToken

```solidity
contract IERC20 blessToken
```

Bless token

_Immutable, initialized on creation_




### distributions

```solidity
contract IDistributions distributions
```

Distributions token

_Immutable, initialized on creation_




### crossEpochsMemory

```solidity
contract ICrossEpochsMemory crossEpochsMemory
```

Cross epochs memory

_Immutable, initialized on creation_




### rewardPool

```solidity
contract IRewardPool rewardPool
```

Reward pool

_Immutable, initialized on creation_




### gameStartTime

```solidity
uint256 gameStartTime
```

Game start time

_Updated when #setGameStartTime is called_




### gameFinishTime

```solidity
uint256 gameFinishTime
```

Game finish time

_Updated when #setGameFinishTime is called_




### currentEpochNumber

```solidity
uint256 currentEpochNumber
```

Current world epoch

_Updated when #destroy is called_




### epochs

```solidity
mapping(uint256 => contract IEpoch) epochs
```

World epochs

_Updated when world initialized or #destroy is called_




### worldAssets

```solidity
mapping(uint256 => mapping(address => bytes32)) worldAssets
```

Mapping containing world asset type by provided epoch number and address

_Updated when #addWorldAsset is called_




### onlyActiveGame

```solidity
modifier onlyActiveGame()
```



_Allows function to be callable only while game is active_




### onlyMightyCreatorOrRewardPool

```solidity
modifier onlyMightyCreatorOrRewardPool()
```



_Allows caller to be only mighty creator or reward pool_




### onlyMightyCreator

```solidity
modifier onlyMightyCreator()
```



_Allows caller to be only mighty creator_




### onlyFactory

```solidity
modifier onlyFactory()
```



_Allows caller to be only factory contract_




### init

```solidity
function init(address registryContractAddress, address crossEpochsMemoryAddress, address geographyAddress, address bannersAddress, address blessTokenAddress, address distributionsAddress, address rewardPoolAddress) public
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
function addWorldAsset(uint256 epochNumber, address worldAsset, bytes32 assetType) public
```

Adds an address as world asset

_Even though function is opened, it can only be called by factory contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| worldAsset | address |  |
| assetType | bytes32 | Asset type |



### setGameStartTime

```solidity
function setGameStartTime(uint256 value) public
```

Sets game start time

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 |  |



### setGameFinishTime

```solidity
function setGameFinishTime(uint256 value) public
```

Sets game finish time

_Even though function is opened, it can only be called by mighty creator or reward pool_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 |  |



### createEpoch

```solidity
function createEpoch(uint256 epochNumber) internal returns (contract IEpoch)
```



_Creates epoch_




### createAndAssignEpoch

```solidity
function createAndAssignEpoch(uint256 epochNumber) internal
```



_Create and assign epoch_




### setCurrentEpochNumber

```solidity
function setCurrentEpochNumber(uint256 newEpochNumber) internal
```



_Sets current epoch number_




### mintWorkers

```solidity
function mintWorkers(uint256 epochNumber, address _to, uint256 _value) public
```

Mints workers to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| _to | address |  |
| _value | uint256 |  |



### mintUnits

```solidity
function mintUnits(uint256 epochNumber, string _unitName, address _to, uint256 _value) public
```

Mints units to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| _unitName | string |  |
| _to | address |  |
| _value | uint256 |  |



### mintResources

```solidity
function mintResources(uint256 epochNumber, string _resourceName, address _to, uint256 _value) public
```

Mints resource to provided address

_Even though function is opened, it can only be called by mighty creator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| _resourceName | string |  |
| _to | address |  |
| _value | uint256 |  |



### batchTransferResources

```solidity
function batchTransferResources(uint256 epochNumber, address to, string[] resourcesNames, uint256[] amounts) public
```

Transfers multiple resources to provided address

_Uses msg.sender as resources sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |
| to | address | An address which will receive resources |
| resourcesNames | string[] | Resources names |
| amounts | uint256[] | Amount of each resources to transfer |



### destroyCurrentEpoch

```solidity
function destroyCurrentEpoch() public
```

Destroys current epoch if conditions are met

_Anyone can call this function_




### destroyCurrentEpochWithoutCondition

```solidity
function destroyCurrentEpochWithoutCondition() public
```







