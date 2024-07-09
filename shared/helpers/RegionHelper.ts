import { ethers, getNamedAccounts } from 'hardhat';
import {
	Era, Region, Region__factory,
	Settlement, SettlementsMarket__factory
} from '../../typechain-types';
import { cmpAddress, toLowBN, transferableFromLowBN } from '../../scripts/utils/const';
import { WorldHelper } from "./WorldHelper";
import { getRegionCenterByPosition } from '../../scripts/utils/geographyUtils';
import { regions } from '../../scripts/data/regions';
import {
	getPositionsByRadius,
	getPositionsForSettlements,
	getRegionPositions
} from '../../scripts/utils/positionUtils';
import BigNumber from 'bignumber.js';
import { UserHelper } from './UserHelper';
import { TileBonus, getTileBonusByPosition } from '../../scripts/utils/tileBonusUtils';
import { BuildingType } from '../enums/buildingType';
import { BuildingHelper } from './BuildingHelper';
import { UnitType } from '../enums/unitType';
import { UnitHelper } from './UnitHelper';

export class RegionHelper {
	public static async getRegionInstanceBySettlement(
		settlementInstance: Settlement
	) {
		const regionAddress = await settlementInstance.relatedRegion();
		return Region__factory.connect(regionAddress, settlementInstance.runner);
	}

	public static async getRegionInstanceById(
		regionId: bigint,
		asAddress?: string
	) {
		if (!asAddress) {
			const { worldDeployer } = await getNamedAccounts();
			asAddress = worldDeployer;
		}

		const signer = await ethers.getSigner(asAddress);

		const currentEraInstance = await WorldHelper.getCurrentEraInstance();

		const regionAddress = await currentEraInstance.regions(regionId);
		return Region__factory.connect(regionAddress, signer);
	}

	public static async getRegionIdByPosition(
		position: bigint
	) {
		const worldInstance = await WorldHelper.getWorldInstance();
		const [
			regionRadius,
			regionSeed
		] = await Promise.all([
			worldInstance.getRegionRadius(),
			worldInstance.getRegionSeed()
		]);

		return getRegionCenterByPosition(position, regionRadius, regionSeed)[0];
	}

	public static async getRegionIdByNumber(
		regionNumber: number
	) {
		const worldInstance = await WorldHelper.getWorldInstance();
		const [
			regionRadius,
			regionSeed
		] = await Promise.all([
			worldInstance.getRegionRadius(),
			worldInstance.getRegionSeed()
		]);

		return getRegionCenterByPosition(
			BigInt(regions[regionNumber - 1].newRegionPosition),
			regionRadius,
			regionSeed,
		)[0];
	}

	public static async getRegionTierById(
		regionId: bigint
	) {
		const geographyInstance = await WorldHelper.getGeographyInstance();
		return Number(await geographyInstance.getRegionTier(regionId));
	}

	public static async getRegionTierByNumber(
		regionNumber: number
	) {
		const regionId = await this.getRegionIdByNumber(regionNumber);
		return await this.getRegionTierById(regionId);
	}

	public static async includeRegionByNumber(
		regionNumber: number,
		userAddress?: string
	) {
		const geographyInstance = userAddress
			? await WorldHelper.getGeographyInstance(userAddress)
			: await WorldHelper.getGeographyInstance();

		const region = regions[regionNumber - 1];

		return await geographyInstance
			.includeRegion(region.newRegionPosition, region.neighborRegionPosition)
			.then((tx) => tx.wait());
	}

