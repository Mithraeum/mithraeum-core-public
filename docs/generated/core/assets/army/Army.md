## Army








### relatedSettlement

```solidity
contract ISettlement relatedSettlement
```

Settlement address to which this army belongs

_Immutable, initialized on the army creation_




### currentPosition

```solidity
uint64 currentPosition
```

Position where army currently stands on

_Updated when army updates position. It does not take into account if army is maneuvering
To proper query current position use #getCurrentPosition_




### battle

```solidity
contract IBattle battle
```

Battle in which army is on

_If army is not in battle returns address(0). It does not take into account if battle is ended but army is not left the battle_




### maneuverInfo

```solidity
struct IArmy.ManeuverInfo maneuverInfo
```

Maneuver info

_Updated when army begins maneuvering. It does not take into account if army is ended maneuver by time_




### stunInfo

```solidity
struct IArmy.StunInfo stunInfo
```

Stun info

_Updated when army stun is applied_




### additionalUnitsBattleMultipliers

```solidity
mapping(bytes32 => uint256) additionalUnitsBattleMultipliers
```

Mapping containing additional unit battle multiplier

_Updated when #increaseUnitBattleMultiplier or #decreaseUnitBattleMultiplier is called_




### onlyRulerOrWorldAssetFromSameEra

```solidity
modifier onlyRulerOrWorldAssetFromSameEra()
```



_Only ruler or world or world asset from same era modifier
Modifier is calling internal function in order to reduce contract size_




### init

```solidity
function init(bytes initParams) public
```



_World asset initializer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| initParams | bytes | Encoded init params (every world asset has own knowledge how to extract data from it) |



### updateState

```solidity
function updateState() public
```

Updates army state to the current block

_Called on every action which are based on army state and time_




### getOwner

```solidity
function getOwner() public view returns (address)
```

Return owner of the army

_Same as owner of the settlement to which this army belongs_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | address |  |


### burnUnits

```solidity
function burnUnits(bytes32[] unitTypeIds, uint256[] unitsAmounts) public
```

Burns units from the army

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeIds | bytes32[] | Unit type ids for burning |
| unitsAmounts | uint256[] | Amount of units for burning for every unit type |



### liquidateUnits

```solidity
function liquidateUnits(bytes32[] unitTypeIds, uint256[] unitsAmounts) public
```

Liquidates units from the army

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeIds | bytes32[] | Unit type ids for liquidation |
| unitsAmounts | uint256[] | Amount of units for liquidation |



### beginOpenManeuver

```solidity
function beginOpenManeuver(uint64 position, uint256 foodToSpendOnAcceleration) public
```

Begins open maneuver to specified position

_Even though position can be artificial, army can move only to settlement_

| Name | Type | Description |
| ---- | ---- | ----------- |
| position | uint64 | Position of settlement to move to |
| foodToSpendOnAcceleration | uint256 | Amount of food army will take from current position settlements FARM in order to decrease total time army will take to get to destination position |



### beginSecretManeuver

```solidity
function beginSecretManeuver(uint64 secretDestinationRegionId, bytes32 secretDestinationPosition) public
```

Begins secret maneuver to secret position

_Caller must be aware of the rules applied to revealing destination position otherwise army may be punished_

| Name | Type | Description |
| ---- | ---- | ----------- |
| secretDestinationRegionId | uint64 | Secret destination region id |
| secretDestinationPosition | bytes32 | Secret destination position |



### revealSecretManeuver

```solidity
function revealSecretManeuver(uint64 destinationPosition, bytes32 revealKey, uint256 woodToSpendOnAcceleration) public
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
function cancelSecretManeuver() public
```

Cancels secret maneuver

_Can be cancelled by army owner_




### demilitarize

```solidity
function demilitarize(bytes32[] unitTypeIds, uint256[] unitsAmounts) public
```

Demilitarizes part of the army. Demilitarization provides prosperity to the settlement army is currently staying on

_Even though demilitarization of 0 units may seem reasonable, it is disabled_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeIds | bytes32[] | Unit type ids for demilitarization |
| unitsAmounts | uint256[] | Amount of units to demilitarize |



### getCurrentPosition

```solidity
function getCurrentPosition() public view returns (uint64)
```

Calculates current position taking to the account #maneuverInfo

_This method should be used to determine real army position_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint64 |  |


### beginBattle

```solidity
function beginBattle(address targetArmyAddress, bytes32[] maxUnitTypeIdsToAttack, uint256[] maxUnitsToAttack) public
```

Begins battle with another army if both are not in battle

_Creates IBattle and sets both armies in created battle_

| Name | Type | Description |
| ---- | ---- | ----------- |
| targetArmyAddress | address |  |
| maxUnitTypeIdsToAttack | bytes32[] | Max unit type ids to attack |
| maxUnitsToAttack | uint256[] | Max units to attack |



### joinBattle

```solidity
function joinBattle(address battleAddress, uint256 side) public
```

Joins current army in battle to the provided side

