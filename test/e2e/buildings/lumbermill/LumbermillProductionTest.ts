import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { BuildingType } from "../../../../shared/enums/buildingType";
import { ProductionCoreTest } from "../../../core/ProductionCoreTest";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Lumbermill Production Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`testUser1 can produce resources by Lumbermill. /basicProducedRes, advancedProducedRes, totalProducedRes/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.productionTest(2, BuildingType.LUMBERMILL));
  });

  it(`testUser1 can harvest resources produced by Lumbermill. /prosperityBalance, treasuryBalance, userResources/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.harvestTest(BuildingType.LUMBERMILL));
  });

  it(`testUser1's Lumbermill production slowed by production penalty. /productionSlowdownPercentage, userResources, userBuildingResources/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.productionWithPenaltyTest(BuildingType.LUMBERMILL));
  });

  it(`testUser1 can withdraw resources during production by Lumbermill. /userBuildingSpendingResources, produceTimeLeft/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.resourceWithdrawDuringProductionTest(BuildingType.LUMBERMILL));
  });
});
