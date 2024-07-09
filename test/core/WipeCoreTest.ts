import {ethers, getNamedAccounts} from "hardhat";
import {
  SettlementsMarket__factory
} from "../../typechain-types";
import { UserHelper } from "../../shared/helpers/UserHelper";
import { toBN, toLowBN, transferableFromLowBN } from "../../scripts/utils/const";
import BigNumber from "bignumber.js";
import { EvmUtils } from "../../shared/helpers/EvmUtils";
import { expect } from "chai";
import { WorldHelper } from "../../shared/helpers/WorldHelper";
import { ResourceHelper } from "../../shared/helpers/ResourceHelper";
import { TokenUtils } from "../../shared/helpers/TokenUtils";
import { ProductionHelper } from "../../shared/helpers/ProductionHelper";
import { DEFAULT_BANNER_NAME } from "../../shared/constants/banners";
import { UnitHelper } from "../../shared/helpers/UnitHelper";
import { ensureSettlementCreated } from "../../shared/fixtures/common/ensureSettlementCreated";
import {BuildingType} from "../../shared/enums/buildingType";
import {ONE_WEEK_IN_SECONDS} from "../../shared/constants/time";
import { CultistsHelper } from '../../shared/helpers/CultistsHelper';
import { RegionHelper } from '../../shared/helpers/RegionHelper';

export class WipeCoreTest {
  public static async worldWipeDueCultistsMaxCapWithExchangeRatioTest() {
    const { testUser1 } = await getNamedAccounts();

    const exchangeIngots = new BigNumber(100);
    const regionNumber = 1;

    const worldInstance = await WorldHelper.getWorldInstance();

    const rewardPoolInstance = await WorldHelper.getRewardPoolInstance(testUser1);
    const eraNumberBefore = await WorldHelper.getCurrentEraNumber();
    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    //exchange before wipe
    const userTokenBalanceBeforeSwapDuringFirstEra = await TokenUtils.getTokenBalance(tokenAddress, testUser1);

    await rewardPoolInstance.swapIngotsForTokens(
        ethers.ZeroAddress,
        transferableFromLowBN(exchangeIngots),
        transferableFromLowBN(new BigNumber(0))
    ).then((tx) => tx.wait());

    const userTokenBalanceAfterSwapDuringFirstEra = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const userTokenBalanceBySwapDuringFirstEra = userTokenBalanceAfterSwapDuringFirstEra
        .minus(userTokenBalanceBeforeSwapDuringFirstEra);

    const regionTierBeforeSummon = await RegionHelper.getRegionTierByNumber(regionNumber);

    await CultistsHelper.summonEnoughCultistsForWipeInCurrentSettlementRegion(userSettlementInstance);

    const regionTierAfterSummon = await RegionHelper.getRegionTierByNumber(regionNumber);
    expect(regionTierAfterSummon).eql(regionTierBeforeSummon, 'Region tier is not correct');

    const gameResources = await WorldHelper.getGameResources();
    const resourceTypes = gameResources.map(gameResources => ResourceHelper.getResourceTypeByResourceTypeId(gameResources));
    const resourcesBefore = await ResourceHelper.getResourcesQuantity(testUser1, resourceTypes);

    for (let i = 0; i < resourceTypes.length; i++) {
      expect(resourcesBefore[resourceTypes[i]]).not.to.eql(new BigNumber(0), 'Resource quantity is not correct');
    }

    const exchangeRatioBefore = toLowBN(await rewardPoolInstance.getCurrentPrice());

    await EvmUtils.increaseTime(2 * ONE_WEEK_IN_SECONDS); // +50% in 2 weeks

    const exchangeRatioAfter = toLowBN(await rewardPoolInstance.getCurrentPrice());
    expect(exchangeRatioAfter).isInCloseRangeWith(
        exchangeRatioBefore.plus(exchangeRatioBefore.multipliedBy(0.5)), 'Exchange ratio is not correct');

    expect(await CultistsHelper.isWipePossible()).to.be.true;
    await WorldHelper.passToEraDestructionInterval();
    await worldInstance.destroyCurrentEra().then((tx) => tx.wait());

    const resourcesAfter = await ResourceHelper.getResourcesQuantity(testUser1, resourceTypes);

    for (let i = 0; i < resourceTypes.length; i++) {
      expect(resourcesAfter[resourceTypes[i]]).eql(new BigNumber(0), 'Resource quantity is not correct');
    }

    const eraNumberAfter = await WorldHelper.getCurrentEraNumber();
    expect(toBN(eraNumberAfter)).eql(toBN(eraNumberBefore).plus(1), 'Era number is not correct');

    const resourceIds = await WorldHelper.getGameResources();

    //resource mint
    for (let i = 0; i < resourceIds.length; i++) {
      await WorldHelper.mintResource(resourceIds[i], transferableFromLowBN(exchangeIngots), testUser1);
    }

    //exchange after wipe
    const userTokenBalanceBeforeSwapDuringSecondEra = await TokenUtils.getTokenBalance(tokenAddress, testUser1);

    await rewardPoolInstance.swapIngotsForTokens(
        ethers.ZeroAddress,
        transferableFromLowBN(exchangeIngots),
        transferableFromLowBN(new BigNumber(0))
    ).then((tx) => tx.wait());

    const userTokenBalanceAfterSwapDuringSecondEra = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const userTokenBalanceBySwapDuringSecondEra = userTokenBalanceAfterSwapDuringSecondEra.minus(userTokenBalanceBeforeSwapDuringSecondEra);

    expect(userTokenBalanceBySwapDuringSecondEra).isInCloseRangeWith(
        userTokenBalanceBySwapDuringFirstEra.multipliedBy(2), 'User token balance is not correct');
  }

