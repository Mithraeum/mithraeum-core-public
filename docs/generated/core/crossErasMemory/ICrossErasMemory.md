## ICrossErasMemory


Functions to read state/modify state in order to get cross era memory parameters and/or interact with it





### settlementByPosition

```solidity
function settlementByPosition(uint64 position) external view returns (contract ISettlement)
```

Mapping containing settlement by provided position

_Updated when #placeSettlementOnMap is called_




### settlementByBannerId

```solidity
function settlementByBannerId(uint256 bannerId) external view returns (contract ISettlement)
```

Mapping containing settlement address by provided banner id

_Updated when #addUserSettlement is called_




### regionUserSettlementsCount

```solidity
function regionUserSettlementsCount(uint64 regionId) external view returns (uint256)
```

Mapping containing count of user settlement by provided region id

_Updated when #addUserSettlement or #removeUserSettlement is called_




### regionSettlementPrice

```solidity
function regionSettlementPrice(uint64 regionId) external view returns (uint256)
```

Mapping containing settlement price by provided region id

_Updated when #changeRegionSettlementPrice is called_




### regionSettlementPriceUpdateTime

```solidity
function regionSettlementPriceUpdateTime(uint64 regionId) external view returns (uint256)
```

Mapping containing settlement price update time by provided region id

_Updated when #changeRegionSettlementPrice is called_




### SettlementOnPositionUpdated

```solidity
event SettlementOnPositionUpdated(uint64 position, address settlementAddress)
```

Emitted when #placeSettlementOnMap or #removeUserSettlement is called





### OnlyActiveEra

```solidity
error OnlyActiveEra()
```

Thrown when attempting to call action which can only be called by active era





### OnlyWorldAssetFromOldEra

```solidity
error OnlyWorldAssetFromOldEra()
```

Thrown when attempting to call action which can only be called by old era





### OnlyWorldAssetFromActiveEra

```solidity
error OnlyWorldAssetFromActiveEra()
```

Thrown when attempting to call action which can only be called by world asset from active era





### init

```solidity
function init(address worldAddress) external
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### addUserSettlement

```solidity
function addUserSettlement(uint256 bannerId, uint64 regionId, address settlementAddress, bool isNewSettlement) external
```

Adds user settlement

_Even though this function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| bannerId | uint256 | Banners token id which will represent to which settlement will be attached to |
| regionId | uint64 | Region id |
| settlementAddress | address | New settlement address |
| isNewSettlement | bool | Is new settlement |



### changeRegionSettlementPrice

```solidity
function changeRegionSettlementPrice(uint64 regionId, uint256 settlementPrice, uint256 lastUpdateTime) external
```

Changes region settlement price

_Even though this function is opened, it can only be called by world asset from active era_

| Name | Type | Description |
| ---- | ---- | ----------- |
| regionId | uint64 | Region id |
| settlementPrice | uint256 | Settlement price |
| lastUpdateTime | uint256 | Time at which price is changed |



### placeSettlementOnMap

```solidity
function placeSettlementOnMap(uint64 position, address settlementAddress) external
```

Places settlement on map (including system ones, like CULTISTS)

_Even though this function is opened, it can only be called by active era_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |
| settlementAddress | address | Settlement address |



### removeUserSettlement

```solidity
function removeUserSettlement(address settlementAddress) external
```

Removes user settlement

_Even though this function is opened, it can only be called by world asset from its era_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |



