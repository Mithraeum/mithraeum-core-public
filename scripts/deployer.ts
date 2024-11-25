import {Deployment, DeployOptions, DeployResult, ProxyOptions} from "hardhat-deploy/dist/types";
import {sleep} from "./utils/const";
import {Signer} from "ethers";
import {SimpleProxy__factory} from "../typechain-types";
import {deployments, ethers} from "hardhat";
import BigNumber from "bignumber.js";

export interface SimpleContractDeployConfig {
    name: string,
    contract?: string,
    args?: any[],
    libraries?: { [key: string]: string },
}

let deploy: ((name: string, options: DeployOptions) => Promise<Deployment>) | null = null;
let deployer: string | null = null;

export function setupDeployer(
    _deploy: (name: string, options: DeployOptions) => Promise<Deployment>,
    _deployer: string,
) {
    deploy = _deploy;
    deployer = _deployer;
}

export const deployBatch = async (...contractDeployConfigs: (string | SimpleContractDeployConfig)[]): Promise<Deployment[]> => {
    if (!deploy || !deployer) {
        throw new Error("deployBatch not configured")
    }

    const result: Deployment[] = [];

    for (let i = 0; i < contractDeployConfigs.length; i++) {
        const config = contractDeployConfigs[i];

        if (typeof (config) === 'string') {
            const deployment = await deployWithRetries(
                5,
                config as string,
                {
                    from: deployer,
                    args: [],
                    log: true,
                }
            );

            result.push(deployment);
            console.log(`${config} deployed`);
        }

        if (typeof (config) === 'object') {
            const simpleContractDeployConfig = config as SimpleContractDeployConfig;
            const name = simpleContractDeployConfig.name;
            const args = simpleContractDeployConfig.args ?? [];
            const libraries = simpleContractDeployConfig.libraries;
            const contract = simpleContractDeployConfig.contract;

            const deployment = await deployWithRetries(
                5,
                name,
                {
                    contract: contract,
                    from: deployer,
                    args: args,
                    libraries: libraries,
                    log: true,
                }
            );

            result.push(deployment);
            console.log(`${name} deployed`);
        }
    }

    return result;
};

async function deployWithRetries(retriesCount: number, name: string, deployOptions: DeployOptions): Promise<Deployment> {
    while (retriesCount > 0) {
        try {
            return await deploy!(name, deployOptions);
        } catch (e) {
            console.log(`Retrying deployment: ${name}, retries left: ${retriesCount--}`);
            await sleep(5000);
        }
    }

    throw new Error("RETRIES_LIMIT_REACHED");
}

export const ensureRightImplementation = async (
    proxyDeployment: Deployment,
    implementationDeployment: Deployment,
    signer: Signer,
): Promise<boolean> => {
    const proxyInstance = SimpleProxy__factory.connect(proxyDeployment.address, signer);
    const position = ethers.id('mithraeum.simpleproxy');

    const implementationAddressInProxy = await signer.provider?.getStorage(proxyDeployment.address, position);
    if (implementationAddressInProxy === undefined) {
        return false;
    }

    // Slot value is always 32 bytes, but address is 20 bytes, we can compare 'addresses' as if they were big numbers
    if (new BigNumber(implementationAddressInProxy).eq(new BigNumber(implementationDeployment.address.toLowerCase()))) {
        return false;
    }

    const tx = await proxyInstance.setImplementation(implementationDeployment.address);
    await tx.wait();
    return true;
};
