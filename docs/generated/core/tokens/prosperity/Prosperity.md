## Prosperity








### prosperitySpent

```solidity
mapping(address => uint256) prosperitySpent
```

Mapping containing amount of prosperity spend for workers buying

_Only settlements can spend prosperity for workers_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### WORKERS_POOL_ASSET_TYPE

```solidity
bytes32 WORKERS_POOL_ASSET_TYPE
```

Bytes32 value for any workers pool asset type

_Used for determination if prosperity went from/to workers pool_




### epochNumber

```solidity
uint256 epochNumber
```

Epoch number

_To which epoch number current prosperity is related to_




### constructor

```solidity
constructor(address worldAddress, uint256 epoch) public
```







### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal
```



_ERC20 _beforeTokenTransfer hook_




### mint

```solidity
function mint(address to, uint256 amount) public
```

Mints prosperity to specified address

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Address which will receive prosperity |
| amount | uint256 | Amount of prosperity to mint |



### spend

```solidity
function spend(address from, uint256 amount) public
```

Spends prosperity for specified settlement address

_Called for settlement when settlement is buying workers_

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address |  |
| amount | uint256 | Amount of prosperity spend for workers buying |



### isWorldAsset

```solidity
function isWorldAsset(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is world or world asset_




### burnFrom

```solidity
function burnFrom(address account, uint256 amount) public
```







### transfer

```solidity
function transfer(address to, uint256 amount) public returns (bool success)
```

For prosperity default ERC20.transfer is disabled





### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) public returns (bool success)
```

For prosperity default ERC20.transferFrom is disabled





## Prosperity








### prosperitySpent

```solidity
mapping(address => uint256) prosperitySpent
```

Mapping containing amount of prosperity spend for workers buying

_Only settlements can spend prosperity for workers_

| Name | Type | Description |
| ---- | ---- | ----------- |

| Name | Type | Description |
| ---- | ---- | ----------- |


### WORKERS_POOL_ASSET_TYPE

```solidity
bytes32 WORKERS_POOL_ASSET_TYPE
```

Bytes32 value for any workers pool asset type

_Used for determination if prosperity went from/to workers pool_




### epochNumber

```solidity
uint256 epochNumber
```

Epoch number

_To which epoch number current prosperity is related to_




### constructor

```solidity
constructor(address worldAddress, uint256 epoch) public
```







### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address from, address to, uint256 amount) internal
```



_ERC20 _beforeTokenTransfer hook_




### mint

```solidity
function mint(address to, uint256 amount) public
```

Mints prosperity to specified address

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Address which will receive prosperity |
| amount | uint256 | Amount of prosperity to mint |



### spend

```solidity
function spend(address from, uint256 amount) public
```

Spends prosperity for specified settlement address

_Called for settlement when settlement is buying workers_

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address |  |
| amount | uint256 | Amount of prosperity spend for workers buying |



### isWorldAsset

```solidity
function isWorldAsset(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is world or world asset_




### burnFrom

```solidity
function burnFrom(address account, uint256 amount) public
```







### transfer

```solidity
function transfer(address to, uint256 amount) public returns (bool success)
```

For prosperity default ERC20.transfer is disabled





### transferFrom

```solidity
function transferFrom(address from, address to, uint256 amount) public returns (bool success)
```

For prosperity default ERC20.transferFrom is disabled





