// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IRewardPool {
    // State variables

    /// @notice Represents how much of ingots must be given for one unit of token by default (in 64.64 format)
    /// @dev Updated when #handleEraDestroyed is called
    function defaultTokenPrice() external view returns (int128);

    /// @notice Represents how much bless tokens must be repaid first to the mighty creator
    /// @dev Updated when #investIntoPrizePool is called
    function toBeRepaidTokenAmount() external view returns (uint256);

    /// @notice Represents last synced reward pool total balance after repayment and function(s) are done
    /// @dev Updated when #investIntoPrizePool or #swapIngotsForTokens or #withdrawRepayment are called
    function lastSyncedTokenBalance() external view returns (uint256);

    // Events

    /// @notice Emitted when 'lastSyncedTokenBalance' updated
    /// @param newLastSyncedTokenBalance New last synced token balance
    event LastSyncedTokenBalanceUpdated(uint256 newLastSyncedTokenBalance);

    /// @notice Emitted when 'toBeRepaidTokenAmount' updated
    /// @param newToBeRepaidTokenAmount New to be repaid token amount
    event ToBeRepaidTokenAmountUpdated(uint256 newToBeRepaidTokenAmount);

    /// @notice Emitted when eth balance updated
    /// @param newEthBalance New eth balance
    event EthBalanceUpdated(uint256 newEthBalance);

    // Errors

    /// @notice Thrown when attempting to receive ether while having non native token reward
    error UnableToReceiveEther();

    /// @notice Thrown when attempting to swap ingots for tokens but specified ingots amount are not enough even for one unit of token
    error NoTokensWillBeReceived();

    /// @notice Thrown when attempting to swap ingots for tokens but amount of tokens to be received less than specified minimum amount
    error TokensToBeReceivedLessThanMinimumRequired();

    /// @notice Thrown when attempting to swap ingots for tokens but not enough tokens left for specified ingots amount
    error NotEnoughTokensLeft();

    // Functions

    /// @notice Proxy initializer
    /// @dev Called by address which created current instance
    /// @param worldAddress World address
    function init(address worldAddress) external;

    /// @notice Swap provided amount of ingots
    /// @dev If resourcesOwner == address(0) -> resources will be taken from msg.sender
    /// @dev If resourcesOwner != address(0) and resourcesOwner has given allowance to msg.sender >= ingotsAmount -> resources will be taken from resourcesOwner
    /// @param resourcesOwner Resources owner
    /// @param ingotsAmount Amount of ingots to swap
    /// @param minTokensToReceive Minimum amount of tokens to receive
    function swapIngotsForTokens(
        address resourcesOwner,
        uint256 ingotsAmount,
        uint256 minTokensToReceive
    ) external;

    /// @notice Invests specified amount of tokens into prize pool
    /// @dev Bless tokens must be sent to this function (if its type=eth) or will be deducted from msg.sender (if its type=erc20)
    /// @param amountToInvest Amount of tokens to invest
    function investIntoPrizePool(uint256 amountToInvest) external payable;

    /// @notice Withdraws potential bless token added balance to the mighty creator
    /// @dev Triggers withdraw of potential added balance
    function withdrawRepayment() external;

    /// @notice Calculates amount of tokens to be received by provided ingots amount
    /// @dev Used to determine how much tokens will be received by provided ingots amount
    /// @param ingotsAmountIn Ingots amount in
    /// @return tokensAmountOut Tokens amount out
    function getTokensAmountOut(uint256 ingotsAmountIn) external view returns (uint256 tokensAmountOut);

    /// Calculates minimum amount of ingots required for specified amount of tokens to receive
    /// @dev Used to determine how much tokens will be received by provided ingots amount
    /// @param tokensAmountOut Tokens amount out
    /// @return ingotsAmountIn Ingots amount in
    function getIngotsAmountIn(uint256 tokensAmountOut) external view returns (uint256 ingotsAmountIn);

    /// @notice Calculates current price of token in ingots
    /// @return price Price
    function getCurrentPrice() external view returns (uint256 price);
}
