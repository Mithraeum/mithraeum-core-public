## IBuilding


Functions to read state/modify state in order to get current building parameters and/or interact with it





### Production








```solidity
struct Production {
  uint256 lastApplyStateTime;
  uint256 lastApplyStateZoneTime;
  uint256 extraTicksAfterFinish;
  uint256 productionFinishZoneTime;
}
```

### BuildingState








```solidity
struct BuildingState {
  uint256 level;
  uint256 timeUpgradeFinish;
  bool upgrading;
  uint256 reserves;
}
```

### ProductionResult








```solidity
struct ProductionResult {
  string resourceName;
  uint256 balanceChanges;
  bool isProducing;
}
```

### InitialResourceBlock








```solidity
struct InitialResourceBlock {
  string resourceName;
  uint256 perTick;
  bool isProducing;
}
```

### MithraeumApplied

```solidity
event MithraeumApplied(address caller)
```

Emitted when #applyState is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| caller | address | msg.sender of #applyState |



### UpgradeFinish

```solidity
event UpgradeFinish(uint256 stateLevel, uint256 previousMaxProsperity, uint256 newMaxProsperity)
```

Emitted when #applyState is called if building upgrade is finished


| Name | Type | Description |
| ---- | ---- | ----------- |
| stateLevel | uint256 | New building level |
| previousMaxProsperity | uint256 | Previous max prosperity building had |
| newMaxProsperity | uint256 | New max prosperity building have |



### UpgradeStarted

```solidity
event UpgradeStarted()
```

Emitted when #upgradeStart is called





### DistributedToShareHolder

```solidity
event DistributedToShareHolder(address buildingAddress, string resourceName, address holder, uint256 amount)
```

Emitted when #distribute is called. When resources from production are distributed to building token holders. Will be deprecated in favor of ERC20 transfer event.


| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | An address of building (same as event sender) |
| resourceName | string | Name of resource distributed |
| holder | address | Receiver address |
| amount | uint256 | Amount of distributed resources |



### NewDistribution

```solidity
event NewDistribution(uint256 distributionId, address[] previousReceivers)
```

Emitted when #setDefaultDistribution is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| distributionId | uint256 | Newly created distribution id |
| previousReceivers | address[] | Previous distribution receivers |



### currentSettlement

```solidity
function currentSettlement() external view returns (contract ISettlement)
```

Settlement address to which this building belongs

_Immutable, initialized on the building creation_




### buildingState

```solidity
function buildingState() external view returns (uint256 level, uint256 timeUpgradeFinish, bool upgrading, uint256 reserves)
```

Contains current common state of the building

_Some parameters may depend on time (if upgrade is finished building must be considered as upgraded). 'upgrading' parameter will be deprecated in favor of presence 'timeUpgradeFinish' (whenever zero or not zero)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Current building level |
| timeUpgradeFinish | uint256 | Time at which building will finish upgrade |
| upgrading | bool | Is building upgrading or not |
| reserves | uint256 | Current building reserves |


### production

```solidity
function production() external view returns (uint256 lastApplyStateTime, uint256 lastApplyStateZoneTime, uint256 extraTicksAfterFinish, uint256 productionFinishZoneTime)
```

Contains current production state of the building

_Contains information related to how production is calculated_


| Name | Type | Description |
| ---- | ---- | ----------- |
| lastApplyStateTime | uint256 | Time at which last #applyState is called |
| lastApplyStateZoneTime | uint256 | Zone time at which last #applyState is called |
| extraTicksAfterFinish | uint256 | Amount of extra resource ticks will be performed after 'productionFinishZoneTime'. Implication of this parameter is special case when there are resources for production however they are produced in less than a second. |
| productionFinishZoneTime | uint256 | Zone time at which production will stop |


### distributionId

```solidity
function distributionId() external view returns (uint256)
```

Distribution id

_Initialized on creation and updated on #resetDistribution_




### init

