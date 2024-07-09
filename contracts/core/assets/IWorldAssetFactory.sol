// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/// @title Army factory interface
/// @notice Contains instance creator function
interface IWorldAssetFactory {
    // Errors

    /// @notice Thrown when attempting to call action which can only be called by world or world asset
    error OnlyWorldOrWorldAsset();

    // Functions

    /// @notice Creates new world asset, sets it into the world and initializes it
    /// @param worldAddress World address
    /// @param eraNumber Era number
    /// @param assetGroupId Asset group id
    /// @param assetTypeId Asset type id
    /// @param initParams Init params
    /// @return worldAssetAddress World asset address
    function create(
        address worldAddress,
        uint256 eraNumber,
        bytes32 assetGroupId,
        bytes32 assetTypeId,
        bytes memory initParams
    ) external returns (address worldAssetAddress);
}
