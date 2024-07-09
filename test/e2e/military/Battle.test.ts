import {WithEnoughResources} from "../../../shared/fixtures/WithEnoughResources";
import {BattleCoreTest} from "../../core/BattleCoreTest";
import {UnitType} from "../../../shared/enums/unitType";
import {MovementCoreTest} from "../../core/MovementCoreTest";
import {UnitsCoreTest} from "../../core/UnitsCoreTest";
import {WithArmiesOnOneSettlement} from "../../../shared/fixtures/WithArmiesOnOneSettlement";
import {WithEnoughResourcesInDifferentRegions} from "../../../shared/fixtures/WithEnoughResourcesInDifferentRegions";
import {runWithSavingGasUsage} from "../../tests-gas-usages-setup";

describe("Battle Test", async function () {
  it(`testUser3 can join side A into battle between testUser1 and testUser2 and armies casualties are correct. /casualties, armyUnits, winningSide, stunDuration/`, async function() {
    this.timeout(1_000_000);
    await WithArmiesOnOneSettlement();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.joinBattleAndCalculateCasualtiesTest(1));
  });

  it(`testUser3 can join side B into battle between testUser1 and testUser2 and armies casualties are correct. /casualties, armyUnits, winningSide, stunDuration/`, async function() {
    this.timeout(1_000_000);
    await WithArmiesOnOneSettlement();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.joinBattleAndCalculateCasualtiesTest(2));
  });

  it(`battle between testUser1 and testUser2 can be ended in a draw. /winningSide, armyUnits, stunDuration/`, async function() {
    this.timeout(1_000_000);
    await WithArmiesOnOneSettlement();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.battleDrawTest());
  });

  it(`testUser1's unit quantity in battle does not change if siege ends /armyUnits, armyUnits in battle/`, async function() {
    this.timeout(1_000_000);
    await WithArmiesOnOneSettlement();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.siegeEndDuringBattleTest());
  });

  it(`testUser1's army can be attacked by another user during its movement and armies casualties are proportional to reduced battle duration. /battleEndTime, battleDuration, casualties/`, async function () {
    this.timeout(1_000_000);
    await WithArmiesOnOneSettlement();
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.battleDuringMovementAndCalculateCasualtiesTest());
  });

  it(`testUser1 can not begin battle during enemy army maneuver if duration left 10 sec or less`, async function () {
    this.timeout(1_000_000);
    await WithArmiesOnOneSettlement();
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleBattleDuringManeuverDueLowDurationLeftTest());
  });

  it(`testUser2 can hire warriors during battle but units amount in battle does not change. /armyUnits, armyUnits in battle/`, async function () {
    this.timeout(1_000_000);
    await WithArmiesOnOneSettlement();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitsHireDuringBattleTest(UnitType.WARRIOR));
  });

  it(`testUser2 can hire archers during battle but units amount in battle does not change. /armyUnits, armyUnits in battle/`, async function () {
    this.timeout(1_000_000);
    await WithArmiesOnOneSettlement();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitsHireDuringBattleTest(UnitType.ARCHER));
  });

  it(`testUser2 can hire horsemen during battle but units amount in battle does not change. /armyUnits, armyUnits in battle/`, async function () {
    this.timeout(1_000_000);
    await WithArmiesOnOneSettlement();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitsHireDuringBattleTest(UnitType.HORSEMAN));
  });

  it(`battle duration versus cultists does not depend on the amount of army and battle duration is correct. /battleDuration/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResourcesInDifferentRegions();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.cultistsBattleWithDifferentArmiesAmountTest());
  });

  it(`testUser2 can not summon cultists to battle if fight between testUser1 and them is not over`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.impossibleCultistsSummonDueBattleTest());
  });

  it(`testUser2 can not attack more cultists than exist`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.impossibleCultistsBattleDueLimitTest());
  });

  it(`testUser2 can join side A into battle between testUser1 and cultists. /sideUnits/`, async function() {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.battleJoinVersusCultistsTest(1));
  });

  it(`testUser2 can join side B into battle between testUser1 and cultists. /sideUnits/`, async function() {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.battleJoinVersusCultistsTest(2));
  });

  it(`testUser3 can not join side A into battle between testUser1 and testUser2 during stun`, async function() {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.impossibleBattleJoinDuringStunTest(1));
  });

  it(`testUser3 can not join side B into battle between testUser1 and testUser2 during stun`, async function() {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.impossibleBattleJoinDuringStunTest(2));
  });

  it(`testUser1 can not start battle during stun`, async function() {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.impossibleBattleDuringStunTest());
  });

  it(`testUser1 can not start battle if max units to attack amount is not correct`, async function() {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.impossibleBattleDueMaxUnitsToAttackTest());
  });

  it(`production penalty after battle versus cultists is correct. /productionSlowdownPercentage/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.productionPenaltyReduceAfterCultistsBattleTest());
  });

  it(`testUser1 army maneuver to home can not be speeded up by resources if army is empty`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await MovementCoreTest.impossibleManeuverSpeedUpWithEmptyArmyTest());
  });

  it(`testUser1 can stun own army. /stunDuration/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.armySelfStunTest());
  });

  it(`battle duration between two armies is correct. /battleDuration/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.battleDurationTest(1, 4));
  });

  it(`min battle duration between two armies is correct. /battleDuration/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.minBattleDurationTest());
  });

  it(`casualties in battle between two armies are correct. /casualties, armyUnits, stunDuration/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await BattleCoreTest.battleCasualtiesTest(3, UnitType.ARCHER, 4, UnitType.HORSEMAN));
  });
});