```solidity
function init(address settlementAddress) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### resetDistribution

```solidity
function resetDistribution() external
```

Resets current building distribution

_Creates new distribution Nft and mints it to current settlement owner_




### productionChanged

```solidity
function productionChanged() external
```

Callback which recalculates production. Called when workers or resources, which related to production of this building, is transferred from/to this building

_Even though function is opened, it is auto-called by transfer method. Standalone calls provide 0 impact._




### applyState

```solidity
function applyState() external
```

Applies state of this building up to block.timestamp

_Useful if 'harvesting' resources from building production to building token holders_




### workers

```solidity
function workers() external view returns (uint256 workersAmount)
```

Calculates amount of workers currently sitting in this building

_Same as workers.balanceOf(buildingAddress)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| workersAmount | uint256 | Amount of workers currently sitting in this building |


### maxWorkers

```solidity
function maxWorkers() external view returns (uint256 maxWorkersAmount)
```

Calculates Maximum amount of workers this building can have

_Max amount of workers changed by building level. This function takes into account current block.timestamp for its current level. Basically if building is upgraded returns proper amount of max workers available._


| Name | Type | Description |
| ---- | ---- | ----------- |
| maxWorkersAmount | uint256 | Maximum amount of workers this building can have |


### calcCumulativeResource

```solidity
function calcCumulativeResource(string resourceName, uint256 timestamp) external view returns (uint256 resourcesAmount)
```

Calculates real amount of provided resource in building related to its production at provided time

_Useful for determination how much of production resource (either producing and spending) at the specific time
Probably will be renamed in near future for more representative formulation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Name of resource related to production |
| timestamp | uint256 | Time at which calculate amount of resources in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesAmount | uint256 | Real amount of provided resource in building related to its production at provided time |


### calculateCumulativeState

```solidity
function calculateCumulativeState(uint256 timestamp) external view returns (struct IBuilding.ProductionResult[] productionResults)
```

Calculates production resources changes at provided time

_Useful for determination how much of all production will be burned/produced at the specific time
Probably will be renamed in near future for more representative formulation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate amount of resources in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| productionResults | struct IBuilding.ProductionResult[] | Production resources changes at provided time |


### calcUpgradePrice

```solidity
function calcUpgradePrice(uint256 level, string resourceName) external view returns (uint256 price)
```

Calculates upgrade price by resource and provided level

_Useful for determination how much upgrade will cost at any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Level at which calculate price |
| resourceName | string | Name of resource |

| Name | Type | Description |
| ---- | ---- | ----------- |
| price | uint256 | Amount of resources needed for upgrade |


### calcUpgradeTime

```solidity
function calcUpgradeTime(uint256 level) external view returns (uint256 upgradeTime)
```

Calculates upgrade time for provided level

_If level=1 then returned value will be time which is taken for upgrading from 1 to 2 level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | At which level calculate upgrade time |

| Name | Type | Description |
| ---- | ---- | ----------- |
| upgradeTime | uint256 | Upgrade time |


### calcWoodUpgradePrice

```solidity
function calcWoodUpgradePrice(uint256 level) external view returns (uint256 price)
```

Calculates wood upgrade price for provided level

_Will be deprecated in favor of calcUpgradePrice(level, "WOOD")_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Level at which calculate price |

| Name | Type | Description |
| ---- | ---- | ----------- |
| price | uint256 | Amount of wood needed for upgrade |


### calcOreUpgradePrice

```solidity
function calcOreUpgradePrice(uint256 level) external view returns (uint256 price)
```

Calculates ore upgrade price for provided level

_Will be deprecated in favor of calcUpgradePrice(level, "ORE")_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Level at which calculate price |

| Name | Type | Description |
| ---- | ---- | ----------- |
| price | uint256 | Amount of ore needed for upgrade |


### upgradeStart

```solidity
function upgradeStart() external
```

Starts building upgrade

_Resources required for upgrade will be taken from msg.sender_




### level

```solidity
function level() external view returns (uint256 level)
```

Calculates current level

_Takes into an account if upgrade if finished or not_


| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Current level |


### getConfig

```solidity
function getConfig() external view returns (struct IBuilding.InitialResourceBlock[] initialResourceBlocks)
```

Returns production config for current building

_Main config that determines which resources is produced/spend by production of this building
InitialResourceBlock.perTick is value how much of resource is spend/produced by 1 worker in 1 second of production_


| Name | Type | Description |
| ---- | ---- | ----------- |
| initialResourceBlocks | struct IBuilding.InitialResourceBlock[] | Production config for current building |


### transferWorkers

```solidity
function transferWorkers(address to, uint256 amount) external
```

Transfers workers from current building to specified address

_Currently workers can be transferred from building only to its settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | An address transfer workers to |
| amount | uint256 | Amount of workers to transfer |



### transferResources

```solidity
function transferResources(string resourceName, address to, uint256 amount) external
```

Transfer specified resource from current building

_Used for withdrawing resources from production or overcapped treasury resources_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Name of resource to transfer |
| to | address | An address transfer resources to |
| amount | uint256 | Amount of resources to transfer |



### batchTransferResources

```solidity
function batchTransferResources(string[] resourcesNames, address to, uint256[] amounts) external
```

Batch resource transfer

_Same as #transferResources but for many resources at once_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesNames | string[] | Names of resources to transfer |
| to | address | An address transfer resources to |
| amounts | uint256[] | Amounts of resources to transfer |



### getMaxReservesByLevel

```solidity
function getMaxReservesByLevel(uint256 level) external view returns (uint256 maxReserves)
```

Calculates maximum amount of treasury by provided level

_Can be used to determine maximum amount of treasury by any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Building level |



### stealReserves

```solidity
function stealReserves(address to, uint256 amount) external returns (uint256 realAmount)
```

Steals resources from treasury

_Called by siege or building owner, in either case part of resources will be burned according to #registry.getRobberyFee_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | An address which will get resources |
| amount | uint256 | Amount of resources to steal, 'to' will get only part of specified 'amount', some percent of specified 'amount' will be burned |

| Name | Type | Description |
| ---- | ---- | ----------- |
| realAmount | uint256 | Real amount of resources from which stealing occurred (min(amount, reserves)) |


### burnReserves

```solidity
function burnReserves(uint256 amount) external
```

Burns building treasury

_Can be called by world asset or building owner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount of resources to burn from treasury |



### calcMaxWorkers

```solidity
function calcMaxWorkers(uint256 level) external view returns (uint256 workersAmount)
```

Calculates maximum amount of workers for specified level

_Useful to determinate maximum amount of workers on any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Level at which calculate max workers |

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersAmount | uint256 | Maximum amount of workers for specified level |


### getProducingResourceName

```solidity
function getProducingResourceName() external view returns (string resourceName)
```

Calculates producing resource name for this building

_Return value is value from #getConfig where 'isProduced'=true_


| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Name of producing resource |


### getReserves

```solidity
function getReserves(uint256 timestamp) external view returns (uint256 reserve)
```

Calculates treasury amount at specified time

_Useful for determination how much treasury will be at specific time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate amount of treasury in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| reserve | uint256 | Treasury amount at specified time |


### isResourceAcceptable

```solidity
function isResourceAcceptable(string resourceName) external view returns (bool isResourceAcceptable)
```

Calculates if building is capable to accept resource

_Return value based on #getConfig_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Name of resource |

| Name | Type | Description |
| ---- | ---- | ----------- |
| isResourceAcceptable | bool | Is building can accept resource |


### buildingName

```solidity
function buildingName() external view returns (string buildingName)
```

Returns building name

_Same value as #assetName_


| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingName | string | Building name |


## IBuilding


Functions to read state/modify state in order to get current building parameters and/or interact with it





### Production








```solidity
struct Production {
  uint256 lastApplyStateTime;
  uint256 lastApplyStateZoneTime;
  uint256 extraTicksAfterFinish;
  uint256 productionFinishZoneTime;
}
```

### BuildingState








```solidity
struct BuildingState {
  uint256 level;
  uint256 timeUpgradeFinish;
  bool upgrading;
  uint256 reserves;
}
```

### ProductionResult








```solidity
struct ProductionResult {
  string resourceName;
  uint256 balanceChanges;
  bool isProducing;
}
```

### InitialResourceBlock








```solidity
struct InitialResourceBlock {
  string resourceName;
  uint256 perTick;
  bool isProducing;
}
```

### MithraeumApplied

```solidity
event MithraeumApplied(address caller)
```

Emitted when #applyState is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| caller | address | msg.sender of #applyState |



### UpgradeFinish

```solidity
event UpgradeFinish(uint256 stateLevel, uint256 previousMaxProsperity, uint256 newMaxProsperity)
```

Emitted when #applyState is called if building upgrade is finished


| Name | Type | Description |
| ---- | ---- | ----------- |
| stateLevel | uint256 | New building level |
| previousMaxProsperity | uint256 | Previous max prosperity building had |
| newMaxProsperity | uint256 | New max prosperity building have |



### UpgradeStarted

```solidity
event UpgradeStarted()
```

Emitted when #upgradeStart is called





### DistributedToShareHolder

```solidity
event DistributedToShareHolder(address buildingAddress, string resourceName, address holder, uint256 amount)
```

Emitted when #distribute is called. When resources from production are distributed to building token holders. Will be deprecated in favor of ERC20 transfer event.


| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | An address of building (same as event sender) |
| resourceName | string | Name of resource distributed |
| holder | address | Receiver address |
| amount | uint256 | Amount of distributed resources |



### NewDistribution

```solidity
event NewDistribution(uint256 distributionId, address[] previousReceivers)
```

Emitted when #setDefaultDistribution is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| distributionId | uint256 | Newly created distribution id |
| previousReceivers | address[] | Previous distribution receivers |



### currentSettlement

```solidity
function currentSettlement() external view returns (contract ISettlement)
```

Settlement address to which this building belongs

_Immutable, initialized on the building creation_




### buildingState

```solidity
function buildingState() external view returns (uint256 level, uint256 timeUpgradeFinish, bool upgrading, uint256 reserves)
```

Contains current common state of the building

_Some parameters may depend on time (if upgrade is finished building must be considered as upgraded). 'upgrading' parameter will be deprecated in favor of presence 'timeUpgradeFinish' (whenever zero or not zero)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Current building level |
| timeUpgradeFinish | uint256 | Time at which building will finish upgrade |
| upgrading | bool | Is building upgrading or not |
| reserves | uint256 | Current building reserves |


### production

```solidity
function production() external view returns (uint256 lastApplyStateTime, uint256 lastApplyStateZoneTime, uint256 extraTicksAfterFinish, uint256 productionFinishZoneTime)
```

Contains current production state of the building

_Contains information related to how production is calculated_


| Name | Type | Description |
| ---- | ---- | ----------- |
| lastApplyStateTime | uint256 | Time at which last #applyState is called |
| lastApplyStateZoneTime | uint256 | Zone time at which last #applyState is called |
| extraTicksAfterFinish | uint256 | Amount of extra resource ticks will be performed after 'productionFinishZoneTime'. Implication of this parameter is special case when there are resources for production however they are produced in less than a second. |
| productionFinishZoneTime | uint256 | Zone time at which production will stop |


### distributionId

```solidity
function distributionId() external view returns (uint256)
```

Distribution id

_Initialized on creation and updated on #resetDistribution_




### init

```solidity
function init(address settlementAddress) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### resetDistribution

