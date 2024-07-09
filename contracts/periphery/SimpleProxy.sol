// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

struct SimpleProxyStorage {
    address implementation;
    address owner;
}

function getSimpleProxyStorage() pure returns (SimpleProxyStorage storage ds) {
    //keccak256("mithraeum.simpleproxy") is 89ebf6b655b5bf3480fb4246b9e8786d810726f923695e3ff9668f941b26cb1a
    bytes32 position = 0x89ebf6b655b5bf3480fb4246b9e8786d810726f923695e3ff9668f941b26cb1a;
    assembly {
        ds.slot := position
    }
}

/// @title Simple proxy contract
/// @notice User of current proxy must be aware of simplicity nature of it, in particular case naming collision is not handled in it. Proxy parameters are written as specific slot address
contract SimpleProxy {
    /// @notice Emitted when #transferOwnership is called
    /// @param previousOwner Previous proxy owner
    /// @param newOwner New proxy owner
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /// @notice Thrown when attempting to call action which can only be called by owner
    error OnlyOwner();

    /// @notice Thrown when attempting to transfer ownership to zero address
    error UnableToTransferOwnershipToZeroAddress();

    /// @dev Only owner modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    constructor() {
        _transferOwnership(msg.sender);
    }

    /// @dev Fallback function that delegates calls to the address returned by `proxyStorage.implementation`. Will run if no other function in the contract matches the call data.
    fallback() external payable {
        SimpleProxyStorage storage proxyStorage = getSimpleProxyStorage();
        address _impl = proxyStorage.implementation;
        assembly {
            let ptr := mload(0x40)

            // (1) copy incoming call data
            calldatacopy(ptr, 0, calldatasize())

            // (2) forward call to logic contract
            let result := delegatecall(gas(), _impl, ptr, calldatasize(), 0, 0)
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

    /// @notice Updates proxy implementation address
    /// @dev Even though this function is opened, it can only be called by contract owner
    /// @param _newImpl New implementation address
    function setImplementation(address _newImpl) public onlyOwner {
        SimpleProxyStorage storage proxyStorage = getSimpleProxyStorage();
        proxyStorage.implementation = _newImpl;
    }

    /// @notice Renounces proxy ownership
    /// @dev Even though this function is opened, it can only be called by contract owner
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /// @notice Transfers ownership to another address
    /// @dev Even though this function is opened, it can only be called by contract owner
    /// @param newOwner New owner address
    function transferOwnership(address newOwner) public virtual onlyOwner {
        if (newOwner == address(0)) revert UnableToTransferOwnershipToZeroAddress();
        _transferOwnership(newOwner);
    }

    /// @dev Transfers ownership to another address
    function _transferOwnership(address newOwner) internal virtual {
        SimpleProxyStorage storage proxyStorage = getSimpleProxyStorage();
        address oldOwner = proxyStorage.owner;
        proxyStorage.owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }

    /// @dev Allows caller to be only owner
    function _onlyOwner() internal view {
        if (getSimpleProxyStorage().owner != msg.sender) revert OnlyOwner();
    }
}
