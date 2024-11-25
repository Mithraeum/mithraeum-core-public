## IArmy


Functions to read state/modify state in order to get current army parameters and/or interact with it





### ManeuverInfo








```solidity
struct ManeuverInfo {
  uint64 beginTime;
  uint64 endTime;
  uint64 destinationPosition;
  uint64 secretDestinationRegionId;
  bytes32 secretDestinationPosition;
}
```

### StunInfo








```solidity
struct StunInfo {
  uint64 beginTime;
  uint64 endTime;
}
```

### relatedSettlement

```solidity
function relatedSettlement() external view returns (contract ISettlement)
```

Settlement address to which this army belongs

_Immutable, initialized on the army creation_




### currentPosition

```solidity
function currentPosition() external view returns (uint64)
```

Position where army currently stands on

_Updated when army updates position. It does not take into account if army is maneuvering
To proper query current position use #getCurrentPosition_




### battle

```solidity
function battle() external view returns (contract IBattle)
```

Battle in which army is on

_If army is not in battle returns address(0). It does not take into account if battle is ended but army is not left the battle_




### maneuverInfo

```solidity
function maneuverInfo() external view returns (uint64 beginTime, uint64 endTime, uint64 destinationPosition, uint64 secretDestinationRegionId, bytes32 secretDestinationPosition)
```

Maneuver info

_Updated when army begins maneuvering. It does not take into account if army is ended maneuver by time_




### stunInfo

```solidity
function stunInfo() external view returns (uint64 beginTime, uint64 endTime)
```

Stun info

_Updated when army stun is applied_




### additionalUnitsBattleMultipliers

```solidity
function additionalUnitsBattleMultipliers(bytes32 unitTypeId) external view returns (uint256)
```

Mapping containing additional unit battle multiplier

_Updated when #increaseUnitBattleMultiplier or #decreaseUnitBattleMultiplier is called_




### lastDemilitarizationTime

```solidity
function lastDemilitarizationTime() external view returns (uint64)
```

Last demilitarization time

_Updated when #demilitarize is called_




### UpdatedPosition

```solidity
event UpdatedPosition(address settlementAddress, uint64 position)
```

Emitted when #updatePosition is called (even though event can be emitted only on the next action related to the current army, de-facto army will update position based on 'maneuverInfo.endTime'


| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Address of the settlement where army currently staying on |
| position | uint64 | Position |



### BattleCreated

```solidity
event BattleCreated(address battleAddress, address targetArmyAddress)
```

Emitted when #createBattle is called. Army which attacks another army will emit this event


| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Created battle address |
| targetArmyAddress | address | Address of the attacked army |



### JoinedBattle

```solidity
event JoinedBattle(address battleAddress, uint256 side)
```

Emitted when army joins battle. At the battle creation both armies (attacker and attacked) will emit this event. Attacker army will be side A and at attacked army will be sideB


| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Address of the battle army joined in |
| side | uint256 | Side to which army joined (sideA = 1, sideB = 2) |



### ExitedFromBattle

```solidity
event ExitedFromBattle(address battleAddress)
```

Emitted when #updateState is called (even though event can be emitted only on the next action related to the current army, de-facto army will exit battle when battle is ended)


| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Address of the battle army was in |



### ManeuveringBegan

```solidity
event ManeuveringBegan(uint64 position, uint64 secretDestinationRegionId, bytes32 secretDestinationPosition, uint256 beginTime, uint256 endTime, uint256 tokensToSpendOnAcceleration)
```

Emitted when #beginOpenManeuver or #beginSecretManeuver or #revealSecretManeuver is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position army is maneuvering to (0 if secret maneuver) |
| secretDestinationRegionId | uint64 | Secret destination regionId (not zero if secret maneuver) |
| secretDestinationPosition | bytes32 | Secret destination position (not zero if secret maneuver) |
| beginTime | uint256 | Time at which maneuver began |
| endTime | uint256 | Time at which maneuver will end (0 if secret maneuver) |
| tokensToSpendOnAcceleration | uint256 | Amount of tokens to spend on acceleration (Food for open maneuver, Wood for secret maneuver) |



### SecretManeuverCancelled

```solidity
event SecretManeuverCancelled()
```

Emitted when #cancelSecretManeuver is called





### StunApplied

```solidity
event StunApplied(uint64 stunBeginTime, uint64 stunEndTime)
```

