## Building








### currentSettlement

```solidity
contract ISettlement currentSettlement
```

Settlement address to which this building belongs

_Immutable, initialized on the building creation_




### buildingState

```solidity
struct IBuilding.BuildingState buildingState
```

Contains current common state of the building

_Some parameters may depend on time (if upgrade is finished building must be considered as upgraded). 'upgrading' parameter will be deprecated in favor of presence 'timeUpgradeFinish' (whenever zero or not zero)_


| Name | Type | Description |
| ---- | ---- | ----------- |


### production

```solidity
struct IBuilding.Production production
```

Contains current production state of the building

_Contains information related to how production is calculated_


| Name | Type | Description |
| ---- | ---- | ----------- |


### distributionId

```solidity
uint256 distributionId
```

Distribution id

_Initialized on creation and updated on #resetDistribution_




### onlySettlementOwner

```solidity
modifier onlySettlementOwner()
```



_Allows caller to be only settlement owner_




### onlyRulerOrWorldAssetFromSameEpoch

```solidity
modifier onlyRulerOrWorldAssetFromSameEpoch()
```



_Allows caller to be ruler or world or world asset_




### getBuildingCoefficient

```solidity
function getBuildingCoefficient(uint256 _level) internal view returns (uint256)
```



_Calculates building coefficient_




### setDefaultDistribution

```solidity
function setDefaultDistribution() internal
```



_Creates default distribution (all possible tokens will be minted to current settlement owner)_




### distribute

```solidity
function distribute(string resourceName, uint256 amount) internal
```



_Distributes produced amount of resource between treasury and building token holders_




### updateReserves

```solidity
function updateReserves() internal virtual
```



_Updates building treasury according to changed amount of resources in building_




### updateProsperity

```solidity
function updateProsperity(uint256 reservesBefore, uint256 reservesAfter) internal virtual
```



_Synchronizes settlement prosperity according to changed amount of resources in treasury_




### recalculateProduction

```solidity
function recalculateProduction() internal virtual
```



_Recalculates production structure according to new resource balances_




### getCurrentTime

```solidity
function getCurrentTime() internal view returns (uint256)
```



_Calculates current game time, taking into an account game finish time_




### getProductionMultiplier

```solidity
function getProductionMultiplier() internal view returns (uint256)
```



_Calculates production multiplier according to current workers and global multiplier_




### calculateProductionTicksAmount

```solidity
function calculateProductionTicksAmount() internal view returns (uint256)
```



_Calculates amount of production ticks for current building according to its resources balances_




### isBuildingTokenRecallAllowed

```solidity
function isBuildingTokenRecallAllowed() internal returns (bool)
```



_Calculates is building token recall allowed according to building token transfer threshold_




### init

