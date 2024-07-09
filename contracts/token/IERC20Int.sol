// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20Int is IERC20 {
    function realBalanceOf(address account) external view returns (int256);

    function realTotalSupply() external view returns (int256);
}
