import {DeployFunction} from "hardhat-deploy/types";
import {Region} from "../scripts/types/region";
import {continent} from "../scripts/data/continents";
import {cmpAddress} from "../scripts/utils/const";
import {ethers} from "ethers";
import {WorldHelper} from "../shared/helpers/WorldHelper";

const func: DeployFunction = async function () {
    console.log("Regions deployment started");

    const ensureRegionsSet = async (regions: Region[]): Promise<void> => {
        const geographyInstance = await WorldHelper.getGeographyInstance();

        const regionsCount = Number(await geographyInstance.getRegionsCount());
        console.log(`Current regions: ${regionsCount}`);

        // Saves region ids to regions by its creation params
        for (let i = 0; i < regions.length; i++) {
            const region = regions[i];
            region.regionId = Number((await geographyInstance.getRegionIdByPosition(region.newRegionPosition))[0]);
        }

        // Create all regions
        for (let i = regionsCount; i < regions.length; i++) {
            const region = regions[i];

            const txReceipt = await geographyInstance
                .includeRegion(region.newRegionPosition, region.neighborRegionPosition)
                .then((tx) => tx.wait());

            console.log(`Region ${region.regionId} included ${txReceipt!.gasUsed.toString()}`);
        }

        console.log(`All regions included`);

        const currentEraInstance = await WorldHelper.getCurrentEraInstance();

        // Activate all regions
        const regionActivations = await Promise.all(
            regions.map(async (region) => {
                const regionAddress = await currentEraInstance.regions(region.regionId!);
                const isRegionActivated = !cmpAddress(regionAddress, ethers.ZeroAddress);
                return {
                    regionId: region.regionId!,
                    isActivated: isRegionActivated,
                };
            })
        );

        const notActivatedRegionIds = regionActivations.filter((value) => !value.isActivated).map((value) => value.regionId);

        console.log(`Not activated regions: ${notActivatedRegionIds.length}`);

        for (let i = 0; i < notActivatedRegionIds.length; i++) {
            const regionId = notActivatedRegionIds[i];
            const txReceipt = await currentEraInstance.activateRegion(regionId).then((tx) => tx.wait());
            console.log(`Region ${regionId} activated, gasCost=${txReceipt!.gasUsed.toString()}`);
        }
    };

    await ensureRegionsSet(continent.regions);

    console.log("Regions deployment finished");
};

func.tags = ["WorldWithSingleRegion"];
func.dependencies = ["EmptyWorld"];
export default func;
