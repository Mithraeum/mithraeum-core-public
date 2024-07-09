## IEpoch


Functions to read state/modify state in order to get current epoch parameters and/or interact with it





### NewResource

```solidity
event NewResource(address resourceAddress, string resourceName)
```

Emitted when epoch resource is created


| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceAddress | address | Resource address |
| resourceName | string | Resource name |



### NewUnits

```solidity
event NewUnits(address unitsAddress, string unitsName)
```

Emitted when epoch units is created


| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsAddress | address | Units address |
| unitsName | string | Units name |



### NewWorkers

```solidity
event NewWorkers(address workersAddress)
```

Emitted when epoch workers is created


| Name | Type | Description |
| ---- | ---- | ----------- |
| workersAddress | address | Workers address |



### NewProsperity

```solidity
event NewProsperity(address prosperityAddress)
```

Emitted when epoch prosperity is created


| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityAddress | address | Prosperity address |



### NewZoneActivated

```solidity
event NewZoneActivated(address zoneAddress, uint256 zoneIndex)
```

Emitted when #activateZone is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneAddress | address | Zone address |
| zoneIndex | uint256 | Zone index |



### NewSettlement

```solidity
event NewSettlement(address contractAddress, string scriptName, address zoneAddress, uint32 position)
```

Emitted when #newAssetSettlement is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | Created settlement address |
| scriptName | string | Settlement type (BASIC/OCCULTISTS) |
| zoneAddress | address | Address of the zone where settlement is created |
| position | uint32 | Position |



### zones

```solidity
function zones(uint256 index) external view returns (contract IZone)
```

An array of attached zones to the continent

_Updated when #attachZoneToTheContinent is called_




### settlements

```solidity
function settlements(uint32 position) external view returns (contract ISettlement)
```

Mapping containing settlement by provided x and y coordinates

_Updated when new settlement is created_




### mostRecentOccultistsSummonTime

```solidity
function mostRecentOccultistsSummonTime() external view returns (uint256)
```

Most recent occultists summon time

_Updated when #increaseTotalOccultists is called_




### totalOccultists

```solidity
function totalOccultists() external view returns (uint256)
```

Total occultists

_Updated when #increaseTotalOccultists or #decreaseTotalOccultists is called_




### workers

```solidity
function workers() external view returns (contract IWorkers)
```

Workers token

_Updated when #setWorkersContract is called_




### prosperity

```solidity
function prosperity() external view returns (contract IProsperity)
```

Prosperity token

_Updated when #setProsperityContract is called_




### userSettlements

```solidity
function userSettlements(uint256 val) external view returns (contract ISettlement)
```

Mapping containing settlement address by provided banner id

_Updated when #addUserSettlement is called_




### resources

```solidity
function resources(string name) external view returns (contract IResource)
```

Mapping containing game resources by name

_Updated when #addResource is called_




### units

```solidity
function units(string name) external view returns (contract IUnits)
```

Mapping containing units by name

_Updated when #addUnit is called_




### init

