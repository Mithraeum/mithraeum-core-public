// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IWorld.sol";

/// @title Interface of the contract which will be initialized with world
/// @notice Contains access to world storage variable
interface IWorldInitializable {
    // State variables

    /// @notice World
    /// @dev Should be immutable and initialized only once
    function world() external view returns (IWorld);

    // Errors

    /// @notice Thrown when attempting to call action which can only be called in active game (started and not finished)
    error OnlyActiveGame();
}
