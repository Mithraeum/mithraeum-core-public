## IWorldInitializable


Contains access to world storage variable





### world

```solidity
function world() external view returns (contract IWorld)
```

World

_Should be immutable and initialized only once_




### OnlyActiveGame

```solidity
error OnlyActiveGame()
```

Thrown when attempting to call action which can only be called in active game (started and not finished)





