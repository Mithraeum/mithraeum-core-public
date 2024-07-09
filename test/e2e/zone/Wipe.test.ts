import { WipeCoreTest } from "../../core/WipeCoreTest";
import {WithEnoughResources} from "../../../shared/fixtures/WithEnoughResources";
import {runWithSavingGasUsage} from "../../tests-gas-usages-setup";

describe("Wipe Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`testUser1 can destroy current era if summoned cultists amount reached max cap and exchange ratio is changed correctly. /regionTier, totalSummonedCultists, userResources, eraNumber, exchangeRatio/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await WipeCoreTest.worldWipeDueCultistsMaxCapWithExchangeRatioTest());
  });

  it(`testUser1 can not destroy current era if summoned cultists amount not reached max cap`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await WipeCoreTest.impossibleWorldWipeDueCultistsMaxCapTest());
  });

  it(`testUser1 can not destroy current era during destruction delay`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await WipeCoreTest.impossibleWorldWipeDuringDestructionDelayTest());
  });

  it(`after wipe testUser1 can restore own settlement and activate region where settlement was placed before wipe. /totalSummonedCultists, eraNumber, settlementEraNumber/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await WipeCoreTest.settlementRestoreWithRegionActivationAfterWipeTest());
  });

  it(`cultists amount after battle is restored by wipe. /cultistsAmount/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await WipeCoreTest.cultistsAmountRestoreAfterWipeTest());
  });
});
