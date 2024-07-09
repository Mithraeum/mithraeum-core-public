// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IWorldAssetStorageAccessor.sol";

/// @title World asset storage accessor
/// @notice Any world asset which requires to identify itself as a specific type should inherit this contract
abstract contract WorldAssetStorageAccessorWithPush0 is IWorldAssetStorageAccessor {
    /// @inheritdoc IWorldAssetStorageAccessor
    function world() public view virtual override returns (IWorld) {
        address currentAddress = address(this);
        address worldAddress;
        bytes memory worldAddressMemoryContainer = new bytes(20);

        assembly {
            //42 is where 'worldAddress' in proxy code
            extcodecopy(currentAddress, add(worldAddressMemoryContainer, 32), 42, 20)
            worldAddress := mload(add(worldAddressMemoryContainer, 20))
        }

        return IWorld(worldAddress);
    }

    /// @inheritdoc IWorldAssetStorageAccessor
    function eraNumber() public view override returns (uint256) {
        address currentAddress = address(this);
        uint256 _eraNumber;
        bytes memory eraNumberMemoryContainer = new bytes(32);

        assembly {
            //with Push0
            //154 is where 'eraNumber' in proxy code
            extcodecopy(currentAddress, add(eraNumberMemoryContainer, 32), 154, 32)

            _eraNumber := mload(add(eraNumberMemoryContainer, 32))
        }

        return _eraNumber;
    }

    /// @inheritdoc IWorldAssetStorageAccessor
    function assetGroupId() public view override returns (bytes32) {
        address currentAddress = address(this);
        bytes32 _assetGroupId;
        bytes memory assetGroupIdMemoryContainer = new bytes(32);

        assembly {
            //with Push0
            //90 is where 'assetGroupId' in proxy code
            extcodecopy(currentAddress, add(assetGroupIdMemoryContainer, 32), 90, 32)

            _assetGroupId := mload(add(assetGroupIdMemoryContainer, 32))
        }

        return _assetGroupId;
    }

    /// @inheritdoc IWorldAssetStorageAccessor
    function assetTypeId() public view override returns (bytes32) {
        address currentAddress = address(this);
        bytes32 _assetTypeId;
        bytes memory assetTypeIdMemoryContainer = new bytes(32);

        assembly {
            //with Push0
            //122 is where 'assetTypeId' in proxy code
            extcodecopy(currentAddress, add(assetTypeIdMemoryContainer, 32), 122, 32)

            _assetTypeId := mload(add(assetTypeIdMemoryContainer, 32))
        }

        return _assetTypeId;
    }
}
