## IZone


Functions to read state/modify state in order to get current zone parameters and/or interact with it





### WorkersPoolCreated

```solidity
event WorkersPoolCreated(address workersPoolAddress)
```

Emitted when zone initialized


| Name | Type | Description |
| ---- | ---- | ----------- |
| workersPoolAddress | address | Workers pool address |



### SettlementsMarketCreated

```solidity
event SettlementsMarketCreated(address settlementsMarketAddress)
```

Emitted when zone initialized


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementsMarketAddress | address | Settlements market address |



### UnitsPoolCreated

```solidity
event UnitsPoolCreated(address unitsPoolAddress, string unitType)
```

Emitted when zone initialized


| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsPoolAddress | address | Units pool address |
| unitType | string | Unit type |



### ToxicityIncreased

```solidity
event ToxicityIncreased(address settlementAddress, uint256 value)
```

Emitted when #increaseToxicity is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of settlement which triggered toxicity increase |
| value | uint256 | Amount of added toxicity |



### ToxicityDecreased

```solidity
event ToxicityDecreased(address settlementAddress, uint256 value)
```

Emitted when #decreaseToxicity is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of settlement which triggered toxicity decrease |
| value | uint256 | Amount of subtracted toxicity |



### ZoneTimeChanged

```solidity
event ZoneTimeChanged(uint256 lastApplyStateTime, uint256 lastApplyStateZoneTime)
```

Emitted when #applyState is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| lastApplyStateTime | uint256 | Time at which zone time changed |
| lastApplyStateZoneTime | uint256 | Current zone time |



### workersPool

```solidity
function workersPool() external view returns (contract IWorkersPool)
```

Workers pool

_Immutable, initialized on the zone creation_




### unitsPools

```solidity
function unitsPools(string unitName) external view returns (contract IUnitsPool)
```

Mapping containing units pool for provided unit type

_Immutable, initialized on the zone creation_




### settlementsMarket

```solidity
function settlementsMarket() external view returns (contract ISettlementsMarket)
```

Mapping containing units market for provided unit type

_Immutable, initialized on the zone creation_




### occultistsSettlement

```solidity
function occultistsSettlement() external view returns (contract ISettlement)
```

Occultists settlement of this zone

_Immutable, initialized on the zone creation_




### occultistsSummonTime

```solidity
function occultistsSummonTime() external view returns (uint256)
```

Last time occultists were summoned in this zone

_Updated when #summonOccultists is called_




### toxicity

```solidity
function toxicity() external view returns (int256)
```

Amount of toxicity in this zone

_Updated when #increaseToxicity or #decreaseToxicity is called_




### zoneIndex

```solidity
function zoneIndex() external view returns (uint256)
```

Zone index

_Immutable, initialized on the zone creation_




### lastApplyStateTime

```solidity
function lastApplyStateTime() external view returns (uint256)
```

Last apply state time

_Updated when #applyState is called_




### lastApplyStateZoneTime

```solidity
function lastApplyStateZoneTime() external view returns (uint256)
```

Last apply state zone time

_Updated when #applyState is called_




### init

