import {DeployFunction} from "hardhat-deploy/types";
import {HardhatRuntimeEnvironment} from "hardhat/types";
import {deployBatch, ensureRightImplementation, setupDeployer} from "../scripts/deployer";
import {cmpAddress, sleep} from "../scripts/utils/const";
import {Deployment} from "hardhat-deploy/dist/types";
import {AbiCoder, ethers} from "ethers";
import {
    BannerParts__factory, Banners__factory,
    CrossErasMemory__factory,
    Geography__factory,
    Registry__factory,
    Resolver__factory,
    RewardPool__factory,
    World__factory,
} from "../typechain-types";
import {chunk, zip} from "lodash";
import {MithraeumConfig} from "../types/MithraeumConfig";

const greenCheckmark = "\u001b[1;32m ✓\x1b[0m";

interface WorldAssetImplementation {
    groupType: string;
    assetType: string;
    deployment: Deployment;
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const {deployments, getNamedAccounts} = hre;
    const {deploy} = deployments;

    const {worldDeployer} = await getNamedAccounts();
    const worldSigner = await hre.ethers.getSigner(worldDeployer);

    const network = await hre.ethers.provider.getNetwork();
    const mithraeumConfig = (<any>hre.network.config).mithraeumConfig as MithraeumConfig;

    setupDeployer(deploy, worldDeployer);

    console.log("Empty world creation started");

    // Main proxies
    const [
        registryProxyDeployment,
        worldProxyDeployment,
        geographyProxyDeployment,
        crossErasMemoryProxyDeployment,
        // rewardPoolProxyDeployment,
    ] = await deployBatch(
        {
            name: "RegistryProxy",
            contract: "SimpleProxy",
        },
        {
            name: "WorldProxy",
            contract: "SimpleProxy",
        },
        {
            name: "GeographyProxy",
            contract: "SimpleProxy",
        },
        {
            name: "CrossErasMemoryProxy",
            contract: "SimpleProxy",
        },
        // {
        //     name: "RewardPoolProxy",
        //     contract: "SimpleProxy",
        // }
    );

    // Checks if specified network has predefined resolver address, if it is not -> deploy resolver and assign env var
    if (!mithraeumConfig.RESOLVER_ADDRESS) {
        const [resolverDeployment] = await deployBatch("Resolver");

        mithraeumConfig.RESOLVER_ADDRESS = resolverDeployment.address;
    }

    const [
        registryDeployment,
        worldDeployment,
        // rewardPoolDeployment,
        crossErasMemoryDeployment,
        geographyDeployment,
        eraDeployment,
        regionDeployment,
        workersPoolDeployment,
        settlementsMarketDeployment,
        ingotsUnitsPoolDeployment,
        workersUnitsPoolDeployment,
        settlementDeployment,
        cultistsSettlementDeployment,
        farmDeployment,
        lumbermillDeployment,
        mineDeployment,
        smithyDeployment,
        fortDeployment,
        armyDeployment,
        battleDeployment,
        siegeDeployment,
        tileCapturingSystemDeployment,
        prosperityDeployment,
        resourceDeployment,
        unitsDeployment,
        workersDeployment,
        worldAssetFactoryDeployment,
        bannersDeployment,
        bannerPartsDeployment,
        distributionsDeployment,
        regionOwnershipTokenDeployment,
        armyViewDeployment,
        battleViewDeployment,
        eraViewDeployment,
        settlementViewDeployment,
    ] = await deployBatch(
        "Registry",
        "World",
        // "RewardPool",
        "CrossErasMemory",
        "Geography",
        "Era",
        "Region",
        "WorkersPool",
        "SettlementsMarket",
        "IngotsUnitsPool",
        "WorkersUnitsPool",
        "Settlement",
        "CultistsSettlement",
        "Farm",
        "Lumbermill",
        "Mine",
        "Smithy",
        "Fort",
        "Army",
        "Battle",
        "Siege",
        "TileCapturingSystem",
        "Prosperity",
        "Resource",
        "Units",
        "Workers",
        "WorldAssetFactory",
        {
            name: "Banners",
            args: [
                "Banners",
                "BNR",
                `https://mit-flags-node.s3.eu-central-1.amazonaws.com/${mithraeumConfig.ENVIRONMENT_NAME}/${network.chainId}/json/`,
                mithraeumConfig.MAXIMUM_AMOUNT_OF_MINTED_BANNERS_PER_ADDRESS,
            ],
        },
        {name: "BannerParts", args: ["Banner Parts", "BNRP", ""]},
        {name: "Distributions", args: [worldProxyDeployment.address, "https://mithraeum.io"]},
        {name: "RegionOwnershipToken", args: ["Region ownership token", "ZOT", "https://mithraeum.io", worldProxyDeployment.address]},
        "ArmyView",
        "BattleView",
        "EraView",
        "SettlementView"
    );

