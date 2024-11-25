// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../building/IBuilding.sol";
import "../army/IArmy.sol";
import "../siege/ISiege.sol";
import "../region/IRegion.sol";

/// @title Settlement interface
/// @notice Functions to read state/modify state in order to get current settlement parameters and/or interact with it
interface ISettlement {
    struct ResourcesModificationParam {
        bool isTransferringResourcesFromBuilding;
        address resourcesOwnerOrResourcesReceiver;
        bytes32 resourceTypeId;
        uint256 resourcesAmount;
    }

    struct BuildingProductionModificationParam {
        bytes32 buildingTypeId;
        bool isTransferringWorkersFromBuilding;
        uint256 workersAmount;
        ResourcesModificationParam[] resources;
    }

    // State variables

    /// @notice Region to which this settlement belongs
    /// @dev Immutable, initialized on the settlement creation
    function relatedRegion() external view returns (IRegion);

    /// @notice Banner token id to which current settlement belongs
    /// @dev Immutable, initialized on the settlement creation
    function bannerId() external view returns (uint256);

    /// @notice Siege of the settlement
    /// @dev If any army is besieging settlement not address(0), otherwise address(0)
    function siege() external view returns (ISiege);

    /// @notice Mapping containing settlements buildings
    /// @dev Types of buildings supported can be queried from registry
    function buildings(bytes32 buildingTypeId) external view returns (IBuilding);

    /// @notice Current governors generation
    /// @dev Modified when #removeGovernors is called
    function currentGovernorsGeneration() external view returns (uint256);

    /// @notice Current settlements governors
    /// @dev Modified when #addGovernor or #removeGovernor is called
    function governors(uint256 era, address isGovernor) external view returns (bool);

    /// @notice Settlements army
    /// Immutable, initialized on the settlement creation
    function army() external view returns (IArmy);

    /// @notice Amount of extended prosperity (currently gained units liquidation)
    /// @dev Used for determination amount of real prosperity this settlement has
    function extendedProsperityAmount() external view returns (uint256);

    /// @notice Position on which settlement is created
    /// @dev Immutable, initialized on the settlement creation
    function position() external view returns (uint64);

    /// @notice Amount of corruptionIndex produced by this settlement
    /// @dev Modified when #increaseProducedCorruptionIndex or #decreaseProducedCorruptionIndex is called
    function producedCorruptionIndex() external view returns (int256);

    // Events

    /// @notice Emitted when new building is placed, all building are placed on settlement creation
    /// @param buildingAddress New building address
    /// @param buildingTypeId Building type id
    event BuildingCreated(address buildingAddress, bytes32 buildingTypeId);

    /// @notice Emitted when settlements army is created, is it created on settlement creation
    /// @param armyAddress Army address
    /// @param position Position
    event ArmyCreated(address armyAddress, uint64 position);

    /// @notice Emitted when siege is created on settlement
    /// @param siegeAddress Siege address
    event SiegeCreated(address siegeAddress);

    /// @notice Emitted when #addGovernor or #removeGovernor is called
    /// @param currentGovernorsGeneration Current governors generation
    /// @param governorAddress Address of the governor event is applicable
    /// @param modifiedByAddress Address which modified governor status
    /// @param newStatus Is governor became active/inactive
    event GovernorStatusChanged(uint256 currentGovernorsGeneration, address governorAddress, address modifiedByAddress, bool newStatus);

    /// @notice Emitted when #removeGovernors is called
    /// @param newGovernorsGeneration New governors generation
    event GovernorsGenerationChanged(uint256 newGovernorsGeneration);

    /// @notice Emitted when #destroyRottenSettlement is called
    event Destroyed();

    // Errors

    /// @notice Thrown when attempting to call action which can be called only by settlement owner
    error OnlySettlementOwner();

    /// @notice Thrown when attempting to call action which can be called only by ruler or world asset
    error OnlyRulerOrWorldAsset();

    /// @notice Thrown when attempting to add governor by address which is neither settlement owner or another governor
    error GovernorCannotBeAddedIfSenderNotSettlementOwnerOrAnotherGovernor();

    /// @notice Thrown when attempting to destroy settlement but its not rotten
    error SettlementCannotBeDestroyedIfItsNotRotten();

    /// @notice Thrown when attempting to destroy settlement when it is already rebuilt
    error SettlementCannotBeDestroyedIfItsAlreadyRebuilt();

    /// @notice Thrown when attempting to transfer workers from settlement with non integer value
    error SettlementCannotSendWorkersWithFractions();

    /// @notice Thrown when attempting to transfer workers from settlement to building over maximum allowed workers capacity
    error SettlementCannotSendWorkersToBuildingOverMaximumAllowedCapacity();

    /// @notice Thrown when attempting to decrease corruptionIndex via payment in inactive era
    error SettlementCannotDecreaseCorruptionIndexViaPaymentInInactiveEra();

