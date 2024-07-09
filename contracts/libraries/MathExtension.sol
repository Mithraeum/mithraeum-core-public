// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/// @title Extension of math library
/// @notice Contains helper functions for some math operations
library MathExtension {
    /// @dev Calculates square root of uint256 using Babylonian Method
    function sqrt(uint256 y) internal pure returns (uint256 z) {
        if (y > 3) {
            z = y;
            uint256 x = y / 2 + 1;
            while (x < z) {
                z = x;
                x = (y / x + x) / 2;
            }
        } else if (y != 0) {
            z = 1;
        }
    }

    /// @dev Rounds uint256 value with provided precision to its integer value rounding down
    function roundDownWithPrecision(uint256 value, uint256 precision) internal pure returns (uint256) {
        return (value / precision) * precision;
    }

    /// @dev Rounds uint256 value with provided precision to its integer value rounding up
    function roundUpWithPrecision(uint256 value, uint256 precision) internal pure returns (uint256) {
        uint256 roundedValue = roundDownWithPrecision(value, precision);
        if (value % precision != 0) {
            roundedValue += precision;
        }

        return roundedValue;
    }

    /// @dev Check if uint256 value with provided precision integer value or not
    function isIntegerWithPrecision(uint256 value, uint256 precision) internal pure returns (bool) {
        return value % precision == 0;
    }
}
