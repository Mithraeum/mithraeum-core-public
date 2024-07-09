// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Stub token
/// @notice Used for development deployments, where specific functions is token must be present for testing convenience. Should not be used in production
contract StubERC20 is ERC20, Ownable {
    constructor(
        string memory name,
        string memory symbol
    ) public ERC20(name, symbol) {

    }

    /// @notice Mints specified amount of tokens to specified address
    /// @dev Only owner can mint tokens
    /// @param dstAddress An address which will receive tokens
    /// @param amount Tokens amount
    function mintTo(
        address dstAddress,
        uint256 amount
    ) public onlyOwner {
        _mint(dstAddress, amount);
    }

    /// @notice Burns specified amount of tokens from specified address
    /// @dev Only owner can burn tokens from address
    /// @param srcAddress An address from which tokens will be burned
    /// @param amount Tokens amount
    function burnFrom(
        address srcAddress,
        uint256 amount
    ) public onlyOwner {
        _burn(srcAddress, amount);
    }
}
