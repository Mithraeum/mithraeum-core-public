## OccultistsSettlement








### currentZone

```solidity
contract IZone currentZone
```

Zone to which this settlement belongs

_Immutable, initialized on the settlement creation_




### army

```solidity
contract IArmy army
```

Settlements army
Immutable, initialized on the settlement creation





### position

```solidity
uint32 position
```

Position on which settlement is created

_Immutable, initialized on the settlement creation_




### init

```solidity
function init(uint256 createdWithOwnerTokenId, address zoneAddress, uint32 settlementPosition) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| createdWithOwnerTokenId | uint256 | Banner token id to which current settlement belongs |
| zoneAddress | address | Zone address to which this settlement belongs |
| settlementPosition | uint32 | Position on which settlement is created |



### createNewArmy

```solidity
function createNewArmy() internal
```



_Creates settlements army_




### isRuler

```solidity
function isRuler(address _user) public view returns (bool)
```

For occultists settlement any provided address is not ruler

_Settlements ruler is an address which owns settlement or an address(es) by which settlement is/are governed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _user | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### getSettlementOwner

```solidity
function getSettlementOwner() public view returns (address)
```

For occultists settlement this function is disabled

_Settlements owner is considered an address, which holds ownerTokenId NFT_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### ownerTokenId

```solidity
function ownerTokenId() public view returns (uint256)
```

For occultists settlement this function is disabled

_Immutable, initialized on the settlement creation_




### siege

```solidity
function siege() public view returns (contract ISiege)
```

For occultists settlement this function is disabled

_If any army is sieging settlement not address(0), otherwise address(0)_




### buildings

```solidity
function buildings(string buildingName) public view returns (contract IBuilding)
```

For occultists settlement this function is disabled

_Types of buildings supported can be queried from registry_




### currentGovernorsEpoch

```solidity
function currentGovernorsEpoch() public view returns (uint256)
```

For occultists settlement this function is disabled

_Modified when #removeGovernors is called_




### governors

```solidity
function governors(uint256 epoch, address isGovernor) public view returns (bool)
```

For occultists settlement this function is disabled

_Modified when #addGovernor or #removeGovernor is called_




### extraProsperity

```solidity
function extraProsperity() public view returns (uint256)
```

For occultists settlement this function is disabled

_Used for determination amount of real prosperity this settlement has_




### transferWorkers

```solidity
function transferWorkers(address _to, uint256 _amount) public
```

For occultists settlement this function is disabled

_Amount of workers to transfer is in 1e18 precision, however only integer amount can be transferred_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _to | address |  |
| _amount | uint256 |  |



### transferResources

```solidity
function transferResources(string resourceName, address _to, uint256 _amount) public
```

For occultists settlement this function is disabled

_In case if someone accidentally transfers game resource to the settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Game resource name |
| _to | address |  |
| _amount | uint256 |  |



### newBuilding

```solidity
function newBuilding(string _scriptName) public returns (address)
```

For occultists settlement this function is disabled

_All buildings are created on settlement creation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _scriptName | string |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### calculateCurrentHealthAndDamage

```solidity
function calculateCurrentHealthAndDamage(uint256 timestamp) public view returns (uint256 currentHealth, uint256 damage)
```

For occultists settlement this function is disabled

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
function updateCurrentHealth() public
```

For occultists settlement this function is disabled

_Can be called by everyone_




### createSiege

```solidity
function createSiege() public
```

For occultists settlement this function is disabled

_Can be called by everyone_




### updateHealthByApplyState

```solidity
function updateHealthByApplyState(uint256 _healthDiff, bool _isProduced) public
```

For occultists settlement this function is disabled

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _healthDiff | uint256 |  |
| _isProduced | bool |  |



### massUpdate

```solidity
function massUpdate() public
```

For occultists settlement this function is disabled

_Can be used by everyone_




### accumulatedCurrentProsperity

```solidity
function accumulatedCurrentProsperity(uint256 _timestamp) public view returns (int256)
```

For occultists settlement this function is disabled

_Uses buildings productions to forecast amount of prosperity will settlement will have at specified time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _timestamp | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 |  |


### getCurrentSiegePower

```solidity
function getCurrentSiegePower() public view returns (uint256)
```

For occultists settlement this function is disabled

_Updated when army add/remove units from siege_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### extendProsperity

```solidity
function extendProsperity(uint256 prosperityAmount) public
```

For occultists settlement this function is disabled

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityAmount | uint256 | Amount of prosperity to which extend current prosperity |



