## ISettlement


Functions to read state/modify state in order to get current settlement parameters and/or interact with it





### NewBuilding

```solidity
event NewBuilding(address contractAddress, string scriptName)
```

Emitted when new building is placed, all building are placed on settlement creation


| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | New building address |
| scriptName | string | Building name |



### NewArmy

```solidity
event NewArmy(address armyAddress, uint32 position)
```

Emitted when settlements army is created, is it created on settlement creation


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | New army address |
| position | uint32 | Position |



### SiegeCreated

```solidity
event SiegeCreated(address siegeAddress)
```

Emitted when siege is created on settlement if not present. During settlements lifetime multiple sieges can be created (one after another, not multiple simultaneously)


| Name | Type | Description |
| ---- | ---- | ----------- |
| siegeAddress | address | New siege address |



### GovernorChanged

```solidity
event GovernorChanged(uint256 currentEpoch, address governorAddress, bool status)
```

Emitted when #addGovernor or #removeGovernor is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| currentEpoch | uint256 | Current governor epoch |
| governorAddress | address | Address of the governor event is applicable |
| status | bool | Is governor became active/inactive |



### NewSettlementEpoch

```solidity
event NewSettlementEpoch(uint256 currentEpoch)
```

Emitted when #removeGovernors is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| currentEpoch | uint256 | New governor epoch |



### currentZone

```solidity
function currentZone() external view returns (contract IZone)
```

Zone to which this settlement belongs

_Immutable, initialized on the settlement creation_




### ownerTokenId

```solidity
function ownerTokenId() external view returns (uint256)
```

Banner token id to which current settlement belongs

_Immutable, initialized on the settlement creation_




### siege

```solidity
function siege() external view returns (contract ISiege)
```

Siege of the settlement

_If any army is sieging settlement not address(0), otherwise address(0)_




### buildings

```solidity
function buildings(string buildingName) external view returns (contract IBuilding)
```

Mapping containing settlements buildings

_Types of buildings supported can be queried from registry_




### currentGovernorsEpoch

```solidity
function currentGovernorsEpoch() external view returns (uint256)
```

Current governors epoch

_Modified when #removeGovernors is called_




### governors

```solidity
function governors(uint256 epoch, address isGovernor) external view returns (bool)
```

Current settlements governors

_Modified when #addGovernor or #removeGovernor is called_




### army

```solidity
function army() external view returns (contract IArmy)
```

Settlements army
Immutable, initialized on the settlement creation





### extraProsperity

```solidity
function extraProsperity() external view returns (uint256)
```

Extra prosperity amount gained from demilitarization of any army on this settlement

_Used for determination amount of real prosperity this settlement has_




### position

```solidity
function position() external view returns (uint32)
```

Position on which settlement is created

_Immutable, initialized on the settlement creation_




### init

