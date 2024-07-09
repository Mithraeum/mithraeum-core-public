import { UserHelper } from "../../helpers/UserHelper";
import { WorldHelper } from "../../helpers/WorldHelper";
import { transferableFromLowBN } from "../../../scripts/utils/const";
import BigNumber from "bignumber.js";

export const ensureEnoughResourcesSet = async function (
  userAddress: string
) {
  const settlersAmount = 100;

  const userSettlements = await UserHelper.getUserSettlementsViaBanners(userAddress);
  for (let i = 0; i < userSettlements.length; i++) {
    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(userAddress, i + 1);

    await WorldHelper.mintWorkers(
      transferableFromLowBN(new BigNumber(settlersAmount)),
      await userSettlementInstance.getAddress()
    );
    console.log(`Workers minted to ${userAddress} and its settlement № ${i + 1}`);
  }

  const resourcesAmount = 5000000;
  const resourceIds = await WorldHelper.getGameResources();

  for (let i = 0; i < resourceIds.length; i++) {
    await WorldHelper.mintResource(
      resourceIds[i],
      transferableFromLowBN(new BigNumber(resourcesAmount)),
      userAddress
    );
  }
  console.log(`Resources minted to ${userAddress}`);
}