```solidity
function init(uint256 zoneIndex) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneIndex | uint256 | Zone index |



### createOccultists

```solidity
function createOccultists(uint32 occultistsPosition) external
```

Creates occultists settlement

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsPosition | uint32 | Occultists position |



### buyUnitsBatch

```solidity
function buyUnitsBatch(address settlementAddress, string[] unitNames, uint256[] unitsCounts, uint256[] maxWeaponsToSell) external
```

Buys specified units for specified amount of weapons in current zone

_msg.sender will be used as weapons payer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement's address army of which will receive units |
| unitNames | string[] | Unit types |
| unitsCounts | uint256[] | Units counts |
| maxWeaponsToSell | uint256[] | Maximum amounts of weapons to sell for each unit types |



### summonOccultists

```solidity
function summonOccultists() external
```

Summons occultists if conditions are met

_Anyone can call this function_




### increaseToxicity

```solidity
function increaseToxicity(address settlementAddress, string resourceName, uint256 value) external
```

Increases toxicity relative to specified resources amount

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of the settlement which triggered toxicity increase |
| resourceName | string | Resource name |
| value | uint256 | Amount of resource |



### decreaseToxicity

```solidity
function decreaseToxicity(address settlementAddress, string resourceName, uint256 value) external
```

Decreases toxicity relative to specified resources amount

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of the settlement which triggered toxicity decrease |
| resourceName | string | Resource name |
| value | uint256 | Amount of resource |



### handleOccultistsSummoned

```solidity
function handleOccultistsSummoned(address occultistsArmyAddress, uint256 value) external
```

Zone occultists summon handler

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists minted |



### handleOccultistsDefeated

```solidity
function handleOccultistsDefeated(address occultistsArmyAddress, uint256 value) external
```

Zone occultists defeat handler

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists burned |



### applyState

```solidity
function applyState() external
```

Applies zone state

_This function is called every time when production should be modified_




### getZoneTime

```solidity
function getZoneTime(uint256 timestamp) external view returns (uint256 zoneTime)
```

Calculates zone time with provided timestamp

_Takes into an account previous value and current occultists penalty and extrapolates to value at provided timestamp_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneTime | uint256 | Extrapolated zone time |


## IZone


Functions to read state/modify state in order to get current zone parameters and/or interact with it





### WorkersPoolCreated

```solidity
event WorkersPoolCreated(address workersPoolAddress)
```

Emitted when zone initialized


| Name | Type | Description |
| ---- | ---- | ----------- |
| workersPoolAddress | address | Workers pool address |



### SettlementsMarketCreated

```solidity
event SettlementsMarketCreated(address settlementsMarketAddress)
```

Emitted when zone initialized


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementsMarketAddress | address | Settlements market address |



### UnitsPoolCreated

```solidity
event UnitsPoolCreated(address unitsPoolAddress, string unitType)
```

Emitted when zone initialized


| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsPoolAddress | address | Units pool address |
| unitType | string | Unit type |



### ToxicityIncreased

```solidity
event ToxicityIncreased(address settlementAddress, uint256 value)
```

Emitted when #increaseToxicity is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of settlement which triggered toxicity increase |
| value | uint256 | Amount of added toxicity |



### ToxicityDecreased

```solidity
event ToxicityDecreased(address settlementAddress, uint256 value)
```

Emitted when #decreaseToxicity is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of settlement which triggered toxicity decrease |
| value | uint256 | Amount of subtracted toxicity |



### ZoneTimeChanged

```solidity
event ZoneTimeChanged(uint256 lastApplyStateTime, uint256 lastApplyStateZoneTime)
```

Emitted when #applyState is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| lastApplyStateTime | uint256 | Time at which zone time changed |
| lastApplyStateZoneTime | uint256 | Current zone time |



### workersPool

```solidity
function workersPool() external view returns (contract IWorkersPool)
```

Workers pool

_Immutable, initialized on the zone creation_




### unitsPools

```solidity
function unitsPools(string unitName) external view returns (contract IUnitsPool)
```

Mapping containing units pool for provided unit type

_Immutable, initialized on the zone creation_




### settlementsMarket

```solidity
function settlementsMarket() external view returns (contract ISettlementsMarket)
```

Mapping containing units market for provided unit type

_Immutable, initialized on the zone creation_




### occultistsSettlement

```solidity
function occultistsSettlement() external view returns (contract ISettlement)
```

Occultists settlement of this zone

_Immutable, initialized on the zone creation_




### occultistsSummonTime

```solidity
function occultistsSummonTime() external view returns (uint256)
```

Last time occultists were summoned in this zone

_Updated when #summonOccultists is called_




### toxicity

```solidity
function toxicity() external view returns (int256)
```

Amount of toxicity in this zone

_Updated when #increaseToxicity or #decreaseToxicity is called_




### zoneIndex

```solidity
function zoneIndex() external view returns (uint256)
```

Zone index

_Immutable, initialized on the zone creation_




### lastApplyStateTime

```solidity
function lastApplyStateTime() external view returns (uint256)
```

Last apply state time

_Updated when #applyState is called_




### lastApplyStateZoneTime

```solidity
function lastApplyStateZoneTime() external view returns (uint256)
```

Last apply state zone time

_Updated when #applyState is called_




### init

```solidity
function init(uint256 zoneIndex) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneIndex | uint256 | Zone index |



### createOccultists

```solidity
function createOccultists(uint32 occultistsPosition) external
```

Creates occultists settlement

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsPosition | uint32 | Occultists position |



### buyUnitsBatch

```solidity
function buyUnitsBatch(address settlementAddress, string[] unitNames, uint256[] unitsCounts, uint256[] maxWeaponsToSell) external
```

Buys specified units for specified amount of weapons in current zone

_msg.sender will be used as weapons payer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement's address army of which will receive units |
| unitNames | string[] | Unit types |
| unitsCounts | uint256[] | Units counts |
| maxWeaponsToSell | uint256[] | Maximum amounts of weapons to sell for each unit types |



### summonOccultists

```solidity
function summonOccultists() external
```

Summons occultists if conditions are met

_Anyone can call this function_




### increaseToxicity

```solidity
function increaseToxicity(address settlementAddress, string resourceName, uint256 value) external
```

Increases toxicity relative to specified resources amount

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of the settlement which triggered toxicity increase |
| resourceName | string | Resource name |
| value | uint256 | Amount of resource |



### decreaseToxicity

```solidity
function decreaseToxicity(address settlementAddress, string resourceName, uint256 value) external
```

Decreases toxicity relative to specified resources amount

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | An address of the settlement which triggered toxicity decrease |
| resourceName | string | Resource name |
| value | uint256 | Amount of resource |



### handleOccultistsSummoned

```solidity
function handleOccultistsSummoned(address occultistsArmyAddress, uint256 value) external
```

Zone occultists summon handler

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists minted |



### handleOccultistsDefeated

```solidity
function handleOccultistsDefeated(address occultistsArmyAddress, uint256 value) external
```

Zone occultists defeat handler

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists burned |



### applyState

```solidity
function applyState() external
```

Applies zone state

_This function is called every time when production should be modified_




### getZoneTime

```solidity
function getZoneTime(uint256 timestamp) external view returns (uint256 zoneTime)
```

Calculates zone time with provided timestamp

_Takes into an account previous value and current occultists penalty and extrapolates to value at provided timestamp_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneTime | uint256 | Extrapolated zone time |


