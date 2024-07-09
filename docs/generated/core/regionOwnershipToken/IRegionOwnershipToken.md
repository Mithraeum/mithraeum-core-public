## IRegionOwnershipToken








### OnlyGeography

```solidity
error OnlyGeography()
```

Thrown when attempting to call action which only possible to be called by geography





### updateURI

```solidity
function updateURI(string _uri) external
```

Updates base token uri

_Only owner can modify base token uri_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _uri | string | New base token uri |



### getTokenIdsByAddress

```solidity
function getTokenIdsByAddress(address holderAddress) external view returns (uint256[] tokenIds)
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
function mint(address to, uint256 regionId) external
```

Mints region ownership token

_Can only be called by geography contract_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Mint to address |
| regionId | uint256 | Region id |



