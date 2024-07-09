import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { BuildingUpgradeCoreTest } from "../../../core/BuildingUpgradeCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import { WithSettlements } from "../../../../shared/fixtures/WithSettlements";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Smithy Upgrade Test", async function () {
    it(`testUser1 can basic upgrade Smithy. /woodQuantity, basicProductionLevel, buildingLevel, treasuryCap/`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingBasicUpgradeTest(10, BuildingType.SMITHY));
    });

    it(`testUser1 can advanced upgrade Smithy. /oreQuantity, advancedProductionLevel, buildingLevel, workersCap, treasuryCap/`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingAdvancedUpgradeTest(10, BuildingType.SMITHY));
    });

    it(`testUser1 can not basic upgrade Smithy without resources`, async function () {
        this.timeout(1_000_000);
        await WithSettlements();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingBasicUpgradeWithoutResourcesTest(BuildingType.SMITHY));
    });

    it(`testUser1 can not advanced upgrade Smithy without resources`, async function () {
        this.timeout(1_000_000);
        await WithSettlements();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingAdvancedUpgradeWithoutResourcesTest(BuildingType.SMITHY));
    });

    it(`testUser1 can not upgrade Smithy during cooldown`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingUpgradeDuringCooldownTest(BuildingType.SMITHY));
    });

    it(`testUser1 can basic upgrade Smithy by another user resources. /woodQuantity, basicProductionLevel, buildingLevel, treasuryCap/`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingBasicUpgradeByAnotherUserResourcesTest(BuildingType.SMITHY));
    });

    it(`testUser1 can advanced upgrade Smithy by another user resources. /oreQuantity, advancedProductionLevel, buildingLevel, workersCap, treasuryCap/`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingAdvancedUpgradeByAnotherUserResourcesTest(BuildingType.SMITHY));
    });

    it(`testUser1 can not basic upgrade Smithy by another user resources without approve`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingBasicUpgradeByAnotherUserResourcesWithoutApproveTest(BuildingType.SMITHY));
    });

    it(`testUser1 can not advanced upgrade Smithy by another user resources without approve`, async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
        await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingAdvancedUpgradeByAnotherUserResourcesWithoutApproveTest(BuildingType.SMITHY));
    });
});
