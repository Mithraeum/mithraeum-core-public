// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title World resolver
/// @notice Contains currently active world address
contract Resolver is Ownable {
    /// @notice World address
    /// @dev Updated when #setWorldAddress is called
    address public world;

    /// @notice Emitted when #setWorldAddress is called
    /// @param worldAddress New world address
    event NewWorldAddress(address worldAddress);

    /// @notice Updates world address
    /// @dev Even though this function is opened, it can only be called by contract owner
    /// @param _worldAddress New world address
    function setWorldAddress(address _worldAddress) public onlyOwner {
        world = _worldAddress;
        emit NewWorldAddress(_worldAddress);
    }
}
