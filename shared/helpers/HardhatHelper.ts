import { ContractRunner } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

export class HardhatHelper {
  public static getRunnerAddress(
    runner: ContractRunner | null
  ) {
    return (runner as HardhatEthersSigner).address;
  }
}