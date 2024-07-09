## RewardPool








### ratio

```solidity
int256 ratio
```

Represents how much of weapons must be given for one unit of token

_Updated when #handleEpochDestroyed is called_




### invested

```solidity
uint256 invested
```

Represents how much bless tokens must be repaid first to the mighty creator

_Updated when #investIntoPrizePool is called_




### lastBalance

```solidity
uint256 lastBalance
```

Represents last reward pool total balance after repayment and function(s) are done

_Updated when #investIntoPrizePool or #handleEpochDestroyed or #swapWeaponsForTokens or #withdrawRepayment are called_




### RewardPoolUpdated

```solidity
event RewardPoolUpdated()
```







### onlyWorld

```solidity
modifier onlyWorld()
```



_Allows caller to be only world_




### syncBalances

```solidity
modifier syncBalances(uint256 msgValue)
```



_Repays newly added balance to mighty creator_




### getBlessBalance

```solidity
function getBlessBalance() internal returns (uint256)
```



_Reads current bless balance_




### sendTokens

```solidity
function sendTokens(address to, uint256 amount) internal
```



_Sends bless tokens from this contract to specified address (either eth or erc20)_




### increaseRatio

```solidity
function increaseRatio() internal
```



_Increases ratio
At start it is positive -> user need to pay RATIO weapons for 1 bless token
when it has become negative -> user need to pay 1 weapons for abs(RATIO) bless token_




### hasBalanceForRatio

```solidity
function hasBalanceForRatio() internal returns (bool)
```



_Check if current bless balance is ok for current ratio_




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



### handleEpochDestroyed

```solidity
function handleEpochDestroyed() public
```

Handler of epoch destruction

_Must be called when epoch is destroyed_




### swapWeaponsForTokens

```solidity
function swapWeaponsForTokens(uint256 weaponsAmount) public
```

Swap provided amount of weapons

_Weapons will be deducted from msg.sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| weaponsAmount | uint256 | Amount of weapons to swap |



### withdrawRepayment

```solidity
function withdrawRepayment() public
```

Withdraws potential bless token added balance to the mighty creator

_Triggers withdraw of potential added balance_




### receive

```solidity
receive() external payable
```







## RewardPool








### ratio

```solidity
int256 ratio
```

Represents how much of weapons must be given for one unit of token

_Updated when #handleEpochDestroyed is called_




### invested

```solidity
uint256 invested
```

Represents how much bless tokens must be repaid first to the mighty creator

_Updated when #investIntoPrizePool is called_




### lastBalance

```solidity
uint256 lastBalance
```

Represents last reward pool total balance after repayment and function(s) are done

_Updated when #investIntoPrizePool or #handleEpochDestroyed or #swapWeaponsForTokens or #withdrawRepayment are called_




### RewardPoolUpdated

```solidity
event RewardPoolUpdated()
```







### onlyWorld

```solidity
modifier onlyWorld()
```



_Allows caller to be only world_




### syncBalances

```solidity
modifier syncBalances(uint256 msgValue)
```



_Repays newly added balance to mighty creator_




### getBlessBalance

```solidity
function getBlessBalance() internal returns (uint256)
```



_Reads current bless balance_




### sendTokens

```solidity
function sendTokens(address to, uint256 amount) internal
```



_Sends bless tokens from this contract to specified address (either eth or erc20)_




### increaseRatio

```solidity
function increaseRatio() internal
```



_Increases ratio
At start it is positive -> user need to pay RATIO weapons for 1 bless token
when it has become negative -> user need to pay 1 weapons for abs(RATIO) bless token_




### hasBalanceForRatio

```solidity
function hasBalanceForRatio() internal returns (bool)
```



_Check if current bless balance is ok for current ratio_




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



### handleEpochDestroyed

```solidity
function handleEpochDestroyed() public
```

Handler of epoch destruction

_Must be called when epoch is destroyed_




### swapWeaponsForTokens

```solidity
function swapWeaponsForTokens(uint256 weaponsAmount) public
```

Swap provided amount of weapons

_Weapons will be deducted from msg.sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| weaponsAmount | uint256 | Amount of weapons to swap |



### withdrawRepayment

```solidity
function withdrawRepayment() public
```

Withdraws potential bless token added balance to the mighty creator

_Triggers withdraw of potential added balance_




### receive

```solidity
receive() external payable
```







