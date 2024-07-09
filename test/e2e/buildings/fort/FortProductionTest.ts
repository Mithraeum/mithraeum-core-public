import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { SiegeCoreTest } from "../../../core/SiegeCoreTest";
import { ProductionCoreTest } from "../../../core/ProductionCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Fort Production Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`testUser1 can repair own Fort. /fortHealth, userBuildingResources/`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.fortRepairmentTest());
  });

  it(`testUser1's Fort production is not slowed by production penalty. /regenerationPerSecond/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.fortRepairmentWithSummonedCultistsTest());
  });

  it(`testUser1 can withdraw resources during production by Fort. /userBuildingSpendingResources, produceTimeLeft/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.resourceWithdrawDuringProductionTest(BuildingType.FORT));
  });
});
