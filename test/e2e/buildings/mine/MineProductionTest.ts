import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { BuildingType } from "../../../../shared/enums/buildingType";
import { ProductionCoreTest } from "../../../core/ProductionCoreTest";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Mine Production Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`testUser1 can produce resources by Mine. /basicProducedRes, advancedProducedRes, totalProducedRes/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.productionTest(2, BuildingType.MINE));
  });

  it(`testUser1 can harvest resources produced by Mine. /prosperityBalance, treasuryBalance, userResources/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.harvestTest(BuildingType.MINE));
  });

  it(`testUser1's Mine production slowed by production penalty. /productionSlowdownPercentage, userResources, userBuildingResources/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.productionWithPenaltyTest(BuildingType.MINE));
  });

  it(`testUser1 can withdraw resources during production by Mine. /userBuildingSpendingResources, produceTimeLeft/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.resourceWithdrawDuringProductionTest(BuildingType.MINE));
  });
});
