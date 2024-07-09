## Settlement








### currentZone

```solidity
contract IZone currentZone
```

Zone to which this settlement belongs

_Immutable, initialized on the settlement creation_




### ownerTokenId

```solidity
uint256 ownerTokenId
```

Banner token id to which current settlement belongs

_Immutable, initialized on the settlement creation_




### siege

```solidity
contract ISiege siege
```

Siege of the settlement

_If any army is sieging settlement not address(0), otherwise address(0)_




### buildings

```solidity
mapping(string => contract IBuilding) buildings
```

Mapping containing settlements buildings

_Types of buildings supported can be queried from registry_




### currentGovernorsEpoch

```solidity
uint256 currentGovernorsEpoch
```

Current governors epoch

_Modified when #removeGovernors is called_




### governors

```solidity
mapping(uint256 => mapping(address => bool)) governors
```

Current settlements governors

_Modified when #addGovernor or #removeGovernor is called_




### army

```solidity
contract IArmy army
```

Settlements army
Immutable, initialized on the settlement creation





### extraProsperity

```solidity
uint256 extraProsperity
```

Extra prosperity amount gained from demilitarization of any army on this settlement

_Used for determination amount of real prosperity this settlement has_




### position

```solidity
uint32 position
```

Position on which settlement is created

_Immutable, initialized on the settlement creation_




### onlyOwner

```solidity
modifier onlyOwner()
```



_Allows caller to be settlement owner or world asset_




### onlyRulerOrWorldAsset

```solidity
modifier onlyRulerOrWorldAsset()
```



_Allows caller to be settlement ruler or world asset_




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



### getSettlementOwner

```solidity
function getSettlementOwner() public view returns (address)
```

Calculates current settlement owner

_Settlements owner is considered an address, which holds ownerTokenId NFT_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### newBuilding

```solidity
function newBuilding(string buildingName) public returns (address)
```

Creates new building

_All buildings are created on settlement creation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingName | string | Building name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### accumulatedCurrentProsperity

```solidity
function accumulatedCurrentProsperity(uint256 _timestamp) public view returns (int256)
```

Calculates current prosperity at specified timestamp

_Uses buildings productions to forecast amount of prosperity will settlement will have at specified time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _timestamp | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 |  |


### massUpdate

```solidity
function massUpdate() public
```

Harvests all buildings

_Can be used by everyone_




### transferWorkers

```solidity
function transferWorkers(address _to, uint256 _amount) public
```

Transfers workers from settlement to building

_Amount of workers to transfer is in 1e18 precision, however only integer amount can be transferred_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _to | address |  |
| _amount | uint256 |  |



### transferResources

```solidity
function transferResources(string _resourceName, address _to, uint256 _amount) public
```

Transfers game resource from settlement to specified address

_In case if someone accidentally transfers game resource to the settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _resourceName | string |  |
| _to | address |  |
| _amount | uint256 |  |



### updateHealthByApplyState

```solidity
function updateHealthByApplyState(uint256 _healthDiff, bool _isProduced) public
```

Updates fort health

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _healthDiff | uint256 |  |
| _isProduced | bool |  |



### updateCurrentHealth

```solidity
function updateCurrentHealth() public
```

Updates settlement health to current block

_Can be called by everyone_




### getCurrentSiegePower

```solidity
function getCurrentSiegePower() public view returns (uint256)
```

Calculates total siege power presented at current time

_Updated when army add/remove units from siege_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### calculateCurrentHealthAndDamage

