## Building








### relatedSettlement

```solidity
contract ISettlement relatedSettlement
```

Settlement address to which this building belongs

_Immutable, initialized on the building creation_




### buildingTypeId

```solidity
bytes32 buildingTypeId
```

Building type id

_Immutable, initialized on the building creation_




### basicProduction

```solidity
struct IBuilding.BasicProduction basicProduction
```

Basic production

_Contains basic production upgrade data_


| Name | Type | Description |
| ---- | ---- | ----------- |


### advancedProduction

```solidity
struct IBuilding.AdvancedProduction advancedProduction
```

Advanced production

_Contains advanced production upgrade data_


| Name | Type | Description |
| ---- | ---- | ----------- |


### upgradeCooldownEndTime

```solidity
uint256 upgradeCooldownEndTime
```

Upgrade cooldown end time

_Updated when #upgradeBasicProduction or #upgradeAdvancedProduction is called_


| Name | Type | Description |
| ---- | ---- | ----------- |


### givenProsperityAmount

```solidity
uint256 givenProsperityAmount
```

Amount of prosperity given

_Contains last written given prosperity amount by building treasury_


| Name | Type | Description |
| ---- | ---- | ----------- |


### productionInfo

```solidity
struct IBuilding.ProductionInfo productionInfo
```

Contains production info of the building

_Contains information related to how production is calculated_


| Name | Type | Description |
| ---- | ---- | ----------- |


### distributionId

```solidity
uint256 distributionId
```

Distribution id

_Initialized on creation and updated on #resetDistribution_




### producedResourceDebt

```solidity
mapping(address => uint256) producedResourceDebt
```

Produced resource debt

_Updated when #distributeToSingleHolder or #distributeToAllShareholders is called_




### onlyDistributions

```solidity
modifier onlyDistributions()
```



_Only distributions contract modifier
Modifier is calling internal function in order to reduce contract size_




### onlySettlementOwner

```solidity
modifier onlySettlementOwner()
```



_Only settlement owner modifier
Modifier is calling internal function in order to reduce contract size_




### onlyRulerOrWorldAssetFromSameEra

```solidity
modifier onlyRulerOrWorldAssetFromSameEra()
```



_Only ruler or world asset from same era modifier
Modifier is calling internal function in order to reduce contract size_




### init

