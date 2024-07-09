import {DeployFunction} from "hardhat-deploy/types";
import {transferableFromLowBN} from "../scripts/utils/const";
import BigNumber from "bignumber.js";
import {WorldHelper} from "../shared/helpers/WorldHelper";

const func: DeployFunction = async function () {
    const worldProxyInstance = await WorldHelper.getWorldInstance();

    const currentEraNumber = await worldProxyInstance.currentEraNumber();

    const address = "0xB7C1044A6dBd372105fb7B12738e0Dd1971eBD0D";
    const resources = ["FOOD", "WOOD", "ORE", "INGOT"];

    for (let i = 0; i < resources.length; i++) {
        const resource = resources[i];

        const tx = await worldProxyInstance.mintResources(
            currentEraNumber,
            resource,
            address,
            transferableFromLowBN(new BigNumber(1000))
        );

        await tx.wait();
    }
};

func.tags = ["ResourceMinter"];
func.dependencies = ["ImmediatelyStartedGame"];
export default func;
