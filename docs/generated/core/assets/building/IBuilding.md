## IBuilding


Functions to read state/modify state in order to get current building parameters and/or interact with it





### BasicProduction








```solidity
struct BasicProduction {
  uint256 level;
  uint256 coefficient;
}
```

### AdvancedProduction








```solidity
struct AdvancedProduction {
  uint256 level;
  uint256 coefficient;
  uint256 additionalWorkersCapacityMultiplier;
  uint256 toBeProducedTicks;
}
```

### ProductionInfo








```solidity
struct ProductionInfo {
  uint256 lastUpdateStateTime;
  uint256 lastUpdateStateRegionTime;
  uint256 readyToBeDistributed;
  uint256 totalDebt;
}
```

### BuildingActivationInfo








```solidity
struct BuildingActivationInfo {
  uint64 activationTime;
  bool isWorkersClaimed;
}
```

### ProductionResultItem








```solidity
struct ProductionResultItem {
  bytes32 resourceTypeId;
  uint256 balanceDelta;
  bool isProduced;
}
```

### ProductionConfigItem








```solidity
struct ProductionConfigItem {
  bytes32 resourceTypeId;
  uint256 amountPerTick;
  bool isProducing;
}
```

### buildingTypeId

```solidity
function buildingTypeId() external view returns (bytes32 buildingTypeId)
```

Building type id

_Immutable, initialized on the building creation_




### relatedSettlement

```solidity
function relatedSettlement() external view returns (contract ISettlement)
```

Settlement address to which this building belongs

_Immutable, initialized on the building creation_




### basicProduction

```solidity
function basicProduction() external view returns (uint256 level, uint256 coefficient)
```

Basic production

_Contains basic production upgrade data_


| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Basic production level |
| coefficient | uint256 | Basic production coefficient |


### advancedProduction

```solidity
function advancedProduction() external view returns (uint256 level, uint256 coefficient, uint256 additionalWorkersCapacityMultiplier, uint256 toBeProducedTicks)
```

Advanced production

_Contains advanced production upgrade data_


| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Advanced production level |
| coefficient | uint256 | Advanced production coefficient |
| additionalWorkersCapacityMultiplier | uint256 | Additional workers capacity multiplier |
| toBeProducedTicks | uint256 | To be produced ticks of producing resource |


### upgradeCooldownEndTime

```solidity
function upgradeCooldownEndTime() external view returns (uint256 upgradeCooldownEndTime)
```

Upgrade cooldown end time

_Updated when #upgradeBasicProduction or #upgradeAdvancedProduction is called_


| Name | Type | Description |
| ---- | ---- | ----------- |
| upgradeCooldownEndTime | uint256 | Upgrade cooldown end time |


### givenProsperityAmount

```solidity
function givenProsperityAmount() external view returns (uint256 givenProsperityAmount)
```

Amount of prosperity given

_Contains last written given prosperity amount by building treasury_


| Name | Type | Description |
| ---- | ---- | ----------- |
| givenProsperityAmount | uint256 | Given prosperity amount |


### productionInfo

```solidity
function productionInfo() external view returns (uint256 lastUpdateStateTime, uint256 lastUpdateStateRegionTime, uint256 readyToBeDistributed, uint256 totalDebt)
```

Contains production info of the building

_Contains information related to how production is calculated_


| Name | Type | Description |
| ---- | ---- | ----------- |
| lastUpdateStateTime | uint256 | Time at which last #updateState is called |
| lastUpdateStateRegionTime | uint256 | Region time at which last #updateState is called |
| readyToBeDistributed | uint256 | Amount of produced resource ready to be distributed |
| totalDebt | uint256 | Total debt |


### distributionId

```solidity
function distributionId() external view returns (uint256)
```

Distribution id

_Initialized on creation and updated on #resetDistribution_




### producedResourceDebt

```solidity
function producedResourceDebt(address holder) external view returns (uint256)
```

Produced resource debt

_Updated when #distributeToSingleHolder or #distributeToAllShareholders is called_




### buildingActivationInfo

```solidity
function buildingActivationInfo() external view returns (uint64 activationTime, bool isWorkersClaimed)
```

Building activation info

_Updated when #activateBuilding or #claimWorkersForBuildingActivation is called_




### BasicProductionUpgraded

```solidity
event BasicProductionUpgraded(uint256 newBasicProductionLevel, uint256 newBasicProductionCoefficient)
```

Emitted when #doBasicProductionUpgrade is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| newBasicProductionLevel | uint256 | New basic production level |
| newBasicProductionCoefficient | uint256 |  |



### AdvancedProductionUpgraded

