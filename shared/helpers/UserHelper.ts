import {ethers} from "hardhat";
import {Banners__factory, Settlement, Settlement__factory} from "../../typechain-types";
import {WorldHelper} from "./WorldHelper";
import { DEFAULT_BANNER_PARTS } from '../constants/banners';

export class UserHelper {
    public static async getBannersInstance(
        userAddress: string
    ) {
        const signer = await ethers.getSigner(userAddress);

        const worldInstance = await WorldHelper.getWorldInstance();

        const bannersAddress = await worldInstance.bannerContract();
        return Banners__factory.connect(bannersAddress, signer);
    }

    public static async getUserBanners(
        userAddress: string
    ) {
        const bannersInstance = await this.getBannersInstance(userAddress);
        return await bannersInstance.getTokenIdsByAddress(userAddress);
    }

    public static async getUserSettlementsViaBanners(
        userAddress: string
    ) {
        const userBanners = await this.getUserBanners(userAddress);
        const currentEraInstance = await WorldHelper.getCurrentEraInstance();

        return await Promise.all(
            userBanners.map(async (tokenId) => {
                return await currentEraInstance.settlementByBannerId(tokenId.toString());
            })
        );
    }

    public static async mintBanner(
        userAddress: string,
        bannerName: string
    ) {
        const bannersInstance = await this.getBannersInstance(userAddress);
        await bannersInstance.mint(bannerName, DEFAULT_BANNER_PARTS, "0x").then((tx) => tx.wait());
    }

    public static async getUserSettlementByNumber(
        userAddress: string,
        settlementNumber: number
    ): Promise<Settlement> {
        const signer = await ethers.getSigner(userAddress);

        const userSettlements = await this.getUserSettlementsViaBanners(userAddress);
        const userSettlement = userSettlements[settlementNumber - 1];

        return Settlement__factory.connect(userSettlement, signer);
    }
}