	public static async includeRegionByNumberWithActivation(
		regionNumber: number,
		userAddress: string
	) {
		const signer = await ethers.getSigner(userAddress);

		const registryInstance = await WorldHelper.getRegistryInstance();
		const currentEraInstance = await WorldHelper.getCurrentEraInstance();
		const geographyInstance = await WorldHelper.getGeographyInstance();

		const erc20ForRegionInclusionInstance = await WorldHelper.getErc20ForRegionInclusionInstance();
		const receiverErc20ForRegionInclusionInstance = await WorldHelper.getErc20ForRegionInclusionInstance(userAddress);

		const regionId = await this.getRegionIdByNumber(regionNumber);
		const regionTier = await this.getRegionTierById(regionId);
		const regionInclusionPrice = await registryInstance.getRegionInclusionPrice(regionTier);

		await erc20ForRegionInclusionInstance.mintTo(
			signer,
			regionInclusionPrice
		).then((tx) => tx.wait());

		await receiverErc20ForRegionInclusionInstance.approve(
			geographyInstance.getAddress(),
			regionInclusionPrice
		).then((tx) => tx.wait());

		await this.includeRegionByNumber(regionNumber, userAddress);

		return await currentEraInstance.activateRegion(regionId).then((tx) => tx.wait());
	}

	public static async isRegionActivated(
		regionNumber: number,
		eraInstance: Era
	) {
		const regionId = await this.getRegionIdByNumber(regionNumber);
		const regionAddress = await eraInstance.regions(regionId);

		return !cmpAddress(regionAddress, ethers.ZeroAddress);
	}

	public static async getNewSettlementCostByRegion(
		regionInstance: Region
	) {
		const settlementsMarketAddress = await regionInstance.settlementsMarket();
		const settlementsMarketInstance = SettlementsMarket__factory.connect(
			settlementsMarketAddress,
			regionInstance.runner
		);

		return toLowBN(await settlementsMarketInstance.getNewSettlementCost(0));
	}

	public static async getPositionForSettlementInRegionByNumber(
		regionNumber: number,
		positionNumber: number
	) {
		const positions = await this.getPositionsForSettlementsByRegionNumber(regionNumber, positionNumber);
		return positions[positions.length - 1];
	}

	public static async getPositionsForSettlementsByRegionNumber(
		regionNumber: number,
		positionsQuantity: number
	) {
		const worldInstance = await WorldHelper.getWorldInstance();
		const [regionRadius, regionSeed] = await Promise.all([
			worldInstance.getRegionRadius(),
			worldInstance.getRegionSeed(),
		]);

		const regionId = getRegionCenterByPosition(
			BigInt(regions[regionNumber - 1].newRegionPosition),
			regionRadius,
			regionSeed
		)[0];

		return getPositionsForSettlements(regionId, positionsQuantity, regionRadius, regionSeed);
	}

	public static async buySettlement(
		userAddress: string,
		regionId: bigint,
		position: bigint,
		maxTokensToUse: BigNumber,
		settlementCost: BigNumber
	) {
		const userSigner = await ethers.getSigner(userAddress);

		const regionInstance = await this.getRegionInstanceById(regionId);
		const settlementsMarketAddress = await regionInstance.settlementsMarket();
		const settlementsMarketInstance = SettlementsMarket__factory.connect(settlementsMarketAddress, userSigner);

		const userBanners = await UserHelper.getUserBanners(userAddress);
		const bannerId = userBanners[userBanners.length - 1];

		await settlementsMarketInstance
			.buySettlement(position, bannerId.toString(), transferableFromLowBN(maxTokensToUse), {
				value: transferableFromLowBN(settlementCost),
			})
			.then((tx) => tx.wait());
	}

	public static async getTileBonusByPosition(
		tilePosition: bigint
	) {
		const registryInstance = await WorldHelper.getRegistryInstance();
		const worldInstance = await WorldHelper.getWorldInstance();
		const geographyInstance = await WorldHelper.getGeographyInstance();

		const tileBonusSeed = await worldInstance.getTileBonusesSeed();
		const regionId = await this.getRegionIdByPosition(tilePosition);
		const regionTier = await this.getRegionTierById(regionId);
		const chanceForTileWithBonusByRegionTier = await registryInstance.getChanceForTileWithBonusByRegionTier(regionTier);

		return await geographyInstance.getTileBonus(tileBonusSeed, chanceForTileWithBonusByRegionTier, tilePosition);
	}

