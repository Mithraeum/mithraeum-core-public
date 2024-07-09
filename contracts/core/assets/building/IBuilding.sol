// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../../IWorld.sol";
import "../settlement/ISettlement.sol";

/// @title Building interface
/// @notice Functions to read state/modify state in order to get current building parameters and/or interact with it
interface IBuilding {
    struct BasicProduction {
        uint256 level;
        uint256 coefficient;
    }

    struct AdvancedProduction {
        uint256 level;
        uint256 coefficient;
        uint256 additionalWorkersCapacityMultiplier;
        uint256 toBeProducedTicks;
    }

    struct ProductionInfo {
        uint256 lastUpdateStateTime;
        uint256 lastUpdateStateRegionTime;
        uint256 readyToBeDistributed;
        uint256 totalDebt;
    }

    struct ProductionResultItem {
        bytes32 resourceTypeId;
        uint256 balanceDelta;
        bool isProduced;
    }

    struct ProductionConfigItem {
        bytes32 resourceTypeId;
        uint256 amountPerTick;
        bool isProducing;
    }

    // State variables

    /// @notice Building type id
    /// @dev Immutable, initialized on the building creation
    function buildingTypeId() external view returns (bytes32 buildingTypeId);

    /// @notice Settlement address to which this building belongs
    /// @dev Immutable, initialized on the building creation
    function relatedSettlement() external view returns (ISettlement);

    /// @notice Basic production
    /// @dev Contains basic production upgrade data
    /// @return level Basic production level
    /// @return coefficient Basic production coefficient
    function basicProduction() external view returns (
        uint256 level,
        uint256 coefficient
    );

    /// @notice Advanced production
    /// @dev Contains advanced production upgrade data
    /// @return level Advanced production level
    /// @return coefficient Advanced production coefficient
    /// @return additionalWorkersCapacityMultiplier Additional workers capacity multiplier
    /// @return toBeProducedTicks To be produced ticks of producing resource
    function advancedProduction() external view returns (
        uint256 level,
        uint256 coefficient,
        uint256 additionalWorkersCapacityMultiplier,
        uint256 toBeProducedTicks
    );

    /// @notice Upgrade cooldown end time
    /// @dev Updated when #upgradeBasicProduction or #upgradeAdvancedProduction is called
    /// @return upgradeCooldownEndTime Upgrade cooldown end time
    function upgradeCooldownEndTime() external view returns (uint256 upgradeCooldownEndTime);

    /// @notice Amount of prosperity given
    /// @dev Contains last written given prosperity amount by building treasury
    /// @return givenProsperityAmount Given prosperity amount
    function givenProsperityAmount() external view returns (uint256 givenProsperityAmount);

    /// @notice Contains production info of the building
    /// @dev Contains information related to how production is calculated
    /// @return lastUpdateStateTime Time at which last #updateState is called
    /// @return lastUpdateStateRegionTime Region time at which last #updateState is called
    /// @return readyToBeDistributed Amount of produced resource ready to be distributed
    /// @return totalDebt Total debt
    function productionInfo()
        external
        view
        returns (
            uint256 lastUpdateStateTime,
            uint256 lastUpdateStateRegionTime,
            uint256 readyToBeDistributed,
            uint256 totalDebt
        );

    /// @notice Distribution id
    /// @dev Initialized on creation and updated on #resetDistribution
    function distributionId() external view returns (uint256);

    /// @notice Produced resource debt
    /// @dev Updated when #distributeToSingleHolder or #distributeToAllShareholders is called
    function producedResourceDebt(address holder) external view returns (uint256);

    // Events

    /// @notice Emitted when #doBasicProductionUpgrade is called
    /// @param newBasicProductionLevel New basic production level
    event BasicProductionUpgraded(uint256 newBasicProductionLevel, uint256 newBasicProductionCoefficient);