    /// @notice Thrown when attempting to specify 'tokensAmount' parameter anything but zero whenever world.erc20ForSettlementPurchase is zero address
    error SettlementCannotDecreaseCorruptionIndexViaPaymentWrongParamProvided();

    /// @notice Thrown when attempting to transfer producing resource from building
    error CannotTransferProducingResourceFromBuilding();

    // Functions

    /// @notice Withdraws resources from settlement to specified address
    /// @dev In case if someone accidentally transfers game resource to the settlement
    /// @param resourceTypeId Resource type id
    /// @param to Address that will receive resources
    /// @param amount Amount to transfer
    function withdrawResources(
        bytes32 resourceTypeId,
        address to,
        uint256 amount
    ) external;

    /// @notice Transfers game resources and workers from/to building depending on specified params
    /// @dev Assigns resources and workers to building in single transaction
    /// @dev In case of transferring resources to building if resource.resourcesOwnerOrResourcesReceiver == address(0) -> resources will be taken from msg.sender
    /// @dev In case of transferring resources to building if resource.resourcesOwnerOrResourcesReceiver != address(0) and resourcesOwner has given allowance to msg.sender >= resourcesAmount -> resources will be taken from resource.resourcesOwnerOrResourcesReceiver
    /// @param params An array of BuildingProductionModificationParam struct
    function modifyBuildingsProduction(
        BuildingProductionModificationParam[] memory params
    ) external;

    /// @notice Updates settlement health to current block
    /// @dev Can be called by everyone
    function updateFortHealth() external;

    /// @notice Applies production of every building which produces prosperity
    /// @dev Can be used by everyone
    function updateProsperityAmount() external;

    /// @notice Calculates current settlement owner
    /// @dev Settlements owner is considered an address, which holds bannerId Nft
    /// @return settlementOwner Settlement owner
    function getSettlementOwner() external view returns (address settlementOwner);

    /// @notice Adds settlement governor
    /// @dev Settlement owner and other governor can add governor
    /// @param governorAddress Address to add as the governor
    function addGovernor(address governorAddress) external;

    /// @notice Removes settlement governor
    /// @dev Only settlement owner can remove governor
    /// @param governorAddress Address to remove from governors
    function removeGovernor(address governorAddress) external;

    /// @notice Removes all settlement governors
    /// @dev Only settlement owner can remove all governors
    function removeGovernors() external;

    /// @notice Swaps current settlement prosperity for exact workers
    /// @dev Only ruler or world asset can perform swap
    /// @param workersToBuy Exact amount of workers to buy
    /// @param maxProsperityToSell Maximum amount of prosperity to spend for exact workers
    function swapProsperityForExactWorkers(uint256 workersToBuy, uint256 maxProsperityToSell) external;

    /// @notice Calculates whether provided address is settlement ruler or not
    /// @dev Settlements ruler is an address which owns settlement or an address(es) by which settlement is/are governed
    /// @param potentialRuler Address to check
    /// @return isRuler Banner, whether specified address is ruler or not
    function isRuler(address potentialRuler) external view returns (bool isRuler);

    /// @notice Extends current settlement prosperity by specified amount
    /// @dev Even though function is opened it can be called only by world or world asset
    /// @param prosperityAmount Amount of prosperity to which extend current prosperity
    function extendProsperity(uint256 prosperityAmount) external;

    /// @notice Begins tile capture
    /// @param position Position
    /// @param prosperityStake Prosperity stake
    function beginTileCapture(uint64 position, uint256 prosperityStake) external;

    /// @notice Cancels tile capture
    /// @param position Position
    function cancelTileCapture(uint64 position) external;

    /// @notice Gives up captured tile
    /// @param position Position
    function giveUpCapturedTile(uint64 position) external;

    /// @notice Claims captured tile
    /// @param position Position
    function claimCapturedTile(uint64 position) external;

    /// @notice Increases produced corruptionIndex
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param amount Amount
    function increaseProducedCorruptionIndex(uint256 amount) external;

    /// @notice Decreases produced corruptionIndex
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param amount Amount
    function decreaseProducedCorruptionIndex(uint256 amount) external;

    /// @notice Calculates is settlement rotten or not
    /// @return isRottenSettlement Is rotten settlement
    function isRottenSettlement() external returns (bool isRottenSettlement);

    /// @notice Destroys current settlement
    /// @dev Settlement will be removed only from crossErasMemory in order to give free space to new settlements
    function destroyRottenSettlement() external;

    /// @notice Lowers settlement corruptionIndex by paying to the reward pool
    /// @dev If world.erc20ForSettlementPurchase is address zero -> function is expected to receive Ether as msg.value in order to decrease corruptionIndex. If not address zero -> 'tokensAmount' parameter is used and it will be taken via 'erc20.transferFrom'
    /// @dev Only settlement in active era can decrease its corruptionIndex
    /// @param tokensAmount Amount of tokens will be taken from sender (if world.erc20ForSettlementPurchase is not address zero)
    function payToDecreaseCorruptionIndex(uint256 tokensAmount) external payable;
}
