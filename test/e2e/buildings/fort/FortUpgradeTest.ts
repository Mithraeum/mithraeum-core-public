import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { BuildingUpgradeCoreTest } from "../../../core/BuildingUpgradeCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import { WithSettlements } from "../../../../shared/fixtures/WithSettlements";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Fort Upgrade Test", async function () {
  it(`testUser1 can basic upgrade Fort. /woodQuantity, basicProductionLevel, buildingLevel, maxHealth/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.fortBasicUpgradeTest(10));
  });

  it(`testUser1 can advanced upgrade Fort. /oreQuantity, advancedProductionLevel, buildingLevel, workersCap, maxHealth/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.fortAdvancedUpgradeTest(10));
  });

  it(`testUser1 can not basic upgrade Fort without resources`, async function () {
    this.timeout(1_000_000);
    await WithSettlements();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingBasicUpgradeWithoutResourcesTest(BuildingType.FORT));
  });

  it(`testUser1 can not advanced upgrade Fort without resources`, async function () {
    this.timeout(1_000_000);
    await WithSettlements();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingAdvancedUpgradeWithoutResourcesTest(BuildingType.FORT));
  });

  it(`testUser1 can not upgrade Fort during cooldown`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingUpgradeDuringCooldownTest(BuildingType.FORT));
  });

  it(`testUser1 can basic upgrade Fort by another user resources. /woodQuantity, basicProductionLevel, buildingLevel, maxHealth/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.fortBasicUpgradeByAnotherUserResourcesTest());
  });

  it(`testUser1 can advanced upgrade Fort by another user resources. /oreQuantity, advancedProductionLevel, buildingLevel, workersCap, maxHealth/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.fortAdvancedUpgradeByAnotherUserResourcesTest());
  });

  it(`testUser1 can not basic upgrade Fort by another user resources without approve`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingBasicUpgradeByAnotherUserResourcesWithoutApproveTest(BuildingType.FORT));
  });

  it(`testUser1 can not advanced upgrade Fort by another user resources without approve`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BuildingUpgradeCoreTest.impossibleBuildingAdvancedUpgradeByAnotherUserResourcesWithoutApproveTest(BuildingType.FORT));
  });
});
