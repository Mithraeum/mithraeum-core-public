## ICrossEpochsMemory


Functions to read state/modify state in order to get cross epoch memory parameters and/or interact with it





### settlements

```solidity
function settlements(uint32 position) external view returns (contract ISettlement)
```

Mapping containing settlement by provided x and y coordinates

_Updated when #handleNewSettlement is called_




### userSettlements

```solidity
function userSettlements(uint256 val) external view returns (contract ISettlement)
```

Mapping containing settlement address by provided banner id

_Updated when #handleNewUserSettlement or #handleSettlementRestored is called_




### zoneUserSettlementsCount

```solidity
function zoneUserSettlementsCount(uint256 zoneIndex) external view returns (uint256)
```

Mapping containing count of user settlement by provided zone index

_Updated when #handleNewUserSettlement is called_




### init

```solidity
function init(address worldAddress) external
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### handleUserSettlementRestored

```solidity
function handleUserSettlementRestored(uint32 position, address settlementAddress) external
```

Settlement restoration handler

_Must be called by active epoch to proper persist cross epoch data_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position at which restoration occurred |
| settlementAddress | address | New settlement address |



### handleNewUserSettlement

```solidity
function handleNewUserSettlement(uint256 ownerTokenId, uint256 zoneIndex, address settlementAddress) external
```

New user settlement handler

_Must be called by active epoch to proper persist cross epoch data_

| Name | Type | Description |
| ---- | ---- | ----------- |
| ownerTokenId | uint256 | Banners token id which will represent to which settlement will be attached to |
| zoneIndex | uint256 | Zone index |
| settlementAddress | address | New settlement address |



### handleNewSettlement

```solidity
function handleNewSettlement(uint32 position, address settlementAddress) external
```

New user settlement handler (including system ones, like OCCULTISTS)

_Must be called by active epoch to proper persist cross epoch data_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |
| settlementAddress | address | New settlement address |



## ICrossEpochsMemory


Functions to read state/modify state in order to get cross epoch memory parameters and/or interact with it





### settlements

```solidity
function settlements(uint32 position) external view returns (contract ISettlement)
```

Mapping containing settlement by provided x and y coordinates

_Updated when #handleNewSettlement is called_




### userSettlements

```solidity
function userSettlements(uint256 val) external view returns (contract ISettlement)
```

Mapping containing settlement address by provided banner id

_Updated when #handleNewUserSettlement or #handleSettlementRestored is called_




### zoneUserSettlementsCount

```solidity
function zoneUserSettlementsCount(uint256 zoneIndex) external view returns (uint256)
```

Mapping containing count of user settlement by provided zone index

_Updated when #handleNewUserSettlement is called_




### init

```solidity
function init(address worldAddress) external
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### handleUserSettlementRestored

```solidity
function handleUserSettlementRestored(uint32 position, address settlementAddress) external
```

Settlement restoration handler

_Must be called by active epoch to proper persist cross epoch data_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position at which restoration occurred |
| settlementAddress | address | New settlement address |



### handleNewUserSettlement

```solidity
function handleNewUserSettlement(uint256 ownerTokenId, uint256 zoneIndex, address settlementAddress) external
```

New user settlement handler

_Must be called by active epoch to proper persist cross epoch data_

| Name | Type | Description |
| ---- | ---- | ----------- |
| ownerTokenId | uint256 | Banners token id which will represent to which settlement will be attached to |
| zoneIndex | uint256 | Zone index |
| settlementAddress | address | New settlement address |



### handleNewSettlement

```solidity
function handleNewSettlement(uint32 position, address settlementAddress) external
```

New user settlement handler (including system ones, like OCCULTISTS)

_Must be called by active epoch to proper persist cross epoch data_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |
| settlementAddress | address | New settlement address |



