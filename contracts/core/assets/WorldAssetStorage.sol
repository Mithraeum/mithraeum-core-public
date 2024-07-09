// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

struct WorldAssetStorage {
    address worldAddress;
    uint256 eraNumber;
    bytes28 assetId;
    bytes32 assetGroupId;
    bytes32 assetTypeId;
}

function getWorldAssetStorage() pure returns (WorldAssetStorage storage ds) {
    //keccak256("mithraeum.worldassetproxy") is 6c85b93e587873fbe6712f3b438d42c2945689b262f7bd34b8ea4e3f832a89e6
    bytes32 position = 0x6c85b93e587873fbe6712f3b438d42c2945689b262f7bd34b8ea4e3f832a89e6;
    assembly {
        ds.slot := position
    }
}
