import {DeployFunction} from "hardhat-deploy/types";
import { getNamedAccounts } from "hardhat";
import {ensureSettlementCreated} from "../shared/fixtures/common/ensureSettlementCreated";
import { RegionHelper } from '../shared/helpers/RegionHelper';

const func: DeployFunction = async function () {
    const { testUser4 } = await getNamedAccounts();

    const settlementsCount = 40;
    const positions = await RegionHelper.getPositionsForSettlementsByRegionNumber(1, settlementsCount);

    for (let i = 0; i < positions.length; i++) {
        await ensureSettlementCreated(testUser4, positions[i], `testBanner${i + 1}`);
    }
};

func.tags = ["40Settlements"];
func.dependencies = ["ImmediatelyStartedGame"];
export default func;
