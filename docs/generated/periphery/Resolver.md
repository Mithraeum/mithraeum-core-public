## Resolver


Contains defined world addresses





### worlds

```solidity
mapping(address => mapping(string => address)) worlds
```

World address

_Updated when #setWorldAddress is called_




### NewWorldAddress

```solidity
event NewWorldAddress(address deployer, string environmentName, address worldAddress)
```

Emitted when #setWorldAddress is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| deployer | address | Deployer address |
| environmentName | string | Environment name |
| worldAddress | address | New world address |



### setWorldAddress

```solidity
function setWorldAddress(string environmentName, address worldAddress) public
```

Updates world address

_Even though this function is opened, it can only be called by contract owner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| environmentName | string | Environment name |
| worldAddress | address | World address |