  public static async impossibleWorldWipeDueCultistsMaxCapTest() {
    const { testUser1 } = await getNamedAccounts();

    const corruptionIndexAmount = 100;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const worldInstance = await WorldHelper.getWorldInstance();

    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    //cultists summon
    const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
    await EvmUtils.increaseTime(summonDelay);

    await regionInstance.updateState().then((tx) => tx.wait());

    expect(await CultistsHelper.isWipePossible()).to.be.false;
    await WorldHelper.passToEraDestructionInterval();
    await expect(
      worldInstance.destroyCurrentEra().then((tx) => tx.wait())
    ).to.be.revertedWith("CurrentEraCannotBeDestroyedDueCultistsLimitNotReached()");
  }

  public static async impossibleWorldWipeDuringDestructionDelayTest() {
    const { testUser1 } = await getNamedAccounts();

    const worldInstance = await WorldHelper.getWorldInstance();
    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    await CultistsHelper.summonEnoughCultistsForWipeInCurrentSettlementRegion(userSettlementInstance);

    expect(await CultistsHelper.isWipePossible()).to.be.true;
    await expect(
      worldInstance.destroyCurrentEra().then((tx) => tx.wait())
    ).to.be.revertedWith("CurrentEraCannotBeDestroyedDueToCultistsNoDestructionDelayNotPassed()");
  }

  public static async cultistSummonTest() {
    const { testUser1 } = await getNamedAccounts();

    const corruptionIndexAmount = 1000;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    const regionCorruptionIndex = toLowBN(await regionInstance.corruptionIndex());
    const cultistUnitAmountBefore = await UnitHelper.getCultistQuantity(regionInstance);

    //cultists summon
    const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
    await EvmUtils.increaseTime(summonDelay);

    await regionInstance.updateState().then((tx) => tx.wait());

    const cultistUnitAmountAfter = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistUnitAmountAfter).gt(new BigNumber(0), 'Cultist amount is not correct');

