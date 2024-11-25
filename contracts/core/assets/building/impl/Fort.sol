// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "../Building.sol";
import "./IFort.sol";

contract Fort is Building, IFort {
    /// @inheritdoc IFort
    uint256 public override health;

    /// @inheritdoc IBuilding
    function getProducingResourceTypeId() public view override(Building, IBuilding) returns (bytes32) {
        return bytes32(0);
    }

    /// @inheritdoc IBuilding
    function resetDistribution() public override(Building, IBuilding) {
        revert Disabled();
    }

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams)
        public
        override
        initializer
    {
        (
            address settlementAddress,
            bytes32 currentBuildingTypeId
        ) = abi.decode(initParams, (address, bytes32));

        relatedSettlement = ISettlement(settlementAddress);
        buildingTypeId = currentBuildingTypeId;

        basicProduction.level = 1;
        basicProduction.coefficient = 1;

        advancedProduction.level = 1;
        advancedProduction.coefficient = 1;

        buildingActivationInfo.activationTime = uint64(block.timestamp);
        buildingActivationInfo.isWorkersClaimed = true;

        _updateProductionInfo(
            block.timestamp,
            0,
            0,
            0
        );

        health = 4e18;
    }

    /// @inheritdoc IBuilding
    function getConfig()
        public
        pure
        override(Building, IBuilding)
        returns (ProductionConfigItem[] memory)
    {
        ProductionConfigItem[] memory productionConfigItems = new ProductionConfigItem[](3);

        productionConfigItems[0] = ProductionConfigItem({
            resourceTypeId: FOOD_TYPE_ID,
            amountPerTick: uint256(5e18) / (1 days),
            isProducing: false
        });

        productionConfigItems[1] = ProductionConfigItem({
            resourceTypeId: WOOD_TYPE_ID,
            amountPerTick: uint256(3e18) / (1 days),
            isProducing: false
        });

        productionConfigItems[2] = ProductionConfigItem({
            resourceTypeId: HEALTH_TYPE_ID,
            amountPerTick: uint256(1e18) / (1 days),
            isProducing: true
        });

        return productionConfigItems;
    }

    /// @inheritdoc IFort
    function getMaxHealthOnLevel(uint256 level) public view override returns (uint256) {
        return (getBuildingCoefficient(level) ** 2) * 4e18;
    }

    /// @inheritdoc IBuilding
    function getTreasuryAmount(uint256 timestamp) public view override(Building, IBuilding) returns (uint256) {
        return 0;
    }

    /// @inheritdoc IBuilding
    function getMaxTreasuryByLevel(uint256 level) public view override(Building, IBuilding) returns (uint256) {
        return 0;
    }

    /// @inheritdoc IBuilding
    function activateBuilding(address resourcesOwner) public override(Building, IBuilding) {
        revert Disabled();
    }

    /// @inheritdoc IBuilding
    function claimWorkersForBuildingActivation() public override(Building, IBuilding) {
        revert Disabled();
    }

    /// @inheritdoc IBuilding
    function getUpgradePrice(uint256 level)
        public
        view
        virtual
        override(Building, IBuilding)
        returns (uint256)
    {
        // Same formula as 'buildings' upgrade price, but since fort does not have treasury -> it is redefined
        uint256 maxTreasuryByLevel = (getBuildingCoefficient(level) ** 2) * 10 * 1e18;
        uint256 maxTreasuryByNextLevel = (getBuildingCoefficient(level + 1) ** 2) * 10 * 1e18;
        uint256 maxTreasuryByLevelWithCoefficient = (maxTreasuryByLevel * 75) / 100;
        uint256 treasuryDifference = maxTreasuryByNextLevel - maxTreasuryByLevelWithCoefficient;
        uint256 defaultUpgradePrice = treasuryDifference / 6;

        return defaultUpgradePrice * Config.getBuildingUpgradeCostMultiplier(buildingTypeId) / 1e18;
    }

    /// @inheritdoc IBuilding
    function updateState() public override(Building, IBuilding) {
        relatedSettlement.relatedRegion().updateState();

        uint256 currentTime = _getCurrentTime();
        if (productionInfo.lastUpdateStateTime == currentTime) {
            return;
        }

        ProductionResultItem[] memory productionResult = getProductionResult(currentTime);
        _updateProductionInfo(currentTime, 0, 0, 0);

        IEra _era = era();
        for (uint256 i = 0; i < productionResult.length; i++) {
            if (productionResult[i].balanceDelta == 0) {
                continue;
            }

            if (productionResult[i].resourceTypeId == HEALTH_TYPE_ID) {
                // Updates health and applies siege damage

                uint256 healthDelta = productionResult[i].balanceDelta;
                bool isHealthProduced = productionResult[i].isProduced;
                uint256 currentHealth = health;

                if (isHealthProduced) {
                    _updateHealth(currentHealth + healthDelta);
                    continue;
                }

                if (currentHealth >= healthDelta) {
                    _updateHealth(currentHealth - healthDelta);
                    continue;
                }

                _updateHealth(0);
                relatedSettlement.siege().applyDamage(healthDelta - currentHealth);

                continue;
            }

            _era.resources(productionResult[i].resourceTypeId).burn(productionResult[i].balanceDelta);
        }
    }

    /// @inheritdoc IBuilding
    function getProductionResult(uint256 timestamp)
        public
        view
        virtual
        override(Building, IBuilding)
        returns (ProductionResultItem[] memory)
    {
        if (timestamp == 0) {
            timestamp = block.timestamp;
        }

        IWorld _world = world();
        uint256 gameBeginTime = _world.gameBeginTime();
        if (timestamp < gameBeginTime) {
            timestamp = gameBeginTime;
        }

        uint256 gameEndTime = _world.gameEndTime();
        if (gameEndTime != 0) {
            timestamp = Math.min(timestamp, gameEndTime);
        }

        ProductionConfigItem[] memory productionConfigItems = getConfig();
        ProductionResultItem[] memory productionResult = new ProductionResultItem[](productionConfigItems.length);
        for (uint256 i = 0; i < productionConfigItems.length; i++) {
            productionResult[i] = ProductionResultItem({
                resourceTypeId: productionConfigItems[i].resourceTypeId,
                isProduced: productionConfigItems[i].isProducing,
                balanceDelta: 0
            });
        }

        uint256 productionLastUpdateStateTime = productionInfo.lastUpdateStateTime;
        if (productionLastUpdateStateTime < gameBeginTime) {
            productionLastUpdateStateTime = gameBeginTime;
        }

        if (timestamp <= productionLastUpdateStateTime) {
            return productionResult;
        }

        FortProductionResultParams memory fortProductionResultParams = _calculateFortProductionResultParams(
            timestamp,
            productionLastUpdateStateTime,
            productionConfigItems[2].amountPerTick
        );

        for (uint256 i = 0; i < productionConfigItems.length; i++) {
            if (productionConfigItems[i].isProducing) {
                bool isHealthProduced = fortProductionResultParams.healthProduced >= fortProductionResultParams.healthLost;
                uint256 healthChanges = isHealthProduced
                    ? fortProductionResultParams.healthProduced - fortProductionResultParams.healthLost
                    : fortProductionResultParams.healthLost - fortProductionResultParams.healthProduced;

                productionResult[i].isProduced = isHealthProduced;
                productionResult[i].balanceDelta = healthChanges;
            } else {
                productionResult[i].balanceDelta = productionConfigItems[i].amountPerTick * fortProductionResultParams.advancedTicksProduced;
            }
        }

        return productionResult;
    }

    /// @inheritdoc IFort
    function calculateDamageDone(uint256 timestamp)
        public
        view
        override
        returns (uint256 damage)
    {
        ProductionResultItem[] memory productionResultItems = getProductionResult(timestamp);

        uint256 healthDelta;
        bool isHealthProduced;

        for (uint256 i = 0; i < productionResultItems.length; i++) {
            if (productionResultItems[i].resourceTypeId == HEALTH_TYPE_ID) {
                healthDelta = productionResultItems[i].balanceDelta;
                isHealthProduced = productionResultItems[i].isProduced;
                break;
            }
        }

        if (healthDelta == 0) {
            return 0;
        }

        if (isHealthProduced) {
            return 0;
        }

        if (health >= healthDelta) {
            return 0;
        }

        return healthDelta - health;
    }

    struct FortProductionResultParams {
        uint256 healthProduced;
        uint256 healthLost;
        uint256 advancedTicksProduced;
    }

    /// @inheritdoc Building
    function _updateProsperity() internal override {}

    /// @dev Calculates fort degen income based on current siege power
    function _calculateDegenIncome() internal view returns (uint256) {
        return relatedSettlement.siege().totalSiegePower() * Config.globalMultiplier;
    }

    /// @dev Calculates fort production result params
    function _calculateFortProductionResultParams(
        uint256 timestamp,
        uint256 productionLastUpdateStateTime,
        uint256 healthPerTick
    ) internal view returns (FortProductionResultParams memory) {
        uint256 basicRegenIncome = (healthPerTick * _getBasicProductionMultiplier()) / 1e18;
        uint256 advancedRegenIncome = (healthPerTick * _getAdvancedProductionMultiplier()) / 1e18;
        uint256 degenIncome = _calculateDegenIncome();

        // If basic regen greater (or equal) than degen -> actual degen is zero and basic regen reduced
        // else basic regen is zero and degen is reduced
        if (basicRegenIncome >= degenIncome) {
            basicRegenIncome = basicRegenIncome - degenIncome;
            degenIncome = 0;
        } else {
            degenIncome = degenIncome - basicRegenIncome;
            basicRegenIncome = 0;
        }

        uint256 maxHealth = getMaxHealthOnLevel(getBuildingLevel());
        uint256 toBeProducedHealth = healthPerTick * advancedProduction.toBeProducedTicks;

        FortAdvancedProductionParams memory fortAdvancedProductionParams = _calculateFortAdvancedProductionParams(
            health,
            maxHealth,
            basicRegenIncome,
            advancedRegenIncome,
            degenIncome,
            toBeProducedHealth
        );

        uint256 elapsedSeconds = timestamp - productionLastUpdateStateTime;

        return _composeFortProductionResultParams(
            elapsedSeconds,
            fortAdvancedProductionParams.fullHealthProductionSeconds,
            fortAdvancedProductionParams.partialHealthProductionSeconds,
            basicRegenIncome,
            advancedRegenIncome,
            degenIncome,
            healthPerTick
        );
    }

    /// @dev Composes fort production result params by provided data
    function _composeFortProductionResultParams(
        uint256 elapsedSeconds,
        uint256 fullHealthProductionSeconds,
        uint256 partialHealthProductionSeconds,
        uint256 basicRegenIncome,
        uint256 advancedRegenIncome,
        uint256 degenIncome,
        uint256 healthPerTick
    ) internal pure returns (FortProductionResultParams memory) {
        uint256 fullIncomeSecondsElapsed = Math.min(
            fullHealthProductionSeconds,
            elapsedSeconds
        );

        uint256 partialIncomeSecondsElapsed = Math.min(
            elapsedSeconds - fullIncomeSecondsElapsed,
            partialHealthProductionSeconds
        );

        uint256 basicHealthProduced = elapsedSeconds * basicRegenIncome;
        uint256 advancedHealthProduced = fullIncomeSecondsElapsed * advancedRegenIncome + partialIncomeSecondsElapsed * degenIncome;

        uint256 healthProduced = basicHealthProduced + advancedHealthProduced;
        uint256 healthLost = elapsedSeconds * degenIncome;
        uint256 advancedTicksProduced = advancedHealthProduced / healthPerTick;

        return FortProductionResultParams(healthProduced, healthLost, advancedTicksProduced);
    }

    struct FortAdvancedProductionParams {
        uint256 fullHealthProductionSeconds;
        uint256 partialHealthProductionSeconds;
    }

    /// @dev Calculates fort advanced production params
    function _calculateFortAdvancedProductionParams(
        uint256 currentHealth,
        uint256 maxHealth,
        uint256 basicRegenIncome,
        uint256 advancedRegenIncome,
        uint256 degenIncome,
        uint256 toBeProducedHealth
    ) internal pure returns (FortAdvancedProductionParams memory) {
        // If advanced regen = 0, no advanced production is taking place
        if (advancedRegenIncome == 0) {
            return FortAdvancedProductionParams(0, 0);
        }

        uint256 missingHealth = maxHealth - currentHealth;
        uint256 regenIncome = basicRegenIncome + advancedRegenIncome;
        uint256 secondsUntilResourcesDepletionWithFullSpeed = toBeProducedHealth / advancedRegenIncome;

        // If degen is greater (or equal) than combined regen ->
        // advanced production is working at full speed and will stop when there will be no resources
        if (degenIncome >= regenIncome) {
            return FortAdvancedProductionParams(secondsUntilResourcesDepletionWithFullSpeed, 0);
        }

        uint256 netRegen = regenIncome - degenIncome;
        uint256 secondsUntilFullWithCurrentSpeed = (missingHealth % netRegen) == 0
            ? missingHealth / netRegen
            : (missingHealth / netRegen) + 1;

        // If degen is zero -> hp can only go up and will stop when its full or there will be no resources
        if (degenIncome == 0) {
            return FortAdvancedProductionParams(
                Math.min(
                    secondsUntilResourcesDepletionWithFullSpeed,
                    secondsUntilFullWithCurrentSpeed
                ),
                0
            );
        }

        // Basic regen at this point is always zero and degen is not zero

        // If resources will run out faster than we will reach full hp ->
        // advanced production is working at full speed and will be interrupted by empty resources
        if (secondsUntilResourcesDepletionWithFullSpeed <= secondsUntilFullWithCurrentSpeed) {
            return FortAdvancedProductionParams(secondsUntilResourcesDepletionWithFullSpeed, 0);
        }

        // At this point we will reach full hp with current production speed meaning partial production will take place
        // and it will last until we have resources for current degen
        // or it also means
        // part of production that is left after we have reached full hp is the same as
        // amount of seconds until full subtracted from amount of seconds until depletion BUT multiplied by regen/degen ratio
        // in order to 'extend' production seconds
        // for example:
        // - we have 100 seconds until resources depletion with full speed
        // - we have 40 seconds until full with current speed
        // - we have 20 hp/s of advanced regen
        // - we have 10 hp/s of degen
        // - 100 - 40 = 60 seconds -> amount of seconds of full production speed that has to be converted to lower consumption
        // or 60 seconds * 20 hp/s = 1200hp -> amount of hp would have been produced with full speed
        // then 1200 hp / 10hp/s = 120 seconds of lowered production
        uint256 partialHealthProductionSeconds = ((secondsUntilResourcesDepletionWithFullSpeed - secondsUntilFullWithCurrentSpeed) * regenIncome) / degenIncome;

        return FortAdvancedProductionParams(secondsUntilFullWithCurrentSpeed, partialHealthProductionSeconds);
    }

    /// @dev Updates fort health
    function _updateHealth(uint256 value) internal {
        uint256 maxHealth = getMaxHealthOnLevel(getBuildingLevel());
        uint256 newHealth = Math.min(value, maxHealth);
        health = newHealth;

        emit HealthUpdated(newHealth);
    }
}
