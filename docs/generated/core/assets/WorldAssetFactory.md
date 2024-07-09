## WorldAssetFactory


Any world asset factory should inherit this abstract factory containing common method to create and set world asset





### onlyWorldOrWorldAsset

```solidity
modifier onlyWorldOrWorldAsset(address worldAddress, uint256 eraNumber)
```



_Only world or world asset modifier
Modifier is calling internal function in order to reduce contract size_




### create

```solidity
function create(address worldAddress, uint256 eraNumber, bytes32 assetGroupId, bytes32 assetTypeId, bytes initParams) public returns (address)
```

Creates new world asset, sets it into the world and initializes it


| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |
| eraNumber | uint256 | Era number |
| assetGroupId | bytes32 | Asset group id |
| assetTypeId | bytes32 | Asset type id |
| initParams | bytes | Init params |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### createAndSet

```solidity
function createAndSet(address worldAddress, uint256 eraNumber, bytes32 assetGroupId, bytes32 assetTypeId) internal returns (address)
```



_Creates new world asset proxy with specified world asset params and adds newly created asset to the world_




### createNewWorldAssetProxyWithPush0

```solidity
function createNewWorldAssetProxyWithPush0(address worldAddress, uint256 eraNumber, bytes32 assetGroupId, bytes32 assetTypeId) internal returns (address)
```



_Creates new world asset proxy via bytes concatenation in order to achieve minimal bytecode size and call size (implemented with PUSH0 opcode)_




### createNewWorldAssetProxyWithoutPush0

```solidity
function createNewWorldAssetProxyWithoutPush0(address worldAddress, uint256 eraNumber, bytes32 assetGroupId, bytes32 assetTypeId) internal returns (address)
```



_Creates new world asset proxy via bytes concatenation in order to achieve minimal bytecode size and call size (implemented without PUSH0 opcode -> more contract size, more gas cost)_




### createNewWorldAssetProxyWithStaticContractCode

```solidity
function createNewWorldAssetProxyWithStaticContractCode(address worldAddress, uint256 eraNumber, bytes32 assetGroupId, bytes32 assetTypeId) internal returns (address)
```



_Creates new world asset proxy with static contract code (world proxy variables are stored in storage instead of code, making it most expensive version of proxy however it is most optimized for zk evm)_




### _onlyWorldOrWorldAsset

```solidity
function _onlyWorldOrWorldAsset(address worldAddress, uint256 eraNumber) internal view
```



_Allows caller to be only world or world asset_




