// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../IBuilding.sol";

/// @title Fort interface
/// @notice Functions to read state/modify state in order to get current fort parameters and/or interact with it
interface IFort is IBuilding {
    // State variables

    /// @notice Fort health
    /// @dev Updated when #updateHealth is called
    function health() external view returns (uint256);

    // Events

    /// @notice Emitted when #updateState is called (if health is changed in the process)
    /// @param newHealth New health
    event HealthUpdated(uint256 newHealth);

    // Errors

    /// @notice Thrown when attempting to call action which is disabled
    error Disabled();

    // Functions

    /// @notice Calculates maximum amount of health for provided level
    /// @dev Useful to determine maximum amount of health will be available at provided level
    /// @param level Level at which calculate maximum amount of health
    /// @return maxHealth Maximum amount of health for provided level
    function getMaxHealthOnLevel(uint256 level) external view returns (uint256 maxHealth);

    /// @notice Calculates damage done at specified timestamp
    /// @dev Uses fort production and siege parameters to forecast health and damage will be dealt at specified time
    /// @param timestamp Time at which calculate parameters
    /// @return damage Amount of damage done from fort.productionInfo.lastUpdateState to specified timestamp
    function calculateDamageDone(uint256 timestamp)
        external
        view
        returns (uint256 damage);
}
