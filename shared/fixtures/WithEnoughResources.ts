import { deployments, getNamedAccounts } from "hardhat";
import { WithSettlements } from "./WithSettlements";
import { ensureEnoughResourcesSet } from "./common/ensureEnoughResourcesSet";

export const WithEnoughResources = deployments.createFixture(
    async () => {
        await WithSettlements();

        const {testUser1, testUser2, testUser3} = await getNamedAccounts();

        console.log(`Minting enough resources started`);
            await ensureEnoughResourcesSet(testUser1);
            await ensureEnoughResourcesSet(testUser2);
            await ensureEnoughResourcesSet(testUser3);
        console.log(`Minting enough resources finished`);
    }
);
