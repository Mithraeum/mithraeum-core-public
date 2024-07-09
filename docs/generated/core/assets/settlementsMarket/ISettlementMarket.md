## ISettlementsMarket


Functions to read state/modify state in order to buy settlement





### SettlementBought

```solidity
event SettlementBought(address settlementAddress, uint256 settlementCost)
```

Emitted when #buySettlement is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| settlementCost | uint256 | Settlement cost |



### currentZone

```solidity
function currentZone() external view returns (contract IZone)
```

Zone to which this market belongs

_Immutable, initialized on the zone creation_




### lastPurchaseTime

```solidity
function lastPurchaseTime() external view returns (uint256)
```

Time at which last purchase occurred

_Updated when #buySettlement is called_




### startingPrice

```solidity
function startingPrice() external view returns (uint256)
```

Starting settlement price

_Updated when #buySettlement is called_




### init

```solidity
function init(address zoneAddress) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneAddress | address | Zone address |



### buySettlement

```solidity
function buySettlement(uint32 position, uint256 ownerTokenId, uint256 maxTokensToUse) external payable
```

Buys settlement in zone

_Tokens will be deducted from msg.sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |
| ownerTokenId | uint256 | MithraeumBanners token id which will represent to which settlement will be attached to |
| maxTokensToUse | uint256 | Maximum amount of tokens to be withdrawn for settlement |



### getNewSettlementCost

```solidity
function getNewSettlementCost() external view returns (uint256 cost)
```

Returns amount of tokens new settlement will cost

_Calculates cost of placing new settlement in tokens_


| Name | Type | Description |
| ---- | ---- | ----------- |
| cost | uint256 | Amount of tokens new settlement will cost |


## ISettlementsMarket


Functions to read state/modify state in order to buy settlement





### SettlementBought

```solidity
event SettlementBought(address settlementAddress, uint256 settlementCost)
```

Emitted when #buySettlement is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| settlementCost | uint256 | Settlement cost |



### currentZone

```solidity
function currentZone() external view returns (contract IZone)
```

Zone to which this market belongs

_Immutable, initialized on the zone creation_




### lastPurchaseTime

```solidity
function lastPurchaseTime() external view returns (uint256)
```

Time at which last purchase occurred

_Updated when #buySettlement is called_




### startingPrice

```solidity
function startingPrice() external view returns (uint256)
```

Starting settlement price

_Updated when #buySettlement is called_




### init

```solidity
function init(address zoneAddress) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneAddress | address | Zone address |



### buySettlement

```solidity
function buySettlement(uint32 position, uint256 ownerTokenId, uint256 maxTokensToUse) external payable
```

Buys settlement in zone

_Tokens will be deducted from msg.sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint32 | Position |
| ownerTokenId | uint256 | MithraeumBanners token id which will represent to which settlement will be attached to |
| maxTokensToUse | uint256 | Maximum amount of tokens to be withdrawn for settlement |



### getNewSettlementCost

```solidity
function getNewSettlementCost() external view returns (uint256 cost)
```

Returns amount of tokens new settlement will cost

_Calculates cost of placing new settlement in tokens_


| Name | Type | Description |
| ---- | ---- | ----------- |
| cost | uint256 | Amount of tokens new settlement will cost |


