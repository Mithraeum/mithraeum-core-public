## SettlementsMarket








### relatedRegion

```solidity
contract IRegion relatedRegion
```

Region to which this market belongs

_Immutable, initialized on the market creation_




### marketCreationTime

```solidity
uint256 marketCreationTime
```

Time at which market was created

_Immutable, initialized on the market creation_




### init

```solidity
function init(bytes initParams) public
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### updateState

```solidity
function updateState() public
```

Updates settlement market state to the current block

_Called on every action which are based on settlement market state_




### buySettlementForFreeByMightyCreator

```solidity
function buySettlementForFreeByMightyCreator(uint64 position, uint256 bannerId) public
```

Buys settlement in region

_Even though function is opened, it can only be called by mighty creator and only before game begin time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |
| bannerId | uint256 | MithraeumBanners token id which will represent to which settlement will be attached to |



### buySettlement

```solidity
function buySettlement(uint64 position, uint256 bannerId, uint256 maxTokensToUse) public payable
```

Buys settlement in region

_Tokens will be deducted from msg.sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |
| bannerId | uint256 | MithraeumBanners token id which will represent to which settlement will be attached to |
| maxTokensToUse | uint256 | Maximum amount of tokens to be withdrawn for settlement |



### getNewSettlementCost

```solidity
function getNewSettlementCost(uint256 timestamp) public view returns (uint256)
```

Returns amount of tokens new settlement will cost

_Calculates cost of placing new settlement in tokens_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate new settlement cost. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### _getSettlementPriceDropMultiplier64

```solidity
function _getSettlementPriceDropMultiplier64(uint256 priceDecayBeginTime, uint256 priceDecayEndTime, uint256 userSettlementsCount) internal pure returns (int128)
```



_Calculates settlement price drop multiplier_




### _getPriceDecayBeginTime

```solidity
function _getPriceDecayBeginTime(uint256 gameBeginTime, uint256 marketCreationTime, uint256 priceUpdateTime) internal pure returns (uint256)
```



_Calculates price decay begin time based on provided params_




### _getPriceDecayEndTime

```solidity
function _getPriceDecayEndTime(uint256 timestamp, uint256 gameEndTime) internal pure returns (uint256)
```



_Calculates price decay end time based on provided params_




### _getCurrentTime

```solidity
function _getCurrentTime() internal view returns (uint256)
```



_Calculates current game time, taking into an account game end time_




