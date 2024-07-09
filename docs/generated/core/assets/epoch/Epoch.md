## Epoch








### zones

```solidity
mapping(uint256 => contract IZone) zones
```

An array of attached zones to the continent

_Updated when #attachZoneToTheContinent is called_




### settlements

```solidity
mapping(uint32 => contract ISettlement) settlements
```

Mapping containing settlement by provided x and y coordinates

_Updated when new settlement is created_




### mostRecentOccultistsSummonTime

```solidity
uint256 mostRecentOccultistsSummonTime
```

Most recent occultists summon time

_Updated when #increaseTotalOccultists is called_




### totalOccultists

```solidity
uint256 totalOccultists
```

Total occultists

_Updated when #increaseTotalOccultists or #decreaseTotalOccultists is called_




### workers

```solidity
contract IWorkers workers
```

Workers token

_Updated when #setWorkersContract is called_




### prosperity

```solidity
contract IProsperity prosperity
```

Prosperity token

_Updated when #setProsperityContract is called_




### resources

```solidity
mapping(string => contract IResource) resources
```

Mapping containing game resources by name

_Updated when #addResource is called_




### units

```solidity
mapping(string => contract IUnits) units
```

Mapping containing units by name

_Updated when #addUnit is called_




### userSettlements

```solidity
mapping(uint256 => contract ISettlement) userSettlements
```

Mapping containing settlement address by provided banner id

_Updated when #addUserSettlement is called_




### init

```solidity
function init(uint256 epochNumber) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |



### createNewProsperity

```solidity
function createNewProsperity(uint256 epoch) internal returns (address)
```







### createNewWorkers

```solidity
function createNewWorkers(uint256 epoch) internal returns (address)
```







### createNewResource

```solidity
function createNewResource(string resourceName, string resourceSymbol, string worldResourceName, uint256 epoch) internal returns (address)
```



_Creates new resource instance_




### createNewUnits

```solidity
function createNewUnits(string unitName, string unitSymbol, string worldUnitName, uint256 epoch) internal returns (address)
```



_Creates new units instance_




### activateZone

```solidity
function activateZone(uint256 zoneIndex) public
```

Creates zone with provided positions and tile types

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneIndex | uint256 |  |



### restoreSettlement

```solidity
function restoreSettlement(uint32 position) public
```

Restores settlement from previous epoch by provided position

_Any address can restore user settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |



### newSettlement

```solidity
function newSettlement(uint32 position, uint256 ownerTokenId) public returns (address)
```

Creates new user settlement

_Bless tokens will be deducted from msg.sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |
| ownerTokenId | uint256 | Banners token id which will represent to which settlement will be attached to |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### canNewSettlementBePlacedOnPosition

```solidity
function canNewSettlementBePlacedOnPosition(uint32 position) internal view returns (bool)
```



_Calculates if new settlement can be placed or not according to cross epoch settlement placement logic_




### addUserSettlement

```solidity
function addUserSettlement(uint256 ownerTokenId, address settlementAddress) internal
```



_Adds user settlement with its banner id_




### newAssetSettlement

```solidity
function newAssetSettlement(uint256 ownerTokenId, uint32 position, string assetName) public returns (address)
```

Creates settlement by type

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| ownerTokenId | uint256 | Banners token id which will represent to which settlement will be attached to |
| position | uint32 | Position |
| assetName | string | Settlement type (BASIC/OCCULTISTS) |



### summonOccultistsBatch

```solidity
function summonOccultistsBatch(uint256[] zoneIndices) public
```

Summons occultists in specified zones

_Batch occultists summon_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneIndices | uint256[] | Zone indices |



### increaseTotalOccultists

```solidity
function increaseTotalOccultists(address occultistsArmyAddress, uint256 value) public
```

Increases total occultists

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists minted |



### decreaseTotalOccultists

```solidity
function decreaseTotalOccultists(address occultistsArmyAddress, uint256 value) public
```

Decreases total occultists

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists burned |



## Epoch








### zones

```solidity
mapping(uint256 => contract IZone) zones
```

An array of attached zones to the continent

_Updated when #attachZoneToTheContinent is called_




### settlements

```solidity
mapping(uint32 => contract ISettlement) settlements
```

Mapping containing settlement by provided x and y coordinates

_Updated when new settlement is created_




### mostRecentOccultistsSummonTime

```solidity
uint256 mostRecentOccultistsSummonTime
```

Most recent occultists summon time

_Updated when #increaseTotalOccultists is called_




### totalOccultists

```solidity
uint256 totalOccultists
```

Total occultists

_Updated when #increaseTotalOccultists or #decreaseTotalOccultists is called_




### workers

```solidity
contract IWorkers workers
```

Workers token

_Updated when #setWorkersContract is called_




### prosperity

```solidity
contract IProsperity prosperity
```

Prosperity token

_Updated when #setProsperityContract is called_




### resources

```solidity
mapping(string => contract IResource) resources
```

Mapping containing game resources by name

_Updated when #addResource is called_




### units

```solidity
mapping(string => contract IUnits) units
```

Mapping containing units by name

_Updated when #addUnit is called_




### userSettlements

```solidity
mapping(uint256 => contract ISettlement) userSettlements
```

Mapping containing settlement address by provided banner id

_Updated when #addUserSettlement is called_




### init

```solidity
function init(uint256 epochNumber) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |



