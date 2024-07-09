import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { WorkersCoreTest } from "../../../core/WorkersCoreTest";
import { ResourceCoreTest } from "../../../core/ResourceCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Smithy Assign Test", async function () {
    beforeEach(async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
    });

    it(`testUser1 can assign workers into Smithy. /assignedWorkers, unassignedWorkers/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.workersAssignTest(BuildingType.SMITHY));
    });

    it(`testUser1 can not assign more workers than max cap of Smithy`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.impossibleWorkersAssignMoreThanMaxCapTest(BuildingType.SMITHY));
    });

    it(`testUser1 can assign resources into Smithy. /userResources, userBuildingResources, regionCorruptionIndex/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.resourceAssignTest(BuildingType.SMITHY, true));
    });

    it(`testUser1 can not assign more resources than available into Smithy`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.impossibleResourceAssignMoreThanAvailableTest(BuildingType.SMITHY));
    });

    it(`testUser1 can assign resources from another user into Smithy. /userResources, userBuildingResources, regionCorruptionIndex/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.resourceAssignFromAnotherUserTest(BuildingType.SMITHY));
    });

    it(`testUser1 can not assign resources from another user into Smithy without approve`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.impossibleResourceAssignFromAnotherUserWithoutApproveTest(BuildingType.SMITHY));
    });

    it(`testUser1 can assign resources into Smithy treasury. /userResources, userBuildingResources/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.treasuryResourceAssignTest(BuildingType.SMITHY));
    });

    it(`testUser1 can assign resources into Smithy after battle versus cultists. /cultistAmount, productionRateWithPenaltyMultiplier, userResources, userBuildingResources/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.resourceAssignAfterBattleVersusCultistsTest(BuildingType.SMITHY));
    });
});
