// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "../IWorld.sol";
import "./IWorldAsset.sol";
import "./WorldAssetStorageAccessorWithPush0.sol";

/// @title Abstract world asset
/// @notice World asset must inherit this basic contract
/// @dev IMPORTANT: be aware of proxy type of world asset deployed in 'WorldAssetFactory'
/// @dev Different network is optimized differently for contract deployment
/// @dev In order to support most of them it is required to recompile 'WorldAsset' contracts with 'WorldAssetStorageAccessorXXX' type specified in 'WorldAssetFactory'
abstract contract WorldAsset is IWorldAsset, WorldAssetStorageAccessorWithPush0, Initializable {
    /// @dev Only mighty creator modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyMightyCreator() {
        _onlyMightyCreator();
        _;
    }

    /// @dev Only world asset from same era modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyWorldAssetFromSameEra() {
        _onlyWorldAssetFromSameEra();
        _;
    }

    /// @dev Only active game modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyActiveGame() {
        _onlyActiveGame();
        _;
    }

    /// @dev World asset initializer
    /// @param initParams Encoded init params (every world asset has own knowledge how to extract data from it)
    function init(bytes memory initParams) public virtual;

    /// @inheritdoc IWorldAsset
    function world() public view override(IWorldAsset, WorldAssetStorageAccessorWithPush0) returns (IWorld) {
        return WorldAssetStorageAccessorWithPush0.world();
    }

    /// @inheritdoc IWorldAsset
    function registry() public view override returns (IRegistry) {
        return world().registry();
    }

    /// @inheritdoc IWorldAsset
    function era() public view override returns (IEra) {
        return world().eras(eraNumber());
    }

    /// @inheritdoc IWorldAsset
    function worldAssetFactory() public view override returns (IWorldAssetFactory) {
        return registry().worldAssetFactory();
    }

    /// @dev Allows caller to be only mighty creator
    function _onlyMightyCreator() internal view {
        if (msg.sender != registry().mightyCreator()) revert OnlyMightyCreator();
    }

    /// @dev Allows caller to be only world or world asset
    function _onlyWorldAssetFromSameEra() internal view {
        if (msg.sender != address(world()) &&
            world().worldAssets(WorldAssetStorageAccessorWithPush0.eraNumber(), msg.sender) == bytes32(0)) revert OnlyWorldAssetFromSameEra();
    }

    /// @dev Allows function to be callable only while game is active
    function _onlyActiveGame() internal view {
        uint256 _gameBeginTime = world().gameBeginTime();
        uint256 _gameEndTime = world().gameEndTime();
        if (_gameBeginTime == 0 || block.timestamp < _gameBeginTime) revert OnlyActiveGame();
        if (_gameEndTime != 0 && block.timestamp >= _gameEndTime) revert OnlyActiveGame();
    }
}
