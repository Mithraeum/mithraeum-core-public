import BigNumber from "bignumber.js";
import {ethers, getNamedAccounts} from "hardhat";
import {UserHelper} from "../../shared/helpers/UserHelper";
import {expect} from "chai";
import {SharesHelper} from "../../shared/helpers/SharesHelper";
import {ResourceHelper} from "../../shared/helpers/ResourceHelper";
import {ProductionHelper} from "../../shared/helpers/ProductionHelper";
import {BuildingType} from "../../shared/enums/buildingType";
import {BuildingHelper} from "../../shared/helpers/BuildingHelper";
import {WorldHelper} from "../../shared/helpers/WorldHelper";
import {_1e18, toBN, toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import {EvmUtils} from "../../shared/helpers/EvmUtils";
import {UnitHelper} from "../../shared/helpers/UnitHelper";
import { RegionHelper } from '../../shared/helpers/RegionHelper';

export class SharesCoreTest {
  public static async sendSharesAndHarvestTest(buildingType: BuildingType, sharesAmount: number) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const assignResourceQuantity = 50;
    const assignWorkerQuantity = 3;
    const productionTime = 100000;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);
    const buildingDistributionId = await buildingInstance.distributionId();

    const producingResourceType = await ProductionHelper.getProducingResourceType(buildingInstance);

    const sharesBalanceBefore1 = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType);
    const sharesBalanceBefore2 = await SharesHelper.getShareAmount(userSettlementInstance, testUser2, buildingType);

    expect(sharesBalanceBefore1).eql(new BigNumber(100), 'Shares amount is not correct');
    expect(sharesBalanceBefore2).eql(new BigNumber(0), 'Shares amount is not correct');

    await ProductionHelper.produceResourcesForSpecifiedDuration(
        userSettlementInstance,
        buildingType,
        assignResourceQuantity,
        assignWorkerQuantity,
        productionTime
    );

    const resourceQuantityBefore1 = await ResourceHelper.getResourceQuantity(testUser1, producingResourceType);
    const resourceQuantityBefore2 = await ResourceHelper.getResourceQuantity(testUser2, producingResourceType);

    await sharesInstance.safeTransferFrom(
        testUser1,
        testUser2,
        buildingDistributionId,
        sharesAmount,
        '0x'
    ).then((tx) => tx.wait());

    const sharesBalanceAfter1 = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType);
    const sharesBalanceAfter2 = await SharesHelper.getShareAmount(userSettlementInstance, testUser2, buildingType);

    expect(sharesBalanceAfter1).eql(sharesBalanceBefore1.minus(sharesAmount), 'Shares amount is not correct');
    expect(sharesBalanceAfter2).eql(sharesBalanceBefore2.plus(sharesAmount), 'Shares amount is not correct');

    await ProductionHelper.produceResourcesForSpecifiedDuration(
        userSettlementInstance,
        buildingType,
        assignResourceQuantity,
        assignWorkerQuantity,
        productionTime
    );

    const resourceQuantityAfter1 = await ResourceHelper.getResourceQuantity(testUser1, producingResourceType);
    const resourceQuantityAfter2 = await ResourceHelper.getResourceQuantity(testUser2, producingResourceType);

    const producedResourceQuantity1 = resourceQuantityAfter1.minus(resourceQuantityBefore1);
    const producedResourceQuantity2 = resourceQuantityAfter2.minus(resourceQuantityBefore2);

    expect(producedResourceQuantity1.dividedBy(producedResourceQuantity2))
        .isInCloseRangeWith(new BigNumber(100 - sharesAmount).dividedBy(sharesAmount), 'Resource quantity is not correct');
  }

  public static async impossibleSendSharesMoreThanMaxCapTest(buildingType: BuildingType) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const sharesAmount = 110;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);
    const buildingDistributionId = await buildingInstance.distributionId();

    const sharesBalanceBefore1 = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType);
    const sharesBalanceBefore2 = await SharesHelper.getShareAmount(userSettlementInstance, testUser2, buildingType);

    expect(sharesBalanceBefore1).eql(new BigNumber(100), 'Shares amount is not correct');
    expect(sharesBalanceBefore2).eql(new BigNumber(0), 'Shares amount is not correct');

    await expect(
      sharesInstance.safeTransferFrom(
          testUser1,
          testUser2,
          buildingDistributionId,
          sharesAmount,
          '0x'
      ).then((tx) => tx.wait())
    ).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'ERC1155: insufficient balance for transfer'");
  }

  public static async returnSharesTest(buildingType: BuildingType, sharesAmount: number) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const assignResourceQuantity = 5;
    const assignWorkerQuantity = 2;
    const productionTime = 10;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);
    const buildingDistributionIdBefore = Number(await buildingInstance.distributionId());

    const sharesBalanceBefore1 = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType);
    const sharesBalanceBefore2 = await SharesHelper.getShareAmount(userSettlementInstance, testUser2, buildingType);

    expect(sharesBalanceBefore1).eql(new BigNumber(100), 'Shares amount is not correct');
    expect(sharesBalanceBefore2).eql(new BigNumber(0), 'Shares amount is not correct');

    await sharesInstance.safeTransferFrom(
        testUser1,
        testUser2,
        buildingDistributionIdBefore,
        sharesAmount,
        '0x'
    ).then((tx) => tx.wait());

    const sharesBalanceAfter1 = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType);
    const sharesBalanceAfter2 = await SharesHelper.getShareAmount(userSettlementInstance, testUser2, buildingType);

    expect(sharesBalanceAfter1).eql(sharesBalanceBefore1.minus(sharesAmount), 'Shares amount is not correct');
    expect(sharesBalanceAfter2).eql(sharesBalanceBefore2.plus(sharesAmount), 'Shares amount is not correct');

    await ProductionHelper.produceResourcesForSpecifiedDuration(
        userSettlementInstance,
        buildingType,
        assignResourceQuantity,
        assignWorkerQuantity,
        productionTime
    );

    await buildingInstance.resetDistribution().then((tx) => tx.wait());

    const buildingDistributionIdAfter = Number(await buildingInstance.distributionId());
    const actualSharesBalance1 = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType);
    const actualSharesBalance2 = await SharesHelper.getShareAmount(userSettlementInstance, testUser2, buildingType);

    expect(buildingDistributionIdAfter).gt(buildingDistributionIdBefore, 'Building distribution id is not correct');
    expect(actualSharesBalance1).eql(sharesBalanceBefore1, 'Shares amount is not correct');
    expect(actualSharesBalance2).eql(sharesBalanceBefore2, 'Shares amount is not correct');
  }

  public static async impossibleReturnSharesDueHighTreasuryAmountTest(buildingType: BuildingType, sharesAmount: number) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const assignResourceQuantity = 20;
    const assignWorkerQuantity = 3;
    const productionTime = 100000;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);
    const buildingDistributionIdBefore = await buildingInstance.distributionId();

    const sharesBalanceBefore1 = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType);
    const sharesBalanceBefore2 = await SharesHelper.getShareAmount(userSettlementInstance, testUser2, buildingType);

    expect(sharesBalanceBefore1).eql(new BigNumber(100), 'Shares amount is not correct');
    expect(sharesBalanceBefore2).eql(new BigNumber(0), 'Shares amount is not correct');

    await sharesInstance.safeTransferFrom(
        testUser1,
        testUser2,
        buildingDistributionIdBefore,
        sharesAmount,
        '0x'
    ).then((tx) => tx.wait());

    const sharesBalanceAfter1 = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType);
    const sharesBalanceAfter2 = await SharesHelper.getShareAmount(userSettlementInstance, testUser2, buildingType);

    expect(sharesBalanceAfter1).eql(sharesBalanceBefore1.minus(sharesAmount), 'Shares amount is not correct');
    expect(sharesBalanceAfter2).eql(sharesBalanceBefore2.plus(sharesAmount), 'Shares amount is not correct');

    await ProductionHelper.produceResourcesForSpecifiedDuration(
        userSettlementInstance,
        buildingType,
        assignResourceQuantity,
        assignWorkerQuantity,
        productionTime
    );

    await expect(
      buildingInstance.resetDistribution().then((tx) => tx.wait())
    ).to.be.revertedWith("DistributionResetNotAllowedWhenTreasuryThresholdNotMet()");
  }

  public static async resourceAssignByShareTest(){
    const { testUser1 } = await getNamedAccounts();

    const buildingType1 = BuildingType.FARM;
    const buildingType2 = BuildingType.LUMBERMILL;
    const sharesAmount = 40;
    const assignWorkerQuantity = 5;
    const productionTime = 100000;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const buildingInstance1 = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType1);
    const buildingInstance2 = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType2);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const ticksPerSecond = toBN(await registryInstance.getProductionTicksInSecond());

    const productionConfig = await buildingInstance1.getConfig();
    const producingResourceConfig = productionConfig.find((config) => config.isProducing);
    const producingResourceType = ResourceHelper.getResourceTypeByResourceTypeId(producingResourceConfig!.resourceTypeId);

    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);
    const buildingDistributionId = await buildingInstance1.distributionId();

    const sharesBalanceBefore = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType1);
    expect(sharesBalanceBefore).gte(new BigNumber(sharesAmount), 'Shares amount is not correct');

    await sharesInstance.safeTransferFrom(
        testUser1,
        await buildingInstance2.getAddress(),
        buildingDistributionId,
        sharesAmount,
        '0x'
    ).then((tx) => tx.wait());

    const sharesBalanceAfter = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType1);
    expect(sharesBalanceAfter).eql(sharesBalanceBefore.minus(sharesAmount), 'Shares amount is not correct');

    const userResourceQuantityBefore = await ResourceHelper.getResourceQuantity(
        testUser1,
        producingResourceType
    );

    const buildingTreasuryAmountBefore1 = await ResourceHelper.getResourceQuantity(
        await buildingInstance1.getAddress(),
        producingResourceType
    );
    const buildingTreasuryAmountBefore2 = await ResourceHelper.getResourceQuantity(
        await buildingInstance2.getAddress(),
        producingResourceType
    );

    await userSettlementInstance.assignResourcesAndWorkersToBuilding(
        ethers.ZeroAddress,
        await buildingInstance1.getAddress(),
        transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
        [],
        []
    ).then((tx) => tx.wait());

    const buildingLastUpdateStateRegionTimeBefore = toBN((await buildingInstance1.productionInfo()).lastUpdateStateRegionTime);

    await EvmUtils.increaseTime(productionTime);
    await buildingInstance1.distributeToAllShareholders().then((tx) => tx.wait());

    const buildingLastUpdateStateRegionTimeAfter = toBN((await buildingInstance1.productionInfo()).lastUpdateStateRegionTime);

    const regionTimePassed = buildingLastUpdateStateRegionTimeAfter.minus(buildingLastUpdateStateRegionTimeBefore);
    const regionTimeSecondsPassed = regionTimePassed.dividedBy(_1e18);
    const ticksPassed = regionTimeSecondsPassed.multipliedBy(ticksPerSecond);

    const maxTreasuryBalance = toLowBN(await buildingInstance1.getMaxTreasuryByLevel(2));
    const availableTreasuryBalance = maxTreasuryBalance.minus(buildingTreasuryAmountBefore1);

    const basicProductionPerTick = await ProductionHelper.getBasicProductionPerTick(userSettlementInstance, buildingType1);
    const advancedProductionPerTick = await ProductionHelper.getAdvancedProductionPerTick(
        userSettlementInstance,
        buildingType1,
        assignWorkerQuantity
    );
    const toBeBasicProducedRes = ticksPassed.multipliedBy(basicProductionPerTick);

    const toBeAdvancedProducedRes = ticksPassed.multipliedBy(advancedProductionPerTick);
    const toBeProducedRes = toBeBasicProducedRes.plus(toBeAdvancedProducedRes);

    const toReservePercent = toLowBN(await registryInstance.getToTreasuryPercent());
    const toReserveWillGo = BigNumber.min(toBeProducedRes.multipliedBy(toReservePercent), availableTreasuryBalance);
    const toWalletWillGo = toBeProducedRes.minus(toReserveWillGo);

    const userResourceQuantityAfter = await ResourceHelper.getResourceQuantity(
        testUser1,
        producingResourceType
    );

    const buildingTreasuryAmountAfter1 = await ResourceHelper.getResourceQuantity(
        await buildingInstance1.getAddress(),
        producingResourceType
    );
    const buildingTreasuryAmountAfter2 = await ResourceHelper.getResourceQuantity(
        await buildingInstance2.getAddress(),
        producingResourceType
    );

    expect(userResourceQuantityAfter).isInCloseRangeWith(
        userResourceQuantityBefore.plus(toWalletWillGo.multipliedBy(new BigNumber(100 - sharesAmount)
            .dividedBy(100))), 'User resource quantity is not correct');
    expect(buildingTreasuryAmountAfter1).eql(maxTreasuryBalance, 'Building treasury amount is not correct');
    expect(buildingTreasuryAmountAfter2).isInCloseRangeWith(
        buildingTreasuryAmountBefore2.plus(toWalletWillGo.multipliedBy(new BigNumber(sharesAmount)
            .dividedBy(100))), 'Building treasury amount is not correct');
  }

  public static async impossibleResourceAssignByShareTest(buildingType: BuildingType, sharesAmount: number){
    const { testUser1, testUser2 } = await getNamedAccounts();

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const buildingInstance1 = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance1, buildingType);
    const buildingInstance2 = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance2, buildingType);

    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);
    const buildingDistributionId = await buildingInstance1.distributionId();

    const sharesBalance = await SharesHelper.getShareAmount(userSettlementInstance1, testUser1, buildingType);
    expect(sharesBalance).gte(new BigNumber(sharesAmount));

    await expect(
        sharesInstance.safeTransferFrom(
            testUser1,
            await buildingInstance2.getAddress(),
            buildingDistributionId,
            sharesAmount,
            '0x'
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("CannotTransferDistributionSharesToBuildingOfSameBuildingType()");
  }

  public static async resourceAssignByShareWithPenaltyTest(){
    const { testUser1 } = await getNamedAccounts();

    const buildingType1 = BuildingType.FARM;
    const buildingType2 = BuildingType.LUMBERMILL;
    const sharesAmount = 40;
    const assignWorkerQuantity = 5;
    const productionTime = 100000;
    const corruptionIndexAmount = 10000;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const buildingInstance1 = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType1);
    const buildingInstance2 = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType2);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const ticksPerSecond = toBN(await registryInstance.getProductionTicksInSecond());

    const productionConfig = await buildingInstance1.getConfig();
    const producingResourceConfig = productionConfig.find((config) => config.isProducing);
    const producingResourceType = ResourceHelper.getResourceTypeByResourceTypeId(producingResourceConfig!.resourceTypeId);

    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    const buildingDistributionId = await buildingInstance1.distributionId();

    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    //cultists summon
    const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
    await EvmUtils.increaseTime(summonDelay);

    await regionInstance.updateState().then((tx) => tx.wait());

    const cultistUnitAmount = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistUnitAmount).gt(new BigNumber(0), 'Cultist amount is not correct');

    const productionRateWithPenaltyMultiplier = await ProductionHelper.getProductionRateWithPenaltyMultiplierByRegion(regionInstance);

    const sharesBalanceBefore = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType1);
    expect(sharesBalanceBefore).gte(new BigNumber(sharesAmount), 'Shares amount is not correct');

    await sharesInstance.safeTransferFrom(
        testUser1,
        await buildingInstance2.getAddress(),
        buildingDistributionId,
        sharesAmount,
        '0x'
    ).then((tx) => tx.wait());

    const sharesBalanceAfter = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType1);
    expect(sharesBalanceAfter).eql(sharesBalanceBefore.minus(sharesAmount), 'Shares amount is not correct');

    const userResourceQuantityBefore = await ResourceHelper.getResourceQuantity(
        testUser1,
        producingResourceType
    );

    const buildingTreasuryAmountBefore1 = await ResourceHelper.getResourceQuantity(
        await buildingInstance1.getAddress(),
        producingResourceType
    );
    const buildingTreasuryAmountBefore2 = await ResourceHelper.getResourceQuantity(
        await buildingInstance2.getAddress(),
        producingResourceType
    );

    await userSettlementInstance.assignResourcesAndWorkersToBuilding(
        ethers.ZeroAddress,
        await buildingInstance1.getAddress(),
        transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
        [],
        []
    ).then((tx) => tx.wait());

    const buildingLastUpdateStateRegionTimeBefore = toBN((await buildingInstance1.productionInfo()).lastUpdateStateRegionTime);

    await EvmUtils.increaseTime(productionTime);
    await buildingInstance1.distributeToAllShareholders().then((tx) => tx.wait());

    const buildingLastUpdateStateRegionTimeAfter = toBN((await buildingInstance1.productionInfo()).lastUpdateStateRegionTime);

    const regionTimePassed = buildingLastUpdateStateRegionTimeAfter.minus(buildingLastUpdateStateRegionTimeBefore);
    const regionTimeSecondsPassed = regionTimePassed.dividedBy(_1e18);
    const ticksPassed = regionTimeSecondsPassed.multipliedBy(ticksPerSecond);

    const maxTreasuryBalance = toLowBN(await buildingInstance1.getMaxTreasuryByLevel(2));
    const availableTreasuryBalance = maxTreasuryBalance.minus(buildingTreasuryAmountBefore1);

    const basicProductionPerTick = await ProductionHelper.getBasicProductionPerTick(userSettlementInstance, buildingType1);
    const advancedProductionPerTick = await ProductionHelper.getAdvancedProductionPerTick(
        userSettlementInstance,
        buildingType1,
        assignWorkerQuantity
    );
    const toBeBasicProducedRes = ticksPassed.multipliedBy(basicProductionPerTick);

    const toBeAdvancedProducedRes = ticksPassed.multipliedBy(advancedProductionPerTick);
    const toBeProducedRes = (toBeBasicProducedRes.plus(toBeAdvancedProducedRes));

    const toReservePercent = toLowBN(await registryInstance.getToTreasuryPercent());
    const toReserveWillGo = BigNumber.min(toBeProducedRes.multipliedBy(toReservePercent), availableTreasuryBalance);
    const toWalletWillGo = toBeProducedRes.minus(toReserveWillGo);

    const userResourceQuantityAfter = await ResourceHelper.getResourceQuantity(
        testUser1,
        producingResourceType
    );

    const buildingTreasuryAmountAfter1 = await ResourceHelper.getResourceQuantity(
        await buildingInstance1.getAddress(),
        producingResourceType
    );
    const buildingTreasuryAmountAfter2 = await ResourceHelper.getResourceQuantity(
        await buildingInstance2.getAddress(),
        producingResourceType
    );

    expect(userResourceQuantityAfter).isInCloseRangeWith(
        userResourceQuantityBefore.plus(toWalletWillGo.multipliedBy(new BigNumber(100 - sharesAmount)
            .dividedBy(100))), 'User resource quantity is not correct');
    expect(buildingTreasuryAmountAfter1).eql(maxTreasuryBalance, 'Building resource quantity is not correct');
    expect(buildingTreasuryAmountAfter2).isInCloseRangeWith(
        buildingTreasuryAmountBefore2.plus((toWalletWillGo.multipliedBy(new BigNumber(sharesAmount)
            .dividedBy(100))).multipliedBy(productionRateWithPenaltyMultiplier)), 'Building resource quantity is not correct');
  }
}