```solidity
function init(uint256 epochNumber) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |



### activateZone

```solidity
function activateZone(uint256 zoneId) external
```

Creates zone with provided positions and tile types

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneId | uint256 | Zone id |



### restoreSettlement

```solidity
function restoreSettlement(uint32 position) external
```

Restores settlement from previous epoch by provided position

_Any address can restore user settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |



### newSettlement

```solidity
function newSettlement(uint32 position, uint256 ownerTokenId) external returns (address settlementAddress)
```

Creates new user settlement

_Bless tokens will be deducted from msg.sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |
| ownerTokenId | uint256 | Banners token id which will represent to which settlement will be attached to |

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |


### newAssetSettlement

```solidity
function newAssetSettlement(uint256 ownerTokenId, uint32 position, string assetName) external returns (address)
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
function summonOccultistsBatch(uint256[] zoneIndices) external
```

Summons occultists in specified zones

_Batch occultists summon_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneIndices | uint256[] | Zone indices |



### increaseTotalOccultists

```solidity
function increaseTotalOccultists(address occultistsArmyAddress, uint256 value) external
```

Increases total occultists

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists minted |



### decreaseTotalOccultists

```solidity
function decreaseTotalOccultists(address occultistsArmyAddress, uint256 value) external
```

Decreases total occultists

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists burned |



## IEpoch


Functions to read state/modify state in order to get current epoch parameters and/or interact with it





### NewResource

```solidity
event NewResource(address resourceAddress, string resourceName)
```

Emitted when epoch resource is created


| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceAddress | address | Resource address |
| resourceName | string | Resource name |



### NewUnits

```solidity
event NewUnits(address unitsAddress, string unitsName)
```

Emitted when epoch units is created


| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsAddress | address | Units address |
| unitsName | string | Units name |



### NewWorkers

```solidity
event NewWorkers(address workersAddress)
```

Emitted when epoch workers is created


| Name | Type | Description |
| ---- | ---- | ----------- |
| workersAddress | address | Workers address |



### NewProsperity

```solidity
event NewProsperity(address prosperityAddress)
```

Emitted when epoch prosperity is created


| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityAddress | address | Prosperity address |



### NewZoneActivated

```solidity
event NewZoneActivated(address zoneAddress, uint256 zoneIndex)
```

Emitted when #activateZone is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneAddress | address | Zone address |
| zoneIndex | uint256 | Zone index |



### NewSettlement

```solidity
event NewSettlement(address contractAddress, string scriptName, address zoneAddress, uint32 position)
```

Emitted when #newAssetSettlement is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| contractAddress | address | Created settlement address |
| scriptName | string | Settlement type (BASIC/OCCULTISTS) |
| zoneAddress | address | Address of the zone where settlement is created |
| position | uint32 | Position |



### zones

```solidity
function zones(uint256 index) external view returns (contract IZone)
```

An array of attached zones to the continent

_Updated when #attachZoneToTheContinent is called_




### settlements

```solidity
function settlements(uint32 position) external view returns (contract ISettlement)
```

Mapping containing settlement by provided x and y coordinates

_Updated when new settlement is created_




### mostRecentOccultistsSummonTime

```solidity
function mostRecentOccultistsSummonTime() external view returns (uint256)
```

Most recent occultists summon time

_Updated when #increaseTotalOccultists is called_




### totalOccultists

```solidity
function totalOccultists() external view returns (uint256)
```

Total occultists

_Updated when #increaseTotalOccultists or #decreaseTotalOccultists is called_




### workers

```solidity
function workers() external view returns (contract IWorkers)
```

Workers token

_Updated when #setWorkersContract is called_




### prosperity

```solidity
function prosperity() external view returns (contract IProsperity)
```

Prosperity token

_Updated when #setProsperityContract is called_




### userSettlements

```solidity
function userSettlements(uint256 val) external view returns (contract ISettlement)
```

Mapping containing settlement address by provided banner id

_Updated when #addUserSettlement is called_




### resources

```solidity
function resources(string name) external view returns (contract IResource)
```

Mapping containing game resources by name

_Updated when #addResource is called_




### units

```solidity
function units(string name) external view returns (contract IUnits)
```

Mapping containing units by name

_Updated when #addUnit is called_




### init

```solidity
function init(uint256 epochNumber) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| epochNumber | uint256 | Epoch number |



### activateZone

```solidity
function activateZone(uint256 zoneId) external
```

Creates zone with provided positions and tile types

_Even though function is opened, it can be called only by mightyCreator_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneId | uint256 | Zone id |



### restoreSettlement

```solidity
function restoreSettlement(uint32 position) external
```

Restores settlement from previous epoch by provided position

_Any address can restore user settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |



### newSettlement

```solidity
function newSettlement(uint32 position, uint256 ownerTokenId) external returns (address settlementAddress)
```

Creates new user settlement

_Bless tokens will be deducted from msg.sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |
| ownerTokenId | uint256 | Banners token id which will represent to which settlement will be attached to |

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |


### newAssetSettlement

```solidity
function newAssetSettlement(uint256 ownerTokenId, uint32 position, string assetName) external returns (address)
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
function summonOccultistsBatch(uint256[] zoneIndices) external
```

Summons occultists in specified zones

_Batch occultists summon_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneIndices | uint256[] | Zone indices |



### increaseTotalOccultists

```solidity
function increaseTotalOccultists(address occultistsArmyAddress, uint256 value) external
```

Increases total occultists

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists minted |



### decreaseTotalOccultists

```solidity
function decreaseTotalOccultists(address occultistsArmyAddress, uint256 value) external
```

Decreases total occultists

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| occultistsArmyAddress | address | Occultists army address |
| value | uint256 | Amount of occultists burned |



