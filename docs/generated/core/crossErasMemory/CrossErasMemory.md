## CrossErasMemory








### settlementByPosition

```solidity
mapping(uint64 => contract ISettlement) settlementByPosition
```

Mapping containing settlement by provided position

_Updated when #placeSettlementOnMap is called_




### settlementByBannerId

```solidity
mapping(uint256 => contract ISettlement) settlementByBannerId
```

Mapping containing settlement address by provided banner id

_Updated when #addUserSettlement is called_




### regionUserSettlementsCount

```solidity
mapping(uint64 => uint256) regionUserSettlementsCount
```

Mapping containing count of user settlement by provided region id

_Updated when #addUserSettlement or #removeUserSettlement is called_




### regionSettlementPrice

```solidity
mapping(uint64 => uint256) regionSettlementPrice
```

Mapping containing settlement price by provided region id

_Updated when #changeRegionSettlementPrice is called_




### regionSettlementPriceUpdateTime

```solidity
mapping(uint64 => uint256) regionSettlementPriceUpdateTime
```

Mapping containing settlement price update time by provided region id

_Updated when #changeRegionSettlementPrice is called_




### onlyActiveEra

```solidity
modifier onlyActiveEra()
```



_Only active era modifier
Modifier is calling internal function in order to reduce contract size_




### onlyWorldAssetFromOldEra

```solidity
modifier onlyWorldAssetFromOldEra()
```



_Only world asset from old era modifier
Modifier is calling internal function in order to reduce contract size_




### onlyWorldAssetFromActiveEra

```solidity
modifier onlyWorldAssetFromActiveEra()
```



_Only world asset from active era modifier
Modifier is calling internal function in order to reduce contract size_




### init

```solidity
function init(address worldAddress) public
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### addUserSettlement

```solidity
function addUserSettlement(uint256 bannerId, uint64 regionId, address settlementAddress, bool isNewSettlement) public
```

Adds user settlement

_Even though this function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| bannerId | uint256 | Banners token id which will represent to which settlement will be attached to |
| regionId | uint64 | Region id |
| settlementAddress | address | New settlement address |
| isNewSettlement | bool | Is new settlement |



### placeSettlementOnMap

```solidity
function placeSettlementOnMap(uint64 position, address settlementAddress) public
```

Places settlement on map (including system ones, like CULTISTS)

_Even though this function is opened, it can only be called by active era_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |
| settlementAddress | address | Settlement address |



### changeRegionSettlementPrice

```solidity
function changeRegionSettlementPrice(uint64 regionId, uint256 settlementPrice, uint256 lastUpdateTime) public
```

Changes region settlement price

_Even though this function is opened, it can only be called by world asset from active era_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionId | uint64 | Region id |
| settlementPrice | uint256 | Settlement price |
| lastUpdateTime | uint256 | Time at which price is changed |



### removeUserSettlement

```solidity
function removeUserSettlement(address settlementAddress) public
```

Removes user settlement

_Even though this function is opened, it can only be called by world asset from its era_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



### _onlyActiveEra

```solidity
function _onlyActiveEra() internal view
```



_Allows caller to be only active world era_




### _onlyWorldAssetFromOldEra

```solidity
function _onlyWorldAssetFromOldEra() internal view
```



_Allows caller to be only world asset from its era_




### _onlyWorldAssetFromActiveEra

```solidity
function _onlyWorldAssetFromActiveEra() internal view
```



_Allows caller to be only active world era_




