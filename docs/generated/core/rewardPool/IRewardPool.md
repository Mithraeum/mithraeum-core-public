## IRewardPool








### ratio

```solidity
function ratio() external view returns (int256)
```

Represents how much of weapons must be given for one unit of token

_Updated when #handleEpochDestroyed is called_




### invested

```solidity
function invested() external view returns (uint256)
```

Represents how much bless tokens must be repaid first to the mighty creator

_Updated when #investIntoPrizePool is called_




### lastBalance

```solidity
function lastBalance() external view returns (uint256)
```

Represents last reward pool total balance after repayment and function(s) are done

_Updated when #investIntoPrizePool or #handleEpochDestroyed or #swapWeaponsForTokens or #withdrawRepayment are called_




### init

```solidity
function init(address worldAddress) external
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### handleEpochDestroyed

```solidity
function handleEpochDestroyed() external
```

Handler of epoch destruction

_Must be called when epoch is destroyed_




### swapWeaponsForTokens

```solidity
function swapWeaponsForTokens(uint256 weaponsAmount) external
```

Swap provided amount of weapons

_Weapons will be deducted from msg.sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| weaponsAmount | uint256 | Amount of weapons to swap |



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




## IRewardPool








### ratio

```solidity
function ratio() external view returns (int256)
```

Represents how much of weapons must be given for one unit of token

_Updated when #handleEpochDestroyed is called_




### invested

```solidity
function invested() external view returns (uint256)
```

Represents how much bless tokens must be repaid first to the mighty creator

_Updated when #investIntoPrizePool is called_




### lastBalance

```solidity
function lastBalance() external view returns (uint256)
```

Represents last reward pool total balance after repayment and function(s) are done

_Updated when #investIntoPrizePool or #handleEpochDestroyed or #swapWeaponsForTokens or #withdrawRepayment are called_




### init

```solidity
function init(address worldAddress) external
```

Proxy initializer

_Called by address which created current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | World address |



### handleEpochDestroyed

```solidity
function handleEpochDestroyed() external
```

Handler of epoch destruction

_Must be called when epoch is destroyed_




### swapWeaponsForTokens

```solidity
function swapWeaponsForTokens(uint256 weaponsAmount) external
```

Swap provided amount of weapons

_Weapons will be deducted from msg.sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| weaponsAmount | uint256 | Amount of weapons to swap |



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




