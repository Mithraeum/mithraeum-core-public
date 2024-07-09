import { deployments, getNamedAccounts } from "hardhat";
import { WithSettlementsInDifferentRegions } from "./WithSettlementsInDifferentRegions";
import { ensureEnoughResourcesSet } from "./common/ensureEnoughResourcesSet";

export const WithEnoughResourcesInDifferentRegions = deployments.createFixture(
  async () => {
    await WithSettlementsInDifferentRegions();

    const {testUser1 } = await getNamedAccounts();

    console.log(`Minting enough resources started`);
      await ensureEnoughResourcesSet(testUser1);
    console.log(`Minting enough resources finished`);
  }
);