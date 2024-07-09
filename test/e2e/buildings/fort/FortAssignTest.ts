import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { WorkersCoreTest } from "../../../core/WorkersCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import { ResourceCoreTest } from "../../../core/ResourceCoreTest";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Fort Assign Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`testUser1 can assign workers into Fort. /assignedWorkers, unassignedWorkers/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.workersAssignTest(BuildingType.FORT));
  });

  it(`testUser1 can not assign more workers than max cap of Fort`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.impossibleWorkersAssignMoreThanMaxCapTest(BuildingType.FORT));
  });

  it(`testUser1 can assign resources into Fort. /userResources, userBuildingResources, regionCorruptionIndex/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.resourceAssignTest(BuildingType.FORT, true));
  });

  it(`testUser1 can not assign not acceptable resources into Fort`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.notAcceptableResourceAssignTest(BuildingType.FORT));
  });

  it(`testUser1 can not assign more resources than available into Fort`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.impossibleResourceAssignMoreThanAvailableTest(BuildingType.FORT));
  });

  it(`testUser1 can assign resources into Fort after battle versus cultists. /cultistAmount, productionRateWithPenaltyMultiplier, userResources, userBuildingResources/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.resourceAssignAfterBattleVersusCultistsTest(BuildingType.FORT));
  });
});
