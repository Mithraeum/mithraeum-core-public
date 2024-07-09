import { WithEnoughResources } from "../../../shared/fixtures/WithEnoughResources";
import { UnitsCoreTest } from "../../core/UnitsCoreTest";
import { UnitType } from "../../../shared/enums/unitType";
import { WithSettlements } from "../../../shared/fixtures/WithSettlements";
import { WithEnoughResourcesInDifferentRegions } from "../../../shared/fixtures/WithEnoughResourcesInDifferentRegions";
import { NotYetStartedGame } from "../../../shared/fixtures/NotYetStartedGame";
import {runWithSavingGasUsage} from "../../tests-gas-usages-setup";

describe("Units Pool Test", async function () {
  it(`testUser1 can hire warriors. /unitPrice, unassignedWorkers, unitQuantity/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.warriorsHireTest(2));
  });

  it(`testUser1 can hire archers and price drop is correct. /unitPrice, userResources, unitQuantity/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitsHireWithPriceDropTest(UnitType.ARCHER, 2));
  });

  it(`testUser1 can hire horsemen and price drop is correct. /unitPrice, userResources, unitQuantity/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitsHireWithPriceDropTest(UnitType.HORSEMAN, 2));
  });

  it(`testUser1 can hire archers by another user resources. /unitPrice, userResources, unitQuantity/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitsHireByAnotherUserResourcesTest(UnitType.ARCHER, 2));
  });

  it(`testUser1 can hire horsemen by another user resources. /unitPrice, userResources, unitQuantity/`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitsHireByAnotherUserResourcesTest(UnitType.HORSEMAN, 2));
  });

  it(`testUser1 can not hire units by another user without approve`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.impossibleUnitsHireByAnotherUserWithoutApproveTest());
  });

  it(`testUser1 can not hire units more than max limit`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.impossibleUnitsHireMoreThanMaxLimitTest());
  });

  it(`testUser1 can not hire units during stun`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.impossibleUnitsHireDuringStunTest());
  });

  it(`testUser1 can not hire units if ingots to sell is more than specified limit`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.impossibleUnitsHireIfIngotsToSellIsMoreThanSpecifiedLimitTest());
  });

  it(`testUser1 can not hire units on another settlement`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.impossibleUnitsHireOnAnotherSettlementTest());
  });

  it(`testUser1 can not hire units more than transaction limit`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.impossibleUnitsHireDueTransactionLimitTest());
  });

  it(`unit price does not change before game started. /unitPrice/`, async function () {
    this.timeout(1_000_000);
    await NotYetStartedGame();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.unitPriceBeforeGameStartedTest());
  });

  it(`testUser1 can not hire units without resources`, async function () {
    this.timeout(1_000_000);
    await WithSettlements();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.impossibleUnitsHireWithoutResourcesTest());
  });

  it(`testUser1 can not hire units from another region`, async function () {
    this.timeout(1_000_000);
    await WithEnoughResourcesInDifferentRegions();
    await runWithSavingGasUsage(this.test!.title, async () => await UnitsCoreTest.impossibleUnitsHireFromAnotherRegionTest());
  });
});