```solidity
function init(bytes initParams) public virtual
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### onERC1155Received

```solidity
function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes data) external returns (bytes4)
```



_Handles the receipt of a single ERC1155 token type. This function is
called at the end of a `safeTransferFrom` after the balance has been updated.

NOTE: To accept the transfer, this must return
`bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))`
(i.e. 0xf23a6e61, or its own function selector)._

| Name | Type | Description |
| ---- | ---- | ----------- |
| operator | address | The address which initiated the transfer (i.e. msg.sender) |
| from | address | The address which previously owned the token |
| id | uint256 | The ID of the token being transferred |
| value | uint256 | The amount of tokens being transferred |
| data | bytes | Additional data with no specified format |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes4 | `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))` if transfer is allowed |


### onERC1155BatchReceived

```solidity
function onERC1155BatchReceived(address operator, address from, uint256[] ids, uint256[] values, bytes data) external returns (bytes4)
```



_Handles the receipt of a multiple ERC1155 token types. This function
is called at the end of a `safeBatchTransferFrom` after the balances have
been updated.

NOTE: To accept the transfer(s), this must return
`bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`
(i.e. 0xbc197c81, or its own function selector)._

| Name | Type | Description |
| ---- | ---- | ----------- |
| operator | address | The address which initiated the batch transfer (i.e. msg.sender) |
| from | address | The address which previously owned the token |
| ids | uint256[] | An array containing ids of each token being transferred (order and length must match values array) |
| values | uint256[] | An array containing amounts of each token being transferred (order and length must match ids array) |
| data | bytes | Additional data with no specified format |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes4 | `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))` if transfer is allowed |


### handleProductionResourcesChanged

```solidity
function handleProductionResourcesChanged() public virtual
```

Callback which recalculates production. Called when resources related to production of this building is transferred from/to this building

_Even though function is opened, it is auto-called by transfer method. Standalone calls provide 0 impact._




### updateState

```solidity
function updateState() public virtual
```

Updates state of this building up to block.timestamp

_Updates building production minting treasury and increasing #production.readyToBeDistributed_




### updateDebtsAccordingToNewDistributionsAmounts

```solidity
function updateDebtsAccordingToNewDistributionsAmounts(address from, address to, uint256 amount) public
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
function distributeToSingleShareholder(address holder) public
```

Distributes produced resource to single shareholder

_Useful to taking part of the resource from the building for single shareholder (to not pay gas for minting for all shareholders)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| holder | address | Holder |



### distributeToAllShareholders

```solidity
function distributeToAllShareholders() public
```

Distributes produces resource to all shareholders

_Useful to get full produced resources to all shareholders_




### getResourcesAmount

```solidity
function getResourcesAmount(bytes32 resourceTypeId, uint256 timestamp) public view virtual returns (uint256)
```

Calculates real amount of provided resource in building related to its production at provided time

_Useful for determination how much of production resource (either producing and spending) at the specific time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Type id of resource related to production |
| timestamp | uint256 | Time at which calculate amount of resources in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getProductionResult

```solidity
function getProductionResult(uint256 timestamp) public view virtual returns (struct IBuilding.ProductionResultItem[])
```

Calculates production resources changes at provided time

_Useful for determination how much of all production will be burned/produced at the specific time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate amount of resources in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | struct IBuilding.ProductionResultItem[] |  |


### getBuildingCoefficient

```solidity
function getBuildingCoefficient(uint256 level) public pure returns (uint256)
```

Calculates building coefficient by provided level

_Used to determine max treasury amount and new production coefficients_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Building level |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### resetDistribution

```solidity
function resetDistribution() public virtual
```

Resets current building distribution

_Creates new distribution Nft and mints it to current settlement owner_




### isResourceAcceptable

```solidity
function isResourceAcceptable(bytes32 resourceTypeId) public view returns (bool)
```

Calculates if building is capable to accept resource

_Return value based on #getConfig_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Resource type id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### removeResourcesAndWorkers

```solidity
function removeResourcesAndWorkers(address workersReceiverAddress, uint256 workersAmount, address resourcesReceiverAddress, bytes32[] resourceTypeIds, uint256[] resourcesAmounts) public
```

Transfers game resources and workers from building to provided addresses

_Removes resources+workers from building in single transaction_

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersReceiverAddress | address | Workers receiver address (building or settlement) |
| workersAmount | uint256 | Workers amount (in 1e18 precision) |
| resourcesReceiverAddress | address | Resources receiver address |
| resourceTypeIds | bytes32[] | Resource type ids |
| resourcesAmounts | uint256[] | Resources amounts |



### getUpgradePrice

```solidity
function getUpgradePrice(uint256 level) public view virtual returns (uint256)
```

Calculates upgrade price by provided level

_Useful for determination how much upgrade will cost at any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Level at which calculate price |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getBuildingLevel

```solidity
function getBuildingLevel() public view returns (uint256)
```

Calculates current level

_Takes into an account if upgrades are ended or not_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getAssignedWorkers

```solidity
function getAssignedWorkers() public view virtual returns (uint256)
```

Calculates amount of workers currently sitting in this building

_Same as workers.balanceOf(buildingAddress)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### upgradeBasicProduction

```solidity
function upgradeBasicProduction(address resourcesOwner) public virtual
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
function upgradeAdvancedProduction(address resourcesOwner) public virtual
```

Upgrades advanced production

_Necessary resources for upgrade will be taken either from msg.sender or resourcesOwner (if resource.allowance allows it)
If resourcesOwner == address(0) -> resources will be taken from msg.sender
If resourcesOwner != address(0) and resourcesOwner has given allowance to msg.sender >= upgradePrice -> resources will be taken from resourcesOwner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesOwner | address | Resources owner |



### getBasicUpgradeCooldownDuration

```solidity
function getBasicUpgradeCooldownDuration(uint256 level) public view virtual returns (uint256)
```

Calculates basic upgrade duration for provided level

_If level=1 then returned value will be duration which is taken for upgrading from 1 to 2 level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | At which level calculate upgrade duration |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getAdvancedUpgradeCooldownDuration

```solidity
function getAdvancedUpgradeCooldownDuration(uint256 level) public view virtual returns (uint256)
```

Calculates advanced upgrade duration for provided level

_If level=1 then returned value will be duration which is taken for upgrading from 1 to 2 level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | At which level calculate upgrade duration |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getProducingResourceTypeId

```solidity
function getProducingResourceTypeId() public view virtual returns (bytes32)
```

Calculates producing resource type id for this building

_Return value is value from #getConfig where 'isProducing'=true_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 |  |


### getWorkersCapacity

```solidity
function getWorkersCapacity() public view returns (uint256)
```

Calculates workers capacity (maximum amount of workers)

_Used in determination of determinate maximum amount of workers_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getTreasuryAmount

```solidity
function getTreasuryAmount(uint256 timestamp) public view virtual returns (uint256)
```

Calculates treasury amount at specified time

_Useful for determination how much treasury will be at specific time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate amount of treasury in building. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getMaxTreasuryByLevel

```solidity
function getMaxTreasuryByLevel(uint256 level) public view virtual returns (uint256)
```

Calculates maximum amount of treasury by provided level

_Can be used to determine maximum amount of treasury by any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Building level |



### stealTreasury

```solidity
function stealTreasury(address stealerSettlementAddress, uint256 amount) public returns (uint256, uint256)
```

Steals resources from treasury

_Called by siege, resources will be stolen into stealer settlement building treasury_

| Name | Type | Description |
| ---- | ---- | ----------- |
| stealerSettlementAddress | address | Settlement address which will get resources |
| amount | uint256 | Amount of resources to steal and burn |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


### burnTreasury

```solidity
function burnTreasury(uint256 burnAmount) public
```

Burns building treasury

_Can be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| burnAmount | uint256 |  |



### increaseAdditionalWorkersCapacityMultiplier

```solidity
function increaseAdditionalWorkersCapacityMultiplier(uint256 capacityAmount) public
```

Increases additional workers capacity multiplier

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| capacityAmount | uint256 | Capacity amount |



### decreaseAdditionalWorkersCapacityMultiplier

```solidity
function decreaseAdditionalWorkersCapacityMultiplier(uint256 capacityAmount) public
```

Decreases additional workers capacity multiplier

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| capacityAmount | uint256 | Capacity amount |



### getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier

```solidity
function getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier() public view returns (uint256)
```

Calculates additional workers 'granted' from capacity multiplier

_Return value based on current advancedProduction.additionalWorkersCapacityMultiplier_




### getAvailableForAdvancedProductionWorkersCapacity

```solidity
function getAvailableForAdvancedProductionWorkersCapacity() public view returns (uint256)
```

Calculates capacity of available workers for advanced production

_Difference between #getWorkersCapacity and #getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier_




### getConfig

```solidity
function getConfig() public view virtual returns (struct IBuilding.ProductionConfigItem[] productionConfigItems)
```

Returns production config for current building

_Main config that determines which resources is produced/spend by production of this building
ProductionConfigItem.amountPerTick is value how much of resource is spend/produced by 1 worker in 1 tick of production_


| Name | Type | Description |
| ---- | ---- | ----------- |
| productionConfigItems | struct IBuilding.ProductionConfigItem[] | Production config for current building |


### _onlyDistributions

```solidity
function _onlyDistributions() internal view
```



_Allows caller to be only distributions contract_




### _onlySettlementOwner

```solidity
function _onlySettlementOwner() internal view
```



_Allows caller to be only settlement owner_




### _onlyRulerOrWorldAssetFromSameEra

```solidity
function _onlyRulerOrWorldAssetFromSameEra() internal view
```



_Allows caller to be ruler or world or world asset_




### _getProducedTicksByAdvancedProduction

```solidity
function _getProducedTicksByAdvancedProduction(uint256 advancedProductionBeginTime, uint256 advancedProductionEndTime, uint256 toBeProducedTicks) internal view returns (uint256)
```



_Calculates how many ticks produced by advanced production by provided begin time, end time and to be produced ticks_




### _getProducedTicksByBasicProduction

```solidity
function _getProducedTicksByBasicProduction(uint256 basicProductionBeginTime, uint256 basicProductionEndTime) internal view returns (uint256)
```



_Calculates how many ticks produced by basic production by provided begin time, end time_




### _createDefaultDistribution

```solidity
function _createDefaultDistribution() internal
```



_Creates default distribution (all possible tokens will be minted to current settlement owner)_




### _saveProducedResource

```solidity
function _saveProducedResource(bytes32 resourceTypeId, uint256 amount) internal
```



_Saves produced amount of resource between treasury and productionInfo.readyToBeDistributed_




### _updateProsperity

```solidity
function _updateProsperity() internal virtual
```



_Updates building prosperity according to changed amount of resources in building_




### _getCurrentTime

```solidity
function _getCurrentTime() internal view returns (uint256)
```



_Calculates current game time, taking into an account game end time_




### _getBasicProductionMultiplier

```solidity
function _getBasicProductionMultiplier() internal view returns (uint256)
```



_Calculates basic production multiplier_




### _getAdvancedProductionMultiplier

```solidity
function _getAdvancedProductionMultiplier() internal view returns (uint256)
```



_Calculates advanced production multiplier_




### _calculateProductionTicksAmount

```solidity
function _calculateProductionTicksAmount() internal view returns (uint256)
```



_Calculates amount of production ticks for current building according to its resources balances_




### _isBuildingTokenRecallAllowed

```solidity
function _isBuildingTokenRecallAllowed() internal returns (bool)
```



_Calculates is building token recall allowed according to building token transfer threshold_




### _batchTransferResources

```solidity
function _batchTransferResources(bytes32[] resourceTypeIds, address to, uint256[] amounts) internal
```



_Batch transfer resources from building to specified address_




### _transferWorkers

```solidity
function _transferWorkers(address to, uint256 amount) internal
```



_Transfers workers from building to specified address_




### _transferResources

```solidity
function _transferResources(bytes32 resourceTypeId, address to, uint256 amount) internal
```



_Transfers resources from building to specified address_




### _updateProductionInfo

```solidity
function _updateProductionInfo(uint256 newLastUpdateStateTime, uint256 newLastUpdateStateRegionTime, uint256 newReadyToBeDistributed, uint256 newTotalDebt) internal
```



_Updates production info_




### _updateProducedResourceDebt

```solidity
function _updateProducedResourceDebt(address distributionNftHolder, uint256 newDebt) internal
```



_Updates produced resource debt for specified nft holder_




