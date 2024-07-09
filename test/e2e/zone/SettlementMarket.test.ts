import { SettlementCoreTest } from "../../core/SettlementCoreTest";
import { deployments } from "hardhat";
import { WipeCoreTest } from "../../core/WipeCoreTest";
import { NotYetStartedGame } from "../../../shared/fixtures/NotYetStartedGame";
import {runWithSavingGasUsage} from "../../tests-gas-usages-setup";
import {WithSettlementsInDifferentRegions} from "../../../shared/fixtures/WithSettlementsInDifferentRegions";
import {WithEnoughResources} from "../../../shared/fixtures/WithEnoughResources";

describe("Settlement Market Test", async function () {
  it(`settlements cost does not change before game started. /settlementCost/`, async function () {
    this.timeout(1_000_000);
    await NotYetStartedGame();
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementCoreTest.settlementCostBeforeGameStartedTest());
  });

  it(`testUser1 can purchase new settlement and price drop is correct. /settlementCost, userTokenBalance/`, async function () {
    this.timeout(1_000_000);
    await deployments.fixture("ImmediatelyStartedGame");
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementCoreTest.settlementPurchaseWithPriceDropTest());
  });

  it(`testUser1 can not purchase new settlement not in acceptable radius`, async function () {
    this.timeout(1_000_000);
    await deployments.fixture("ImmediatelyStartedGame");
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementCoreTest.impossibleSettlementPurchaseNotInAcceptableRadiusTest());
  });

  it(`testUser1 can not purchase new settlement without money`, async function () {
    this.timeout(1_000_000);
    await deployments.fixture("ImmediatelyStartedGame");
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementCoreTest.impossibleSettlementPurchaseWithoutMoneyTest());
  });

  it(`testUser1 can not purchase new settlement if max token to use lower than settlement cost`, async function () {
    this.timeout(1_000_000);
    await deployments.fixture("ImmediatelyStartedGame");
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementCoreTest.impossibleSettlementPurchaseWithLowMaxTokenToUseTest());
  });

  it(`testUser1 can not purchase new settlement if region is full`, async function () {
    this.timeout(1_000_000);
    await deployments.fixture("40Settlements");
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementCoreTest.impossibleSettlementPurchaseWithFullRegionTest());
  });

  it(`settlement cost after wipe does not change. /eraNumber, settlementCost/`, async function () {
    this.timeout(1_000_000);
    await deployments.fixture("40Settlements");
    await runWithSavingGasUsage(this.test!.title, async () => await WipeCoreTest.settlementCostAfterWipeTest());
  });

  it(`testUser1 can not purchase new settlement after wipe if era is not active`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await WipeCoreTest.impossibleSettlementPurchaseAfterWipeTest());
  });

  it(`testUser1 can purchase new settlement in different region from current settlement region. /settlementCost, userTokenBalance/`, async function () {
    this.timeout(1_000_000);
    await WithSettlementsInDifferentRegions();
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementCoreTest.settlementPurchaseInDifferentRegionTest());
  });

  it(`testUser1 can purchase new settlement on position where rotten settlement is destroyed`, async function () {
    this.timeout(1_000_000);
    await deployments.fixture("40Settlements");
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementCoreTest.settlementPurchaseAfterDestroyTest());
  });

  it(`testUser1 can not purchase new settlement on position where rotten settlement is not destroyed`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await SettlementCoreTest.impossibleSettlementPurchaseWithoutDestroyTest());
  });
});