```solidity
function resetDistribution() external
```

Resets current building distribution

_Creates new distribution Nft and mints it to current settlement owner_




### productionChanged

```solidity
function productionChanged() external
```

Callback which recalculates production. Called when workers or resources, which related to production of this building, is transferred from/to this building

_Even though function is opened, it is auto-called by transfer method. Standalone calls provide 0 impact._




### applyState

```solidity
function applyState() external
```

Applies state of this building up to block.timestamp

_Useful if 'harvesting' resources from building production to building token holders_




### workers

```solidity
function workers() external view returns (uint256 workersAmount)
```

Calculates amount of workers currently sitting in this building

_Same as workers.balanceOf(buildingAddress)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| workersAmount | uint256 | Amount of workers currently sitting in this building |


### maxWorkers

```solidity
function maxWorkers() external view returns (uint256 maxWorkersAmount)
```

Calculates Maximum amount of workers this building can have

_Max amount of workers changed by building level. This function takes into account current block.timestamp for its current level. Basically if building is upgraded returns proper amount of max workers available._


| Name | Type | Description |
| ---- | ---- | ----------- |
| maxWorkersAmount | uint256 | Maximum amount of workers this building can have |


### calcCumulativeResource

```solidity
function calcCumulativeResource(string resourceName, uint256 timestamp) external view returns (uint256 resourcesAmount)
```

