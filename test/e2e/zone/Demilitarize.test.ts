import { WithEnoughResources } from "../../../shared/fixtures/WithEnoughResources";
import { UnitsCoreTest } from "../../core/UnitsCoreTest";
import { UnitType } from "../../../shared/enums/unitType";
import {runWithSavingGasUsage} from "../../tests-gas-usages-setup";

describe("Demilitarize Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`testUser1 can demilitarize warriors on own settlement. /unitQuantity, unassignedWorkers/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitsDemilitarizeTest(UnitType.WARRIOR, 2));
  });

  it(`testUser1 can demilitarize archers on own settlement. /unitQuantity, prosperityBalance/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitsDemilitarizeTest(UnitType.ARCHER, 2));
  });

  it(`testUser1 can demilitarize horsemen on own settlement. /unitQuantity, prosperityBalance/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitsDemilitarizeTest(UnitType.HORSEMAN, 2));
  });

  it(`testUser1 can not demilitarize units more than available`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.impossibleUnitsDemilitarizeMoreThanAvailableTest());
  });

  it(`testUser1 can not demilitarize units during battle`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.impossibleUnitsDemilitarizeDuringBattleTest());
  });

  it(`testUser1 can not demilitarize units during stun`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.impossibleUnitsDemilitarizeDuringStunTest());
  });

  it(`testUser1 can demilitarize warriors on another settlement. /unitQuantity, prosperityBalance/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitsDemilitarizeOnAnotherSettlementTest(UnitType.WARRIOR, 2));
  });

  it(`testUser1 can demilitarize archers on another settlement. /unitQuantity, prosperityBalance/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitsDemilitarizeOnAnotherSettlementTest(UnitType.ARCHER, 2));
  });

  it(`testUser1 can demilitarize horsemen on another settlement. /unitQuantity, prosperityBalance/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitsDemilitarizeOnAnotherSettlementTest(UnitType.HORSEMAN, 2));
  });
});