Emitted when #_applyStun is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| stunBeginTime | uint64 | Stun begin time |
| stunEndTime | uint64 | Stun end time |



### UnitsDemilitarized

```solidity
event UnitsDemilitarized(bytes32[] unitTypeIds, uint256[] unitsAmounts)
```

Emitted when #demilitarize is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeIds | bytes32[] | Unit type ids demilitarized |
| unitsAmounts | uint256[] | Amount of units demilitarized |



### OnlyRulerOrWorldAssetFromSameEra

```solidity
error OnlyRulerOrWorldAssetFromSameEra()
```

Thrown when attempting to call action which only possible to be called by ruler, world or world asset





### ArmyIsStunned

```solidity
error ArmyIsStunned()
```

Thrown when attempting to call action which is blocked when army is stunned





### ArmyIsManeuvering

```solidity
error ArmyIsManeuvering()
```

Thrown when attempting to call action which is blocked when army is maneuvering





### ArmyIsInBattle

```solidity
error ArmyIsInBattle()
```

Thrown when attempting to call action which is blocked when army is in battle





### ArmyIsInSiege

```solidity
error ArmyIsInSiege()
```

Thrown when attempting to call action which is blocked when army is in siege





### ArmyCannotManeuverToSamePosition

```solidity
error ArmyCannotManeuverToSamePosition()
```

Thrown when attempting to begin maneuver to same position





### ArmyCannotManeuverToPositionWithoutSettlement

```solidity
error ArmyCannotManeuverToPositionWithoutSettlement()
```

Thrown when attempting to maneuver to position without settlement





### ArmyWithoutUnitsCannotManeuverToNotHomeSettlement

```solidity
error ArmyWithoutUnitsCannotManeuverToNotHomeSettlement()
```

Thrown when attempting to maneuver without units to non-home position





### ArmyWithoutUnitsCannotAccelerate

```solidity
error ArmyWithoutUnitsCannotAccelerate()
```

Thrown when attempting to maneuver without units but with acceleration





### ArmyWithoutUnitsCannotBeginSecretManeuver

```solidity
error ArmyWithoutUnitsCannotBeginSecretManeuver()
```

Thrown when attempting to secretly maneuver without units





### ArmyIsNotManeuveringSecretly

```solidity
error ArmyIsNotManeuveringSecretly()
```

Thrown when attempting to reveal or cancel secret maneuver





### WrongSecretManeuverRevealInfo

```solidity
error WrongSecretManeuverRevealInfo()
```

Thrown when attempting to reveal secret maneuver with invalid reveal info





### SecretManeuverRevealNotPossibleToNotSpecifiedRegion

```solidity
error SecretManeuverRevealNotPossibleToNotSpecifiedRegion()
```

Thrown when attempting to reveal secret maneuver with valid reveal info but wrong region





### SecretManeuverRevealNotPossibleAtThisTime

```solidity
error SecretManeuverRevealNotPossibleAtThisTime()
```

Thrown when attempting to reveal secret maneuver at invalid time





### WrongDemilitarizationInput

```solidity
error WrongDemilitarizationInput()
```

Thrown when attempting to demilitarize with invalid input





### NotEnoughUnitsForDemilitarization

```solidity
error NotEnoughUnitsForDemilitarization()
```

Thrown when attempting to demilitarize more units than army currently have





### ArmyCannotAttackAnotherArmyIfTheyAreNotOnSamePosition

```solidity
error ArmyCannotAttackAnotherArmyIfTheyAreNotOnSamePosition()
```

Thrown when attempting to start battle by attacking army not on same position as current army





### ArmyCannotAttackNotCurrentEraArmy

```solidity
error ArmyCannotAttackNotCurrentEraArmy()
```

Thrown when attempting to start battle by providing army address to attack which is not part of current era





### ArmyCannotAttackItself

```solidity
error ArmyCannotAttackItself()
```

Thrown when attempting to start battle by providing army address which is same as current army





### ArmyCannotJoinToNotCurrentEraBattle

```solidity
error ArmyCannotJoinToNotCurrentEraBattle()
```

Thrown when attempting to join battle by providing invalid battle address





### ArmyWithoutUnitsCannotJoinBattle

```solidity
error ArmyWithoutUnitsCannotJoinBattle()
```