_Maneuvering army is able to join battle only if caller is another army (drags it into battle)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| battleAddress | address | Battle address army will join |
| side | uint256 | Side of the battle army will join (sideA = 1, sideB = 2) |



### modifySiege

```solidity
function modifySiege(bytes32[] unitTypeIds, bool[] toAddIndication, uint256[] unitsAmounts, uint256 newRobberyMultiplier) public
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
function swapRobberyPointsForResourceFromBuildingTreasury(address buildingAddress, uint256 pointsToSpend) public
```

Swaps accumulated robbery points in siege for resource from building treasury

_Amount of points will be taken may be lesser if building does not have resources in its treasury_

| Name | Type | Description |
| ---- | ---- | ----------- |
| buildingAddress | address | Address of the building treasury of which will be robbed |
| pointsToSpend | uint256 | Amount of points to spend for resources |



### getTotalSiegeSupport

```solidity
function getTotalSiegeSupport() public view returns (uint256)
```

Calculates total siege support of the army

_For every unit type placed in siege calculates sum of all of them_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### isAtHomePosition

```solidity
function isAtHomePosition() public view returns (bool)
```

Calculates is army at home position

_Takes into account if army maneuver is ended (by time)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### isManeuvering

```solidity
function isManeuvering() public view returns (bool)
```

Calculates is army maneuvering (openly or secretly)

_Takes into account if army maneuver is ended (by time)_


| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool |  |


### increaseUnitBattleMultiplier

```solidity
function increaseUnitBattleMultiplier(bytes32 unitTypeId, uint256 unitBattleMultiplier) public
```

Increases unit battle multiplier

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |
| unitBattleMultiplier | uint256 | Unit battle multiplier |



### decreaseUnitBattleMultiplier

```solidity
function decreaseUnitBattleMultiplier(bytes32 unitTypeId, uint256 unitBattleMultiplier) public
```

Decreases unit battle multiplier

_Can only be called by world or world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitTypeId | bytes32 | Unit type id |
| unitBattleMultiplier | uint256 | Unit battle multiplier |



### applySelfStun

```solidity
function applySelfStun(uint64 stunDuration) public
```

Applies army stun by settlement ruler

_Provides ability to self stun owned army_

| Name | Type | Description |
| ---- | ---- | ----------- |
| stunDuration | uint64 | Stun duration |



### _onlyRulerOrWorldAssetFromSameEra

```solidity
function _onlyRulerOrWorldAssetFromSameEra() internal view
```



_Allows caller to be only ruler or any world asset_




### _calculateResourceAmountPer1SecondOfDecreasedManeuverDuration

```solidity
function _calculateResourceAmountPer1SecondOfDecreasedManeuverDuration() internal view returns (uint256)
```



_Calculates amount of needed resource per one second of decreased maneuver duration_




### _getArmyTotalUnitsAmount

```solidity
function _getArmyTotalUnitsAmount(address armyAddress) internal view returns (uint256)
```



_Calculates total units amount_




### _calculateDefaultManeuverDuration

```solidity
function _calculateDefaultManeuverDuration(uint64 distanceBetweenPositions) internal view returns (uint256)
```



_Calculates default maneuver duration_




### _calculateMaxDecreasedManeuverDuration

```solidity
function _calculateMaxDecreasedManeuverDuration(uint64 distanceBetweenPositions) internal view returns (uint256)
```



_Calculates max default maneuver duration_




### _speedUpArmyByBurningTreasuryOnCurrentPosition

```solidity
function _speedUpArmyByBurningTreasuryOnCurrentPosition(uint256 maxManeuverDurationReduction, uint64 distanceBetweenPositions, uint256 resourceToSpendOnAcceleration, bytes32 buildingTypeIdFromWhichBurnResource) internal returns (uint256)
```



_Updates building's treasury, burns resource specified for acceleration and returns maneuver duration duration reduction_




### _isManeuveringOpenly

```solidity
function _isManeuveringOpenly() internal view returns (bool)
```



_Checks if army is maneuvering openly_




### _isManeuveringSecretly

```solidity
function _isManeuveringSecretly() internal view returns (bool)
```



_Checks if army is maneuvering secretly_




### _hasComeToDestinationPosition

```solidity
function _hasComeToDestinationPosition() internal view returns (bool)
```



_Checks if army can update position at the moment_




### _applyStun

```solidity
function _applyStun(uint64 stunBeginTime, uint256 stunDuration) internal
```



_Applies stun_




### _getSettlementOnCurrentPosition

```solidity
function _getSettlementOnCurrentPosition() internal view returns (contract ISettlement)
```



_Calculates settlement on current army position_




### _isBesieging

```solidity
function _isBesieging() internal view returns (bool)
```



_Calculates if army is currently in siege or not_




### _hasUnitsInBattleAtProvidedSide

```solidity
function _hasUnitsInBattleAtProvidedSide(contract IBattle battle, uint256 side) internal view returns (bool)
```



_Calculates if battle has units at provided side_




### _isCultistsSettlement

```solidity
function _isCultistsSettlement(contract ISettlement settlement) internal view returns (bool)
```



_Calculates whether settlement is cultists settlement_