```solidity
function init(address settlementAddress) public virtual
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### productionChanged

```solidity
function productionChanged() public virtual
```

Callback which recalculates production. Called when workers or resources, which related to production of this building, is transferred from/to this building

_Even though function is opened, it is auto-called by transfer method. Standalone calls provide 0 impact._




### calcMaxWorkers

```solidity
function calcMaxWorkers(uint256 _level) public view virtual returns (uint256)
```

Calculates maximum amount of workers for specified level

_Useful to determinate maximum amount of workers on any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### applyState

```solidity
function applyState() public virtual
```

Applies state of this building up to block.timestamp

_Useful if 'harvesting' resources from building production to building token holders_




### calcCumulativeResource

```solidity
function calcCumulativeResource(string _resourceName, uint256 _timestamp) public view virtual returns (uint256)
```

Calculates real amount of provided resource in building related to its production at provided time

_Useful for determination how much of production resource (either producing and spending) at the specific time
Probably will be renamed in near future for more representative formulation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _resourceName | string |  |
| _timestamp | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### calculateCumulativeState

```solidity
function calculateCumulativeState(uint256 timestamp) public view virtual returns (struct IBuilding.ProductionResult[])
```

Calculates production resources changes at provided time

_Useful for determination how much of all production will be burned/produced at the specific time
Probably will be renamed in near future for more representative formulation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate amount of resources in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IBuilding.ProductionResult[] |  |


### resetDistribution

```solidity
function resetDistribution() public virtual
```

Resets current building distribution

_Creates new distribution Nft and mints it to current settlement owner_




### isResourceAcceptable

```solidity
function isResourceAcceptable(string _resourceName) public view returns (bool)
```

Calculates if building is capable to accept resource

_Return value based on #getConfig_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _resourceName | string |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### batchTransferResources

```solidity
function batchTransferResources(string[] resourcesNames, address to, uint256[] amounts) public
```

Batch resource transfer

_Same as #transferResources but for many resources at once_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesNames | string[] | Names of resources to transfer |
| to | address | An address transfer resources to |
| amounts | uint256[] | Amounts of resources to transfer |



### transferWorkers

```solidity
function transferWorkers(address to, uint256 amount) public
```

Transfers workers from current building to specified address

_Currently workers can be transferred from building only to its settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | An address transfer workers to |
| amount | uint256 | Amount of workers to transfer |



### transferResources

```solidity
function transferResources(string resourceName, address to, uint256 amount) public
```

Transfer specified resource from current building

_Used for withdrawing resources from production or overcapped treasury resources_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Name of resource to transfer |
| to | address | An address transfer resources to |
| amount | uint256 | Amount of resources to transfer |



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


### level

```solidity
function level() public view returns (uint256)
```

Calculates current level

_Takes into an account if upgrade if finished or not_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### workers

```solidity
function workers() public view virtual returns (uint256)
```

Calculates amount of workers currently sitting in this building

_Same as workers.balanceOf(buildingAddress)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### upgradeStart

```solidity
function upgradeStart() public virtual
```

Starts building upgrade

_Resources required for upgrade will be taken from msg.sender_




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


### calcWoodUpgradePrice

```solidity
function calcWoodUpgradePrice(uint256 _level) public view virtual returns (uint256)
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
function calcOreUpgradePrice(uint256 _level) public view virtual returns (uint256)
```

Calculates ore upgrade price for provided level

_Will be deprecated in favor of calcUpgradePrice(level, "ORE")_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getProducingResourceName

```solidity
function getProducingResourceName() public view virtual returns (string)
```

Calculates producing resource name for this building

_Return value is value from #getConfig where 'isProduced'=true_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string |  |


### maxWorkers

```solidity
function maxWorkers() public view returns (uint256)
```

Calculates Maximum amount of workers this building can have

_Max amount of workers changed by building level. This function takes into account current block.timestamp for its current level. Basically if building is upgraded returns proper amount of max workers available._


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getReserves

```solidity
function getReserves(uint256 _timestamp) public view virtual returns (uint256)
```

Calculates treasury amount at specified time

_Useful for determination how much treasury will be at specific time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _timestamp | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getMaxReservesByLevel

```solidity
function getMaxReservesByLevel(uint256 _level) public view virtual returns (uint256)
```

Calculates maximum amount of treasury by provided level

_Can be used to determine maximum amount of treasury by any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |



### stealReserves

```solidity
function stealReserves(address to, uint256 amount) public returns (uint256)
```

Steals resources from treasury

_Called by siege or building owner, in either case part of resources will be burned according to #registry.getRobberyFee_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | An address which will get resources |
| amount | uint256 | Amount of resources to steal, 'to' will get only part of specified 'amount', some percent of specified 'amount' will be burned |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### burnReserves

```solidity
function burnReserves(uint256 burnAmount) public
```

Burns building treasury

_Can be called by world asset or building owner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| burnAmount | uint256 |  |



### getConfig

```solidity
function getConfig() public view virtual returns (struct IBuilding.InitialResourceBlock[] initialResourceBlocks)
```

Returns production config for current building

_Main config that determines which resources is produced/spend by production of this building
InitialResourceBlock.perTick is value how much of resource is spend/produced by 1 worker in 1 second of production_


| Name | Type | Description |
| ---- | ---- | ----------- |
| initialResourceBlocks | struct IBuilding.InitialResourceBlock[] | Production config for current building |


### buildingName

```solidity
function buildingName() public view virtual returns (string)
```

Returns building name

_Same value as #assetName_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string |  |


## Building








### currentSettlement

```solidity
contract ISettlement currentSettlement
```

Settlement address to which this building belongs

_Immutable, initialized on the building creation_




### buildingState

```solidity
struct IBuilding.BuildingState buildingState
```

Contains current common state of the building

_Some parameters may depend on time (if upgrade is finished building must be considered as upgraded). 'upgrading' parameter will be deprecated in favor of presence 'timeUpgradeFinish' (whenever zero or not zero)_


| Name | Type | Description |
| ---- | ---- | ----------- |


### production

```solidity
struct IBuilding.Production production
```

Contains current production state of the building

_Contains information related to how production is calculated_


| Name | Type | Description |
| ---- | ---- | ----------- |


### distributionId

```solidity
uint256 distributionId
```

Distribution id

_Initialized on creation and updated on #resetDistribution_




### onlySettlementOwner

```solidity
modifier onlySettlementOwner()
```



_Allows caller to be only settlement owner_




### onlyRulerOrWorldAssetFromSameEpoch

```solidity
modifier onlyRulerOrWorldAssetFromSameEpoch()
```



_Allows caller to be ruler or world or world asset_




### getBuildingCoefficient

```solidity
function getBuildingCoefficient(uint256 _level) internal view returns (uint256)
```



_Calculates building coefficient_




### setDefaultDistribution

```solidity
function setDefaultDistribution() internal
```



_Creates default distribution (all possible tokens will be minted to current settlement owner)_




### distribute

```solidity
function distribute(string resourceName, uint256 amount) internal
```



_Distributes produced amount of resource between treasury and building token holders_




### updateReserves

```solidity
function updateReserves() internal virtual
```



_Updates building treasury according to changed amount of resources in building_




### updateProsperity

```solidity
function updateProsperity(uint256 reservesBefore, uint256 reservesAfter) internal virtual
```



_Synchronizes settlement prosperity according to changed amount of resources in treasury_




### recalculateProduction

```solidity
function recalculateProduction() internal virtual
```



_Recalculates production structure according to new resource balances_




### getCurrentTime

```solidity
function getCurrentTime() internal view returns (uint256)
```



_Calculates current game time, taking into an account game finish time_




### getProductionMultiplier

```solidity
function getProductionMultiplier() internal view returns (uint256)
```



_Calculates production multiplier according to current workers and global multiplier_




### calculateProductionTicksAmount

```solidity
function calculateProductionTicksAmount() internal view returns (uint256)
```



_Calculates amount of production ticks for current building according to its resources balances_




### isBuildingTokenRecallAllowed

```solidity
function isBuildingTokenRecallAllowed() internal returns (bool)
```



_Calculates is building token recall allowed according to building token transfer threshold_




### init

```solidity
function init(address settlementAddress) public virtual
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### productionChanged

