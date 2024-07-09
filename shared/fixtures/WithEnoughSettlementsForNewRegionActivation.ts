import {deployments, getNamedAccounts} from "hardhat";
import {ensureSettlementCreated} from "./common/ensureSettlementCreated";
import { RegionHelper } from '../helpers/RegionHelper';

export const WithEnoughSettlementsForNewRegionActivation = deployments.createFixture(async () => {
    await deployments.fixture("ImmediatelyStartedGame");

    const { testUser4 } = await getNamedAccounts();

    const settlementsCount = 20;
    const positions = await RegionHelper.getPositionsForSettlementsByRegionNumber(1, settlementsCount);

    console.log("Settlements deployment started");
    for (let i = 0; i < positions.length; i++) {
        await ensureSettlementCreated(testUser4, positions[i], `testBanner${i + 1}`);
    }
    console.log("Settlements deployment finished");
});
