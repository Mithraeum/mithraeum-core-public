## Farm








### getConfig

```solidity
function getConfig() public pure returns (struct IBuilding.ProductionConfigItem[])
```

Returns production config for current building

_Main config that determines which resources is produced/spend by production of this building
ProductionConfigItem.amountPerTick is value how much of resource is spend/produced by 1 worker in 1 tick of production_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IBuilding.ProductionConfigItem[] |  |


