## IRewardPool








### defaultTokenPrice

```solidity
function defaultTokenPrice() external view returns (int128)
```

Represents how much of ingots must be given for one unit of token by default (in 64.64 format)

_Updated when #handleEraDestroyed is called_




### toBeRepaidTokenAmount

```solidity
function toBeRepaidTokenAmount() external view returns (uint256)
```

Represents how much bless tokens must be repaid first to the mighty creator

_Updated when #investIntoPrizePool is called_




### lastSyncedTokenBalance

```solidity
function lastSyncedTokenBalance() external view returns (uint256)
```

Represents last synced reward pool total balance after repayment and function(s) are done

_Updated when #investIntoPrizePool or #swapIngotsForTokens or #withdrawRepayment are called_




### LastSyncedTokenBalanceUpdated

```solidity
event LastSyncedTokenBalanceUpdated(uint256 newLastSyncedTokenBalance)
```

Emitted when 'lastSyncedTokenBalance' updated


| Name | Type | Description |
| ---- | ---- | ----------- |
| newLastSyncedTokenBalance | uint256 | New last synced token balance |



### ToBeRepaidTokenAmountUpdated

```solidity
event ToBeRepaidTokenAmountUpdated(uint256 newToBeRepaidTokenAmount)
```

Emitted when 'toBeRepaidTokenAmount' updated


| Name | Type | Description |
| ---- | ---- | ----------- |
| newToBeRepaidTokenAmount | uint256 | New to be repaid token amount |



### EthBalanceUpdated

```solidity
event EthBalanceUpdated(uint256 newEthBalance)
```

Emitted when eth balance updated


| Name | Type | Description |
| ---- | ---- | ----------- |
| newEthBalance | uint256 | New eth balance |



### UnableToReceiveEther

```solidity
error UnableToReceiveEther()
```

Thrown when attempting to receive ether while having non native token reward





### NoTokensWillBeReceived

```solidity
error NoTokensWillBeReceived()
```

Thrown when attempting to swap ingots for tokens but specified ingots amount are not enough even for one unit of token





### TokensToBeReceivedLessThanMinimumRequired

```solidity
error TokensToBeReceivedLessThanMinimumRequired()
```

Thrown when attempting to swap ingots for tokens but amount of tokens to be received less than specified minimum amount





### NotEnoughTokensLeft

```solidity
error NotEnoughTokensLeft()
```

Thrown when attempting to swap ingots for tokens but not enough tokens left for specified ingots amount





### init

```solidity
function init(address worldAddress) external
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### swapIngotsForTokens

```solidity
function swapIngotsForTokens(address resourcesOwner, uint256 ingotsAmount, uint256 minTokensToReceive) external
```

Swap provided amount of ingots

_If resourcesOwner == address(0) -> resources will be taken from msg.sender
If resourcesOwner != address(0) and resourcesOwner has given allowance to msg.sender >= ingotsAmount -> resources will be taken from resourcesOwner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesOwner | address | Resources owner |
| ingotsAmount | uint256 | Amount of ingots to swap |
| minTokensToReceive | uint256 | Minimum amount of tokens to receive |



### investIntoPrizePool

```solidity
function investIntoPrizePool(uint256 amountToInvest) external payable
```

Invests specified amount of tokens into prize pool

_Bless tokens must be sent to this function (if its type=eth) or will be deducted from msg.sender (if its type=erc20)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountToInvest | uint256 | Amount of tokens to invest |



### withdrawRepayment

```solidity
function withdrawRepayment() external
```

Withdraws potential bless token added balance to the mighty creator

_Triggers withdraw of potential added balance_




### getTokensAmountOut

```solidity
function getTokensAmountOut(uint256 ingotsAmountIn) external view returns (uint256 tokensAmountOut)
```

Calculates amount of tokens to be received by provided ingots amount

_Used to determine how much tokens will be received by provided ingots amount_

| Name | Type | Description |
| ---- | ---- | ----------- |
| ingotsAmountIn | uint256 | Ingots amount in |

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokensAmountOut | uint256 | Tokens amount out |


### getIngotsAmountIn

```solidity
function getIngotsAmountIn(uint256 tokensAmountOut) external view returns (uint256 ingotsAmountIn)
```

Calculates minimum amount of ingots required for specified amount of tokens to receive

_Used to determine how much tokens will be received by provided ingots amount_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokensAmountOut | uint256 | Tokens amount out |

| Name | Type | Description |
| ---- | ---- | ----------- |
| ingotsAmountIn | uint256 | Ingots amount in |


### getCurrentPrice

```solidity
function getCurrentPrice() external view returns (uint256 price)
```

Calculates current price of token in ingots



| Name | Type | Description |
| ---- | ---- | ----------- |
| price | uint256 | Price |