```solidity
function init(uint256 createdWithOwnerTokenId, address zoneAddress, uint32 settlementPosition) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| createdWithOwnerTokenId | uint256 | Banner token id to which current settlement belongs |
| zoneAddress | address | Zone address to which this settlement belongs |
| settlementPosition | uint32 | Position on which settlement is created |



### transferWorkers

```solidity
function transferWorkers(address buildingAddress, uint256 amount) external
```

Transfers workers from settlement to building

_Amount of workers to transfer is in 1e18 precision, however only integer amount can be transferred_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of the building transfer workers to |
| amount | uint256 | Amount of workers to transfer |



### transferResources

```solidity
function transferResources(string resourceName, address to, uint256 amount) external
```

Transfers game resource from settlement to specified address

_In case if someone accidentally transfers game resource to the settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Game resource name |
| to | address | Address that will receive resources |
| amount | uint256 | Amount to transfer |



### newBuilding

```solidity
function newBuilding(string buildingName) external returns (address buildingAddress)
```

Creates new building

_All buildings are created on settlement creation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingName | string | Building name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of created building |


### calculateCurrentHealthAndDamage

```solidity
function calculateCurrentHealthAndDamage(uint256 timestamp) external view returns (uint256 currentHealth, uint256 damage)
```

Calculates current fort health and damage dealt at specified timestamp

_Uses fort production and siege parameters to forecast health and damage will be dealt at specified time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate parameters |

| Name | Type | Description |
| ---- | ---- | ----------- |
| currentHealth | uint256 | Health value at specified time |
| damage | uint256 | Amount of damage dealt from fort.production.lastApplyState to specified timestamp |


### updateCurrentHealth

```solidity
function updateCurrentHealth() external
```

Updates settlement health to current block

_Can be called by everyone_




### createSiege

```solidity
function createSiege() external
```

Creates empty siege

_Can be called by everyone_




### updateHealthByApplyState

```solidity
function updateHealthByApplyState(uint256 healthDiff, bool isProduced) external
```

Updates fort health

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| healthDiff | uint256 | Health delta between current value and new value |
| isProduced | bool | Banner, whether health is produced or removed |



### massUpdate

```solidity
function massUpdate() external
```

Harvests all buildings

_Can be used by everyone_




### accumulatedCurrentProsperity

```solidity
function accumulatedCurrentProsperity(uint256 timestamp) external view returns (int256 currentProsperity)
```

Calculates current prosperity at specified timestamp

_Uses buildings productions to forecast amount of prosperity will settlement will have at specified time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate current prosperity |

| Name | Type | Description |
| ---- | ---- | ----------- |
| currentProsperity | int256 | Amount of prosperity at specified time |


### getCurrentSiegePower

```solidity
function getCurrentSiegePower() external view returns (uint256 currentSiegePower)
```

Calculates total siege power presented at current time

_Updated when army add/remove units from siege_


| Name | Type | Description |
| ---- | ---- | ----------- |
| currentSiegePower | uint256 | Amount of total siege power at current time |


### getSettlementOwner

```solidity
function getSettlementOwner() external view returns (address settlementOwner)
```

Calculates current settlement owner

_Settlements owner is considered an address, which holds ownerTokenId NFT_


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementOwner | address | Settlement owner |


### isRuler

```solidity
function isRuler(address potentialRuler) external view returns (bool isRuler)
```

Calculates whether provided address is settlement ruler or not

_Settlements ruler is an address which owns settlement or an address(es) by which settlement is/are governed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| potentialRuler | address | Address to check |

| Name | Type | Description |
| ---- | ---- | ----------- |
| isRuler | bool | Banner, whether specified address is ruler or not |


### extendProsperity

```solidity
function extendProsperity(uint256 prosperityAmount) external
```

Extends current settlement prosperity by specified amount

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityAmount | uint256 | Amount of prosperity to which extend current prosperity |



## ISettlement


Functions to read state/modify state in order to get current settlement parameters and/or interact with it





### NewBuilding

```solidity
event NewBuilding(address contractAddress, string scriptName)
```

Emitted when new building is placed, all building are placed on settlement creation


| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | New building address |
| scriptName | string | Building name |



### NewArmy

```solidity
event NewArmy(address armyAddress, uint32 position)
```

Emitted when settlements army is created, is it created on settlement creation


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | New army address |
| position | uint32 | Position |



### SiegeCreated

```solidity
event SiegeCreated(address siegeAddress)
```

Emitted when siege is created on settlement if not present. During settlements lifetime multiple sieges can be created (one after another, not multiple simultaneously)


| Name | Type | Description |
| ---- | ---- | ----------- |
| siegeAddress | address | New siege address |



### GovernorChanged

```solidity
event GovernorChanged(uint256 currentEpoch, address governorAddress, bool status)
```

Emitted when #addGovernor or #removeGovernor is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| currentEpoch | uint256 | Current governor epoch |
| governorAddress | address | Address of the governor event is applicable |
| status | bool | Is governor became active/inactive |



### NewSettlementEpoch

```solidity
event NewSettlementEpoch(uint256 currentEpoch)
```

Emitted when #removeGovernors is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| currentEpoch | uint256 | New governor epoch |



### currentZone

```solidity
function currentZone() external view returns (contract IZone)
```

Zone to which this settlement belongs

_Immutable, initialized on the settlement creation_




### ownerTokenId

```solidity
function ownerTokenId() external view returns (uint256)
```

Banner token id to which current settlement belongs

_Immutable, initialized on the settlement creation_




### siege

```solidity
function siege() external view returns (contract ISiege)
```

Siege of the settlement

_If any army is sieging settlement not address(0), otherwise address(0)_




### buildings

```solidity
function buildings(string buildingName) external view returns (contract IBuilding)
```

Mapping containing settlements buildings

_Types of buildings supported can be queried from registry_




### currentGovernorsEpoch

```solidity
function currentGovernorsEpoch() external view returns (uint256)
```

Current governors epoch

_Modified when #removeGovernors is called_




### governors

```solidity
function governors(uint256 epoch, address isGovernor) external view returns (bool)
```

Current settlements governors

_Modified when #addGovernor or #removeGovernor is called_




### army

```solidity
function army() external view returns (contract IArmy)
```

Settlements army
Immutable, initialized on the settlement creation





### extraProsperity

```solidity
function extraProsperity() external view returns (uint256)
```

Extra prosperity amount gained from demilitarization of any army on this settlement

_Used for determination amount of real prosperity this settlement has_




### position

```solidity
function position() external view returns (uint32)
```

Position on which settlement is created

_Immutable, initialized on the settlement creation_




### init

```solidity
function init(uint256 createdWithOwnerTokenId, address zoneAddress, uint32 settlementPosition) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| createdWithOwnerTokenId | uint256 | Banner token id to which current settlement belongs |
| zoneAddress | address | Zone address to which this settlement belongs |
| settlementPosition | uint32 | Position on which settlement is created |