```solidity
event AdvancedProductionUpgraded(uint256 newAdvancedProductionLevel, uint256 newAdvancedProductionCoefficient)
```

Emitted when #doAdvancedProductionUpgrade is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| newAdvancedProductionLevel | uint256 | New advanced production level |
| newAdvancedProductionCoefficient | uint256 |  |



### AdvancedProductionAdditionalWorkersCapacityMultiplierUpdated

```solidity
event AdvancedProductionAdditionalWorkersCapacityMultiplierUpdated(uint256 newAdditionalWorkersCapacityMultiplier)
```

Emitted when #increaseAdditionalWorkersCapacityMultiplier or #decreaseAdditionalWorkersCapacityMultiplier


| Name | Type | Description |
| ---- | ---- | ----------- |
| newAdditionalWorkersCapacityMultiplier | uint256 | New additional workers capacity multiplier |



### DistributedToShareHolder

```solidity
event DistributedToShareHolder(bytes32 resourceTypeId, address holder, uint256 amount)
```

Emitted when #distribute is called (when resources from production are distributed to building token holders)


| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Resource type id |
| holder | address | Receiver address |
| amount | uint256 | Amount of distributed resources |



### DistributionCreated

```solidity
event DistributionCreated(uint256 newDistributionId)
```

Emitted when #_setDefaultDistribution is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| newDistributionId | uint256 | New distribution id |



### ProductionInfoUpdated

```solidity
event ProductionInfoUpdated(uint256 lastUpdateStateTime, uint256 lastUpdateStateRegionTime, uint256 readyToBeDistributed, uint256 totalDebt)
```

Emitted when productionInfo is updated


| Name | Type | Description |
| ---- | ---- | ----------- |
| lastUpdateStateTime | uint256 | Last update state time |
| lastUpdateStateRegionTime | uint256 | Last update state region time |
| readyToBeDistributed | uint256 | Ready to be distributed |
| totalDebt | uint256 | Total debt |



### ProducedResourceDebtUpdated

```solidity
event ProducedResourceDebtUpdated(address distributionNftHolder, uint256 newDebt)
```

Emitted when producedResourceDebt updated for distributionNftHolder


| Name | Type | Description |
| ---- | ---- | ----------- |
| distributionNftHolder | address | Distribution nft holder |
| newDebt | uint256 | New debt |



### WorkersClaimed

```solidity
event WorkersClaimed()
```

Emitted when #claimWorkersForBuildingActivation is called





### OnlyDistributions

```solidity
error OnlyDistributions()
```

Thrown when attempting to call action which can be called only by Distributions





### OnlySettlementOwner

```solidity
error OnlySettlementOwner()
```

Thrown when attempting to call action which can be called only by settlement owner





### OnlyRulerOrWorldAssetFromSameEra

```solidity
error OnlyRulerOrWorldAssetFromSameEra()
```

Thrown when attempting to call action which can be called only by ruler or world asset





### DistributionResetNotAllowedWhenTreasuryThresholdNotMet

```solidity
error DistributionResetNotAllowedWhenTreasuryThresholdNotMet()
```

Thrown when attempting to reset distribution of building tokens when its not allowed





### BuildingCannotBeUpgradedWhileItsNotActivated

```solidity
error BuildingCannotBeUpgradedWhileItsNotActivated()
```

Thrown when attempting to upgrade building when its not activated





### BuildingCannotBeUpgradedWhileUpgradeIsOnCooldown

```solidity
error BuildingCannotBeUpgradedWhileUpgradeIsOnCooldown()
```

Thrown when attempting to upgrade building when upgrades are on cooldown





### BuildingCannotBeActivatedMoreThanOnce

```solidity
error BuildingCannotBeActivatedMoreThanOnce()
```

Thrown when attempting to activate building more than once in its lifetime





### BuildingCannotGiveWorkersBeforeActivationCooldownFinished

```solidity
error BuildingCannotGiveWorkersBeforeActivationCooldownFinished()
```

Thrown when attempting to claim workers before activation cooldown finished





### BuildingCannotGiveWorkersMoreThanOnce

```solidity
error BuildingCannotGiveWorkersMoreThanOnce()
```

Thrown when attempting to claim workers more than once





### resetDistribution

```solidity
function resetDistribution() external
```

Resets current building distribution

_Creates new distribution Nft and mints it to current settlement owner_




### handleProductionResourcesChanged

```solidity
function handleProductionResourcesChanged() external
```

Callback which recalculates production. Called when resources related to production of this building is transferred from/to this building

_Even though function is opened, it is auto-called by transfer method. Standalone calls provide 0 impact._




### updateState

