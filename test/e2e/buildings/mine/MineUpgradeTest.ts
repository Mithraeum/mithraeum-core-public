import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { BuildingUpgradeCoreTest } from "../../../core/BuildingUpgradeCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import { WithSettlements } from "../../../../shared/fixtures/WithSettlements";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Mine Upgrade Test", async function () {
    it(`testUser1 can basic upgrade Mine. /woodQuantity, basicProductionLevel, buildingLevel, treasuryCap/`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingBasicUpgradeTest(10, BuildingType.MINE));
    });

    it(`testUser1 can advanced upgrade Mine. /oreQuantity, advancedProductionLevel, buildingLevel, workersCap, treasuryCap/`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingAdvancedUpgradeTest(10, BuildingType.MINE));
    });

    it(`testUser1 can not basic upgrade Mine without resources`, async function () {
        this.timeout(1_000_000);
        await WithSettlements();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingBasicUpgradeWithoutResourcesTest(BuildingType.MINE));
    });

    it(`testUser1 can not advanced upgrade Mine without resources`, async function () {
        this.timeout(1_000_000);
        await WithSettlements();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingAdvancedUpgradeWithoutResourcesTest(BuildingType.MINE));
    });

    it(`testUser1 can not upgrade Mine during cooldown`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingUpgradeDuringCooldownTest(BuildingType.MINE));
    });

    it(`testUser1 can basic upgrade Mine by another user resources. /woodQuantity, basicProductionLevel, buildingLevel, treasuryCap/`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingBasicUpgradeByAnotherUserResourcesTest(BuildingType.MINE));
    });

    it(`testUser1 can advanced upgrade Mine by another user resources. /oreQuantity, advancedProductionLevel, buildingLevel, workersCap, treasuryCap/`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingAdvancedUpgradeByAnotherUserResourcesTest(BuildingType.MINE));
    });

    it(`testUser1 can not basic upgrade Mine by another user resources without approve`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingBasicUpgradeByAnotherUserResourcesWithoutApproveTest(BuildingType.MINE));
    });

    it(`testUser1 can not advanced upgrade Mine by another user resources without approve`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingAdvancedUpgradeByAnotherUserResourcesWithoutApproveTest(BuildingType.MINE));
    });
});
