import {toBN, toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import BigNumber from "bignumber.js";
import {EvmUtils} from "./EvmUtils";
import {SettlementHelper} from "./SettlementHelper";
import {ProductionHelper} from "./ProductionHelper";
import {BuildingType} from "../enums/buildingType";
import {Fort, Settlement, Siege__factory} from "../../typechain-types";
import {WorldHelper} from "./WorldHelper";
import {ethers} from "hardhat";
import {HardhatHelper} from "./HardhatHelper";
import {RegionHelper} from './RegionHelper';

export class FortHelper {
  public static async repairFort(
    settlementInstance: Settlement,
    assignWorkerQuantity: number,
    healthAmountToRestore: BigNumber
  ) {
    const fort = await SettlementHelper.getFort(settlementInstance);
    await fort.updateState().then((tx) => tx.wait());

    const currentFortHealth = toLowBN(await fort.health());

    const productionConfig = await fort.getConfig();
    const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);

    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(settlementInstance);
    const productionRateWithPenaltyMultiplier = await ProductionHelper.getProductionRateWithPenaltyMultiplierByRegion(regionInstance);

    const basicProductionPerTick = await ProductionHelper.getBasicProductionPerTick(settlementInstance, BuildingType.FORT);
    const advancedProductionPerTick = await ProductionHelper.getAdvancedProductionPerTick(settlementInstance, BuildingType.FORT, assignWorkerQuantity);
    const totalProductionPerTick = advancedProductionPerTick.plus(basicProductionPerTick);

    const fortRepairmentTime = ((healthAmountToRestore.minus(currentFortHealth)).dividedBy(totalProductionPerTick)).integerValue(BigNumber.ROUND_FLOOR);

    const maxResourceAmount = BigNumber.max(...spendingResourceConfigs.map(value =>
        fortRepairmentTime.multipliedBy(toLowBN(value.amountPerTick).multipliedBy(assignWorkerQuantity))));

    await settlementInstance.assignResourcesAndWorkersToBuilding(
      ethers.ZeroAddress,
      await fort.getAddress(),
      transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(maxResourceAmount.dividedBy(productionRateWithPenaltyMultiplier)))
    ).then((tx) => tx.wait());

    await EvmUtils.increaseTime(fortRepairmentTime.toNumber());

    await fort.removeResourcesAndWorkers(
      await settlementInstance.getAddress(),
      transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
      HardhatHelper.getRunnerAddress(settlementInstance.runner),
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(maxResourceAmount.dividedBy(productionRateWithPenaltyMultiplier)))
    ).then((tx) => tx.wait());

    await fort.updateState().then((tx) => tx.wait());
  }

  public static async getFortRegenerationPerSecond(
    fortInstance: Fort,
    regenerationTime: number
  ) {
    const fortHealthBeforeRepairment = toLowBN(await fortInstance.health());

    const buildingLastUpdateStateTimeBeforeProduction = toBN((await fortInstance.productionInfo()).lastUpdateStateTime);

    await EvmUtils.increaseTime(regenerationTime);
    await fortInstance.updateState().then((tx) => tx.wait());

    const buildingLastUpdateStateTimeAfterProduction = toBN((await fortInstance.productionInfo()).lastUpdateStateTime);
    const timePassedDuringRegeneration = buildingLastUpdateStateTimeAfterProduction.minus(buildingLastUpdateStateTimeBeforeProduction);

    const fortHealthAfterRepairment = toLowBN(await fortInstance.health());
    const regeneratedHealth = fortHealthAfterRepairment.minus(fortHealthBeforeRepairment);

    return regeneratedHealth.dividedBy(timePassedDuringRegeneration);
  }

  public static async getSettlementFortDestructionTime(
    settlementInstance: Settlement
  ) {
    const siegeInstance = Siege__factory.connect(await settlementInstance.siege(), settlementInstance.runner);

    const fort = await SettlementHelper.getFort(settlementInstance);

    const fortHealthBeforeDestruction = toLowBN(await fort.health());

    const totalSiegePowerPerTick = toLowBN(await siegeInstance.totalSiegePower());
    const assignedWorkers = toLowBN(await fort.getAssignedWorkers());

    const basicProductionPerTick = await ProductionHelper.getBasicProductionPerTick(settlementInstance, BuildingType.FORT);
    const advancedProductionPerTick = await ProductionHelper.getAdvancedProductionPerTick(settlementInstance, BuildingType.FORT, assignedWorkers.toNumber());
    const totalProductionPerTick = basicProductionPerTick.plus(advancedProductionPerTick);

    const realDestructionPerTick = totalSiegePowerPerTick.minus(totalProductionPerTick);
    return Number((fortHealthBeforeDestruction.dividedBy(realDestructionPerTick)).integerValue(BigNumber.ROUND_CEIL));
  }

  public static async getSettlementFortRobberyPointsRegenerationTime(
    settlementInstance: Settlement,
    robberyPointsAmountToReceive: BigNumber
  ) {
    const registryInstance = await WorldHelper.getRegistryInstance();
    const siegeInstance = Siege__factory.connect(await settlementInstance.siege(), settlementInstance.runner);

    const fort = await SettlementHelper.getFort(settlementInstance);

    const robberyPointsPerDamageMultiplier = toLowBN(await registryInstance.getRobberyPointsPerDamageMultiplier());
    const totalSiegePowerPerTick = toLowBN(await siegeInstance.totalSiegePower());
    const assignedWorkers = toLowBN(await fort.getAssignedWorkers());

    const basicProductionPerTick = await ProductionHelper.getBasicProductionPerTick(settlementInstance, BuildingType.FORT);
    const advancedProductionPerTick = await ProductionHelper.getAdvancedProductionPerTick(settlementInstance, BuildingType.FORT, assignedWorkers.toNumber());
    const totalProductionPerTick = advancedProductionPerTick.plus(basicProductionPerTick);

    const realDestructionPerTick = totalSiegePowerPerTick.minus(totalProductionPerTick);

    return Number(((robberyPointsAmountToReceive.dividedBy(robberyPointsPerDamageMultiplier)).dividedBy(realDestructionPerTick)).integerValue(BigNumber.ROUND_CEIL));
  }
}