## OccultistsSettlement








### currentZone

```solidity
contract IZone currentZone
```

Zone to which this settlement belongs

_Immutable, initialized on the settlement creation_




### army

```solidity
contract IArmy army
```

Settlements army
Immutable, initialized on the settlement creation





### position

```solidity
uint32 position
```

Position on which settlement is created

_Immutable, initialized on the settlement creation_




### init

```solidity
function init(uint256 createdWithOwnerTokenId, address zoneAddress, uint32 settlementPosition) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| createdWithOwnerTokenId | uint256 | Banner token id to which current settlement belongs |
| zoneAddress | address | Zone address to which this settlement belongs |
| settlementPosition | uint32 | Position on which settlement is created |



### createNewArmy

```solidity
function createNewArmy() internal
```



_Creates settlements army_




### isRuler

```solidity
function isRuler(address _user) public view returns (bool)
```

For occultists settlement any provided address is not ruler

_Settlements ruler is an address which owns settlement or an address(es) by which settlement is/are governed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _user | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### getSettlementOwner

```solidity
function getSettlementOwner() public view returns (address)
```

For occultists settlement this function is disabled

_Settlements owner is considered an address, which holds ownerTokenId NFT_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### ownerTokenId

```solidity
function ownerTokenId() public view returns (uint256)
```

For occultists settlement this function is disabled

_Immutable, initialized on the settlement creation_




### siege

```solidity
function siege() public view returns (contract ISiege)
```

For occultists settlement this function is disabled

_If any army is sieging settlement not address(0), otherwise address(0)_




### buildings

```solidity
function buildings(string buildingName) public view returns (contract IBuilding)
```

For occultists settlement this function is disabled

_Types of buildings supported can be queried from registry_




### currentGovernorsEpoch

```solidity
function currentGovernorsEpoch() public view returns (uint256)
```

For occultists settlement this function is disabled

_Modified when #removeGovernors is called_




### governors

```solidity
function governors(uint256 epoch, address isGovernor) public view returns (bool)
```

For occultists settlement this function is disabled

_Modified when #addGovernor or #removeGovernor is called_




### extraProsperity

```solidity
function extraProsperity() public view returns (uint256)
```

For occultists settlement this function is disabled

_Used for determination amount of real prosperity this settlement has_




### transferWorkers

```solidity
function transferWorkers(address _to, uint256 _amount) public
```

For occultists settlement this function is disabled

_Amount of workers to transfer is in 1e18 precision, however only integer amount can be transferred_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _to | address |  |
| _amount | uint256 |  |



### transferResources

```solidity
function transferResources(string resourceName, address _to, uint256 _amount) public
```

For occultists settlement this function is disabled

_In case if someone accidentally transfers game resource to the settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceName | string | Game resource name |
| _to | address |  |
| _amount | uint256 |  |



### newBuilding

```solidity
function newBuilding(string _scriptName) public returns (address)
```

For occultists settlement this function is disabled

_All buildings are created on settlement creation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _scriptName | string |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### calculateCurrentHealthAndDamage

```solidity
function calculateCurrentHealthAndDamage(uint256 timestamp) public view returns (uint256 currentHealth, uint256 damage)
```

For occultists settlement this function is disabled

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
function updateCurrentHealth() public
```

For occultists settlement this function is disabled

_Can be called by everyone_




### createSiege

```solidity
function createSiege() public
```

For occultists settlement this function is disabled

_Can be called by everyone_




### updateHealthByApplyState

```solidity
function updateHealthByApplyState(uint256 _healthDiff, bool _isProduced) public
```

For occultists settlement this function is disabled

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _healthDiff | uint256 |  |
| _isProduced | bool |  |



### massUpdate

```solidity
function massUpdate() public
```

For occultists settlement this function is disabled

_Can be used by everyone_




### accumulatedCurrentProsperity

```solidity
function accumulatedCurrentProsperity(uint256 _timestamp) public view returns (int256)
```

For occultists settlement this function is disabled

_Uses buildings productions to forecast amount of prosperity will settlement will have at specified time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _timestamp | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 |  |


### getCurrentSiegePower

```solidity
function getCurrentSiegePower() public view returns (uint256)
```

For occultists settlement this function is disabled

_Updated when army add/remove units from siege_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### extendProsperity

```solidity
function extendProsperity(uint256 prosperityAmount) public
```

For occultists settlement this function is disabled

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityAmount | uint256 | Amount of prosperity to which extend current prosperity |



