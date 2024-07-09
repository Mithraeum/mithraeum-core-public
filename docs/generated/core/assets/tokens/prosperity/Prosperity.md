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


### constructor

```solidity
constructor() public
```



_Removes error for compiling, default constructor does nothing because its a proxy_




### init

```solidity
function init(bytes initParams) public
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### name

```solidity
function name() public view returns (string)
```







### symbol

```solidity
function symbol() public view returns (string)
```







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





### _isWorldAsset

```solidity
function _isWorldAsset(address addressToCheck) internal view returns (bool)
```



_Checks if provided address is world or world asset_




