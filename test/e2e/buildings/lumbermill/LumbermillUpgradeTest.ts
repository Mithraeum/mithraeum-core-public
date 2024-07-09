import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { BuildingUpgradeCoreTest } from "../../../core/BuildingUpgradeCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import { WithSettlements } from "../../../../shared/fixtures/WithSettlements";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Lumbermill Upgrade Test", async function () {
    it(`testUser1 can basic upgrade Lumbermill. /woodQuantity, basicProductionLevel, buildingLevel, treasuryCap/`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingBasicUpgradeTest(10, BuildingType.LUMBERMILL));
    });

    it(`testUser1 can advanced upgrade Lumbermill. /oreQuantity, advancedProductionLevel, buildingLevel, workersCap, treasuryCap/`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingAdvancedUpgradeTest(10, BuildingType.LUMBERMILL));
    });

    it(`testUser1 can not basic upgrade Lumbermill without resources`, async function () {
        this.timeout(1_000_000);
        await WithSettlements();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingBasicUpgradeWithoutResourcesTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can not advanced upgrade Lumbermill without resources`, async function () {
        this.timeout(1_000_000);
        await WithSettlements();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingAdvancedUpgradeWithoutResourcesTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can not upgrade Lumbermill during cooldown`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingUpgradeDuringCooldownTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can basic upgrade Lumbermill by another user resources. /woodQuantity, basicProductionLevel, buildingLevel, treasuryCap/`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingBasicUpgradeByAnotherUserResourcesTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can advanced upgrade Lumbermill by another user resources. /oreQuantity, advancedProductionLevel, buildingLevel, workersCap, treasuryCap/`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingAdvancedUpgradeByAnotherUserResourcesTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can not basic upgrade Lumbermill by another user resources without approve`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingBasicUpgradeByAnotherUserResourcesWithoutApproveTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can not advanced upgrade Lumbermill by another user resources without approve`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingAdvancedUpgradeByAnotherUserResourcesWithoutApproveTest(BuildingType.LUMBERMILL));
    });
});
