import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { WorkersCoreTest } from "../../../core/WorkersCoreTest";
import { ResourceCoreTest } from "../../../core/ResourceCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Lumbermill Withdraw Test", async function () {
    beforeEach(async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
    });

    it(`testUser1 can withdraw workers from Lumbermill. /assignedWorkers, unassignedWorkers/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.workersWithdrawTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can not withdraw workers more than assigned into Lumbermill`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.impossibleWorkersWithdrawMoreThanAssignedTest(BuildingType.LUMBERMILL));
    });

    it(`testUser1 can withdraw resources from Lumbermill. /userResources, userBuildingResources, regionCorruptionIndex/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.resourceWithdrawTest(BuildingType.LUMBERMILL))
    });

    it(`testUser1 can not withdraw resources more than assigned into Lumbermill`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await ResourceCoreTest.impossibleResourceWithdrawMoreThanAssignedTest(BuildingType.LUMBERMILL));
    });
});
