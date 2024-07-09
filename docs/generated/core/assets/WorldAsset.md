## WorldAsset


World asset must inherit this basic contract





### onlyMightyCreator

```solidity
modifier onlyMightyCreator()
```

Allows caller to be only mighty creator





### onlyWorldAssetFromSameEpoch

```solidity
modifier onlyWorldAssetFromSameEpoch()
```



_Allows caller to be only world or world asset_




### onlyActiveGame

```solidity
modifier onlyActiveGame()
```



_Allows function to be callable only while game is active_




### world

```solidity
function world() public view returns (contract IWorld)
```

World

_Value is dereferenced from proxy storage_




### registry

```solidity
function registry() public view returns (contract IRegistry)
```

Registry

_Value is dereferenced from world_




### epoch

```solidity
function epoch() public view returns (contract IEpoch)
```

Epoch

_Value is dereferenced from proxy storage and world_




## WorldAsset


World asset must inherit this basic contract





### onlyMightyCreator

```solidity
modifier onlyMightyCreator()
```

Allows caller to be only mighty creator





### onlyWorldAssetFromSameEpoch

```solidity
modifier onlyWorldAssetFromSameEpoch()
```



_Allows caller to be only world or world asset_




### onlyActiveGame

```solidity
modifier onlyActiveGame()
```



_Allows function to be callable only while game is active_




### world

```solidity
function world() public view returns (contract IWorld)
```

World

_Value is dereferenced from proxy storage_




### registry

```solidity
function registry() public view returns (contract IRegistry)
```

Registry

_Value is dereferenced from world_




### epoch

```solidity
function epoch() public view returns (contract IEpoch)
```

Epoch

_Value is dereferenced from proxy storage and world_




