import {ethers, getNamedAccounts} from "hardhat";
import { UserHelper } from "../../shared/helpers/UserHelper";
import { expect } from "chai";
import {toBN, toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import { ResourceHelper } from "../../shared/helpers/ResourceHelper";
import BigNumber from "bignumber.js";
import { WorldHelper } from "../../shared/helpers/WorldHelper";
import { ResourceType } from "../../shared/enums/resourceType";
import { BuildingType } from "../../shared/enums/buildingType";
import { BuildingHelper } from "../../shared/helpers/BuildingHelper";
import { TokenUtils } from "../../shared/helpers/TokenUtils";
import {ProductionHelper} from "../../shared/helpers/ProductionHelper";
import {EvmUtils} from "../../shared/helpers/EvmUtils";
import {UnitHelper} from "../../shared/helpers/UnitHelper";
import {SettlementHelper} from "../../shared/helpers/SettlementHelper";
import {MovementHelper} from "../../shared/helpers/MovementHelper";
import {Battle__factory} from "../../typechain-types";
import {BattleHelper} from "../../shared/helpers/BattleHelper";
import { RegionHelper } from '../../shared/helpers/RegionHelper';

export class ResourceCoreTest {
    public static async resourceAssignTest(buildingType: BuildingType, withProductionPenalty: boolean){
        const { testUser1 } = await getNamedAccounts();

        const investQuantity = 100;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const registryInstance = await WorldHelper.getRegistryInstance();
        const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

        const productionConfig = await buildingInstance.getConfig();
        const spendingResourceConfigs = productionConfig.filter(config => !config.isProducing);

        if (withProductionPenalty) {
            const corruptionIndexAmount = 1000;
            await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
                userSettlementInstance,
                BuildingType.SMITHY,
                corruptionIndexAmount
            );

            const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
            await EvmUtils.increaseTime(summonDelay);

            await regionInstance.updateState().then((tx) => tx.wait());

            const cultistAmount = await UnitHelper.getCultistQuantity(regionInstance);
            expect(cultistAmount).gt(new BigNumber(0), 'Cultist amount is not correct');

            await buildingInstance.distributeToAllShareholders().then((tx) => tx.wait());
        }

        let totalResourceCorruptionIndex = new BigNumber(0);
        for (let i = 0; i < spendingResourceConfigs.length; i++) {
            const resourceCorruptionIndex =
                toLowBN(await registryInstance.getCorruptionIndexByResource(spendingResourceConfigs[i].resourceTypeId));
            totalResourceCorruptionIndex = totalResourceCorruptionIndex.plus(resourceCorruptionIndex.multipliedBy(investQuantity));
        }

        const regionCorruptionIndexBefore = toLowBN(await regionInstance.corruptionIndex());
        const resourcesBefore = await ResourceHelper.getResourcesQuantity(
          testUser1,
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );
        const buildingResourcesBefore = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        //resource investment
        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
            ethers.ZeroAddress,
            await buildingInstance.getAddress(),
            transferableFromLowBN(new BigNumber(0)),
            spendingResourceConfigs.map((value) => value.resourceTypeId),
            spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(investQuantity)))
        ).then((tx) => tx.wait());

        const productionRateWithPenaltyMultiplier = await ProductionHelper.getProductionRateWithPenaltyMultiplierByRegion(regionInstance);

        const actualRegionCorruptionIndex = toLowBN(await regionInstance.corruptionIndex());
        const actualResources = await ResourceHelper.getResourcesQuantity(
          testUser1,
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );
        const actualBuildingResources = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        for (let i = 0; i < spendingResourceConfigs.length; i++) {
            const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(spendingResourceConfigs[i].resourceTypeId);

            expect(actualResources[resourceType]).eql(
              resourcesBefore[resourceType].minus(investQuantity), 'Resource quantity is not correct');
            expect(actualBuildingResources[resourceType]).eql(
              buildingResourcesBefore[resourceType].plus(productionRateWithPenaltyMultiplier
                  .multipliedBy(investQuantity)), 'Resource quantity is not correct');
        }
        expect(actualRegionCorruptionIndex)
            .isInCloseRangeWith(regionCorruptionIndexBefore
                .minus(totalResourceCorruptionIndex), 'Region corruptionIndex is not correct');
    }

    public static async resourceAssignFromAnotherUserTest(buildingType: BuildingType){
        const { testUser1, testUser2 } = await getNamedAccounts();

        const investQuantity = 100;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const registryInstance = await WorldHelper.getRegistryInstance();
        const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);
        const eraInstance = await WorldHelper.getCurrentEraInstance();

        const productionConfig = await buildingInstance.getConfig();
        const spendingResourceConfigs = productionConfig.filter(config => !config.isProducing);

        let totalResourceCorruptionIndex = new BigNumber(0);
        for (let i = 0; i < spendingResourceConfigs.length; i++) {
            const resourceCorruptionIndex =
                toLowBN(await registryInstance.getCorruptionIndexByResource(spendingResourceConfigs[i].resourceTypeId));
            totalResourceCorruptionIndex = totalResourceCorruptionIndex.plus(resourceCorruptionIndex.multipliedBy(investQuantity));
        }

        const regionCorruptionIndexBefore = toLowBN(await regionInstance.corruptionIndex());
        const resourcesBefore = await ResourceHelper.getResourcesQuantity(
          testUser2,
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );
        const buildingResourcesBefore = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        for (let i = 0; i < spendingResourceConfigs.length; i++) {
            const tokenAddress = await eraInstance.resources(spendingResourceConfigs[i].resourceTypeId);
            await TokenUtils.approveTokens(testUser2, tokenAddress, transferableFromLowBN(new BigNumber(investQuantity)), testUser1);
        }

        //resource investment
        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
          testUser2,
          await buildingInstance.getAddress(),
          transferableFromLowBN(new BigNumber(0)),
          spendingResourceConfigs.map((value) => value.resourceTypeId),
          spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(investQuantity)))
        ).then((tx) => tx.wait());

        const productionRateWithPenaltyMultiplier = await ProductionHelper.getProductionRateWithPenaltyMultiplierByRegion(regionInstance);

        const actualRegionCorruptionIndex = toLowBN(await regionInstance.corruptionIndex());
        const actualResources = await ResourceHelper.getResourcesQuantity(
          testUser2,
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );
        const actualBuildingResources = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        for (let i = 0; i < spendingResourceConfigs.length; i++) {
            const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(spendingResourceConfigs[i].resourceTypeId);

            expect(actualResources[resourceType]).eql(
              resourcesBefore[resourceType].minus(investQuantity), 'Resource quantity is not correct');
            expect(actualBuildingResources[resourceType]).eql(
              buildingResourcesBefore[resourceType].plus(productionRateWithPenaltyMultiplier
                  .multipliedBy(investQuantity)), 'Resource quantity is not correct');
        }
        expect(actualRegionCorruptionIndex)
            .isInCloseRangeWith(regionCorruptionIndexBefore
                .minus(totalResourceCorruptionIndex), 'Region corruptionIndex is not correct');
    }

    public static async impossibleResourceAssignFromAnotherUserWithoutApproveTest(buildingType: BuildingType){
        const { testUser1, testUser2 } = await getNamedAccounts();

        const investQuantity = 100;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const productionConfig = await buildingInstance.getConfig();
        const spendingResourceConfigs = productionConfig.filter(config => !config.isProducing);

        await expect(
          userSettlementInstance.assignResourcesAndWorkersToBuilding(
            testUser2,
            await buildingInstance.getAddress(),
            transferableFromLowBN(new BigNumber(0)),
            spendingResourceConfigs.map((value) => value.resourceTypeId),
            spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(investQuantity)))
          ).then((tx) => tx.wait())
        ).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'ERC20: insufficient allowance'");
    }

    public static async notAcceptableResourceAssignTest(buildingType: BuildingType){
        const { testUser1 } = await getNamedAccounts();

        const notAcceptableResourceType = ResourceType.INGOT;
        const notAcceptableResourceTypeId = ResourceHelper.getResourceTypeId(notAcceptableResourceType);
        const investQuantity = 100;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        await expect(
            userSettlementInstance.assignResourcesAndWorkersToBuilding(
                ethers.ZeroAddress,
                await buildingInstance.getAddress(),
                transferableFromLowBN(new BigNumber(0)),
                [notAcceptableResourceTypeId],
                [transferableFromLowBN(new BigNumber(investQuantity))]
            ).then((tx) => tx.wait())
        ).to.be.revertedWith("ResourceNotAcceptable()");
    }

    public static async treasuryResourceAssignTest(buildingType: BuildingType){
        const { testUser1 } = await getNamedAccounts();

        const investQuantity = 100;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const productionConfig = await buildingInstance.getConfig();
        const producingResourceConfig = productionConfig.find((config) => config.isProducing);
        const producingResourceTypeId = producingResourceConfig!.resourceTypeId;

        const registryInstance = await WorldHelper.getRegistryInstance();
        const ticksPerSecond = toBN(await registryInstance.getProductionTicksInSecond());

        const userResourceQuantityBefore = await ResourceHelper.getResourceQuantity(
            testUser1,
            ResourceHelper.getResourceTypeByResourceTypeId(producingResourceTypeId)
        );

        const buildingTreasuryAmountBefore = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);

        const timeBefore = await EvmUtils.getCurrentTime();

        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
            ethers.ZeroAddress,
            await buildingInstance.getAddress(),
            transferableFromLowBN(new BigNumber(0)),
            [producingResourceTypeId],
            [transferableFromLowBN(new BigNumber(investQuantity))]
        ).then((tx) => tx.wait());

        const timeAfter = await EvmUtils.getCurrentTime();
        const passedTime = timeAfter - timeBefore;

        const ticksPassed = ticksPerSecond.multipliedBy(passedTime);
        const basicProductionPerTick = await ProductionHelper.getBasicProductionPerTick(userSettlementInstance, buildingType);
        const toBeBasicProducedRes = ticksPassed.multipliedBy(basicProductionPerTick);

        const userResourceQuantityAfter = await ResourceHelper.getResourceQuantity(
            testUser1,
            ResourceHelper.getResourceTypeByResourceTypeId(producingResourceTypeId)
        );

        const buildingTreasuryAmountAfter = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);

        expect(userResourceQuantityAfter).eql(userResourceQuantityBefore, 'User resource quantity is not correct');
        expect(buildingTreasuryAmountAfter)
            .eql(buildingTreasuryAmountBefore.plus(toBeBasicProducedRes), 'Building treasury amount is not correct');
    }

    public static async impossibleResourceAssignMoreThanAvailableTest(buildingType: BuildingType){
        const { testUser1 } = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const productionConfig = await buildingInstance.getConfig();
        const spendingResourceConfigs = productionConfig.filter(config => !config.isProducing);

        const resourcesBefore = await ResourceHelper.getResourcesQuantity(
          testUser1,
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        const maxQuantityBetweenResources = BigNumber.max(...Object.values(resourcesBefore) as BigNumber[]);

        await expect(
            userSettlementInstance.assignResourcesAndWorkersToBuilding(
                ethers.ZeroAddress,
                await buildingInstance.getAddress(),
                transferableFromLowBN(new BigNumber(0)),
                spendingResourceConfigs.map((value) => value.resourceTypeId),
                spendingResourceConfigs.map((_) => transferableFromLowBN(maxQuantityBetweenResources.plus(1)))
            ).then((tx) => tx.wait())
        ).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'ERC20: transfer amount exceeds balance'");
    }

    public static async resourceWithdrawTest(buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        const investQuantity = 100;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const registryInstance = await WorldHelper.getRegistryInstance();
        const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

        const productionConfig = await buildingInstance.getConfig();
        const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);

        let totalResourceCorruptionIndex = new BigNumber(0);
        for (let i = 0; i < spendingResourceConfigs.length; i++) {
            const resourceCorruptionIndex =
                toLowBN(await registryInstance.getCorruptionIndexByResource(spendingResourceConfigs[i].resourceTypeId));
            totalResourceCorruptionIndex = totalResourceCorruptionIndex.plus(resourceCorruptionIndex.multipliedBy(investQuantity));
        }

        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
            ethers.ZeroAddress,
            await buildingInstance.getAddress(),
            transferableFromLowBN(new BigNumber(0)),
            spendingResourceConfigs.map((value) => value.resourceTypeId),
            spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(investQuantity)))
        ).then((tx) => tx.wait());

        const regionCorruptionIndexBefore = toLowBN(await regionInstance.corruptionIndex());
        const resourcesBefore = await ResourceHelper.getResourcesQuantity(
          testUser1,
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );
        const buildingResourcesBefore = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        //withdraw resources
        await buildingInstance.removeResourcesAndWorkers(
          await userSettlementInstance.getAddress(),
          transferableFromLowBN(new BigNumber(0)),
          testUser1,
          spendingResourceConfigs.map((value) => value.resourceTypeId),
          spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(investQuantity)))
        ).then((tx) => tx.wait());

        const productionRateWithPenaltyMultiplier = await ProductionHelper.getProductionRateWithPenaltyMultiplierByRegion(regionInstance);

        const actualRegionCorruptionIndex = toLowBN(await regionInstance.corruptionIndex());
        const actualResources = await ResourceHelper.getResourcesQuantity(
          testUser1,
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );
        const actualBuildingResources = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        for (let i = 0; i < spendingResourceConfigs.length; i++) {
            const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(spendingResourceConfigs[i].resourceTypeId);

            expect(actualResources[resourceType]).eql(
              resourcesBefore[resourceType].plus(productionRateWithPenaltyMultiplier
                  .multipliedBy(investQuantity)), 'Resource quantity is not correct');
            expect(actualBuildingResources[resourceType]).eql(
              buildingResourcesBefore[resourceType].minus(productionRateWithPenaltyMultiplier
                  .multipliedBy(investQuantity)), 'Resource quantity is not correct');
        }
        expect(actualRegionCorruptionIndex.minus(regionCorruptionIndexBefore))
            .isInCloseRangeWith((totalResourceCorruptionIndex
                .multipliedBy(productionRateWithPenaltyMultiplier)), 'Region corruptionIndex is not correct');
    }

    public static async impossibleResourceWithdrawMoreThanAssignedTest(buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        const investQuantity = 100;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

        const productionConfig = await buildingInstance.getConfig();
        const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);

        //resource investment
        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
            ethers.ZeroAddress,
            await buildingInstance.getAddress(),
            transferableFromLowBN(new BigNumber(0)),
            spendingResourceConfigs.map((value) => value.resourceTypeId),
            spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(investQuantity)))
        ).then((tx) => tx.wait());

        const resourcesBefore = await ResourceHelper.getResourcesQuantity(
          testUser1,
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );
        const buildingResourcesBefore = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        await buildingInstance.removeResourcesAndWorkers(
          await userSettlementInstance.getAddress(),
          transferableFromLowBN(new BigNumber(0)),
          testUser1,
          spendingResourceConfigs.map((value) => value.resourceTypeId),
          spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(investQuantity).plus(1)))
        ).then((tx) => tx.wait());

        const productionRateWithPenaltyMultiplier = await ProductionHelper.getProductionRateWithPenaltyMultiplierByRegion(regionInstance);

        const actualResources = await ResourceHelper.getResourcesQuantity(
          testUser1,
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );
        const actualBuildingResources = await ResourceHelper.getResourcesQuantity(
          await buildingInstance.getAddress(),
          spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        for (let i = 0; i < spendingResourceConfigs.length; i++) {
            const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(spendingResourceConfigs[i].resourceTypeId);

            expect(actualResources[resourceType]).eql(
              resourcesBefore[resourceType].plus(productionRateWithPenaltyMultiplier
                  .multipliedBy(investQuantity)), 'Resource quantity is not correct');
            expect(actualBuildingResources[resourceType]).eql(
              buildingResourcesBefore[resourceType].minus(productionRateWithPenaltyMultiplier
                  .multipliedBy(investQuantity)), 'Resource quantity is not correct');
        }
    }

    public static async resourceAssignAfterBattleVersusCultistsTest(buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        const unitQuantity = 2;
        const corruptionIndexAmount = 1000;
        const investQuantity = 100;

        const registryInstance = await WorldHelper.getRegistryInstance();

        const gameUnits = await WorldHelper.getGameUnits();
        const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const productionConfig = await buildingInstance.getConfig();
        const spendingResourceConfigs = productionConfig.filter(config => !config.isProducing);

        const army = await SettlementHelper.getArmy(userSettlementInstance);

        expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
        await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

        const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

        await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
            userSettlementInstance,
            BuildingType.SMITHY,
            corruptionIndexAmount
        );

        const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
        await EvmUtils.increaseTime(summonDelay);

        await regionInstance.updateState().then((tx) => tx.wait());

        const cultistAmount = await UnitHelper.getCultistQuantity(regionInstance);
        expect(cultistAmount).gt(new BigNumber(0), 'Cultist amount is not correct');

        const productionRateWithPenaltyMultiplierBefore = await ProductionHelper.getProductionRateWithPenaltyMultiplierByRegion(regionInstance);

        const resourcesBeforeFirstInvestment = await ResourceHelper.getResourcesQuantity(
            testUser1,
            spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );
        const buildingResourcesBeforeFirstInvestment = await ResourceHelper.getResourcesQuantity(
            await buildingInstance.getAddress(),
            spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        //first resource investment
        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
            ethers.ZeroAddress,
            await buildingInstance.getAddress(),
            transferableFromLowBN(new BigNumber(0)),
            spendingResourceConfigs.map((value) => value.resourceTypeId),
            spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(investQuantity)))
        ).then((tx) => tx.wait());

        const resourcesAfterFirstInvestment = await ResourceHelper.getResourcesQuantity(
            testUser1,
            spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );
        const buildingResourcesAfterFirstInvestment = await ResourceHelper.getResourcesQuantity(
            await buildingInstance.getAddress(),
            spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        for (let i = 0; i < spendingResourceConfigs.length; i++) {
            const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(spendingResourceConfigs[i].resourceTypeId);

            expect(resourcesAfterFirstInvestment[resourceType]).eql(
                resourcesBeforeFirstInvestment[resourceType].minus(investQuantity), 'Resource quantity is not correct');
            expect(buildingResourcesAfterFirstInvestment[resourceType]).eql(
                buildingResourcesBeforeFirstInvestment[resourceType].plus(productionRateWithPenaltyMultiplierBefore
                    .multipliedBy(investQuantity)), 'Resource quantity is not correct');
        }

        const cultistsSettlementInstance = await UnitHelper.getCultistsSettlementInstance(regionInstance);
        const cultistUnitTypeId = await registryInstance.getCultistUnitTypeId();

        await MovementHelper.moveArmy(army, await cultistsSettlementInstance.position(), 0, true);

        await army.beginBattle(
            await cultistsSettlementInstance.army(),
            [cultistUnitTypeId],
            [transferableFromLowBN(cultistAmount)]
        ).then((tx) => tx.wait());

        const battleInstance = Battle__factory.connect(await army.battle(), army.runner);

        const battleDuration = await BattleHelper.getBattleDuration(battleInstance);
        await EvmUtils.increaseTime(battleDuration);

        const resourcesBeforeSecondInvestment = await ResourceHelper.getResourcesQuantity(
            testUser1,
            spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );
        const buildingResourcesBeforeSecondInvestment = await ResourceHelper.getResourcesQuantity(
            await buildingInstance.getAddress(),
            spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        //second resource investment
        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
            ethers.ZeroAddress,
            await buildingInstance.getAddress(),
            transferableFromLowBN(new BigNumber(0)),
            spendingResourceConfigs.map((value) => value.resourceTypeId),
            spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(investQuantity)))
        ).then((tx) => tx.wait());

        const productionRateWithPenaltyMultiplierAfter = await ProductionHelper.getProductionRateWithPenaltyMultiplierByRegion(regionInstance);
        expect(productionRateWithPenaltyMultiplierAfter)
            .gt(productionRateWithPenaltyMultiplierBefore, 'Production rate with penalty multiplier is not correct');

        const resourcesAfterSecondInvestment = await ResourceHelper.getResourcesQuantity(
            testUser1,
            spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );
        const buildingResourcesAfterSecondInvestment = await ResourceHelper.getResourcesQuantity(
            await buildingInstance.getAddress(),
            spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
        );

        for (let i = 0; i < spendingResourceConfigs.length; i++) {
            const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(spendingResourceConfigs[i].resourceTypeId);

            expect(resourcesAfterSecondInvestment[resourceType]).eql(
                resourcesBeforeSecondInvestment[resourceType].minus(investQuantity), 'Resource quantity is not correct');
            expect(buildingResourcesAfterSecondInvestment[resourceType]).eql(
                buildingResourcesBeforeSecondInvestment[resourceType].plus(productionRateWithPenaltyMultiplierAfter
                    .multipliedBy(investQuantity)), 'Resource quantity is not correct');
        }
    }
}
