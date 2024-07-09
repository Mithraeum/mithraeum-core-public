// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../settlement/ISettlement.sol";

/// @title Siege interface
/// @notice Functions to read state/modify state in order to get current siege parameters and/or interact with it
interface ISiege {
    struct ArmyInfo {
        uint256 robberyMultiplier;
        uint256 pointsDebt;
        uint256 points;
    }

    // State variables

    /// @notice Settlement address to which this siege belongs
    /// @dev Immutable, initialized on the siege creation
    function relatedSettlement() external view returns (ISettlement);

    /// @notice Mapping containing army information related to current siege
    /// @dev Updated when #modifyArmySiege, #swapRobberyPointsForResourceFromBuildingTreasury is called
    function armyInfo(address armyAddress) external view returns (
        uint256 robberyMultiplier,
        uint256 pointsDebt,
        uint256 points
    );

    /// @notice Mapping containing amount of stored units in siege for specified army
    /// @dev Updated when #modifyArmySiege is called
    function besiegingArmyUnitsByType(address armyAddress, bytes32 unitTypeId) external view returns (uint256);

    /// @notice Total siege power
    /// @dev Updated when #modifyArmySiege is called
    function totalSiegePower() external view returns (uint256);

    /// @notice Amount of robbery point per one damage
    /// @dev Updated when siege parameters related to armies were changed
    function robberyPointsPerOneDamage() external view returns (uint256);

    // Events

    /// @notice Emitted when #modifyArmySiege is called
    /// @param armyAddress Army address
    /// @param unitTypeIds Unit type ids
    /// @param toAddIndication Indication array whether units where added or withdrawn (added = true, withdrawn = false)
    /// @param unitsAmounts Units amounts
    /// @param newRobberyMultiplier New robbery multiplier
    /// @param newTotalSiegePower New total siege power
    event ArmySiegeModified(
        address armyAddress,
        bytes32[] unitTypeIds,
        bool[] toAddIndication,
        uint256[] unitsAmounts,
        uint256 newRobberyMultiplier,
        uint256 newTotalSiegePower
    );

    /// @notice Emitted when army robbery points updated
    /// @param armyAddress Army address
    /// @param buildingAddress Building address
    /// @param stolenAmount Amount of resources stolen
    /// @param burnedAmount Burned amount of resources
    /// @param pointsSpent Amount of points spent
    /// @param newRobberyPointsAmount New robbery points amount
    event BuildingRobbed(
        address armyAddress,
        address buildingAddress,
        uint256 stolenAmount,
        uint256 burnedAmount,
        uint256 pointsSpent,
        uint256 newRobberyPointsAmount
    );

    /// @notice Emitted when #liquidate is called
    /// @param armyAddress Army address which was liquidated
    event ArmyLiquidated(address armyAddress);

    // Errors

    /// @notice Thrown when attempting to liquidate army from siege when it is not liquidatable
    error SiegeCannotLiquidateArmy();

    /// @notice Thrown when attempting to modify siege units with invalid units amount specified
    error SiegeCannotBeModifiedDueToInvalidUnitsAmountSpecified();

    /// @notice Thrown when attempting to swap robbery points with wrong building address specified
    error RobberyPointsSwapNotAllowedDueToSpecifiedBuildingAddressIsNotPartOfEra();

    /// @notice Thrown when attempting to swap robbery points with wrong max points to spend specified
    error RobberyPointsSwapNotAllowedDueToWrongMaxPointsToSpendSpecified();

    /// @notice Thrown when attempting to swap robbery points with specified building address not belonging to the settlement of this siege
    error RobberyPointsSwapNotAllowedDueToSpecifiedBuildingAddressDoesNotBelongToSettlementOfThisSiege();

    /// @notice Thrown when attempting to swap robbery points in result of which zero resources was stolen and burned
    error RobberyPointsSwapNotAllowedDueToNothingWasStolenAndBurned();

    // Functions

    /// @notice Swaps army robbery points for resources from building in related settlement
    /// @dev Even though function is opened, it can be called only by world asset
    /// @param buildingAddress Address of building to rob
    /// @param pointsToSpend Amount of points to spend for robbing
    function swapRobberyPointsForResourceFromBuildingTreasury(address buildingAddress, uint256 pointsToSpend) external;

    /// @notice Updates siege with new amount of damage fort has taken
    /// @dev Even though function is opened, it can be called only by world asset
    /// @param damage Damage which has been done to the settlement
    function applyDamage(uint256 damage) external;

    /// @notice Modifies army robbery multiplier
    /// @dev Even though function is opened, it can be called only by world asset
    /// @param armyAddress Army address
    /// @param unitTypeIds Unit type ids
    /// @param toAddIndication Indication array whether to add units or to withdraw (add = true, withdraw = false)
    /// @param unitsAmounts Units amounts
    /// @param newRobberyMultiplier New robbery multiplier
    function modifyArmySiege(
        address armyAddress,
        bytes32[] calldata unitTypeIds,
        bool[] calldata toAddIndication,
        uint256[] calldata unitsAmounts,
        uint256 newRobberyMultiplier
    ) external;

    /// @notice Calculates if besieging units of provided army can be liquidated from current siege
    /// @dev Does not take into an account if army's battle is ended and army isn't left the battle
    /// @param armyAddress Address of the army
    /// @return canLiquidate Can army be liquidated from current siege
    function canLiquidateArmyBesiegingUnits(address armyAddress) external view returns (bool canLiquidate);

    /// @notice Calculates amount of robbery points army will have at specified time
    /// @dev If timestamp=0, returns value as if timestamp=block.timestamp
    /// @param armyAddress Address of the army
    /// @param timestamp Time at which calculate points
    /// @return robberyPoints Amount of robbery points army will have at specified time
    function getArmyRobberyPoints(address armyAddress, uint256 timestamp) external view returns (uint256 robberyPoints);

    /// @notice Returns amount of besieging units for specified army in siege
    /// @dev Function returns only amounts without types, index in returned array for each unit type is same as in 'registry.getUnits'
    /// @param armyAddress Address of the army
    /// @return unitsAmounts Amount of units that army has in siege
    function getArmyBesiegingUnitsAmounts(address armyAddress) external view returns (uint256[] memory unitsAmounts);

    /// @notice Liquidates army
    /// @dev Can be called by anyone, caller will receive a reward
    /// @param armyAddress Address of army to liquidate
    function liquidate(address armyAddress) external;

    /// @notice Calculates army units siege power
    /// @dev Value are calculated for specified army that is present in siege
    /// @param armyAddress Address of army
    /// @return armySiegePower Army units siege power
    function calculateArmyUnitsSiegePower(address armyAddress) external returns (uint256 armySiegePower);

    /// @notice Calculates army total siege power (including its current robbery multiplier)
    /// @dev Value are calculated for specified army that is present in siege
    /// @param armyAddress Army address
    /// @return armyTotalSiegePower Army total siege power
    function calculateArmyTotalSiegePower(address armyAddress) external returns (uint256 armyTotalSiegePower);
}
