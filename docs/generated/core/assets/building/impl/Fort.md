## Fort








### health

```solidity
uint256 health
```

Fort health

_Updated when #updateHealth is called_




### getProducingResourceTypeId

```solidity
function getProducingResourceTypeId() public view returns (bytes32)
```

Calculates producing resource type id for this building

_Return value is value from #getConfig where 'isProducing'=true_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes32 |  |


### resetDistribution

```solidity
function resetDistribution() public
```

Resets current building distribution

_Creates new distribution Nft and mints it to current settlement owner_




### init

```solidity
function init(bytes initParams) public
```







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


### getMaxHealthOnLevel

```solidity
function getMaxHealthOnLevel(uint256 level) public view returns (uint256)
```

Calculates maximum amount of health for provided level

_Useful to determine maximum amount of health will be available at provided level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Level at which calculate maximum amount of health |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getTreasuryAmount

```solidity
function getTreasuryAmount(uint256 timestamp) public view returns (uint256)
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
function getMaxTreasuryByLevel(uint256 level) public view returns (uint256)
```

Calculates maximum amount of treasury by provided level

_Can be used to determine maximum amount of treasury by any level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Building level |



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


### updateState

```solidity
function updateState() public
```

Updates state of this building up to block.timestamp

_Updates building production minting treasury and increasing #production.readyToBeDistributed_




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


### calculateDamageDone

```solidity
function calculateDamageDone(uint256 timestamp) public view returns (uint256 damage)
```

Calculates damage done at specified timestamp

_Uses fort production and siege parameters to forecast health and damage will be dealt at specified time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate parameters |

| Name | Type | Description |
| ---- | ---- | ----------- |
| damage | uint256 | Amount of damage done from fort.productionInfo.lastUpdateState to specified timestamp |


### FortProductionResultParams








```solidity
struct FortProductionResultParams {
  uint256 healthProduced;
  uint256 healthLost;
  uint256 advancedTicksProduced;
}
```

### _updateProsperity

```solidity
function _updateProsperity() internal
```



_Updates building prosperity according to changed amount of resources in building_




### _calculateDegenIncome

```solidity
function _calculateDegenIncome() internal view returns (uint256)
```



_Calculates fort degen income based on current siege power_




### _calculateFortProductionResultParams

```solidity
function _calculateFortProductionResultParams(uint256 timestamp, uint256 productionLastUpdateStateTime, uint256 healthPerTick) internal view returns (struct Fort.FortProductionResultParams)
```



_Calculates fort production result params_




### _composeFortProductionResultParams

```solidity
function _composeFortProductionResultParams(uint256 elapsedSeconds, uint256 fullHealthProductionSeconds, uint256 partialHealthProductionSeconds, uint256 basicRegenIncome, uint256 advancedRegenIncome, uint256 degenIncome, uint256 healthPerTick) internal pure returns (struct Fort.FortProductionResultParams)
```



_Composes fort production result params by provided data_




### FortAdvancedProductionParams








```solidity
struct FortAdvancedProductionParams {
  uint256 fullHealthProductionSeconds;
  uint256 partialHealthProductionSeconds;
}
```

### _calculateFortAdvancedProductionParams

```solidity
function _calculateFortAdvancedProductionParams(uint256 currentHealth, uint256 maxHealth, uint256 basicRegenIncome, uint256 advancedRegenIncome, uint256 degenIncome, uint256 toBeProducedHealth) internal pure returns (struct Fort.FortAdvancedProductionParams)
```



_Calculates fort advanced production params_




### _updateHealth

```solidity
function _updateHealth(uint256 value) internal
```



_Updates fort health_