    const [settlementsListingsDeployment] = await deployBatch({
        name: "SettlementsListings",
        args: [bannersDeployment.address, worldProxyDeployment.address],
    });

    console.log("contracts deployment done");

    const bannersInstance = Banners__factory.connect(bannersDeployment.address, worldSigner);
    const currentMaxAmountOfBannersForAdmin = await bannersInstance.overriddenMaxAmountOfBannersByAddress(worldSigner.address);
    if (currentMaxAmountOfBannersForAdmin !== ethers.MaxUint256) {
        await bannersInstance.setMaxAmountOfBannersByAddress(worldSigner.address, ethers.MaxUint256).then(tx => tx.wait());
        console.log("Increased max amount of banners for admin");
    } else {
        console.log("Max amount of banners for admin already max");
    }

    const updateFreeParts = async (ids: number[]) => {
        const bannerPartsInstance = BannerParts__factory.connect(bannerPartsDeployment.address, worldSigner);

        const chunks = chunk(ids, 10);

        const allParts: {id: number; isFreePart: boolean}[] = [];
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const chunkResponse = await Promise.all(
                chunk.map(async (id) => {
                    return {
                        id: id,
                        isFreePart: await bannerPartsInstance.isFreePart(id),
                    };
                })
            );

            allParts.push(...chunkResponse);
            if (network.name !== "hardhat") {
                await sleep(1000);
            }
        }

        const freeParts = allParts.filter((part) => !part.isFreePart);
        if (freeParts.length === 0) {
            console.log(`Free parts are correct`);
            return;
        }

        await bannerPartsInstance.setFreeParts(
            freeParts.map((part) => part.id),
            freeParts.map((part) => true)
        );

