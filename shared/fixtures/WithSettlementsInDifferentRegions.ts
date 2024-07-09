import { deployments, getNamedAccounts } from "hardhat";
import { ensureSettlementCreated } from "./common/ensureSettlementCreated";
import { DEFAULT_BANNER_NAME } from "../constants/banners";
import {WorldWithExtraRegion} from "./WorldWithExtraRegion";
import { RegionHelper } from '../helpers/RegionHelper';

export const WithSettlementsInDifferentRegions = deployments.createFixture(async () => {
  await WorldWithExtraRegion();

  const { testUser1 } = await getNamedAccounts();

  console.log("Settlements deployment started");
  await ensureSettlementCreated(testUser1, await RegionHelper.getPositionForSettlementInRegionByNumber(1, 21), DEFAULT_BANNER_NAME);
  await ensureSettlementCreated(testUser1, await RegionHelper.getPositionForSettlementInRegionByNumber(2, 1), DEFAULT_BANNER_NAME);
  console.log("Settlements deployment finished");
});
