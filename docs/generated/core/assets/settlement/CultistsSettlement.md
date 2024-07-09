## CultistsSettlement








### relatedRegion

```solidity
contract IRegion relatedRegion
```

Region to which this settlement belongs

_Immutable, initialized on the settlement creation_




### army

```solidity
contract IArmy army
```

Settlements army
Immutable, initialized on the settlement creation





### position

```solidity
uint64 position
```

Position on which settlement is created

_Immutable, initialized on the settlement creation_




### Disabled

```solidity
error Disabled()
```

Thrown when attempting to call action which is disabled





### init

```solidity
function init(bytes initParams) public
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### isRuler

```solidity
function isRuler(address potentialRuler) public view returns (bool)
```

For cultists settlement any provided address is not ruler

_Settlements ruler is an address which owns settlement or an address(es) by which settlement is/are governed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| potentialRuler | address | Address to check |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### getSettlementOwner

```solidity
function getSettlementOwner() public view returns (address)
```

For cultists settlement this function is disabled

_Settlements owner is considered an address, which holds bannerId Nft_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### addGovernor

```solidity
function addGovernor(address governorAddress) public
```

For cultists settlement this function is disabled

_Settlement owner and other governor can add governor_

| Name | Type | Description |
| ---- | ---- | ----------- |
| governorAddress | address | Address to add as the governor |



### removeGovernor

```solidity
function removeGovernor(address governorAddress) public
```

For cultists settlement this function is disabled

_Only settlement owner can remove governor_

| Name | Type | Description |
| ---- | ---- | ----------- |
| governorAddress | address | Address to remove from governors |



### removeGovernors

```solidity
function removeGovernors() public
```

For cultists settlement this function is disabled

_Only settlement owner can remove all governors_




### swapProsperityForExactWorkers

```solidity
function swapProsperityForExactWorkers(uint256 workersToBuy, uint256 maxProsperityToSell) public
```

For cultists settlement this function is disabled

_Only ruler or world asset can perform swap_

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersToBuy | uint256 | Exact amount of workers to buy |
| maxProsperityToSell | uint256 | Maximum amount of prosperity to spend for exact workers |



### bannerId

```solidity
function bannerId() public view returns (uint256)
```

For cultists settlement this function is disabled

_Immutable, initialized on the settlement creation_




### siege

```solidity
function siege() public view returns (contract ISiege)
```

For cultists settlement this function is disabled

_If any army is besieging settlement not address(0), otherwise address(0)_




### producedCorruptionIndex

```solidity
function producedCorruptionIndex() public view returns (int256)
```

For cultists settlement this function is disabled

_Modified when #increaseProducedCorruptionIndex or #decreaseProducedCorruptionIndex is called_




### buildings

```solidity
function buildings(bytes32 buildingTypeId) public view returns (contract IBuilding)
```

For cultists settlement this function is disabled

_Types of buildings supported can be queried from registry_




### currentGovernorsGeneration

```solidity
function currentGovernorsGeneration() public view returns (uint256)
```

For cultists settlement this function is disabled

_Modified when #removeGovernors is called_




### governors

```solidity
function governors(uint256 era, address isGovernor) public view returns (bool)
```

For cultists settlement this function is disabled

_Modified when #addGovernor or #removeGovernor is called_




### extendedProsperityAmount

```solidity
function extendedProsperityAmount() public view returns (uint256)
```

For cultists settlement this function is disabled

_Used for determination amount of real prosperity this settlement has_




### assignResourcesAndWorkersToBuilding

```solidity
function assignResourcesAndWorkersToBuilding(address resourcesOwner, address buildingAddress, uint256 workersAmount, bytes32[] resourceTypeIds, uint256[] resourcesAmounts) public
```

For cultists settlement this function is disabled

_Assigns resources+workers to building in single transaction
If resourcesOwner == address(0) -> resources will be taken from msg.sender
If resourcesOwner != address(0) and resourcesOwner has given allowance to msg.sender >= resourcesAmount -> resources will be taken from resourcesOwner_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourcesOwner | address |  |
| buildingAddress | address | Building address |
| workersAmount | uint256 | Workers amount (in 1e18 precision) |
| resourceTypeIds | bytes32[] | Resource type ids |
| resourcesAmounts | uint256[] | Resources amounts |



### withdrawResources

```solidity
function withdrawResources(bytes32 resourceTypeId, address to, uint256 amount) public
```

For cultists settlement this function is disabled

_In case if someone accidentally transfers game resource to the settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Resource type id |
| to | address | Address that will receive resources |
| amount | uint256 | Amount to transfer |



### updateFortHealth

```solidity
function updateFortHealth() public
```

For cultists settlement this function is disabled

_Can be called by everyone_




### updateProsperityAmount

```solidity
function updateProsperityAmount() public
```

For cultists settlement this function is disabled

_Can be used by everyone_




### extendProsperity

```solidity
function extendProsperity(uint256 prosperityAmount) public
```

For cultists settlement this function is disabled

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityAmount | uint256 | Amount of prosperity to which extend current prosperity |



### beginTileCapture

```solidity
function beginTileCapture(uint64 position, uint256 prosperityStake) public
```

For cultists settlement this function is disabled


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |
| prosperityStake | uint256 | Prosperity stake |



### cancelTileCapture

```solidity
function cancelTileCapture(uint64 position) public
```

For cultists settlement this function is disabled


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |



### giveUpCapturedTile

```solidity
function giveUpCapturedTile(uint64 position) public
```

For cultists settlement this function is disabled


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |



### claimCapturedTile

```solidity
function claimCapturedTile(uint64 position) public
```

For cultists settlement this function is disabled


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |



### increaseProducedCorruptionIndex

```solidity
function increaseProducedCorruptionIndex(uint256 amount) public
```

For cultists settlement this function is disabled

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount |



### decreaseProducedCorruptionIndex

```solidity
function decreaseProducedCorruptionIndex(uint256 amount) public
```

For cultists settlement this function is disabled

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount |



### isRottenSettlement

```solidity
function isRottenSettlement() public view returns (bool)
```

For cultists settlement this function is disabled



| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### destroyRottenSettlement

```solidity
function destroyRottenSettlement() public
```

For cultists settlement this function is disabled

_Settlement will be removed only from crossErasMemory in order to give free space to new settlements_




### payToDecreaseCorruptionIndex

```solidity
function payToDecreaseCorruptionIndex(uint256 tokensAmount) public payable
```

For cultists settlement this function is disabled

_If world.erc20ForSettlementPurchase is address zero -> function is expected to receive Ether as msg.value in order to decrease corruptionIndex. If not address zero -> 'tokensAmount' parameter is used and it will be taken via 'erc20.transferFrom'
Only settlement in active era can decrease its corruptionIndex_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokensAmount | uint256 | Amount of tokens will be taken from sender (if world.erc20ForSettlementPurchase is not address zero) |



### _createArmy

```solidity
function _createArmy() internal
```



_Creates settlements army_




