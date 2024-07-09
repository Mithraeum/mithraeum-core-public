import {deployments} from "hardhat";
import {EvmUtils} from "../helpers/EvmUtils";
import { ONE_DAY_IN_SECONDS } from "../constants/time";
import { WorldHelper } from "../helpers/WorldHelper";

export const NotYetStartedGame = deployments.createFixture(async () => {
    await deployments.fixture("WorldWithSingleRegion");

    const currentTime = await EvmUtils.getCurrentTime();

    const worldProxyInstance = await WorldHelper.getWorldInstance();
    await worldProxyInstance.setGameBeginTime(currentTime + ONE_DAY_IN_SECONDS);

    console.log("Game start time set");
});