        console.log(`${greenCheckmark} ${freeParts.length} free parts corrected`);
    };

    const generateArray = (startValue: number, length: number) => {
        return Array.from({ length: length }, (v, i) => i + startValue);
    }

    await updateFreeParts([
        ...generateArray(1, 45),
        ...generateArray(10000000000, 25),
        ...generateArray(20000000000, 5),
        ...generateArray(30000000000, 15),
        ...generateArray(40000000000, 20),
        ...generateArray(50000000000, 20),
    ]);

    // Cross era memory
    const isCrossErasMemoryImplementationChanged = await ensureRightImplementation(
        crossErasMemoryProxyDeployment,
        crossErasMemoryDeployment,
        worldSigner
    );

    if (isCrossErasMemoryImplementationChanged) {
        console.log(`${greenCheckmark} Cross era memory implementation updated`);
    } else {
        console.log(`Cross era memory implementation not changed, no need to update proxy`);
    }

    const crossErasMemoryProxyInstance = CrossErasMemory__factory.connect(
        crossErasMemoryProxyDeployment.address,
        worldSigner
    );
    const worldAddressInCrossErasMemory = await crossErasMemoryProxyInstance.world();

    if (!cmpAddress(worldAddressInCrossErasMemory, worldProxyDeployment.address)) {
        await crossErasMemoryProxyInstance.init(worldProxyDeployment.address).then((tx) => tx.wait());
        console.log(`${greenCheckmark} Geography initialized`);
    } else {
        console.log(`Geography is already initialized`);
    }

    // Geography
    const isGeographyImplementationChanged = await ensureRightImplementation(
        geographyProxyDeployment,
        geographyDeployment,
        worldSigner
    );

    if (isGeographyImplementationChanged) {
        console.log(`${greenCheckmark} Geography implementation updated`);
    } else {
        console.log(`Geography implementation not changed, no need to update proxy`);
    }

    const geographyProxyInstance = Geography__factory.connect(geographyProxyDeployment.address, worldSigner);
    const worldAddressInGeography = await geographyProxyInstance.world();

    if (!cmpAddress(worldAddressInGeography, worldProxyDeployment.address)) {
        await geographyProxyInstance.init(worldProxyDeployment.address).then((tx) => tx.wait());
        console.log(`${greenCheckmark} Geography initialized`);
    } else {
        console.log(`Geography is already initialized`);
    }

    // Registry
    const isRegistryImplementationChanged = await ensureRightImplementation(
        registryProxyDeployment,
        registryDeployment,
        worldSigner
    );

    if (isRegistryImplementationChanged) {
        console.log(`${greenCheckmark} Registry implementation updated`);
    } else {
        console.log(`Registry implementation not changed, no need to update proxy`);
    }

    const registryProxyInstance = Registry__factory.connect(registryProxyDeployment.address, worldSigner);
    const mightyCreator = await registryProxyInstance.mightyCreator();

    if (!cmpAddress(mightyCreator, worldDeployer)) {
        await registryProxyInstance
            .init()
            .then((tx) => tx.wait());
        console.log(`${greenCheckmark} Registry initialized`);
    } else {
        console.log(`Registry is already initialized`);
    }

    // Reward pool
    // const isRewardPoolImplementationChanged = await ensureRightImplementation(
    //     rewardPoolProxyDeployment,
    //     rewardPoolDeployment,
    //     worldSigner
    // );
    //
    // if (isRewardPoolImplementationChanged) {
    //     console.log(`${greenCheckmark} Reward pool implementation updated`);
    // } else {
    //     console.log(`Reward pool implementation not changed, no need to update proxy`);
    // }
    //
    // const rewardPoolProxyInstance = RewardPool__factory.connect(rewardPoolProxyDeployment.address, worldSigner);
    // const worldAddressInRewardPool = await rewardPoolProxyInstance.world();
    //
    // if (!cmpAddress(worldAddressInRewardPool, worldProxyDeployment.address)) {
    //     await rewardPoolProxyInstance.init(worldProxyDeployment.address).then((tx) => tx.wait());
    //     console.log(`${greenCheckmark} Reward pool initialized`);
    // } else {
    //     console.log(`Reward pool is already initialized`);
    // }

    const updateWorldAssetFactory = async (worldAssetFactoryDeployment: Deployment): Promise<void> => {
        const registryInstance = Registry__factory.connect(registryProxyDeployment.address, worldSigner);

        const factoryAddressFromRegistry = await registryInstance.worldAssetFactory();

        if (cmpAddress(worldAssetFactoryDeployment.address, factoryAddressFromRegistry)) {
            console.log("World asset factory is correct");
            return;
        }

        await registryProxyInstance.setWorldAssetFactory(worldAssetFactoryDeployment.address).then((tx) => tx.wait());
        console.log(`${greenCheckmark} World asset factory corrected`);
    };

    await updateWorldAssetFactory(worldAssetFactoryDeployment);

    const isWorldImplementationUpdated = await ensureRightImplementation(
        worldProxyDeployment,
        worldDeployment,
        worldSigner
    );

    if (isWorldImplementationUpdated) {
        console.log(`${greenCheckmark} World implementation updated`);
    } else {
        console.log(`World deployment not changed, no need to update proxy`);
    }

    const worldProxyInstance = World__factory.connect(worldProxyDeployment.address, worldSigner);
    const registryAddress = await worldProxyInstance.registry();
    const isWorldInitialized = !cmpAddress(registryAddress, ethers.ZeroAddress);

    const worldAssetImplementations: WorldAssetImplementation[] = [
        {groupType: "era", assetType: "BASIC", deployment: eraDeployment},
        {groupType: "region", assetType: "BASIC", deployment: regionDeployment},
        {groupType: "workersPool", assetType: "BASIC", deployment: workersPoolDeployment},
        {groupType: "settlementsMarket", assetType: "BASIC", deployment: settlementsMarketDeployment},
        {groupType: "unitsPool", assetType: "INGOTS_UNIT_POOL", deployment: ingotsUnitsPoolDeployment},
        {groupType: "unitsPool", assetType: "WORKERS_UNIT_POOL", deployment: workersUnitsPoolDeployment},
        {groupType: "settlement", assetType: "BASIC", deployment: settlementDeployment},
        {groupType: "settlement", assetType: "CULTISTS", deployment: cultistsSettlementDeployment},
        {groupType: "building", assetType: "FARM", deployment: farmDeployment},
        {groupType: "building", assetType: "LUMBERMILL", deployment: lumbermillDeployment},
        {groupType: "building", assetType: "MINE", deployment: mineDeployment},
        {groupType: "building", assetType: "SMITHY", deployment: smithyDeployment},
        {groupType: "building", assetType: "FORT", deployment: fortDeployment},
        {groupType: "army", assetType: "BASIC", deployment: armyDeployment},
        {groupType: "battle", assetType: "BASIC", deployment: battleDeployment},
        {groupType: "siege", assetType: "BASIC", deployment: siegeDeployment},
        {groupType: "tileCapturingSystem", assetType: "BASIC", deployment: tileCapturingSystemDeployment},
        {groupType: "prosperity", assetType: "BASIC", deployment: prosperityDeployment},
        {groupType: "resource", assetType: "BASIC", deployment: resourceDeployment},
        {groupType: "units", assetType: "BASIC", deployment: unitsDeployment},
        {groupType: "workers", assetType: "BASIC", deployment: workersDeployment},
    ];

    const getAssetIdString = (worldAssetImplementation: WorldAssetImplementation): string => {
        const bytes32String = ethers.solidityPackedKeccak256(
            ["bytes32", "bytes32"],
            [
                ethers.solidityPackedKeccak256(["string"], [worldAssetImplementation.groupType]),
                ethers.solidityPackedKeccak256(["string"], [worldAssetImplementation.assetType]),
            ]
        );

        const bytes = ethers.toUtf8Bytes(bytes32String);
        const bytes28 = bytes.slice(0, 58); // 58 value is valid, but strange

        return ethers.toUtf8String(bytes28);
    }

    const rewardPoolAddress = worldSigner.address;//SETTLEMENT COST RECEIVER GOES HERE

    if (!isWorldInitialized) {
        const assetIds = worldAssetImplementations.map((worldAssetImplementation) => {
            return getAssetIdString(worldAssetImplementation);
        });

        const implementationAddresses = worldAssetImplementations.map((worldAssetImplementation) => {
            return worldAssetImplementation.deployment.address;
        });

        const packedAddresses = AbiCoder.defaultAbiCoder().encode(
            [
                "address", "address", "address", "address", "address", "address", "address", "address", "address"
            ],
            [
                registryProxyDeployment.address,
                crossErasMemoryProxyDeployment.address,
                geographyProxyDeployment.address,
                bannersDeployment.address,
                mithraeumConfig.ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS,
                mithraeumConfig.ERC20_FOR_REGION_INCLUSION_ADDRESS!,
                regionOwnershipTokenDeployment.address,
                distributionsDeployment.address,
                rewardPoolAddress,
            ]
        );

        await worldProxyInstance
            .init(
                packedAddresses,
                assetIds,
                implementationAddresses
            )
            .then((tx) => tx.wait());

        console.log(`${greenCheckmark} World initialized`);
    } else {
        const updateWorldAssetImplementations = async (
            worldAssetImplementations: WorldAssetImplementation[]
        ): Promise<void> => {
            const implementationsAddresses = await Promise.all(
                worldAssetImplementations.map((worldAssetImplementation) => {
                    const assetId = getAssetIdString(worldAssetImplementation);
                    return worldProxyInstance.implementations(assetId);
                })
            );

            const zippedImplementationsWithAddresses = zip(worldAssetImplementations, implementationsAddresses) as [
                WorldAssetImplementation,
                string
            ][];

            const incorrectImplementations = zippedImplementationsWithAddresses.filter(
                ([worldAssetImplementation, implementationsAddress]) => {
                    return !cmpAddress(worldAssetImplementation.deployment.address, implementationsAddress);
                }
            );

            if (incorrectImplementations.length === 0) {
                console.log("All implementations correct");
                return;
            }

            const assetIds = incorrectImplementations.map(([worldAssetImplementation]) => {
                return getAssetIdString(worldAssetImplementation);
            });

            const implementationAddresses = incorrectImplementations.map(([worldAssetImplementation]) => {
                return worldAssetImplementation.deployment.address;
            });

            await worldProxyInstance.setImplementations(assetIds, implementationAddresses).then((tx) => tx.wait());
            console.log(`${greenCheckmark} ${incorrectImplementations.length} implementations corrected`);
        };

        await updateWorldAssetImplementations(worldAssetImplementations);

        const [
            registryContractAddressInWorld,
            crossErasMemoryAddressInWorld,
            geographyContractAddressInWorld,
            bannersContractAddressInWorld,
            erc20TokenForSettlementPurchaseAddressInWorld,
            erc20TokenForRegionInclusionAddressInWorld,
            regionOwnershipTokenAddressInWorld,
            distributionsAddressInWorld,
            rewardPoolAddressInWorld,
        ] = await Promise.all([
            worldProxyInstance.registry(),
            worldProxyInstance.crossErasMemory(),
            worldProxyInstance.geography(),
            worldProxyInstance.bannerContract(),
            worldProxyInstance.erc20ForSettlementPurchase(),
            worldProxyInstance.erc20ForRegionInclusion(),
            worldProxyInstance.regionOwnershipToken(),
            worldProxyInstance.distributions(),
            worldProxyInstance.rewardPool(),
        ]);

        if (!cmpAddress(registryContractAddressInWorld, registryProxyDeployment.address)) {
            throw new Error("REGISTRY IS NOT SAME AS IN WORLD, NEW DEPLOYMENT REQUIRED");
        }

        if (!cmpAddress(crossErasMemoryAddressInWorld, crossErasMemoryProxyDeployment.address)) {
            throw new Error("CROSS ERA MEMORY IS NOT SAME AS IN WORLD, NEW DEPLOYMENT REQUIRED");
        }

        if (!cmpAddress(geographyContractAddressInWorld, geographyProxyDeployment.address)) {
            throw new Error("REGISTRY IS NOT SAME AS IN WORLD, NEW DEPLOYMENT REQUIRED");
        }

        if (!cmpAddress(bannersContractAddressInWorld, bannersDeployment.address)) {
            throw new Error("BANNERS IS NOT SAME AS IN WORLD, NEW DEPLOYMENT REQUIRED");
        }

        if (!cmpAddress(erc20TokenForSettlementPurchaseAddressInWorld, mithraeumConfig.ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS!)) {
            throw new Error("ERC20 TOKEN FOR SETTLEMENT PURCHASE IS NOT SAME AS IN WORLD, NEW DEPLOYMENT REQUIRED");
        }

        if (!cmpAddress(erc20TokenForRegionInclusionAddressInWorld, mithraeumConfig.ERC20_FOR_REGION_INCLUSION_ADDRESS!)) {
            throw new Error("ERC20 TOKEN FOR REGION INCLUSION IS NOT SAME AS IN WORLD, NEW DEPLOYMENT REQUIRED");
        }

        if (!cmpAddress(regionOwnershipTokenAddressInWorld, regionOwnershipTokenDeployment.address)) {
            throw new Error("REGION OWNERSHIP TOKEN IS NOT SAME AS IN WORLD, NEW DEPLOYMENT REQUIRED");
        }

        if (!cmpAddress(distributionsAddressInWorld, distributionsDeployment.address)) {
            throw new Error("DISTRIBUTIONS TOKEN IS NOT SAME AS IN WORLD, NEW DEPLOYMENT REQUIRED");
        }

        if (!cmpAddress(rewardPoolAddressInWorld, rewardPoolAddress)) {
            throw new Error("REWARD POOL IS NOT SAME AS IN WORLD, NEW DEPLOYMENT REQUIRED");
        }
    }

    console.log(`Empty world created`);

    const resolverInstance = Resolver__factory.connect(mithraeumConfig.RESOLVER_ADDRESS!, worldSigner);
    const worldAddressInResolver = await resolverInstance.worlds(worldDeployer, mithraeumConfig.ENVIRONMENT_NAME);
    if (!cmpAddress(worldAddressInResolver, worldProxyDeployment.address)) {
        await resolverInstance.setWorldAddress(
            mithraeumConfig.ENVIRONMENT_NAME,
            worldProxyDeployment.address
        ).then((tx) => tx.wait());
        console.log(`${greenCheckmark} World address updated`);
    } else {
        console.log(`World address already updated`);
    }

    if (process.env.LOG_GRAPH_VARS) {
        console.log(
            `World: ${worldProxyDeployment.address} at ${JSON.stringify(worldProxyDeployment.receipt?.blockNumber)}`
        );
        console.log(
            `Geography: ${geographyProxyDeployment.address} at ${JSON.stringify(
                geographyProxyDeployment.receipt?.blockNumber
            )}`
        );
        console.log(
            `Banners: ${bannersDeployment.address} at ${JSON.stringify(bannersDeployment.receipt?.blockNumber)}`
        );
        console.log(
            `Distributions: ${distributionsDeployment.address} at ${JSON.stringify(
                distributionsDeployment.receipt?.blockNumber
            )}`
        );
    }
};

func.tags = ["EmptyWorld"];
func.dependencies = [
    "MulticallDefiner",
    "ERC20ForSettlementPurchaseDefiner",
    "ERC20ForRegionInclusionDefiner"
];
export default func;
