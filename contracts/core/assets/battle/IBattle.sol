// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../../IWorld.sol";

/// @title Battle interface
/// @notice Functions to read state/modify state in order to get current battle parameters and/or interact with it
interface IBattle {
    struct BattleTimeInfo {
        uint64 beginTime;
        uint64 duration;
        uint64 endTime;
    }

    // State variables

    /// @notice Position at which battle is being held
    /// @dev Immutable, initialized on the battle creation
    function position() external view returns (uint64);

    /// @notice Mapping that contains units amount by side and unit type
    /// @dev Updated when army joins side
    /// @param side Side of which query units amount (sideA = 1, sideB = 2)
    /// @param unitTypeId Unit type id
    /// @return unitsAmount Amount of units by specified side and unit type
    function sideUnitsAmount(uint256 side, bytes32 unitTypeId) external view returns (uint256 unitsAmount);

    /// @notice Mapping that contains amount of units by army address and unit type
    /// @dev Updated when army joins battle
    /// @param armyAddress Army address
    /// @param unitTypeId Unit type id
    /// @return unitsAmount Amount of units by army address and unit type
    function armyUnitsAmount(address armyAddress, bytes32 unitTypeId) external view returns (uint256 unitsAmount);

    /// @notice Mapping that contains unit multiplier by army address and unit type
    /// @dev Updated when army joins battle
    /// @param armyAddress Army address
    /// @param unitTypeId Unit type id
    /// @return unitAmountMultiplier Unit amount multiplier
    function armyUnitsAdditionalMultipliers(address armyAddress, bytes32 unitTypeId) external view returns (uint256 unitAmountMultiplier);

    /// @notice Mapping that contains amount of casualties
    /// @dev Updated when #acceptArmyInBattle is called
    /// @param side Side of which query casualties amount (sideA = 1, sideB = 2)
    /// @param unitTypeId Unit type id
    /// @return casualtiesCount Amount of casualties by side and unit type
    function casualties(uint256 side, bytes32 unitTypeId) external view returns (uint256 casualtiesCount);

    /// @notice Mapping that contains side at which joined army is on
    /// @dev Updated when #acceptArmyInBattle is called
    /// @param armyAddress Army address
    /// @return armySide Side of specified army (sideA = 1, sideB = 2)
    function armySide(address armyAddress) external view returns (uint256 armySide);

    /// @notice Battle time info
    /// @dev Updated when battle initialized, first armies joined and ended (#initBattle, #acceptArmyInBattle, #endBattle)
    /// @return beginTime Time when battle is began
    /// @return duration Battle duration, initialized when first two armies joined
    /// @return endTime Time when battle is ended
    function battleTimeInfo()
        external
        view
        returns (
            uint64 beginTime,
            uint64 duration,
            uint64 endTime
        );

    /// @notice Winning side
    /// @dev Updated when #endBattle is called
    /// @return winningSide Winning side (no winner = 0, sideA = 1, sideB = 2)
    function winningSide() external view returns (uint256 winningSide);

    // Events

    /// @notice Emitted when army joined battle
    /// @param armyAddress Address of the joined army
    /// @param side Side to which army is joined (sideA = 1, sideB = 2)
    event ArmyJoined(address armyAddress, uint256 side);

    /// @notice Emitted when #endBattle is called
    /// @param endTime Time at which battle is ended
    event BattleEnded(uint256 endTime);

    // Errors

    /// @notice Thrown when attempting to begin battle by attacking army with MAX amount of units to attack, but their value increased to more than MAX
    error BattleCannotBeCreatedWhenArmyUnitsExceedDesiredAmountToAttack();

    /// @notice Thrown when attempting to begin battle by attacking cultists army with desire to draw zero units to the battle
    error BattleCannotBeCreatedByDesiringToAttackCultistsArmyWithoutUnits();

    /// @notice Thrown when attempting to begin battle with armies either of which has zero units
    error BattleCannotBeCreatedWithArmiesHavingZeroUnits();

    /// @notice Thrown when attempting to start battle by attacking army when maneuver duration left less than minimum battle duration
    error BattleCannotBeCreatedWhenAttackedArmyIsAlmostOnAnotherPosition();

    /// @notice Thrown when attempting to accept cultists army to the battle but their amount got smaller than desired to attack
    error BattleCannotAcceptCultistsArmyWhenCultistsAmountChangedToLowerValueThanDesired();

    /// @notice Thrown when attempting to finish battle while time for it has not yet come
    error BattleCannotBeFinishedAtThisTime();

    /// @notice Thrown when attempting to finish battle when it is already finished
    error BattleCannotBeFinishedMoreThanOnce();

    // Functions

