## SettlementsListings


Functions related to selling settlements for specific amount of tokens





### OrderStatus








```solidity
enum OrderStatus {
  NOT_EXIST,
  NEW,
  CANCELLED,
  ACCEPTED
}
```

### SharesInfo








```solidity
struct SharesInfo {
  bytes32 buildingTypeId;
  uint256 minSharesAmount;
}
```

### OrderDetails








```solidity
struct OrderDetails {
  address orderOwner;
  address sellingTokenAddress;
  address allowedAddressToAcceptOrder;
  uint256 orderStartTime;
  uint256 orderEndTime;
  uint256 price;
  uint256 bannerId;
  enum SettlementsListings.OrderStatus status;
}
```

### banners

```solidity
contract IERC721Enumerable banners
```

Banners contract

_Immutable, initialized in constructor_




### world

```solidity
contract IWorld world
```

World contract

_Immutable, initialized in constructor_




### orders

```solidity
mapping(uint256 => struct SettlementsListings.OrderDetails) orders
```

Mapping containing order id to related OrderDetails struct

_Modified when #createOrder or #acceptOrder or #cancelOrder is called_




### bannersOrders

```solidity
mapping(uint256 => uint256) bannersOrders
```

Mapping containing link from banner id to order id

_Modified when #createOrder or #createOrder is called_




### lastOrderId

```solidity
uint256 lastOrderId
```

Lastly created order id (0 if no orders is created)

_Modified when #createOrder is called_




### OrderCreated

```solidity
event OrderCreated(uint256 orderId, uint256 bannerId, address sellingTokenAddress, uint256 price, address allowedAddressToAcceptOrder, uint256 orderStartTime, uint256 orderEndTime)
```

Emitted when #createOrder is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| orderId | uint256 | Newly created order id |
| bannerId | uint256 | Banner id |
| sellingTokenAddress | address | Selling token address (address(0) if native eth currency is used) |
| price | uint256 | Price |
| allowedAddressToAcceptOrder | address | Allowed address to accept order (address(0) if any address can accept order) |
| orderStartTime | uint256 | Order start time (0 if order is started immediately) |
| orderEndTime | uint256 | Order end time (0 if order is lasting infinitely) |



### OrderCancelled

```solidity
event OrderCancelled(uint256 orderId)
```

Emitted when #cancelOrder is called (can be emitted when #createOrder is called once again after banner owner is changed)


| Name | Type | Description |
| ---- | ---- | ----------- |
| orderId | uint256 | Order id |



### OrderAccepted

```solidity
event OrderAccepted(uint256 orderId)
```

Emitted when #acceptOrder is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| orderId | uint256 | Order id |



### OrderModified

```solidity
event OrderModified(uint256 orderId, address sellingTokenAddress, uint256 price, address allowedAddressToAcceptOrder, uint256 orderStartTime, uint256 orderEndTime)
```

Emitted when #modifyOrder is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| orderId | uint256 | Order id |
| sellingTokenAddress | address | New selling token address (address(0) if native eth currency is used) |
| price | uint256 | New price |
| allowedAddressToAcceptOrder | address | New allowed address to accept order (address(0) if any address can accept order) |
| orderStartTime | uint256 | New order start time (0 if order is started immediately) |
| orderEndTime | uint256 | New order end time (0 if order is lasting infinitely) |



### CannotCreateOrderForNotOwnedBanner

```solidity
error CannotCreateOrderForNotOwnedBanner()
```

Thrown when attempting to create order while not owning banner which will be traded





### CannotCreateOrderForBannerMoreThanOnce

```solidity
error CannotCreateOrderForBannerMoreThanOnce()
```

Thrown when attempting to create order for one banner more than once





### CannotAcceptNotNewOrder

```solidity
error CannotAcceptNotNewOrder()
```

Thrown when attempting to accept order with non NEW status





### CannotAcceptOrderByNotAllowedAddress

```solidity
error CannotAcceptOrderByNotAllowedAddress()
```

Thrown when attempting to accept order if 'orderDetails.allowedAddressToAcceptOrder' exist and msg.sender is not that address





