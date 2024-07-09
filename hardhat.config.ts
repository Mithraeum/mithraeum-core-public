import {HardhatUserConfig} from "hardhat/config";

import "@matterlabs/hardhat-zksync-solc";

import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "solidity-docgen";
import "./chai-setup";
import {MithraeumConfig} from "./types/MithraeumConfig";
import {mithraeumConfigs} from "./mithraeum.config";

declare module "hardhat/types/config" {
    interface HardhatNetworkUserConfig {
        mithraeumConfig: MithraeumConfig;
    }

    interface HttpNetworkUserConfig {
        mithraeumConfig: MithraeumConfig;
    }
}

const dotenv = require("dotenv");
dotenv.config({path: __dirname + "/.env"});

const config: HardhatUserConfig = {
    zksolc: { // need to reference zksolc compiler
        version: "latest",
        compilerSource: "binary",
    },
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 40,
            },
        },
    },
    namedAccounts: {
        worldDeployer: 0,

        //for tests (no need to provide private key)
        testUser1: 1,
        testUser2: 2,
        testUser3: 3,
        testUser4: 4,
    },
    networks: {
        hardhat: {
            live: false,
            tags: ["hardhat-memory"],
            chainId: 100,
            mithraeumConfig: mithraeumConfigs.hardhat
        },
        xdaiPredev: {
            saveDeployments: true,
            // url: "https://rpc.ankr.com/gnosis",
            // url: "https://rpc.gnosischain.com",
            url: "https://rpc.eu-central-2.gateway.fm/v1/gnosis/non-archival/mainnet",
            tags: ["xdaiPredev"],
            accounts: [process.env.WORLD_DEPLOYER_PK!],
            mithraeumConfig: mithraeumConfigs.xdaiPredev
        },
        xdaiDev: {
            url: "https://rpc.gnosischain.com",
            // url: "https://rpc.eu-central-2.gateway.fm/v1/gnosis/non-archival/mainnet",
            // url: "https://rpc.eu-central-2.gateway.fm/v4/gnosis/non-archival/mainnet?apiKey=woZPH881Lm68C3cOdGNWysbpgplCw4id.un6wMKDCejpmYmJM",
            saveDeployments: true,
            tags: ["xdaiDev"],
            accounts: [process.env.WORLD_DEPLOYER_PK!],
            mithraeumConfig: mithraeumConfigs.xdaiDev
        },
        xdaiStage: {
            saveDeployments: true,
            url: "https://rpc.gnosischain.com",
            tags: ["xdaiStage"],
            accounts: [process.env.WORLD_DEPLOYER_PK!],
            mithraeumConfig: mithraeumConfigs.xdaiStage
        },
        xdaiRelease: {
            saveDeployments: true,
            url: "https://rpc.gnosischain.com", //"https://rpc.eu-central-2.gateway.fm/v1/gnosis/non-archival/mainnet",
            tags: ["xdaiRelease"],
            accounts: [process.env.WORLD_DEPLOYER_PK!],
            mithraeumConfig: mithraeumConfigs.xdaiRelease
        },
        nova: {
            saveDeployments: true,
            url: "https://rpc.ankr.com/arbitrumnova/896c1e1e1fc3db15d6c0f910dbf2a832f808ed632bff6a7a6db204a406087592",
            tags: ["nova"],
            accounts: [process.env.WORLD_DEPLOYER_PK!],
            mithraeumConfig: mithraeumConfigs.nova
        },
        zkSyncSepolia: {
            saveDeployments: true,
            url: "https://sepolia.era.zksync.dev",
            tags: ["zkSyncSepolia"],
            accounts: [process.env.WORLD_DEPLOYER_PK!],
            mithraeumConfig: mithraeumConfigs.zkSyncSepolia,
            zksync: true,
        },
    },
    paths: {
        deploy: __dirname + "/deploy",
        deployments: __dirname + "/deployments",
        root: __dirname,
        sources: __dirname + "/contracts",
        cache: __dirname + "/cache",
        artifacts: __dirname + "/artifacts",
        tests: __dirname + "/test",
        imports: __dirname + "/imports",
    },
    docgen: {
        outputDir: "./docs/generated",
        pages: "files",
        templates: "./docs/templates",
    },
};

export default config;
