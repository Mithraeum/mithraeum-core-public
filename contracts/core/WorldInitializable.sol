// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./IWorldInitializable.sol";

/// @title Abstract World initializable contract
/// @notice Any contract which should be initialized with world should inherit this contract
abstract contract WorldInitializable is IWorldInitializable, Initializable {
    /// @inheritdoc IWorldInitializable
    IWorld public override world;

    /// @dev Only active game modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyActiveGame() {
        _onlyActiveGame();
        _;
    }

    /// @dev Initializes world by specified address, can be called only once
    function setWorld(address worldAddress) internal onlyInitializing {
        world = IWorld(worldAddress);
    }

    /// @dev Extracts registry from the world
    function registry() internal view returns (IRegistry) {
        return world.registry();
    }

    /// @dev Allows function to be callable only while game is active
    function _onlyActiveGame() internal view {
        uint256 _gameBeginTime = world.gameBeginTime();
        uint256 _gameEndTime = world.gameEndTime();
        if (_gameBeginTime == 0 || block.timestamp < _gameBeginTime) revert OnlyActiveGame();
        if (_gameEndTime != 0 && block.timestamp >= _gameEndTime) revert OnlyActiveGame();
    }
}
