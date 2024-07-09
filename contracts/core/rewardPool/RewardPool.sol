// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "./IRewardPool.sol";
import "../WorldInitializable.sol";
import "../../periphery/ProxyReentrancyGuard.sol";
import "../../libraries/ABDKMath64x64.sol";
import "../../const/GameAssetTypes.sol";

contract RewardPool is IRewardPool, WorldInitializable, ProxyReentrancyGuard {
    /// @inheritdoc IRewardPool
    int128 public override defaultTokenPrice;
    /// @inheritdoc IRewardPool
    uint256 public override toBeRepaidTokenAmount;
    /// @inheritdoc IRewardPool
    uint256 public override lastSyncedTokenBalance;

    /// @dev Repays newly added balance to mighty creator
    modifier syncBalances(uint256 msgValue) {
        uint256 rewardPoolBalanceBefore = _getRewardPoolBalance() - msgValue;
        uint256 addedBalance = rewardPoolBalanceBefore - lastSyncedTokenBalance;
        if (addedBalance > 0) {
            uint256 toRepay = Math.min(toBeRepaidTokenAmount, addedBalance);

            if (toRepay > 0) {
                _sendTokens(world.registry().mightyCreator(), toRepay);
                toBeRepaidTokenAmount -= toRepay;
                emit ToBeRepaidTokenAmountUpdated(toBeRepaidTokenAmount);
            }
        }
        _;
        lastSyncedTokenBalance = _getRewardPoolBalance();
        emit LastSyncedTokenBalanceUpdated(lastSyncedTokenBalance);
    }

    receive() external payable {
        if (address(world.erc20ForSettlementPurchase()) != address(0)) revert UnableToReceiveEther();
        emit EthBalanceUpdated(address(this).balance);
    }

    /// @inheritdoc IRewardPool
    function init(address worldAddress) public override initializer {
        setWorld(worldAddress);
        defaultTokenPrice = ABDKMath64x64.fromUInt(1);
    }

    /// @inheritdoc IRewardPool
    function investIntoPrizePool(uint256 amountToInvest) public payable syncBalances(msg.value) {
        IERC20 erc20ForSettlementPurchase = world.erc20ForSettlementPurchase();
        if (address(erc20ForSettlementPurchase) != address(0) && msg.value != 0) revert UnableToReceiveEther();

        if (address(erc20ForSettlementPurchase) == address(0)) {
            toBeRepaidTokenAmount += msg.value;
        } else {
            SafeERC20.safeTransferFrom(
                erc20ForSettlementPurchase,
                msg.sender,
                address(this),
                amountToInvest
            );
            toBeRepaidTokenAmount += amountToInvest;
        }

        emit ToBeRepaidTokenAmountUpdated(toBeRepaidTokenAmount);
    }

    /// @inheritdoc IRewardPool
    function swapIngotsForTokens(
        address resourcesOwner,
        uint256 ingotsAmount,
        uint256 minTokensToReceive
    ) public override nonReentrant syncBalances(0) {
        uint256 tokenPrecision = _getTokenPrecision();
        uint256 currentPrice = getCurrentPrice();
        uint256 rewardPoolBalance = _getRewardPoolBalance();

        uint256 tokensToBeReceived = _getTokensAmountOut(ingotsAmount, tokenPrecision, currentPrice);

        // In case if amount of tokens to be received (66.6) > current reward pool balance (62)
        // And current reward pool balance (62) > minimum desired amount of tokens to receive (60)
        // We need to make user drain everything of whats left in the pool
        if (tokensToBeReceived > rewardPoolBalance && rewardPoolBalance > minTokensToReceive) {
            tokensToBeReceived = rewardPoolBalance;
        }

        if (tokensToBeReceived == 0) revert NoTokensWillBeReceived();
        if (tokensToBeReceived < minTokensToReceive) revert TokensToBeReceivedLessThanMinimumRequired();
        if (minTokensToReceive > rewardPoolBalance || rewardPoolBalance == 0) revert NotEnoughTokensLeft();

        uint256 minimumAmountOfIngotsRequiredForSpecificTokensToBeReceived = _getIngotsAmountIn(tokensToBeReceived, tokenPrecision, currentPrice);

        IResource ingots = world.eras(world.currentEraNumber()).resources(INGOT_TYPE_ID);

        if (resourcesOwner == address(0)) {
            ingots.transferFrom(msg.sender, address(this), minimumAmountOfIngotsRequiredForSpecificTokensToBeReceived);
        } else {
            ingots.spendAllowance(resourcesOwner, msg.sender, minimumAmountOfIngotsRequiredForSpecificTokensToBeReceived);
            ingots.transferFrom(resourcesOwner, address(this), minimumAmountOfIngotsRequiredForSpecificTokensToBeReceived);
        }

        _sendTokens(msg.sender, tokensToBeReceived);

        if (_getRewardPoolBalance() == 0 && world.gameEndTime() == 0) {
            world.setGameEndTime(block.timestamp);
        }
    }

    /// @inheritdoc IRewardPool
    function withdrawRepayment() public syncBalances(0) {}

    /// @inheritdoc IRewardPool
    function getTokensAmountOut(uint256 ingotsAmountIn) public view override returns (uint256) {
        return _getTokensAmountOut(ingotsAmountIn, _getTokenPrecision(), getCurrentPrice());
    }

    /// @inheritdoc IRewardPool
    function getIngotsAmountIn(uint256 tokensAmountOut) public view override returns (uint256) {
        return _getIngotsAmountIn(tokensAmountOut, _getTokenPrecision(), getCurrentPrice());
    }

    /// @inheritdoc IRewardPool
    function getCurrentPrice() public view override returns (uint256) {
        uint256 currentEraNumber = world.currentEraNumber();
        IEra currentEra = world.eras(currentEraNumber);
        address ingotsAddress = address(currentEra.resources(INGOT_TYPE_ID));

        uint256 ingotPrecision = 10 ** IERC20Metadata(ingotsAddress).decimals();

        int128 currentPrice64 = _getCurrentPrice64(currentEraNumber, currentEra.creationTime(), world.gameBeginTime());
        return ABDKMath64x64.mulu(currentPrice64, ingotPrecision);
    }

    /// @dev Calculates tokens amount out based on specified parameters
    function _getTokensAmountOut(
        uint256 ingotsAmountIn,
        uint256 tokenPrecision,
        uint256 price
    ) internal pure returns (uint256) {
        return ingotsAmountIn * tokenPrecision / price;
    }

    /// @dev Calculates tokens amount out based on specified parameters
    function _getIngotsAmountIn(
        uint256 tokensAmountOut,
        uint256 tokenPrecision,
        uint256 price
    ) internal pure returns (uint256) {
        uint256 numerator = price * tokensAmountOut;

        if (numerator % tokenPrecision != 0) {
            return numerator / tokenPrecision + 1;
        } else {
            return numerator / tokenPrecision;
        }
    }

    /// @dev Returns token precision
    function _getTokenPrecision() internal view returns (uint256) {
        address tokenAddress = address(world.erc20ForSettlementPurchase());

        return tokenAddress == address(0)
            ? 1e18
            : 10 ** IERC20Metadata(tokenAddress).decimals();
    }

    /// @dev Calculates current token price based on current era and time passed since current era created (in 64.64 format)
    function _getCurrentPrice64(
        uint256 currentEraNumber,
        uint256 currentEraCreationTime,
        uint256 gameBeginTime
    ) internal view returns (int128) {
        int128 currentEraMultiplier64 = ABDKMath64x64.pow(
            ABDKMath64x64.fromUInt(2),
            currentEraNumber
        );

        int128 currentEraStartingPrice64 = ABDKMath64x64.div(defaultTokenPrice, currentEraMultiplier64);

        uint256 currentEraStartTime = Math.max(currentEraCreationTime, gameBeginTime);

        if (currentEraStartTime >= block.timestamp) {
            return currentEraStartingPrice64;
        }

        uint256 timePassedSinceEraStarted = block.timestamp - currentEraStartTime;

        // 50% every two weeks -> 1.5 increase every 1209600 seconds -> 1.0000003352059987312573101913599 increase every second
        int128 priceMultiplierPerSecond64 = ABDKMath64x64.divu(10000003352059987, 10000000000000000);
        int128 priceMultiplierForTimePassed64 = ABDKMath64x64.pow(priceMultiplierPerSecond64, timePassedSinceEraStarted);

        return ABDKMath64x64.mul(currentEraStartingPrice64, priceMultiplierForTimePassed64);
    }

    /// @dev Reads current balance
    function _getRewardPoolBalance() internal view returns (uint256) {
        IERC20 erc20ForSettlementPurchase = world.erc20ForSettlementPurchase();
        return address(erc20ForSettlementPurchase) == address(0)
            ? address(this).balance
            : erc20ForSettlementPurchase.balanceOf(address(this));
    }

    /// @dev Sends bless tokens from this contract to specified address (either eth or erc20)
    function _sendTokens(address to, uint256 amount) internal {
        IERC20 erc20ForSettlementPurchase = world.erc20ForSettlementPurchase();
        if (address(erc20ForSettlementPurchase) == address(0)) {
            Address.sendValue(payable(to), amount);
            emit EthBalanceUpdated(address(this).balance);
        } else {
            SafeERC20.safeTransfer(
                erc20ForSettlementPurchase,
                to,
                amount
            );
        }
    }
}