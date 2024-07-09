import { ethers } from "hardhat";
import {
  IERC20__factory
} from "../../typechain-types";
import { EvmUtils } from "./EvmUtils";
import { toLowBN } from "../../scripts/utils/const";
import { BigNumberish } from "ethers";

export class TokenUtils {
  public static async getTokenBalance(
    tokenAddress: string,
    userAddress: string
  ) {
    const signer = await ethers.getSigner(userAddress);

    if (tokenAddress === ethers.ZeroAddress) {
      return EvmUtils.getBalance(userAddress);
    }

    const iErc20Instance = IERC20__factory.connect(tokenAddress, signer);
    return toLowBN(await iErc20Instance.balanceOf(userAddress));
  }

  public static async approveTokens(
    ownerAddress: string,
    tokenAddress: string,
    tokenAmount: BigNumberish,
    receiverAddress: string
  ) {
    const signer = await ethers.getSigner(ownerAddress);

    const tokenInstance = IERC20__factory.connect(tokenAddress, signer);
    await tokenInstance.approve(receiverAddress, tokenAmount).then((tx) => tx.wait());
  }
}

