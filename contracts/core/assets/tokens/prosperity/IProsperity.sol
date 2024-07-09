// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../../../../token/IERC20Burnable.sol";
import "../../../../token/IERC20Int.sol";

/// @title Resource interface
/// @notice Functions to read state/modify state in order to get current prosperity parameters and/or interact with it
interface IProsperity is IERC20Int, IERC20Burnable {
    // State variables

    /// @notice Mapping containing amount of prosperity spend for workers buying
    /// @dev Only settlements can spend prosperity for workers
    /// @param settlementAddress Address of settlement
    /// @return amount Amount of prosperity spend for workers buying
    function prosperitySpent(address settlementAddress) external view returns (uint256 amount);

    // Errors

    /// @notice Thrown when attempting to call action which is disabled
    error Disabled();

    // Functions

    /// @notice Spends prosperity for specified settlement address
    /// @dev Called for settlement when settlement is buying workers
    /// @param settlementAddress Address of settlement
    /// @param amount Amount of prosperity spend for workers buying
    function spend(address settlementAddress, uint256 amount) external;

    /// @notice Mints prosperity to specified address
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param to Address which will receive prosperity
    /// @param amount Amount of prosperity to mint
    function mint(address to, uint256 amount) external;
}
