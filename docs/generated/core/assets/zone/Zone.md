## Zone








### workersPool

```solidity
contract IWorkersPool workersPool
```

Workers pool

_Immutable, initialized on the zone creation_




### unitsPools

```solidity
mapping(string => contract IUnitsPool) unitsPools
```

Mapping containing units pool for provided unit type

_Immutable, initialized on the zone creation_




### settlementsMarket

```solidity
contract ISettlementsMarket settlementsMarket
```

Mapping containing units market for provided unit type

_Immutable, initialized on the zone creation_




### occultistsSettlement

```solidity
contract ISettlement occultistsSettlement
```

Occultists settlement of this zone

_Immutable, initialized on the zone creation_




### occultistsSummonTime

```solidity
uint256 occultistsSummonTime
```

Last time occultists were summoned in this zone

_Updated when #summonOccultists is called_




### toxicity

```solidity
int256 toxicity
```

Amount of toxicity in this zone

_Updated when #increaseToxicity or #decreaseToxicity is called_




### zoneIndex

```solidity
uint256 zoneIndex
```

Zone index

_Immutable, initialized on the zone creation_




### lastApplyStateTime

```solidity
uint256 lastApplyStateTime
```

Last apply state time

_Updated when #applyState is called_




### lastApplyStateZoneTime

```solidity
uint256 lastApplyStateZoneTime
```

Last apply state zone time

_Updated when #applyState is called_




### onlyEpochUnits

```solidity
modifier onlyEpochUnits()
```



_Allows caller to be only current epoch's units_




### init

```solidity
function init(uint256 _zoneIndex) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _zoneIndex | uint256 |  |



### getZoneTime

```solidity
function getZoneTime(uint256 timestamp) public view returns (uint256)
```

Calculates zone time with provided timestamp

_Takes into an account previous value and current occultists penalty and extrapolates to value at provided timestamp_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### applyState

```solidity
function applyState() public
```

Applies zone state

_This function is called every time when production should be modified_




### createOccultists

```solidity
function createOccultists(uint32 occultistsPosition) public
```

Creates occultists settlement

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsPosition | uint32 | Occultists position |



### buyUnitsBatch

```solidity
function buyUnitsBatch(address settlementAddress, string[] unitNames, uint256[] unitsCount, uint256[] maxWeaponsToSell) public
```

Buys specified units for specified amount of weapons in current zone

_msg.sender will be used as weapons payer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement's address army of which will receive units |
| unitNames | string[] | Unit types |
| unitsCount | uint256[] |  |
| maxWeaponsToSell | uint256[] | Maximum amounts of weapons to sell for each unit types |



### summonOccultists

```solidity
function summonOccultists() public
```

Summons occultists if conditions are met

_Anyone can call this function_




### increaseToxicity

```solidity
function increaseToxicity(address settlementAddress, string resourceName, uint256 value) public
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
function decreaseToxicity(address settlementAddress, string resourceName, uint256 value) public
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
function handleOccultistsSummoned(address occultistsArmyAddress, uint256 value) public
```

Zone occultists summon handler

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists minted |



### handleOccultistsDefeated

```solidity
function handleOccultistsDefeated(address occultistsArmyAddress, uint256 value) public
```

Zone occultists defeat handler

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists burned |



### mintOccultists

```solidity
function mintOccultists(uint256 value) internal
```



_Mints occultists in current zone_




### getProductionTicksPenalty

```solidity
function getProductionTicksPenalty(uint256 occultistsCount) internal view returns (uint256)
```



_Calculates production ticks penalty according to provided occultists count_




## Zone








### workersPool

```solidity
contract IWorkersPool workersPool
```

Workers pool

_Immutable, initialized on the zone creation_




### unitsPools

```solidity
mapping(string => contract IUnitsPool) unitsPools
```

Mapping containing units pool for provided unit type

_Immutable, initialized on the zone creation_




### settlementsMarket

```solidity
contract ISettlementsMarket settlementsMarket
```

Mapping containing units market for provided unit type

_Immutable, initialized on the zone creation_




### occultistsSettlement

```solidity
contract ISettlement occultistsSettlement
```

Occultists settlement of this zone

_Immutable, initialized on the zone creation_




### occultistsSummonTime

```solidity
uint256 occultistsSummonTime
```

Last time occultists were summoned in this zone

_Updated when #summonOccultists is called_




### toxicity

```solidity
int256 toxicity
```

Amount of toxicity in this zone

_Updated when #increaseToxicity or #decreaseToxicity is called_




### zoneIndex

```solidity
uint256 zoneIndex
```

Zone index

_Immutable, initialized on the zone creation_




### lastApplyStateTime

```solidity
uint256 lastApplyStateTime
```

Last apply state time

_Updated when #applyState is called_




### lastApplyStateZoneTime

```solidity
uint256 lastApplyStateZoneTime
```

Last apply state zone time

_Updated when #applyState is called_




### onlyEpochUnits

```solidity
modifier onlyEpochUnits()
```



_Allows caller to be only current epoch's units_




### init

```solidity
function init(uint256 _zoneIndex) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _zoneIndex | uint256 |  |



### getZoneTime

```solidity
function getZoneTime(uint256 timestamp) public view returns (uint256)
```

Calculates zone time with provided timestamp

_Takes into an account previous value and current occultists penalty and extrapolates to value at provided timestamp_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### applyState

```solidity
function applyState() public
```

Applies zone state

_This function is called every time when production should be modified_




### createOccultists

```solidity
function createOccultists(uint32 occultistsPosition) public
```

Creates occultists settlement

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsPosition | uint32 | Occultists position |



### buyUnitsBatch

```solidity
function buyUnitsBatch(address settlementAddress, string[] unitNames, uint256[] unitsCount, uint256[] maxWeaponsToSell) public
```

Buys specified units for specified amount of weapons in current zone

_msg.sender will be used as weapons payer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement's address army of which will receive units |
| unitNames | string[] | Unit types |
| unitsCount | uint256[] |  |
| maxWeaponsToSell | uint256[] | Maximum amounts of weapons to sell for each unit types |



### summonOccultists

```solidity
function summonOccultists() public
```

Summons occultists if conditions are met

_Anyone can call this function_




### increaseToxicity

```solidity
function increaseToxicity(address settlementAddress, string resourceName, uint256 value) public
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
function decreaseToxicity(address settlementAddress, string resourceName, uint256 value) public
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
function handleOccultistsSummoned(address occultistsArmyAddress, uint256 value) public
```

Zone occultists summon handler

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists minted |



### handleOccultistsDefeated

```solidity
function handleOccultistsDefeated(address occultistsArmyAddress, uint256 value) public
```

Zone occultists defeat handler

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists burned |



### mintOccultists

```solidity
function mintOccultists(uint256 value) internal
```



_Mints occultists in current zone_




### getProductionTicksPenalty

```solidity
function getProductionTicksPenalty(uint256 occultistsCount) internal view returns (uint256)
```



_Calculates production ticks penalty according to provided occultists count_