```solidity
function updateState() external
```

Updates state of this building up to block.timestamp

_Updates building production minting treasury and increasing #production.readyToBeDistributed_




### updateDebtsAccordingToNewDistributionsAmounts

```solidity
function updateDebtsAccordingToNewDistributionsAmounts(address from, address to, uint256 amount) external
```

Updates debts for shareholders whenever their share part changes

_Even though function is opened, it can be called only by distributions_

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | From address |
| to | address | To address |
| amount | uint256 | Amount |



### distributeToSingleShareholder

```solidity
function distributeToSingleShareholder(address holder) external
```

Distributes produced resource to single shareholder

_Useful to taking part of the resource from the building for single shareholder (to not pay gas for minting for all shareholders)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| holder | address | Holder |



### distributeToAllShareholders

```solidity
function distributeToAllShareholders() external
```

Distributes produces resource to all shareholders

_Useful to get full produced resources to all shareholders_




### getBuildingCoefficient

```solidity
function getBuildingCoefficient(uint256 level) external pure returns (uint256 buildingCoefficient)
```

Calculates building coefficient by provided level

_Used to determine max treasury amount and new production coefficients_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Building level |

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingCoefficient | uint256 | Building coefficient |


### getAssignedWorkers

```solidity
function getAssignedWorkers() external view returns (uint256 assignedWorkersAmount)
```

Calculates amount of workers currently sitting in this building

_Same as workers.balanceOf(buildingAddress)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| assignedWorkersAmount | uint256 | Amount of assigned workers |


### getResourcesAmount

```solidity
function getResourcesAmount(bytes32 resourceTypeId, uint256 timestamp) external view returns (uint256 resourcesAmount)
```

Calculates real amount of provided resource in building related to its production at provided time

_Useful for determination how much of production resource (either producing and spending) at the specific time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Type id of resource related to production |
| timestamp | uint256 | Time at which calculate amount of resources in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesAmount | uint256 | Real amount of provided resource in building related to its production at provided time |


### getProductionResult

```solidity
function getProductionResult(uint256 timestamp) external view returns (struct IBuilding.ProductionResultItem[] productionResult)
```

Calculates production resources changes at provided time

_Useful for determination how much of all production will be burned/produced at the specific time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate amount of resources in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| productionResult | struct IBuilding.ProductionResultItem[] | Production resources changes at provided time |


### getUpgradePrice

```solidity
function getUpgradePrice(uint256 level) external view returns (uint256 price)
```

Calculates upgrade price by provided level

_Useful for determination how much upgrade will cost at any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Level at which calculate price |

| Name | Type | Description |
| ---- | ---- | ----------- |
| price | uint256 | Amount of resources needed for upgrade |


### getBasicUpgradeCooldownDuration

```solidity
function getBasicUpgradeCooldownDuration(uint256 level) external view returns (uint256 upgradeCooldownDuration)
```

Calculates basic upgrade duration for provided level

_If level=1 then returned value will be duration which is taken for upgrading from 1 to 2 level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | At which level calculate upgrade duration |

| Name | Type | Description |
| ---- | ---- | ----------- |
| upgradeCooldownDuration | uint256 | Upgrade cooldown duration |


### getAdvancedUpgradeCooldownDuration

```solidity
function getAdvancedUpgradeCooldownDuration(uint256 level) external view returns (uint256 upgradeCooldownDuration)
```

Calculates advanced upgrade duration for provided level

_If level=1 then returned value will be duration which is taken for upgrading from 1 to 2 level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | At which level calculate upgrade duration |

| Name | Type | Description |
| ---- | ---- | ----------- |
| upgradeCooldownDuration | uint256 | Upgrade cooldown duration |


### activateBuilding

```solidity
function activateBuilding(address resourcesOwner) external
```

Activates building

_Necessary resources for activation will be taken either from msg.sender or resourcesOwner (if resource.allowance allows it)
If resourcesOwner == address(0) -> resources will be taken from msg.sender
If resourcesOwner != address(0) and resourcesOwner has given allowance to msg.sender >= upgradePrice -> resources will be taken from resourcesOwner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesOwner | address | Resources owner |



### claimWorkersForBuildingActivation

```solidity
function claimWorkersForBuildingActivation() external
```

Claims workers for building activation

_Workers can be claimed only once and after building cooldown duration after activation has passed_




### upgradeBasicProduction

```solidity
function upgradeBasicProduction(address resourcesOwner) external
```

Upgrades basic production

