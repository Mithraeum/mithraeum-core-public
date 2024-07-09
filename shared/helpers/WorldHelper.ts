import {deployments, ethers, getNamedAccounts} from "hardhat";
import {
    Era__factory,
    EraView__factory,
    Geography__factory,
    CrossErasMemory__factory,
    Prosperity__factory,
    Registry__factory,
    RewardPool__factory,
    SettlementsListings,
    SettlementsListings__factory,
    World__factory,
    StubERC20__factory, IERC1155__factory
} from '../../typechain-types';
import { EvmUtils } from './EvmUtils';

export class WorldHelper {
    public static async getWorldInstance(
      asAddress?: string
    ) {
        if (!asAddress) {
            const { worldDeployer } = await getNamedAccounts();
            asAddress = worldDeployer;
        }

        const signer = await ethers.getSigner(asAddress);

        const worldAddress = (await deployments.get('WorldProxy')).address;
        return World__factory.connect(worldAddress, signer);
    }

    public static async getRegistryInstance() {
        const worldInstance = await this.getWorldInstance();

        const { worldDeployer } = await getNamedAccounts();
        const signer = await ethers.getSigner(worldDeployer);

        const registryAddress = await worldInstance.registry();
        return Registry__factory.connect(registryAddress, signer);
    }

    public static async getCrossErasMemoryInstance() {
        const worldInstance = await this.getWorldInstance();

        const { worldDeployer } = await getNamedAccounts();
        const signer = await ethers.getSigner(worldDeployer);

        const crossErasMemoryAddress = await worldInstance.crossErasMemory();
        return CrossErasMemory__factory.connect(crossErasMemoryAddress, signer);
    }

    public static async getCurrentEraNumber() {
        const worldInstance = await this.getWorldInstance();
        return await worldInstance.currentEraNumber();
    }

    public static async getCurrentEraInstance() {
        const worldInstance = await this.getWorldInstance();

        const { worldDeployer } = await getNamedAccounts();
        const signer = await ethers.getSigner(worldDeployer);

        const currentEraNumber = await worldInstance.currentEraNumber();
        const currentEraAddress = await worldInstance.eras(currentEraNumber);

        return Era__factory.connect(currentEraAddress, signer);
    }

    public static async getCurrentEraCreationTime() {
        const currentEraInstance = await this.getCurrentEraInstance();
        return Number(await currentEraInstance.creationTime());
    }

    public static async getProsperityInstance() {
        const { worldDeployer } = await getNamedAccounts();
        const signer = await ethers.getSigner(worldDeployer);

        const era = await this.getCurrentEraInstance();

        const prosperityAddress = await era.prosperity();
        return Prosperity__factory.connect(prosperityAddress, signer);
    }

    public static async getRewardPoolInstance(
      asAddress?: string
    ) {
        if (!asAddress) {
            const { worldDeployer } = await getNamedAccounts();
            asAddress = worldDeployer;
        }

        const signer = await ethers.getSigner(asAddress);

        const worldInstance = await this.getWorldInstance();

        const rewardPoolAddress = await worldInstance.rewardPool();
        return RewardPool__factory.connect(rewardPoolAddress, signer);
    }

    public static async getGameResources() {
        const registryInstance = await this.getRegistryInstance();
        return (await registryInstance.getGameResources()).map(value => value.resourceTypeId);
    }

    public static async getGameUnits() {
        const registryInstance = await this.getRegistryInstance();
        return (await registryInstance.getGameUnits()).map(value => value.unitTypeId);
    }

    public static async mintWorkers(
      amount: string,
      to: string
    ) {
        const worldInstance = await this.getWorldInstance();
        const currentEraNumber = await this.getCurrentEraNumber();

        return await worldInstance
          .mintWorkers(
            currentEraNumber,
            to,
            amount,
          )
          .then((tx) => tx.wait());
    }

    public static async mintResource(
      resourceTypeId: string,
      amount: string,
      to: string
    ) {
        const worldInstance = await this.getWorldInstance();
        const currentEraNumber = await this.getCurrentEraNumber();

        return await worldInstance
          .mintResources(
            currentEraNumber,
            resourceTypeId,
            to,
            amount,
          )
          .then((tx) => tx.wait());
    }

    public static async getEraViewInstance() {
        const { worldDeployer } = await getNamedAccounts();
        const signer = await ethers.getSigner(worldDeployer);

        const eraViewAddress = (await deployments.get('EraView')).address;
        return EraView__factory.connect(eraViewAddress, signer);
    }

    public static async getGeographyInstance(
        asAddress?: string
    ) {
        if (!asAddress) {
            const { worldDeployer } = await getNamedAccounts();
            asAddress = worldDeployer;
        }

        const signer = await ethers.getSigner(asAddress);

        const worldInstance = await this.getWorldInstance();
        const geographyAddress = await worldInstance.geography();
        return Geography__factory.connect(geographyAddress, signer);
    }

    public static async getSettlementsListingsInstance(
      asAddress?: string
    ) {
        if (!asAddress) {
            const { worldDeployer } = await getNamedAccounts();
            asAddress = worldDeployer;
        }

        const signer = await ethers.getSigner(asAddress);

        const settlementsListingsAddress = (await deployments.get("SettlementsListings")).address;
        return SettlementsListings__factory.connect(settlementsListingsAddress, signer);
    }

    public static async getErc20ForRegionInclusionInstance(
        asAddress?: string
    ) {
        if (!asAddress) {
            const { worldDeployer } = await getNamedAccounts();
            asAddress = worldDeployer;
        }

        const signer = await ethers.getSigner(asAddress);

        const erc20ForRegionInclusionAddress = (await deployments.get('StubERC20ForRegionInclusion')).address;
        return StubERC20__factory.connect(erc20ForRegionInclusionAddress, signer);
    }

    public static async getSharesInstance(
        userAddress: string
    ) {
        const worldInstance = await this.getWorldInstance();
        const signer = await ethers.getSigner(userAddress);

        const sharesAddress = await worldInstance.distributions();
        return IERC1155__factory.connect(sharesAddress, signer);
    }

    public static async passToEraDestructionInterval() {
        const registryInstance = await this.getRegistryInstance();

        const currentEraCreationTime = await this.getCurrentEraCreationTime();
        const currentTime = await EvmUtils.getCurrentTime();
        const passedTime = currentTime - currentEraCreationTime;

        const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
        const destructionTime = Number(await registryInstance.getCultistsNoDestructionDelay());

        await EvmUtils.increaseTime(destructionTime - passedTime % summonDelay + 10);
    }
}
