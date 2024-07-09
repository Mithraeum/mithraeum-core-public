## IDistributions








### world

```solidity
function world() external view returns (contract IWorld)
```

World

_Immutable, initialized on creation_




### distributionIdToBuildingAddress

```solidity
function distributionIdToBuildingAddress(uint256 distributionId) external view returns (address)
```

Mapping containing distribution id to assigned building address

_Updated when #mint is called_




### lastDistributionId

```solidity
function lastDistributionId() external view returns (uint256)
```

Last nft token id

_Updated when #mint is called_




### getDistributionReceivers

```solidity
function getDistributionReceivers(uint256 distributionId) external view returns (address[] receivers)
```

Returns set of receivers as an array
@dev


| Name | Type | Description |
| ---- | ---- | ----------- |
| distributionId | uint256 | Distribution id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| receivers | address[] | An array of receivers |


### mint

```solidity
function mint(address to) external returns (uint256 newDistributionId)
```

Mints new distribution Nft to specified address

_Can be called only by world asset from active epoch_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | An address which will receive new nft |

| Name | Type | Description |
| ---- | ---- | ----------- |
| newDistributionId | uint256 | Newly minted distribution id |


### getItemsPerNft

```solidity
function getItemsPerNft() external pure returns (uint256 itemsPerNft)
```

Returns items per nft

_Used to determine percent holdings_


| Name | Type | Description |
| ---- | ---- | ----------- |
| itemsPerNft | uint256 | Items per nft |


## IDistributions








### world

```solidity
function world() external view returns (contract IWorld)
```

World

_Immutable, initialized on creation_




### distributionIdToBuildingAddress

```solidity
function distributionIdToBuildingAddress(uint256 distributionId) external view returns (address)
```

Mapping containing distribution id to assigned building address

_Updated when #mint is called_




### lastDistributionId

```solidity
function lastDistributionId() external view returns (uint256)
```

Last nft token id

_Updated when #mint is called_




### getDistributionReceivers

```solidity
function getDistributionReceivers(uint256 distributionId) external view returns (address[] receivers)
```

Returns set of receivers as an array
@dev


| Name | Type | Description |
| ---- | ---- | ----------- |
| distributionId | uint256 | Distribution id |

| Name | Type | Description |
| ---- | ---- | ----------- |
| receivers | address[] | An array of receivers |


### mint

```solidity
function mint(address to) external returns (uint256 newDistributionId)
```

Mints new distribution Nft to specified address

_Can be called only by world asset from active epoch_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | An address which will receive new nft |

| Name | Type | Description |
| ---- | ---- | ----------- |
| newDistributionId | uint256 | Newly minted distribution id |


### getItemsPerNft

```solidity
function getItemsPerNft() external pure returns (uint256 itemsPerNft)
```

Returns items per nft

_Used to determine percent holdings_


| Name | Type | Description |
| ---- | ---- | ----------- |
| itemsPerNft | uint256 | Items per nft |


