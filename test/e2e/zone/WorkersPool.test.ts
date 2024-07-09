import { WithEnoughResources } from "../../../shared/fixtures/WithEnoughResources";
import { WorkersCoreTest } from "../../core/WorkersCoreTest";
import { NotYetStartedGame } from "../../../shared/fixtures/NotYetStartedGame";
import { WithSettlements } from "../../../shared/fixtures/WithSettlements";
import {runWithSavingGasUsage} from "../../tests-gas-usages-setup";

describe("Workers Pool Test", async function () {
  it(`worker price does not change before game started. /workerPrice/`, async function () {
    this.timeout(1_000_000);
    await NotYetStartedGame();
    await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.workerPriceBeforeGameStartedTest());
  });

  it(`testUser1 can not hire workers without prosperity`, async function () {
    this.timeout(1_000_000);
    await WithSettlements();
    await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.impossibleWorkersHireWithoutProsperityTest());
  });

  it(`testUser1 can not hire workers more than transaction limit`, async function () {
    this.timeout(1_000_000);
    await WithSettlements();
    await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.impossibleWorkersHireDueTransactionLimitTest());
  });

  it(`testUser1 can hire workers and price drop is correct`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await WorkersCoreTest.workersHireWithPriceDropTest(2));
  });
});
