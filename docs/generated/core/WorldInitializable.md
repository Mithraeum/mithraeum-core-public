## WorldInitializable


Any contract which should be initialized with world should inherit this contract





### world

```solidity
contract IWorld world
```

World

_Should be immutable and initialized only once_




### onlyActiveGame

```solidity
modifier onlyActiveGame()
```



_Only active game modifier
Modifier is calling internal function in order to reduce contract size_




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




### _onlyActiveGame

```solidity
function _onlyActiveGame() internal view
```



_Allows function to be callable only while game is active_




