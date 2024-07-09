## ISettlementsMarket


Functions to read state/modify state in order to buy settlement





### relatedRegion

```solidity
function relatedRegion() external view returns (contract IRegion)
```

Region to which this market belongs

_Immutable, initialized on the market creation_




### marketCreationTime

```solidity
function marketCreationTime() external view returns (uint256)
```

Time at which market was created

_Immutable, initialized on the market creation_




### SettlementBought

```solidity
event SettlementBought(address settlementAddress, uint256 settlementCost)
```

Emitted when #buySettlement is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address |
| settlementCost | uint256 | Settlement cost |



### SettlementCannotBeBoughtForFreeAfterGameBegan

```solidity
error SettlementCannotBeBoughtForFreeAfterGameBegan()
```

Thrown when attempting to buy settlement for free by mighty creator after game began





### SettlementCannotBeBoughtForNotOwnerBannerNft

```solidity
error SettlementCannotBeBoughtForNotOwnerBannerNft()
```

Thrown when attempting to buy settlement for specified banner nft id and not owning it





### SettlementCannotBeBoughtOnNonExistentPosition

```solidity
error SettlementCannotBeBoughtOnNonExistentPosition()
```

Thrown when attempting to buy settlement on non existent position





### SettlementCannotBeBoughtOnPositionWhichIsNotRelatedToThisSettlementMarket

```solidity
error SettlementCannotBeBoughtOnPositionWhichIsNotRelatedToThisSettlementMarket()
```

Thrown when attempting to buy settlement on position which is not related to this settlement market





### SettlementCannotBeBoughtDueToCostIsHigherThanMaxTokensToUseSpecified

```solidity
error SettlementCannotBeBoughtDueToCostIsHigherThanMaxTokensToUseSpecified()
```

Thrown when attempting to buy settlement due to new settlement cost is higher than max tokens to use specified





### SettlementCannotBeBoughtDueInsufficientValueSent

```solidity
error SettlementCannotBeBoughtDueInsufficientValueSent()
```

Thrown when attempting to buy settlement due to insufficient value sent (only if world.erc20ForSettlementPurchase == address(0), which is equivalent of native token)





### updateState

```solidity
function updateState() external
```

Updates settlement market state to the current block

_Called on every action which are based on settlement market state_




### buySettlementForFreeByMightyCreator

```solidity
function buySettlementForFreeByMightyCreator(uint64 position, uint256 bannerId) external
```

Buys settlement in region

_Even though function is opened, it can only be called by mighty creator and only before game begin time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |
| bannerId | uint256 | MithraeumBanners token id which will represent to which settlement will be attached to |



### buySettlement

```solidity
function buySettlement(uint64 position, uint256 bannerId, uint256 maxTokensToUse) external payable
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
function getNewSettlementCost(uint256 timestamp) external view returns (uint256 cost)
```

Returns amount of tokens new settlement will cost

_Calculates cost of placing new settlement in tokens_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate new settlement cost. If timestamp=0 -> calculates as block.timestamp |

| Name | Type | Description |
| ---- | ---- | ----------- |
| cost | uint256 | Amount of tokens new settlement will cost |


