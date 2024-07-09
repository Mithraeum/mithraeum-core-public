import { WipeCoreTest } from "../../core/WipeCoreTest";
import {runWithSavingGasUsage} from "../../tests-gas-usages-setup";
import {WithEnoughResources} from "../../../shared/fixtures/WithEnoughResources";

describe("Cultists Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`summoned cultists amount after summon delay is proportional to region corruptionIndex. /summonedCultists/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await WipeCoreTest.cultistSummonTest());
  });

  it(`cultists can not be summoned during summon delay`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await WipeCoreTest.impossibleCultistSummonDuringSummonDelayTest());
  });

  it(`cultists can be summoned again only in next interval if in current interval toxicity increase was repeated. /cultistAmount/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await WipeCoreTest.cultistSummonRepeatDuringCurrentIntervalTest());
  });
});