```solidity
function productionChanged() public virtual
```

Callback which recalculates production. Called when workers or resources, which related to production of this building, is transferred from/to this building

_Even though function is opened, it is auto-called by transfer method. Standalone calls provide 0 impact._




### calcMaxWorkers

```solidity
function calcMaxWorkers(uint256 _level) public view virtual returns (uint256)
```

Calculates maximum amount of workers for specified level

_Useful to determinate maximum amount of workers on any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### applyState

```solidity
function applyState() public virtual
```

Applies state of this building up to block.timestamp

_Useful if 'harvesting' resources from building production to building token holders_




### calcCumulativeResource

```solidity
function calcCumulativeResource(string _resourceName, uint256 _timestamp) public view virtual returns (uint256)
```

Calculates real amount of provided resource in building related to its production at provided time

_Useful for determination how much of production resource (either producing and spending) at the specific time
Probably will be renamed in near future for more representative formulation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _resourceName | string |  |
| _timestamp | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### calculateCumulativeState

```solidity
function calculateCumulativeState(uint256 timestamp) public view virtual returns (struct IBuilding.ProductionResult[])
```

Calculates production resources changes at provided time

_Useful for determination how much of all production will be burned/produced at the specific time
Probably will be renamed in near future for more representative formulation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate amount of resources in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IBuilding.ProductionResult[] |  |


### resetDistribution