Calculates real amount of provided resource in building related to its production at provided time

_Useful for determination how much of production resource (either producing and spending) at the specific time
Probably will be renamed in near future for more representative formulation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Name of resource related to production |
| timestamp | uint256 | Time at which calculate amount of resources in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesAmount | uint256 | Real amount of provided resource in building related to its production at provided time |


### calculateCumulativeState

```solidity
function calculateCumulativeState(uint256 timestamp) external view returns (struct IBuilding.ProductionResult[] productionResults)
```

Calculates production resources changes at provided time

_Useful for determination how much of all production will be burned/produced at the specific time
Probably will be renamed in near future for more representative formulation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate amount of resources in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| productionResults | struct IBuilding.ProductionResult[] | Production resources changes at provided time |


### calcUpgradePrice

```solidity
function calcUpgradePrice(uint256 level, string resourceName) external view returns (uint256 price)
```

Calculates upgrade price by resource and provided level

_Useful for determination how much upgrade will cost at any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Level at which calculate price |
| resourceName | string | Name of resource |

| Name | Type | Description |
| ---- | ---- | ----------- |
| price | uint256 | Amount of resources needed for upgrade |


### calcUpgradeTime

```solidity
function calcUpgradeTime(uint256 level) external view returns (uint256 upgradeTime)
```

Calculates upgrade time for provided level

_If level=1 then returned value will be time which is taken for upgrading from 1 to 2 level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | At which level calculate upgrade time |

| Name | Type | Description |
| ---- | ---- | ----------- |
| upgradeTime | uint256 | Upgrade time |


### calcWoodUpgradePrice

```solidity
function calcWoodUpgradePrice(uint256 level) external view returns (uint256 price)
```

