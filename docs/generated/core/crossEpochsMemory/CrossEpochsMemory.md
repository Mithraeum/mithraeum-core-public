## CrossEpochsMemory








### settlements

```solidity
mapping(uint32 => contract ISettlement) settlements
```

Mapping containing settlement by provided x and y coordinates

_Updated when #handleNewSettlement is called_




### userSettlements

```solidity
mapping(uint256 => contract ISettlement) userSettlements
```

Mapping containing settlement address by provided banner id

_Updated when #handleNewUserSettlement or #handleSettlementRestored is called_




### zoneUserSettlementsCount

```solidity
mapping(uint256 => uint256) zoneUserSettlementsCount
```

Mapping containing count of user settlement by provided zone index

_Updated when #handleNewUserSettlement is called_




### onlyActiveEpoch

```solidity
modifier onlyActiveEpoch()
```



_Allows caller to be only active world epoch_




### init

```solidity
function init(address worldAddress) public
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### handleUserSettlementRestored

```solidity
function handleUserSettlementRestored(uint32 position, address settlementAddress) public
```

Settlement restoration handler

_Must be called by active epoch to proper persist cross epoch data_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position at which restoration occurred |
| settlementAddress | address | New settlement address |



### handleNewUserSettlement

```solidity
function handleNewUserSettlement(uint256 ownerTokenId, uint256 zoneIndex, address settlementAddress) public
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
function handleNewSettlement(uint32 position, address settlementAddress) public
```

New user settlement handler (including system ones, like OCCULTISTS)

_Must be called by active epoch to proper persist cross epoch data_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |
| settlementAddress | address | New settlement address |



## CrossEpochsMemory








### settlements

```solidity
mapping(uint32 => contract ISettlement) settlements
```

Mapping containing settlement by provided x and y coordinates

_Updated when #handleNewSettlement is called_




### userSettlements

```solidity
mapping(uint256 => contract ISettlement) userSettlements
```

Mapping containing settlement address by provided banner id

_Updated when #handleNewUserSettlement or #handleSettlementRestored is called_




### zoneUserSettlementsCount

```solidity
mapping(uint256 => uint256) zoneUserSettlementsCount
```

Mapping containing count of user settlement by provided zone index

_Updated when #handleNewUserSettlement is called_




### onlyActiveEpoch

```solidity
modifier onlyActiveEpoch()
```



_Allows caller to be only active world epoch_




### init

```solidity
function init(address worldAddress) public
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### handleUserSettlementRestored

```solidity
function handleUserSettlementRestored(uint32 position, address settlementAddress) public
```

Settlement restoration handler

_Must be called by active epoch to proper persist cross epoch data_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position at which restoration occurred |
| settlementAddress | address | New settlement address |



### handleNewUserSettlement

```solidity
function handleNewUserSettlement(uint256 ownerTokenId, uint256 zoneIndex, address settlementAddress) public
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
function handleNewSettlement(uint32 position, address settlementAddress) public
```

New user settlement handler (including system ones, like OCCULTISTS)

_Must be called by active epoch to proper persist cross epoch data_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |
| settlementAddress | address | New settlement address |



