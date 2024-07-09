// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

abstract contract ProxyReentrancyGuard {
    bool private _status;

    /// @notice Thrown when attempting to call function via reentrancy
    error ReentrantCall();

    modifier nonReentrant() {
        if (_status == true) revert ReentrantCall();
        _status = true;
        _;
        _status = false;
    }
}