Calculates wood upgrade price for provided level

_Will be deprecated in favor of calcUpgradePrice(level, "WOOD")_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Level at which calculate price |

| Name | Type | Description |
| ---- | ---- | ----------- |
| price | uint256 | Amount of wood needed for upgrade |


### calcOreUpgradePrice

```solidity
function calcOreUpgradePrice(uint256 level) external view returns (uint256 price)
```

Calculates ore upgrade price for provided level

_Will be deprecated in favor of calcUpgradePrice(level, "ORE")_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Level at which calculate price |

| Name | Type | Description |
| ---- | ---- | ----------- |
| price | uint256 | Amount of ore needed for upgrade |


### upgradeStart

```solidity
function upgradeStart() external
```

Starts building upgrade

_Resources required for upgrade will be taken from msg.sender_




### level

```solidity
function level() external view returns (uint256 level)
```

Calculates current level

_Takes into an account if upgrade if finished or not_


| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Current level |


### getConfig

```solidity
function getConfig() external view returns (struct IBuilding.InitialResourceBlock[] initialResourceBlocks)
```

Returns production config for current building

_Main config that determines which resources is produced/spend by production of this building
InitialResourceBlock.perTick is value how much of resource is spend/produced by 1 worker in 1 second of production_


| Name | Type | Description |
| ---- | ---- | ----------- |
| initialResourceBlocks | struct IBuilding.InitialResourceBlock[] | Production config for current building |


### transferWorkers

```solidity
function transferWorkers(address to, uint256 amount) external
```

Transfers workers from current building to specified address

_Currently workers can be transferred from building only to its settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | An address transfer workers to |
| amount | uint256 | Amount of workers to transfer |



### transferResources

```solidity
function transferResources(string resourceName, address to, uint256 amount) external
```

Transfer specified resource from current building

_Used for withdrawing resources from production or overcapped treasury resources_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Name of resource to transfer |
| to | address | An address transfer resources to |
| amount | uint256 | Amount of resources to transfer |



### batchTransferResources

```solidity
function batchTransferResources(string[] resourcesNames, address to, uint256[] amounts) external
```

Batch resource transfer

_Same as #transferResources but for many resources at once_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesNames | string[] | Names of resources to transfer |
| to | address | An address transfer resources to |
| amounts | uint256[] | Amounts of resources to transfer |



### getMaxReservesByLevel

```solidity
function getMaxReservesByLevel(uint256 level) external view returns (uint256 maxReserves)
```

Calculates maximum amount of treasury by provided level

_Can be used to determine maximum amount of treasury by any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Building level |



### stealReserves

```solidity
function stealReserves(address to, uint256 amount) external returns (uint256 realAmount)
```

Steals resources from treasury

_Called by siege or building owner, in either case part of resources will be burned according to #registry.getRobberyFee_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | An address which will get resources |
| amount | uint256 | Amount of resources to steal, 'to' will get only part of specified 'amount', some percent of specified 'amount' will be burned |

| Name | Type | Description |
| ---- | ---- | ----------- |
| realAmount | uint256 | Real amount of resources from which stealing occurred (min(amount, reserves)) |


### burnReserves

```solidity
function burnReserves(uint256 amount) external
```

Burns building treasury

_Can be called by world asset or building owner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount of resources to burn from treasury |



### calcMaxWorkers

```solidity
function calcMaxWorkers(uint256 level) external view returns (uint256 workersAmount)
```

Calculates maximum amount of workers for specified level

_Useful to determinate maximum amount of workers on any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Level at which calculate max workers |

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersAmount | uint256 | Maximum amount of workers for specified level |


### getProducingResourceName

```solidity
function getProducingResourceName() external view returns (string resourceName)
```

Calculates producing resource name for this building

_Return value is value from #getConfig where 'isProduced'=true_


| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Name of producing resource |


### getReserves

```solidity
function getReserves(uint256 timestamp) external view returns (uint256 reserve)
```

Calculates treasury amount at specified time

_Useful for determination how much treasury will be at specific time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate amount of treasury in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| reserve | uint256 | Treasury amount at specified time |


### isResourceAcceptable

```solidity
function isResourceAcceptable(string resourceName) external view returns (bool isResourceAcceptable)
```

Calculates if building is capable to accept resource

_Return value based on #getConfig_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Name of resource |

| Name | Type | Description |
| ---- | ---- | ----------- |
| isResourceAcceptable | bool | Is building can accept resource |


### buildingName

```solidity
function buildingName() external view returns (string buildingName)
```

Returns building name

_Same value as #assetName_


| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingName | string | Building name |


