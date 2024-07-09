## Farm








### getConfig

```solidity
function getConfig() public view returns (struct IBuilding.InitialResourceBlock[] initialResourceBlocks)
```

Returns production config for current building

_Main config that determines which resources is produced/spend by production of this building
InitialResourceBlock.perTick is value how much of resource is spend/produced by 1 worker in 1 second of production_


| Name | Type | Description |
| ---- | ---- | ----------- |
| initialResourceBlocks | struct IBuilding.InitialResourceBlock[] | Production config for current building |


### updateProsperity

```solidity
function updateProsperity(uint256 reservesBefore, uint256 reservesAfter) internal virtual
```



_Synchronizes settlement prosperity according to changed amount of resources in treasury_




## Farm








### getConfig

```solidity
function getConfig() public view returns (struct IBuilding.InitialResourceBlock[] initialResourceBlocks)
```

Returns production config for current building

_Main config that determines which resources is produced/spend by production of this building
InitialResourceBlock.perTick is value how much of resource is spend/produced by 1 worker in 1 second of production_


| Name | Type | Description |
| ---- | ---- | ----------- |
| initialResourceBlocks | struct IBuilding.InitialResourceBlock[] | Production config for current building |


### updateProsperity

```solidity
function updateProsperity(uint256 reservesBefore, uint256 reservesAfter) internal virtual
```



_Synchronizes settlement prosperity according to changed amount of resources in treasury_




