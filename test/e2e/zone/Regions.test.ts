import {RegionCoreTest} from "../../core/RegionCoreTest";
import {runWithSavingGasUsage} from "../../tests-gas-usages-setup";
import {
  WithEnoughSettlementsForNewRegionActivation
} from "../../../shared/fixtures/WithEnoughSettlementsForNewRegionActivation";
import {deployments} from "hardhat";
import {WithEnoughResourcesInDifferentRegions} from "../../../shared/fixtures/WithEnoughResourcesInDifferentRegions";
import {ProductionCoreTest} from "../../core/ProductionCoreTest";
import {BuildingType} from "../../../shared/enums/buildingType";

describe("Regions Test", async function () {
  it(`testUser1 can not activate new region if current region has not enough settlements`, async function () {
    this.timeout(1_000_000);
    await deployments.fixture("ImmediatelyStartedGame");
    await runWithSavingGasUsage(this.test!.title, async () => await RegionCoreTest.impossibleRegionActivationWithoutSettlementsTest());
  });

  it(`testUser1 can harvest resources produced by new settlement placed a day after region activation. /treasuryBalance/`, async function () {
    this.timeout(1_000_000);
    await deployments.fixture("ImmediatelyStartedGame");
    await runWithSavingGasUsage(this.test!.title, async () => await ProductionCoreTest.harvestBySettlementPlacedAfterRegionActivationTest(BuildingType.LUMBERMILL));
  });

  it(`testUser1 can activate new region. /tokenBalance/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughSettlementsForNewRegionActivation();
    await runWithSavingGasUsage(this.test!.title, async () => await RegionCoreTest.regionActivationTest());
  });

  it(`testUser1 can not activate new region without enough token amount`, async function () {
    this.timeout(1_000_000);
    await WithEnoughSettlementsForNewRegionActivation();
    await runWithSavingGasUsage(this.test!.title, async () => await RegionCoreTest.impossibleRegionActivationWithoutTokensTest());
  });

  it(`testUser1 can not activate new region if neighbor region is not included`, async function () {
    this.timeout(1_000_000);
    await WithEnoughSettlementsForNewRegionActivation();
    await runWithSavingGasUsage(this.test!.title, async () => await RegionCoreTest.impossibleRegionActivationTest());
  });

  it(`testUser2 can purchase new settlement in region activated by another user and region transfer is correct. /tokenBalance, regionOwner/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughSettlementsForNewRegionActivation();
    await runWithSavingGasUsage(this.test!.title, async () => await RegionCoreTest.settlementPurchaseInRegionActivatedByAnotherUserWithRegionTransferTest());
  });

  it(`not included region tiers are changed after wipe but activated are not. /regionActivationTierArray, regionObservationTierArray/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResourcesInDifferentRegions();
    await runWithSavingGasUsage(this.test!.title, async () => await RegionCoreTest.regionTiersAfterWipeTest());
  });
});
