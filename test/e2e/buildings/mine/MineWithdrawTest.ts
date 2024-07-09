import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { WorkersCoreTest } from "../../../core/WorkersCoreTest";
import { ResourceCoreTest } from "../../../core/ResourceCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Mine Withdraw Test", async function () {
    beforeEach(async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
    });

    it(`testUser1 can withdraw workers from Mine. /assignedWorkers, unassignedWorkers/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.workersWithdrawTest(BuildingType.MINE));
    });

    it(`testUser1 can not withdraw workers more than assigned into Mine`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.impossibleWorkersWithdrawMoreThanAssignedTest(BuildingType.MINE));
    });

    it(`testUser1 can withdraw resources from Mine. /userResources, userBuildingResources, regionCorruptionIndex/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.resourceWithdrawTest(BuildingType.MINE))
    });

    it(`testUser1 can not withdraw resources more than assigned into Mine`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.impossibleResourceWithdrawMoreThanAssignedTest(BuildingType.MINE));
    });
});
