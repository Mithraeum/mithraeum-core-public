import {ethers, getNamedAccounts} from "hardhat";
import {UserHelper} from "../../shared/helpers/UserHelper";
import {expect} from "chai";
import {_1e18, toBN, toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import {EvmUtils} from "../../shared/helpers/EvmUtils";
import BigNumber from "bignumber.js";
import {WorldHelper} from "../../shared/helpers/WorldHelper";
import {BuildingType} from "../../shared/enums/buildingType";
import {ResourceHelper} from "../../shared/helpers/ResourceHelper";
import {ProductionHelper} from "../../shared/helpers/ProductionHelper";
import {BuildingHelper} from "../../shared/helpers/BuildingHelper";
import {UnitHelper} from "../../shared/helpers/UnitHelper";
import {ONE_DAY_IN_SECONDS} from "../../shared/constants/time";
import {ensureSettlementCreated} from "../../shared/fixtures/common/ensureSettlementCreated";
import {DEFAULT_BANNER_NAME} from "../../shared/constants/banners";
import { ProsperityHelper } from '../../shared/helpers/ProsperityHelper';
import { RegionHelper } from '../../shared/helpers/RegionHelper';

export class ProductionCoreTest {
    public static async productionTest(assignWorkerQuantity: number, buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        const assignResourceQuantity = 100;
        const productionTime = 100;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const registryInstance = await WorldHelper.getRegistryInstance();
        const ticksPerSecond = toBN(await registryInstance.getProductionTicksInSecond());

        const productionConfig = await buildingInstance.getConfig();
        const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);
        const producingResourceConfig = productionConfig.find((config) => config.isProducing);
        const producingResourceType = ResourceHelper.getResourceTypeByResourceTypeId(producingResourceConfig!.resourceTypeId);
        expect(producingResourceConfig).to.exist;

        const buildingResourceQuantityBeforeBasicProduction = await ResourceHelper.getResourceStateBalanceOf(
          await buildingInstance.getAddress(),
          producingResourceType
        );

        const userResourceQuantityBeforeBasicProduction = await ResourceHelper.getResourceQuantity(
          testUser1,
          producingResourceType
        );

        const buildingLastUpdateStateRegionTimeBefore = toBN((await buildingInstance.productionInfo()).lastUpdateStateRegionTime);

        await EvmUtils.increaseTime(productionTime);
        await buildingInstance.distributeToAllShareholders().then((tx) => tx.wait());

        const buildingLastUpdateStateRegionTimeAfter = toBN((await buildingInstance.productionInfo()).lastUpdateStateRegionTime);

        const buildingResourceQuantityAfterBasicProduction = await ResourceHelper.getResourceStateBalanceOf(
          await buildingInstance.getAddress(),
          producingResourceType
        );

        const userResourceQuantityAfterBasicProduction = await ResourceHelper.getResourceQuantity(
          testUser1,
          producingResourceType
        );

        const regionTimePassedDuringBasicProduction = buildingLastUpdateStateRegionTimeAfter.minus(buildingLastUpdateStateRegionTimeBefore);
        const regionTimeSecondsPassedDuringBasicProduction = regionTimePassedDuringBasicProduction.dividedBy(_1e18);
        const ticksPassedDuringBasicProduction = regionTimeSecondsPassedDuringBasicProduction.multipliedBy(ticksPerSecond);

        const basicProductionPerTick = await ProductionHelper.getBasicProductionPerTick(userSettlementInstance, buildingType);
        const toBeBasicProducedRes = ticksPassedDuringBasicProduction.multipliedBy(basicProductionPerTick);

        const basicProducedRes = (buildingResourceQuantityAfterBasicProduction.plus(userResourceQuantityAfterBasicProduction)).minus(
          (buildingResourceQuantityBeforeBasicProduction.plus(userResourceQuantityBeforeBasicProduction)));
        expect(basicProducedRes).eql(toBeBasicProducedRes, 'Resource quantity is not correct');

        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
          ethers.ZeroAddress,
          await buildingInstance.getAddress(),
          transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
          spendingResourceConfigs.map((value) => value.resourceTypeId),
          spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
        ).then((tx) => tx.wait());

        const spendingResourceQuantityBeforeAdvancedProduction = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        const buildingLastUpdateStateRegionTimeBeforeInvestment = toBN((await buildingInstance.productionInfo()).lastUpdateStateRegionTime);

        await EvmUtils.increaseTime(productionTime);

        const spendingResourceBalance = await ResourceHelper.getResourcesStateBalanceOf(
            await buildingInstance.getAddress(),
            spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        const minTicks = BigNumber.min(
            ...spendingResourceConfigs.map(value => {
                const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId);
                return spendingResourceBalance[resourceType].dividedToIntegerBy(toLowBN(value.amountPerTick));
            })
        );

        await buildingInstance.distributeToAllShareholders().then((tx) => tx.wait());

        const buildingLastUpdateStateRegionTimeAfterInvestment = toBN((await buildingInstance.productionInfo()).lastUpdateStateRegionTime);

        const regionTimePassedFromInvestment = buildingLastUpdateStateRegionTimeAfterInvestment.minus(buildingLastUpdateStateRegionTimeBeforeInvestment);
        const regionTimeSecondsPassedFromInvestment = regionTimePassedFromInvestment.dividedBy(_1e18);
        const ticksPassedFromInvestment = regionTimeSecondsPassedFromInvestment.multipliedBy(ticksPerSecond);

        const toBeProducedTicks = buildingType === BuildingType.FARM
            ? ticksPassedFromInvestment
            : BigNumber.min(ticksPassedFromInvestment, minTicks);
        const advancedProductionPerTick = await ProductionHelper.getAdvancedProductionPerTick(
            userSettlementInstance,
            buildingType,
            assignWorkerQuantity
        );
        const toBeAdvancedProducedRes = toBeProducedTicks.multipliedBy(advancedProductionPerTick);

        const regionTimePassedDuringAllTime = buildingLastUpdateStateRegionTimeAfterInvestment
            .minus(buildingLastUpdateStateRegionTimeBefore);
        const regionTimeSecondsPassedDuringAllTime = regionTimePassedDuringAllTime.dividedBy(_1e18);
        const ticksPassedDuringAllTime = regionTimeSecondsPassedDuringAllTime.multipliedBy(ticksPerSecond);

        const toBeBasicProducedResDuringAllTime = ticksPassedDuringAllTime.multipliedBy(basicProductionPerTick);
        const toBeTotalProducedRes = toBeAdvancedProducedRes.plus(toBeBasicProducedResDuringAllTime);

        const spendingResourceQuantityAfterAdvancedProduction = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        const buildingResourceQuantityAfterAdvancedProduction = await ResourceHelper.getResourceStateBalanceOf(
          await buildingInstance.getAddress(),
          producingResourceType
        );

        const userResourceQuantityAfterAdvancedProduction = await ResourceHelper.getResourceQuantity(
          testUser1,
          producingResourceType
        );

        const actualTotalProducedRes = (buildingResourceQuantityAfterAdvancedProduction.plus(userResourceQuantityAfterAdvancedProduction)).minus(
            (buildingResourceQuantityBeforeBasicProduction.plus(userResourceQuantityBeforeBasicProduction)));

        if (buildingType !== BuildingType.FARM) {
            const toBeAdvancedSpentRes = BigNumber.min(
                ...spendingResourceConfigs.map(value => {
                    const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId);

                    return spendingResourceQuantityBeforeAdvancedProduction[resourceType]
                        .minus(spendingResourceQuantityAfterAdvancedProduction[resourceType]);
                })
            );
            expect(toBeAdvancedProducedRes).eql(toBeAdvancedSpentRes, 'Resource quantity is not correct');
        }
        expect(actualTotalProducedRes).eql(toBeTotalProducedRes, 'Resource quantity is not correct');
    }

    public static async harvestTest(buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        const assignWorkerQuantity = 1;
        const assignResourceQuantity = 100;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const registryInstance = await WorldHelper.getRegistryInstance();

        const productionConfig = await buildingInstance.getConfig();
        const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);
        const producingResourceConfig = productionConfig.find((config) => config.isProducing);
        const producingResourceType = ResourceHelper.getResourceTypeByResourceTypeId(producingResourceConfig!.resourceTypeId);
        expect(producingResourceConfig).to.exist;

        const buildingLastUpdateStateRegionTimeBefore = toBN((await buildingInstance.productionInfo()).lastUpdateStateRegionTime);

        const maxTreasuryBalance = toLowBN(await buildingInstance.getMaxTreasuryByLevel(2));
        const currentTreasuryBalance = await ResourceHelper.getResourceStateBalanceOf(
            await buildingInstance.getAddress(),
            producingResourceType
        );
        const availableTreasuryBalance = maxTreasuryBalance.minus(currentTreasuryBalance);
        const prosperityBefore = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        const resourceQuantityBefore = await ResourceHelper.getResourceQuantity(testUser1, producingResourceType);

        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
          ethers.ZeroAddress,
          await buildingInstance.getAddress(),
          transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
          spendingResourceConfigs.map((value) => value.resourceTypeId),
          spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
        ).then((tx) => tx.wait());

        const buildingLastUpdateStateRegionTimeFromInvestment = toBN((await buildingInstance.productionInfo()).lastUpdateStateRegionTime);

        await EvmUtils.increaseTime(10000);

        const spendingResourceBalance = await ResourceHelper.getResourcesStateBalanceOf(
            await buildingInstance.getAddress(),
            spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        const minTicks = BigNumber.min(
            ...spendingResourceConfigs.map(value => {
                const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId);
                return spendingResourceBalance[resourceType].dividedToIntegerBy(toLowBN(value.amountPerTick));
            })
        );

        await buildingInstance.distributeToAllShareholders().then((tx) => tx.wait());

        const buildingLastUpdateStateRegionTimeAfter = toBN((await buildingInstance.productionInfo()).lastUpdateStateRegionTime);

        const ticksPerSecond = toBN(await registryInstance.getProductionTicksInSecond());

        const regionTimePassed = buildingLastUpdateStateRegionTimeAfter.minus(buildingLastUpdateStateRegionTimeBefore);
        const regionTimeSecondsPassed = regionTimePassed.dividedBy(_1e18);
        const ticksPassed = regionTimeSecondsPassed.multipliedBy(ticksPerSecond);

        const regionTimePassedFromInvestment = buildingLastUpdateStateRegionTimeAfter
            .minus(buildingLastUpdateStateRegionTimeFromInvestment);
        const regionTimeSecondsPassedFromInvestment = regionTimePassedFromInvestment.dividedBy(_1e18);
        const ticksPassedFromInvestment = regionTimeSecondsPassedFromInvestment.multipliedBy(ticksPerSecond);

        const basicProductionPerTick = await ProductionHelper.getBasicProductionPerTick(userSettlementInstance, buildingType);
        const advancedProductionPerTick = await ProductionHelper.getAdvancedProductionPerTick(
            userSettlementInstance,
            buildingType,
            assignWorkerQuantity
        );
        const toBeBasicProducedRes = ticksPassed.multipliedBy(basicProductionPerTick);

        const toBeProducedTicks = buildingType === BuildingType.FARM
            ? ticksPassedFromInvestment
            : BigNumber.min(ticksPassedFromInvestment, minTicks);
        const toBeAdvancedProducedRes = toBeProducedTicks.multipliedBy(advancedProductionPerTick);

        const toBeProducedRes = toBeBasicProducedRes.plus(toBeAdvancedProducedRes);

        const toReservePercent = toLowBN(await registryInstance.getToTreasuryPercent());
        const toReserveWillGo = BigNumber.min(toBeProducedRes.multipliedBy(toReservePercent), availableTreasuryBalance);
        const toWalletWillGo = toBeProducedRes.minus(toReserveWillGo);

        const producingResourceTypeId = ResourceHelper.getResourceTypeId(producingResourceType);
        const resourceWeight = toLowBN(await registryInstance.getResourceWeight(producingResourceTypeId));
        const buildingCoefficient = await BuildingHelper.getBuildingCoefficient(toBN(await buildingInstance.getBuildingLevel()));

        const expectedProducedProsperity = resourceWeight.multipliedBy(toReserveWillGo.dividedBy(buildingCoefficient));

        const expectedProsperityBalance = prosperityBefore.plus(expectedProducedProsperity);
        const expectedTreasuryBalance = currentTreasuryBalance.plus(toReserveWillGo);
        const expectedResourceQuantity = resourceQuantityBefore.plus(toWalletWillGo);

        const actualProsperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        const actualTreasuryBalance = await ResourceHelper.getResourceStateBalanceOf(
            await buildingInstance.getAddress(),
            producingResourceType
        );
        const actualResourceQuantity = await ResourceHelper.getResourceQuantity(testUser1, producingResourceType);

        expect(actualProsperityBalance).isInCloseRangeWith(expectedProsperityBalance, 'Prosperity balance is not correct');
        expect(actualTreasuryBalance).eql(expectedTreasuryBalance, 'Treasury balance is not correct');
        expect(actualResourceQuantity).eql(expectedResourceQuantity, 'Resource quantity is not correct');
    }

    public static async productionWithPenaltyTest(buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        const assignWorkerQuantity = 1;
        const assignResourceQuantity = 5000;
        const productionTime = 20000000;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const registryInstance = await WorldHelper.getRegistryInstance();
        const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

        const maxCultistsPerRegion = toLowBN(await registryInstance.getMaxCultistsPerRegion());

        const productionConfig = await buildingInstance.getConfig();
        const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);

        //production without penalty
        await ProductionHelper.produceResourcesForSpecifiedDuration(
            userSettlementInstance,
            buildingType,
            assignResourceQuantity,
            assignWorkerQuantity,
            productionTime
        );

        //cultists summon
        const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
        await EvmUtils.increaseTime(summonDelay);

        await regionInstance.updateState().then((tx) => tx.wait());

        const actualSummonedCultists = await UnitHelper.getCultistQuantity(regionInstance);
        expect(actualSummonedCultists).gt(new BigNumber(0), 'Cultist amount is not correct');

        //production with penalty
        const resourcesBefore = await ResourceHelper.getResourcesQuantity(
          testUser1,
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        const buildingResourcesBefore = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
          ethers.ZeroAddress,
          await buildingInstance.getAddress(),
          transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
          spendingResourceConfigs.map((value) => value.resourceTypeId),
          spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
        ).then((tx) => tx.wait());

        const actualResources = await ResourceHelper.getResourcesQuantity(
          testUser1,
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        const actualBuildingResources = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        const buildingLastUpdateStateTimeBefore = toBN((await buildingInstance.productionInfo()).lastUpdateStateTime);
        const buildingLastUpdateStateRegionTimeBefore = toBN((await buildingInstance.productionInfo()).lastUpdateStateRegionTime);

        await EvmUtils.increaseTime(productionTime);

        await buildingInstance.removeResourcesAndWorkers(
          await userSettlementInstance.getAddress(),
          transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
          testUser1,
          spendingResourceConfigs.map((value) => value.resourceTypeId),
          spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
        ).then((tx) => tx.wait());

        await buildingInstance.updateState().then((tx) => tx.wait());

        const buildingLastUpdateStateTimeAfter = toBN((await buildingInstance.productionInfo()).lastUpdateStateTime);
        const buildingLastUpdateStateRegionTimeAfter = toBN((await buildingInstance.productionInfo()).lastUpdateStateRegionTime);

        const timePassedWithPenalty = buildingLastUpdateStateTimeAfter.minus(buildingLastUpdateStateTimeBefore);
        const regionTimePassedWithPenalty = buildingLastUpdateStateRegionTimeAfter.minus(buildingLastUpdateStateRegionTimeBefore);
        const regionTimeSecondsPassedWithPenalty = regionTimePassedWithPenalty.dividedBy(_1e18);

        const expectedProductionSlowdownPercentage = new BigNumber(1).minus(actualSummonedCultists.dividedBy(maxCultistsPerRegion));
        const actualProductionSlowdownPercentage = regionTimeSecondsPassedWithPenalty.dividedBy(timePassedWithPenalty);

        expect(actualProductionSlowdownPercentage)
            .isInCloseRangeWith(expectedProductionSlowdownPercentage, 'Production slowdown percentage is not correct');

        for (let i = 0; i < spendingResourceConfigs.length; i++) {
            const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(spendingResourceConfigs[i].resourceTypeId);

            expect(actualResources[resourceType])
                .eql(resourcesBefore[resourceType].minus(assignResourceQuantity), 'Resource quantity is not correct');
            expect(actualBuildingResources[resourceType])
                .isInCloseRangeWith(buildingResourcesBefore[resourceType].plus(actualProductionSlowdownPercentage
                    .multipliedBy(assignResourceQuantity)), 'Resource quantity is not correct');
        }
    }

    public static async resourceWithdrawDuringProductionTest(buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        const assignResourceQuantity = 5;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const registryInstance = await WorldHelper.getRegistryInstance();
        const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

        const ticksPerSecond = toBN(await registryInstance.getProductionTicksInSecond());
        const workerQuantity = toLowBN(await buildingInstance.getWorkersCapacity());

        const productionConfig = await buildingInstance.getConfig();
        const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);

        const productionRateWithPenaltyMultiplier = await ProductionHelper.getProductionRateWithPenaltyMultiplierByRegion(regionInstance);

        const maxProduceTime = buildingType === BuildingType.FORT
            ? BigNumber.min(...spendingResourceConfigs.map(value =>
                new BigNumber(assignResourceQuantity).dividedBy(toLowBN(value.amountPerTick).multipliedBy(workerQuantity))))
            : BigNumber.min(...spendingResourceConfigs.map(value =>
                new BigNumber(assignResourceQuantity).dividedBy((toLowBN(value.amountPerTick).multipliedBy(workerQuantity)).multipliedBy(
                productionRateWithPenaltyMultiplier).multipliedBy(ticksPerSecond))));

        const produceTimeBeforeWithdraw = maxProduceTime.dividedBy(5).integerValue();

        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
          ethers.ZeroAddress,
          await buildingInstance.getAddress(),
          transferableFromLowBN(workerQuantity),
          spendingResourceConfigs.map((value) => value.resourceTypeId),
          spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)
              .dividedBy(productionRateWithPenaltyMultiplier)))
        ).then((tx) => tx.wait());

        await EvmUtils.increaseTime(produceTimeBeforeWithdraw.toNumber());

        const spendingResourceQuantityBeforeWithdraw = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        const minSpendingResourceQuantityBeforeWithdraw = BigNumber.min(...Object.values(spendingResourceQuantityBeforeWithdraw) as BigNumber[]);

        //withdraw resources
        await buildingInstance.removeResourcesAndWorkers(
          await userSettlementInstance.getAddress(),
          transferableFromLowBN(new BigNumber(0)),
          testUser1,
          spendingResourceConfigs.map((value) => value.resourceTypeId),
          spendingResourceConfigs.map((_) => transferableFromLowBN(minSpendingResourceQuantityBeforeWithdraw.dividedBy(2)))
        ).then((tx) => tx.wait());

        await buildingInstance.updateState().then((tx) => tx.wait());

        const spendingResourceQuantityAfterWithdraw = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        for (let i = 0; i < spendingResourceConfigs.length; i++) {
            const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(spendingResourceConfigs[i].resourceTypeId);

            expect(spendingResourceQuantityAfterWithdraw[resourceType])
                .lt(spendingResourceQuantityBeforeWithdraw[resourceType], 'Resource quantity is not correct');
        }

        const minSpendingResourceAfterWithdraw = BigNumber.min(...Object.values(spendingResourceQuantityAfterWithdraw) as BigNumber[]);
        const produceTimeLeft = buildingType === BuildingType.FORT
            ? BigNumber.min(...spendingResourceConfigs.map(value =>
                minSpendingResourceAfterWithdraw.dividedBy(toLowBN(value.amountPerTick).multipliedBy(workerQuantity))))
            : BigNumber.min(...spendingResourceConfigs.map(value =>
                minSpendingResourceAfterWithdraw.dividedBy((toLowBN(value.amountPerTick).multipliedBy(workerQuantity)).multipliedBy(
                    productionRateWithPenaltyMultiplier).multipliedBy(ticksPerSecond))));

        expect(maxProduceTime).isInCloseRangeWith(produceTimeLeft.multipliedBy(2)
            .plus(produceTimeBeforeWithdraw), 'Produce time left is not correct');
    }

    public static async harvestBySettlementPlacedAfterRegionActivationTest(buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        await EvmUtils.increaseTime(ONE_DAY_IN_SECONDS);

        const position = await RegionHelper.getPositionForSettlementInRegionByNumber(1, 1);
        await ensureSettlementCreated(testUser1, position, DEFAULT_BANNER_NAME);

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const productionConfig = await buildingInstance.getConfig();
        const producingResourceConfig = productionConfig.find((config) => config.isProducing);
        const producingResourceType = ResourceHelper.getResourceTypeByResourceTypeId(producingResourceConfig!.resourceTypeId);
        expect(producingResourceConfig).to.exist;

        await buildingInstance.distributeToAllShareholders().then((tx) => tx.wait());

        const actualTreasuryBalance = await ResourceHelper.getResourceStateBalanceOf(
            await buildingInstance.getAddress(),
            producingResourceType
        );
        expect(actualTreasuryBalance).isInCloseRangeWith(new BigNumber(0), 'Treasury balance is not correct');
    }
}
