import {deployments, getNamedAccounts} from "hardhat";
import {WithEnoughSettlementsForNewRegionActivation} from "./WithEnoughSettlementsForNewRegionActivation";
import { RegionHelper } from '../helpers/RegionHelper';

export const WorldWithExtraRegion = deployments.createFixture(async () => {
    await WithEnoughSettlementsForNewRegionActivation();

    const { testUser4 } = await getNamedAccounts();
    const regionNumber = 2;

    await RegionHelper.includeRegionByNumberWithActivation(regionNumber, testUser4);
    console.log(`Region № ${regionNumber} included and activated`);
});
