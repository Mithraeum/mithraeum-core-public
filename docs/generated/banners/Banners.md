## Banners


Acts as ERC721 Nft token, which supports ERC721 and ERC1155 parts as properties of every banner nft





### Part








```solidity
struct Part {
  address addr;
  uint256 id;
}
```

### BannerData








```solidity
struct BannerData {
  string name;
  struct Banners.Part[16] parts;
  bytes data;
}
```

### bannerData

```solidity
mapping(uint256 => struct Banners.BannerData) bannerData
```

Mapping containing banner data by provided token id

_Updated when #updateBanner or #mint is called_




### baseURI

```solidity
string baseURI
```

Base URI for computing token uri

_Updated on creation or when #updateURI is called_




### lastTokenId

```solidity
uint256 lastTokenId
```

Last created token id

_Updated when #mint is called_




### NewBanner

```solidity
event NewBanner(uint256 tokenIndex, string name, struct Banners.Part[16] parts, bytes data)
```

Emitted when #mint is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenIndex | uint256 | Newly created token id |
| name | string | Banner name |
| parts | struct Banners.Part[16] | Parts struct |
| data | bytes | Banner custom parameters |



### BannerUpdated

```solidity
event BannerUpdated(uint256 tokenIndex, string name, struct Banners.Part[16] parts, bytes data)
```

Emitted when #updateBanner is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenIndex | uint256 | Token id which was updated |
| name | string | New banner name |
| parts | struct Banners.Part[16] | New parts struct |
| data | bytes | New banner custom parameters |



### constructor

```solidity
constructor(string name_, string symbol_, string uri_) public
```







### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```







### _baseURI

```solidity
function _baseURI() internal view returns (string)
```



_Overridden value from ERC721_




### onERC1155Received

```solidity
function onERC1155Received(address operator, address from, uint256 id, uint256 value, bytes data) external returns (bytes4)
```



_Handles the receipt of a single ERC1155 token type. This function is
called at the end of a `safeTransferFrom` after the balance has been updated.

NOTE: To accept the transfer, this must return
`bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))`
(i.e. 0xf23a6e61, or its own function selector)._

| Name | Type | Description |
| ---- | ---- | ----------- |
| operator | address | The address which initiated the transfer (i.e. msg.sender) |
| from | address | The address which previously owned the token |
| id | uint256 | The ID of the token being transferred |
| value | uint256 | The amount of tokens being transferred |
| data | bytes | Additional data with no specified format |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes4 | `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))` if transfer is allowed |


### onERC1155BatchReceived

```solidity
function onERC1155BatchReceived(address operator, address from, uint256[] ids, uint256[] values, bytes data) external returns (bytes4)
```



_Handles the receipt of a multiple ERC1155 token types. This function
is called at the end of a `safeBatchTransferFrom` after the balances have
been updated.

NOTE: To accept the transfer(s), this must return
`bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`
(i.e. 0xbc197c81, or its own function selector)._

| Name | Type | Description |
| ---- | ---- | ----------- |
| operator | address | The address which initiated the batch transfer (i.e. msg.sender) |
| from | address | The address which previously owned the token |
| ids | uint256[] | An array containing ids of each token being transferred (order and length must match values array) |
| values | uint256[] | An array containing amounts of each token being transferred (order and length must match ids array) |
| data | bytes | Additional data with no specified format |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes4 | `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))` if transfer is allowed |


### getBannerData

```solidity
function getBannerData(uint256 tokenIndex) public view returns (string name, struct Banners.Part[16] parts, bytes data)
```

Returns banner data with parts

_Default mapping read method does not return all data_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenIndex | uint256 | Token index |

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | string | Banner name |
| parts | struct Banners.Part[16] | Banner parts |
| data | bytes | Banner data |


### getBannerDataByUserBatch

```solidity
function getBannerDataByUserBatch(address holderAddress) public view returns (uint256[] tokenIds, struct Banners.BannerData[] bannersData)
```

Returns all nfts with their banner data for specified holder address

_Used to query all nfts with their data without asking them one by one (may not work for holder with very large amount of nfts)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| holderAddress | address | Holder address |

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenIds | uint256[] | Token ids holder owns |
| bannersData | struct Banners.BannerData[] | Banner data for every token id |


### updateURI

```solidity
function updateURI(string _uri) public
```

Updates base token uri

_Only owner can modify base token uri_




### mint

```solidity
function mint(string name, struct Banners.Part[16] parts, bytes data) public
```

Mints banner with specified parameters

_Specified banner parts will be taken from msg.sender_

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | string | Banner name |
| parts | struct Banners.Part[16] | Banner parts |
| data | bytes | Banner custom parameters |



### addParts

```solidity
function addParts(uint256 tokenId, struct Banners.Part[16] parts) internal
```



_Transfers specified banner parts from msg.sender to this contract_




### updateBanner

```solidity
function updateBanner(uint256 tokenId, string name, struct Banners.Part[16] parts, bytes data) public
```

Updates banner with specified parameters


| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | banner token id which will be updated, old banner parts, if replaced, will be refunded to the owner |
| name | string | New banner name |
| parts | struct Banners.Part[16] | New banner parts |
| data | bytes | Banner custom parameters |



