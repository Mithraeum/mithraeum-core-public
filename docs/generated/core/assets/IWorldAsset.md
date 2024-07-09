## IWorldAsset








### OnlyMightyCreator

```solidity
error OnlyMightyCreator()
```

Thrown when attempting to call action which can only be called by mighty creator





### OnlyWorldAssetFromSameEra

```solidity
error OnlyWorldAssetFromSameEra()
```

Thrown when attempting to call action which can only be called by world asset from same era





### OnlyActiveGame

```solidity
error OnlyActiveGame()
```

Thrown when attempting to call action which can only be called in active game (started and not finished)





### world

```solidity
function world() external view returns (contract IWorld)
```

World

_Value is dereferenced from proxy storage_




### registry

```solidity
function registry() external view returns (contract IRegistry)
```

Registry

_Value is dereferenced from world_




### era

```solidity
function era() external view returns (contract IEra)
```

Era

_Value is dereferenced from proxy storage and world_




### worldAssetFactory

```solidity
function worldAssetFactory() external view returns (contract IWorldAssetFactory)
```

Returns world asset factory from registry

_Value is dereferenced from registry_