    /// @notice Emitted when #doAdvancedProductionUpgrade is called
    /// @param newAdvancedProductionLevel New advanced production level
    event AdvancedProductionUpgraded(uint256 newAdvancedProductionLevel, uint256 newAdvancedProductionCoefficient);

    /// @notice Emitted when #increaseAdditionalWorkersCapacityMultiplier or #decreaseAdditionalWorkersCapacityMultiplier
    /// @param newAdditionalWorkersCapacityMultiplier New additional workers capacity multiplier
    event AdvancedProductionAdditionalWorkersCapacityMultiplierUpdated(uint256 newAdditionalWorkersCapacityMultiplier);

    /// @notice Emitted when #distribute is called (when resources from production are distributed to building token holders)
    /// @param resourceTypeId Resource type id
    /// @param holder Receiver address
    /// @param amount Amount of distributed resources
    event DistributedToShareHolder(bytes32 resourceTypeId, address holder, uint256 amount);

    /// @notice Emitted when #_setDefaultDistribution is called
    /// @param newDistributionId New distribution id
    event DistributionCreated(uint256 newDistributionId);

    /// @notice Emitted when productionInfo is updated
    /// @param lastUpdateStateTime Last update state time
    /// @param lastUpdateStateRegionTime Last update state region time
    /// @param readyToBeDistributed Ready to be distributed
    /// @param totalDebt Total debt
    event ProductionInfoUpdated(
        uint256 lastUpdateStateTime,
        uint256 lastUpdateStateRegionTime,
        uint256 readyToBeDistributed,
        uint256 totalDebt
    );

    /// @notice Emitted when producedResourceDebt updated for distributionNftHolder
    /// @param distributionNftHolder Distribution nft holder
    /// @param newDebt New debt
    event ProducedResourceDebtUpdated(
        address distributionNftHolder,
        uint256 newDebt
    );

    // Errors

    /// @notice Thrown when attempting to call action which can be called only by Distributions
    error OnlyDistributions();

    /// @notice Thrown when attempting to call action which can be called only by settlement owner
    error OnlySettlementOwner();

    /// @notice Thrown when attempting to call action which can be called only by ruler or world asset
    error OnlyRulerOrWorldAssetFromSameEra();

    /// @notice Thrown when attempting to reset distribution of building tokens when its not allowed
    error DistributionResetNotAllowedWhenTreasuryThresholdNotMet();

    /// @notice Thrown when attempting to upgrade building when upgrades are on cooldown
    error BuildingCannotBeUpgradedWhileUpgradeIsOnCooldown();

    /// @notice Thrown when attempting to transfer producing resource from building
    error CannotTransferProducingResourceFromBuilding();

    // Functions

    /// @notice Resets current building distribution
    /// @dev Creates new distribution Nft and mints it to current settlement owner
    function resetDistribution() external;

    /// @notice Callback which recalculates production. Called when resources related to production of this building is transferred from/to this building
    /// @dev Even though function is opened, it is auto-called by transfer method. Standalone calls provide 0 impact.
    function handleProductionResourcesChanged() external;

    /// @notice Updates state of this building up to block.timestamp
    /// @dev Updates building production minting treasury and increasing #production.readyToBeDistributed
    function updateState() external;

    /// @notice Updates debts for shareholders whenever their share part changes
    /// @dev Even though function is opened, it can be called only by distributions
    /// @param from From address
    /// @param to To address
    /// @param amount Amount
    function updateDebtsAccordingToNewDistributionsAmounts(
        address from,
        address to,
        uint256 amount
    ) external;

    /// @notice Distributes produced resource to single shareholder
    /// @dev Useful to taking part of the resource from the building for single shareholder (to not pay gas for minting for all shareholders)
    /// @param holder Holder
    function distributeToSingleShareholder(address holder) external;

    /// @notice Distributes produces resource to all shareholders
    /// @dev Useful to get full produced resources to all shareholders
    function distributeToAllShareholders() external;

