import { WithEnoughResources } from "../../../shared/fixtures/WithEnoughResources";
import { RewardsCoreTest } from "../../core/RewardsCoreTest";
import {runWithSavingGasUsage} from "../../tests-gas-usages-setup";

describe("Reward Pool Test", async function () {
  beforeEach(async function () {
    this.timeout(1_000_000);
    await WithEnoughResources();
  });

  it(`testUser1 can exchange ingots to tokens. /userTokenBalance, rewardPoolBalance, userResourceBalance/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await RewardsCoreTest.rewardsExchangeTest());
  });

  it(`testUser1 can exchange ingots to tokens by another user resources. /userTokenBalance, rewardPoolBalance, userResourceBalance/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await RewardsCoreTest.rewardsExchangeByAnotherUserResourcesTest());
  });

  it(`testUser1 can not exchange ingots to tokens by another user resources without approve`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await RewardsCoreTest.impossibleRewardsExchangeByAnotherUserResourcesWithoutApproveTest());
  });

  it(`testUser1 can exchange lower ingots amount to tokens if reward pool balance decreased. /userTokenBalance, rewardPoolBalance, userResourceBalance, minTokensToReceive/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await RewardsCoreTest.rewardsExchangeWithDecreasedRewardPoolTest());
  });

  it(`testUser1 can not exchange ingots if min tokens to receive amount is too high`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await RewardsCoreTest.impossibleRewardsExchangeByHighMinTokensToReceiveTest());
  });

  it(`testUser1 can pay tokens to decrease corruptionIndex in settlement. /userTokenBalance, rewardPoolBalance, regionCorruptionIndex/`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await RewardsCoreTest.payToDecreaseCorruptionIndexTest());
  });

  it(`testUser1 can not pay tokens to decrease corruptionIndex in settlement`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await RewardsCoreTest.impossiblePayToDecreaseCorruptionIndexTest());
  });

  it(`testUser1 can not exchange ingots, upgrade building or hire units if game is closed due to empty reward pool`, async function () {
    this.timeout(1_000_000);
    await runWithSavingGasUsage(this.test!.title, async () => await RewardsCoreTest.impossibleActionsAfterGameClosedTest());
  });
});
