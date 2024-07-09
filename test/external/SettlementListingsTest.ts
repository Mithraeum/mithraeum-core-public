import { ethers, getNamedAccounts } from "hardhat";
import { UserHelper } from "../../shared/helpers/UserHelper";
import { TokenUtils } from "../../shared/helpers/TokenUtils";
import { toLowBN, transferableFromLowBN } from "../../scripts/utils/const";
import BigNumber from "bignumber.js";
import { expect } from "chai";
import { SharesHelper } from "../../shared/helpers/SharesHelper";
import { WorldHelper } from "../../shared/helpers/WorldHelper";
import { TokenType } from "../../shared/enums/tokenType";
import { OrderStatus } from "../../shared/enums/orderStatus";
import { BuildingType } from "../../shared/enums/buildingType";
import { BuildingHelper } from "../../shared/helpers/BuildingHelper";
import { OrderHelper } from "../../shared/helpers/OrderHelper";
import {ResourceHelper} from "../../shared/helpers/ResourceHelper";
import {ResourceType} from "../../shared/enums/resourceType";
import {EvmUtils} from "../../shared/helpers/EvmUtils";

export class SettlementListingsTest {
  public static async settlementOrderWithSharesTest(tokenType: string, buildings: BuildingType[]) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const settlementPrice = 30;
    const minSharesAmount = 40;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const worldInstance = await WorldHelper.getWorldInstance();
    const settlementsListingsInstance = await WorldHelper.getSettlementsListingsInstance(testUser1);
    const eraInstance = await WorldHelper.getCurrentEraInstance();
    const bannersInstance = await UserHelper.getBannersInstance(testUser1);
    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);

    const tokenAddress = tokenType === TokenType.BLESS
      ? await worldInstance.erc20ForSettlementPurchase()
      : await eraInstance.resources(ResourceHelper.getResourceTypeId((tokenType as string) as ResourceType));//ugly

    const tokenBalanceBefore1 = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const tokenBalanceBefore2 = await TokenUtils.getTokenBalance(tokenAddress, testUser2);

    await OrderHelper.createOrder(
        testUser1,
        1,
        tokenAddress,
        settlementPrice,
        ethers.ZeroAddress,
        transferableFromLowBN(new BigNumber(0)),
        transferableFromLowBN(new BigNumber(0))
    );
    const orderId = await settlementsListingsInstance.lastOrderId();

    const orderStatusBefore = await OrderHelper.getOrderStatus(testUser1, orderId);
    expect(orderStatusBefore).eql(OrderStatus.NEW, 'Order status is not correct');

    const sharesBalanceBefore1 = await SharesHelper.getSharesAmount(userSettlementInstance, testUser1, buildings);
    const sharesBalanceBefore2 = await SharesHelper.getSharesAmount(userSettlementInstance, testUser2, buildings);

    await bannersInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    await sharesInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    const minBuildingsSharesToReceive = buildings.map(buildingType => {
      const buildingTypeId = BuildingHelper.getBuildingTypeId(buildingType);
      return {buildingTypeId: buildingTypeId, minSharesAmount: minSharesAmount}
    });

    if (tokenAddress !== ethers.ZeroAddress) {
      await TokenUtils.approveTokens(testUser2, tokenAddress, ethers.MaxUint256, await settlementsListingsInstance.getAddress());
    }

    await OrderHelper.acceptOrder(testUser2, orderId, minBuildingsSharesToReceive, tokenAddress, settlementPrice);

    const expectedTokenBalance1 = tokenBalanceBefore1.plus(settlementPrice);
    const expectedTokenBalance2 = tokenBalanceBefore2.minus(settlementPrice);

    const actualTokenBalance1 = await TokenUtils.getTokenBalance(tokenAddress, testUser1);
    const actualTokenBalance2 = await TokenUtils.getTokenBalance(tokenAddress, testUser2);
    const actualSharesBalance1 = await SharesHelper.getSharesAmount(userSettlementInstance, testUser1, buildings);
    const actualSharesBalance2 = await SharesHelper.getSharesAmount(userSettlementInstance, testUser2, buildings);

    const orderStatusAfter = await OrderHelper.getOrderStatus(testUser2, orderId);
    expect(orderStatusAfter).eql(OrderStatus.ACCEPTED, 'Order status is not correct');
    expect(actualTokenBalance1).isInCloseRangeWith(expectedTokenBalance1, 'User token balance is not correct');
    expect(actualTokenBalance2).isInCloseRangeWith(expectedTokenBalance2, 'User token balance is not correct');

    for (let i = 0; i < buildings.length; i++) {
      expect(actualSharesBalance1[buildings[i]]).eql(
          sharesBalanceBefore1[buildings[i]]
              .minus(sharesBalanceBefore1[buildings[i]]), `testUser1 shares balance is not correct`);
      expect(actualSharesBalance2[buildings[i]]).eql(
          sharesBalanceBefore2[buildings[i]]
              .plus(sharesBalanceBefore1[buildings[i]]), `testUser2 shares balance is not correct`);
    }
  }

  public static async settlementOrderWithReducedSharesAmountTest() {
    const { testUser1, testUser2, testUser3 } = await getNamedAccounts();

    const sharesAmount = 40;
    const buildingType = BuildingType.LUMBERMILL;
    const settlementPrice = 30;
    const maxSharesAmount = 100;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const worldInstance = await WorldHelper.getWorldInstance();
    const settlementsListingsInstance = await WorldHelper.getSettlementsListingsInstance(testUser1);
    const bannersInstance = await UserHelper.getBannersInstance(testUser1);
    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

    const buildingDistributionId = await buildingInstance.distributionId();

    const sharesBalanceBefore1 = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType);
    const sharesBalanceBefore2 = await SharesHelper.getShareAmount(userSettlementInstance, testUser2, buildingType);
    const sharesBalanceBefore3 = await SharesHelper.getShareAmount(userSettlementInstance, testUser3, buildingType);

    expect(sharesBalanceBefore1).eql(new BigNumber(maxSharesAmount), 'Shares amount is not correct');
    expect(sharesBalanceBefore2).eql(new BigNumber(0), 'Shares amount is not correct');
    expect(sharesBalanceBefore3).eql(new BigNumber(0), 'Shares amount is not correct');

    await sharesInstance.safeTransferFrom(
        testUser1,
        testUser3,
        buildingDistributionId,
        sharesAmount,
        '0x'
    ).then((tx) => tx.wait());

    const sharesBalanceAfter1 = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType);
    const sharesBalanceAfter2 = await SharesHelper.getShareAmount(userSettlementInstance, testUser2, buildingType);
    const sharesBalanceAfter3 = await SharesHelper.getShareAmount(userSettlementInstance, testUser3, buildingType);

    expect(sharesBalanceAfter1).eql(sharesBalanceBefore1.minus(sharesAmount), 'Shares amount is not correct');
    expect(sharesBalanceAfter3).eql(sharesBalanceBefore3.plus(sharesAmount), 'Shares amount is not correct');

    const tokenAddress =  await worldInstance.erc20ForSettlementPurchase();

    await OrderHelper.createOrder(
        testUser1,
        1,
        tokenAddress,
        settlementPrice,
        ethers.ZeroAddress,
        transferableFromLowBN(new BigNumber(0)),
        transferableFromLowBN(new BigNumber(0))
    );
    const orderId = await settlementsListingsInstance.lastOrderId();

    await bannersInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    await sharesInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    const minBuildingsSharesToReceive = [
        {
          buildingTypeId: BuildingHelper.getBuildingTypeId(buildingType),
          minSharesAmount: maxSharesAmount - sharesAmount
        }
    ];

    await OrderHelper.acceptOrder(testUser2, orderId, minBuildingsSharesToReceive, tokenAddress, settlementPrice);

    const actualSharesBalance1 = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType);
    const actualSharesBalance2 = await SharesHelper.getShareAmount(userSettlementInstance, testUser2, buildingType);

    expect(actualSharesBalance1).eql(new BigNumber(0), 'Shares amount is not correct');
    expect(actualSharesBalance2).eql(sharesBalanceAfter2.plus(sharesBalanceAfter1), 'Shares amount is not correct');
  }

  public static async impossibleSettlementOrderWithLowerSharesAmountThanWasOnOrderCreationTest() {
    const { testUser1, testUser2, testUser3 } = await getNamedAccounts();

    const sharesAmount = 40;
    const buildingType = BuildingType.LUMBERMILL;
    const settlementPrice = 30;
    const maxSharesAmount = 100;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const worldInstance = await WorldHelper.getWorldInstance();
    const settlementsListingsInstance = await WorldHelper.getSettlementsListingsInstance(testUser1);
    const bannersInstance = await UserHelper.getBannersInstance(testUser1);
    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

    const buildingDistributionId = await buildingInstance.distributionId();

    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    await OrderHelper.createOrder(
        testUser1,
        1,
        tokenAddress,
        settlementPrice,
        ethers.ZeroAddress,
        transferableFromLowBN(new BigNumber(0)),
        transferableFromLowBN(new BigNumber(0))
    );
    const orderId = await settlementsListingsInstance.lastOrderId();

    const sharesBalanceBefore = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType);
    expect(sharesBalanceBefore).eql(new BigNumber(maxSharesAmount), 'Shares amount is not correct');

    await sharesInstance.safeTransferFrom(
        testUser1,
        testUser3,
        buildingDistributionId,
        sharesAmount,
        '0x'
    ).then((tx) => tx.wait());

    const sharesBalanceAfter = await SharesHelper.getShareAmount(userSettlementInstance, testUser1, buildingType);
    expect(sharesBalanceAfter).lt(new BigNumber(maxSharesAmount), 'Shares amount is not correct');

    await bannersInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    await sharesInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    const minBuildingsSharesToReceive = [
        {
          buildingTypeId: BuildingHelper.getBuildingTypeId(buildingType),
          minSharesAmount: maxSharesAmount
        }
    ];

    await expect(
      OrderHelper.acceptOrder(testUser2, orderId, minBuildingsSharesToReceive, tokenAddress, settlementPrice)
    ).to.be.revertedWith("CannotAcceptOrderWithSharesToReceiveLowerThanSpecified()");
  }

  public static async impossibleSettlementOrderWithSharesMoreThanMaxCapTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const settlementPrice = 30;
    const minSharesAmount = 110;
    const buildings = [BuildingType.FARM, BuildingType.LUMBERMILL, BuildingType.MINE, BuildingType.SMITHY];

    const worldInstance = await WorldHelper.getWorldInstance();
    const settlementsListingsInstance = await WorldHelper.getSettlementsListingsInstance(testUser1);
    const bannersInstance = await UserHelper.getBannersInstance(testUser1);
    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);

    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    await OrderHelper.createOrder(
        testUser1,
        1,
        tokenAddress,
        settlementPrice,
        ethers.ZeroAddress,
        transferableFromLowBN(new BigNumber(0)),
        transferableFromLowBN(new BigNumber(0))
    );
    const orderId = await settlementsListingsInstance.lastOrderId();

    await bannersInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    await sharesInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    const minBuildingsSharesToReceive = buildings.map(buildingType => {
      return {buildingTypeId: BuildingHelper.getBuildingTypeId(buildingType), minSharesAmount: minSharesAmount}
    });

    await expect(
      OrderHelper.acceptOrder(testUser2, orderId, minBuildingsSharesToReceive, tokenAddress, settlementPrice)
    ).to.be.revertedWith("CannotAcceptOrderWithSharesToReceiveLowerThanSpecified()");
  }

  public static async cancelSettlementOrderTest() {
    const { testUser1 } = await getNamedAccounts();

    const settlementPrice = 30;

    const worldInstance = await WorldHelper.getWorldInstance();
    const settlementsListingsInstance = await WorldHelper.getSettlementsListingsInstance(testUser1);

    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    await OrderHelper.createOrder(
        testUser1,
        1,
        tokenAddress,
        settlementPrice,
        ethers.ZeroAddress,
        transferableFromLowBN(new BigNumber(0)),
        transferableFromLowBN(new BigNumber(0))
    );
    const orderId = await settlementsListingsInstance.lastOrderId();

    const orderStatusBefore = await OrderHelper.getOrderStatus(testUser1, orderId);
    expect(orderStatusBefore).eql(OrderStatus.NEW, 'Order status is not correct');

    await settlementsListingsInstance.cancelOrder(orderId).then((tx) => tx.wait());

    const orderStatusAfter = await OrderHelper.getOrderStatus(testUser1, orderId);
    expect(orderStatusAfter).eql(OrderStatus.CANCELLED, 'Order status is not correct');
  }

  public static async modifySettlementOrderTest() {
    const { testUser1 } = await getNamedAccounts();

    const settlementPrice = 30;
    const newSettlementPrice = 50;

    const worldInstance = await WorldHelper.getWorldInstance();
    const settlementsListingsInstance = await WorldHelper.getSettlementsListingsInstance(testUser1);

    const tokenAddress = await worldInstance.erc20ForSettlementPurchase();

    await OrderHelper.createOrder(
        testUser1,
        1,
        tokenAddress,
        settlementPrice,
        ethers.ZeroAddress,
        transferableFromLowBN(new BigNumber(0)),
        transferableFromLowBN(new BigNumber(0))
    );
    const orderId = await settlementsListingsInstance.lastOrderId();

    const orderPriceBefore = toLowBN((await settlementsListingsInstance.orders(orderId)).price);
    expect(orderPriceBefore).eql(new BigNumber(settlementPrice), 'Order price is not correct');

    await settlementsListingsInstance.modifyOrder(
        orderId,
        tokenAddress,
        transferableFromLowBN(new BigNumber(newSettlementPrice)),
        ethers.ZeroAddress,
        transferableFromLowBN(new BigNumber(0)),
        transferableFromLowBN(new BigNumber(0))
    ).then((tx) => tx.wait());

    const orderPriceAfter = toLowBN((await settlementsListingsInstance.orders(orderId)).price);
    expect(orderPriceAfter).eql(new BigNumber(newSettlementPrice), 'Order price is not correct');
  }

  public static async impossibleSettlementOrderByNotAllowedAddressTest(tokenType: string, buildings: BuildingType[]) {
    const { testUser1, testUser2, testUser3 } = await getNamedAccounts();

    const settlementPrice = 30;
    const minSharesAmount = 40;

    const worldInstance = await WorldHelper.getWorldInstance();
    const settlementsListingsInstance = await WorldHelper.getSettlementsListingsInstance(testUser1);
    const eraInstance = await WorldHelper.getCurrentEraInstance();
    const bannersInstance = await UserHelper.getBannersInstance(testUser1);
    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);

    const tokenAddress = tokenType === TokenType.BLESS
        ? await worldInstance.erc20ForSettlementPurchase()
        : await eraInstance.resources(ResourceHelper.getResourceTypeId((tokenType as string) as ResourceType));

    await OrderHelper.createOrder(
        testUser1,
        1,
        tokenAddress,
        settlementPrice,
        testUser3,
        transferableFromLowBN(new BigNumber(0)),
        transferableFromLowBN(new BigNumber(0))
    );
    const orderId = await settlementsListingsInstance.lastOrderId();

    const orderStatusBefore = await OrderHelper.getOrderStatus(testUser1, orderId);
    expect(orderStatusBefore).eql(OrderStatus.NEW, 'Order status is not correct');

    await bannersInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    await sharesInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    const minBuildingsSharesToReceive = buildings.map(buildingType => {
      const buildingTypeId = BuildingHelper.getBuildingTypeId(buildingType);
      return {buildingTypeId: buildingTypeId, minSharesAmount: minSharesAmount}
    });

    if (tokenAddress !== ethers.ZeroAddress) {
      await TokenUtils.approveTokens(testUser2, tokenAddress, ethers.MaxUint256, await settlementsListingsInstance.getAddress());
    }

    const tokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser2);
    expect(tokenBalance).gte(new BigNumber(settlementPrice), 'Token balance is not correct');

    await expect(
        OrderHelper.acceptOrder(testUser2, orderId, minBuildingsSharesToReceive, tokenAddress, settlementPrice)
    ).to.be.revertedWith("CannotAcceptOrderByNotAllowedAddress()");
  }

  public static async impossibleSettlementOrderIfOrderNotStartedTest(tokenType: string, buildings: BuildingType[]) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const settlementPrice = 30;
    const minSharesAmount = 40;
    const orderTime = 30;

    const worldInstance = await WorldHelper.getWorldInstance();
    const settlementsListingsInstance = await WorldHelper.getSettlementsListingsInstance(testUser1);
    const eraInstance = await WorldHelper.getCurrentEraInstance();
    const bannersInstance = await UserHelper.getBannersInstance(testUser1);
    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);

    const tokenAddress = tokenType === TokenType.BLESS
        ? await worldInstance.erc20ForSettlementPurchase()
        : await eraInstance.resources(ResourceHelper.getResourceTypeId((tokenType as string) as ResourceType));

    const currentTime = await EvmUtils.getCurrentTime();
    const orderStartTime = currentTime + 10;
    const orderEndTime = orderStartTime + orderTime;

    await OrderHelper.createOrder(
        testUser1,
        1,
        tokenAddress,
        settlementPrice,
        testUser2,
        orderStartTime,
        orderEndTime
    );

    const orderId = await settlementsListingsInstance.lastOrderId();

    const orderStatusBefore = await OrderHelper.getOrderStatus(testUser1, orderId);
    expect(orderStatusBefore).eql(OrderStatus.NEW, 'Order status is not correct');

    await bannersInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    await sharesInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    const minBuildingsSharesToReceive = buildings.map(buildingType => {
      const buildingTypeId = BuildingHelper.getBuildingTypeId(buildingType);
      return {buildingTypeId: buildingTypeId, minSharesAmount: minSharesAmount}
    });

    if (tokenAddress !== ethers.ZeroAddress) {
      await TokenUtils.approveTokens(testUser2, tokenAddress, ethers.MaxUint256, await settlementsListingsInstance.getAddress());
    }

    const tokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser2);
    expect(tokenBalance).gte(new BigNumber(settlementPrice), 'Token balance is not correct');

    expect(currentTime).lt(orderStartTime, 'Order time is not correct');

    await expect(
        OrderHelper.acceptOrder(testUser2, orderId, minBuildingsSharesToReceive, tokenAddress, settlementPrice)
    ).to.be.revertedWith("CannotAcceptNotStartedOrder()");
  }

  public static async impossibleSettlementOrderIfOrderExpiredTest(tokenType: string, buildings: BuildingType[]) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const settlementPrice = 30;
    const minSharesAmount = 40;
    const orderTime = 30;

    const worldInstance = await WorldHelper.getWorldInstance();
    const settlementsListingsInstance = await WorldHelper.getSettlementsListingsInstance(testUser1);
    const eraInstance = await WorldHelper.getCurrentEraInstance();
    const bannersInstance = await UserHelper.getBannersInstance(testUser1);
    const sharesInstance = await WorldHelper.getSharesInstance(testUser1);

    const tokenAddress = tokenType === TokenType.BLESS
        ? await worldInstance.erc20ForSettlementPurchase()
        : await eraInstance.resources(ResourceHelper.getResourceTypeId((tokenType as string) as ResourceType));

    const orderStartTime = await EvmUtils.getCurrentTime();
    const orderEndTime = orderStartTime + orderTime;

    await OrderHelper.createOrder(
        testUser1,
        1,
        tokenAddress,
        settlementPrice,
        testUser2,
        orderStartTime,
        orderEndTime
    );

    const orderId = await settlementsListingsInstance.lastOrderId();

    const orderStatusBefore = await OrderHelper.getOrderStatus(testUser1, orderId);
    expect(orderStatusBefore).eql(OrderStatus.NEW, 'Order status is not correct');

    await bannersInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    await sharesInstance.setApprovalForAll(
        await settlementsListingsInstance.getAddress(),
        true
    ).then((tx) => tx.wait());

    const minBuildingsSharesToReceive = buildings.map(buildingType => {
      const buildingTypeId = BuildingHelper.getBuildingTypeId(buildingType);
      return {buildingTypeId: buildingTypeId, minSharesAmount: minSharesAmount}
    });

    if (tokenAddress !== ethers.ZeroAddress) {
      await TokenUtils.approveTokens(testUser2, tokenAddress, ethers.MaxUint256, await settlementsListingsInstance.getAddress());
    }

    const tokenBalance = await TokenUtils.getTokenBalance(tokenAddress, testUser2);
    expect(tokenBalance).gte(new BigNumber(settlementPrice), 'Token balance is not correct');

    await EvmUtils.increaseTime(orderTime + 10);

    const currentTime = await EvmUtils.getCurrentTime();
    expect(currentTime).gte(orderEndTime, 'Order time is not correct');

    await expect(
        OrderHelper.acceptOrder(testUser2, orderId, minBuildingsSharesToReceive, tokenAddress, settlementPrice)
    ).to.be.revertedWith("CannotAcceptExpiredOrder()");
  }
}