	public static async getPositionsOfTileBonusByRegionNumber(
		tileBonusType: number,
		minCount: number,
		regionNumber: number
	): Promise<bigint[]> {
		const registryInstance = await WorldHelper.getRegistryInstance();
		const worldInstance = await WorldHelper.getWorldInstance();

		const [
			regionRadius,
			regionSeed,
			tileBonusSeed
		] = await Promise.all([
			worldInstance.getRegionRadius(),
			worldInstance.getRegionSeed(),
			worldInstance.getTileBonusesSeed()
		]);

		let allPositionsWithBonus: bigint[] = [];
		const regionTier = await this.getRegionTierByNumber(regionNumber);
		const chanceForTileWithBonusByRegionTier = await registryInstance.getChanceForTileWithBonusByRegionTier(regionTier);

		// We are taking regions[regionNumber] as starting position we know that position is valid
		const startingPosition = BigInt(regions[regionNumber - 1].newRegionPosition);
		for (let radius = 1; allPositionsWithBonus.length < minCount; radius++) {
			const ringPositions = getPositionsByRadius(startingPosition, radius);
			const existentPositions = ringPositions
				.map((position) => {
					const [regionCenter, isPositionExist] = getRegionCenterByPosition(position, regionRadius, regionSeed);
					return [position, regionCenter, isPositionExist] as [bigint, bigint, boolean];
				})
				.filter(([position, regionCenter, isExist]) => isExist)
				.map(([position, regionCenter, isExist]) => position);

			const positionsWithBonus = existentPositions
				.map((position) => {
					const tileBonus = getTileBonusByPosition(tileBonusSeed, chanceForTileWithBonusByRegionTier, position);
					return [position, tileBonus] as [bigint, TileBonus];
				})
				.filter(([position, tileBonus]) => tileBonus.tileBonusType === BigInt(tileBonusType))
				.map(([position, tileBonus]) => position);

			allPositionsWithBonus = allPositionsWithBonus.concat(positionsWithBonus);
		}

		return allPositionsWithBonus;
	}

