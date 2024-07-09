import { WithEnoughResources } from "../../../shared/fixtures/WithEnoughResources";
import { SiegeCoreTest } from "../../core/SiegeCoreTest";
import { BuildingType } from "../../../shared/enums/buildingType";
import {runWithSavingGasUsage} from "../../tests-gas-usages-setup";

describe("Siege Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`testUser3 can liquidate testUser1's army during siege. /armyUnits in battle, armyUnits in siege/`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.armyLiquidationDuringSiegeTest());
  });

  it(`testUser1 can not siege testUser2's settlement during stun`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.impossibleSiegeDuringStunTest());
  });

  it(`testUser1 can not siege testUser2's settlement by wrong robbery multiplier`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.impossibleSiegeByWrongRobberyMultiplierTest());
  });

  it(`testUser1 can rob testUser2's Farm. /robberyPointsCap, userResources, userBuildingTreasury, robberyPoints after siege/`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.robberyTest(BuildingType.FARM, 20, 2, false));
  });

  it(`testUser1 can rob testUser2's Lumbermill. /robberyPointsCap, userResources, userBuildingTreasury, robberyPoints after siege/`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.robberyTest(BuildingType.LUMBERMILL, 30, 3, true));
  });

  it(`testUser1 can rob testUser2's Mine. /robberyPointsCap, userResources, userBuildingTreasury, robberyPoints after siege/`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.robberyTest(BuildingType.MINE, 50, 1, false));
  });

  it(`testUser1 can rob testUser2's Smithy. /robberyPointsCap, userResources, userBuildingTreasury, robberyPoints after siege/`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.robberyTest(BuildingType.SMITHY, 20, 3, true));
  });

  it(`testUser1 can not rob testUser2's building without robbery points`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.impossibleRobberyWithoutRobberyTokensTest());
  });

  it(`testUser1's robbery is not affected by cultists penalty. /robberyPointsRegenerationPerSec, userBuildingTreasury, robberyPoints/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.robberyWithPenaltyTest(BuildingType.LUMBERMILL));
  });

  it(`testUser1 can destruct testUser2's Fort. /fortHealth, robberyPoints after siege/`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.fortDestructionTest());
  });

  it(`testUser2 can repair own Fort during testUser1's siege. /fortHealth, structureResources/`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.fortRepairmentDuringSiegeTest());
  });

  it(`testUser1 can destruct testUser2's Fort during testUser2's repairment. /fortHealth, buildingResources, pointsRegenPerSecond/`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.fortDestructionDuringRepairmentTest());
  });

  it(`testUser1 can speed up building robbery by robbery multiplier. /fortHealth, robberyPointsRegenerationTime, stunDuration/`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.robberySpeedUpTest(1, 3));
  });

  it(`testUser1 can change robbery multiplier by siege unit quantity. /fortHealth, robberyPointsRegenerationTime, stunDuration/`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.robberyMultiplierChangeTest(1, 3));
  });

  it(`testUser1 can not change siege unit quantity during stun by siege start`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.impossibleChangeSiegeUnitQuantityDuringStunTest());
  });

  it(`testUser1 can not exchange tokens to resources during stun by siege start`, async function() {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await SiegeCoreTest.impossibleTokensExchangeDuringStunTest());
  });
});
