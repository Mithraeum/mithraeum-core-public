## Region








### workersPool

```solidity
contract IWorkersPool workersPool
```

Workers pool

_Immutable, initialized on the region creation_




### unitsPools

```solidity
mapping(bytes32 => contract IUnitsPool) unitsPools
```

Mapping containing units pool for provided unit type id

_Immutable, initialized on the region creation_




### settlementsMarket

```solidity
contract ISettlementsMarket settlementsMarket
```

Mapping containing units market for provided unit type

_Immutable, initialized on the region creation_




### cultistsSettlement

```solidity
contract ISettlement cultistsSettlement
```

Cultists settlement of this region

_Immutable, initialized on the region creation_




### lastCultistsSummonIntervalNumber

```solidity
uint256 lastCultistsSummonIntervalNumber
```

Last cultists summon interval number of this region

_Updated when #_summonCultists is called_




### corruptionIndex

```solidity
int256 corruptionIndex
```

Amount of corruptionIndex in this region

_Updated when #increaseCorruptionIndex or #decreaseCorruptionIndex is called_




### regionId

```solidity
uint64 regionId
```

Region id

_Immutable, initialized on the region creation_




### lastUpdateTime

```solidity
uint256 lastUpdateTime
```

Last update time

_Updated when #updateRegionTime is called_




### lastUpdateRegionTime

```solidity
uint256 lastUpdateRegionTime
```

Last apply state region time

_Updated when #updateRegionTime is called_




### onlyEraUnits

```solidity
modifier onlyEraUnits()
```



_Only era units modifier
Modifier is calling internal function in order to reduce contract size_




### init

```solidity
function init(bytes initParams) public
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### getRegionTime

```solidity
function getRegionTime(uint256 timestamp) public view returns (uint256)
```

Calculates region time with provided timestamp

_Takes into an account previous value and current cultists penalty and extrapolates to value at provided timestamp_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### updateState

```solidity
function updateState() public
```

Updates region state

_This function is called every time when production should be modified_




### updateRegionTime

```solidity
function updateRegionTime(uint256 globalTime) public
```

Persists region time upto specified global time

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| globalTime | uint256 | Global time |



### createCultistsSettlement

```solidity
function createCultistsSettlement(uint64 cultistsPosition) public
```

Creates cultists settlement

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| cultistsPosition | uint64 | Cultists position |



### buyUnitsBatch

```solidity
function buyUnitsBatch(address resourcesOwner, address settlementAddress, bytes32[] unitTypeIds, uint256[] unitsAmounts, uint256[] maxTokensToSell) public
```

Buys specified units for specified amount of tokens in current region

_If tokensOwner == address(0) -> tokens will be taken from msg.sender
If tokensOwner != address(0) and tokensOwner has given allowance to msg.sender >= amount of tokens for units -> tokens will be taken from tokensOwner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesOwner | address |  |
| settlementAddress | address | Settlement's address army of which will receive units |
| unitTypeIds | bytes32[] | Unit type ids |
| unitsAmounts | uint256[] | Units amounts |
| maxTokensToSell | uint256[] | Maximum amounts of tokens to sell for each unit types |



### increaseCorruptionIndex

```solidity
function increaseCorruptionIndex(address settlementAddress, uint256 value) public
```

Increases corruptionIndex in region

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of the settlement which triggered corruptionIndex increase (address(0) if triggered by non-settlement action) |
| value | uint256 | Amount of corruptionIndex |



### decreaseCorruptionIndex

```solidity
function decreaseCorruptionIndex(address settlementAddress, uint256 value) public
```

Decreases corruptionIndex in region

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of the settlement which triggered corruptionIndex decrease (address(0) if triggered by non-settlement action) |
| value | uint256 | Amount of corruptionIndex |



### handleCultistsSummoned

```solidity
function handleCultistsSummoned(uint256 value) public
```

Region cultists summon handler

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 | Amount of cultists minted |



### handleCultistsDefeated

```solidity
function handleCultistsDefeated(uint256 value) public
```

Region cultists defeat handler

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 | Amount of cultists burned |



### getPenaltyFromCultists

```solidity
function getPenaltyFromCultists() public view returns (uint256)
```

Calculates penalty according to current cultists count

_Uses unit.balanceOf to determine penalty_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### _onlyEraUnits

```solidity
function _onlyEraUnits() internal view
```



_Allows caller to be only current era's units_




### _tryToEndCultistsBattle

```solidity
function _tryToEndCultistsBattle() internal
```



_Tries to end cultists battle (if battle exist)_




### _tryToSummonCultists

```solidity
function _tryToSummonCultists() internal
```



_Tries to summons cultists (if conditions are met)_




### _summonCultists

```solidity
function _summonCultists(uint256 cultistsAmountToSummon, uint256 cultistsSummonIntervalNumber) internal
```



_Summons cultists with saving last time cultists were summoned_




### _getCurrentCultistsSummonIntervalNumber

```solidity
function _getCurrentCultistsSummonIntervalNumber() internal view returns (uint256)
```



_Calculates cultists summon interval number of current time_




### _getCurrentCultistsAmount

```solidity
function _getCurrentCultistsAmount() internal view returns (uint256)
```



_Calculates current cultists amount_




### _increaseCorruptionIndex

```solidity
function _increaseCorruptionIndex(address settlementAddress, uint256 corruptionIndexAmount) internal
```



_Increases corruptionIndex_




### _decreaseCorruptionIndex

```solidity
function _decreaseCorruptionIndex(address settlementAddress, uint256 corruptionIndexAmount) internal
```



_Decreases corruptionIndex_




