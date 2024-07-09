import {ethers, getNamedAccounts} from "hardhat";
import {UserHelper} from "../../shared/helpers/UserHelper";
import {SettlementHelper} from "../../shared/helpers/SettlementHelper";
import {toBN, toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import {expect} from "chai";
import {ResourceHelper} from "../../shared/helpers/ResourceHelper";
import {BuildingType} from "../../shared/enums/buildingType";
import {ResourceType} from "../../shared/enums/resourceType";
import BigNumber from "bignumber.js";
import {BuildingHelper} from "../../shared/helpers/BuildingHelper";
import {WorldHelper} from "../../shared/helpers/WorldHelper";
import {TokenUtils} from "../../shared/helpers/TokenUtils";

export class BuildingUpgradeCoreTest {
    public static async buildingBasicUpgradeTest(startLevel: number, buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        await BuildingHelper.upgradeBuildingToSpecifiedLevel(buildingInstance, startLevel, false);

        const buildingLevelBefore = toBN(await buildingInstance.getBuildingLevel());
        const basicProductionLevelBefore = toBN((await buildingInstance.basicProduction()).level);
        const woodQuantityBefore = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.WOOD);
        const upgradePrice = toLowBN(await buildingInstance.getUpgradePrice(startLevel));
        expect(woodQuantityBefore).gte(upgradePrice, 'Wood quantity is not correct');

        const expectedBuildingLevel = buildingLevelBefore.plus(1);
        const expectedBasicProductionLevel = basicProductionLevelBefore.plus(1);
        const expectedTreasuryCap = toLowBN(await buildingInstance.getMaxTreasuryByLevel(expectedBuildingLevel.toNumber()));
        const expectedWoodQuantity = woodQuantityBefore.minus(upgradePrice);

        //basic upgrade
        await buildingInstance.upgradeBasicProduction(ethers.ZeroAddress).then((tx) => tx.wait());

        const actualBuildingLevel = toBN(await buildingInstance.getBuildingLevel());
        const actualBasicProductionLevel = toBN((await buildingInstance.basicProduction()).level);
        const actualTreasuryCap = toLowBN(await buildingInstance.getMaxTreasuryByLevel(actualBuildingLevel.toNumber()));
        const actualWoodQuantity = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.WOOD);

        expect(actualBuildingLevel).eql(expectedBuildingLevel, 'Building level after upgrade is not correct');
        expect(actualBasicProductionLevel).eql(expectedBasicProductionLevel, 'Basic production level is not correct');
        expect(actualTreasuryCap).eql(expectedTreasuryCap, 'Treasury cap after upgrade is not correct');
        expect(actualWoodQuantity).isInCloseRangeWith(expectedWoodQuantity, 'Wood quantity is not correct');
    }

    public static async buildingAdvancedUpgradeTest(startLevel: number, buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const registryInstance = await WorldHelper.getRegistryInstance();

        const buildingTypeId = BuildingHelper.getBuildingTypeId(buildingType);
        const workerCapacityCoefficient = toLowBN(await registryInstance.getWorkerCapacityCoefficient(buildingTypeId));

        await BuildingHelper.upgradeBuildingToSpecifiedLevel(buildingInstance, startLevel, true);

        const buildingLevelBefore = toBN(await buildingInstance.getBuildingLevel());
        const advancedProductionLevelBefore = toBN((await buildingInstance.advancedProduction()).level);
        const oreQuantityBefore = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.ORE);
        const upgradePrice = toLowBN(await buildingInstance.getUpgradePrice(startLevel));
        expect(oreQuantityBefore).gte(upgradePrice, 'Ore quantity is not correct');

        const expectedBuildingLevel = buildingLevelBefore.plus(1);
        const expectedAdvancedProductionLevel = advancedProductionLevelBefore.plus(1);

        const buildingCoefficientBefore = await BuildingHelper.getBuildingCoefficient(new BigNumber(1));
        const buildingCoefficientAfter = await BuildingHelper.getBuildingCoefficient(expectedBuildingLevel);
        const buildingCoefficientMultiplier = buildingCoefficientAfter.minus(buildingCoefficientBefore);

        const expectedWorkersCap = workerCapacityCoefficient.multipliedBy(buildingCoefficientMultiplier);
        const expectedTreasuryCap = toLowBN(await buildingInstance.getMaxTreasuryByLevel(expectedBuildingLevel.toNumber()));
        const expectedOreQuantity = oreQuantityBefore.minus(upgradePrice);

        //advanced upgrade
        await buildingInstance.upgradeAdvancedProduction(ethers.ZeroAddress).then((tx) => tx.wait());

        const actualBuildingLevel = toBN(await buildingInstance.getBuildingLevel());
        const actualAdvancedProductionLevel = toBN((await buildingInstance.advancedProduction()).level);
        const actualWorkersCap = toLowBN(await buildingInstance.getWorkersCapacity());
        const actualTreasuryCap = toLowBN(await buildingInstance.getMaxTreasuryByLevel(actualBuildingLevel.toNumber()));
        const actualOreQuantity = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.ORE);

        expect(actualBuildingLevel).eql(expectedBuildingLevel, 'Building level after upgrade is not correct');
        expect(actualAdvancedProductionLevel)
            .eql(expectedAdvancedProductionLevel, 'Advanced production level is not correct');
        expect(actualWorkersCap).eql(expectedWorkersCap, 'Workers cap after upgrade is not correct');
        expect(actualTreasuryCap).eql(expectedTreasuryCap, 'Treasury cap after upgrade is not correct');
        expect(actualOreQuantity).isInCloseRangeWith(expectedOreQuantity, 'Ore quantity is not correct');
    }

    public static async buildingBasicUpgradeByAnotherUserResourcesTest(buildingType: BuildingType) {
        const {testUser1, testUser2} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const eraInstance = await WorldHelper.getCurrentEraInstance();

        const buildingLevelBefore = toBN(await buildingInstance.getBuildingLevel());
        const basicProductionLevelBefore = toBN((await buildingInstance.basicProduction()).level);
        const woodQuantityBefore = await ResourceHelper.getResourceQuantity(testUser2, ResourceType.WOOD);
        const upgradePrice = toLowBN(await buildingInstance.getUpgradePrice(buildingLevelBefore.plus(1).toNumber()));
        expect(woodQuantityBefore).gte(upgradePrice, 'Wood quantity is not correct');

        const expectedBuildingLevel = buildingLevelBefore.plus(1);
        const expectedBasicProductionLevel = basicProductionLevelBefore.plus(1);
        const expectedTreasuryCap = toLowBN(await buildingInstance.getMaxTreasuryByLevel(expectedBuildingLevel.toNumber()));
        const expectedWoodQuantity = woodQuantityBefore.minus(upgradePrice);

        const resourceTypeId = ResourceHelper.getResourceTypeId(ResourceType.WOOD);
        const tokenAddress = await eraInstance.resources(resourceTypeId);
        await TokenUtils.approveTokens(testUser2, tokenAddress, transferableFromLowBN(upgradePrice), testUser1);

        //basic upgrade
        await buildingInstance.upgradeBasicProduction(testUser2).then((tx) => tx.wait());

        const actualBuildingLevel = toBN(await buildingInstance.getBuildingLevel());
        const actualBasicProductionLevel = toBN((await buildingInstance.basicProduction()).level);
        const actualTreasuryCap = toLowBN(await buildingInstance.getMaxTreasuryByLevel(actualBuildingLevel.toNumber()));
        const actualWoodQuantity = await ResourceHelper.getResourceQuantity(testUser2, ResourceType.WOOD);

        expect(actualBuildingLevel).eql(expectedBuildingLevel, 'Building level after upgrade is not correct');
        expect(actualBasicProductionLevel).eql(expectedBasicProductionLevel, 'Basic production level is not correct');
        expect(actualTreasuryCap).eql(expectedTreasuryCap, 'Treasury cap after upgrade is not correct');
        expect(actualWoodQuantity).isInCloseRangeWith(expectedWoodQuantity, 'Wood quantity is not correct');
    }

    public static async buildingAdvancedUpgradeByAnotherUserResourcesTest(buildingType: BuildingType) {
        const {testUser1, testUser2} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const registryInstance = await WorldHelper.getRegistryInstance();
        const eraInstance = await WorldHelper.getCurrentEraInstance();

        const buildingTypeId = BuildingHelper.getBuildingTypeId(buildingType);
        const workerCapacityCoefficient = toLowBN(await registryInstance.getWorkerCapacityCoefficient(buildingTypeId));

        const buildingLevelBefore = toBN(await buildingInstance.getBuildingLevel());
        const advancedProductionLevelBefore = toBN((await buildingInstance.advancedProduction()).level);
        const oreQuantityBefore = await ResourceHelper.getResourceQuantity(testUser2, ResourceType.ORE);
        const upgradePrice = toLowBN(await buildingInstance.getUpgradePrice(buildingLevelBefore.plus(1).toNumber()));
        expect(oreQuantityBefore).gte(upgradePrice, 'Ore quantity is not correct');

        const expectedBuildingLevel = buildingLevelBefore.plus(1);
        const expectedAdvancedProductionLevel = advancedProductionLevelBefore.plus(1);

        const buildingCoefficientBefore = await BuildingHelper.getBuildingCoefficient(new BigNumber(1));
        const buildingCoefficientAfter = await BuildingHelper.getBuildingCoefficient(expectedBuildingLevel);
        const buildingCoefficientMultiplier = buildingCoefficientAfter.minus(buildingCoefficientBefore);

        const expectedWorkersCap = workerCapacityCoefficient.multipliedBy(buildingCoefficientMultiplier);
        const expectedTreasuryCap = toLowBN(await buildingInstance.getMaxTreasuryByLevel(expectedBuildingLevel.toNumber()));
        const expectedOreQuantity = oreQuantityBefore.minus(upgradePrice);

        const resourceTypeId = ResourceHelper.getResourceTypeId(ResourceType.ORE);
        const tokenAddress = await eraInstance.resources(resourceTypeId);
        await TokenUtils.approveTokens(testUser2, tokenAddress, transferableFromLowBN(upgradePrice), testUser1);

        //advanced upgrade
        await buildingInstance.upgradeAdvancedProduction(testUser2).then((tx) => tx.wait());

        const actualBuildingLevel = toBN(await buildingInstance.getBuildingLevel());
        const actualAdvancedProductionLevel = toBN((await buildingInstance.advancedProduction()).level);
        const actualWorkersCap = toLowBN(await buildingInstance.getWorkersCapacity());
        const actualTreasuryCap = toLowBN(await buildingInstance.getMaxTreasuryByLevel(actualBuildingLevel.toNumber()));
        const actualOreQuantity = await ResourceHelper.getResourceQuantity(testUser2, ResourceType.ORE);

        expect(actualBuildingLevel).eql(expectedBuildingLevel, 'Building level after upgrade is not correct');
        expect(actualAdvancedProductionLevel)
            .eql(expectedAdvancedProductionLevel, 'Advanced production level is not correct');
        expect(actualWorkersCap).eql(expectedWorkersCap, 'Workers cap after upgrade is not correct');
        expect(actualTreasuryCap).eql(expectedTreasuryCap, 'Treasury cap after upgrade is not correct');
        expect(actualOreQuantity).isInCloseRangeWith(expectedOreQuantity, 'Ore quantity is not correct');
    }

    public static async fortBasicUpgradeTest(startLevel: number) {
        const {testUser1} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const fort = await SettlementHelper.getFort(userSettlementInstance);

        const fortHealthBefore = toLowBN(await fort.health());
        expect(fortHealthBefore).eql(new BigNumber(4), 'Fort health is not correct');

        await BuildingHelper.upgradeBuildingToSpecifiedLevel(fort, startLevel, false);

        const buildingLevelBefore = toBN(await fort.getBuildingLevel());
        const basicProductionLevelBefore = toBN((await fort.basicProduction()).level);
        const woodQuantityBefore = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.WOOD);
        const upgradePrice = toLowBN(await fort.getUpgradePrice(startLevel));
        expect(woodQuantityBefore).gte(upgradePrice, 'Wood quantity is not correct');

        const expectedBuildingLevel = buildingLevelBefore.plus(1);
        const expectedBasicProductionLevel = basicProductionLevelBefore.plus(1);
        const buildingCoefficientAfter = await BuildingHelper.getBuildingCoefficient(expectedBuildingLevel);
        const expectedWoodQuantity = woodQuantityBefore.minus(upgradePrice);
        const expectedMaxHealth = buildingCoefficientAfter.pow(3);

        //basic upgrade
        await fort.upgradeBasicProduction(ethers.ZeroAddress).then((tx) => tx.wait());

        const actualBuildingLevel = toBN(await fort.getBuildingLevel());
        const actualBasicProductionLevel = toBN((await fort.basicProduction()).level);
        const actualWoodQuantity = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.WOOD);
        const actualMaxHealth = toLowBN(await fort.getMaxHealthOnLevel(actualBuildingLevel.toNumber()));

        expect(actualBuildingLevel).eql(expectedBuildingLevel, 'Fort level after upgrade is not correct');
        expect(actualBasicProductionLevel).eql(expectedBasicProductionLevel, 'Basic production level is not correct');
        expect(actualWoodQuantity).isInCloseRangeWith(expectedWoodQuantity, 'Wood quantity is not correct');
        expect(actualMaxHealth).eql(expectedMaxHealth, 'Fort max health is not correct');
    }

    public static async fortAdvancedUpgradeTest(startLevel: number) {
        const {testUser1} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const fort = await SettlementHelper.getFort(userSettlementInstance);

        const registryInstance = await WorldHelper.getRegistryInstance();

        const fortTypeId = BuildingHelper.getBuildingTypeId(BuildingType.FORT);
        const workerCapacityCoefficient = toLowBN(await registryInstance.getWorkerCapacityCoefficient(fortTypeId));

        const fortHealthBefore = toLowBN(await fort.health());
        expect(fortHealthBefore).eql(new BigNumber(4), 'Fort health is not correct');

        await BuildingHelper.upgradeBuildingToSpecifiedLevel(fort, startLevel, true);

        const buildingLevelBefore = toBN(await fort.getBuildingLevel());
        const advancedProductionLevelBefore = toBN((await fort.advancedProduction()).level);
        const oreQuantityBefore = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.ORE);
        const upgradePrice = toLowBN(await fort.getUpgradePrice(startLevel));
        expect(oreQuantityBefore).gte(upgradePrice, 'Ore quantity is not correct');

        const expectedBuildingLevel = buildingLevelBefore.plus(1);
        const expectedAdvancedProductionLevel = advancedProductionLevelBefore.plus(1);

        const buildingCoefficientBefore = await BuildingHelper.getBuildingCoefficient(new BigNumber(1));
        const buildingCoefficientAfter = await BuildingHelper.getBuildingCoefficient(expectedBuildingLevel);
        const buildingCoefficientMultiplier = buildingCoefficientAfter.minus(buildingCoefficientBefore);

        const expectedWorkersCap = workerCapacityCoefficient.multipliedBy(buildingCoefficientMultiplier);
        const expectedOreQuantity = oreQuantityBefore.minus(upgradePrice);
        const expectedMaxHealth = buildingCoefficientAfter.pow(3);

        //advanced upgrade
        await fort.upgradeAdvancedProduction(ethers.ZeroAddress).then((tx) => tx.wait());

        const actualBuildingLevel = toBN(await fort.getBuildingLevel());
        const actualAdvancedProductionLevel = toBN((await fort.advancedProduction()).level);
        const actualWorkersCap = toLowBN(await fort.getWorkersCapacity());
        const actualOreQuantity = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.ORE);
        const actualMaxHealth = toLowBN(await fort.getMaxHealthOnLevel(actualBuildingLevel.toNumber()));

        expect(actualBuildingLevel).eql(expectedBuildingLevel, 'Fort level after upgrade is not correct');
        expect(actualAdvancedProductionLevel)
            .eql(expectedAdvancedProductionLevel, 'Advanced production level is not correct');
        expect(actualWorkersCap).eql(expectedWorkersCap, 'Workers cap after upgrade is not correct');
        expect(actualOreQuantity).isInCloseRangeWith(expectedOreQuantity, 'Ore quantity is not correct');
        expect(actualMaxHealth).eql(expectedMaxHealth, 'Fort max health is not correct');
    }

    public static async fortBasicUpgradeByAnotherUserResourcesTest() {
        const {testUser1, testUser2} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const fort = await SettlementHelper.getFort(userSettlementInstance);

        const eraInstance = await WorldHelper.getCurrentEraInstance();

        const fortHealthBefore = toLowBN(await fort.health());
        expect(fortHealthBefore).eql(new BigNumber(4), 'Fort health is not correct');

        const buildingLevelBefore = toBN(await fort.getBuildingLevel());
        const basicProductionLevelBefore = toBN((await fort.basicProduction()).level);
        const woodQuantityBefore = await ResourceHelper.getResourceQuantity(testUser2, ResourceType.WOOD);
        const upgradePrice = toLowBN(await fort.getUpgradePrice(buildingLevelBefore.plus(1).toNumber()));
        expect(woodQuantityBefore).gte(upgradePrice, 'Wood quantity is not correct');

        const expectedBuildingLevel = buildingLevelBefore.plus(1);
        const expectedBasicProductionLevel = basicProductionLevelBefore.plus(1);
        const buildingCoefficientAfter = await BuildingHelper.getBuildingCoefficient(expectedBuildingLevel);
        const expectedWoodQuantity = woodQuantityBefore.minus(upgradePrice);
        const expectedMaxHealth = buildingCoefficientAfter.pow(3);

        const resourceTypeId = ResourceHelper.getResourceTypeId(ResourceType.WOOD);
        const tokenAddress = await eraInstance.resources(resourceTypeId);
        await TokenUtils.approveTokens(testUser2, tokenAddress, transferableFromLowBN(upgradePrice), testUser1);

        //basic upgrade
        await fort.upgradeBasicProduction(testUser2).then((tx) => tx.wait());

        const actualBuildingLevel = toBN(await fort.getBuildingLevel());
        const actualBasicProductionLevel = toBN((await fort.basicProduction()).level);
        const actualWoodQuantity = await ResourceHelper.getResourceQuantity(testUser2, ResourceType.WOOD);
        const actualMaxHealth = toLowBN(await fort.getMaxHealthOnLevel(actualBuildingLevel.toNumber()));

        expect(actualBuildingLevel).eql(expectedBuildingLevel, 'Fort level after upgrade is not correct');
        expect(actualBasicProductionLevel).eql(expectedBasicProductionLevel, 'Basic production level is not correct');
        expect(actualWoodQuantity).isInCloseRangeWith(expectedWoodQuantity, 'Wood quantity is not correct');
        expect(actualMaxHealth).eql(expectedMaxHealth, 'Fort max health is not correct');
    }

    public static async fortAdvancedUpgradeByAnotherUserResourcesTest() {
        const {testUser1, testUser2} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const fort = await SettlementHelper.getFort(userSettlementInstance);

        const registryInstance = await WorldHelper.getRegistryInstance();
        const eraInstance = await WorldHelper.getCurrentEraInstance();

        const fortTypeId = BuildingHelper.getBuildingTypeId(BuildingType.FORT);
        const workerCapacityCoefficient = toLowBN(await registryInstance.getWorkerCapacityCoefficient(fortTypeId));

        const fortHealthBefore = toLowBN(await fort.health());
        expect(fortHealthBefore).eql(new BigNumber(4), 'Fort health is not correct');

        const buildingLevelBefore = toBN(await fort.getBuildingLevel());
        const advancedProductionLevelBefore = toBN((await fort.advancedProduction()).level);
        const oreQuantityBefore = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.ORE);
        const upgradePrice = toLowBN(await fort.getUpgradePrice(buildingLevelBefore.plus(1).toString()));
        expect(oreQuantityBefore).gte(upgradePrice, 'Ore quantity is not correct');

        const expectedBuildingLevel = buildingLevelBefore.plus(1);
        const expectedAdvancedProductionLevel = advancedProductionLevelBefore.plus(1);

        const buildingCoefficientBefore = await BuildingHelper.getBuildingCoefficient(new BigNumber(1));
        const buildingCoefficientAfter = await BuildingHelper.getBuildingCoefficient(expectedBuildingLevel);
        const buildingCoefficientMultiplier = buildingCoefficientAfter.minus(buildingCoefficientBefore);

        const expectedWorkersCap = workerCapacityCoefficient.multipliedBy(buildingCoefficientMultiplier);
        const expectedOreQuantity = oreQuantityBefore.minus(upgradePrice);
        const expectedMaxHealth = buildingCoefficientAfter.pow(3);

        const resourceTypeId = ResourceHelper.getResourceTypeId(ResourceType.ORE);
        const tokenAddress = await eraInstance.resources(resourceTypeId);
        await TokenUtils.approveTokens(testUser2, tokenAddress, transferableFromLowBN(upgradePrice), testUser1);

        //advanced upgrade
        await fort.upgradeAdvancedProduction(testUser2).then((tx) => tx.wait());

        const actualBuildingLevel = toBN(await fort.getBuildingLevel());
        const actualAdvancedProductionLevel = toBN((await fort.advancedProduction()).level);
        const actualWorkersCap = toLowBN(await fort.getWorkersCapacity());
        const actualOreQuantity = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.ORE);
        const actualMaxHealth = toLowBN(await fort.getMaxHealthOnLevel(actualBuildingLevel.toNumber()));

        expect(actualBuildingLevel).eql(expectedBuildingLevel, 'Fort level after upgrade is not correct');
        expect(actualAdvancedProductionLevel)
            .eql(expectedAdvancedProductionLevel, 'Advanced production level is not correct');
        expect(actualWorkersCap).eql(expectedWorkersCap, 'Workers cap after upgrade is not correct');
        expect(actualOreQuantity).isInCloseRangeWith(expectedOreQuantity, 'Ore quantity is not correct');
        expect(actualMaxHealth).eql(expectedMaxHealth, 'Fort max health is not correct');
    }

    public static async impossibleBuildingBasicUpgradeWithoutResourcesTest(buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const buildingLevelBefore = Number(await buildingInstance.getBuildingLevel());
        const woodQuantityBefore = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.WOOD);
        const upgradePrice = toLowBN(await buildingInstance.getUpgradePrice(buildingLevelBefore));
        expect(woodQuantityBefore).lt(upgradePrice, 'Wood quantity is not correct');

        await expect(
          buildingInstance.upgradeBasicProduction(ethers.ZeroAddress).then((tx) => tx.wait())
        ).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'ERC20: burn amount exceeds balance'");
    }

    public static async impossibleBuildingAdvancedUpgradeWithoutResourcesTest(buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const buildingLevelBefore = Number(await buildingInstance.getBuildingLevel());
        const oreQuantityBefore = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.ORE);
        const upgradePrice = toLowBN(await buildingInstance.getUpgradePrice(buildingLevelBefore));
        expect(oreQuantityBefore).lt(upgradePrice, 'Ore quantity is not correct');

        await expect(
          buildingInstance.upgradeAdvancedProduction(ethers.ZeroAddress).then((tx) => tx.wait())
        ).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'ERC20: burn amount exceeds balance'");
    }

    public static async impossibleBuildingUpgradeDuringCooldownTest(buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const buildingLevelBefore = Number(await buildingInstance.getBuildingLevel());
        const woodQuantityBefore = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.WOOD);
        const upgradePrice = toLowBN(await buildingInstance.getUpgradePrice(buildingLevelBefore));
        expect(woodQuantityBefore).gte(upgradePrice, 'Wood quantity is not correct');

        await buildingInstance.upgradeBasicProduction(ethers.ZeroAddress).then((tx) => tx.wait());

        await expect(
          buildingInstance.upgradeBasicProduction(ethers.ZeroAddress).then((tx) => tx.wait())
        ).to.be.revertedWith("BuildingCannotBeUpgradedWhileUpgradeIsOnCooldown()");
    }

    public static async impossibleBuildingBasicUpgradeByAnotherUserResourcesWithoutApproveTest(buildingType: BuildingType) {
        const {testUser1, testUser2} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const buildingLevelBefore = Number(await buildingInstance.getBuildingLevel());
        const woodQuantityBefore = await ResourceHelper.getResourceQuantity(testUser2, ResourceType.WOOD);
        const upgradePrice = toLowBN(await buildingInstance.getUpgradePrice(buildingLevelBefore + 1));
        expect(woodQuantityBefore).gte(upgradePrice, 'Wood quantity is not correct');

        await expect(
          buildingInstance.upgradeBasicProduction(testUser2).then((tx) => tx.wait())
        ).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'ERC20: insufficient allowance'");
    }

    public static async impossibleBuildingAdvancedUpgradeByAnotherUserResourcesWithoutApproveTest(buildingType: BuildingType) {
        const {testUser1, testUser2} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const buildingLevelBefore = Number(await buildingInstance.getBuildingLevel());
        const oreQuantityBefore = await ResourceHelper.getResourceQuantity(testUser2, ResourceType.ORE);
        const upgradePrice = toLowBN(await buildingInstance.getUpgradePrice(buildingLevelBefore + 1));
        expect(oreQuantityBefore).gte(upgradePrice, 'Ore quantity is not correct');

        await expect(
          buildingInstance.upgradeAdvancedProduction(testUser2).then((tx) => tx.wait())
        ).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'ERC20: insufficient allowance'");
    }
}
