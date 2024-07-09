// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../Building.sol";

contract Smithy is Building {
    /// @inheritdoc IBuilding
    function getConfig() public pure override returns (ProductionConfigItem[] memory) {
        ProductionConfigItem[] memory productionConfigItems = new ProductionConfigItem[](4);

        productionConfigItems[0] = ProductionConfigItem({
            resourceTypeId: FOOD_TYPE_ID,
            amountPerTick: uint256(10e18) / (1 days) / 10000,
            isProducing: false
        });

        productionConfigItems[1] = ProductionConfigItem({
            resourceTypeId: WOOD_TYPE_ID,
            amountPerTick: uint256(10e18) / (1 days) / 10000,
            isProducing: false
        });

        productionConfigItems[2] = ProductionConfigItem({
            resourceTypeId: ORE_TYPE_ID,
            amountPerTick: uint256(10e18) / (1 days) / 10000,
            isProducing: false
        });

        productionConfigItems[3] = ProductionConfigItem({
            resourceTypeId: INGOT_TYPE_ID,
            amountPerTick: uint256(10e18) / (1 days) / 10000,
            isProducing: true
        });

        return productionConfigItems;
    }
}
