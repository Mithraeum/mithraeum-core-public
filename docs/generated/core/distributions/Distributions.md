## Distributions








### distributionReceivers

```solidity
mapping(uint256 => struct EnumerableSet.AddressSet) distributionReceivers
```



_Contains set of holders for specified nft id_




### world

```solidity
contract IWorld world
```

World

_Immutable, initialized on creation_




### distributionIdToBuildingAddress

```solidity
mapping(uint256 => address) distributionIdToBuildingAddress
```

Mapping containing distribution id to assigned building address

_Updated when #mint is called_




### lastDistributionId

```solidity
uint256 lastDistributionId
```

Last nft token id

_Updated when #mint is called_




### constructor

```solidity
constructor(address worldAddress_, string uri_) public
```







### onlyWorldAssetFromSameEpoch

```solidity
modifier onlyWorldAssetFromSameEpoch()
```



_Allows caller to be only world asset from same epoch_




### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal
```



_ERC1155 _beforeTokenTransfer hook_




### _afterTokenTransfer

```solidity
function _afterTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal
```



_ERC1155 _afterTokenTransfer hook_




### updateURI

```solidity
function updateURI(string _newUri) public
```

Updates token uri

_Only owner can modify token uri_




### getDistributionReceivers

```solidity
function getDistributionReceivers(uint256 distributionId) public view returns (address[])
```

Returns set of receivers as an array
@dev


| Name | Type | Description |
| ---- | ---- | ----------- |
| distributionId | uint256 | Distribution id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] |  |


### mint

```solidity
function mint(address to) public returns (uint256)
```

Mints new distribution Nft to specified address

_Can be called only by world asset from active epoch_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | An address which will receive new nft |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getItemsPerNft

```solidity
function getItemsPerNft() public pure returns (uint256)
```

Returns items per nft

_Used to determine percent holdings_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


## Distributions








### distributionReceivers

```solidity
mapping(uint256 => struct EnumerableSet.AddressSet) distributionReceivers
```



_Contains set of holders for specified nft id_




### world

```solidity
contract IWorld world
```

World

_Immutable, initialized on creation_




### distributionIdToBuildingAddress

```solidity
mapping(uint256 => address) distributionIdToBuildingAddress
```

Mapping containing distribution id to assigned building address

_Updated when #mint is called_




### lastDistributionId

```solidity
uint256 lastDistributionId
```

Last nft token id

_Updated when #mint is called_




### constructor

```solidity
constructor(address worldAddress_, string uri_) public
```







### onlyWorldAssetFromSameEpoch

```solidity
modifier onlyWorldAssetFromSameEpoch()
```



_Allows caller to be only world asset from same epoch_




### _beforeTokenTransfer

```solidity
function _beforeTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal
```



_ERC1155 _beforeTokenTransfer hook_




### _afterTokenTransfer

```solidity
function _afterTokenTransfer(address operator, address from, address to, uint256[] ids, uint256[] amounts, bytes data) internal
```



_ERC1155 _afterTokenTransfer hook_




### updateURI

```solidity
function updateURI(string _newUri) public
```

Updates token uri

_Only owner can modify token uri_




### getDistributionReceivers

```solidity
function getDistributionReceivers(uint256 distributionId) public view returns (address[])
```

Returns set of receivers as an array
@dev


| Name | Type | Description |
| ---- | ---- | ----------- |
| distributionId | uint256 | Distribution id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address[] |  |


### mint

```solidity
function mint(address to) public returns (uint256)
```

Mints new distribution Nft to specified address

_Can be called only by world asset from active epoch_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | An address which will receive new nft |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### getItemsPerNft

```solidity
function getItemsPerNft() public pure returns (uint256)
```

Returns items per nft

_Used to determine percent holdings_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


