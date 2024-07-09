import { TileCaptureCoreTest } from "../../core/TileCaptureCoreTest";
import { BuildingType } from "../../../shared/enums/buildingType";
import { WithEnoughResources } from "../../../shared/fixtures/WithEnoughResources";
import { WithSettlements } from "../../../shared/fixtures/WithSettlements";
import { WithArmiesOnOneSettlement } from "../../../shared/fixtures/WithArmiesOnOneSettlement";
import {runWithSavingGasUsage} from "../../tests-gas-usages-setup";
import {UnitType} from "../../../shared/enums/unitType";
import {WithEnoughResourcesInDifferentRegions} from "../../../shared/fixtures/WithEnoughResourcesInDifferentRegions";

describe("Tile Capture Test", async function () {
  it(`testUser1 can capture tile with Farm bonus in region number 2 and bonus workers amount is correct. /advancedProductionTileBonusType, prosperityBalance, investedWorkers, productionPerSecond/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResourcesInDifferentRegions();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.tileCaptureTest(BuildingType.FARM, 2));
  });

  it(`testUser1 can capture tile with Lumbermill bonus in region number 1 and bonus workers amount is correct. /advancedProductionTileBonusType, prosperityBalance, investedWorkers, productionPerSecond/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResourcesInDifferentRegions();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.tileCaptureTest(BuildingType.LUMBERMILL, 1));
  });

  it(`testUser1 can capture tile with Mine bonus in region number 1 and bonus workers amount is correct. /advancedProductionTileBonusType, prosperityBalance, investedWorkers, productionPerSecond/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResourcesInDifferentRegions();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.tileCaptureTest(BuildingType.MINE, 1));
  });

  it(`testUser1 can capture tile with Smithy bonus in region number 2 and bonus workers amount is correct. /advancedProductionTileBonusType, prosperityBalance, investedWorkers, productionPerSecond/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResourcesInDifferentRegions();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.tileCaptureTest(BuildingType.SMITHY, 2));
  });

  it(`testUser2 can capture tile with Fort bonus in region number 1 and bonus workers amount is correct. /advancedProductionTileBonusType, prosperityBalance, investedWorkers, productionPerSecond/`, async function () {
    this.timeout(1_000_000);
    await WithArmiesOnOneSettlement();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.fortTileCaptureTest(1));
  });

  it(`testUser1 can not capture tile without prosperity`, async function () {
    this.timeout(1_000_000);
    await WithSettlements();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.impossibleTileCaptureWithoutProsperityTest());
  });

  it(`testUser1 can not capture tile by stake which is lower than initial prosperity stake`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.impossibleTileCaptureByStakeLowerThanInitialProsperityStakeTest());
  });

  it(`testUser1 can not claim tile without prosperity`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.impossibleTileClaimWithoutProsperityTest());
  });

  it(`testUser1 can not claim tile during capture`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.impossibleTileClaimDuringCaptureTest());
  });

  it(`testUser1 can not capture more than one tile at the same time`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.impossibleTilesCaptureAtTheSameTimeTest());
  });

  it(`testUser1 can not capture more tiles than advanced tile max limit`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResourcesInDifferentRegions();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.impossibleTileCaptureDueMaxLimitTest(1));
  });

  it(`testUser1 can not capture more tiles than military tile max limit`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResourcesInDifferentRegions();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.impossibleTileCaptureDueMaxLimitTest(2));
  });

  it(`testUser1 can not get building tile buff greater than max buff limit. /advancedProductionTileBonusType, advancedProductionTileBonusPercent, prosperityBalance, investedWorkers/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResourcesInDifferentRegions();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.tileMaxBuffLimitTest());
  });

  it(`testUser1 can give up tile with bonus. /advancedProductionTileBonusType, prosperityBalance, tileOwner, investedWorkers/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.tileGiveUpTest());
  });

  it(`testUser2 can capture tile with bonus captured by testUser1. /prosperityBalance, tileOwner/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.tileCaptureByAnotherUserTest());
  });

  it(`testUser1 can cancel tile capture with bonus. /prosperityBalance, tileOwner/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.cancelTileCaptureTest());
  });

  it(`testUser1 can purchase settlement on tile with bonus. /advancedProductionTileBonusType, investedWorkers/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.settlementPurchaseOnTileWithBonusTest());
  });

  it(`testUser1 can capture own tile with bonus. /advancedProductionTileBonusType, tileOwner/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.ownTileCaptureTest());
  });

  it(`testUser1 can not capture own tile if prosperity threshold not reached`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.impossibleOwnTileCaptureIfProsperityThresholdNotReachedTest());
  });

  it(`testUser1 can capture tile with Warrior bonus and battle bonus is correct. /advancedProductionTileBonusType, prosperityBalance, investedWorkers, productionPerSecond/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.militaryTileCaptureTest(UnitType.WARRIOR));
  });

  it(`testUser1 can capture tile with Archer bonus and battle bonus is correct. /advancedProductionTileBonusType, prosperityBalance, investedWorkers, productionPerSecond/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.militaryTileCaptureTest(UnitType.ARCHER));
  });

  it(`testUser1 can capture tile with Horseman bonus and battle bonus is correct. /advancedProductionTileBonusType, prosperityBalance, investedWorkers, productionPerSecond/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await TileCaptureCoreTest.militaryTileCaptureTest(UnitType.HORSEMAN));
  });
});
