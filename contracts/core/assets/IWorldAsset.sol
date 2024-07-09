// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../IWorld.sol";
import "./IWorldAssetFactory.sol";

interface IWorldAsset {
    // Errors

    /// @notice Thrown when attempting to call action which can only be called by mighty creator
    error OnlyMightyCreator();

    /// @notice Thrown when attempting to call action which can only be called by world asset from same era
    error OnlyWorldAssetFromSameEra();

    /// @notice Thrown when attempting to call action which can only be called in active game (started and not finished)
    error OnlyActiveGame();

    // Functions

    /// @notice World
    /// @dev Value is dereferenced from proxy storage
    function world() external view returns (IWorld);

    /// @notice Registry
    /// @dev Value is dereferenced from world
    function registry() external view returns (IRegistry);

    /// @notice Era
    /// @dev Value is dereferenced from proxy storage and world
    function era() external view returns (IEra);

    /// @notice Returns world asset factory from registry
    /// @dev Value is dereferenced from registry
    function worldAssetFactory() external view returns (IWorldAssetFactory);
}
