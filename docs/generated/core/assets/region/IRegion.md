## IRegion


Functions to read state/modify state in order to get current region parameters and/or interact with it





### workersPool

```solidity
function workersPool() external view returns (contract IWorkersPool)
```

Workers pool

_Immutable, initialized on the region creation_




### unitsPools

```solidity
function unitsPools(bytes32 unitTypeId) external view returns (contract IUnitsPool)
```

Mapping containing units pool for provided unit type id

_Immutable, initialized on the region creation_




### settlementsMarket

```solidity
function settlementsMarket() external view returns (contract ISettlementsMarket)
```

Mapping containing units market for provided unit type

_Immutable, initialized on the region creation_




### cultistsSettlement

```solidity
function cultistsSettlement() external view returns (contract ISettlement)
```

Cultists settlement of this region

_Immutable, initialized on the region creation_




### lastCultistsSummonIntervalNumber

```solidity
function lastCultistsSummonIntervalNumber() external view returns (uint256)
```

Last cultists summon interval number of this region

_Updated when #_summonCultists is called_




### corruptionIndex

```solidity
function corruptionIndex() external view returns (int256)
```

Amount of corruptionIndex in this region

_Updated when #increaseCorruptionIndex or #decreaseCorruptionIndex is called_




### regionId

```solidity
function regionId() external view returns (uint64)
```

Region id

_Immutable, initialized on the region creation_




### lastUpdateTime

```solidity
function lastUpdateTime() external view returns (uint256)
```

Last update time

_Updated when #updateRegionTime is called_




### lastUpdateRegionTime

```solidity
function lastUpdateRegionTime() external view returns (uint256)
```

Last apply state region time

_Updated when #updateRegionTime is called_




### WorkersPoolCreated

```solidity
event WorkersPoolCreated(address workersPoolAddress)
```

Emitted when region initialized


| Name | Type | Description |
| ---- | ---- | ----------- |
| workersPoolAddress | address | Workers pool address |



### SettlementsMarketCreated

```solidity
event SettlementsMarketCreated(address settlementsMarketAddress)
```

Emitted when region initialized


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementsMarketAddress | address | Settlements market address |



### UnitsPoolCreated

```solidity
event UnitsPoolCreated(address unitsPoolAddress, bytes32 unitTypeId)
```

Emitted when region initialized


| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsPoolAddress | address | Units pool address |
| unitTypeId | bytes32 | Unit type id |



### CorruptionIndexIncreased

```solidity
event CorruptionIndexIncreased(address settlementAddress, uint256 addedCorruptionIndexAmount)
```

Emitted when #increaseCorruptionIndex is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of settlement which triggered corruptionIndex increase (can be address(0)) |
| addedCorruptionIndexAmount | uint256 | Amount of added corruptionIndex |



### CorruptionIndexDecreased

```solidity
event CorruptionIndexDecreased(address settlementAddress, uint256 reducedCorruptionIndexAmount)
```

Emitted when #decreaseCorruptionIndex is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of settlement which triggered corruptionIndex decrease (can be address(0)) |
| reducedCorruptionIndexAmount | uint256 | Amount of reduced corruptionIndex |



### RegionTimeChanged

```solidity
event RegionTimeChanged(uint256 lastUpdateTime, uint256 lastUpdateRegionTime)
```

Emitted when #updateState is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| lastUpdateTime | uint256 | Time at which region time changed |
| lastUpdateRegionTime | uint256 | Region time at 'lastUpdateTime' |



### RegionCultistsChanged

```solidity
event RegionCultistsChanged(uint256 newRegionCultistsAmount)
```

Emitted when #handleCultistsSummoned or #handleCultistsDefeated is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| newRegionCultistsAmount | uint256 | New region cultists amount |



### LastCultistsSummonIntervalNumberUpdated

```solidity
event LastCultistsSummonIntervalNumberUpdated(uint256 newCultistsSummonIntervalNumber)
```

Emitted when #_summonCultists is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| newCultistsSummonIntervalNumber | uint256 | New cultists summon interval number |



### OnlyEraUnits

```solidity
error OnlyEraUnits()
```

Thrown when attempting to call action which can only be called by current era Units





### updateRegionTime

```solidity
function updateRegionTime(uint256 globalTime) external
```

Persists region time upto specified global time

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| globalTime | uint256 | Global time |



### createCultistsSettlement

```solidity
function createCultistsSettlement(uint64 cultistsPosition) external
```

Creates cultists settlement

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| cultistsPosition | uint64 | Cultists position |



### buyUnitsBatch

```solidity
function buyUnitsBatch(address tokensOwner, address settlementAddress, bytes32[] unitTypeIds, uint256[] unitsAmounts, uint256[] maxTokensToSell) external
```

Buys specified units for specified amount of tokens in current region

_If tokensOwner == address(0) -> tokens will be taken from msg.sender
If tokensOwner != address(0) and tokensOwner has given allowance to msg.sender >= amount of tokens for units -> tokens will be taken from tokensOwner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokensOwner | address | Tokens owner |
| settlementAddress | address | Settlement's address army of which will receive units |
| unitTypeIds | bytes32[] | Unit type ids |
| unitsAmounts | uint256[] | Units amounts |
| maxTokensToSell | uint256[] | Maximum amounts of tokens to sell for each unit types |



### increaseCorruptionIndex

```solidity
function increaseCorruptionIndex(address settlementAddress, uint256 value) external
```

Increases corruptionIndex in region

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of the settlement which triggered corruptionIndex increase (address(0) if triggered by non-settlement action) |
| value | uint256 | Amount of corruptionIndex |



### decreaseCorruptionIndex

```solidity
function decreaseCorruptionIndex(address settlementAddress, uint256 value) external
```

Decreases corruptionIndex in region

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of the settlement which triggered corruptionIndex decrease (address(0) if triggered by non-settlement action) |
| value | uint256 | Amount of corruptionIndex |



### handleCultistsSummoned

```solidity
function handleCultistsSummoned(uint256 value) external
```

Region cultists summon handler

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 | Amount of cultists minted |



### handleCultistsDefeated

```solidity
function handleCultistsDefeated(uint256 value) external
```

Region cultists defeat handler

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 | Amount of cultists burned |



### getPenaltyFromCultists

```solidity
function getPenaltyFromCultists() external view returns (uint256 penalty)
```

Calculates penalty according to current cultists count

_Uses unit.balanceOf to determine penalty_


| Name | Type | Description |
| ---- | ---- | ----------- |
| penalty | uint256 | Penalty from cultists |


### updateState

```solidity
function updateState() external
```

Updates region state

_This function is called every time when production should be modified_




### getRegionTime

```solidity
function getRegionTime(uint256 timestamp) external view returns (uint256 regionTime)
```

Calculates region time with provided timestamp

_Takes into an account previous value and current cultists penalty and extrapolates to value at provided timestamp_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionTime | uint256 | Extrapolated region time |