    const expectedSummonedCultists = ((regionCorruptionIndex.dividedBy(10)).minus(cultistUnitAmountBefore.dividedBy(2)))
        .integerValue(BigNumber.ROUND_FLOOR);
    const actualSummonedCultists = cultistUnitAmountAfter.minus(cultistUnitAmountBefore);
    expect(actualSummonedCultists).eql(expectedSummonedCultists, 'Cultist amount is not correct');
  }

  public static async impossibleCultistSummonDuringSummonDelayTest() {
    const { testUser1 } = await getNamedAccounts();

    const corruptionIndexAmount = 100;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const summonDelay = Number(await registryInstance.getCultistsSummonDelay());

    const timeBefore = await EvmUtils.getCurrentTime();
    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    const timeAfter = await EvmUtils.getCurrentTime();
    const passedTime = timeAfter - timeBefore;

    const cultistUnitAmountBefore = await UnitHelper.getCultistQuantity(regionInstance);

    expect(passedTime).lt(summonDelay);

    await regionInstance.updateState().then((tx) => tx.wait());

    const cultistUnitAmountAfter = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistUnitAmountAfter).eql(cultistUnitAmountBefore, 'Cultist amount is not correct');
  }

  public static async cultistSummonRepeatDuringCurrentIntervalTest() {
    const { testUser1 } = await getNamedAccounts();

    const corruptionIndexAmount = 100;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const summonDelay = Number(await registryInstance.getCultistsSummonDelay());

    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    await EvmUtils.increaseTime(summonDelay);
    await regionInstance.updateState().then((tx) => tx.wait());

    const cultistUnitAmountBeforeRepeatedToxicityIncrease = await UnitHelper.getCultistQuantity(regionInstance);

    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    await regionInstance.updateState().then((tx) => tx.wait());

    const cultistUnitAmountAfterRepeatedToxicityIncrease = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistUnitAmountAfterRepeatedToxicityIncrease)
        .eql(cultistUnitAmountBeforeRepeatedToxicityIncrease, 'Cultist amount is not correct');

    await EvmUtils.increaseTime(summonDelay);
    await regionInstance.updateState().then((tx) => tx.wait());

    const cultistUnitAmountAfterSummonDelay = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistUnitAmountAfterSummonDelay)
        .gt(cultistUnitAmountAfterRepeatedToxicityIncrease, 'Cultist amount is not correct');
  }

  public static async settlementCostAfterWipeTest() {
    const {testUser4} = await getNamedAccounts();

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser4, 1);

    const worldInstance = await WorldHelper.getWorldInstance();

    const regionId = await RegionHelper.getRegionIdByNumber(1);
    const regionInstance = await RegionHelper.getRegionInstanceById(regionId);

    const eraNumberBefore = await worldInstance.currentEraNumber();
    const settlementCostBefore = await RegionHelper.getNewSettlementCostByRegion(regionInstance);

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

    expect(await CultistsHelper.isWipePossible()).to.be.true;
    await WorldHelper.passToEraDestructionInterval();

    const settlementCostAfter = await RegionHelper.getNewSettlementCostByRegion(regionInstance);
    expect(settlementCostAfter).gt(new BigNumber(0), 'Settlement cost is not correct');
    expect(settlementCostAfter).lt(settlementCostBefore, 'Settlement cost is not correct');

    await worldInstance.destroyCurrentEra().then((tx) => tx.wait());

    const eraNumberAfter = await WorldHelper.getCurrentEraNumber();
    expect(toBN(eraNumberAfter)).eql(toBN(eraNumberBefore).plus(1), 'Era number is not correct');

    const eraInstanceAfter = await WorldHelper.getCurrentEraInstance();
    await eraInstanceAfter.activateRegion(regionId).then((tx) => tx.wait());

    const regionInstanceAfter = await RegionHelper.getRegionInstanceById(regionId);

    const actualSettlementCost = await RegionHelper.getNewSettlementCostByRegion(regionInstanceAfter)
    expect(actualSettlementCost).isInCloseRangeWith(settlementCostAfter, 'Settlement cost is not correct');
  }

  public static async settlementRestoreWithRegionActivationAfterWipeTest() {
    const { testUser1 } = await getNamedAccounts();

    const position = await RegionHelper.getPositionForSettlementInRegionByNumber(1, 4);
    const regionId = await RegionHelper.getRegionIdByPosition(position);

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const worldInstance = await WorldHelper.getWorldInstance();
    const eraNumberBefore = await WorldHelper.getCurrentEraNumber();

    await CultistsHelper.summonEnoughCultistsForWipeInCurrentSettlementRegion(userSettlementInstance);

    await ensureSettlementCreated(testUser1, position, DEFAULT_BANNER_NAME);

    const settlementEraBefore = await userSettlementInstance.eraNumber();
    expect(toBN(settlementEraBefore)).eql(toBN(eraNumberBefore), 'Era number is not correct');

    expect(await CultistsHelper.isWipePossible()).to.be.true;
    await WorldHelper.passToEraDestructionInterval();
    await worldInstance.destroyCurrentEra().then((tx) => tx.wait());

    const eraNumberAfter = await WorldHelper.getCurrentEraNumber();
    expect(toBN(eraNumberAfter)).eql(toBN(eraNumberBefore).plus(1), 'Era number is not correct');

    const eraAddressAfter = await worldInstance.eras(eraNumberAfter);
    const eraViewInstance = await WorldHelper.getEraViewInstance();

    await eraViewInstance.restoreSettlementWithRegionActivation(
        eraAddressAfter,
        position,
        regionId
    ).then((tx) => tx.wait());

    const userSettlementInstanceAfter = await UserHelper.getUserSettlementByNumber(testUser1, 2);
    const settlementEraAfter = await userSettlementInstanceAfter.eraNumber();
    expect(toBN(settlementEraAfter)).eql(toBN(eraNumberAfter), 'Era number is not correct');
  }

  public static async impossibleSettlementPurchaseAfterWipeTest(){
    const { testUser1 } = await getNamedAccounts();
    const signer = await ethers.getSigner(testUser1);

    const position = await RegionHelper.getPositionForSettlementInRegionByNumber(1, 4);
    const regionId = await RegionHelper.getRegionIdByPosition(position);
    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const worldInstance = await WorldHelper.getWorldInstance();

    const regionInstance = await RegionHelper.getRegionInstanceById(regionId);
    const eraNumberBefore = await WorldHelper.getCurrentEraNumber();

    await CultistsHelper.summonEnoughCultistsForWipeInCurrentSettlementRegion(userSettlementInstance);

    expect(await CultistsHelper.isWipePossible()).to.be.true;
    await WorldHelper.passToEraDestructionInterval();
    await worldInstance.destroyCurrentEra().then((tx) => tx.wait());

    const eraNumberAfter = await WorldHelper.getCurrentEraNumber();
    expect(toBN(eraNumberAfter)).eql(toBN(eraNumberBefore).plus(1), 'Era number is not correct');

    const settlementsMarketAddress = await regionInstance.settlementsMarket();
    const settlementsMarketInstance = SettlementsMarket__factory.connect(settlementsMarketAddress, signer);

    await UserHelper.mintBanner(testUser1, DEFAULT_BANNER_NAME);

    const userBanners = await UserHelper.getUserBanners(testUser1);
    const lastBannerIndex = userBanners.length - 1;

    const settlementCost = toLowBN(await settlementsMarketInstance.getNewSettlementCost(0));

    await expect(
      settlementsMarketInstance
        .buySettlement(
          position,
          userBanners[lastBannerIndex].toString(),
          ethers.MaxUint256.toString(),
          {value: transferableFromLowBN(settlementCost)}
        )
        .then((tx) => tx.wait())
    ).to.be.revertedWith("OnlyWorldAssetFromActiveEra()");
  }

  public static async cultistsAmountRestoreAfterWipeTest() {
    const {testUser1} = await getNamedAccounts();

    const worldInstance = await WorldHelper.getWorldInstance();

    const regionId = await RegionHelper.getRegionIdByNumber(1);
    const regionInstance = await RegionHelper.getRegionInstanceById(regionId);
    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const cultistsAmountBefore = await UnitHelper.getCultistQuantity(regionInstance);

    await CultistsHelper.summonEnoughCultistsForWipeInCurrentSettlementRegion(userSettlementInstance);

    const enoughCultistsForWipe = await CultistsHelper.getEnoughCultistsForWipe();
    const totalCultistsAmount = await CultistsHelper.getTotalCultistsAmount();
    expect(totalCultistsAmount).gte(enoughCultistsForWipe, 'Cultist amount is not correct');
    expect(totalCultistsAmount).gt(cultistsAmountBefore, 'Cultist amount is not correct');

    await WorldHelper.passToEraDestructionInterval();
    await worldInstance.destroyCurrentEra().then((tx) => tx.wait());

    const eraInstance = await WorldHelper.getCurrentEraInstance();
    await eraInstance.activateRegion(regionId).then((tx) => tx.wait());

    const actualCultistsAmount = await UnitHelper.getCultistQuantity(await RegionHelper.getRegionInstanceById(regionId));
    expect(actualCultistsAmount).eql(cultistsAmountBefore, 'Cultist amount is not correct');
  }
}
