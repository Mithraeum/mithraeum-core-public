import { deployments, getNamedAccounts } from "hardhat";
import { ensureSettlementCreated } from "./common/ensureSettlementCreated";
import { DEFAULT_BANNER_NAME } from "../constants/banners";
import { RegionHelper } from '../helpers/RegionHelper';

export const WithSettlements = deployments.createFixture(async () => {
    await deployments.fixture("ImmediatelyStartedGame");

    const {testUser1, testUser2, testUser3} = await getNamedAccounts();
    const positions = await RegionHelper.getPositionsForSettlementsByRegionNumber(1, 3);

    console.log("Settlements deployment started");
    await ensureSettlementCreated(testUser1, positions[0], DEFAULT_BANNER_NAME);
    await ensureSettlementCreated(testUser2, positions[1], DEFAULT_BANNER_NAME);
    await ensureSettlementCreated(testUser3, positions[2], DEFAULT_BANNER_NAME);
    console.log("Settlements deployment finished");
});
