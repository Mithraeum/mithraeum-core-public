import {HardhatUserConfig} from "hardhat/config";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ethers";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "solidity-docgen";
import "./chai-setup";
import hardhatConfig from "./hardhat.config";
import {mithraeumConfigs} from "./mithraeum.config";

const dotenv = require("dotenv");
dotenv.config({path: __dirname + "/.env"});

const config: HardhatUserConfig = {
    ...hardhatConfig,
    networks: {
        hardhat: {
            live: false,
            tags: ["hardhat-memory", "hardhatLocalhost"],
            chainId: 100,
            mithraeumConfig: mithraeumConfigs.hardhat,
        },
    },
};

export default config;
