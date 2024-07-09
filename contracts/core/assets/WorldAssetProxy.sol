// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../IWorld.sol";
import "./WorldAssetStorage.sol";

/// @title World asset proxy
/// @notice Acts as a proxy contract to specified world asset, implementation of which is dereferenced from its creation parameters
contract WorldAssetProxy {
    constructor(
        address worldAddress,
        uint256 eraNumber,
        bytes32 assetGroupId,
        bytes32 assetTypeId
    ) public {
        WorldAssetStorage storage proxyStorage = getWorldAssetStorage();
        proxyStorage.worldAddress = worldAddress;
        proxyStorage.eraNumber = eraNumber;
        proxyStorage.assetId = bytes28(keccak256(abi.encodePacked(assetGroupId, assetTypeId)));
        proxyStorage.assetGroupId = assetGroupId;
        proxyStorage.assetTypeId = assetTypeId;
    }

    /// @dev Fallback function that delegates calls to the address returned by registry script contract. Will run if no other function in the contract matches the call data.
    fallback() external payable {
        WorldAssetStorage storage proxyStorage = getWorldAssetStorage();
        address impl = IWorld(proxyStorage.worldAddress).implementations(proxyStorage.assetId);
        assembly {
            let ptr := mload(0x40)

            // (1) copy incoming call data
            calldatacopy(ptr, 0, calldatasize())

            // (2) forward call to logic contract
            let result := delegatecall(gas(), impl, ptr, calldatasize(), 0, 0)
            let size := returndatasize()

            // (3) retrieve return data
            returndatacopy(ptr, 0, size)

            // (4) forward return data back to caller
            switch result
            case 0 {
                revert(ptr, size)
            }
            default {
                return(ptr, size)
            }
        }
    }
}
