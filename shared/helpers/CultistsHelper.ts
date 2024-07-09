import {
	Settlement
} from '../../typechain-types';
import { toBN, toLowBN } from '../../scripts/utils/const';
import { WorldHelper } from "./WorldHelper";
import { BuildingType } from '../enums/buildingType';
import { BuildingHelper } from './BuildingHelper';
import { ProductionHelper } from './ProductionHelper';
import { EvmUtils } from './EvmUtils';
import { RegionHelper } from './RegionHelper';

export class CultistsHelper {
	public static async getEnoughCultistsForWipe() {
		const registryInstance = await WorldHelper.getRegistryInstance();
		const geographyInstance = await WorldHelper.getGeographyInstance();

		const regionsCount = toBN(await geographyInstance.getRegionsCount());
		const perRegionMultiplier = toLowBN(await registryInstance.getCultistsPerRegionMultiplier());
		return (perRegionMultiplier.multipliedBy(regionsCount)).plus(1);
	}

	public static async getTotalCultistsAmount() {
		const eraInstance = await WorldHelper.getCurrentEraInstance();
		return toLowBN(await eraInstance.totalCultists());
	}

	public static async summonEnoughCultistsForWipeInCurrentSettlementRegion(
		settlementInstance: Settlement
	) {
		const buildingType = BuildingType.SMITHY;
		const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(settlementInstance, buildingType);

		const registryInstance = await WorldHelper.getRegistryInstance();
		const regionInstance = await RegionHelper.getRegionInstanceBySettlement(settlementInstance);

		const productionConfig = await buildingInstance.getConfig();
		const producingResourceConfig = productionConfig.find((config) => config.isProducing);

		const buildingLevel = Number(await buildingInstance.getBuildingLevel());
		const treasuryCap = toLowBN(await buildingInstance.getMaxTreasuryByLevel(buildingLevel));
		const producingResourceCorruptionIndex = toLowBN(await registryInstance.getCorruptionIndexByResource(producingResourceConfig!.resourceTypeId));
		const corruptionIndexTreasuryCap = treasuryCap.multipliedBy(producingResourceCorruptionIndex);

		const enoughCultistsForWipe = await this.getEnoughCultistsForWipe();
		const regionCorruptionIndex = toLowBN(await regionInstance.corruptionIndex());
		const corruptionIndexAmountToIncrease = enoughCultistsForWipe.plus(1).multipliedBy(10).minus(regionCorruptionIndex);

		await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
			settlementInstance,
			buildingType,
			corruptionIndexAmountToIncrease.plus(corruptionIndexTreasuryCap).toNumber()
		);

		const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
		await EvmUtils.increaseTime(summonDelay);

		await regionInstance.updateState().then((tx) => tx.wait());
	}

	public static async isWipePossible() {
		const enoughCultistsForWipe = await this.getEnoughCultistsForWipe();
		const totalCultistsAmount = await this.getTotalCultistsAmount();

		return totalCultistsAmount.toNumber() >= enoughCultistsForWipe.toNumber();
	}
}
