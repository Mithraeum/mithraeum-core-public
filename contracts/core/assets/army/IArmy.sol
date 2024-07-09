// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../../IWorld.sol";
import "../battle/IBattle.sol";
import "../settlement/ISettlement.sol";
import "../siege/ISiege.sol";

/// @title Army interface
/// @notice Functions to read state/modify state in order to get current army parameters and/or interact with it
interface IArmy {
    struct ManeuverInfo {
        uint64 beginTime;
        uint64 endTime;
        uint64 destinationPosition;
        uint64 secretDestinationRegionId;
        bytes32 secretDestinationPosition;
    }

    struct StunInfo {
        uint64 beginTime;
        uint64 endTime;
    }

    // State variables

    /// @notice Settlement address to which this army belongs
    /// @dev Immutable, initialized on the army creation
    function relatedSettlement() external view returns (ISettlement);

    /// @notice Position where army currently stands on
    /// @dev Updated when army updates position. It does not take into account if army is maneuvering
    /// @dev To proper query current position use #getCurrentPosition
    function currentPosition() external view returns (uint64);

    /// @notice Battle in which army is on
    /// @dev If army is not in battle returns address(0). It does not take into account if battle is ended but army is not left the battle
    function battle() external view returns (IBattle);

    /// @notice Maneuver info
    /// @dev Updated when army begins maneuvering. It does not take into account if army is ended maneuver by time
    function maneuverInfo() external view returns (
        uint64 beginTime,
        uint64 endTime,
        uint64 destinationPosition,
        uint64 secretDestinationRegionId,
        bytes32 secretDestinationPosition
    );

    /// @notice Stun info
    /// @dev Updated when army stun is applied
    function stunInfo() external view returns (uint64 beginTime, uint64 endTime);

    /// @notice Mapping containing additional unit battle multiplier
    /// @dev Updated when #increaseUnitBattleMultiplier or #decreaseUnitBattleMultiplier is called
    function additionalUnitsBattleMultipliers(bytes32 unitTypeId) external view returns (uint256);

    // Events

    /// @notice Emitted when #updatePosition is called (even though event can be emitted only on the next action related to the current army, de-facto army will update position based on 'maneuverInfo.endTime'
    /// @param settlementAddress Address of the settlement where army currently staying on
    /// @param position Position
    event UpdatedPosition(address settlementAddress, uint64 position);

    /// @notice Emitted when #createBattle is called. Army which attacks another army will emit this event
    /// @param battleAddress Created battle address
    /// @param targetArmyAddress Address of the attacked army
    event BattleCreated(address battleAddress, address targetArmyAddress);

    /// @notice Emitted when army joins battle. At the battle creation both armies (attacker and attacked) will emit this event. Attacker army will be side A and at attacked army will be sideB
    /// @param battleAddress Address of the battle army joined in
    /// @param side Side to which army joined (sideA = 1, sideB = 2)
    event JoinedBattle(address battleAddress, uint256 side);

    /// @notice Emitted when #updateState is called (even though event can be emitted only on the next action related to the current army, de-facto army will exit battle when battle is ended)
    /// @param battleAddress Address of the battle army was in
    event ExitedFromBattle(address battleAddress);

    /// @notice Emitted when #beginOpenManeuver or #beginSecretManeuver or #revealSecretManeuver is called
    /// @param position Position army is maneuvering to (0 if secret maneuver)
    /// @param secretDestinationRegionId Secret destination regionId (not zero if secret maneuver)
    /// @param secretDestinationPosition Secret destination position (not zero if secret maneuver)
    /// @param beginTime Time at which maneuver began
    /// @param endTime Time at which maneuver will end (0 if secret maneuver)
    /// @param tokensToSpendOnAcceleration Amount of tokens to spend on acceleration (Food for open maneuver, Wood for secret maneuver)
    event ManeuveringBegan(
        uint64 position,
        uint64 secretDestinationRegionId,
        bytes32 secretDestinationPosition,
        uint256 beginTime,
        uint256 endTime,
        uint256 tokensToSpendOnAcceleration
    );

    /// @notice Emitted when #cancelSecretManeuver is called
    event SecretManeuverCancelled();

    /// @notice Emitted when #_applyStun is called
    /// @param stunBeginTime Stun begin time
    /// @param stunEndTime Stun end time
    event StunApplied(uint64 stunBeginTime, uint64 stunEndTime);

    /// @notice Emitted when #demilitarize is called
    /// @param unitTypeIds Unit type ids demilitarized
    /// @param unitsAmounts Amount of units demilitarized
    event UnitsDemilitarized(bytes32[] unitTypeIds, uint256[] unitsAmounts);

    // Errors

    /// @notice Thrown when attempting to call action which only possible to be called by ruler, world or world asset
    error OnlyRulerOrWorldAssetFromSameEra();

    /// @notice Thrown when attempting to call action which is blocked when army is stunned
    error ArmyIsStunned();

    /// @notice Thrown when attempting to call action which is blocked when army is maneuvering
    error ArmyIsManeuvering();

