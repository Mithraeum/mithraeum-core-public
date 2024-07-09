import { BuildingType } from "../../../shared/enums/buildingType";
import { SettlementListingsTest } from "../../external/SettlementListingsTest";
import { TokenType } from "../../../shared/enums/tokenType";
import { WithEnoughResources } from "../../../shared/fixtures/WithEnoughResources";
import {runWithSavingGasUsage} from "../../tests-gas-usages-setup";

describe("Settlement Listings Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`testUser2 can order testUser1's settlement with shares by bless. /orderStatus, userTokenBalance, userSharesBalance/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementListingsTest.settlementOrderWithSharesTest(TokenType.BLESS, [BuildingType.FARM, BuildingType.LUMBERMILL, BuildingType.MINE, BuildingType.SMITHY]));
  });

  it(`testUser2 can order testUser1's settlement with shares by food. /orderStatus, userTokenBalance, userSharesBalance/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementListingsTest.settlementOrderWithSharesTest(TokenType.FOOD, [BuildingType.FARM, BuildingType.LUMBERMILL, BuildingType.MINE, BuildingType.SMITHY]));
  });

  it(`testUser2 can order testUser1's settlement with shares by wood. /orderStatus, userTokenBalance, userSharesBalance/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementListingsTest.settlementOrderWithSharesTest(TokenType.WOOD, [BuildingType.FARM, BuildingType.LUMBERMILL, BuildingType.MINE, BuildingType.SMITHY]));
  });

  it(`testUser2 can order testUser1's settlement with shares by ore. /orderStatus, userTokenBalance, userSharesBalance/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementListingsTest.settlementOrderWithSharesTest(TokenType.ORE, [BuildingType.FARM, BuildingType.LUMBERMILL, BuildingType.MINE, BuildingType.SMITHY]));
  });

  it(`testUser2 can order testUser1's settlement with shares by ingot. /orderStatus, userTokenBalance, userSharesBalance/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementListingsTest.settlementOrderWithSharesTest(TokenType.INGOT, [BuildingType.FARM, BuildingType.LUMBERMILL, BuildingType.MINE, BuildingType.SMITHY]));
  });

  it(`testUser2 can not order testUser1's settlement with shares more than max cap`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementListingsTest.impossibleSettlementOrderWithSharesMoreThanMaxCapTest());
  });

  it(`testUser1 can cancel his own settlement order. /orderStatus/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementListingsTest.cancelSettlementOrderTest());
  });

  it(`testUser1 can modify his own settlement order. /orderStatus, orderPrice/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementListingsTest.modifySettlementOrderTest());
  });

  it(`testUser2 can order testUser1's settlement with reduced shares amount. /userSharesBalance/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementListingsTest.settlementOrderWithReducedSharesAmountTest());
  });

  it(`testUser2 can not order testUser1's settlement if shares were transferred after order was created`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementListingsTest.impossibleSettlementOrderWithLowerSharesAmountThanWasOnOrderCreationTest());
  });

  it(`testUser2 can not order testUser1's settlement with shares by not allowed address`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementListingsTest.impossibleSettlementOrderByNotAllowedAddressTest(TokenType.BLESS, [BuildingType.FARM, BuildingType.LUMBERMILL, BuildingType.MINE, BuildingType.SMITHY]));
  });

  it(`testUser2 can not order testUser1's settlement with shares if order not started`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementListingsTest.impossibleSettlementOrderIfOrderNotStartedTest(TokenType.BLESS, [BuildingType.FARM, BuildingType.LUMBERMILL, BuildingType.MINE, BuildingType.SMITHY]));
  });

  it(`testUser2 can not order testUser1's settlement with shares if order expired`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementListingsTest.impossibleSettlementOrderIfOrderExpiredTest(TokenType.BLESS, [BuildingType.FARM, BuildingType.LUMBERMILL, BuildingType.MINE, BuildingType.SMITHY]));
  });
});