    /// @notice Calculates building coefficient by provided level
    /// @dev Used to determine max treasury amount and new production coefficients
    /// @param level Building level
    /// @return buildingCoefficient Building coefficient
    function getBuildingCoefficient(uint256 level) external pure returns (uint256 buildingCoefficient);

    /// @notice Calculates amount of workers currently sitting in this building
    /// @dev Same as workers.balanceOf(buildingAddress)
    /// @return assignedWorkersAmount Amount of assigned workers
    function getAssignedWorkers() external view returns (uint256 assignedWorkersAmount);

    /// @notice Calculates real amount of provided resource in building related to its production at provided time
    /// @dev Useful for determination how much of production resource (either producing and spending) at the specific time
    /// @param resourceTypeId Type id of resource related to production
    /// @param timestamp Time at which calculate amount of resources in building. If timestamp=0 -> calculates as block.timestamp
    /// @return resourcesAmount Real amount of provided resource in building related to its production at provided time
    function getResourcesAmount(bytes32 resourceTypeId, uint256 timestamp) external view returns (uint256 resourcesAmount);

    /// @notice Calculates production resources changes at provided time
    /// @dev Useful for determination how much of all production will be burned/produced at the specific time
    /// @param timestamp Time at which calculate amount of resources in building. If timestamp=0 -> calculates as block.timestamp
    /// @return productionResult Production resources changes at provided time
    function getProductionResult(uint256 timestamp) external view returns (ProductionResultItem[] memory productionResult);

    /// @notice Calculates upgrade price by provided level
    /// @dev Useful for determination how much upgrade will cost at any level
    /// @param level Level at which calculate price
    /// @return price Amount of resources needed for upgrade
    function getUpgradePrice(uint256 level) external view returns (uint256 price);

    /// @notice Calculates basic upgrade duration for provided level
    /// @dev If level=1 then returned value will be duration which is taken for upgrading from 1 to 2 level
    /// @param level At which level calculate upgrade duration
    /// @return upgradeCooldownDuration Upgrade cooldown duration
    function getBasicUpgradeCooldownDuration(uint256 level) external view returns (uint256 upgradeCooldownDuration);

    /// @notice Calculates advanced upgrade duration for provided level
    /// @dev If level=1 then returned value will be duration which is taken for upgrading from 1 to 2 level
    /// @param level At which level calculate upgrade duration
    /// @return upgradeCooldownDuration Upgrade cooldown duration
    function getAdvancedUpgradeCooldownDuration(uint256 level) external view returns (uint256 upgradeCooldownDuration);

    /// @notice Upgrades basic production
    /// @dev Necessary resources for upgrade will be taken either from msg.sender or resourcesOwner (if resource.allowance allows it)
    /// @dev If resourcesOwner == address(0) -> resources will be taken from msg.sender
    /// @dev If resourcesOwner != address(0) and resourcesOwner has given allowance to msg.sender >= upgradePrice -> resources will be taken from resourcesOwner
    /// @param resourcesOwner Resources owner
    function upgradeBasicProduction(address resourcesOwner) external;

    /// @notice Upgrades advanced production
    /// @dev Necessary resources for upgrade will be taken either from msg.sender or resourcesOwner (if resource.allowance allows it)
    /// @dev If resourcesOwner == address(0) -> resources will be taken from msg.sender
    /// @dev If resourcesOwner != address(0) and resourcesOwner has given allowance to msg.sender >= upgradePrice -> resources will be taken from resourcesOwner
    /// @param resourcesOwner Resources owner
    function upgradeAdvancedProduction(address resourcesOwner) external;

    /// @notice Calculates current level
    /// @dev Takes into an account if upgrades are ended or not
    /// @return level Current building level
    function getBuildingLevel() external view returns (uint256 level);

    /// @notice Returns production config for current building
    /// @dev Main config that determines which resources is produced/spend by production of this building
    /// @dev ProductionConfigItem.amountPerTick is value how much of resource is spend/produced by 1 worker in 1 tick of production
    /// @return productionConfigItems Production config for current building
    function getConfig() external view returns (ProductionConfigItem[] memory productionConfigItems);

