## BannerParts


Acts as ERC1155 Nft token for banner parts





### name

```solidity
string name
```

Collection name

_Immutable, initialized on creation_




### symbol

```solidity
string symbol
```

Collection symbol

_Immutable, initialized on creation_




### isFreePart

```solidity
mapping(uint256 => bool) isFreePart
```

Mapping containing if specified token id free or not

_Updated when #setFreeParts is called_




### isSafeApprovedAddress

```solidity
mapping(address => bool) isSafeApprovedAddress
```

Trusted addresses map which can transfer without approve (For example: Opensea contract can be trusted so user can list its parts without approve)

_Updated when #setSafeApprovedAddress_




### UnableToQueryBalanceOfZeroAddress

```solidity
error UnableToQueryBalanceOfZeroAddress()
```

Thrown when attempting to query balance of zero address





### constructor

```solidity
constructor(string _name, string _symbol, string uri_) public
```







### setSafeApprovedAddress

```solidity
function setSafeApprovedAddress(address _address, bool _status) public
```

Marks provided address as trusted for transfers without approve

_Even though function is opened, it can only by contract owner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _address | address | An address which will be marked as trusted or not |
| _status | bool | Is address trusted or not |



### updateURI

```solidity
function updateURI(string uri_) public
```

Updates base token uri

_Only owner can modify base token uri_




### setFreeParts

```solidity
function setFreeParts(uint256[] ids, bool[] statuses) public
```

Sets specified ids as free parts or not free parts

_Only owner can modify free parts_

| Name | Type | Description |
| ---- | ---- | ----------- |
| ids | uint256[] | Token ids |
| statuses | bool[] | Is free parts or not |



### isApprovedForAll

```solidity
function isApprovedForAll(address _owner, address _operator) public view returns (bool isOperator)
```







### mint

```solidity
function mint(address account, uint256 id, uint256 amount, bytes data) public
```

Mints specified ids with specified amounts to specified address

_Only owner can mint new parts_

| Name | Type | Description |
| ---- | ---- | ----------- |
| account | address | An address which will receive new parts |
| id | uint256 | New part id |
| amount | uint256 | Amount of nft that will be minted |
| data | bytes | Custom data |



### mintBatch

```solidity
function mintBatch(address to, uint256[] ids, uint256[] amounts, bytes data) public
```

Mints batch amount of ids with specified amounts to specified address

_Only owner can mint new parts_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | An address which will receive new parts |
| ids | uint256[] | New part ids |
| amounts | uint256[] | Amounts of nfts that will be minted |
| data | bytes | Custom data |



### burn

```solidity
function burn(address from, uint256 id, uint256 amount) public
```

Burns specified id with specified amount from specified address

_Only owner can burn parts_

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | An address from which tokens will be burned |
| id | uint256 | Token id |
| amount | uint256 | Amount of nft that will be burned |



### safeTransferFrom

```solidity
function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data) public
```







### balanceOf

```solidity
function balanceOf(address account, uint256 id) public view virtual returns (uint256)
```







