// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../Building.sol";

contract Farm is Building {
    /// @inheritdoc Building
    function getConfig() public pure override returns (ProductionConfigItem[] memory) {
        ProductionConfigItem[] memory productionConfigItems = new ProductionConfigItem[](1);

        productionConfigItems[0] = ProductionConfigItem({
            resourceTypeId: FOOD_TYPE_ID,
            amountPerTick: uint256(10e18) / (1 days) / 10000,
            isProducing: true
        });

        return productionConfigItems;
    }
}
