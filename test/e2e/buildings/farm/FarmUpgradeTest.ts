import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { BuildingUpgradeCoreTest } from "../../../core/BuildingUpgradeCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import { WithSettlements } from "../../../../shared/fixtures/WithSettlements";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Farm Upgrade Test", async function () {
  it(`testUser1 can basic upgrade Farm. /woodQuantity, basicProductionLevel, buildingLevel, treasuryCap/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingBasicUpgradeTest(10, BuildingType.FARM));
  });

  it(`testUser1 can advanced upgrade Farm. /oreQuantity, advancedProductionLevel, buildingLevel, workersCap, treasuryCap/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingAdvancedUpgradeTest(10, BuildingType.FARM));
  });

  it(`testUser1 can not basic upgrade Farm without resources`, async function () {
    this.timeout(1_000_000);
    await WithSettlements();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingBasicUpgradeWithoutResourcesTest(BuildingType.FARM));
  });

  it(`testUser1 can not advanced upgrade Farm without resources`, async function () {
    this.timeout(1_000_000);
    await WithSettlements();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingAdvancedUpgradeWithoutResourcesTest(BuildingType.FARM));
  });

  it(`testUser1 can not upgrade Farm during cooldown`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingUpgradeDuringCooldownTest(BuildingType.FARM));
  });

  it(`testUser1 can basic upgrade Farm by another user resources. /woodQuantity, basicProductionLevel, buildingLevel, treasuryCap/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingBasicUpgradeByAnotherUserResourcesTest(BuildingType.FARM));
  });

  it(`testUser1 can advanced upgrade Farm by another user resources. /oreQuantity, advancedProductionLevel, buildingLevel, workersCap, treasuryCap/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.buildingAdvancedUpgradeByAnotherUserResourcesTest(BuildingType.FARM));
  });

  it(`testUser1 can not basic upgrade Farm by another user resources without approve`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingBasicUpgradeByAnotherUserResourcesWithoutApproveTest(BuildingType.FARM));
  });

  it(`testUser1 can not advanced upgrade Farm by another user resources without approve`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingAdvancedUpgradeByAnotherUserResourcesWithoutApproveTest(BuildingType.FARM));
  });
});
