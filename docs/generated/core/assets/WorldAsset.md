## WorldAsset


World asset must inherit this basic contract

_IMPORTANT: be aware of proxy type of world asset deployed in 'WorldAssetFactory'
Different network is optimized differently for contract deployment
In order to support most of them it is required to recompile 'WorldAsset' contracts with 'WorldAssetStorageAccessorXXX' type specified in 'WorldAssetFactory'_




### onlyMightyCreator

```solidity
modifier onlyMightyCreator()
```



_Only mighty creator modifier
Modifier is calling internal function in order to reduce contract size_




### onlyWorldAssetFromSameEra

```solidity
modifier onlyWorldAssetFromSameEra()
```



_Only world asset from same era modifier
Modifier is calling internal function in order to reduce contract size_




### onlyActiveGame

```solidity
modifier onlyActiveGame()
```



_Only active game modifier
Modifier is calling internal function in order to reduce contract size_




### init

```solidity
function init(bytes initParams) public virtual
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



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




### era

```solidity
function era() public view returns (contract IEra)
```

Era

_Value is dereferenced from proxy storage and world_




### worldAssetFactory

```solidity
function worldAssetFactory() public view returns (contract IWorldAssetFactory)
```

Returns world asset factory from registry

_Value is dereferenced from registry_




### _onlyMightyCreator

```solidity
function _onlyMightyCreator() internal view
```



_Allows caller to be only mighty creator_




### _onlyWorldAssetFromSameEra

```solidity
function _onlyWorldAssetFromSameEra() internal view
```



_Allows caller to be only world or world asset_




### _onlyActiveGame

```solidity
function _onlyActiveGame() internal view
```



_Allows function to be callable only while game is active_




