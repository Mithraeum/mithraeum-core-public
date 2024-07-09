// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../settlement/ISettlement.sol";
import "../tileCapturingSystem/ITileCapturingSystem.sol";
import "../tokens/resources/IResource.sol";

/// @title Era interface
/// @notice Functions to read state/modify state in order to get current era parameters and/or interact with it
interface IEra {

    // State variables

    /// @notice Mapping containing activated regions by provided region id
    /// @dev Updated when #activateRegion is called
    function regions(uint64 regionId) external view returns (IRegion);

    /// @notice Mapping containing settlement by provided position
    /// @dev Updated when new settlement is created
    function settlementByPosition(uint64 position) external view returns (ISettlement);

    /// @notice Mapping containing settlement address by provided banner id
    /// @dev Updated when #addUserSettlement is called
    function settlementByBannerId(uint256 bannerId) external view returns (ISettlement);

    /// @notice Total cultists
    /// @dev Updated when #increaseTotalCultists or #decreaseTotalCultists is called
    function totalCultists() external view returns (uint256);

    /// @notice Era creation time
    /// @dev Immutable, initialized on creation
    function creationTime() external view returns (uint256);

    /// @notice Workers token
    /// @dev Updated when #setWorkersContract is called
    function workers() external view returns (IWorkers);

    /// @notice Prosperity token
    /// @dev Updated when #setProsperityContract is called
    function prosperity() external view returns (IProsperity);

    /// @notice Mapping containing game resources by resource type id
    /// @dev Updated when #addResource is called
    function resources(bytes32 resourceTypeId) external view returns (IResource);

    /// @notice Mapping containing units by unit type id
    /// @dev Updated when #addUnit is called
    function units(bytes32 unitTypeId) external view returns (IUnits);

    /// @notice Tile capturing system
    /// @dev Updated when #setTileCapturingSystemContract is called
    function tileCapturingSystem() external view returns (ITileCapturingSystem);

    // Events

    /// @notice Emitted when era resource is created
    /// @param resourceAddress Resource address
    /// @param resourceTypeId Resource type id
    event ResourceCreated(
        address resourceAddress,
        bytes32 resourceTypeId
    );

    /// @notice Emitted when era units is created
    /// @param unitsAddress Units address
    /// @param unitTypeId Unit type id
    event UnitsCreated(
        address unitsAddress,
        bytes32 unitTypeId
    );

    /// @notice Emitted when era workers is created
    /// @param workersAddress Workers address
    event WorkersCreated(
        address workersAddress
    );

    /// @notice Emitted when era prosperity is created
    /// @param prosperityAddress Prosperity address
    event ProsperityCreated(
        address prosperityAddress
    );

    /// @notice Emitted when era tile capturing system is created
    /// @param tileCapturingSystemAddress Tile capturing system address
    event TileCapturingSystemCreated(
        address tileCapturingSystemAddress
    );

    /// @notice Emitted when #activateRegion is called
    /// @param regionAddress Region address
    /// @param regionId Region id
    event RegionActivated(
        address regionAddress,
        uint256 regionId
    );

    /// @notice Emitted when #newAssetSettlement is called
    /// @param settlementAddress Created settlement address
    /// @param assetTypeId Asset type id
    /// @param regionAddress Address of the region where settlement is created
    /// @param position Position
    /// @param bannerId Banner id
    event SettlementCreated(
        address settlementAddress,
        bytes32 assetTypeId,
        address regionAddress,
        uint64 position,
        uint256 bannerId
    );

    /// @notice Emitted when #restoreUserSettlement is called
    /// @param settlementAddress Settlement address
    /// @param position Position
    event SettlementRestored(
        address settlementAddress,
        uint64 position
    );

    /// @notice Emitted when #increaseTotalCultists or #decreaseTotalCultists is called
    /// @param newTotalCultists New total cultists
    event TotalCultistsChanged(uint256 newTotalCultists);

    // Errors

    /// @notice Thrown when attempting to activate region more than once
    error EraCannotActivateRegionMoreThanOnce();

    /// @notice Thrown when attempting to activate region which is not included to the game
    error EraCannotActivateNotIncludedRegion();

    /// @notice Thrown when attempting to restore user settlement from inactive era
    error UserSettlementCannotBeRestoredFromInactiveEra();

    /// @notice Thrown when attempting to restore user settlement if it is rotten
    error UserSettlementCannotBeRestoredIfItsRotten();

    /// @notice Thrown when attempting to create user settlement on position with another settlement
    error UserSettlementCannotBeCreatedOnPositionWithAnotherSettlement();

    /// @notice Thrown when attempting to create user settlement on position which is to close to another settlement
    error UserSettlementCannotBeCreatedOnPositionWhichIsToCloseToAnotherSettlement();

    /// @notice Thrown when attempting to create user settlement with banner nft id which is already taken by another settlement
    error UserSettlementCannotBeCreatedIfBannerNftIdIsAlreadyTakenByAnotherSettlement();

    /// @notice Thrown when attempting to create user settlement in inactive era
    error UserSettlementCannotBeCreatedInInactiveEra();

    /// @notice Thrown when attempting to create user settlement in region which already has maximum amount of allowed settlement
    error UserSettlementCannotBeCreatedInRegionWithMaximumAllowedSettlements();

    /// @notice Thrown when attempting to create user settlement on position which is not connected to another settlement
    error UserSettlementCannotBeCreatedOnPositionWhichIsNotConnectedToAnotherSettlement();

    // Functions

    /// @notice Activates region
    /// @dev Even though function is opened, it can be called only by mightyCreator
    /// @param regionId Region id
    function activateRegion(uint64 regionId) external;

    /// @notice Restores settlement from previous era by provided position
    /// @dev Any address can restore user settlement
    /// @param position Position
    function restoreUserSettlement(
        uint64 position
    ) external;

    /// @notice Creates user settlement
    /// @dev Even though function is opened, it can be called only by world asset
    /// @param position Position
    /// @param regionId Region id to which position belongs
    /// @param bannerId Banners token id which will represent to which settlement will be attached to
    /// @return settlementAddress Settlement address
    function createUserSettlement(
        uint64 position,
        uint64 regionId,
        uint256 bannerId
    ) external returns (address settlementAddress);

    /// @notice Creates settlement by type
    /// @dev Even though function is opened, it can be called only by world asset
    /// @param bannerId Banners token id which will represent to which settlement will be attached to
    /// @param position Position
    /// @param regionId Region id to which position belongs
    /// @param assetTypeId Asset type id
    function createSettlementByType(
        uint256 bannerId,
        uint64 position,
        uint64 regionId,
        bytes32 assetTypeId
    ) external returns (address);

    /// @notice Increases total cultists
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param value Amount of cultists minted
    function increaseTotalCultists(
        uint256 value
    ) external;

    /// @notice Decreases total cultists
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param value Amount of cultists burned
    function decreaseTotalCultists(
        uint256 value
    ) external;
}
