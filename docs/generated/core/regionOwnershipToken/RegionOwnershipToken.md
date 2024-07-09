## RegionOwnershipToken








### world

```solidity
contract IWorld world
```

World contract

_Immutable, initialized on creation_




### baseURI

```solidity
string baseURI
```

Base URI for computing token uri

_Updated on creation or when #updateURI is called_




### onlyGeography

```solidity
modifier onlyGeography()
```







### constructor

```solidity
constructor(string name_, string symbol_, string uri_, address worldAddress_) public
```







### _baseURI

```solidity
function _baseURI() internal view returns (string)
```



_Overridden value from ERC721_




### updateURI

```solidity
function updateURI(string _uri) public
```

Updates base token uri

_Only owner can modify base token uri_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _uri | string | New base token uri |



### getTokenIdsByAddress

```solidity
function getTokenIdsByAddress(address holderAddress) public view returns (uint256[] tokenIds)
```

Returns all token ids for specified holder address

_Used to query all token ids without asking them one by one (may not work for holder with very large amount of nfts)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| holderAddress | address | Holder address |

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenIds | uint256[] | Token ids holder owns |


### mint

```solidity
function mint(address to, uint256 regionId) public
```

Mints region ownership token

_Can only be called by geography contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Mint to address |
| regionId | uint256 | Region id |



