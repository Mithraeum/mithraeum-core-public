## ISettlement


Functions to read state/modify state in order to get current settlement parameters and/or interact with it





### ResourcesModificationParam








```solidity
struct ResourcesModificationParam {
  bool isTransferringResourcesFromBuilding;
  address resourcesOwnerOrResourcesReceiver;
  bytes32 resourceTypeId;
  uint256 resourcesAmount;
}
```

### BuildingProductionModificationParam








```solidity
struct BuildingProductionModificationParam {
  bytes32 buildingTypeId;
  bool isTransferringWorkersFromBuilding;
  uint256 workersAmount;
  struct ISettlement.ResourcesModificationParam[] resources;
}
```

### relatedRegion

```solidity
function relatedRegion() external view returns (contract IRegion)
```

Region to which this settlement belongs

_Immutable, initialized on the settlement creation_




### bannerId

```solidity
function bannerId() external view returns (uint256)
```

Banner token id to which current settlement belongs

_Immutable, initialized on the settlement creation_




### siege

```solidity
function siege() external view returns (contract ISiege)
```

Siege of the settlement

_If any army is besieging settlement not address(0), otherwise address(0)_




### buildings

```solidity
function buildings(bytes32 buildingTypeId) external view returns (contract IBuilding)
```

Mapping containing settlements buildings

_Types of buildings supported can be queried from registry_




### currentGovernorsGeneration

```solidity
function currentGovernorsGeneration() external view returns (uint256)
```

Current governors generation

_Modified when #removeGovernors is called_




### governors

```solidity
function governors(uint256 era, address isGovernor) external view returns (bool)
```

Current settlements governors

_Modified when #addGovernor or #removeGovernor is called_




### army

```solidity
function army() external view returns (contract IArmy)
```

Settlements army
Immutable, initialized on the settlement creation





### extendedProsperityAmount

```solidity
function extendedProsperityAmount() external view returns (uint256)
```

Amount of extended prosperity (currently gained units liquidation)

_Used for determination amount of real prosperity this settlement has_




### position

```solidity
function position() external view returns (uint64)
```

Position on which settlement is created

_Immutable, initialized on the settlement creation_




### producedCorruptionIndex

```solidity
function producedCorruptionIndex() external view returns (int256)
```

Amount of corruptionIndex produced by this settlement

_Modified when #increaseProducedCorruptionIndex or #decreaseProducedCorruptionIndex is called_




### BuildingCreated

```solidity
event BuildingCreated(address buildingAddress, bytes32 buildingTypeId)
```

Emitted when new building is placed, all building are placed on settlement creation


| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | New building address |
| buildingTypeId | bytes32 | Building type id |



### ArmyCreated

```solidity
event ArmyCreated(address armyAddress, uint64 position)
```

Emitted when settlements army is created, is it created on settlement creation


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| position | uint64 | Position |



### SiegeCreated

```solidity
event SiegeCreated(address siegeAddress)
```

Emitted when siege is created on settlement


| Name | Type | Description |
| ---- | ---- | ----------- |
| siegeAddress | address | Siege address |



### GovernorStatusChanged

```solidity
event GovernorStatusChanged(uint256 currentGovernorsGeneration, address governorAddress, address modifiedByAddress, bool newStatus)
```

Emitted when #addGovernor or #removeGovernor is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| currentGovernorsGeneration | uint256 | Current governors generation |
| governorAddress | address | Address of the governor event is applicable |
| modifiedByAddress | address | Address which modified governor status |
| newStatus | bool | Is governor became active/inactive |



### GovernorsGenerationChanged

```solidity
event GovernorsGenerationChanged(uint256 newGovernorsGeneration)
```

Emitted when #removeGovernors is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| newGovernorsGeneration | uint256 | New governors generation |



### Destroyed

```solidity
event Destroyed()
```

Emitted when #destroyRottenSettlement is called





### OnlySettlementOwner

```solidity
error OnlySettlementOwner()
```

Thrown when attempting to call action which can be called only by settlement owner





### OnlyRulerOrWorldAsset

```solidity
error OnlyRulerOrWorldAsset()
```

Thrown when attempting to call action which can be called only by ruler or world asset





### GovernorCannotBeAddedIfSenderNotSettlementOwnerOrAnotherGovernor

```solidity
error GovernorCannotBeAddedIfSenderNotSettlementOwnerOrAnotherGovernor()
```

Thrown when attempting to add governor by address which is neither settlement owner or another governor





### SettlementCannotBeDestroyedIfItsNotRotten

```solidity
error SettlementCannotBeDestroyedIfItsNotRotten()
```

Thrown when attempting to destroy settlement but its not rotten





### SettlementCannotBeDestroyedIfItsAlreadyRebuilt

```solidity
error SettlementCannotBeDestroyedIfItsAlreadyRebuilt()
```

Thrown when attempting to destroy settlement when it is already rebuilt





### SettlementCannotSendWorkersWithFractions

```solidity
error SettlementCannotSendWorkersWithFractions()
```

Thrown when attempting to transfer workers from settlement with non integer value





### SettlementCannotSendWorkersToBuildingOverMaximumAllowedCapacity

```solidity
error SettlementCannotSendWorkersToBuildingOverMaximumAllowedCapacity()
```

Thrown when attempting to transfer workers from settlement to building over maximum allowed workers capacity