Thrown when attempting to join battle with army which has zero units in it





### WrongJoinSide

```solidity
error WrongJoinSide()
```

Thrown when attempting to join battle by providing invalid side





### ArmyCannotJoinToBattleNotInLobbyPhase

```solidity
error ArmyCannotJoinToBattleNotInLobbyPhase()
```

Thrown when attempting to join battle while its not in lobby phase





### ArmyCannotJoinToBattleNotAtSamePosition

```solidity
error ArmyCannotJoinToBattleNotAtSamePosition()
```

Thrown when attempting to join battle which is not at same position as current army





### ArmyCannotBesiegeOwnSettlement

```solidity
error ArmyCannotBesiegeOwnSettlement()
```

Thrown when attempting to modify siege of own settlement





### WrongRobberyMultiplierSpecified

```solidity
error WrongRobberyMultiplierSpecified()
```

Thrown when attempting to modify siege by providing invalid robbery multiplier





### ArmyCannotModifySiegeUnitsToLiquidatableState

```solidity
error ArmyCannotModifySiegeUnitsToLiquidatableState()
```

Thrown when attempting to modify siege in result of which army will become liquidatable





### ArmyCannotUseMoreResourcesForAccelerationThanBuildingTreasuryHas

```solidity
error ArmyCannotUseMoreResourcesForAccelerationThanBuildingTreasuryHas()
```

Thrown when attempting to use more resources for acceleration than related building treasury has





### ArmyCannotAccelerateManeuverFromCultistsSettlementWithNonZeroCultistsArmy

```solidity
error ArmyCannotAccelerateManeuverFromCultistsSettlementWithNonZeroCultistsArmy()
```

Thrown when attempting to use accelerate maneuver from cultists settlement with non zero cultists





### ArmyCannotBeDemilitarizedDueToCooldown

```solidity
error ArmyCannotBeDemilitarizedDueToCooldown()
```

Thrown when attempting to demilitarize army during cooldown





### updateState

```solidity
function updateState() external
```

Updates army state to the current block

_Called on every action which are based on army state and time_




### beginOpenManeuver

```solidity
function beginOpenManeuver(uint64 position, uint256 foodToSpendOnAcceleration) external
```

Begins open maneuver to specified position

_Even though position can be artificial, army can move only to settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position of settlement to move to |
| foodToSpendOnAcceleration | uint256 | Amount of food army will take from current position settlements FARM in order to decrease total time army will take to get to destination position |



### beginSecretManeuver

```solidity
function beginSecretManeuver(uint64 secretDestinationRegionId, bytes32 secretDestinationPosition) external
```

Begins secret maneuver to secret position

_Caller must be aware of the rules applied to revealing destination position otherwise army may be punished_

| Name | Type | Description |
| ---- | ---- | ----------- |
| secretDestinationRegionId | uint64 | Secret destination region id |
| secretDestinationPosition | bytes32 | Secret destination position |



### revealSecretManeuver

```solidity
function revealSecretManeuver(uint64 destinationPosition, bytes32 revealKey, uint256 woodToSpendOnAcceleration) external
```

Reveals secret maneuver

_In order to successfully reveal 'secretDestinationPosition' - 'destination position' and 'revealKey' must be valid
Validity of verified by 'keccak256(abi.encodePacked(destinationPosition, revealKey)) == secretDestinationPosition'_

| Name | Type | Description |
| ---- | ---- | ----------- |
| destinationPosition | uint64 | Destination position |
| revealKey | bytes32 | Reveal key |
| woodToSpendOnAcceleration | uint256 | Wood to spend on acceleration |



### cancelSecretManeuver

```solidity
function cancelSecretManeuver() external
```

Cancels secret maneuver

_Can be cancelled by army owner_




### demilitarize

```solidity
function demilitarize(bytes32[] unitTypeIds, uint256[] unitsAmounts) external
```

Demilitarizes part of the army. Demilitarization provides prosperity to the settlement army is currently staying on

_Even though demilitarization of 0 units may seem reasonable, it is disabled_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeIds | bytes32[] | Unit type ids for demilitarization |
| unitsAmounts | uint256[] | Amount of units to demilitarize |



### beginBattle

```solidity
function beginBattle(address armyAddress, bytes32[] maxUnitTypeIdsToAttack, uint256[] maxUnitsToAttack) external
```

