// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IWorldAssetStorageAccessor.sol";
import "./WorldAssetStorage.sol";

/// @title World asset storage accessor
/// @notice Any world asset which requires to identify itself as a specific type should inherit this contract
abstract contract WorldAssetStorageAccessorWithStaticContractCode is IWorldAssetStorageAccessor {
    /// @inheritdoc IWorldAssetStorageAccessor
    function world() public view virtual override returns (IWorld) {
        return IWorld(getWorldAssetStorage().worldAddress);
    }

    /// @inheritdoc IWorldAssetStorageAccessor
    function eraNumber() public view override returns (uint256) {
        return getWorldAssetStorage().eraNumber;
    }

    /// @inheritdoc IWorldAssetStorageAccessor
    function assetGroupId() public view override returns (bytes32) {
        return getWorldAssetStorage().assetGroupId;
    }

    /// @inheritdoc IWorldAssetStorageAccessor
    function assetTypeId() public view override returns (bytes32) {
        return getWorldAssetStorage().assetTypeId;
    }
}