```solidity
function resetDistribution() public virtual
```

Resets current building distribution

_Creates new distribution Nft and mints it to current settlement owner_




### isResourceAcceptable

```solidity
function isResourceAcceptable(string _resourceName) public view returns (bool)
```

Calculates if building is capable to accept resource

_Return value based on #getConfig_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _resourceName | string |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### batchTransferResources

```solidity
function batchTransferResources(string[] resourcesNames, address to, uint256[] amounts) public
```

Batch resource transfer

_Same as #transferResources but for many resources at once_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesNames | string[] | Names of resources to transfer |
| to | address | An address transfer resources to |
| amounts | uint256[] | Amounts of resources to transfer |



### transferWorkers

```solidity
function transferWorkers(address to, uint256 amount) public
```

Transfers workers from current building to specified address

_Currently workers can be transferred from building only to its settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | An address transfer workers to |
| amount | uint256 | Amount of workers to transfer |



### transferResources

```solidity
function transferResources(string resourceName, address to, uint256 amount) public
```

Transfer specified resource from current building

_Used for withdrawing resources from production or overcapped treasury resources_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Name of resource to transfer |
| to | address | An address transfer resources to |
| amount | uint256 | Amount of resources to transfer |



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


### level

```solidity
function level() public view returns (uint256)
```

Calculates current level

_Takes into an account if upgrade if finished or not_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### workers

```solidity
function workers() public view virtual returns (uint256)
```

Calculates amount of workers currently sitting in this building

_Same as workers.balanceOf(buildingAddress)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### upgradeStart

```solidity
function upgradeStart() public virtual
```

Starts building upgrade

_Resources required for upgrade will be taken from msg.sender_




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


### calcWoodUpgradePrice

```solidity
function calcWoodUpgradePrice(uint256 _level) public view virtual returns (uint256)
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
function calcOreUpgradePrice(uint256 _level) public view virtual returns (uint256)
```

Calculates ore upgrade price for provided level

_Will be deprecated in favor of calcUpgradePrice(level, "ORE")_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getProducingResourceName

```solidity
function getProducingResourceName() public view virtual returns (string)
```

Calculates producing resource name for this building

_Return value is value from #getConfig where 'isProduced'=true_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string |  |


### maxWorkers

```solidity
function maxWorkers() public view returns (uint256)
```

Calculates Maximum amount of workers this building can have

_Max amount of workers changed by building level. This function takes into account current block.timestamp for its current level. Basically if building is upgraded returns proper amount of max workers available._


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getReserves

```solidity
function getReserves(uint256 _timestamp) public view virtual returns (uint256)
```

Calculates treasury amount at specified time

_Useful for determination how much treasury will be at specific time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _timestamp | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getMaxReservesByLevel

```solidity
function getMaxReservesByLevel(uint256 _level) public view virtual returns (uint256)
```

Calculates maximum amount of treasury by provided level

_Can be used to determine maximum amount of treasury by any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _level | uint256 |  |



### stealReserves

```solidity
function stealReserves(address to, uint256 amount) public returns (uint256)
```

Steals resources from treasury

_Called by siege or building owner, in either case part of resources will be burned according to #registry.getRobberyFee_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | An address which will get resources |
| amount | uint256 | Amount of resources to steal, 'to' will get only part of specified 'amount', some percent of specified 'amount' will be burned |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### burnReserves

```solidity
function burnReserves(uint256 burnAmount) public
```

Burns building treasury

_Can be called by world asset or building owner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| burnAmount | uint256 |  |



### getConfig

```solidity
function getConfig() public view virtual returns (struct IBuilding.InitialResourceBlock[] initialResourceBlocks)
```

Returns production config for current building

_Main config that determines which resources is produced/spend by production of this building
InitialResourceBlock.perTick is value how much of resource is spend/produced by 1 worker in 1 second of production_


| Name | Type | Description |
| ---- | ---- | ----------- |
| initialResourceBlocks | struct IBuilding.InitialResourceBlock[] | Production config for current building |


### buildingName

```solidity
function buildingName() public view virtual returns (string)
```

Returns building name

_Same value as #assetName_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | string |  |


