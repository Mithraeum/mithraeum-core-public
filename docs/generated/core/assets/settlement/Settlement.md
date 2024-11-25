## Settlement








### relatedRegion

```solidity
contract IRegion relatedRegion
```

Region to which this settlement belongs

_Immutable, initialized on the settlement creation_




### bannerId

```solidity
uint256 bannerId
```

Banner token id to which current settlement belongs

_Immutable, initialized on the settlement creation_




### siege

```solidity
contract ISiege siege
```

Siege of the settlement

_If any army is besieging settlement not address(0), otherwise address(0)_




### buildings

```solidity
mapping(bytes32 => contract IBuilding) buildings
```

Mapping containing settlements buildings

_Types of buildings supported can be queried from registry_




### currentGovernorsGeneration

```solidity
uint256 currentGovernorsGeneration
```

Current governors generation

_Modified when #removeGovernors is called_




### governors

```solidity
mapping(uint256 => mapping(address => bool)) governors
```

Current settlements governors

_Modified when #addGovernor or #removeGovernor is called_




### army

```solidity
contract IArmy army
```

Settlements army
Immutable, initialized on the settlement creation





### extendedProsperityAmount

```solidity
uint256 extendedProsperityAmount
```

Amount of extended prosperity (currently gained units liquidation)

_Used for determination amount of real prosperity this settlement has_




### position

```solidity
uint64 position
```

Position on which settlement is created

_Immutable, initialized on the settlement creation_




### producedCorruptionIndex

```solidity
int256 producedCorruptionIndex
```

Amount of corruptionIndex produced by this settlement

_Modified when #increaseProducedCorruptionIndex or #decreaseProducedCorruptionIndex is called_




### onlySettlementOwner

```solidity
modifier onlySettlementOwner()
```



_Only settlement owner modifier
Modifier is calling internal function in order to reduce contract size_




### onlyRulerOrWorldAsset

```solidity
modifier onlyRulerOrWorldAsset()
```



_Only ruler or world asset modifier
Modifier is calling internal function in order to reduce contract size_




### init

