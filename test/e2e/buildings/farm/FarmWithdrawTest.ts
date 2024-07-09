import { WithEnoughResources } from "../../../../shared/fixtures/WithEnoughResources";
import { WorkersCoreTest } from "../../../core/WorkersCoreTest";
import { BuildingType } from "../../../../shared/enums/buildingType";
import {runWithSavingGasUsage} from "../../../tests-gas-usages-setup";

describe("Farm Withdraw Test", async function () {
    beforeEach(async function () {
        this.timeout(1_000_000);
        await WithEnoughResources();
    });

    it(`testUser1 can withdraw workers from Farm. /assignedWorkers, unassignedWorkers/`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.workersWithdrawTest(BuildingType.FARM));
    });

    it(`testUser1 can not withdraw workers more than assigned into Farm`, async function () {
        this.timeout(1_000_000);
        await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.impossibleWorkersWithdrawMoreThanAssignedTest(BuildingType.FARM));
    });
});
