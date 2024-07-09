import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { BuildingType } from "../../../../shared/enums/buildingType";
import { ProductionCoreTest } from "../../../core/ProductionCoreTest";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Smithy Production Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`testUser1 can produce resources by Smithy. /basicProducedRes, advancedProducedRes, totalProducedRes/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.productionTest(2, BuildingType.SMITHY));
  });

  it(`testUser1 can harvest resources produced by Smithy. /prosperityBalance, treasuryBalance, userResources/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.harvestTest(BuildingType.SMITHY))
  });

  it(`testUser1's Smithy production slowed by production penalty. /productionSlowdownPercentage, userResources, userBuildingResources/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.productionWithPenaltyTest(BuildingType.SMITHY));
  });

  it(`testUser1 can withdraw resources during production by Smithy. /userBuildingSpendingResources, produceTimeLeft/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.resourceWithdrawDuringProductionTest(BuildingType.SMITHY));
  });
});
