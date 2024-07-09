// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../../../../token/IERC20Burnable.sol";

/// @title Units interface
/// @notice Functions to read state/modify state in order to get current unit parameters and/or interact with it
interface IUnits is IERC20Burnable, IERC20 {
    // State variables

    /// @notice Token name
    /// @dev Immutable, initialized on creation
    function tokenName() external view returns (string memory);

    /// @notice Token symbol
    /// @dev Immutable, initialized on creation
    function tokenSymbol() external view returns (string memory);

    /// @notice Unit type id
    /// @dev Immutable, initialized on creation
    function unitTypeId() external view returns (bytes32);

    // Errors

    /// @notice Thrown when attempting to call action which is disabled
    error Disabled();

    // Functions

    /// @notice Mints units to specified address
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param to Address which will receive units
    /// @param amount Amount of units to mint
    function mint(address to, uint256 amount) external;
}
