## RewardPool








### defaultTokenPrice

```solidity
int128 defaultTokenPrice
```

Represents how much of ingots must be given for one unit of token by default (in 64.64 format)

_Updated when #handleEraDestroyed is called_




### toBeRepaidTokenAmount

```solidity
uint256 toBeRepaidTokenAmount
```

Represents how much bless tokens must be repaid first to the mighty creator

_Updated when #investIntoPrizePool is called_




### lastSyncedTokenBalance

```solidity
uint256 lastSyncedTokenBalance
```

Represents last synced reward pool total balance after repayment and function(s) are done

_Updated when #investIntoPrizePool or #swapIngotsForTokens or #withdrawRepayment are called_




### syncBalances

```solidity
modifier syncBalances(uint256 msgValue)
```



_Repays newly added balance to mighty creator_




### receive

```solidity
receive() external payable
```







### init

```solidity
function init(address worldAddress) public
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### investIntoPrizePool

```solidity
function investIntoPrizePool(uint256 amountToInvest) public payable
```

Invests specified amount of tokens into prize pool

_Bless tokens must be sent to this function (if its type=eth) or will be deducted from msg.sender (if its type=erc20)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountToInvest | uint256 | Amount of tokens to invest |



### swapIngotsForTokens

```solidity
function swapIngotsForTokens(address resourcesOwner, uint256 ingotsAmount, uint256 minTokensToReceive) public
```

Swap provided amount of ingots

_If resourcesOwner == address(0) -> resources will be taken from msg.sender
If resourcesOwner != address(0) and resourcesOwner has given allowance to msg.sender >= ingotsAmount -> resources will be taken from resourcesOwner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesOwner | address | Resources owner |
| ingotsAmount | uint256 | Amount of ingots to swap |
| minTokensToReceive | uint256 | Minimum amount of tokens to receive |



### withdrawRepayment

```solidity
function withdrawRepayment() public
```

Withdraws potential bless token added balance to the mighty creator

_Triggers withdraw of potential added balance_




### getTokensAmountOut

```solidity
function getTokensAmountOut(uint256 ingotsAmountIn) public view returns (uint256)
```

Calculates amount of tokens to be received by provided ingots amount

_Used to determine how much tokens will be received by provided ingots amount_

| Name | Type | Description |
| ---- | ---- | ----------- |
| ingotsAmountIn | uint256 | Ingots amount in |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getIngotsAmountIn

```solidity
function getIngotsAmountIn(uint256 tokensAmountOut) public view returns (uint256)
```

Calculates minimum amount of ingots required for specified amount of tokens to receive

_Used to determine how much tokens will be received by provided ingots amount_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokensAmountOut | uint256 | Tokens amount out |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getCurrentPrice

```solidity
function getCurrentPrice() public view returns (uint256)
```

Calculates current price of token in ingots



| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### _getTokensAmountOut

```solidity
function _getTokensAmountOut(uint256 ingotsAmountIn, uint256 tokenPrecision, uint256 price) internal pure returns (uint256)
```



_Calculates tokens amount out based on specified parameters_




### _getIngotsAmountIn

```solidity
function _getIngotsAmountIn(uint256 tokensAmountOut, uint256 tokenPrecision, uint256 price) internal pure returns (uint256)
```



_Calculates tokens amount out based on specified parameters_




### _getTokenPrecision

```solidity
function _getTokenPrecision() internal view returns (uint256)
```



_Returns token precision_




### _getCurrentPrice64

```solidity
function _getCurrentPrice64(uint256 currentEraNumber, uint256 currentEraCreationTime, uint256 gameBeginTime) internal view returns (int128)
```



_Calculates current token price based on current era and time passed since current era created (in 64.64 format)_




### _getRewardPoolBalance

```solidity
function _getRewardPoolBalance() internal view returns (uint256)
```



_Reads current balance_




### _sendTokens

```solidity
function _sendTokens(address to, uint256 amount) internal
```



_Sends bless tokens from this contract to specified address (either eth or erc20)_