### CannotAcceptNotStartedOrder

```solidity
error CannotAcceptNotStartedOrder()
```

Thrown when attempting to accept order if 'orderDetails.orderStartTime' exist and order is not started





### CannotAcceptExpiredOrder

```solidity
error CannotAcceptExpiredOrder()
```

Thrown when attempting to accept order if 'orderDetails.orderEndTime' exist and order is already expired





### CannotAcceptOrderByProvidingNotExactPriceForIt

```solidity
error CannotAcceptOrderByProvidingNotExactPriceForIt()
```

Thrown when attempting to accept order without providing exact amount of tokens for it





### CannotAcceptOrderWithSharesToReceiveLowerThanSpecified

```solidity
error CannotAcceptOrderWithSharesToReceiveLowerThanSpecified()
```

Thrown when attempting to accept order with shares to receive in the process lower than specified





### CannotCancelActiveOrderIfCallerNotOrderOwnerAndOrderOwnerOwnsBanner

```solidity
error CannotCancelActiveOrderIfCallerNotOrderOwnerAndOrderOwnerOwnsBanner()
```

Thrown when attempting to cancel order if caller is not order owner and order owner owns banner





### CannotCancelNonNewOrder

```solidity
error CannotCancelNonNewOrder()
```

Thrown when attempting to cancel non NEW order





### CannotModifyNonNewOrder

```solidity
error CannotModifyNonNewOrder()
```

Thrown when attempting to modify non NEW order





### CannotModifyOrderByNonOrderOwner

```solidity
error CannotModifyOrderByNonOrderOwner()
```

Thrown when attempting to modify order by caller who is not order owner





### constructor

```solidity
constructor(address bannersAddress, address worldAddress) public
```







### createOrder

```solidity
function createOrder(uint256 bannerId, address sellingTokenAddress, uint256 price, address allowedAddressToAcceptOrder, uint256 orderStartTime, uint256 orderEndTime) public
```

Creates settlement order

_Creates order for specified amount of tokens_

| Name | Type | Description |
| ---- | ---- | ----------- |
| bannerId | uint256 | Banner id |
| sellingTokenAddress | address | Selling token address (address(0) if native eth currency is used) |
| price | uint256 | Price |
| allowedAddressToAcceptOrder | address | Allowed address to accept order (address(0) if any address can accept order) |
| orderStartTime | uint256 | Order start time (0 if order is started immediately) |
| orderEndTime | uint256 | Order end time (0 if order is lasting infinitely) |



### acceptOrder

```solidity
function acceptOrder(uint256 orderId, struct SettlementsListings.SharesInfo[] minBuildingsSharesToReceive) public payable
```

Accepts order

_Transfers banner id to msg.sender for provided amount of tokens (if ERC20 - they need to be approved beforehand, if native - they have to be sent to this function)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| orderId | uint256 | Order id |
| minBuildingsSharesToReceive | struct SettlementsListings.SharesInfo[] | Minimum amount of building shares to receive with orders' banner |



### cancelOrder

```solidity
function cancelOrder(uint256 orderId) public
```

Cancels order

_Can be called by order owner OR order owner is not banner owner (anyone can cancel order if order is not valid)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| orderId | uint256 | Order id |



### modifyOrder

```solidity
function modifyOrder(uint256 orderId, address sellingTokenAddress, uint256 price, address allowedAddressToAcceptOrder, uint256 orderStartTime, uint256 orderEndTime) public
```

Modifies order

_Selling token address, price can be modified; banner id cannot be modified_

| Name | Type | Description |
| ---- | ---- | ----------- |
| orderId | uint256 | Order id |
| sellingTokenAddress | address | New selling token address (address(0) if native eth currency is used) |
| price | uint256 | New price |
| allowedAddressToAcceptOrder | address | New allowed address to accept order (address(0) if any address can accept order) |
| orderStartTime | uint256 | New order start time (0 if order is started immediately) |
| orderEndTime | uint256 | New order end time (0 if order is lasting infinitely) |