### createNewProsperity

```solidity
function createNewProsperity(uint256 epoch) internal returns (address)
```







### createNewWorkers

```solidity
function createNewWorkers(uint256 epoch) internal returns (address)
```







### createNewResource

```solidity
function createNewResource(string resourceName, string resourceSymbol, string worldResourceName, uint256 epoch) internal returns (address)
```



_Creates new resource instance_




### createNewUnits

```solidity
function createNewUnits(string unitName, string unitSymbol, string worldUnitName, uint256 epoch) internal returns (address)
```



_Creates new units instance_




### activateZone

```solidity
function activateZone(uint256 zoneIndex) public
```

Creates zone with provided positions and tile types

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneIndex | uint256 |  |



### restoreSettlement

```solidity
function restoreSettlement(uint32 position) public
```

Restores settlement from previous epoch by provided position

_Any address can restore user settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |



### newSettlement

```solidity
function newSettlement(uint32 position, uint256 ownerTokenId) public returns (address)
```

Creates new user settlement

_Bless tokens will be deducted from msg.sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |
| ownerTokenId | uint256 | Banners token id which will represent to which settlement will be attached to |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### canNewSettlementBePlacedOnPosition

```solidity
function canNewSettlementBePlacedOnPosition(uint32 position) internal view returns (bool)
```



_Calculates if new settlement can be placed or not according to cross epoch settlement placement logic_




### addUserSettlement

```solidity
function addUserSettlement(uint256 ownerTokenId, address settlementAddress) internal
```



_Adds user settlement with its banner id_




### newAssetSettlement

```solidity
function newAssetSettlement(uint256 ownerTokenId, uint32 position, string assetName) public returns (address)
```

Creates settlement by type

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| ownerTokenId | uint256 | Banners token id which will represent to which settlement will be attached to |
| position | uint32 | Position |
| assetName | string | Settlement type (BASIC/OCCULTISTS) |



### summonOccultistsBatch

```solidity
function summonOccultistsBatch(uint256[] zoneIndices) public
```

Summons occultists in specified zones

_Batch occultists summon_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneIndices | uint256[] | Zone indices |



### increaseTotalOccultists

```solidity
function increaseTotalOccultists(address occultistsArmyAddress, uint256 value) public
```

Increases total occultists

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists minted |



### decreaseTotalOccultists

```solidity
function decreaseTotalOccultists(address occultistsArmyAddress, uint256 value) public
```

Decreases total occultists

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists burned |