```solidity
function calculateCurrentHealthAndDamage(uint256 timestamp) public view returns (uint256 currentHealth, uint256 damage)
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


### addGovernor

```solidity
function addGovernor(address _governorAddress) public
```

Adds settlement governor

_Settlement owner and other governor can add governor_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _governorAddress | address | Address to add as the governor |



### removeGovernor

```solidity
function removeGovernor(address _governorAddress) public
```

Removes settlement governor

_Only settlement owner can remove governor_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _governorAddress | address | Address to remove from governors |



### removeGovernors

```solidity
function removeGovernors() public
```

Removes all settlement governors

_Only settlement owner can remove all governors_




### isRuler

```solidity
function isRuler(address _address) public view returns (bool)
```

Calculates whether provided address is settlement ruler or not

_Settlements ruler is an address which owns settlement or an address(es) by which settlement is/are governed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _address | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### mintInitialResources

```solidity
function mintInitialResources() internal
```



_Mints initial settlement resources_




### createBuildings

```solidity
function createBuildings() internal
```



_Creates settlements buildings_




### createNewArmy

```solidity
function createNewArmy() internal
```



_Creates settlements army_




### createSiege

```solidity
function createSiege() public
```

Creates empty siege

_Can be called by everyone_




### swapProsperityForExactWorkers

```solidity
function swapProsperityForExactWorkers(uint256 _workersToBuy, uint256 _maxProsperityToSell) public
```

Swaps current settlement prosperity for exact workers

_Only ruler or world asset can perform swap_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _workersToBuy | uint256 | Exact amount of workers to buy |
| _maxProsperityToSell | uint256 | Maximum amount of prosperity to spend for exact workers |



### extendProsperity

```solidity
function extendProsperity(uint256 prosperityAmount) public
```

Extends current settlement prosperity by specified amount

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityAmount | uint256 | Amount of prosperity to which extend current prosperity |



## Settlement








### currentZone

```solidity
contract IZone currentZone
```

Zone to which this settlement belongs

_Immutable, initialized on the settlement creation_




### ownerTokenId

```solidity
uint256 ownerTokenId
```

Banner token id to which current settlement belongs

_Immutable, initialized on the settlement creation_




### siege

```solidity
contract ISiege siege
```

Siege of the settlement

_If any army is sieging settlement not address(0), otherwise address(0)_




### buildings

```solidity
mapping(string => contract IBuilding) buildings
```

Mapping containing settlements buildings

_Types of buildings supported can be queried from registry_




### currentGovernorsEpoch

```solidity
uint256 currentGovernorsEpoch
```

Current governors epoch

_Modified when #removeGovernors is called_




### governors

```solidity
mapping(uint256 => mapping(address => bool)) governors
```

Current settlements governors

_Modified when #addGovernor or #removeGovernor is called_




### army

```solidity
contract IArmy army
```

Settlements army
Immutable, initialized on the settlement creation





### extraProsperity

```solidity
uint256 extraProsperity
```

Extra prosperity amount gained from demilitarization of any army on this settlement

_Used for determination amount of real prosperity this settlement has_




### position

```solidity
uint32 position
```

Position on which settlement is created

_Immutable, initialized on the settlement creation_




### onlyOwner

```solidity
modifier onlyOwner()
```



_Allows caller to be settlement owner or world asset_




### onlyRulerOrWorldAsset

```solidity
modifier onlyRulerOrWorldAsset()
```



_Allows caller to be settlement ruler or world asset_




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



### getSettlementOwner

```solidity
function getSettlementOwner() public view returns (address)
```

Calculates current settlement owner

_Settlements owner is considered an address, which holds ownerTokenId NFT_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### newBuilding

```solidity
function newBuilding(string buildingName) public returns (address)
```

Creates new building

_All buildings are created on settlement creation_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingName | string | Building name |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### accumulatedCurrentProsperity

```solidity
function accumulatedCurrentProsperity(uint256 _timestamp) public view returns (int256)
```

Calculates current prosperity at specified timestamp

_Uses buildings productions to forecast amount of prosperity will settlement will have at specified time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _timestamp | uint256 |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | int256 |  |


### massUpdate

```solidity
function massUpdate() public
```

Harvests all buildings

_Can be used by everyone_




### transferWorkers

```solidity
function transferWorkers(address _to, uint256 _amount) public
```

Transfers workers from settlement to building

_Amount of workers to transfer is in 1e18 precision, however only integer amount can be transferred_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _to | address |  |
| _amount | uint256 |  |



### transferResources

```solidity
function transferResources(string _resourceName, address _to, uint256 _amount) public
```

Transfers game resource from settlement to specified address

_In case if someone accidentally transfers game resource to the settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _resourceName | string |  |
| _to | address |  |
| _amount | uint256 |  |



### updateHealthByApplyState

```solidity
function updateHealthByApplyState(uint256 _healthDiff, bool _isProduced) public
```

Updates fort health

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _healthDiff | uint256 |  |
| _isProduced | bool |  |



### updateCurrentHealth

```solidity
function updateCurrentHealth() public
```

Updates settlement health to current block

_Can be called by everyone_




### getCurrentSiegePower

```solidity
function getCurrentSiegePower() public view returns (uint256)
```

Calculates total siege power presented at current time

_Updated when army add/remove units from siege_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### calculateCurrentHealthAndDamage

```solidity
function calculateCurrentHealthAndDamage(uint256 timestamp) public view returns (uint256 currentHealth, uint256 damage)
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


### addGovernor

```solidity
function addGovernor(address _governorAddress) public
```

Adds settlement governor

_Settlement owner and other governor can add governor_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _governorAddress | address | Address to add as the governor |



### removeGovernor

```solidity
function removeGovernor(address _governorAddress) public
```

Removes settlement governor

_Only settlement owner can remove governor_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _governorAddress | address | Address to remove from governors |



### removeGovernors

```solidity
function removeGovernors() public
```

Removes all settlement governors

_Only settlement owner can remove all governors_




### isRuler

```solidity
function isRuler(address _address) public view returns (bool)
```

Calculates whether provided address is settlement ruler or not

_Settlements ruler is an address which owns settlement or an address(es) by which settlement is/are governed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _address | address |  |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### mintInitialResources

```solidity
function mintInitialResources() internal
```



_Mints initial settlement resources_




### createBuildings

```solidity
function createBuildings() internal
```



_Creates settlements buildings_




### createNewArmy

```solidity
function createNewArmy() internal
```



_Creates settlements army_




### createSiege

```solidity
function createSiege() public
```

Creates empty siege

_Can be called by everyone_




### swapProsperityForExactWorkers

```solidity
function swapProsperityForExactWorkers(uint256 _workersToBuy, uint256 _maxProsperityToSell) public
```

Swaps current settlement prosperity for exact workers

_Only ruler or world asset can perform swap_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _workersToBuy | uint256 | Exact amount of workers to buy |
| _maxProsperityToSell | uint256 | Maximum amount of prosperity to spend for exact workers |



### extendProsperity

```solidity
function extendProsperity(uint256 prosperityAmount) public
```

Extends current settlement prosperity by specified amount

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityAmount | uint256 | Amount of prosperity to which extend current prosperity |