    /// @notice Thrown when attempting to call action which is blocked when army is in battle
    error ArmyIsInBattle();

    /// @notice Thrown when attempting to call action which is blocked when army is in siege
    error ArmyIsInSiege();

    /// @notice Thrown when attempting to begin maneuver to same position
    error ArmyCannotManeuverToSamePosition();

    /// @notice Thrown when attempting to maneuver to position without settlement
    error ArmyCannotManeuverToPositionWithoutSettlement();

    /// @notice Thrown when attempting to maneuver without units to non-home position
    error ArmyWithoutUnitsCannotManeuverToNotHomeSettlement();

    /// @notice Thrown when attempting to maneuver without units but with acceleration
    error ArmyWithoutUnitsCannotAccelerate();

    /// @notice Thrown when attempting to secretly maneuver without units
    error ArmyWithoutUnitsCannotBeginSecretManeuver();

    /// @notice Thrown when attempting to reveal or cancel secret maneuver
    error ArmyIsNotManeuveringSecretly();

    /// @notice Thrown when attempting to reveal secret maneuver with invalid reveal info
    error WrongSecretManeuverRevealInfo();

    /// @notice Thrown when attempting to reveal secret maneuver with valid reveal info but wrong region
    error SecretManeuverRevealNotPossibleToNotSpecifiedRegion();

    /// @notice Thrown when attempting to reveal secret maneuver at invalid time
    error SecretManeuverRevealNotPossibleAtThisTime();

    /// @notice Thrown when attempting to demilitarize with invalid input
    error WrongDemilitarizationInput();

    /// @notice Thrown when attempting to demilitarize more units than army currently have
    error NotEnoughUnitsForDemilitarization();

    /// @notice Thrown when attempting to start battle by attacking army not on same position as current army
    error ArmyCannotAttackAnotherArmyIfTheyAreNotOnSamePosition();

    /// @notice Thrown when attempting to start battle by providing army address to attack which is not part of current era
    error ArmyCannotAttackNotCurrentEraArmy();

    /// @notice Thrown when attempting to start battle by providing army address which is same as current army
    error ArmyCannotAttackItself();

    /// @notice Thrown when attempting to join battle by providing invalid battle address
    error ArmyCannotJoinToNotCurrentEraBattle();

    /// @notice Thrown when attempting to join battle with army which has zero units in it
    error ArmyWithoutUnitsCannotJoinBattle();

    /// @notice Thrown when attempting to join battle by providing invalid side
    error WrongJoinSide();

    /// @notice Thrown when attempting to join battle while its not in lobby phase
    error ArmyCannotJoinToBattleNotInLobbyPhase();

    /// @notice Thrown when attempting to join battle which is not at same position as current army
    error ArmyCannotJoinToBattleNotAtSamePosition();

    /// @notice Thrown when attempting to modify siege of own settlement
    error ArmyCannotBesiegeOwnSettlement();

    /// @notice Thrown when attempting to modify siege by providing invalid robbery multiplier
    error WrongRobberyMultiplierSpecified();

    /// @notice Thrown when attempting to modify siege in result of which army will become liquidatable
    error ArmyCannotModifySiegeUnitsToLiquidatableState();

    /// @notice Thrown when attempting to use more resources for acceleration than related building treasury has
    error ArmyCannotUseMoreResourcesForAccelerationThanBuildingTreasuryHas();

    /// @notice Thrown when attempting to use accelerate maneuver from cultists settlement with non zero cultists
    error ArmyCannotAccelerateManeuverFromCultistsSettlementWithNonZeroCultistsArmy();

    // Functions

    /// @notice Updates army state to the current block
    /// @dev Called on every action which are based on army state and time
    function updateState() external;

    /// @notice Begins open maneuver to specified position
    /// @dev Even though position can be artificial, army can move only to settlement
    /// @param position Position of settlement to move to
    /// @param foodToSpendOnAcceleration Amount of food army will take from current position settlements FARM in order to decrease total time army will take to get to destination position
    function beginOpenManeuver(uint64 position, uint256 foodToSpendOnAcceleration) external;

    /// @notice Begins secret maneuver to secret position
    /// @dev Caller must be aware of the rules applied to revealing destination position otherwise army may be punished
    /// @param secretDestinationRegionId Secret destination region id
    /// @param secretDestinationPosition Secret destination position
    function beginSecretManeuver(uint64 secretDestinationRegionId, bytes32 secretDestinationPosition) external;

    /// @notice Reveals secret maneuver
    /// @dev In order to successfully reveal 'secretDestinationPosition' - 'destination position' and 'revealKey' must be valid
    /// @dev Validity of verified by 'keccak256(abi.encodePacked(destinationPosition, revealKey)) == secretDestinationPosition'
    /// @param destinationPosition Destination position
    /// @param revealKey Reveal key
    /// @param woodToSpendOnAcceleration Wood to spend on acceleration
    function revealSecretManeuver(uint64 destinationPosition, bytes32 revealKey, uint256 woodToSpendOnAcceleration) external;