Begins battle with another army if both are not in battle

_Creates IBattle and sets both armies in created battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Address of the army this army will attack |
| maxUnitTypeIdsToAttack | bytes32[] | Max unit type ids to attack |
| maxUnitsToAttack | uint256[] | Max units to attack |



### joinBattle

```solidity
function joinBattle(address battleAddress, uint256 side) external
```

Joins current army in battle to the provided side

_Maneuvering army is able to join battle only if caller is another army (drags it into battle)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Battle address army will join |
| side | uint256 | Side of the battle army will join (sideA = 1, sideB = 2) |



### burnUnits

```solidity
function burnUnits(bytes32[] unitTypeIds, uint256[] unitsAmounts) external
```

Burns units from the army

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeIds | bytes32[] | Unit type ids for burning |
| unitsAmounts | uint256[] | Amount of units for burning for every unit type |



### liquidateUnits

```solidity
function liquidateUnits(bytes32[] unitTypeIds, uint256[] unitsAmounts) external
```

Liquidates units from the army

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeIds | bytes32[] | Unit type ids for liquidation |
| unitsAmounts | uint256[] | Amount of units for liquidation |



### getCurrentPosition

```solidity
function getCurrentPosition() external view returns (uint64 position)
```

Calculates current position taking to the account #maneuverInfo

_This method should be used to determine real army position_


| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position |


### modifySiege

```solidity
function modifySiege(bytes32[] unitTypeIds, bool[] toAddIndication, uint256[] unitsAmounts, uint256 newRobberyMultiplier) external
```

Modifies army siege params

_Provides ability to atomically setup/re-setup siege_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeIds | bytes32[] | Unit type ids |
| toAddIndication | bool[] | Indication array whether to add units or to withdraw (add = true, withdraw = false) |
| unitsAmounts | uint256[] | Amounts of units to add/withdraw |
| newRobberyMultiplier | uint256 | New robbery multiplier |



### swapRobberyPointsForResourceFromBuildingTreasury

```solidity
function swapRobberyPointsForResourceFromBuildingTreasury(address buildingAddress, uint256 pointsToSpend) external
```

Swaps accumulated robbery points in siege for resource from building treasury

_Amount of points will be taken may be lesser if building does not have resources in its treasury_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of the building treasury of which will be robbed |
| pointsToSpend | uint256 | Amount of points to spend for resources |



### getTotalSiegeSupport

```solidity
function getTotalSiegeSupport() external view returns (uint256 totalSiegeSupport)
```

Calculates total siege support of the army

_For every unit type placed in siege calculates sum of all of them_


| Name | Type | Description |
| ---- | ---- | ----------- |
| totalSiegeSupport | uint256 | Total siege support of the army |


### getOwner

```solidity
function getOwner() external view returns (address ownerAddress)
```

Return owner of the army

_Same as owner of the settlement to which this army belongs_


| Name | Type | Description |
| ---- | ---- | ----------- |
| ownerAddress | address | Address of the owner of the army |


### isAtHomePosition

```solidity
function isAtHomePosition() external view returns (bool isAtHomePosition)
```

Calculates is army at home position

_Takes into account if army maneuver is ended (by time)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| isAtHomePosition | bool | Is army at home position |


### isManeuvering

```solidity
function isManeuvering() external view returns (bool isManeuvering)
```

Calculates is army maneuvering (openly or secretly)

_Takes into account if army maneuver is ended (by time)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| isManeuvering | bool | Is maneuvering |


### increaseUnitBattleMultiplier

```solidity
function increaseUnitBattleMultiplier(bytes32 unitTypeId, uint256 unitBattleMultiplier) external
```

Increases unit battle multiplier

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |
| unitBattleMultiplier | uint256 | Unit battle multiplier |



### decreaseUnitBattleMultiplier

```solidity
function decreaseUnitBattleMultiplier(bytes32 unitTypeId, uint256 unitBattleMultiplier) external
```

Decreases unit battle multiplier

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |
| unitBattleMultiplier | uint256 | Unit battle multiplier |



### applySelfStun

```solidity
function applySelfStun(uint64 stunDuration) external
```

Applies army stun by settlement ruler

_Provides ability to self stun owned army_

| Name | Type | Description |
| ---- | ---- | ----------- |
| stunDuration | uint64 | Stun duration |



