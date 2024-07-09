// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../../../libraries/MathExtension.sol";
import "./IBuilding.sol";
import "../WorldAsset.sol";
import "../../../const/GameAssetTypes.sol";

abstract contract Building is WorldAsset, ERC1155Receiver, IBuilding {
    /// @inheritdoc IBuilding
    ISettlement public override relatedSettlement;
    /// @inheritdoc IBuilding
    bytes32 public override buildingTypeId;
    /// @inheritdoc IBuilding
    BasicProduction public override basicProduction;
    /// @inheritdoc IBuilding
    AdvancedProduction public override advancedProduction;
    /// @inheritdoc IBuilding
    uint256 public override upgradeCooldownEndTime;
    /// @inheritdoc IBuilding
    uint256 public override givenProsperityAmount;
    /// @inheritdoc IBuilding
    ProductionInfo public override productionInfo;
    /// @inheritdoc IBuilding
    uint256 public override distributionId;
    /// @inheritdoc IBuilding
    mapping(address => uint256) public override producedResourceDebt;

    /// @dev Only distributions contract modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyDistributions() {
        _onlyDistributions();
        _;
    }

    /// @dev Only settlement owner modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlySettlementOwner() {
        _onlySettlementOwner();
        _;
    }

    /// @dev Only ruler or world asset from same era modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyRulerOrWorldAssetFromSameEra() {
        _onlyRulerOrWorldAssetFromSameEra();
        _;
    }

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public virtual override initializer {
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

        _updateProductionInfo(
            block.timestamp,
            relatedSettlement.relatedRegion().getRegionTime(block.timestamp),
            0,
            0
        );

        _createDefaultDistribution();
    }

    /// @inheritdoc IERC1155Receiver
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        return IERC1155Receiver.onERC1155Received.selector;
    }

    /// @inheritdoc IERC1155Receiver
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    /// @inheritdoc IBuilding
    function handleProductionResourcesChanged() public virtual override {
        _updateProsperity();
        advancedProduction.toBeProducedTicks = _calculateProductionTicksAmount();
    }

    /// @inheritdoc IBuilding
    function updateState() public virtual override {
        relatedSettlement.relatedRegion().updateState();

        uint256 currentTime = _getCurrentTime();
        if (productionInfo.lastUpdateStateTime == currentTime) {
            return;
        }

        ProductionResultItem[] memory productionResult = getProductionResult(currentTime);

        _updateProductionInfo(
            currentTime,
            relatedSettlement.relatedRegion().getRegionTime(currentTime),
            productionInfo.readyToBeDistributed,
            productionInfo.totalDebt
        );

        for (uint256 i = 0; i < productionResult.length; i++) {
            if (productionResult[i].balanceDelta == 0) {
                continue;
            }

            if (productionResult[i].isProduced) {
                _saveProducedResource(productionResult[i].resourceTypeId, productionResult[i].balanceDelta);
            } else {
                era().resources(productionResult[i].resourceTypeId).burn(productionResult[i].balanceDelta);
            }
        }

        _updateProsperity();
    }

    /// @inheritdoc IBuilding
    function updateDebtsAccordingToNewDistributionsAmounts(
        address from,
        address to,
        uint256 amount
    ) public override onlyDistributions {
        uint256 debtAmount = productionInfo.readyToBeDistributed * amount / world().distributions().getItemsPerNft();
        if (debtAmount == 0) {
            return;
        }

        _updateProducedResourceDebt(from, producedResourceDebt[from] - debtAmount);
        _updateProducedResourceDebt(to, producedResourceDebt[to] + debtAmount);
    }

    /// @inheritdoc IBuilding
    function distributeToSingleShareholder(address holder) public override {
        updateState();

        IDistributions distributions = world().distributions();
        uint256 nftBalance = distributions.balanceOf(holder, distributionId);
        if (nftBalance == 0) {
            return;
        }

        uint256 producedResourceDebtOfHolder = producedResourceDebt[holder];
        uint256 partOfReadyToBeDistributed = productionInfo.readyToBeDistributed * nftBalance / distributions.getItemsPerNft();
        uint256 partOfProduction = partOfReadyToBeDistributed > producedResourceDebtOfHolder
            ? partOfReadyToBeDistributed - producedResourceDebtOfHolder
            : 0;

        if (partOfProduction == 0) {
            return;
        }

        _updateProducedResourceDebt(holder, producedResourceDebtOfHolder + partOfProduction);

        _updateProductionInfo(
            productionInfo.lastUpdateStateTime,
            productionInfo.lastUpdateStateRegionTime,
            productionInfo.readyToBeDistributed,
            productionInfo.totalDebt + partOfProduction
        );

        bytes32 productionResourceTypeId = getProducingResourceTypeId();
        era().resources(productionResourceTypeId).mint(holder, partOfProduction);
        emit DistributedToShareHolder(productionResourceTypeId, holder, partOfProduction);
    }

    /// @inheritdoc IBuilding
    function distributeToAllShareholders() public override {
        updateState();

        uint256 readyToBeDistributed = productionInfo.readyToBeDistributed;
        bytes32 producingResourceTypeId = getProducingResourceTypeId();
        IResource producingResource = era().resources(producingResourceTypeId);
        IDistributions distributions = world().distributions();
        uint256 itemsPerNft = distributions.getItemsPerNft();

        uint256 newReadyToBeDistributed = readyToBeDistributed;
        address[] memory topHolders = world().distributions().getDistributionReceivers(distributionId);
        for (uint256 i = 0; i < topHolders.length; i++) {
            address holder = topHolders[i];

            uint256 holderDebt = producedResourceDebt[holder];
            uint256 partOfReadyToBeDistributed = (readyToBeDistributed * distributions.balanceOf(holder, distributionId)) / itemsPerNft;
            uint256 partOfProduction = partOfReadyToBeDistributed > holderDebt
                ? partOfReadyToBeDistributed - holderDebt
                : 0;

            if (holderDebt != 0) {
                _updateProducedResourceDebt(holder, 0);
            }

            newReadyToBeDistributed -= (holderDebt + partOfProduction);

            if (partOfProduction == 0) {
                continue;
            }

            producingResource.mint(holder, partOfProduction);
            emit DistributedToShareHolder(producingResourceTypeId, holder, partOfProduction);
        }

        _updateProductionInfo(
            productionInfo.lastUpdateStateTime,
            productionInfo.lastUpdateStateRegionTime,
            newReadyToBeDistributed,
            0
        );
    }

    /// @inheritdoc IBuilding
    function getResourcesAmount(bytes32 resourceTypeId, uint256 timestamp)
        public
        view
        virtual
        override
        returns (uint256)
    {
        ProductionResultItem[] memory result = getProductionResult(timestamp);

        for (uint256 i = 0; i < result.length; i++) {
            if (result[i].resourceTypeId == resourceTypeId) {
                if (result[i].isProduced) {
                    uint256 maxTreasury = getMaxTreasuryByLevel(getBuildingLevel());
                    if (maxTreasury == 0) {
                        return 0;
                    }

                    uint256 amountOfResourcePotentiallyGoingToTreasury = (result[i].balanceDelta * registry().getToTreasuryPercent()) / 1e18;
                    uint256 currentTreasuryResourcesAmount = era().resources(getProducingResourceTypeId()).stateBalanceOf(address(this));

                    // In case if building has more resources than max in treasury -> none of production resources will go to the treasury
                    // therefore building doesnt produced anything to the building
                    if (currentTreasuryResourcesAmount >= maxTreasury) {
                        return currentTreasuryResourcesAmount;
                    }

                    return Math.min(
                        amountOfResourcePotentiallyGoingToTreasury + currentTreasuryResourcesAmount,
                        maxTreasury
                    );
                } else {
                    return era().resources(resourceTypeId).stateBalanceOf(address(this)) - result[i].balanceDelta;
                }
            }
        }

        return 0;
    }

    /// @inheritdoc IBuilding
    function getProductionResult(uint256 timestamp)
        public
        view
        virtual
        override
        returns (ProductionResultItem[] memory)
    {
        if (timestamp == 0) {
            timestamp = block.timestamp;
        }

        uint256 gameBeginTime = world().gameBeginTime();
        if (timestamp < gameBeginTime) {
            timestamp = gameBeginTime;
        }

        uint256 gameEndTime = world().gameEndTime();
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
        uint256 productionLastUpdateStateRegionTime = productionInfo.lastUpdateStateRegionTime;

        if (productionLastUpdateStateTime < gameBeginTime) {
            productionLastUpdateStateTime = gameBeginTime;
            productionLastUpdateStateRegionTime = 0;
        }

        if (timestamp <= productionLastUpdateStateTime) {
            return productionResult;
        }

        uint256 regionTime = relatedSettlement.relatedRegion().getRegionTime(timestamp);

        uint256 producedTicksByBasicProduction = _getProducedTicksByBasicProduction(
            productionLastUpdateStateRegionTime,
            regionTime
        );

        uint256 producedTicksByAdvancedProduction = _getProducedTicksByAdvancedProduction(
            productionLastUpdateStateRegionTime,
            regionTime,
            advancedProduction.toBeProducedTicks
        );

        for (uint256 i = 0; i < productionConfigItems.length; i++) {
            productionResult[i].balanceDelta = productionConfigItems[i].amountPerTick * producedTicksByAdvancedProduction;

            // Produced value increased here because basic production does not stop and building upgrades through time
            if (productionResult[i].isProduced) {
                productionResult[i].balanceDelta += productionConfigItems[i].amountPerTick * producedTicksByBasicProduction;
            }
        }

        return productionResult;
    }

    /// @inheritdoc IBuilding
    function getBuildingCoefficient(uint256 level) public override pure returns (uint256) {
        uint256 increaseByEveryNLevels = 5;
        uint256 b = level / increaseByEveryNLevels;
        uint256 c = level - b * increaseByEveryNLevels;
        uint256 d = (((b + 1) * b) / 2) * increaseByEveryNLevels;
        uint256 e = d + c * (b + 1);
        return e;
    }

    /// @inheritdoc IBuilding
    function resetDistribution() public override virtual onlySettlementOwner {
        if (!_isBuildingTokenRecallAllowed()) revert DistributionResetNotAllowedWhenTreasuryThresholdNotMet();
        distributeToAllShareholders();
        _createDefaultDistribution();
    }

    /// @inheritdoc IBuilding
    function isResourceAcceptable(bytes32 resourceTypeId) public view override returns (bool) {
        ProductionConfigItem[] memory config = getConfig();
        for (uint256 i = 0; i < config.length; i++) {
            if (config[i].resourceTypeId == resourceTypeId) {
                return true;
            }
        }

        return false;
    }

    /// @inheritdoc IBuilding
    function removeResourcesAndWorkers(
        address workersReceiverAddress,
        uint256 workersAmount,
        address resourcesReceiverAddress,
        bytes32[] calldata resourceTypeIds,
        uint256[] calldata resourcesAmounts
    ) public override onlyActiveGame onlyRulerOrWorldAssetFromSameEra {
        if (workersAmount > 0) {
            _transferWorkers(workersReceiverAddress, workersAmount);
        }

        _batchTransferResources(resourceTypeIds, resourcesReceiverAddress, resourcesAmounts);
    }

    /// @inheritdoc IBuilding
    function getUpgradePrice(uint256 level)
        public
        view
        virtual
        override
        returns (uint256)
    {
        uint256 maxTreasuryByLevel = getMaxTreasuryByLevel(level);
        uint256 maxTreasuryByNextLevel = getMaxTreasuryByLevel(level + 1);
        uint256 maxTreasuryByLevelWithCoefficient = (maxTreasuryByLevel * 75) / 100;
        uint256 treasuryDifference = maxTreasuryByNextLevel - maxTreasuryByLevelWithCoefficient;
        return treasuryDifference / 6;
    }

    /// @inheritdoc IBuilding
    function getBuildingLevel() public view override returns (uint256) {
        return basicProduction.level + advancedProduction.level;
    }

    /// @inheritdoc IBuilding
    function getAssignedWorkers() public view virtual override returns (uint256) {
        return era().workers().balanceOf(address(this));
    }

    /// @inheritdoc IBuilding
    function upgradeBasicProduction(address resourcesOwner) public virtual override onlyActiveGame onlyRulerOrWorldAssetFromSameEra {
        updateState();

        if (block.timestamp < upgradeCooldownEndTime) revert BuildingCannotBeUpgradedWhileUpgradeIsOnCooldown();

        uint256 buildingLevel = getBuildingLevel();
        uint256 upgradePrice = getUpgradePrice(buildingLevel);
        bytes32 upgradeResourceTypeId = WOOD_TYPE_ID;

        if (resourcesOwner == address(0)) {
            era().resources(upgradeResourceTypeId).burnFrom(msg.sender, upgradePrice);
        } else {
            IResource upgradeResource = era().resources(upgradeResourceTypeId);
            upgradeResource.spendAllowance(resourcesOwner, msg.sender, upgradePrice);
            upgradeResource.burnFrom(resourcesOwner, upgradePrice);
        }

        relatedSettlement.relatedRegion().decreaseCorruptionIndex(
            address(relatedSettlement),
            registry().getCorruptionIndexByResource(upgradeResourceTypeId) * upgradePrice / 1e18
        );

        upgradeCooldownEndTime = block.timestamp + getBasicUpgradeCooldownDuration(buildingLevel);

        uint256 _newBasicProductionCoefficient = (getBuildingCoefficient(buildingLevel + 1) - getBuildingCoefficient(buildingLevel)) + basicProduction.coefficient;
        uint256 _newBasicProductionLevel = basicProduction.level + 1;

        basicProduction.coefficient = _newBasicProductionCoefficient;
        basicProduction.level = _newBasicProductionLevel;

        _updateProsperity();

        emit BasicProductionUpgraded(_newBasicProductionLevel, _newBasicProductionCoefficient);
    }

    /// @inheritdoc IBuilding
    function upgradeAdvancedProduction(address resourcesOwner) public virtual override onlyActiveGame onlyRulerOrWorldAssetFromSameEra {
        updateState();

        if (block.timestamp < upgradeCooldownEndTime) revert BuildingCannotBeUpgradedWhileUpgradeIsOnCooldown();

        uint256 buildingLevel = getBuildingLevel();
        uint256 upgradePrice = getUpgradePrice(buildingLevel);
        bytes32 upgradeResourceTypeId = ORE_TYPE_ID;

        if (resourcesOwner == address(0)) {
            era().resources(upgradeResourceTypeId).burnFrom(msg.sender, upgradePrice);
        } else {
            IResource upgradeResource = era().resources(upgradeResourceTypeId);
            upgradeResource.spendAllowance(resourcesOwner, msg.sender, upgradePrice);
            upgradeResource.burnFrom(resourcesOwner, upgradePrice);
        }

        relatedSettlement.relatedRegion().decreaseCorruptionIndex(
            address(relatedSettlement),
            registry().getCorruptionIndexByResource(upgradeResourceTypeId) * upgradePrice / 1e18
        );

        upgradeCooldownEndTime = block.timestamp + getAdvancedUpgradeCooldownDuration(buildingLevel);

        uint256 _newAdvancedProductionCoefficient = (getBuildingCoefficient(buildingLevel + 1) - getBuildingCoefficient(buildingLevel)) + advancedProduction.coefficient;
        uint256 _newAdvancedProductionLevel = advancedProduction.level + 1;

        advancedProduction.coefficient = _newAdvancedProductionCoefficient;
        advancedProduction.level = _newAdvancedProductionLevel;

        _updateProsperity();

        emit AdvancedProductionUpgraded(_newAdvancedProductionLevel, _newAdvancedProductionCoefficient);
    }

    /// @inheritdoc IBuilding
    function getBasicUpgradeCooldownDuration(uint256 level) public view virtual override returns (uint256) {
        return level * 6 hours / registry().getGlobalMultiplier();
    }

    /// @inheritdoc IBuilding
    function getAdvancedUpgradeCooldownDuration(uint256 level) public view virtual override returns (uint256) {
        return 0;
    }

    /// @inheritdoc IBuilding
    function getProducingResourceTypeId() public view virtual override returns (bytes32) {
        ProductionConfigItem[] memory productionConfigItems = getConfig();
        for (uint256 i = 0; i < productionConfigItems.length; i++) {
            if (productionConfigItems[i].isProducing) {
                return productionConfigItems[i].resourceTypeId;
            }
        }

        return bytes32(0);
    }

    /// @inheritdoc IBuilding
    function getWorkersCapacity() public view override returns (uint256) {
        return advancedProduction.coefficient * registry().getWorkerCapacityCoefficient(buildingTypeId);
    }

    /// @inheritdoc IBuilding
    function getTreasuryAmount(uint256 timestamp) public view virtual override returns (uint256) {
        return getResourcesAmount(getProducingResourceTypeId(), timestamp);
    }

    /// @inheritdoc IBuilding
    function getMaxTreasuryByLevel(uint256 level) public view virtual override returns (uint256) {
        return (getBuildingCoefficient(level) ** 2) * 10 * 1e18;
    }

    /// @inheritdoc IBuilding
    function stealTreasury(
        address stealerSettlementAddress,
        uint256 amount
    )
        public
        override
        onlyWorldAssetFromSameEra
        returns (uint256, uint256)
    {
        updateState();

        IResource producingResource = era().resources(getProducingResourceTypeId());

        uint256 currentTreasuryAmount = Math.min(
            getMaxTreasuryByLevel(getBuildingLevel()),
            producingResource.stateBalanceOf(address(this))
        );

        if (currentTreasuryAmount == 0) {
            return (0, 0);
        }

        amount = Math.min(currentTreasuryAmount, amount);

        ISettlement stealerSettlement = ISettlement(stealerSettlementAddress);
        IBuilding sameBuildingOfStealerSettlement = stealerSettlement.buildings(buildingTypeId);
        sameBuildingOfStealerSettlement.updateState();

        uint256 stealerBuildingMaxTreasuryAmount = sameBuildingOfStealerSettlement.getMaxTreasuryByLevel(sameBuildingOfStealerSettlement.getBuildingLevel());
        uint256 stealerBuildingCurrentTreasuryAmount = Math.min(
            stealerBuildingMaxTreasuryAmount,
            producingResource.stateBalanceOf(address(sameBuildingOfStealerSettlement))
        );
        uint256 amountOfResourcesCanFitIntoStealerBuilding = stealerBuildingMaxTreasuryAmount - stealerBuildingCurrentTreasuryAmount;
        uint256 amountOfResourcesThatWillBeStolen = Math.min(amountOfResourcesCanFitIntoStealerBuilding, amount);
        uint256 amountOfResourcesThatWillBeBurned = amount - amountOfResourcesThatWillBeStolen;

        if (amountOfResourcesThatWillBeStolen != 0) {
            producingResource.transfer(address(sameBuildingOfStealerSettlement), amountOfResourcesThatWillBeStolen);
        }

        if (amountOfResourcesThatWillBeBurned != 0) {
            burnTreasury(amountOfResourcesThatWillBeBurned);
        }

        return (amountOfResourcesThatWillBeStolen, amountOfResourcesThatWillBeBurned);
    }

    /// @inheritdoc IBuilding
    function burnTreasury(uint256 burnAmount) public override onlyWorldAssetFromSameEra {
        IResource resource = era().resources(getProducingResourceTypeId());
        resource.burn(burnAmount);
        _updateProsperity();
    }

    /// @inheritdoc IBuilding
    function increaseAdditionalWorkersCapacityMultiplier(uint256 capacityAmount) public override onlyWorldAssetFromSameEra {
        updateState();

        uint256 _newAdditionalWorkersCapacityMultiplier = advancedProduction.additionalWorkersCapacityMultiplier + capacityAmount;
        advancedProduction.additionalWorkersCapacityMultiplier = _newAdditionalWorkersCapacityMultiplier;
        emit AdvancedProductionAdditionalWorkersCapacityMultiplierUpdated(_newAdditionalWorkersCapacityMultiplier);

        // Kick out extra workers from building into settlement
        uint256 availableForAdvancedProductionWorkersCapacity = getAvailableForAdvancedProductionWorkersCapacity();
        uint256 assignedWorkers = getAssignedWorkers();
        if (assignedWorkers > availableForAdvancedProductionWorkersCapacity) {
            uint256 workersToKickOut = assignedWorkers - availableForAdvancedProductionWorkersCapacity;
            _transferWorkers(address(relatedSettlement), workersToKickOut);
        }
        //
    }

    /// @inheritdoc IBuilding
    function decreaseAdditionalWorkersCapacityMultiplier(uint256 capacityAmount) public override onlyWorldAssetFromSameEra {
        updateState();

        uint256 _newAdditionalWorkersCapacityMultiplier = advancedProduction.additionalWorkersCapacityMultiplier - capacityAmount;
        advancedProduction.additionalWorkersCapacityMultiplier = _newAdditionalWorkersCapacityMultiplier;
        emit AdvancedProductionAdditionalWorkersCapacityMultiplierUpdated(_newAdditionalWorkersCapacityMultiplier);
    }

    /// @inheritdoc IBuilding
    function getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier() public view override returns (uint256) {
        uint256 currentWorkersCapacityMultiplier = Math.min(
            advancedProduction.additionalWorkersCapacityMultiplier,
            registry().getMaxAdvancedProductionTileBuff()
        );

        uint256 workersCapacity = getWorkersCapacity();
        return MathExtension.roundDownWithPrecision(
            workersCapacity * currentWorkersCapacityMultiplier / 1e18,
            1e18
        );
    }

    /// @inheritdoc IBuilding
    function getAvailableForAdvancedProductionWorkersCapacity() public view override returns (uint256) {
        return getWorkersCapacity() - getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier();
    }

    /// @inheritdoc IBuilding
    function getConfig() public view virtual override returns (ProductionConfigItem[] memory productionConfigItems);

    /// @dev Allows caller to be only distributions contract
    function _onlyDistributions() internal view {
        if (address(world().distributions()) != msg.sender) revert OnlyDistributions();
    }

    /// @dev Allows caller to be only settlement owner
    function _onlySettlementOwner() internal view {
        if (relatedSettlement.getSettlementOwner() != msg.sender) revert OnlySettlementOwner();
    }

    /// @dev Allows caller to be ruler or world or world asset
    function _onlyRulerOrWorldAssetFromSameEra() internal view {
        if (!relatedSettlement.isRuler(msg.sender) &&
            msg.sender != address(world()) &&
            world().worldAssets(eraNumber(), msg.sender) == bytes32(0)) revert OnlyRulerOrWorldAssetFromSameEra();
    }

    /// @dev Calculates how many ticks produced by advanced production by provided begin time, end time and to be produced ticks
    function _getProducedTicksByAdvancedProduction(
        uint256 advancedProductionBeginTime,
        uint256 advancedProductionEndTime,
        uint256 toBeProducedTicks
    ) internal view returns (uint256) {
        if (advancedProductionEndTime <= advancedProductionBeginTime) {
            return 0;
        }

        uint256 advancedProductionDuration = advancedProductionEndTime - advancedProductionBeginTime;

        uint256 productionMultiplier = _getAdvancedProductionMultiplier();
        uint256 ticksPassed = advancedProductionDuration / (1e18 / registry().getProductionTicksInSecond());

        return Math.min(
            ticksPassed * productionMultiplier / 1e18,
            toBeProducedTicks
        );
    }

    /// @dev Calculates how many ticks produced by basic production by provided begin time, end time
    function _getProducedTicksByBasicProduction(
        uint256 basicProductionBeginTime,
        uint256 basicProductionEndTime
    ) internal view returns (uint256) {
        uint256 basicProductionDuration = basicProductionEndTime - basicProductionBeginTime;
        uint256 ticksPassed = basicProductionDuration / (1e18 / registry().getProductionTicksInSecond());

        return _getBasicProductionMultiplier() * ticksPassed / 1e18;
    }

    /// @dev Creates default distribution (all possible tokens will be minted to current settlement owner)
    function _createDefaultDistribution() internal {
        distributionId = world().distributions().mint(relatedSettlement.getSettlementOwner());
        emit DistributionCreated(distributionId);
    }

    /// @dev Saves produced amount of resource between treasury and productionInfo.readyToBeDistributed
    function _saveProducedResource(bytes32 resourceTypeId, uint256 amount) internal {
        if (amount == 0) {
            return;
        }

        //N% of resources moves to treasury pool
        uint256 amountOfResourceGoingToTreasury = (amount * registry().getToTreasuryPercent()) / 1e18;

        uint256 currentTreasury = era().resources(resourceTypeId).stateBalanceOf(address(this));
        uint256 maxTreasury = getMaxTreasuryByLevel(getBuildingLevel());

        if (currentTreasury >= maxTreasury) {
            amountOfResourceGoingToTreasury = 0;
        } else if (amountOfResourceGoingToTreasury > maxTreasury - currentTreasury) {
            amountOfResourceGoingToTreasury = maxTreasury - currentTreasury;
        }

        if (amountOfResourceGoingToTreasury > 0) {
            era().resources(resourceTypeId).mint(address(this), amountOfResourceGoingToTreasury);
            amount = amount - amountOfResourceGoingToTreasury;
        }

        if (amount > 0) {
            relatedSettlement.relatedRegion().increaseCorruptionIndex(
                address(relatedSettlement),
                registry().getCorruptionIndexByResource(resourceTypeId) * amount / 1e18
            );

            _updateProductionInfo(
                productionInfo.lastUpdateStateTime,
                productionInfo.lastUpdateStateRegionTime,
                productionInfo.readyToBeDistributed + amount,
                productionInfo.totalDebt
            );
        }
    }

    /// @dev Updates building prosperity according to changed amount of resources in building
    function _updateProsperity() internal virtual {
        uint256 buildingLevel = getBuildingLevel();
        uint256 levelCoefficient = getBuildingCoefficient(buildingLevel);

        uint256 currentProductionResourceBalance = era().resources(getProducingResourceTypeId()).stateBalanceOf(
            address(this)
        );

        uint256 prosperityBefore = givenProsperityAmount;

        uint256 resourceWeight = registry().getResourceWeight(getProducingResourceTypeId());
        uint256 potentialNewProsperity = (currentProductionResourceBalance * resourceWeight / levelCoefficient) / 1e18;
        uint256 maxProsperity = (getMaxTreasuryByLevel(buildingLevel) * resourceWeight / levelCoefficient) / 1e18;

        uint256 prosperityAfter = Math.min(maxProsperity, potentialNewProsperity);
        givenProsperityAmount = prosperityAfter;

        if (prosperityBefore > prosperityAfter) {
            era().prosperity().burnFrom(address(relatedSettlement), prosperityBefore - prosperityAfter);
        } else if (prosperityBefore < prosperityAfter) {
            era().prosperity().mint(address(relatedSettlement), prosperityAfter - prosperityBefore);
        }
    }

    /// @dev Calculates current game time, taking into an account game end time
    function _getCurrentTime() internal view returns (uint256) {
        uint256 gameBeginTime = world().gameBeginTime();
        uint256 gameEndTime = world().gameEndTime();
        uint256 timestamp = block.timestamp;

        if (timestamp < gameBeginTime) {
            timestamp = gameBeginTime;
        }

        if (gameEndTime == 0) {
            return timestamp;
        }

        return Math.min(timestamp, gameEndTime);
    }

    /// @dev Calculates basic production multiplier
    function _getBasicProductionMultiplier() internal view returns (uint256) {
        bytes32 _buildingTypeId = buildingTypeId;

        return (
            basicProduction.coefficient
            * registry().getBasicProductionBuildingCoefficient(_buildingTypeId)
            * registry().getWorkerCapacityCoefficient(_buildingTypeId)
            * registry().getGlobalMultiplier()
        ) / 1e18;
    }

    /// @dev Calculates advanced production multiplier
    function _getAdvancedProductionMultiplier() internal view returns (uint256) {
        uint256 multiplierFromWorkers = getAssignedWorkers() + getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier();
        return multiplierFromWorkers * registry().getGlobalMultiplier();
    }

    /// @dev Calculates amount of production ticks for current building according to its resources balances
    function _calculateProductionTicksAmount() internal view returns (uint256) {
        ProductionConfigItem[] memory config = getConfig();
        uint256 productionTicksAmountUntilStop = type(uint256).max;

        for (uint256 i = 0; i < config.length; i++) {
            if (config[i].isProducing) {
                continue;
            }

            uint256 balance = era().resources(config[i].resourceTypeId).stateBalanceOf(address(this));
            if (balance == 0) {
                return 0;
            }

            productionTicksAmountUntilStop = Math.min(
                balance / config[i].amountPerTick,
                productionTicksAmountUntilStop
            );
        }

        return productionTicksAmountUntilStop;
    }

    /// @dev Calculates is building token recall allowed according to building token transfer threshold
    function _isBuildingTokenRecallAllowed() internal returns (bool) {
        uint256 maxTreasury = getMaxTreasuryByLevel(getBuildingLevel());
        bytes32 producingResourceTypeId = getProducingResourceTypeId();
        if (producingResourceTypeId == bytes32(0)) {
            return false;
        }

        uint256 currentTreasuryThreshold = (maxTreasury * registry().getBuildingTokenTransferThresholdPercent()) / 1e18;
        uint256 currentTreasury = era().resources(producingResourceTypeId).balanceOf(address(this));

        return currentTreasury <= currentTreasuryThreshold;
    }

    /// @dev Batch transfer resources from building to specified address
    function _batchTransferResources(
        bytes32[] calldata resourceTypeIds,
        address to,
        uint256[] calldata amounts
    ) internal {
        for (uint256 i = 0; i < resourceTypeIds.length; i++) {
            _transferResources(resourceTypeIds[i], to, amounts[i]);
        }
    }

    /// @dev Transfers workers from building to specified address
    function _transferWorkers(address to, uint256 amount) internal {
        era().workers().transfer(to, amount);
    }

    /// @dev Transfers resources from building to specified address
    function _transferResources(
        bytes32 resourceTypeId,
        address to,
        uint256 amount
    ) internal {
        updateState();

        if (resourceTypeId == getProducingResourceTypeId()) {
            revert CannotTransferProducingResourceFromBuilding();
        }

        IResource resource = era().resources(resourceTypeId);
        uint256 balance = resource.balanceOf(address(this));
        if (balance == 0) {
            return;
        }

        if (amount > balance) {
            amount = balance;
        }

        if (amount > 0) {
            resource.transfer(to, amount);
        }
    }

    /// @dev Updates production info
    function _updateProductionInfo(
        uint256 newLastUpdateStateTime,
        uint256 newLastUpdateStateRegionTime,
        uint256 newReadyToBeDistributed,
        uint256 newTotalDebt
    ) internal {
        productionInfo.lastUpdateStateTime = newLastUpdateStateTime;
        productionInfo.lastUpdateStateRegionTime = newLastUpdateStateRegionTime;
        productionInfo.readyToBeDistributed = newReadyToBeDistributed;
        productionInfo.totalDebt = newTotalDebt;

        emit ProductionInfoUpdated(
            productionInfo.lastUpdateStateTime,
            productionInfo.lastUpdateStateRegionTime,
            productionInfo.readyToBeDistributed,
            productionInfo.totalDebt
        );
    }

    /// @dev Updates produced resource debt for specified nft holder
    function _updateProducedResourceDebt(
        address distributionNftHolder,
        uint256 newDebt
    ) internal {
        producedResourceDebt[distributionNftHolder] = newDebt;

        emit ProducedResourceDebtUpdated(
            distributionNftHolder,
            newDebt
        );
    }
}

