import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { WorkersCoreTest } from "../../../core/WorkersCoreTest";
import { ResourceCoreTest } from "../../../core/ResourceCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Mine Assign Test", async function () {
    beforeEach(async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
    });

    it(`testUser1 can assign workers into Mine. /assignedWorkers, unassignedWorkers/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.workersAssignTest(BuildingType.MINE));
    });

    it(`testUser1 can not assign more workers than max cap of Mine`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.impossibleWorkersAssignMoreThanMaxCapTest(BuildingType.MINE));
    });

    it(`testUser1 can assign resources into Mine. /userResources, userBuildingResources, regionCorruptionIndex/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.resourceAssignTest(BuildingType.MINE, true));
    });

    it(`testUser1 can not assign more resources than available into Mine`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.impossibleResourceAssignMoreThanAvailableTest(BuildingType.MINE));
    });

    it(`testUser1 can not assign not acceptable resources into Mine`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.notAcceptableResourceAssignTest(BuildingType.MINE));
    });

    it(`testUser1 can assign resources from another user into Mine. /userResources, userBuildingResources, regionCorruptionIndex/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.resourceAssignFromAnotherUserTest(BuildingType.MINE));
    });

    it(`testUser1 can not assign resources from another user into Mine without approve`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.impossibleResourceAssignFromAnotherUserWithoutApproveTest(BuildingType.MINE));
    });

    it(`testUser1 can assign resources into Mine treasury. /userResources, userBuildingResources/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.treasuryResourceAssignTest(BuildingType.MINE));
    });

    it(`testUser1 can assign resources into Mine after battle versus cultists. /cultistAmount, productionRateWithPenaltyMultiplier, userResources, userBuildingResources/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.resourceAssignAfterBattleVersusCultistsTest(BuildingType.MINE));
    });
});