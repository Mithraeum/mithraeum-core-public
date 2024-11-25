// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/// @title World resolver
/// @notice Contains defined world addresses
contract Resolver {
    /// @notice World address
    /// @dev Updated when #setWorldAddress is called
    mapping(address => mapping(string => address)) public worlds;

    /// @notice Emitted when #setWorldAddress is called
    /// @param deployer Deployer address
    /// @param environmentName Environment name
    /// @param worldAddress New world address
    event NewWorldAddress(address deployer, string environmentName, address worldAddress);

    /// @notice Updates world address
    /// @dev Even though this function is opened, it can only be called by contract owner
    /// @param environmentName Environment name
    /// @param worldAddress World address
    function setWorldAddress(
        string memory environmentName,
        address worldAddress
    ) public {
        worlds[msg.sender][environmentName] = worldAddress;
        emit NewWorldAddress(msg.sender, environmentName, worldAddress);
    }
}