_Necessary resources for upgrade will be taken either from msg.sender or resourcesOwner (if resource.allowance allows it)
If resourcesOwner == address(0) -> resources will be taken from msg.sender
If resourcesOwner != address(0) and resourcesOwner has given allowance to msg.sender >= upgradePrice -> resources will be taken from resourcesOwner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesOwner | address | Resources owner |



### upgradeAdvancedProduction

```solidity
function upgradeAdvancedProduction(address resourcesOwner) external
```

Upgrades advanced production

_Necessary resources for upgrade will be taken either from msg.sender or resourcesOwner (if resource.allowance allows it)
If resourcesOwner == address(0) -> resources will be taken from msg.sender
If resourcesOwner != address(0) and resourcesOwner has given allowance to msg.sender >= upgradePrice -> resources will be taken from resourcesOwner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesOwner | address | Resources owner |



### getBuildingLevel

```solidity
function getBuildingLevel() external view returns (uint256 level)
```

Calculates current level

_Takes into an account if upgrades are ended or not_


| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Current building level |


### getConfig

```solidity
function getConfig() external view returns (struct IBuilding.ProductionConfigItem[] productionConfigItems)
```

Returns production config for current building

_Main config that determines which resources is produced/spend by production of this building
ProductionConfigItem.amountPerTick is value how much of resource is spend/produced by 1 worker in 1 tick of production_


| Name | Type | Description |
| ---- | ---- | ----------- |
| productionConfigItems | struct IBuilding.ProductionConfigItem[] | Production config for current building |


### getMaxTreasuryByLevel

```solidity
function getMaxTreasuryByLevel(uint256 level) external view returns (uint256 maxTreasury)
```

Calculates maximum amount of treasury by provided level

_Can be used to determine maximum amount of treasury by any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Building level |



### stealTreasury

```solidity
function stealTreasury(address stealerSettlementAddress, uint256 amount) external returns (uint256 stolenAmount, uint256 burnedAmount)
```

Steals resources from treasury

_Called by siege, resources will be stolen into stealer settlement building treasury_

| Name | Type | Description |
| ---- | ---- | ----------- |
| stealerSettlementAddress | address | Settlement address which will get resources |
| amount | uint256 | Amount of resources to steal and burn |

| Name | Type | Description |
| ---- | ---- | ----------- |
| stolenAmount | uint256 | Amount of stolen resources |
| burnedAmount | uint256 | Amount of burned resources |


### burnTreasury

```solidity
function burnTreasury(uint256 amount) external
```

Burns building treasury

_Can be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount of resources to burn from treasury |



### increaseAdditionalWorkersCapacityMultiplier

```solidity
function increaseAdditionalWorkersCapacityMultiplier(uint256 capacityAmount) external
```

Increases additional workers capacity multiplier

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| capacityAmount | uint256 | Capacity amount |



### decreaseAdditionalWorkersCapacityMultiplier

```solidity
function decreaseAdditionalWorkersCapacityMultiplier(uint256 capacityAmount) external
```

Decreases additional workers capacity multiplier

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| capacityAmount | uint256 | Capacity amount |



### getWorkersCapacity

```solidity
function getWorkersCapacity() external view returns (uint256 workersCapacity)
```

Calculates workers capacity (maximum amount of workers)

_Used in determination of determinate maximum amount of workers_


| Name | Type | Description |
| ---- | ---- | ----------- |
| workersCapacity | uint256 | Workers capacity |


### getProducingResourceTypeId

```solidity
function getProducingResourceTypeId() external view returns (bytes32 resourceTypeId)
```

Calculates producing resource type id for this building

_Return value is value from #getConfig where 'isProducing'=true_


| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Type id of producing resource |


### getTreasuryAmount

```solidity
function getTreasuryAmount(uint256 timestamp) external view returns (uint256 treasuryAmount)
```

Calculates treasury amount at specified time

_Useful for determination how much treasury will be at specific time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate amount of treasury in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| treasuryAmount | uint256 | Treasury amount at specified time |


### isResourceAcceptable

```solidity
function isResourceAcceptable(bytes32 resourceTypeId) external view returns (bool isResourceAcceptable)
```

Calculates if building is capable to accept resource

_Return value based on #getConfig_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Resource type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| isResourceAcceptable | bool | Is building can accept resource |


### getAvailableForAdvancedProductionWorkersCapacity

```solidity
function getAvailableForAdvancedProductionWorkersCapacity() external view returns (uint256)
```

Calculates capacity of available workers for advanced production

_Difference between #getWorkersCapacity and #getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier_




### getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier

```solidity
function getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier() external view returns (uint256)
```

Calculates additional workers 'granted' from capacity multiplier

_Return value based on current advancedProduction.additionalWorkersCapacityMultiplier_




