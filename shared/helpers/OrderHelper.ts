import { ethers } from "hardhat";
import { WorldHelper } from "./WorldHelper";
import { transferableFromLowBN } from "../../scripts/utils/const";
import BigNumber from "bignumber.js";
import {AddressLike, BigNumberish} from "ethers";
import { UserHelper } from "./UserHelper";
import { SettlementsListings } from "../../typechain-types";

export class OrderHelper {
  public static async createOrder(
    userAddress: string,
    settlementNumber: number,
    tokenAddress: string,
    orderPrice: number,
    allowedAddressToAcceptOrder: AddressLike,
    orderStartTime: BigNumberish,
    orderEndTime: BigNumberish
  ) {
    const settlementsListingsInstance = await WorldHelper.getSettlementsListingsInstance(userAddress);

    const userBanners = await UserHelper.getUserBanners(userAddress);
    const bannerId = userBanners[settlementNumber - 1];

    await settlementsListingsInstance.createOrder(
      bannerId,
      tokenAddress,
      transferableFromLowBN(new BigNumber(orderPrice)),
        allowedAddressToAcceptOrder,
        orderStartTime,
        orderEndTime
    ).then((tx) => tx.wait());
  }

  public static async acceptOrder(
    userAddress: string,
    orderId: BigNumberish,
    minBuildingsSharesToReceive: SettlementsListings.SharesInfoStruct[],
    tokenAddress: string,
    orderPrice: number
  ) {
    const settlementsListingsInstance = await WorldHelper.getSettlementsListingsInstance(userAddress);

    await settlementsListingsInstance.acceptOrder(
      orderId,
      minBuildingsSharesToReceive,
      tokenAddress === ethers.ZeroAddress
        ? {value: transferableFromLowBN(new BigNumber(orderPrice))}
        : {}
    ).then((tx) => tx.wait());
  }

  public static async getOrderStatus(
    userAddress: string,
    orderId: BigNumberish
  ) {
    const settlementsListingsInstance = await WorldHelper.getSettlementsListingsInstance(userAddress);
    return Number((await settlementsListingsInstance.orders(orderId)).status);
  }
}

