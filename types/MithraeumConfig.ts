export interface MithraeumConfig {
    RESOLVER_ADDRESS?: string;
    MULTICALL3_ADDRESS: string | null;
    ERC20_FOR_SETTLEMENT_PURCHASE_ADDRESS: string | null;
    ERC20_FOR_REGION_INCLUSION_ADDRESS: string | null;
    ENVIRONMENT_NAME: string;
    MAXIMUM_AMOUNT_OF_MINTED_BANNERS_PER_ADDRESS: bigint;
}