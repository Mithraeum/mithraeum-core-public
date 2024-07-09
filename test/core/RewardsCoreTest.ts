import {ethers, getNamedAccounts} from "hardhat";
import {expect} from "chai";
import {toBN, toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import {ResourceHelper} from "../../shared/helpers/ResourceHelper";
import BigNumber from "bignumber.js";
import {ResourceType} from "../../shared/enums/resourceType";
import {UserHelper} from "../../shared/helpers/UserHelper";
import {SettlementHelper} from "../../shared/helpers/SettlementHelper";
import {DEFAULT_BANNER_NAME} from "../../shared/constants/banners";
import {TokenUtils} from "../../shared/helpers/TokenUtils";
import {UnitHelper} from "../../shared/helpers/UnitHelper";
import {WorldHelper} from "../../shared/helpers/WorldHelper";
import {ProductionHelper} from "../../shared/helpers/ProductionHelper";
import {BuildingType} from "../../shared/enums/buildingType";
import { CultistsHelper } from '../../shared/helpers/CultistsHelper';
import { RegionHelper } from '../../shared/helpers/RegionHelper';

export class RewardsCoreTest {
  public static async rewardsExchangeTest(){
    const { testUser1 } = await getNamedAccounts();

    const position = await RegionHelper.getPositionForSettlementInRegionByNumber(1, 4);
    const exchangeIngots = new BigNumber(100);

    const worldInstance = await WorldHelper.getWorldInstance(testUser1);
    const regionId = await RegionHelper.getRegionIdByPosition(position);
    const regionInstance = await RegionHelper.getRegionInstanceById(regionId);

    const rewardPoolAddress = await worldInstance.rewardPool();
    const rewardPoolInstance = await WorldHelper.getRewardPoolInstance(testUser1);
    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    const startingExchangeRatio = toLowBN(await rewardPoolInstance.getCurrentPrice());
    expect(startingExchangeRatio).isInCloseRangeWith(new BigNumber(1), 'Exchange ratio is not correct');

    const userTokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const rewardPoolBalance = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);

    const settlementCost = await RegionHelper.getNewSettlementCostByRegion(regionInstance);

    await UserHelper.mintBanner(testUser1, DEFAULT_BANNER_NAME);
    await RegionHelper.buySettlement(testUser1, regionId, position, settlementCost, settlementCost);

    const userTokenBalanceAfterPurchase = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const rewardPoolBalanceAfterPurchase = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);

    expect(userTokenBalanceAfterPurchase)
        .isInCloseRangeWith(userTokenBalance.minus(settlementCost), 'User token balance is not correct');
    expect(rewardPoolBalanceAfterPurchase)
        .isInCloseRangeWith(rewardPoolBalance.plus(settlementCost), 'Reward pool balance is not correct');

    const userResourceBalance = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.INGOT);
    const actualExchangeRatio = toLowBN(await rewardPoolInstance.getCurrentPrice());

    const expectedUserResourceBalance = userResourceBalance.minus(exchangeIngots);
    const expectedUserTokenBalance = userTokenBalanceAfterPurchase.plus((exchangeIngots.dividedBy(actualExchangeRatio)));
    const expectedRewardPoolBalance = rewardPoolBalanceAfterPurchase.minus((exchangeIngots.dividedBy(actualExchangeRatio)));

    //ingot exchange
    await rewardPoolInstance.swapIngotsForTokens(
      ethers.ZeroAddress,
      transferableFromLowBN(exchangeIngots),
      transferableFromLowBN(new BigNumber(0))
    ).then((tx) => tx.wait());

    const actualUserResourceBalance = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.INGOT);
    const actualUserTokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const actualRewardPoolBalance = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);

    expect(actualUserResourceBalance).eql(expectedUserResourceBalance, 'User resource balance is not correct');
    expect(actualUserTokenBalance).isInCloseRangeWith(expectedUserTokenBalance, 'User token balance is not correct');
    expect(actualRewardPoolBalance).isInCloseRangeWith(expectedRewardPoolBalance, 'Reward pool balance is not correct');
  }

  public static async rewardsExchangeByAnotherUserResourcesTest(){
    const { testUser1, testUser2 } = await getNamedAccounts();

    const position = await RegionHelper.getPositionForSettlementInRegionByNumber(1, 4);
    const exchangeIngots = new BigNumber(100);

    const worldInstance = await WorldHelper.getWorldInstance();
    const eraInstance = await WorldHelper.getCurrentEraInstance();
    const regionId = await RegionHelper.getRegionIdByPosition(position);
    const regionInstance = await RegionHelper.getRegionInstanceById(regionId);

    const rewardPoolAddress = await worldInstance.rewardPool();
    const rewardPoolInstance = await WorldHelper.getRewardPoolInstance(testUser1);
    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    const userTokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const rewardPoolBalance = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);

    const settlementCost = await RegionHelper.getNewSettlementCostByRegion(regionInstance);

    await UserHelper.mintBanner(testUser1, DEFAULT_BANNER_NAME);
    await RegionHelper.buySettlement(testUser1, regionId, position, settlementCost, settlementCost);

    const userTokenBalanceAfterPurchase = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const rewardPoolBalanceAfterPurchase = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);

    expect(userTokenBalanceAfterPurchase)
        .isInCloseRangeWith(userTokenBalance.minus(settlementCost), 'User token balance is not correct');
    expect(rewardPoolBalanceAfterPurchase)
        .isInCloseRangeWith(rewardPoolBalance.plus(settlementCost), 'Reward pool balance is not correct');

    const userResourceBalance = await ResourceHelper.getResourceQuantity(testUser2, ResourceType.INGOT);
    const exchangeRatio = toLowBN(await rewardPoolInstance.getCurrentPrice());

    const expectedUserResourceBalance = userResourceBalance.minus(exchangeIngots);
    const expectedUserTokenBalance = userTokenBalanceAfterPurchase.plus((exchangeIngots.dividedBy(exchangeRatio)));
    const expectedRewardPoolBalance = rewardPoolBalanceAfterPurchase.minus((exchangeIngots.dividedBy(exchangeRatio)));

    const ingotTypeId = ResourceHelper.getResourceTypeId(ResourceType.INGOT);
    const resourceTokenAddress = await eraInstance.resources(ingotTypeId);
    await TokenUtils.approveTokens(testUser2, resourceTokenAddress, transferableFromLowBN(exchangeIngots), testUser1);

    //ingot exchange
    await rewardPoolInstance.swapIngotsForTokens(
      testUser2,
      transferableFromLowBN(exchangeIngots),
      transferableFromLowBN(new BigNumber(0))
    ).then((tx) => tx.wait());

    const actualUserResourceBalance = await ResourceHelper.getResourceQuantity(testUser2, ResourceType.INGOT);
    const actualUserTokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const actualRewardPoolBalance = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);

    expect(actualUserResourceBalance).eql(expectedUserResourceBalance, 'User resource balance is not correct');
    expect(actualUserTokenBalance).isInCloseRangeWith(expectedUserTokenBalance, 'User token balance is not correct');
    expect(actualRewardPoolBalance).isInCloseRangeWith(expectedRewardPoolBalance, 'Reward pool balance is not correct');
  }

  public static async impossibleRewardsExchangeByAnotherUserResourcesWithoutApproveTest(){
    const { testUser1, testUser2 } = await getNamedAccounts();

    const position = await RegionHelper.getPositionForSettlementInRegionByNumber(1, 4);
    const exchangeIngots = new BigNumber(100);

    const worldInstance = await WorldHelper.getWorldInstance();
    const regionId = await RegionHelper.getRegionIdByPosition(position);
    const regionInstance = await RegionHelper.getRegionInstanceById(regionId);

    const rewardPoolAddress = await worldInstance.rewardPool();
    const rewardPoolInstance = await WorldHelper.getRewardPoolInstance(testUser1);
    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    const userTokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const rewardPoolBalance = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);

    const settlementCost = await RegionHelper.getNewSettlementCostByRegion(regionInstance);

    await UserHelper.mintBanner(testUser1, DEFAULT_BANNER_NAME);
    await RegionHelper.buySettlement(testUser1, regionId, position, settlementCost, settlementCost);

    const userTokenBalanceAfterPurchase = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const rewardPoolBalanceAfterPurchase = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);

    expect(userTokenBalanceAfterPurchase)
        .isInCloseRangeWith(userTokenBalance.minus(settlementCost), 'User token balance is not correct');
    expect(rewardPoolBalanceAfterPurchase)
        .isInCloseRangeWith(rewardPoolBalance.plus(settlementCost), 'Reward pool balance is not correct');

    await expect(
      rewardPoolInstance.swapIngotsForTokens(
        testUser2,
        transferableFromLowBN(exchangeIngots),
        transferableFromLowBN(new BigNumber(0))
      ).then((tx) => tx.wait())
    ).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'ERC20: insufficient allowance'");
  }

  public static async rewardsExchangeWithDecreasedRewardPoolTest(){
    const { testUser1, testUser2 } = await getNamedAccounts();

    const worldInstance = await WorldHelper.getWorldInstance();

    const rewardPoolAddress = await worldInstance.rewardPool();
    const rewardPoolInstance1 = await WorldHelper.getRewardPoolInstance(testUser1);
    const rewardPoolInstance2 = await WorldHelper.getRewardPoolInstance(testUser2);
    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    const rewardPoolBalanceBefore = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);

    const exchangeRatioBefore = toLowBN(await rewardPoolInstance1.getCurrentPrice());
    const maxExchangeIngotsBefore = rewardPoolBalanceBefore.multipliedBy(exchangeRatioBefore);

    const exchangeIngots = maxExchangeIngotsBefore.dividedBy(2);
    const minTokensToReceive = rewardPoolBalanceBefore.dividedBy(3);

    const userResourceBalance2 = await ResourceHelper.getResourceQuantity(testUser2, ResourceType.INGOT);
    expect(userResourceBalance2).gte(exchangeIngots, 'User resource balance is not correct');

    await rewardPoolInstance2.swapIngotsForTokens(
        ethers.ZeroAddress,
        transferableFromLowBN(exchangeIngots),
        transferableFromLowBN(new BigNumber(0))
    ).then((tx) => tx.wait());

    const rewardPoolBalanceAfter = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);

    const userTokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const userResourceBalance1 = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.INGOT);

    expect(userResourceBalance1).gte(maxExchangeIngotsBefore, 'User resource balance is not correct');
    expect(minTokensToReceive).lte(rewardPoolBalanceAfter, 'Reward pool balance is not correct');

    const exchangeRatioAfter = toLowBN(await rewardPoolInstance1.getCurrentPrice());
    const maxExchangeIngotsAfter = rewardPoolBalanceAfter.multipliedBy(exchangeRatioAfter);

    await rewardPoolInstance1.swapIngotsForTokens(
        ethers.ZeroAddress,
        transferableFromLowBN(maxExchangeIngotsBefore),
        transferableFromLowBN(minTokensToReceive)
    ).then((tx) => tx.wait());

    const expectedRewardPoolBalance = rewardPoolBalanceAfter.minus(maxExchangeIngotsAfter.dividedBy(exchangeRatioAfter));
    const expectedUserResourceBalance = userResourceBalance1.minus(maxExchangeIngotsAfter);
    const expectedUserTokenBalance = userTokenBalance.plus(maxExchangeIngotsAfter.dividedBy(exchangeRatioAfter));

    const actualRewardPoolBalance = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);
    const actualUserResourceBalance = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.INGOT);
    const actualUserTokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser1);

    expect(actualRewardPoolBalance).eql(expectedRewardPoolBalance, 'Reward pool balance is not correct');
    expect(actualUserResourceBalance).isInCloseRangeWith(expectedUserResourceBalance, 'User resource balance is not correct');
    expect(actualUserTokenBalance).isInCloseRangeWith(expectedUserTokenBalance, 'User token balance is not correct');
  }

  public static async impossibleRewardsExchangeByHighMinTokensToReceiveTest(){
    const { testUser1 } = await getNamedAccounts();

    const worldInstance = await WorldHelper.getWorldInstance();

    const rewardPoolAddress = await worldInstance.rewardPool();
    const rewardPoolInstance = await WorldHelper.getRewardPoolInstance(testUser1);
    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    const userResourceBalance = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.INGOT);
    const rewardPoolBalance = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);

    const exchangeRatio = toLowBN(await rewardPoolInstance.getCurrentPrice());
    const exchangeIngots = rewardPoolBalance.multipliedBy(exchangeRatio);

    expect(userResourceBalance).gte(exchangeIngots, 'User resource balance is not correct');

    await expect(
        rewardPoolInstance.swapIngotsForTokens(
            ethers.ZeroAddress,
            transferableFromLowBN(exchangeIngots),
            transferableFromLowBN(rewardPoolBalance)
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("TokensToBeReceivedLessThanMinimumRequired()");
  }

  public static async impossibleActionsAfterGameClosedTest(){
    const { testUser1 } = await getNamedAccounts();

    const unitQuantity = 1;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const buildingInstance = await SettlementHelper.getFort(userSettlementInstance);

    const worldInstance = await WorldHelper.getWorldInstance(testUser1);

    const rewardPoolAddress = await worldInstance.rewardPool();
    const rewardPoolInstance = await WorldHelper.getRewardPoolInstance(testUser1);
    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    const userResourceBalance = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.INGOT);
    const userTokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const rewardPoolBalance = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);

    const exchangeRatio = toLowBN(await rewardPoolInstance.getCurrentPrice());
    const exchangeIngots = rewardPoolBalance.multipliedBy(exchangeRatio);

    const expectedUserResourceBalance = userResourceBalance.minus(exchangeIngots);
    const expectedUserTokenBalance = userTokenBalance.plus((exchangeIngots.dividedBy(exchangeRatio)));
    const expectedRewardPoolBalance = rewardPoolBalance.minus((exchangeIngots.dividedBy(exchangeRatio)));

    //ingot exchange
    await rewardPoolInstance.swapIngotsForTokens(
      ethers.ZeroAddress,
      transferableFromLowBN(exchangeIngots.plus(1)),
      transferableFromLowBN(new BigNumber(0))
    ).then((tx) => tx.wait());

    const actualUserResourceBalance = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.INGOT);
    const actualUserTokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const actualRewardPoolBalance = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);

    expect(actualUserResourceBalance).isInCloseRangeWith(expectedUserResourceBalance, 'User resource balance is not correct');
    expect(actualUserTokenBalance).isInCloseRangeWith(expectedUserTokenBalance, 'User token balance is not correct');
    expect(actualRewardPoolBalance).eql(expectedRewardPoolBalance, 'Reward pool balance is not correct');

    await expect(
      rewardPoolInstance.swapIngotsForTokens(
          ethers.ZeroAddress,
          transferableFromLowBN(new BigNumber(1)),
          transferableFromLowBN(new BigNumber(0))
      ).then((tx) => tx.wait())
    ).to.be.revertedWith("NotEnoughTokensLeft()");

    await expect(
      buildingInstance.upgradeAdvancedProduction(ethers.ZeroAddress).then((tx) => tx.wait())
    ).to.be.revertedWith("OnlyActiveGame()");

    const army = await SettlementHelper.getArmy(userSettlementInstance);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await expect(
        UnitHelper.hireUnits(army, unitTypes, unitQuantity)
    ).to.be.revertedWith("OnlyActiveGame()");
  }

  public static async payToDecreaseCorruptionIndexTest() {
    const {testUser1} = await getNamedAccounts();

    const tokenAmount = 10;
    const corruptionIndexAmount = 1000;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const worldInstance = await WorldHelper.getWorldInstance();
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    const rewardPoolAddress = await worldInstance.rewardPool();
    const rewardPoolInstance = await WorldHelper.getRewardPoolInstance(testUser1);
    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    const settlementPayToDecreaseCorruptionIndexPenaltyMultiplier =
        toLowBN(await registryInstance.getSettlementPayToDecreaseCorruptionIndexPenaltyMultiplier());
    const resourceTypeId = ResourceHelper.getResourceTypeId(ResourceType.INGOT);
    const corruptionIndexByResource = toLowBN(await registryInstance.getCorruptionIndexByResource(resourceTypeId));
    const exchangeRatio = toLowBN(await rewardPoolInstance.getCurrentPrice());

    const userTokenBalanceBefore = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const rewardPoolBalanceBefore = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);
    const regionCorruptionIndexBefore = toLowBN(await regionInstance.corruptionIndex());

    await userSettlementInstance
        .payToDecreaseCorruptionIndex(transferableFromLowBN(new BigNumber(0)), {
          value: transferableFromLowBN(new BigNumber(tokenAmount)),
        })
        .then((tx) => tx.wait());

    const corruptionIndexAmountToReduce = new BigNumber(tokenAmount)
        .multipliedBy(exchangeRatio)
        .multipliedBy(corruptionIndexByResource)
        .multipliedBy(settlementPayToDecreaseCorruptionIndexPenaltyMultiplier);

    const expectedUserTokenBalance = userTokenBalanceBefore.minus(tokenAmount);
    const expectedRewardPoolBalance = rewardPoolBalanceBefore.plus(tokenAmount);
    const expectedRegionCorruptionIndex = regionCorruptionIndexBefore.minus(corruptionIndexAmountToReduce);

    const actualUserTokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const actualRewardPoolBalance = await TokenUtils.getTokenBalance(tokenAddress, rewardPoolAddress);
    const actualRegionCorruptionIndex = toLowBN(await regionInstance.corruptionIndex());

    expect(actualUserTokenBalance).isInCloseRangeWith(expectedUserTokenBalance, 'User token balance is not correct');
    expect(actualRewardPoolBalance).eql(expectedRewardPoolBalance, 'Reward pool balance is not correct');
    expect(actualRegionCorruptionIndex).isInCloseRangeWith(expectedRegionCorruptionIndex, 'CorruptionIndex amount is not correct');
  }

  public static async impossiblePayToDecreaseCorruptionIndexTest() {
    const {testUser1} = await getNamedAccounts();

    const tokenAmount = 10;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const worldInstance = await WorldHelper.getWorldInstance();

    const eraNumberBefore = await WorldHelper.getCurrentEraNumber();

    await CultistsHelper.summonEnoughCultistsForWipeInCurrentSettlementRegion(userSettlementInstance);

    expect(await CultistsHelper.isWipePossible()).to.be.true;
    await WorldHelper.passToEraDestructionInterval();
    await worldInstance.destroyCurrentEra().then((tx) => tx.wait());

    const eraNumberAfter = await WorldHelper.getCurrentEraNumber();
    expect(toBN(eraNumberAfter)).eql(toBN(eraNumberBefore).plus(1), 'Era number is not correct');

    await expect(
        userSettlementInstance
            .payToDecreaseCorruptionIndex(transferableFromLowBN(new BigNumber(0)), {
              value: transferableFromLowBN(new BigNumber(tokenAmount)),
            })
            .then((tx) => tx.wait())
    ).to.be.revertedWith("SettlementCannotDecreaseCorruptionIndexViaPaymentInInactiveEra()");
  }
}