    /// @notice Accepts army in battle
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param armyAddress Army address
    /// @param side Side to which army will join
    function acceptArmyInBattle(address armyAddress, uint256 side) external;

    /// @notice Ends battle
    /// @dev Sets end time
    function endBattle() external;

    /// @notice Calculates casualties for first battle stage
    /// @dev Uses values from battles' sideUnitsAmount in order to calculate casualties (can be executed while battle is still not fully formed)
    /// @return sideACasualties Side A casualties
    /// @return sideBCasualties Side B casualties
    /// @return stageParams Stage params (encoded abi.encode(sideAOffense, sideBOffense, sideADefence, sideBDefence))
    function calculateStage1Casualties()
        external
        view
        returns (
            uint256[] memory sideACasualties,
            uint256[] memory sideBCasualties,
            bytes memory stageParams
        );

    /// @notice Calculates casualties for second battle stage (based on casualties from first battle stage)
    /// @dev Uses values from battles' sideUnitsAmount in order to calculate casualties (can be executed while battle is still not fully formed)
    /// @param stage1SideACasualties Stage 1 side A casualties
    /// @param stage1SideBCasualties Stage 1 side B casualties
    /// @return sideACasualties Side A casualties
    /// @return sideBCasualties Side B casualties
    /// @return stageParams Stage params (encoded abi.encode(sideAOffense, sideBOffense, sideADefence, sideBDefence))
    function calculateStage2Casualties(
        uint256[] memory stage1SideACasualties,
        uint256[] memory stage1SideBCasualties
    )
        external
        view
        returns (
            uint256[] memory sideACasualties,
            uint256[] memory sideBCasualties,
            bytes memory stageParams
        );

    /// @notice Calculates casualties for all battle stages
    /// @dev Uses values from battles' sideUnitsAmount in order to calculate casualties (can be executed while battle is still not fully formed)
    /// @return sideACasualties Side A casualties
    /// @return sideBCasualties Side A casualties
    /// @return winningSide Winning side (0 - both sides lost, 1 - side A Won, 2 - side B Won
    function calculateAllCasualties()
        external
        view
        returns (
            uint256[] memory sideACasualties,
            uint256[] memory sideBCasualties,
            uint256 winningSide
        );

    /// @notice Calculates battle duration
    /// @dev Returns same value as #calculateBattlesDuration but without the need to provide all parameters
    /// @param isCultistsAttacked Is cultists attacked
    /// @param maxBattleDuration Max allowed battle duration
    /// @param sideAUnitsAmount Side A units amount
    /// @param sideBUnitsAmount Side B units amount
    /// @return battleDuration Battle duration
    function getBattleDuration(
        bool isCultistsAttacked,
        uint256 maxBattleDuration,
        uint256 sideAUnitsAmount,
        uint256 sideBUnitsAmount
    ) external view returns (uint64 battleDuration);

    /// @notice Calculates if battle can be ended
    /// @dev Checks if endTime is set and current block.timestamp > beginTime + duration
    /// @return canEndBattle Can battle be ended
    function canEndBattle() external view returns (bool canEndBattle);

    /// @notice Calculates if battle is ended
    /// @dev Checks if endTime is not zero
    /// @return isEndedBattle Is ended battle
    function isEndedBattle() external view returns (bool isEndedBattle);

    /// @notice Calculates casualties for specified army
    /// @dev Provides valid results only for ended battle
    /// @param armyAddress Address of army presented in battle
    /// @return isArmyWon Is army won
    /// @return unitsAmounts Amount of casualties for related unit types
    function calculateArmyCasualties(address armyAddress)
        external
        view
        returns (
            bool isArmyWon,
            uint256[] memory unitsAmounts
        );

    /// @notice Calculates if lobby is opened
    /// @dev Calculates if lobby is opened
    /// @return isLobbyTime Is lobby is opened
    function isLobbyTime() external view returns (bool isLobbyTime);

    /// @notice Calculates battle duration based on specified parameters
    /// @dev globalMultiplier, baseBattleDuration parameters from registry
    /// @param globalMultiplier Global multiplier (from registry)
    /// @param baseBattleDuration Base battle duration (from registry)
    /// @param minBattleDuration Minimum battle duration (from registry)
    /// @param isCultistsAttacked Is cultists attacked
    /// @param units1 Amount of units from attacker army
    /// @param units2 Amount of units from attacked army
    /// @param maxBattleDuration Max allowed battle duration
    /// @return battleDuration Battle duration
    function calculateBattleDuration(
        uint256 globalMultiplier,
        uint256 baseBattleDuration,
        uint256 minBattleDuration,
        bool isCultistsAttacked,
        uint256 units1,
        uint256 units2,
        uint256 maxBattleDuration
    ) external view returns (uint64 battleDuration);
}
