import {WithEnoughResources} from "../../../shared/fixtures/WithEnoughResources";
import {MovementCoreTest} from "../../core/MovementCoreTest";
import {runWithSavingGasUsage} from "../../tests-gas-usages-setup";
import {UnitType} from "../../../shared/enums/unitType";

describe("Movement Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`testUser1 army can maneuver to another settlement and maneuver time is correct. /maneuverTime, armyPosition, stunDuration/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.maneuverTest());
  });

  it(`testUser1 army can not maneuver to another settlement during stun`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleManeuverDuringStunTest());
  });

  it(`testUser1 army maneuver can be speeded up by resources and maneuver time reduces correctly. /maneuverTimeWithSpeedUp, armyPosition, stunDuration/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.maneuverSpeedUpTest(90));
  });

  it(`testUser1 army maneuver can be speeded up as much as there are enough resources. /maneuverTimeWithSpeedUp, armyPosition/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.maneuverSpeedUpWithLowResourceAmountTest());
  });

  it(`testUser1 army maneuver can not be speeded up without enough resource amount`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleManeuverSpeedUpWithoutTreasuryResourceAmountTest());
  });

  it(`testUser1 army maneuver can not be speeded up more than max limit`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleManeuverSpeedUpDueMaxLimitTest());
  });

  it(`testUser1 can not maneuver to another settlement if army is empty`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleManeuverWithEmptyArmyTest());
  });

  it(`testUser1 hidden maneuver to another settlement can be revealed. /isArmyInHiddenManeuver, armyPosition/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.revealHiddenManeuverTest());
  });

  it(`testUser1 hidden maneuver to another settlement can not be revealed by wrong reveal key`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleRevealHiddenManeuverTest());
  });

  it(`testUser1 hidden maneuver to another settlement can be revealed during battle if battle and stun after it end until maneuver end time. /isArmyInHiddenManeuver/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.revealHiddenManeuverDuringBattleTest());
  });

  it(`testUser1 hidden maneuver to another settlement can not be revealed during battle if battle and stun after it end after maneuver end time`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleRevealHiddenManeuverDuringBattleTest());
  });

  it(`testUser1 hidden maneuver to another settlement can be revealed with speed up. /isArmyInHiddenManeuver, userBuildingTreasury, maneuverDuration, armyPosition/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.revealHiddenManeuverWithSpeedUpTest(60));
  });

  it(`testUser1 hidden maneuver to another settlement can not be revealed with speed up`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleRevealHiddenManeuverWithSpeedUpTest());
  });

  it(`testUser1 hidden maneuver to another settlement can be revealed with speed up after battle if battle and stun after it end until maneuver end time. /isArmyInHiddenManeuver, maneuverDuration/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.revealHiddenManeuverWithSpeedUpAfterBattleTest());
  });

  it(`testUser1 hidden maneuver to another settlement can not be revealed with speed up during battle if battle and stun after it end until maneuver end time`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleRevealHiddenManeuverWithSpeedUpDuringBattleTest());
  });

  it(`testUser1 hidden maneuver to another settlement can be cancelled. /isArmyInHiddenManeuver, armyUnits, unassignedWorkers, prosperityBalance, armyPosition, stunDuration/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.cancelHiddenManeuverTest(UnitType.ARCHER));
  });

  it(`testUser1 hidden maneuver to another settlement can be cancelled by era change. /isArmyInHiddenManeuver, eraNumber, armyUnits/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.cancelHiddenManeuverByEraChangeTest(UnitType.ARCHER));
  });

  it(`testUser1 hidden maneuver to another settlement can not be cancelled by another user`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleCancelHiddenManeuverByAnotherUserTest());
  });

  it(`testUser1 hidden maneuver to another settlement can not be cancelled during stun`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleCancelHiddenManeuverDuringStunTest());
  });

  it(`testUser1 hidden maneuver to another settlement can not be cancelled during battle`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleCancelHiddenManeuverDuringBattleTest());
  });

  it(`testUser1 army maneuver can be speeded up from cultists settlement without resource usage if there are no cultists. /maneuverTimeWithSpeedUp, userBuildingTreasury, armyPosition/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.maneuverSpeedUpFromCultistsSettlementTest());
  });

  it(`testUser1 hidden maneuver can be revealed with speed up from cultists settlement without resource usage if there are no cultists. /maneuverTimeWithSpeedUp, userBuildingTreasury, armyPosition/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.revealHiddenManeuverWithSpeedUpFromCultistsSettlementTest());
  });

  it(`testUser1 army maneuver can not be speeded up from cultists settlement if there are cultists`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleManeuverSpeedUpFromCultistsSettlementTest());
  });
});
