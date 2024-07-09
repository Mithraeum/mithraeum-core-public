import {ethers} from "ethers";
import {_1e18} from "./scripts/utils/const";
import {MithraeumConfig} from "./types/MithraeumConfig";

export type MithraeumConfigKeys = 'hardhat' | 'hardhatLocalhost' | 'xdaiPredev' | 'xdaiDev' | 'xdaiStage' | 'xdaiRelease' | 'nova' | 'zkSyncSepolia';

export const mithraeumConfigs: Record<MithraeumConfigKeys, MithraeumConfig> = {
    hardhat: {
        ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS: ethers.ZeroAddress,
        ERC20_FOR_REGION_INCLUSION_ADDRESS: null, // null means stub erc20 token will be deployed
        MULTICALL3_ADDRESS: null,
        FLAG_JSON_CONFIG: "hardhat",
        GLOBAL_MULTIPLIER: 1,
        SETTLEMENT_STARTING_PRICE: _1e18.multipliedBy(250).toString(10), //250$
        REGION_INCLUSION_PRICE: _1e18.multipliedBy(100000).toString(10), //100000
        MAXIMUM_AMOUNT_OF_MINTED_BANNERS_PER_ADDRESS: ethers.MaxUint256,
    },
    hardhatLocalhost: {
        ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS: ethers.ZeroAddress,
        ERC20_FOR_REGION_INCLUSION_ADDRESS: ethers.ZeroAddress,
        MULTICALL3_ADDRESS: null,
        FLAG_JSON_CONFIG: "hardhatLocalhost",
        GLOBAL_MULTIPLIER: 1000,
        SETTLEMENT_STARTING_PRICE: _1e18.multipliedBy(250).toString(10), //250$
        REGION_INCLUSION_PRICE: _1e18.multipliedBy(100000).toString(10), //100000
        MAXIMUM_AMOUNT_OF_MINTED_BANNERS_PER_ADDRESS: ethers.MaxUint256,
    },
    xdaiPredev: {
        RESOLVER_ADDRESS: "0x365B81B494a99F1DAA778eaeA0BEbc950E8bE536",
        MULTICALL3_ADDRESS: "0xcA11bde05977b3631167028862bE2a173976CA11",
        ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS: ethers.ZeroAddress,
        ERC20_FOR_REGION_INCLUSION_ADDRESS: null,
        FLAG_JSON_CONFIG: "xdaiPredev",
        GLOBAL_MULTIPLIER: 300,
        SETTLEMENT_STARTING_PRICE: _1e18.dividedToIntegerBy(10).toString(10), //0.1$
        REGION_INCLUSION_PRICE: _1e18.multipliedBy(100000).toString(10), //100000
        MAXIMUM_AMOUNT_OF_MINTED_BANNERS_PER_ADDRESS: ethers.MaxUint256,
    },
    xdaiDev: {
        RESOLVER_ADDRESS: "0xC30f5875EC9F68703d417e843F656eDBDAbe620B",
        MULTICALL3_ADDRESS: "0xcA11bde05977b3631167028862bE2a173976CA11",
        ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS: ethers.ZeroAddress,
        ERC20_FOR_REGION_INCLUSION_ADDRESS: null,
        FLAG_JSON_CONFIG: "xdaiDev",
        GLOBAL_MULTIPLIER: 300,
        SETTLEMENT_STARTING_PRICE: _1e18.dividedToIntegerBy(10).toString(10), //0.1$
        REGION_INCLUSION_PRICE: _1e18.multipliedBy(100000).toString(10), //100000
        MAXIMUM_AMOUNT_OF_MINTED_BANNERS_PER_ADDRESS: ethers.MaxUint256,
    },
    xdaiStage: {
        RESOLVER_ADDRESS: "0x50AdD8918f6de2d7fcB06BCad1e2586C1cF06540",
        MULTICALL3_ADDRESS: "0xcA11bde05977b3631167028862bE2a173976CA11",
        ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS: ethers.ZeroAddress,
        ERC20_FOR_REGION_INCLUSION_ADDRESS: ethers.ZeroAddress,
        FLAG_JSON_CONFIG: "xdaiStage",
        GLOBAL_MULTIPLIER: 10,
        SETTLEMENT_STARTING_PRICE: _1e18.multipliedBy(1).toString(10), // 1$
        REGION_INCLUSION_PRICE: _1e18.multipliedBy(100000).toString(10), //100000
        MAXIMUM_AMOUNT_OF_MINTED_BANNERS_PER_ADDRESS: ethers.MaxUint256,
    },
    xdaiRelease: {
        RESOLVER_ADDRESS: "0x2709a676fcebf88bb35fa63433338d5bb0df5318",
        MULTICALL3_ADDRESS: "0xcA11bde05977b3631167028862bE2a173976CA11",
        ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS: ethers.ZeroAddress,
        ERC20_FOR_REGION_INCLUSION_ADDRESS: ethers.ZeroAddress,
        FLAG_JSON_CONFIG: "xdaiRelease",
        GLOBAL_MULTIPLIER: 1,
        SETTLEMENT_STARTING_PRICE: _1e18.multipliedBy(250).toString(10), // 250$
        REGION_INCLUSION_PRICE: _1e18.multipliedBy(100000).toString(10), //100000
        MAXIMUM_AMOUNT_OF_MINTED_BANNERS_PER_ADDRESS: ethers.MaxUint256,
    },
    nova: {
        RESOLVER_ADDRESS: "0x3191798fBB68BD07a95f8D6Dd2f7E7DBA5c8dcaD",
        MULTICALL3_ADDRESS: "0xe3Ce9a2D0D24B0eac7a26394ca08BBf59b66e8f0",
        ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS: null,
        ERC20_FOR_REGION_INCLUSION_ADDRESS: null,
        FLAG_JSON_CONFIG: "nova",
        GLOBAL_MULTIPLIER: 100,
        SETTLEMENT_STARTING_PRICE: _1e18.multipliedBy(1000).toString(10), //1000
        REGION_INCLUSION_PRICE: _1e18.multipliedBy(5000).toString(10), //5000
        MAXIMUM_AMOUNT_OF_MINTED_BANNERS_PER_ADDRESS: ethers.MaxUint256,
    },
    zkSyncSepolia: {
        RESOLVER_ADDRESS: "0x56aB9C1183Db46541f4abE2aC598D7af0E1E3C8F",
        MULTICALL3_ADDRESS: "0xF9cda624FBC7e059355ce98a31693d299FACd963",
        ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS: null,
        ERC20_FOR_REGION_INCLUSION_ADDRESS: null,
        FLAG_JSON_CONFIG: "zkSyncSepolia",
        GLOBAL_MULTIPLIER: 100,
        SETTLEMENT_STARTING_PRICE: _1e18.multipliedBy(1000).toString(10), //1000
        REGION_INCLUSION_PRICE: _1e18.multipliedBy(5000).toString(10), //5000
        MAXIMUM_AMOUNT_OF_MINTED_BANNERS_PER_ADDRESS: ethers.MaxUint256,
    }
};