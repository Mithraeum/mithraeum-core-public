// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../IWorld.sol";

/// @title World asset storage accessor interface
/// @notice Contains function to identify world asset group and type
interface IWorldAssetStorageAccessor {
    // Functions

    /// @notice Returns world
    /// @dev Reads data from proxy's storage
    /// @return world World
    function world() external view returns (IWorld world);

    /// @notice Returns era number
    /// @dev Reads data from proxy's storage
    /// @return eraNumber Era number
    function eraNumber() external view returns (uint256 eraNumber);

    /// @notice Returns world asset group id
    /// @dev Reads data from proxy's storage
    /// @return assetGroupId World asset group id
    function assetGroupId() external view returns (bytes32 assetGroupId);

    /// @notice Returns world asset type id
    /// @dev Reads data from proxy's storage
    /// @return assetTypeId World asset type id
    function assetTypeId() external view returns (bytes32 assetTypeId);
}