    /// @notice Transfers game resources and workers from building to provided addresses
    /// @dev Removes resources+workers from building in single transaction
    /// @param workersReceiverAddress Workers receiver address (building or settlement)
    /// @param workersAmount Workers amount (in 1e18 precision)
    /// @param resourcesReceiverAddress Resources receiver address
    /// @param resourceTypeIds Resource type ids
    /// @param resourcesAmounts Resources amounts
    function removeResourcesAndWorkers(
        address workersReceiverAddress,
        uint256 workersAmount,
        address resourcesReceiverAddress,
        bytes32[] calldata resourceTypeIds,
        uint256[] calldata resourcesAmounts
    ) external;

    /// @notice Calculates maximum amount of treasury by provided level
    /// @dev Can be used to determine maximum amount of treasury by any level
    /// @param level Building level
    /// @param maxTreasury Maximum amount of treasury
    function getMaxTreasuryByLevel(uint256 level) external view returns (uint256 maxTreasury);

    /// @notice Steals resources from treasury
    /// @dev Called by siege, resources will be stolen into stealer settlement building treasury
    /// @param stealerSettlementAddress Settlement address which will get resources
    /// @param amount Amount of resources to steal and burn
    /// @return stolenAmount Amount of stolen resources
    /// @return burnedAmount Amount of burned resources
    function stealTreasury(
        address stealerSettlementAddress,
        uint256 amount
    ) external returns (uint256 stolenAmount, uint256 burnedAmount);

    /// @notice Burns building treasury
    /// @dev Can be called by world asset
    /// @param amount Amount of resources to burn from treasury
    function burnTreasury(
        uint256 amount
    ) external;

    /// @notice Increases additional workers capacity multiplier
    /// @dev Even though function is opened, it can be called only by world asset
    /// @param capacityAmount Capacity amount
    function increaseAdditionalWorkersCapacityMultiplier(uint256 capacityAmount) external;

    /// @notice Decreases additional workers capacity multiplier
    /// @dev Even though function is opened, it can be called only by world asset
    /// @param capacityAmount Capacity amount
    function decreaseAdditionalWorkersCapacityMultiplier(uint256 capacityAmount) external;

    /// @notice Calculates workers capacity (maximum amount of workers)
    /// @dev Used in determination of determinate maximum amount of workers
    /// @return workersCapacity Workers capacity
    function getWorkersCapacity() external view returns (uint256 workersCapacity);

    /// @notice Calculates producing resource type id for this building
    /// @dev Return value is value from #getConfig where 'isProducing'=true
    /// @return resourceTypeId Type id of producing resource
    function getProducingResourceTypeId() external view returns (bytes32 resourceTypeId);

    /// @notice Calculates treasury amount at specified time
    /// @dev Useful for determination how much treasury will be at specific time
    /// @param timestamp Time at which calculate amount of treasury in building. If timestamp=0 -> calculates as block.timestamp
    /// @return treasuryAmount Treasury amount at specified time
    function getTreasuryAmount(uint256 timestamp) external view returns (uint256 treasuryAmount);

    /// @notice Calculates if building is capable to accept resource
    /// @dev Return value based on #getConfig
    /// @param resourceTypeId Resource type id
    /// @return isResourceAcceptable Is building can accept resource
    function isResourceAcceptable(bytes32 resourceTypeId) external view returns (bool isResourceAcceptable);

    /// @notice Calculates capacity of available workers for advanced production
    /// @dev Difference between #getWorkersCapacity and #getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier
    function getAvailableForAdvancedProductionWorkersCapacity() external view returns (uint256);

    /// @notice Calculates additional workers 'granted' from capacity multiplier
    /// @dev Return value based on current advancedProduction.additionalWorkersCapacityMultiplier
    function getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier() external view returns (uint256);
}
