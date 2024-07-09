## IProsperity


Functions to read state/modify state in order to get current prosperity parameters and/or interact with it





### prosperitySpent

```solidity
function prosperitySpent(address settlementAddress) external view returns (uint256 amount)
```

Mapping containing amount of prosperity spend for workers buying

_Only settlements can spend prosperity for workers_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Address of settlement |

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount of prosperity spend for workers buying |


### spend

```solidity
function spend(address settlementAddress, uint256 amount) external
```

Spends prosperity for specified settlement address

_Called for settlement when settlement is buying workers_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Address of settlement |
| amount | uint256 | Amount of prosperity spend for workers buying |



### mint

```solidity
function mint(address to, uint256 amount) external
```

Mints prosperity to specified address

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Address which will receive prosperity |
| amount | uint256 | Amount of prosperity to mint |



## IProsperity


Functions to read state/modify state in order to get current prosperity parameters and/or interact with it





### prosperitySpent

```solidity
function prosperitySpent(address settlementAddress) external view returns (uint256 amount)
```

Mapping containing amount of prosperity spend for workers buying

_Only settlements can spend prosperity for workers_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Address of settlement |

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount of prosperity spend for workers buying |


### spend

```solidity
function spend(address settlementAddress, uint256 amount) external
```

Spends prosperity for specified settlement address

_Called for settlement when settlement is buying workers_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Address of settlement |
| amount | uint256 | Amount of prosperity spend for workers buying |



### mint

```solidity
function mint(address to, uint256 amount) external
```

Mints prosperity to specified address

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Address which will receive prosperity |
| amount | uint256 | Amount of prosperity to mint |



