import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { WorkersCoreTest } from "../../../core/WorkersCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";
import {ResourceCoreTest} from "../../../core/ResourceCoreTest";

describe("Farm Assign Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`testUser1 can assign workers into Farm. /assignedWorkers, unassignedWorkers/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.workersAssignTest(BuildingType.FARM))
  });

  it(`testUser1 can not assign more workers than max cap of Farm`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.impossibleWorkersAssignMoreThanMaxCapTest(BuildingType.FARM))
  });

  it(`testUser1 can assign resources into Farm treasury. /userResources, userBuildingResources/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.treasuryResourceAssignTest(BuildingType.FARM));
  });
});
