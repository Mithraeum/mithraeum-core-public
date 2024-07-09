import {DeployFunction} from "hardhat-deploy/types";
import {EvmUtils} from "../shared/helpers/EvmUtils";
import {WorldHelper} from "../shared/helpers/WorldHelper";

const func: DeployFunction = async function () {
    const currentTime = Number(process.env.GAME_START_TIME) || await EvmUtils.getCurrentTime();

    const worldProxyInstance = await WorldHelper.getWorldInstance();
    const gameStartTime = Number(await worldProxyInstance.gameBeginTime());
    if (gameStartTime !== currentTime) {
        await worldProxyInstance.setGameBeginTime(currentTime);
    }

    console.log("Game start time set");
}

func.tags = ["ImmediatelyStartedGame"];
func.dependencies = ["WorldWithSingleRegion"];
export default func;
