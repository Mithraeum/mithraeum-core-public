import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { BuildingType } from "../../../../shared/enums/buildingType";
import { ProductionCoreTest } from "../../../core/ProductionCoreTest";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Farm Production Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`testUser1 can produce resources by Farm. /basicProducedRes, totalProducedRes/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.productionTest(2, BuildingType.FARM));
  });

  it(`testUser1 can harvest resources produced by Farm. /prosperityBalance, treasuryBalance, userResources/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.harvestTest(BuildingType.FARM));
  });

  it(`testUser1's Farm production slowed by production penalty. /productionSlowdownPercentage, userResources, userBuildingResources/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.productionWithPenaltyTest(BuildingType.FARM));
  });
});