```solidity
function init(bytes initParams) public
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### getSettlementOwner

```solidity
function getSettlementOwner() public view returns (address)
```

Calculates current settlement owner

_Settlements owner is considered an address, which holds bannerId Nft_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### updateProsperityAmount

```solidity
function updateProsperityAmount() public
```

Applies production of every building which produces prosperity

_Can be used by everyone_




### withdrawResources

```solidity
function withdrawResources(bytes32 resourceTypeId, address to, uint256 amount) public
```

Withdraws resources from settlement to specified address

_In case if someone accidentally transfers game resource to the settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| resourceTypeId | bytes32 | Resource type id |
| to | address | Address that will receive resources |
| amount | uint256 | Amount to transfer |



### modifyBuildingsProduction

```solidity
function modifyBuildingsProduction(struct ISettlement.BuildingProductionModificationParam[] params) public
```

Transfers game resources and workers from/to building depending on specified params

_Assigns resources and workers to building in single transaction
In case of transferring resources to building if resource.resourcesOwnerOrResourcesReceiver == address(0) -> resources will be taken from msg.sender
In case of transferring resources to building if resource.resourcesOwnerOrResourcesReceiver != address(0) and resourcesOwner has given allowance to msg.sender >= resourcesAmount -> resources will be taken from resource.resourcesOwnerOrResourcesReceiver_

| Name | Type | Description |
| ---- | ---- | ----------- |
| params | struct ISettlement.BuildingProductionModificationParam[] | An array of BuildingProductionModificationParam struct |



### updateFortHealth

```solidity
function updateFortHealth() public
```

Updates settlement health to current block

_Can be called by everyone_




### addGovernor

```solidity
function addGovernor(address governorAddress) public
```

Adds settlement governor

_Settlement owner and other governor can add governor_

| Name | Type | Description |
| ---- | ---- | ----------- |
| governorAddress | address | Address to add as the governor |



### removeGovernor

```solidity
function removeGovernor(address governorAddress) public
```

Removes settlement governor

_Only settlement owner can remove governor_

| Name | Type | Description |
| ---- | ---- | ----------- |
| governorAddress | address | Address to remove from governors |



### removeGovernors

```solidity
function removeGovernors() public
```

Removes all settlement governors

_Only settlement owner can remove all governors_




### swapProsperityForExactWorkers

```solidity
function swapProsperityForExactWorkers(uint256 workersToBuy, uint256 maxProsperityToSell) public
```

Swaps current settlement prosperity for exact workers

_Only ruler or world asset can perform swap_

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersToBuy | uint256 | Exact amount of workers to buy |
| maxProsperityToSell | uint256 | Maximum amount of prosperity to spend for exact workers |



### isRuler

```solidity
function isRuler(address potentialRuler) public view returns (bool)
```

Calculates whether provided address is settlement ruler or not

_Settlements ruler is an address which owns settlement or an address(es) by which settlement is/are governed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| potentialRuler | address | Address to check |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### extendProsperity

```solidity
function extendProsperity(uint256 prosperityAmount) public
```

Extends current settlement prosperity by specified amount

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityAmount | uint256 | Amount of prosperity to which extend current prosperity |



### beginTileCapture

```solidity
function beginTileCapture(uint64 position, uint256 prosperityStake) public
```

Begins tile capture


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |
| prosperityStake | uint256 | Prosperity stake |



### cancelTileCapture

```solidity
function cancelTileCapture(uint64 position) public
```

Cancels tile capture


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |



### giveUpCapturedTile

```solidity
function giveUpCapturedTile(uint64 position) public
```

Gives up captured tile


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |



### claimCapturedTile

```solidity
function claimCapturedTile(uint64 position) public
```

Claims captured tile


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |



### increaseProducedCorruptionIndex

```solidity
function increaseProducedCorruptionIndex(uint256 amount) public
```

Increases produced corruptionIndex

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount |



### decreaseProducedCorruptionIndex

```solidity
function decreaseProducedCorruptionIndex(uint256 amount) public
```

Decreases produced corruptionIndex

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount |



### isRottenSettlement

```solidity
function isRottenSettlement() public view returns (bool)
```

Calculates is settlement rotten or not



| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### destroyRottenSettlement

```solidity
function destroyRottenSettlement() public
```

Destroys current settlement

_Settlement will be removed only from crossErasMemory in order to give free space to new settlements_




### payToDecreaseCorruptionIndex

```solidity
function payToDecreaseCorruptionIndex(uint256 tokensAmount) public payable
```

Lowers settlement corruptionIndex by paying to the reward pool

_If world.erc20ForSettlementPurchase is address zero -> function is expected to receive Ether as msg.value in order to decrease corruptionIndex. If not address zero -> 'tokensAmount' parameter is used and it will be taken via 'erc20.transferFrom'
Only settlement in active era can decrease its corruptionIndex_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokensAmount | uint256 | Amount of tokens will be taken from sender (if world.erc20ForSettlementPurchase is not address zero) |



### _transferWorkersFromBuilding

```solidity
function _transferWorkersFromBuilding(contract IEra era, address buildingAddress, uint256 workersAmount) internal
```



_Transfers workers from building to this settlement_




### _transferWorkersToBuilding

```solidity
function _transferWorkersToBuilding(contract IEra era, address buildingAddress, uint256 workersAmount) internal
```



_Transfers workers to specified building address_




### _transferResourcesFromBuilding

```solidity
function _transferResourcesFromBuilding(contract IEra era, address buildingAddress, bytes32 resourceTypeId, address resourcesReceiver, uint256 resourcesAmount) internal
```



_Transfers resources from specified building to specified address_




### _transferResourcesToBuilding

```solidity
function _transferResourcesToBuilding(contract IEra era, address buildingAddress, bytes32 resourceTypeId, address resourcesOwnerOrResourcesReceiver, uint256 resourcesAmount) internal
```



_Transfers resources from specified address (or msg.sender) to specified building_




### _onlySettlementOwner

```solidity
function _onlySettlementOwner() internal view
```



_Allows caller to be settlement owner_




### _onlyRulerOrWorldAsset

```solidity
function _onlyRulerOrWorldAsset() internal view
```



_Allows caller to be settlement ruler or world asset_




