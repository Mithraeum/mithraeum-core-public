import {toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import { expect } from "chai";
import { WorldHelper } from "../../shared/helpers/WorldHelper";
import {ethers, getNamedAccounts} from "hardhat";
import {TokenUtils} from "../../shared/helpers/TokenUtils";
import {DEFAULT_BANNER_NAME} from "../../shared/constants/banners";
import {EvmUtils} from "../../shared/helpers/EvmUtils";
import {UserHelper} from "../../shared/helpers/UserHelper";
import BigNumber from "bignumber.js";
import {BuildingType} from "../../shared/enums/buildingType";
import {BuildingHelper} from "../../shared/helpers/BuildingHelper";
import {ProductionHelper} from "../../shared/helpers/ProductionHelper";
import {
    ERC721__factory,
} from "../../typechain-types";
import { CultistsHelper } from '../../shared/helpers/CultistsHelper';
import { RegionHelper } from '../../shared/helpers/RegionHelper';

export class RegionCoreTest {
    public static async regionActivationTest() {
        const {testUser1} = await getNamedAccounts();
        const signer = await ethers.getSigner(testUser1);

        const regionNumber = 2;

        const registryInstance = await WorldHelper.getRegistryInstance();
        const worldInstance = await WorldHelper.getWorldInstance();
        const currentEraInstance = await WorldHelper.getCurrentEraInstance();
        const geographyInstance = await WorldHelper.getGeographyInstance();

        const erc20ForRegionInclusionInstance = await WorldHelper.getErc20ForRegionInclusionInstance();
        const receiverErc20ForRegionInclusionInstance = await WorldHelper.getErc20ForRegionInclusionInstance(testUser1);

        const isRegionActivated = await RegionHelper.isRegionActivated(1, currentEraInstance);
        expect(isRegionActivated).to.be.true;

        const regionId = await RegionHelper.getRegionIdByNumber(regionNumber);
        const regionTier = await RegionHelper.getRegionTierById(regionId);
        const regionInclusionPrice = await registryInstance.getRegionInclusionPrice(regionTier);

        await erc20ForRegionInclusionInstance.mintTo(
            signer,
            regionInclusionPrice
        ).then((tx) => tx.wait());

        await receiverErc20ForRegionInclusionInstance.approve(
            geographyInstance.getAddress(),
            regionInclusionPrice
        ).then((tx) => tx.wait());

        const tokenAddress = await worldInstance.erc20ForRegionInclusion();
        const tokenBalanceBefore = await TokenUtils.getTokenBalance(tokenAddress, testUser1);

        await RegionHelper.includeRegionByNumber(regionNumber, testUser1);

        const tokenBalanceAfter = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
        expect(tokenBalanceAfter)
            .eql(tokenBalanceBefore.minus(toLowBN(regionInclusionPrice)), 'User token balance is not correct');

        const isNewRegionActivatedBefore = await RegionHelper.isRegionActivated(regionNumber, currentEraInstance);
        expect(isNewRegionActivatedBefore).to.be.false;

        await currentEraInstance.activateRegion(regionId).then((tx) => tx.wait());

        const isNewRegionActivatedAfter = await RegionHelper.isRegionActivated(regionNumber, currentEraInstance);
        expect(isNewRegionActivatedAfter).to.be.true;
    }

    public static async impossibleRegionActivationWithoutTokensTest() {
        const {testUser1} = await getNamedAccounts();
        const signer = await ethers.getSigner(testUser1);

        const regionNumber = 2;

        const registryInstance = await WorldHelper.getRegistryInstance();
        const currentEraInstance = await WorldHelper.getCurrentEraInstance();
        const geographyInstance = await WorldHelper.getGeographyInstance();

        const erc20ForRegionInclusionInstance = await WorldHelper.getErc20ForRegionInclusionInstance();
        const receiverErc20ForRegionInclusionInstance = await WorldHelper.getErc20ForRegionInclusionInstance(testUser1);

        const isRegionActivated = await RegionHelper.isRegionActivated(1, currentEraInstance);
        expect(isRegionActivated).to.be.true;

        const regionTier = await RegionHelper.getRegionTierByNumber(regionNumber);
        const regionInclusionPrice = await registryInstance.getRegionInclusionPrice(regionTier);

        await erc20ForRegionInclusionInstance.mintTo(
            signer,
            transferableFromLowBN(toLowBN(regionInclusionPrice).minus(100))
        ).then((tx) => tx.wait());

        await receiverErc20ForRegionInclusionInstance.approve(
            geographyInstance.getAddress(),
            transferableFromLowBN(toLowBN(regionInclusionPrice).minus(100))
        ).then((tx) => tx.wait());

        await expect(
            RegionHelper.includeRegionByNumber(regionNumber, testUser1)
        ).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'ERC20: insufficient allowance'");
    }

    public static async impossibleRegionActivationWithoutSettlementsTest() {
        const {testUser1} = await getNamedAccounts();
        const signer = await ethers.getSigner(testUser1);

        const regionNumber = 2;

        const registryInstance = await WorldHelper.getRegistryInstance();
        const currentEraInstance = await WorldHelper.getCurrentEraInstance();
        const geographyInstance = await WorldHelper.getGeographyInstance();

        const erc20ForRegionInclusionInstance = await WorldHelper.getErc20ForRegionInclusionInstance();
        const receiverErc20ForRegionInclusionInstance = await WorldHelper.getErc20ForRegionInclusionInstance(testUser1);

        const isRegionActivated = await RegionHelper.isRegionActivated(1, currentEraInstance);
        expect(isRegionActivated).to.be.true;

        const regionTier = await RegionHelper.getRegionTierByNumber(regionNumber);
        const regionInclusionPrice = await registryInstance.getRegionInclusionPrice(regionTier);

        await erc20ForRegionInclusionInstance.mintTo(
            signer,
            transferableFromLowBN(toLowBN(regionInclusionPrice).minus(100))
        ).then((tx) => tx.wait());

        await receiverErc20ForRegionInclusionInstance.approve(
            geographyInstance.getAddress(),
            transferableFromLowBN(toLowBN(regionInclusionPrice).minus(100))
        ).then((tx) => tx.wait());

        await expect(
            RegionHelper.includeRegionByNumber(regionNumber, testUser1)
        ).to.be.revertedWith("CannotIncludeRegionDueToInsufficientUserSettlementsCountInNeighboringRegion()");
    }

    public static async impossibleRegionActivationTest() {
        const {testUser1} = await getNamedAccounts();

        const regionNumber = 3;

        await expect(
            RegionHelper.includeRegionByNumberWithActivation(regionNumber, testUser1)
        ).to.be.revertedWith("CannotIncludeRegionWithInvalidRegionInclusionProofProvided()");
    }

    public static async regionTiersAfterWipeTest() {
        const {testUser1} = await getNamedAccounts();
        const worldInstance = await WorldHelper.getWorldInstance();

        const regionsCountForActivation = 2;
        const regionsCountForObservation = 5;

        const registryInstance = await WorldHelper.getRegistryInstance();

        let regionActivationTierArrayBefore = [];
        let regionObservationTierArrayBefore = [];
        for (let i = 1; i <= regionsCountForActivation + regionsCountForObservation; i++) {
            const regionTier = await RegionHelper.getRegionTierByNumber(i);

            i <= regionsCountForActivation
                ? regionActivationTierArrayBefore.push(regionTier)
                : regionObservationTierArrayBefore.push(regionTier);
        }

        const enoughCultistsForWipe = await CultistsHelper.getEnoughCultistsForWipe();
        const maxCultistsPerRegion = toLowBN(await registryInstance.getMaxCultistsPerRegion());
        const numberOfRegionsWithMaxCultists = (enoughCultistsForWipe.dividedBy(maxCultistsPerRegion))
            .integerValue(BigNumber.ROUND_UP);

        for (let i = 1; i <= numberOfRegionsWithMaxCultists.toNumber(); i++) {
            const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, i);

            const buildingType = BuildingType.SMITHY;
            const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(
                userSettlementInstance,
                buildingType
            );

            const registryInstance = await WorldHelper.getRegistryInstance();
            const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

            const productionConfig = await buildingInstance.getConfig();
            const producingResourceConfig = productionConfig.find((config) => config.isProducing);

            const buildingLevel = Number(await buildingInstance.getBuildingLevel());
            const treasuryCap = toLowBN(await buildingInstance.getMaxTreasuryByLevel(buildingLevel));
            const producingResourceCorruptionIndex =
                toLowBN(await registryInstance.getCorruptionIndexByResource(producingResourceConfig!.resourceTypeId));
            const corruptionIndexTreasuryCap = treasuryCap.multipliedBy(producingResourceCorruptionIndex);

            const enoughCultistsForWipe = await CultistsHelper.getEnoughCultistsForWipe();
            const regionCorruptionIndex = toLowBN(await regionInstance.corruptionIndex());
            const corruptionIndexAmountToIncrease = enoughCultistsForWipe.plus(1).multipliedBy(10).minus(regionCorruptionIndex);

            await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
                userSettlementInstance,
                buildingType,
                corruptionIndexAmountToIncrease.plus(corruptionIndexTreasuryCap).toNumber()
            );
        }
        const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
        await EvmUtils.increaseTime(summonDelay);

        for (let i = 1; i <= numberOfRegionsWithMaxCultists.toNumber(); i++) {
            const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, i);
            const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

            await regionInstance.updateState().then((tx) => tx.wait());
        }

        const totalCultistsAmount = await CultistsHelper.getTotalCultistsAmount();
        expect(totalCultistsAmount).gte(enoughCultistsForWipe, 'Cultist amount is not correct');

        await WorldHelper.passToEraDestructionInterval();
        await worldInstance.destroyCurrentEra().then((tx) => tx.wait());

        let regionActivationTierArrayAfter = [];
        let regionObservationTierArrayAfter = [];
        for (let i = 1; i <= regionsCountForActivation + regionsCountForObservation; i++) {
            const regionTier = await RegionHelper.getRegionTierByNumber(i);

            i <= regionsCountForActivation
                ? regionActivationTierArrayAfter.push(regionTier)
                : regionObservationTierArrayAfter.push(regionTier);
        }

        expect(regionActivationTierArrayBefore)
            .eql(regionActivationTierArrayAfter, 'Region activation tier array is not correct');
        expect(regionObservationTierArrayBefore)
            .not.eql(regionObservationTierArrayAfter, 'Region observation tier array is not correct');
    }

    public static async settlementPurchaseInRegionActivatedByAnotherUserWithRegionTransferTest() {
        const {testUser1, testUser2} = await getNamedAccounts();
        const signer = await ethers.getSigner(testUser1);

        const regionNumber = 2;

        const worldInstance = await WorldHelper.getWorldInstance();
        const registryInstance = await WorldHelper.getRegistryInstance();

        const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

        await RegionHelper.includeRegionByNumberWithActivation(regionNumber, testUser1);

        const position1 = await RegionHelper.getPositionForSettlementInRegionByNumber(regionNumber, 1);
        const position2 = await RegionHelper.getPositionForSettlementInRegionByNumber(regionNumber, 2);

        const regionId = await RegionHelper.getRegionIdByPosition(position1);
        const regionInstance = await RegionHelper.getRegionInstanceById(regionId);
        const regionTier = await RegionHelper.getRegionTierById(regionId);

        const regionOwnerSettlementPurchasePercent =
            toLowBN(await registryInstance.getRegionOwnerSettlementPurchasePercent(regionTier));

        const regionOwnershipTokenAddress = await worldInstance.regionOwnershipToken();
        const regionOwnershipTokenInstance = ERC721__factory.connect(regionOwnershipTokenAddress, signer);

        const regionOwnerBefore = await regionOwnershipTokenInstance.ownerOf(regionId);
        expect(regionOwnerBefore).eql(testUser1, 'Region owner is not correct');

        const tokenBalanceBefore1 = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
        const tokenBalanceBefore2 = await TokenUtils.getTokenBalance(tokenAddress, testUser2);

        const settlementCost1 = await RegionHelper.getNewSettlementCostByRegion(regionInstance);

        await UserHelper.mintBanner(testUser2, DEFAULT_BANNER_NAME);
        await RegionHelper.buySettlement(testUser2, regionId, position1, settlementCost1, settlementCost1);

        const tokenBalanceAfter1 = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
        const tokenBalanceAfter2 = await TokenUtils.getTokenBalance(tokenAddress, testUser2);

        expect(tokenBalanceAfter1)
            .isInCloseRangeWith(tokenBalanceBefore1.plus(settlementCost1
                .multipliedBy(regionOwnerSettlementPurchasePercent)), 'User token balance is not correct');
        expect(tokenBalanceAfter2)
            .isInCloseRangeWith(tokenBalanceBefore2.minus(settlementCost1), 'User token balance is not correct');

        await regionOwnershipTokenInstance.transferFrom(testUser1, testUser2, regionId);
        
        const regionOwnerAfter = await regionOwnershipTokenInstance.ownerOf(regionId);
        expect(regionOwnerAfter).eql(testUser2, 'Region owner is not correct');

        const settlementCost2 = await RegionHelper.getNewSettlementCostByRegion(regionInstance);

        await UserHelper.mintBanner(testUser1, DEFAULT_BANNER_NAME);
        await RegionHelper.buySettlement(testUser1, regionId, position2, settlementCost2, settlementCost2);

        const actualTokenBalance1 = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
        const actualTokenBalance2 = await TokenUtils.getTokenBalance(tokenAddress, testUser2);

        expect(actualTokenBalance1)
            .isInCloseRangeWith(tokenBalanceAfter1.minus(settlementCost2), 'User token balance is not correct');
        expect(actualTokenBalance2)
            .isInCloseRangeWith(tokenBalanceAfter2.plus(settlementCost2
                .multipliedBy(regionOwnerSettlementPurchasePercent)), 'User token balance is not correct');
    }
}
