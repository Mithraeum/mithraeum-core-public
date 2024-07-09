// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../IWorld.sol";
import "./WorldAsset.sol";
import "./WorldAssetProxy.sol";
import "./IWorldAssetFactory.sol";

/// @title World asset factory
/// @notice Any world asset factory should inherit this abstract factory containing common method to create and set world asset
contract WorldAssetFactory is IWorldAssetFactory {
    /// @dev Only world or world asset modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyWorldOrWorldAsset(address worldAddress, uint256 eraNumber) {
        _onlyWorldOrWorldAsset(worldAddress, eraNumber);
        _;
    }

    /// @inheritdoc IWorldAssetFactory
    function create(
        address worldAddress,
        uint256 eraNumber,
        bytes32 assetGroupId,
        bytes32 assetTypeId,
        bytes memory initParams
    ) public override returns (address) {
        WorldAsset worldAsset = WorldAsset(createAndSet(worldAddress, eraNumber, assetGroupId, assetTypeId));
        worldAsset.init(initParams);
        return address(worldAsset);
    }

    /// @dev Creates new world asset proxy with specified world asset params and adds newly created asset to the world
    function createAndSet(
        address worldAddress,
        uint256 eraNumber,
        bytes32 assetGroupId,
        bytes32 assetTypeId
    ) internal onlyWorldOrWorldAsset(worldAddress, eraNumber) returns (address) {
        // Beware of world asset proxy type is deployed based on desired network
        address newProxyAddress = createNewWorldAssetProxyWithPush0(worldAddress, eraNumber, assetGroupId, assetTypeId);
        IWorld(worldAddress).addWorldAsset(eraNumber, newProxyAddress, assetGroupId);
        return newProxyAddress;
    }

    /// @dev Creates new world asset proxy via bytes concatenation in order to achieve minimal bytecode size and call size (implemented with PUSH0 opcode)
    function createNewWorldAssetProxyWithPush0(
        address worldAddress,
        uint256 eraNumber,
        bytes32 assetGroupId,
        bytes32 assetTypeId
    ) internal returns (address) {
        bytes28 assetId = bytes28(keccak256(abi.encodePacked(assetGroupId, assetTypeId)));

        // High level description of what happens on opcode level
        // Contract is created with <creationCode><worldAssetCode>
        // - creationCode is code which returns worldAssetCode (aka stores it on the blockchain)
        // - worldAssetCode is world asset execution proxy code

        ///// CREATION CODE START
        //
        //    PUSH1 0xba //size of worldAssetCode below (186 bytes => 0xBA)
        //    DUP1
        //    PUSH1 0x09 //size of creation code
        //    PUSH0
        //    CODECOPY
        //    PUSH0
        //    RETURN
        //
        ///// CREATION CODE END

        ///// WORLD ASSET CODE START
        //
        //    1. Prepare stack for STATICCALL operation. We are going to the 'worldAddress' and requesting implementation
        //       of this world asset, in the process we are storing 'worldAddress' and 'assetId' in bytecode
        //       (Effectively doing IWorld(worldAddress).implementations(assetId) but in minimal bytecode possible)
        //       AssetId is bytes28 exactly for purpose to minimally construct calldata for this operation.
        //
        //    PUSH32 0xbb993a5855555555555555555555555555555555555555555555555555555555 // <bytes4(keccak256("implementations(bytes28)"))><assetId>
        //    PUSH0
        //    MSTORE
        //    PUSH1 0x20    // retSize,      32 bytes
        //    PUSH0         // retOffset,    it will be stored at memory offset 0
        //    PUSH1 0x24    // argsSize,     since solidity functions require 4 bytes for function identifier, and minimal function param is 32 bytes => 4+32 = 36 = 0x24
        //    PUSH0         // argsOffset,   input calldata located at memory offset 0
        //    PUSH20 0x1111111111111111111111111111111111111111 // world address
        //    GAS           // amount of gas to forward
        //    STATICCALL
        //
        //    2. Prepare stack for DELEGATECALL
        //       After previous step (STATICCALL) we've got
        //       - worldAsset implementation address at memory (offset: 0, size: 64)
        //       - '1' on stack after successful STATICCALL
        //       We are assuming STATICCALL result is always '1' because if we've got to the point of deploying worldAssetProxy
        //       worldAddress cannot be invalid, by doing so we are reducing contract size and its execution cost
        //
        //    2.1. We need to move worldAsset implementation address to the stack (from memory) in order to prepare stack
        //          to DELEGATECALL
        //
        //    ISZERO    // remove '1' from stack, and push0 via one command (make stack 1 -> 0)
        //    MLOAD     // load implementation address from memory to stack
        //
        //    2.2. Copy original calldata to memory at offset: 0
        //
        //    CALLDATASIZE
        //    PUSH0
        //    PUSH0
        //    CALLDATACOPY
        //
        //    2.3. Stack preparation
        //
        //    PUSH0         // retOffset, 0
        //    CALLDATASIZE  // argSize, calldata size
        //    PUSH0         // argsOffset, 0
        //    PUSH0         // retSize, will be swapped to address by next opcode
        //    SWAP4         // swaps worldAsset implementation address with 'retSize'
        //    GAS           // amount of gas to forward
        //    DELEGATECALL
        //
        //    3. Copy DELEGATECALL result, check for revert, return result
        //
        //    3.1. Copy DELEGATECALL result to memory
        //
        //    RETURNDATASIZE
        //    PUSH0
        //    PUSH0
        //    RETURNDATACOPY
        //
        //    3.2. Check for revert and return
        //
        //    PUSH0
        //    RETURNDATASIZE
        //    SWAP2
        //    PUSH1 0x58    // opcode address of next 'JUMPDEST'
        //    JUMPI
        //    REVERT
        //    JUMPDEST
        //    RETURN
        //
        //    3.3. Next bytecode section is stored 'groupTypeId', 'assetTypeId', 'eraNumber'
        //         Since these worldAsset parameters are always immutable it is much cheaper to store them as contract
        //         code rather than storing them to the storage and also it is much cheaper to query them via
        //         'EXTCODECOPY' (100 base gas) vs 'CALL + SLOAD' (200 base gas)
        //
        //    0x2222222222222222222222222222222222222222222222222222222222222222 // groupTypeId
        //    0x3333333333333333333333333333333333333333333333333333333333333333 // assetTypeId
        //    0x4444444444444444444444444444444444444444444444444444444444444444 // eraNumber
        //
        ///// WORLD ASSET CODE END

        bytes memory _code = abi.encodePacked(
            hex"60ba8060095f395ff37fbb993a58",
            assetId,
            hex"5f5260205f60245f73",
            worldAddress,
            hex"5afa1551365f5f375f365f5f935af43d5f5f3e5f3d91605857fd5bf3",
            assetGroupId,
            assetTypeId,
            eraNumber
        );

        address proxy;
        assembly {
            proxy := create(0, add(_code, 0x20), mload(_code))
        }

        return proxy;
    }

    /// @dev Creates new world asset proxy via bytes concatenation in order to achieve minimal bytecode size and call size (implemented without PUSH0 opcode -> more contract size, more gas cost)
    function createNewWorldAssetProxyWithoutPush0(
        address worldAddress,
        uint256 eraNumber,
        bytes32 assetGroupId,
        bytes32 assetTypeId
    ) internal returns (address) {
        bytes28 assetId = bytes28(keccak256(abi.encodePacked(assetGroupId, assetTypeId)));

        // High level description of what happens on opcode level
        // Contract is created with <creationCode><worldAssetCode>
        // - creationCode is code which returns worldAssetCode (aka stores it on the blockchain)
        // - worldAssetCode is world asset execution proxy code

        ///// CREATION CODE START
        //
        //    PUSH1 0xbb //size of worldAssetCode below (187 bytes => 0xbb)
        //    DUP1
        //    PUSH1 0x09 //size of creation code
        //    RETURNDATASIZE
        //    CODECOPY
        //    RETURNDATASIZE
        //    RETURN
        //
        ///// CREATION CODE END

        ///// WORLD ASSET CODE START
        //
        //    1. Prepare stack for STATICCALL operation. We are going to the 'worldAddress' and requesting implementation
        //       of this world asset, in the process we are storing 'worldAddress' and 'assetId' in bytecode
        //       (Effectively doing IWorld(worldAddress).implementations(assetId) but in minimal bytecode possible)
        //       AssetId is bytes28 exactly for purpose to minimally construct calldata for this operation.
        //
        //    PUSH32 0xbb993a5855555555555555555555555555555555555555555555555555555555 // <bytes4(keccak256("implementations(bytes28)"))><assetId>
        //    RETURNDATASIZE
        //    MSTORE
        //    PUSH1 0x20    // retSize,      32 bytes
        //    RETURNDATASIZE// retOffset,    it will be stored at memory offset 0
        //    PUSH1 0x24    // argsSize,     since solidity functions require 4 bytes for function identifier, and minimal function param is 32 bytes => 4+32 = 36 = 0x24
        //    DUP2          // argsOffset,   input calldata located at memory offset 0
        //    PUSH20 0x1111111111111111111111111111111111111111 // world address
        //    GAS           // amount of gas to forward
        //    STATICCALL
        //
        //    // 2. Prepare stack for DELEGATECALL
        //    //    After previous step (STATICCALL) we've got
        //    //    - worldAsset implementation address at memory (offset: 0, size: 64)
        //    //    - '1' on stack after successful STATICCALL
        //    //    We are assuming STATICCALL result is always '1' because if we've got to the point of deploying worldAssetProxy
        //    //    worldAddress cannot be invalid, by doing so we are reducing contract size and its execution cost
        //
        //    // 2.1. We need to move worldAsset implementation address to the stack (from memory) in order to prepare stack
        //    //       to DELEGATECALL
        //
        //    ISZERO    // remove '1' from stack, and push0 via one command (make stack 1 -> 0) // 0
        //    DUP1                                                                      // 0 0
        //    MLOAD     // load implementation address from memory to stack             // mload 0
        //
        //    // 2.2. Copy original calldata to memory at offset: 0
        //
        //    CALLDATASIZE // cds mload 0
        //    DUP3         // 0 cds mload 0
        //    DUP1         // 0 0 cds mload 0
        //    CALLDATACOPY // mload 0
        //
        //    // 2.3. Stack preparation
        //
        //    DUP2          // retOffset, 0                                             // 0 mload 0
        //    CALLDATASIZE  // argSize, calldata size                                   // cds 0 mload 0
        //    DUP2          // argsOffset, 0                                            // 0 cds 0 mload 0
        //    DUP1          // retSize, will be swapped to address by next opcode       // 0 0 cds 0 mload 0
        //    SWAP4         // swaps worldAsset implementation address with 'retSize'   // mload 0 cds 0 0 0
        //    GAS           // amount of gas to forward                                 // gas mload 0 cds 0 0 0
        //    DELEGATECALL                                                              // success 0
        //
        //    // 3. Copy DELEGATECALL result, check for revert, return result
        //
        //    // 3.1. Copy DELEGATECALL result to memory
        //
        //    RETURNDATASIZE                                                            // rds success 0
        //    DUP3                                                                      // 0 rds success 0
        //    DUP1                                                                      // 0 0 rds success 0
        //    RETURNDATACOPY                                                            // success 0
        //
        //    // 3.2. Check for revert and return
        //
        //    SWAP1                                                                     // 0 success
        //    RETURNDATASIZE                                                            // rds 0 success
        //    SWAP2                                                                     // success 0 rds
        //    PUSH1 0x59    // opcode address of next 'JUMPDEST'                        // 0x59 success 0 rds
        //    JUMPI                                                                     // 0 rds
        //    REVERT
        //    JUMPDEST
        //    RETURN
        //
        //    3.3. Next bytecode section is stored 'groupTypeId', 'assetTypeId', 'eraNumber'
        //         Since these worldAsset parameters are always immutable it is much cheaper to store them as contract
        //         code rather than storing them to the storage and also it is much cheaper to query them via
        //         'EXTCODECOPY' (100 base gas) vs 'CALL + SLOAD' (200 base gas)
        //
        //    0x2222222222222222222222222222222222222222222222222222222222222222 // groupTypeId
        //    0x3333333333333333333333333333333333333333333333333333333333333333 // assetTypeId
        //    0x4444444444444444444444444444444444444444444444444444444444444444 // eraNumber
        //
        ///// WORLD ASSET CODE END

        bytes memory _code = abi.encodePacked(
            hex"60bb8060093d393df3",
            hex"7fbb993a58",
            assetId,
            hex"3d5260203d60248173",
            worldAddress,
            hex"5afa1580513682803781368180935af43d82803e903d91605957fd5bf3",
            assetGroupId,
            assetTypeId,
            eraNumber
        );

        address proxy;
        assembly {
            proxy := create(0, add(_code, 0x20), mload(_code))
        }

        return proxy;
    }

    /// @dev Creates new world asset proxy with static contract code (world proxy variables are stored in storage instead of code, making it most expensive version of proxy however it is most optimized for zk evm)
    function createNewWorldAssetProxyWithStaticContractCode(
        address worldAddress,
        uint256 eraNumber,
        bytes32 assetGroupId,
        bytes32 assetTypeId
    ) internal returns (address) {
        return address(new WorldAssetProxy(worldAddress, eraNumber, assetGroupId, assetTypeId));
    }

    /// @dev Allows caller to be only world or world asset
    function _onlyWorldOrWorldAsset(address worldAddress, uint256 eraNumber) internal view {
        if (msg.sender != worldAddress && IWorld(worldAddress).worldAssets(eraNumber, msg.sender) == bytes32(0)) revert OnlyWorldOrWorldAsset();
    }
}