### transferWorkers

```solidity
function transferWorkers(address buildingAddress, uint256 amount) external
```

Transfers workers from settlement to building

_Amount of workers to transfer is in 1e18 precision, however only integer amount can be transferred_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of the building transfer workers to |
| amount | uint256 | Amount of workers to transfer |



### transferResources

```solidity
function transferResources(string resourceName, address to, uint256 amount) external
```

Transfers game resource from settlement to specified address

_In case if someone accidentally transfers game resource to the settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Game resource name |
| to | address | Address that will receive resources |
| amount | uint256 | Amount to transfer |



### newBuilding

```solidity
function newBuilding(string buildingName) external returns (address buildingAddress)
```

Creates new building

_All buildings are created on settlement creation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingName | string | Building name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of created building |


### calculateCurrentHealthAndDamage

```solidity
function calculateCurrentHealthAndDamage(uint256 timestamp) external view returns (uint256 currentHealth, uint256 damage)
```

Calculates current fort health and damage dealt at specified timestamp

_Uses fort production and siege parameters to forecast health and damage will be dealt at specified time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate parameters |

| Name | Type | Description |
| ---- | ---- | ----------- |
| currentHealth | uint256 | Health value at specified time |
| damage | uint256 | Amount of damage dealt from fort.production.lastApplyState to specified timestamp |


### updateCurrentHealth

```solidity
function updateCurrentHealth() external
```

Updates settlement health to current block

_Can be called by everyone_




### createSiege

```solidity
function createSiege() external
```

Creates empty siege

_Can be called by everyone_




### updateHealthByApplyState

```solidity
function updateHealthByApplyState(uint256 healthDiff, bool isProduced) external
```

Updates fort health

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| healthDiff | uint256 | Health delta between current value and new value |
| isProduced | bool | Banner, whether health is produced or removed |



### massUpdate

```solidity
function massUpdate() external
```

Harvests all buildings

_Can be used by everyone_




### accumulatedCurrentProsperity

```solidity
function accumulatedCurrentProsperity(uint256 timestamp) external view returns (int256 currentProsperity)
```

Calculates current prosperity at specified timestamp

_Uses buildings productions to forecast amount of prosperity will settlement will have at specified time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate current prosperity |

| Name | Type | Description |
| ---- | ---- | ----------- |
| currentProsperity | int256 | Amount of prosperity at specified time |


### getCurrentSiegePower

```solidity
function getCurrentSiegePower() external view returns (uint256 currentSiegePower)
```

Calculates total siege power presented at current time

_Updated when army add/remove units from siege_


| Name | Type | Description |
| ---- | ---- | ----------- |
| currentSiegePower | uint256 | Amount of total siege power at current time |


### getSettlementOwner

```solidity
function getSettlementOwner() external view returns (address settlementOwner)
```

Calculates current settlement owner

_Settlements owner is considered an address, which holds ownerTokenId NFT_


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementOwner | address | Settlement owner |


### isRuler

```solidity
function isRuler(address potentialRuler) external view returns (bool isRuler)
```

Calculates whether provided address is settlement ruler or not

_Settlements ruler is an address which owns settlement or an address(es) by which settlement is/are governed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| potentialRuler | address | Address to check |

| Name | Type | Description |
| ---- | ---- | ----------- |
| isRuler | bool | Banner, whether specified address is ruler or not |


### extendProsperity

```solidity
function extendProsperity(uint256 prosperityAmount) external
```

Extends current settlement prosperity by specified amount

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityAmount | uint256 | Amount of prosperity to which extend current prosperity |



