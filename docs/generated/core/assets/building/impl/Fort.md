## Fort








### health

```solidity
uint256 health
```

Fort health

_Updated when #updateHealth is called_




### updateHealth

```solidity
function updateHealth(uint256 value) public
```

Updates fort health

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 | New fort health |



### getProducingResourceName

```solidity
function getProducingResourceName() public view returns (string)
```

Calculates producing resource name for this building

_Return value is value from #getConfig where 'isProduced'=true_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string |  |


### resetDistribution

```solidity
function resetDistribution() public
```

Resets current building distribution

_Creates new distribution Nft and mints it to current settlement owner_




### init

```solidity
function init(address settlementAddress) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



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


### getMaxHealthOnLevel

```solidity
function getMaxHealthOnLevel(uint256 _level) public view returns (uint256)
```

Calculates maximum amount of health for provided level

_Useful to determine maximum amount of health will be available at provided level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### recalculateProduction

```solidity
function recalculateProduction() internal
```



_Recalculates production structure according to new resource balances_




### updateReserves

```solidity
function updateReserves() internal
```



_Updates building treasury according to changed amount of resources in building_




### getReserves

```solidity
function getReserves(uint256 _timestamp) public view returns (uint256)
```

Calculates treasury amount at specified time

_Useful for determination how much treasury will be at specific time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _timestamp | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### calcMaxWorkers

```solidity
function calcMaxWorkers(uint256 _buildingLevel) public view returns (uint256)
```

Calculates maximum amount of workers for specified level

_Useful to determinate maximum amount of workers on any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _buildingLevel | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getMaxReservesByLevel

```solidity
function getMaxReservesByLevel(uint256 _level) public view returns (uint256)
```

Calculates maximum amount of treasury by provided level

_Can be used to determine maximum amount of treasury by any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |



### applyState

```solidity
function applyState() public
```

Applies state of this building up to block.timestamp

_Useful if 'harvesting' resources from building production to building token holders_




### calcUpgradeTime

```solidity
function calcUpgradeTime(uint256 _level) public view virtual returns (uint256)
```

Calculates upgrade time for provided level

_If level=1 then returned value will be time which is taken for upgrading from 1 to 2 level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### calcUpgradePrice

```solidity
function calcUpgradePrice(uint256 _level, string resourceName) public view virtual returns (uint256)
```

Calculates upgrade price by resource and provided level

_Useful for determination how much upgrade will cost at any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |
| resourceName | string | Name of resource |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### calcWoodUpgradePrice

```solidity
function calcWoodUpgradePrice(uint256 _level) public view returns (uint256)
```

Calculates wood upgrade price for provided level

_Will be deprecated in favor of calcUpgradePrice(level, "WOOD")_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### calcOreUpgradePrice

```solidity
function calcOreUpgradePrice(uint256 _level) public view returns (uint256)
```

Calculates ore upgrade price for provided level

_Will be deprecated in favor of calcUpgradePrice(level, "ORE")_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### FortData








```solidity
struct FortData {
  uint256 fullHealthProductionSeconds;
  uint256 partialHealthProductionSeconds;
}
```

### calculateFortData

```solidity
function calculateFortData() public view returns (struct Fort.FortData)
```



_Calculates fort health production_




### calculateCumulativeState

```solidity
function calculateCumulativeState(uint256 _timestamp) public view virtual returns (struct IBuilding.ProductionResult[] res)
```

Calculates production resources changes at provided time

_Useful for determination how much of all production will be burned/produced at the specific time
Probably will be renamed in near future for more representative formulation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _timestamp | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| res | struct IBuilding.ProductionResult[] |  |


## Fort








### health

```solidity
uint256 health
```

Fort health

_Updated when #updateHealth is called_




### updateHealth

```solidity
function updateHealth(uint256 value) public
```

Updates fort health

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 | New fort health |



### getProducingResourceName

```solidity
function getProducingResourceName() public view returns (string)
```

Calculates producing resource name for this building

_Return value is value from #getConfig where 'isProduced'=true_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string |  |


### resetDistribution

```solidity
function resetDistribution() public
```

Resets current building distribution

_Creates new distribution Nft and mints it to current settlement owner_




### init

```solidity
function init(address settlementAddress) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



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


### getMaxHealthOnLevel

```solidity
function getMaxHealthOnLevel(uint256 _level) public view returns (uint256)
```

Calculates maximum amount of health for provided level

_Useful to determine maximum amount of health will be available at provided level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### recalculateProduction

```solidity
function recalculateProduction() internal
```



_Recalculates production structure according to new resource balances_




### updateReserves

```solidity
function updateReserves() internal
```



_Updates building treasury according to changed amount of resources in building_




### getReserves

```solidity
function getReserves(uint256 _timestamp) public view returns (uint256)
```

Calculates treasury amount at specified time

_Useful for determination how much treasury will be at specific time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _timestamp | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### calcMaxWorkers

```solidity
function calcMaxWorkers(uint256 _buildingLevel) public view returns (uint256)
```

Calculates maximum amount of workers for specified level

_Useful to determinate maximum amount of workers on any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _buildingLevel | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getMaxReservesByLevel

```solidity
function getMaxReservesByLevel(uint256 _level) public view returns (uint256)
```

Calculates maximum amount of treasury by provided level

_Can be used to determine maximum amount of treasury by any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |



### applyState

```solidity
function applyState() public
```

Applies state of this building up to block.timestamp

_Useful if 'harvesting' resources from building production to building token holders_




### calcUpgradeTime

```solidity
function calcUpgradeTime(uint256 _level) public view virtual returns (uint256)
```

Calculates upgrade time for provided level

_If level=1 then returned value will be time which is taken for upgrading from 1 to 2 level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### calcUpgradePrice

```solidity
function calcUpgradePrice(uint256 _level, string resourceName) public view virtual returns (uint256)
```

Calculates upgrade price by resource and provided level

_Useful for determination how much upgrade will cost at any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |
| resourceName | string | Name of resource |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### calcWoodUpgradePrice

```solidity
function calcWoodUpgradePrice(uint256 _level) public view returns (uint256)
```

Calculates wood upgrade price for provided level

_Will be deprecated in favor of calcUpgradePrice(level, "WOOD")_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### calcOreUpgradePrice

```solidity
function calcOreUpgradePrice(uint256 _level) public view returns (uint256)
```

Calculates ore upgrade price for provided level

_Will be deprecated in favor of calcUpgradePrice(level, "ORE")_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### FortData








```solidity
struct FortData {
  uint256 fullHealthProductionSeconds;
  uint256 partialHealthProductionSeconds;
}
```

### calculateFortData

```solidity
function calculateFortData() public view returns (struct Fort.FortData)
```



_Calculates fort health production_




### calculateCumulativeState

```solidity
function calculateCumulativeState(uint256 _timestamp) public view virtual returns (struct IBuilding.ProductionResult[] res)
```

Calculates production resources changes at provided time

_Useful for determination how much of all production will be burned/produced at the specific time
Probably will be renamed in near future for more representative formulation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _timestamp | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| res | struct IBuilding.ProductionResult[] |  |


