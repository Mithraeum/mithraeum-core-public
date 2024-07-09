## WorldInitializable


Any contract which should be initialized with world should inherit this contract





### world

```solidity
contract IWorld world
```

World

_Should be immutable and initialized only once_




### onlyWorldAssetForEpoch

```solidity
modifier onlyWorldAssetForEpoch(uint256 epoch)
```



_Allows caller to be only world or world asset_




### onlyActiveGame

```solidity
modifier onlyActiveGame()
```



_Allows function to be callable only while game is active_




### setWorld

```solidity
function setWorld(address worldAddress) internal
```



_Initializes world by specified address, can be called only once_




### registry

```solidity
function registry() internal view returns (contract IRegistry)
```



_Extracts registry from the world_




## WorldInitializable


Any contract which should be initialized with world should inherit this contract





### world

```solidity
contract IWorld world
```

World

_Should be immutable and initialized only once_




### onlyWorldAssetForEpoch

```solidity
modifier onlyWorldAssetForEpoch(uint256 epoch)
```



_Allows caller to be only world or world asset_




### onlyActiveGame

```solidity
modifier onlyActiveGame()
```



_Allows function to be callable only while game is active_




### setWorld

```solidity
function setWorld(address worldAddress) internal
```



_Initializes world by specified address, can be called only once_




### registry

```solidity
function registry() internal view returns (contract IRegistry)
```



_Extracts registry from the world_




