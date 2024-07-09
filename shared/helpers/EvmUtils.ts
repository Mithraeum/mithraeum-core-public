import {ethers, network} from "hardhat";
import { _1e18, toLowBN } from "../../scripts/utils/const";
import BigNumber from "bignumber.js";

export class EvmUtils {
    public static async increaseTime(
      time: number
    ) {
        await network.provider.send("evm_increaseTime", [time]);
        await network.provider.send("evm_mine");
    }

    public static async getCurrentBlock() {
        return await ethers.provider.getBlockNumber();
    }

    public static async getBlockTimestamp(
      blockNumber: number
    ) {
        return (await ethers.provider.getBlock(blockNumber))!.timestamp;
    }

    public static async getBalance(
      address: string
    ) {
        return toLowBN(await ethers.provider.getBalance(address));
    }

    public static async increaseBalance(
      address: string,
      amount: BigNumber
    ) {
        const currentBalance = await this.getBalance(address);
        const newBalance = currentBalance.plus(amount);
        await network.provider.send(
          'hardhat_setBalance',
          [address, '0x' + newBalance.multipliedBy(_1e18).toString(16)]
        );
    }

    public static async decreaseBalance(
      address: string,
      amount: BigNumber
    ) {
        const currentBalance = await this.getBalance(address);
        const newBalance = currentBalance.minus(amount);
        await network.provider.send(
          'hardhat_setBalance',
          [address, '0x' + newBalance.multipliedBy(_1e18).toString(16)]
        );
    }

    public static async getCurrentTime() {
        return (await ethers.provider.getBlock("latest"))!.timestamp;
    }
}
