import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { WorkersCoreTest } from "../../../core/WorkersCoreTest";
import { ResourceCoreTest } from "../../../core/ResourceCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Lumbermill Assign Test", async function () {
    beforeEach(async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
    });

    it(`testUser1 can assign workers into Lumbermill. /assignedWorkers, unassignedWorkers/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.workersAssignTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can not assign more workers than max cap of Lumbermill`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.impossibleWorkersAssignMoreThanMaxCapTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can assign resources into Lumbermill. /userResources, userBuildingResources, regionCorruptionIndex/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.resourceAssignTest(BuildingType.LUMBERMILL, true));
    });

    it(`testUser1 can not assign more resources than available into Lumbermill`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.impossibleResourceAssignMoreThanAvailableTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can not assign not acceptable resources into Lumbermill`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.notAcceptableResourceAssignTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can assign resources from another user into Lumbermill. /userResources, userBuildingResources, regionCorruptionIndex/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.resourceAssignFromAnotherUserTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can not assign resources from another user into Lumbermill without approve`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.impossibleResourceAssignFromAnotherUserWithoutApproveTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can assign resources into Lumbermill treasury. /userResources, userBuildingResources/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.treasuryResourceAssignTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can assign resources into Lumbermill after battle versus cultists. /cultistAmount, productionRateWithPenaltyMultiplier, userResources, userBuildingResources/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.resourceAssignAfterBattleVersusCultistsTest(BuildingType.LUMBERMILL));
    });
});
