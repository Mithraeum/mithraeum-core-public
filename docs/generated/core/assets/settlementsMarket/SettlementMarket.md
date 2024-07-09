## SettlementsMarket








### currentZone

```solidity
contract IZone currentZone
```

Zone to which this market belongs

_Immutable, initialized on the zone creation_




### lastPurchaseTime

```solidity
uint256 lastPurchaseTime
```

Time at which last purchase occurred

_Updated when #buySettlement is called_




### startingPrice

```solidity
uint256 startingPrice
```

Starting settlement price

_Updated when #buySettlement is called_




### init

```solidity
function init(address zoneAddress) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneAddress | address | Zone address |



### buySettlement

```solidity
function buySettlement(uint32 position, uint256 ownerTokenId, uint256 maxTokensToUse) public payable
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
function getNewSettlementCost() public view returns (uint256)
```

Returns amount of tokens new settlement will cost

_Calculates cost of placing new settlement in tokens_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


## SettlementsMarket








### currentZone

```solidity
contract IZone currentZone
```

Zone to which this market belongs

_Immutable, initialized on the zone creation_




### lastPurchaseTime

```solidity
uint256 lastPurchaseTime
```

Time at which last purchase occurred

_Updated when #buySettlement is called_




### startingPrice

```solidity
uint256 startingPrice
```

Starting settlement price

_Updated when #buySettlement is called_




### init

```solidity
function init(address zoneAddress) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneAddress | address | Zone address |



### buySettlement

```solidity
function buySettlement(uint32 position, uint256 ownerTokenId, uint256 maxTokensToUse) public payable
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
function getNewSettlementCost() public view returns (uint256)
```

Returns amount of tokens new settlement will cost

_Calculates cost of placing new settlement in tokens_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