	public static async getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
		buildingType: BuildingType,
		regionNumber: number,
		skipPositionsWithPlacedSettlement: boolean = false
	) {
		const registryInstance = await WorldHelper.getRegistryInstance();
		const worldInstance = await WorldHelper.getWorldInstance();

		const [
			regionRadius,
			regionSeed
		] = await Promise.all([
			worldInstance.getRegionRadius(),
			worldInstance.getRegionSeed()
		]);

		const regionId = regions.map(region => {
			const [regionId, isExist] = getRegionCenterByPosition(BigInt(region.newRegionPosition), regionRadius, regionSeed);
			return regionId;
		})
			.find((regionId, index) => index + 1 === regionNumber)

		if (regionId === undefined) {
			throw new Error(`RegionId not found for regionNumber=${regionNumber}`);
		}

		let regionPositions = getRegionPositions(regionId!, regionRadius, regionSeed);

		if (skipPositionsWithPlacedSettlement) {
			const crossErasMemoryInstance = await WorldHelper.getCrossErasMemoryInstance();
			const positionsWithSettlementAddresses = await Promise.all(
				regionPositions.map(async regionPosition => {
					return [regionPosition, await crossErasMemoryInstance.settlementByPosition(regionPosition)] as [bigint, string];
				})
			);

			regionPositions = positionsWithSettlementAddresses
				.filter(([regionPosition, settlementAddress]) => {
					return cmpAddress(settlementAddress, ethers.ZeroAddress);
				})
				.map(([regionPosition, settlementAddress]) => {
					return regionPosition;
				})
		}

		// Currently there are 10 tile bonus variations and there is no adequate way to count them => its hardcoded
		const tileBonusVariations = 10;

		const tileBonusVariation = (await Promise.all(
			[...Array(tileBonusVariations)]
				.map((_, index) => index)
				.map(async (variation) => {
					const [variationBuildingTypeId, value] = await registryInstance.getAdvancedProductionTileBonusByVariation(variation);
					return [variation, variationBuildingTypeId] as [number, string];
				})
		))
			.find(([variation, variationBuildingTypeId]) => variationBuildingTypeId === BuildingHelper.getBuildingTypeId(buildingType));

		if (tileBonusVariation === undefined) {
			throw new Error(`TileBonus variation number not found for ${buildingType}`);
		}

		const tileBonusVariationNumber = tileBonusVariation![0];

		// We use classical 'for' in order to reduce search count
		for (let i = 0; i < regionPositions.length; i++) {
			const position = regionPositions[i];
			const tileBonus = await this.getTileBonusByPosition(position);
			if (tileBonus.tileBonusType === BigInt(1) && tileBonus.tileBonusVariation === BigInt(tileBonusVariationNumber)) {
				return position;
			}
		}

		throw new Error(`Position for tileBonus=${buildingType} not found in regionId=${regionId}`);
	}

	public static async getPositionOfMilitaryTileBonusByUnitTypeInRegion(
		unitType: UnitType,
		regionNumber: number,
		skipPositionsWithPlacedSettlement: boolean = false
	) {
		const registryInstance = await WorldHelper.getRegistryInstance();
		const worldInstance = await WorldHelper.getWorldInstance();

		const [
			regionRadius,
			regionSeed,
		] = await Promise.all([
			worldInstance.getRegionRadius(),
			worldInstance.getRegionSeed()
		]);

		const regionId = regions.map(region => {
			const [regionId, isExist] = getRegionCenterByPosition(BigInt(region.newRegionPosition), regionRadius, regionSeed);
			return regionId;
		})
			.find((regionId, index) => index + 1 === regionNumber)

		if (regionId === undefined) {
			throw new Error(`RegionId not found for regionNumber=${regionNumber}`);
		}

		let regionPositions = getRegionPositions(regionId!, regionRadius, regionSeed);

		if (skipPositionsWithPlacedSettlement) {
			const crossErasMemoryInstance = await WorldHelper.getCrossErasMemoryInstance();
			const positionsWithSettlementAddresses = await Promise.all(
				regionPositions.map(async regionPosition => {
					return [regionPosition, await crossErasMemoryInstance.settlementByPosition(regionPosition)] as [bigint, string];
				})
			);

			regionPositions = positionsWithSettlementAddresses
				.filter(([regionPosition, settlementAddress]) => {
					return cmpAddress(settlementAddress, ethers.ZeroAddress);
				})
				.map(([regionPosition, settlementAddress]) => {
					return regionPosition;
				})
		}

		// Currently there are 3 tile bonus variations and there is no adequate way to count them => its hardcoded
		const tileBonusVariations = 3;

		const tileBonusVariation = (await Promise.all(
			[...Array(tileBonusVariations)]
				.map((_, index) => index)
				.map(async (variation) => {
					const [variationUnitTypeId, value] = await registryInstance.getUnitBattleMultiplierTileBonusByVariation(variation);
					return [variation, variationUnitTypeId] as [number, string];
				})
		))
			.find(([variation, variationUnitTypeId]) => variationUnitTypeId === UnitHelper.getUnitTypeId(unitType));

		if (tileBonusVariation === undefined) {
			throw new Error(`TileBonus variation number not found for ${unitType}`);
		}

		const tileBonusVariationNumber = tileBonusVariation![0];

		// We use classical 'for' in order to reduce search count
		for (let i = 0; i < regionPositions.length; i++) {
			const position = regionPositions[i];
			const tileBonus = await this.getTileBonusByPosition(position);
			if (tileBonus.tileBonusType === BigInt(2) && tileBonus.tileBonusVariation === BigInt(tileBonusVariationNumber)) {
				return position;
			}
		}

		throw new Error(`Position for tileBonus=${unitType} not found in regionId=${regionId}`);
	}
}
