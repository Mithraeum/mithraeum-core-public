import { EvmUtils } from "../../helpers/EvmUtils";
import { RegionHelper } from '../../helpers/RegionHelper';
import { UserHelper } from '../../helpers/UserHelper';

export const ensureSettlementCreated = async function (
  userAddress: string,
  position: bigint,
  name: string
) {
  await UserHelper.mintBanner(userAddress, name);
  console.log(`Banner ${name} created`);

  const regionId = await RegionHelper.getRegionIdByPosition(position);
  const regionInstance = await RegionHelper.getRegionInstanceById(regionId);

  const settlementCost = await RegionHelper.getNewSettlementCostByRegion(regionInstance);
  await EvmUtils.increaseBalance(userAddress, settlementCost);

  await RegionHelper.buySettlement(userAddress, regionId, position, settlementCost, settlementCost);
  console.log(`Settlement for ${userAddress} created`);
};
