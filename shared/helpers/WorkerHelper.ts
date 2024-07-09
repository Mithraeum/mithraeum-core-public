import { WorldHelper } from "./WorldHelper";
import {
  Settlement,
  Workers__factory,
  WorkersPool__factory,
  Region
} from "../../typechain-types";
import { toLowBN } from "../../scripts/utils/const";

export class WorkerHelper {
  public static async getUnassignedWorkerQuantity(
    settlementInstance: Settlement
  ) {
    const eraInstance = await WorldHelper.getCurrentEraInstance();
    const workerAddress = await eraInstance.workers();
    const workerInstance = Workers__factory.connect(workerAddress, settlementInstance.runner);

    return toLowBN(await workerInstance.balanceOf(await settlementInstance.getAddress()));
  }

  public static async getTotalWorkerPriceByRegion(
    regionInstance: Region,
    workerQuantity: number
  ) {
    const workersPoolAddress = await regionInstance.workersPool();
    const workersPoolInstance = WorkersPool__factory.connect(workersPoolAddress, regionInstance.runner);

    return toLowBN((await workersPoolInstance.calculateProsperityForExactWorkers(workerQuantity))[0]);
  }
}
