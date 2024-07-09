## Resolver


Contains currently active world address





### world

```solidity
address world
```

World address

_Updated when #setWorldAddress is called_




### NewWorldAddress

```solidity
event NewWorldAddress(address worldAddress)
```

Emitted when #setWorldAddress is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| worldAddress | address | New world address |



### setWorldAddress

```solidity
function setWorldAddress(address _worldAddress) public
```

Updates world address

_Even though this function is opened, it can only be called by contract owner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _worldAddress | address | New world address |