### SettlementCannotDecreaseCorruptionIndexViaPaymentInInactiveEra

```solidity
error SettlementCannotDecreaseCorruptionIndexViaPaymentInInactiveEra()
```

Thrown when attempting to decrease corruptionIndex via payment in inactive era





### SettlementCannotDecreaseCorruptionIndexViaPaymentWrongParamProvided

```solidity
error SettlementCannotDecreaseCorruptionIndexViaPaymentWrongParamProvided()
```

Thrown when attempting to specify 'tokensAmount' parameter anything but zero whenever world.erc20ForSettlementPurchase is zero address





### CannotTransferProducingResourceFromBuilding

```solidity
error CannotTransferProducingResourceFromBuilding()
```

Thrown when attempting to transfer producing resource from building





### withdrawResources

```solidity
function withdrawResources(bytes32 resourceTypeId, address to, uint256 amount) external
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
function modifyBuildingsProduction(struct ISettlement.BuildingProductionModificationParam[] params) external
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
function updateFortHealth() external
```

Updates settlement health to current block

_Can be called by everyone_




### updateProsperityAmount

```solidity
function updateProsperityAmount() external
```

Applies production of every building which produces prosperity

_Can be used by everyone_




### getSettlementOwner

```solidity
function getSettlementOwner() external view returns (address settlementOwner)
```

Calculates current settlement owner

_Settlements owner is considered an address, which holds bannerId Nft_


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementOwner | address | Settlement owner |


### addGovernor

```solidity
function addGovernor(address governorAddress) external
```

Adds settlement governor

_Settlement owner and other governor can add governor_

| Name | Type | Description |
| ---- | ---- | ----------- |
| governorAddress | address | Address to add as the governor |



### removeGovernor

```solidity
function removeGovernor(address governorAddress) external
```

Removes settlement governor

_Only settlement owner can remove governor_

| Name | Type | Description |
| ---- | ---- | ----------- |
| governorAddress | address | Address to remove from governors |



### removeGovernors

```solidity
function removeGovernors() external
```

Removes all settlement governors

_Only settlement owner can remove all governors_




### swapProsperityForExactWorkers

```solidity
function swapProsperityForExactWorkers(uint256 workersToBuy, uint256 maxProsperityToSell) external
```

Swaps current settlement prosperity for exact workers

_Only ruler or world asset can perform swap_

| Name | Type | Description |
| ---- | ---- | ----------- |
| workersToBuy | uint256 | Exact amount of workers to buy |
| maxProsperityToSell | uint256 | Maximum amount of prosperity to spend for exact workers |



### isRuler

```solidity
function isRuler(address potentialRuler) external view returns (bool isRuler)
```

Calculates whether provided address is settlement ruler or not

_Settlements ruler is an address which owns settlement or an address(es) by which settlement is/are governed_

| Name | Type | Description |
| ---- | ---- | ----------- |
| potentialRuler | address | Address to check |

| Name | Type | Description |
| ---- | ---- | ----------- |
| isRuler | bool | Banner, whether specified address is ruler or not |


### extendProsperity

```solidity
function extendProsperity(uint256 prosperityAmount) external
```

Extends current settlement prosperity by specified amount

_Even though function is opened it can be called only by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| prosperityAmount | uint256 | Amount of prosperity to which extend current prosperity |



### beginTileCapture

```solidity
function beginTileCapture(uint64 position, uint256 prosperityStake) external
```

Begins tile capture


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |
| prosperityStake | uint256 | Prosperity stake |



### cancelTileCapture

```solidity
function cancelTileCapture(uint64 position) external
```

Cancels tile capture


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |



### giveUpCapturedTile

```solidity
function giveUpCapturedTile(uint64 position) external
```

Gives up captured tile


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |



### claimCapturedTile

```solidity
function claimCapturedTile(uint64 position) external
```

Claims captured tile


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |



### increaseProducedCorruptionIndex

```solidity
function increaseProducedCorruptionIndex(uint256 amount) external
```

Increases produced corruptionIndex

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount |



### decreaseProducedCorruptionIndex

```solidity
function decreaseProducedCorruptionIndex(uint256 amount) external
```

Decreases produced corruptionIndex

_Even though function is opened, it can only be called by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount | uint256 | Amount |



### isRottenSettlement

```solidity
function isRottenSettlement() external returns (bool isRottenSettlement)
```

Calculates is settlement rotten or not



| Name | Type | Description |
| ---- | ---- | ----------- |
| isRottenSettlement | bool | Is rotten settlement |


### destroyRottenSettlement

```solidity
function destroyRottenSettlement() external
```

Destroys current settlement

_Settlement will be removed only from crossErasMemory in order to give free space to new settlements_




### payToDecreaseCorruptionIndex

```solidity
function payToDecreaseCorruptionIndex(uint256 tokensAmount) external payable
```

Lowers settlement corruptionIndex by paying to the reward pool

_If world.erc20ForSettlementPurchase is address zero -> function is expected to receive Ether as msg.value in order to decrease corruptionIndex. If not address zero -> 'tokensAmount' parameter is used and it will be taken via 'erc20.transferFrom'
Only settlement in active era can decrease its corruptionIndex_

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokensAmount | uint256 | Amount of tokens will be taken from sender (if world.erc20ForSettlementPurchase is not address zero) |



