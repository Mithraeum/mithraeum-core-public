import {DeployFunction} from "hardhat-deploy/types";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {MithraeumConfig} from "../types/MithraeumConfig";
import {ethers} from "hardhat";
import {StubERC20__factory} from "../typechain-types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const mithraeumConfig = (<any>hre.network.config).mithraeumConfig as MithraeumConfig;

    if (mithraeumConfig?.ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS) {
        console.log(`Network ${hre.network.name} already has ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS defined`);
        return;
    }

    console.log(`Network ${hre.network.name} does not have ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS defined, deploying`);

    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;
    const {worldDeployer} = await getNamedAccounts();
    const signer = await ethers.getSigner(worldDeployer);

    const deployment = await deploy("StubERC20ForSettlementPurchase", {
        contract: "StubERC20",
        from: worldDeployer,
        args: ["Stub Token", "SSP"],
        log: true,
    });

    mithraeumConfig.ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS = deployment.address;

    console.log(`ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS defined`);

    const settlementPurchaseToken = StubERC20__factory.connect(deployment.address, signer);
    const currentWorldDeployerBalance = await settlementPurchaseToken.balanceOf(worldDeployer);
    const amountToMint = BigInt(800_000_000) * BigInt(1e18);
    if (currentWorldDeployerBalance < amountToMint) {
        await settlementPurchaseToken.mintTo(worldDeployer, amountToMint);
        console.log(`ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS minted for worldDeployer`);
    } else {
        console.log(`ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS already minted for worldDeployer`)
    }
};

func.tags = ["ERC20ForSettlementPurchaseDefiner"];
export default func;
