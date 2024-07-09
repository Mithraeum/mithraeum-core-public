## IWorkers


Functions to read state/modify state in order to get current unit parameters and/or interact with it





### WorkersTransferInvalidParams

```solidity
error WorkersTransferInvalidParams()
```

Thrown when attempting to transfer workers with invalid from/to combinations (only specific contract combinations are allowed)





### mint

```solidity
function mint(address to, uint256 amount) external
```

Mints workers to specified address

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | Address which will receive workers |
| amount | uint256 | Amount of units to mint |


