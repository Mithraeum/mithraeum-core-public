import {DeployFunction} from "hardhat-deploy/types";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {MithraeumConfig} from "../types/MithraeumConfig";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const mithraeumConfig = (<any>hre.network.config).mithraeumConfig as MithraeumConfig;
    if (mithraeumConfig.MULTICALL3_ADDRESS !== null) {
        console.log(`Deploying multicall not required`);
        return;
    }

    console.log(`Network ${hre.network.name}, deploying multicall contract`);

    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;
    const {worldDeployer} = await getNamedAccounts();

    const multicall3Deployment = await deploy("Multicall3", {
        from: worldDeployer,
        log: true,
    });

    mithraeumConfig.MULTICALL3_ADDRESS = multicall3Deployment.address;
    console.log(`MULTICALL3_ADDRESS defined`);
};

func.tags = ["MulticallDefiner"];
export default func;
