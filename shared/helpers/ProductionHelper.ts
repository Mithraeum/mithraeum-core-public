import {Building, Settlement, Region} from "../../typechain-types";
import {_1e18, toBN, toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import BigNumber from "bignumber.js";
import {EvmUtils} from "./EvmUtils";
import {expect} from "chai";
import {ResourceHelper} from "./ResourceHelper";
import {BuildingType} from "../enums/buildingType";
import {BuildingHelper} from "./BuildingHelper";
import {WorldHelper} from "./WorldHelper";
import {ethers} from "hardhat";
import {HardhatHelper} from "./HardhatHelper";
import {UnitHelper} from "./UnitHelper";
import {RegionHelper} from './RegionHelper';

export class ProductionHelper {
  public static async produceResourcesForSpecifiedDuration(
    settlementInstance: Settlement,
    buildingType: BuildingType,
    assignResourceQuantity: number,
    assignWorkerQuantity: number,
    productionTime: number
  ) {
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(settlementInstance, buildingType);

    const productionConfig = await buildingInstance.getConfig();
    const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);

    await settlementInstance.assignResourcesAndWorkersToBuilding(
      ethers.ZeroAddress,
      await buildingInstance.getAddress(),
      transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    await EvmUtils.increaseTime(productionTime);

    await buildingInstance.removeResourcesAndWorkers(
      await settlementInstance.getAddress(),
      transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
      HardhatHelper.getRunnerAddress(settlementInstance.runner),
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    await buildingInstance.distributeToAllShareholders().then((tx) => tx.wait());
  }

  public static async getBasicProductionPerTick(
      settlementInstance: Settlement,
      buildingType: BuildingType
  ) {
    const registryInstance = await WorldHelper.getRegistryInstance();
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(settlementInstance, buildingType);

    const buildingTypeId = BuildingHelper.getBuildingTypeId(buildingType);
    const basicProductionCoefficient = toBN((await buildingInstance.basicProduction()).coefficient);
    const basicProductionBuildingCoefficient = toLowBN(await registryInstance.getBasicProductionBuildingCoefficient(buildingTypeId));
    const workerCapacityCoefficient = toLowBN(await registryInstance.getWorkerCapacityCoefficient(buildingTypeId));
    const globalMultiplier = toBN(await registryInstance.getGlobalMultiplier());

    const productionConfig = await buildingInstance.getConfig();
    const producingResourceConfig = productionConfig.find((config) => config.isProducing);

    const basicProductionMultiplier = basicProductionCoefficient.multipliedBy(
        basicProductionBuildingCoefficient.multipliedBy(workerCapacityCoefficient.multipliedBy(globalMultiplier)));
    return toLowBN(producingResourceConfig!.amountPerTick).multipliedBy(basicProductionMultiplier);
  }

  public static async getAdvancedProductionPerTick(
      settlementInstance: Settlement,
      buildingType: BuildingType,
      assignWorkerQuantity: number
  ) {
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(settlementInstance, buildingType);

    const productionConfig = await buildingInstance.getConfig();
    const producingResourceConfig = productionConfig.find((config) => config.isProducing);

    return toLowBN(producingResourceConfig!.amountPerTick).multipliedBy(assignWorkerQuantity)
  }

  public static async getBasicProductionTimeToProduceResources(
    settlementInstance: Settlement,
    buildingType: BuildingType,
    resourceAmountToProduce: BigNumber
  ) {
    const registryInstance = await WorldHelper.getRegistryInstance();
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(settlementInstance);

    const productionRateWithPenaltyMultiplier = await this.getProductionRateWithPenaltyMultiplierByRegion(regionInstance);
    const ticksPerSecond = toBN(await registryInstance.getProductionTicksInSecond());
    const basicProductionPerTick = await this.getBasicProductionPerTick(settlementInstance, buildingType);

    return Number((resourceAmountToProduce.dividedBy(basicProductionPerTick.multipliedBy(productionRateWithPenaltyMultiplier))).dividedBy(ticksPerSecond).integerValue(BigNumber.ROUND_CEIL));
  }

  public static async increaseProsperityByBuilding(
    settlementInstance: Settlement,
    buildingType: BuildingType,
    prosperityAmount: number
  ) {
    const registryInstance = await WorldHelper.getRegistryInstance();
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(settlementInstance, buildingType);

    const producingResourceType = await this.getProducingResourceType(buildingInstance);
    const producingResourceTypeId = ResourceHelper.getResourceTypeId(producingResourceType);

    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(settlementInstance);
    const productionRateWithPenaltyMultiplier = await this.getProductionRateWithPenaltyMultiplierByRegion(regionInstance);

    const resourceWeight = toLowBN(await registryInstance.getResourceWeight(producingResourceTypeId));
    const toTreasuryPercent = toLowBN(await registryInstance.getToTreasuryPercent());
    const buildingCoefficient = await BuildingHelper.getBuildingCoefficient(toBN(await buildingInstance.getBuildingLevel()));
    const ticksPerSecond = toBN(await registryInstance.getProductionTicksInSecond());

    const resourceQuantity = (new BigNumber(prosperityAmount)).dividedBy(
        resourceWeight.multipliedBy(toTreasuryPercent.dividedBy(buildingCoefficient)));
    const workersCap = toLowBN(await buildingInstance.getWorkersCapacity());

    const basicProductionPerTick = await this.getBasicProductionPerTick(settlementInstance, buildingType);
    const advancedProductionPerTick = await this.getAdvancedProductionPerTick(settlementInstance, buildingType, workersCap.toNumber());
    const productionPerTick = basicProductionPerTick.plus(advancedProductionPerTick);
    const productionTime = (resourceQuantity.dividedBy(productionRateWithPenaltyMultiplier)).dividedBy(
        productionPerTick.multipliedBy(ticksPerSecond));

    await ProductionHelper.produceResourcesForSpecifiedDuration(
        settlementInstance,
        buildingType,
        resourceQuantity.dividedBy(productionRateWithPenaltyMultiplier).toNumber(),
        workersCap.toNumber(),
        productionTime.integerValue().toNumber()
    );
  }

  public static async getProductionPerSecond(
    settlementInstance: Settlement,
    buildingType: BuildingType,
    productionTime: number
  ) {
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(settlementInstance, buildingType);
    const producingResourceType = await this.getProducingResourceType(buildingInstance);

    await buildingInstance.distributeToAllShareholders().then((tx) => tx.wait());

    const buildingResourceQuantityBeforeProduction = await ResourceHelper.getResourceStateBalanceOf(
      await buildingInstance.getAddress(),
      producingResourceType
    );

    const userResourceQuantityBeforeProduction = await ResourceHelper.getResourceQuantity(
      HardhatHelper.getRunnerAddress(settlementInstance.runner),
      producingResourceType
    );

    const buildingLastUpdateStateRegionTimeBeforeProduction = toBN((await buildingInstance.productionInfo()).lastUpdateStateRegionTime);

    await EvmUtils.increaseTime(productionTime);
    await buildingInstance.distributeToAllShareholders().then((tx) => tx.wait());

    const buildingLastUpdateStateRegionTimeAfterProduction = toBN((await buildingInstance.productionInfo()).lastUpdateStateRegionTime);

    const timePassedDuringProduction = buildingLastUpdateStateRegionTimeAfterProduction.minus(buildingLastUpdateStateRegionTimeBeforeProduction);
    const timeSecondsPassedDuringProduction = timePassedDuringProduction.dividedBy(_1e18);

    const buildingResourceQuantityAfterProduction = await ResourceHelper.getResourceStateBalanceOf(
      await buildingInstance.getAddress(),
      producingResourceType
    );

    const userResourceQuantityAfterProduction = await ResourceHelper.getResourceQuantity(
      HardhatHelper.getRunnerAddress(settlementInstance.runner),
      producingResourceType
    );

    const producedRes = (buildingResourceQuantityAfterProduction.plus(userResourceQuantityAfterProduction)).minus(
      (buildingResourceQuantityBeforeProduction.plus(userResourceQuantityBeforeProduction)));

    return producedRes.dividedBy(timeSecondsPassedDuringProduction);
  }

  public static async getProductionSlowdownPercentage(
    settlementInstance: Settlement,
    buildingType: BuildingType
  ) {
    const assignResourceQuantity = 500;
    const productionTime = 100;

    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(settlementInstance, buildingType);

    const workersCap = toLowBN(await buildingInstance.getWorkersCapacity());

    const productionConfig = await buildingInstance.getConfig();
    const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);

    await settlementInstance.assignResourcesAndWorkersToBuilding(
      ethers.ZeroAddress,
      await buildingInstance.getAddress(),
      transferableFromLowBN(workersCap),
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    const buildingLastUpdateStateTimeBefore = toBN((await buildingInstance.productionInfo()).lastUpdateStateTime);
    const buildingLastUpdateStateRegionTimeBefore = toBN((await buildingInstance.productionInfo()).lastUpdateStateRegionTime);

    await EvmUtils.increaseTime(productionTime);

    await buildingInstance.removeResourcesAndWorkers(
      await settlementInstance.getAddress(),
      transferableFromLowBN(workersCap),
      HardhatHelper.getRunnerAddress(settlementInstance.runner),
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    await buildingInstance.updateState().then((tx) => tx.wait());

    const buildingLastUpdateStateTimeAfter = toBN((await buildingInstance.productionInfo()).lastUpdateStateTime);
    const buildingLastUpdateStateRegionTimeAfter = toBN((await buildingInstance.productionInfo()).lastUpdateStateRegionTime);

    const timePassed = buildingLastUpdateStateTimeAfter.minus(buildingLastUpdateStateTimeBefore);
    const regionTimePassed = buildingLastUpdateStateRegionTimeAfter.minus(buildingLastUpdateStateRegionTimeBefore);
    const regionTimeSecondsPassed = regionTimePassed.dividedBy(_1e18);
    return (new BigNumber(1).minus(regionTimeSecondsPassed.dividedBy(timePassed))).multipliedBy(100);
  }

  public static async getProductionRateWithPenaltyMultiplierByRegion(
      regionInstance: Region
  ) {
    const registryInstance = await WorldHelper.getRegistryInstance();
    const maxCultistsPerRegion = toLowBN(await registryInstance.getMaxCultistsPerRegion());

    const actualCultistsQuantity = await UnitHelper.getCultistQuantity(regionInstance);
    return new BigNumber(1).minus(actualCultistsQuantity.dividedBy(maxCultistsPerRegion));
  }

  public static async increaseCorruptionIndexBySettlementBuildingProduction(
    settlementInstance: Settlement,
    buildingType: BuildingType,
    corruptionIndexAmount: number
  ) {
    const registryInstance = await WorldHelper.getRegistryInstance();
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(settlementInstance, buildingType);
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(settlementInstance);

    const productionConfig = await buildingInstance.getConfig();
    const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);
    const producingResourceConfig = productionConfig.find((config) => config.isProducing);
    const producingResourceTypeId = producingResourceConfig!.resourceTypeId;
    expect(producingResourceConfig).to.exist;

    const workersCap = toLowBN(await buildingInstance.getWorkersCapacity());
    const producingResourceCorruptionIndex = toLowBN(await registryInstance.getCorruptionIndexByResource(producingResourceTypeId));
    const ticksPerSecond = toBN(await registryInstance.getProductionTicksInSecond());

    let totalSpendingResourceCorruptionIndex = new BigNumber(0);
    for (let i = 0; i < spendingResourceConfigs.length; i++) {
      const resourceCorruptionIndex = toLowBN(await registryInstance.getCorruptionIndexByResource(spendingResourceConfigs[i].resourceTypeId));
      totalSpendingResourceCorruptionIndex = totalSpendingResourceCorruptionIndex.plus(resourceCorruptionIndex);
    }

    const productionRateWithPenaltyMultiplier = await this.getProductionRateWithPenaltyMultiplierByRegion(regionInstance);
    const basicProductionPerTick = await this.getBasicProductionPerTick(settlementInstance, buildingType);
    const advancedProductionPerTick = await this.getAdvancedProductionPerTick(settlementInstance, buildingType, workersCap.toNumber());

    const advancedCorruptionIndexProductionPerSecond = advancedProductionPerTick.multipliedBy(ticksPerSecond).multipliedBy(producingResourceCorruptionIndex.minus(totalSpendingResourceCorruptionIndex));
    const basicCorruptionIndexProductionPerSecond = basicProductionPerTick.multipliedBy(ticksPerSecond).multipliedBy(producingResourceCorruptionIndex);
    const productionTime = new BigNumber(corruptionIndexAmount).dividedBy(advancedCorruptionIndexProductionPerSecond.plus(basicCorruptionIndexProductionPerSecond));
    const resourceAmountToProduce = advancedCorruptionIndexProductionPerSecond.multipliedBy(productionTime);

    await ProductionHelper.produceResourcesForSpecifiedDuration(
        settlementInstance,
        buildingType,
        resourceAmountToProduce.dividedBy(productionRateWithPenaltyMultiplier).toNumber(),
        workersCap.toNumber(),
        productionTime.integerValue().toNumber()
    );
  }

  public static async getProducingResourceType(
      buildingInstance: Building
  ) {
    const productionConfig = await buildingInstance.getConfig();
    const producingResourceConfig = productionConfig.find(config => config.isProducing);
    return ResourceHelper.getResourceTypeByResourceTypeId(producingResourceConfig!.resourceTypeId);
  }
}