    /// @notice Cancels secret maneuver
    /// @dev Can be cancelled by army owner
    function cancelSecretManeuver() external;

    /// @notice Demilitarizes part of the army. Demilitarization provides prosperity to the settlement army is currently staying on
    /// @dev Even though demilitarization of 0 units may seem reasonable, it is disabled
    /// @param unitTypeIds Unit type ids for demilitarization
    /// @param unitsAmounts Amount of units to demilitarize
    function demilitarize(bytes32[] memory unitTypeIds, uint256[] memory unitsAmounts) external;

    /// @notice Begins battle with another army if both are not in battle
    /// @dev Creates IBattle and sets both armies in created battle
    /// @param armyAddress Address of the army this army will attack
    /// @param maxUnitTypeIdsToAttack Max unit type ids to attack
    /// @param maxUnitsToAttack Max units to attack
    function beginBattle(
        address armyAddress,
        bytes32[] calldata maxUnitTypeIdsToAttack,
        uint256[] calldata maxUnitsToAttack
    ) external;

    /// @notice Joins current army in battle to the provided side
    /// @dev Maneuvering army is able to join battle only if caller is another army (drags it into battle)
    /// @param battleAddress Battle address army will join
    /// @param side Side of the battle army will join (sideA = 1, sideB = 2)
    function joinBattle(address battleAddress, uint256 side) external;

    /// @notice Burns units from the army
    /// @dev Can only be called by world or world asset
    /// @param unitTypeIds Unit type ids for burning
    /// @param unitsAmounts Amount of units for burning for every unit type
    function burnUnits(bytes32[] memory unitTypeIds, uint256[] memory unitsAmounts) external;

    /// @notice Liquidates units from the army
    /// @dev Can only be called by world or world asset
    /// @param unitTypeIds Unit type ids for liquidation
    /// @param unitsAmounts Amount of units for liquidation
    function liquidateUnits(bytes32[] memory unitTypeIds, uint256[] memory unitsAmounts) external;

    /// @notice Calculates current position taking to the account #maneuverInfo
    /// @dev This method should be used to determine real army position
    /// @return position Position
    function getCurrentPosition() external view returns (uint64 position);

    /// @notice Modifies army siege params
    /// @dev Provides ability to atomically setup/re-setup siege
    /// @param unitTypeIds Unit type ids
    /// @param toAddIndication Indication array whether to add units or to withdraw (add = true, withdraw = false)
    /// @param unitsAmounts Amounts of units to add/withdraw
    /// @param newRobberyMultiplier New robbery multiplier
    function modifySiege(
        bytes32[] calldata unitTypeIds,
        bool[] calldata toAddIndication,
        uint256[] calldata unitsAmounts,
        uint256 newRobberyMultiplier
    ) external;

    /// @notice Swaps accumulated robbery points in siege for resource from building treasury
    /// @dev Amount of points will be taken may be lesser if building does not have resources in its treasury
    /// @param buildingAddress Address of the building treasury of which will be robbed
    /// @param pointsToSpend Amount of points to spend for resources
    function swapRobberyPointsForResourceFromBuildingTreasury(address buildingAddress, uint256 pointsToSpend) external;

    /// @notice Calculates total siege support of the army
    /// @dev For every unit type placed in siege calculates sum of all of them
    /// @return totalSiegeSupport Total siege support of the army
    function getTotalSiegeSupport() external view returns (uint256 totalSiegeSupport);

    /// @notice Return owner of the army
    /// @dev Same as owner of the settlement to which this army belongs
    /// @return ownerAddress Address of the owner of the army
    function getOwner() external view returns (address ownerAddress);

    /// @notice Calculates is army at home position
    /// @dev Takes into account if army maneuver is ended (by time)
    /// @return isAtHomePosition Is army at home position
    function isAtHomePosition() external view returns (bool isAtHomePosition);

    /// @notice Calculates is army maneuvering (openly or secretly)
    /// @dev Takes into account if army maneuver is ended (by time)
    /// @return isManeuvering Is maneuvering
    function isManeuvering() external view returns (bool isManeuvering);

    /// @notice Increases unit battle multiplier
    /// @dev Can only be called by world or world asset
    /// @param unitTypeId Unit type id
    /// @param unitBattleMultiplier Unit battle multiplier
    function increaseUnitBattleMultiplier(bytes32 unitTypeId, uint256 unitBattleMultiplier) external;

    /// @notice Decreases unit battle multiplier
    /// @dev Can only be called by world or world asset
    /// @param unitTypeId Unit type id
    /// @param unitBattleMultiplier Unit battle multiplier
    function decreaseUnitBattleMultiplier(bytes32 unitTypeId, uint256 unitBattleMultiplier) external;

    /// @notice Applies army stun by settlement ruler
    /// @dev Provides ability to self stun owned army
    /// @param stunDuration Stun duration
    function applySelfStun(uint64 stunDuration) external;
}
