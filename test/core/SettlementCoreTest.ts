import {getNamedAccounts} from "hardhat";
import {expect} from "chai";
import {EvmUtils} from "../../shared/helpers/EvmUtils";
import {DEFAULT_BANNER_NAME} from "../../shared/constants/banners";
import {TokenUtils} from "../../shared/helpers/TokenUtils";
import {WorldHelper} from "../../shared/helpers/WorldHelper";
import {ONE_DAY_IN_SECONDS, ONE_HOUR_IN_SECONDS} from "../../shared/constants/time";
import {ensureSettlementCreated} from "../../shared/fixtures/common/ensureSettlementCreated";
import {toBN, toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import BigNumber from "bignumber.js";
import {UserHelper} from "../../shared/helpers/UserHelper";
import { CultistsHelper } from '../../shared/helpers/CultistsHelper';
import { RegionHelper } from '../../shared/helpers/RegionHelper';

export class SettlementCoreTest {
  public static async settlementPurchaseWithPriceDropTest() {
    const { testUser1 } = await getNamedAccounts();

    const position = await RegionHelper.getPositionForSettlementInRegionByNumber(1, 1);
    const priceDropTime = ONE_HOUR_IN_SECONDS;

    const worldInstance = await WorldHelper.getWorldInstance();
    const regionId = await RegionHelper.getRegionIdByPosition(position);
    const regionInstance = await RegionHelper.getRegionInstanceById(regionId);

    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    //price drop before settlement purchase
    const [settlementCostBeforeFirstDrop, timeBeforeFirstDrop] = await Promise.all([
      RegionHelper.getNewSettlementCostByRegion(regionInstance),
      EvmUtils.getCurrentTime()
    ]);

    await EvmUtils.increaseTime(priceDropTime);

    const [actualSettlementCostAfterFirstDrop, timeAfterFirstDrop] = await Promise.all([
      RegionHelper.getNewSettlementCostByRegion(regionInstance),
      EvmUtils.getCurrentTime()
    ]);


    const timePassedDuringFirstDrop = timeAfterFirstDrop - timeBeforeFirstDrop;

    const expectedSettlementCostAfterFirstDrop = settlementCostBeforeFirstDrop.minus(settlementCostBeforeFirstDrop.dividedBy(
        ONE_HOUR_IN_SECONDS).multipliedBy(timePassedDuringFirstDrop).multipliedBy(0.1));
    expect(actualSettlementCostAfterFirstDrop)
        .isInCloseRangeWith(expectedSettlementCostAfterFirstDrop, 'Settlement cost is not correct');

    //settlement purchase
    const tokenBalanceBefore = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const settlementCost = await RegionHelper.getNewSettlementCostByRegion(regionInstance);

    await UserHelper.mintBanner(testUser1, DEFAULT_BANNER_NAME);
    await RegionHelper.buySettlement(testUser1, regionId, position, settlementCost, settlementCost);

    const expectedTokenBalance = tokenBalanceBefore.minus(settlementCost);

    const actualTokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    expect(actualTokenBalance).isInCloseRangeWith(expectedTokenBalance, 'User token balance is not correct');

    //price drop after settlement purchase
    const [settlementCostBeforeSecondDrop, timeBeforeSecondDrop] = await Promise.all([
      RegionHelper.getNewSettlementCostByRegion(regionInstance),
      EvmUtils.getCurrentTime()
    ]);

    expect(settlementCostBeforeSecondDrop)
        .isInCloseRangeWith(settlementCost.plus(settlementCost.multipliedBy(0.3)), 'Settlement cost is not correct');

    await EvmUtils.increaseTime(priceDropTime);

    const [actualSettlementCostAfterSecondDrop, timeAfterSecondDrop] = await Promise.all([
      RegionHelper.getNewSettlementCostByRegion(regionInstance),
      EvmUtils.getCurrentTime()
    ]);

    const timePassedDuringSecondDrop = timeAfterSecondDrop - timeBeforeSecondDrop;

    const expectedSettlementCostAfterSecondDrop = settlementCostBeforeSecondDrop.minus((settlementCostBeforeSecondDrop.dividedBy(
        ONE_HOUR_IN_SECONDS).multipliedBy(timePassedDuringSecondDrop).multipliedBy(0.1)).multipliedBy(0.9));
    expect(actualSettlementCostAfterSecondDrop)
        .isInCloseRangeWith(expectedSettlementCostAfterSecondDrop, 'Settlement cost is not correct');
  }

  public static async impossibleSettlementPurchaseNotInAcceptableRadiusTest() {
    const { testUser1 } = await getNamedAccounts();

    const regionId = await RegionHelper.getRegionIdByNumber(1);

    // Move from first cultists settlement 4 positions right
    const position = regionId + 4n;

    await expect(
        ensureSettlementCreated(testUser1, position, DEFAULT_BANNER_NAME)
    ).to.be.revertedWith("UserSettlementCannotBeCreatedOnPositionWhichIsNotConnectedToAnotherSettlement()");
  }

  public static async impossibleSettlementPurchaseWithoutMoneyTest() {
    const { testUser1 } = await getNamedAccounts();

    const position = await RegionHelper.getPositionForSettlementInRegionByNumber(1, 1);

    const worldInstance = await WorldHelper.getWorldInstance();
    const regionId = await RegionHelper.getRegionIdByPosition(position);
    const regionInstance = await RegionHelper.getRegionInstanceById(regionId);
    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    const tokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const settlementStartingCost = await RegionHelper.getNewSettlementCostByRegion(regionInstance);

    //tokens burn
    await EvmUtils.decreaseBalance(testUser1, (tokenBalance.minus(settlementStartingCost.dividedBy(2)))
        .integerValue(BigNumber.ROUND_DOWN));

    //banner mint
    await UserHelper.mintBanner(testUser1, DEFAULT_BANNER_NAME);

    const tokenBalanceBefore = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const settlementCostBefore = await RegionHelper.getNewSettlementCostByRegion(regionInstance);
    expect(tokenBalanceBefore).lt(settlementCostBefore, 'User token balance is not correct');

    try {
      await RegionHelper.buySettlement(testUser1, regionId, position, settlementCostBefore, settlementCostBefore)
    }
    catch (err: any) {
      expect(err.message).to.have.string("Sender doesn't have enough funds to send tx");
    }
  }

  public static async impossibleSettlementPurchaseWithLowMaxTokenToUseTest() {
    const { testUser1 } = await getNamedAccounts();

    const position = await RegionHelper.getPositionForSettlementInRegionByNumber(1, 1);

    const regionId = await RegionHelper.getRegionIdByPosition(position);
    const regionInstance = await RegionHelper.getRegionInstanceById(regionId);

    await UserHelper.mintBanner(testUser1, DEFAULT_BANNER_NAME);

    const settlementCost = await RegionHelper.getNewSettlementCostByRegion(regionInstance);

    await expect(
        RegionHelper.buySettlement(testUser1, regionId, position, settlementCost.minus(1), settlementCost)
    ).to.be.revertedWith("SettlementCannotBeBoughtDueToCostIsHigherThanMaxTokensToUseSpecified()");
  }

  public static async impossibleSettlementPurchaseWithFullRegionTest() {
    const { testUser1 } = await getNamedAccounts();

    const position = await RegionHelper.getPositionForSettlementInRegionByNumber(1, 41);

    await expect(
        ensureSettlementCreated(testUser1, position, DEFAULT_BANNER_NAME)
    ).to.be.revertedWith("UserSettlementCannotBeCreatedInRegionWithMaximumAllowedSettlements()");
  }

  public static async settlementPurchaseInDifferentRegionTest() {
    const { testUser1 } = await getNamedAccounts();

    const position = await RegionHelper.getPositionForSettlementInRegionByNumber(2, 2);

    const worldInstance = await WorldHelper.getWorldInstance();
    const regionId = await RegionHelper.getRegionIdByPosition(position);
    const regionInstance = await RegionHelper.getRegionInstanceById(regionId);
    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    const tokenBalanceBefore = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const settlementCost = await RegionHelper.getNewSettlementCostByRegion(regionInstance);

    await UserHelper.mintBanner(testUser1, DEFAULT_BANNER_NAME);
    await RegionHelper.buySettlement(testUser1, regionId, position, settlementCost, settlementCost);

    const expectedTokenBalance = tokenBalanceBefore.minus(settlementCost);
    const expectedSettlementCost = settlementCost.multipliedBy(1.3);

    const actualTokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    expect(actualTokenBalance).isInCloseRangeWith(expectedTokenBalance, 'User token balance is not correct');

    const actualSettlementCost = await RegionHelper.getNewSettlementCostByRegion(regionInstance);
    expect(actualSettlementCost).isInCloseRangeWith(expectedSettlementCost, 'Settlement cost is not correct');
  }

  public static async settlementCostBeforeGameStartedTest() {
    const regionId = await RegionHelper.getRegionIdByNumber(1);
    const regionInstance = await RegionHelper.getRegionInstanceById(regionId);

    const settlementCost = await RegionHelper.getNewSettlementCostByRegion(regionInstance);

    await EvmUtils.increaseTime(100);

    const settlementCostBeforeStart = await RegionHelper.getNewSettlementCostByRegion(regionInstance);
    expect(settlementCostBeforeStart).eql(settlementCost, 'Settlement cost is not correct');

    await EvmUtils.increaseTime(ONE_DAY_IN_SECONDS);

    const settlementCostAfterStart = await RegionHelper.getNewSettlementCostByRegion(regionInstance);
    expect(settlementCostAfterStart).lt(settlementCostBeforeStart, 'Settlement cost is not correct');
  }

  public static async settlementPurchaseAfterDestroyTest() {
    const {testUser4} = await getNamedAccounts();

    const worldInstance = await WorldHelper.getWorldInstance();

    const position = await RegionHelper.getPositionForSettlementInRegionByNumber(1, 1);
    const regionId = await RegionHelper.getRegionIdByPosition(position);
    const regionInstance = await RegionHelper.getRegionInstanceById(regionId);
    const eraNumberBefore = await WorldHelper.getCurrentEraNumber();

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser4, 1);

    await WorldHelper.mintWorkers(
        transferableFromLowBN(new BigNumber(10)),
        await userSettlementInstance.getAddress()
    );

    const resourcesAmount = 5000000;
    const resourceIds = await WorldHelper.getGameResources();

    for (let i = 0; i < resourceIds.length; i++) {
      await WorldHelper.mintResource(
          resourceIds[i],
          transferableFromLowBN(new BigNumber(resourcesAmount)),
          testUser4
      );
    }

    await CultistsHelper.summonEnoughCultistsForWipeInCurrentSettlementRegion(userSettlementInstance);

    const producedCorruptionIndex = toLowBN(await userSettlementInstance.producedCorruptionIndex());
    expect(producedCorruptionIndex).gt(new BigNumber(0), 'CorruptionIndex amount is not correct');

    expect(await CultistsHelper.isWipePossible()).to.be.true;
    await WorldHelper.passToEraDestructionInterval();
    await worldInstance.destroyCurrentEra().then((tx) => tx.wait());

    const eraNumberAfter = await WorldHelper.getCurrentEraNumber();
    expect(toBN(eraNumberAfter)).eql(toBN(eraNumberBefore).plus(1), 'Era number is not correct');

    expect(await userSettlementInstance.isRottenSettlement()).to.be.true;

    const currentEraInstance = await WorldHelper.getCurrentEraInstance();
    await currentEraInstance.activateRegion(regionId);

    const [settlementCostBeforeFirstDrop, timeBeforeFirstDrop] = await Promise.all([
      RegionHelper.getNewSettlementCostByRegion(regionInstance),
      EvmUtils.getCurrentTime()
    ]);

    await EvmUtils.increaseTime(ONE_HOUR_IN_SECONDS);

    const [actualSettlementCostAfterFirstDrop, timeAfterFirstDrop] = await Promise.all([
      RegionHelper.getNewSettlementCostByRegion(regionInstance),
      EvmUtils.getCurrentTime()
    ]);

    const timePassedDuringFirstDrop = timeAfterFirstDrop - timeBeforeFirstDrop;

    await userSettlementInstance.destroyRottenSettlement().then((tx) => tx.wait());

    const [settlementCostBeforeSecondDrop, timeBeforeSecondDrop] = await Promise.all([
      RegionHelper.getNewSettlementCostByRegion(regionInstance),
      EvmUtils.getCurrentTime()
    ]);

    await EvmUtils.increaseTime(ONE_HOUR_IN_SECONDS);

    const [actualSettlementCostAfterSecondDrop, timeAfterSecondDrop] = await Promise.all([
      RegionHelper.getNewSettlementCostByRegion(regionInstance),
      EvmUtils.getCurrentTime()
    ]);

    const timePassedDuringSecondDrop = timeAfterSecondDrop - timeBeforeSecondDrop;

    const firstPriceDrop = (settlementCostBeforeFirstDrop.minus(actualSettlementCostAfterFirstDrop)).dividedBy(timePassedDuringFirstDrop);
    const secondPriceDrop = (settlementCostBeforeSecondDrop.minus(actualSettlementCostAfterSecondDrop)).dividedBy(timePassedDuringSecondDrop);
    expect(secondPriceDrop).isInCloseRangeWith(firstPriceDrop.multipliedBy(1.1), 'Price drop is not correct');

    await ensureSettlementCreated(testUser4, position, DEFAULT_BANNER_NAME);
  }

  public static async impossibleSettlementPurchaseWithoutDestroyTest() {
    const {testUser1} = await getNamedAccounts();

    const position = await RegionHelper.getPositionForSettlementInRegionByNumber(1, 1);

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const worldInstance = await WorldHelper.getWorldInstance();

    const regionId = await RegionHelper.getRegionIdByPosition(position);
    const eraNumberBefore = await WorldHelper.getCurrentEraNumber();

    await CultistsHelper.summonEnoughCultistsForWipeInCurrentSettlementRegion(userSettlementInstance);

    expect(await CultistsHelper.isWipePossible()).to.be.true;
    await WorldHelper.passToEraDestructionInterval();
    await worldInstance.destroyCurrentEra().then((tx) => tx.wait());

    const eraNumberAfter = await WorldHelper.getCurrentEraNumber();
    expect(toBN(eraNumberAfter)).eql(toBN(eraNumberBefore).plus(1), 'Era number is not correct');

    expect(await userSettlementInstance.isRottenSettlement()).to.be.true;

    const currentEraInstance = await WorldHelper.getCurrentEraInstance();
    await currentEraInstance.activateRegion(regionId);

    await expect(
        ensureSettlementCreated(testUser1, position, DEFAULT_BANNER_NAME)
    ).to.be.revertedWith("UserSettlementCannotBeCreatedOnPositionWithAnotherSettlement()");
  }
}
