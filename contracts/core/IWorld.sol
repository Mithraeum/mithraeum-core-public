// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IRegistry.sol";
import "./assets/era/IEra.sol";
import "./geography/IGeography.sol";
import "./crossErasMemory/ICrossErasMemory.sol";
import "./rewardPool/IRewardPool.sol";
import "./distributions/IDistributions.sol";
import "./regionOwnershipToken/IRegionOwnershipToken.sol";

/// @title World interface
/// @notice Functions to read state/modify state of game world
interface IWorld {

    // State variables

    /// @notice Registry
    /// @dev Immutable, initialized on creation
    function registry() external view returns (IRegistry);

    /// @notice Banners token
    /// @dev Immutable, initialized on creation
    function bannerContract() external view returns (IERC721);

    /// @notice ERC20 token for settlement purchase
    /// @dev Immutable, initialized on creation
    function erc20ForSettlementPurchase() external view returns (IERC20);

    /// @notice ERC20 token for region inclusion
    /// @dev Immutable, initialized on creation
    function erc20ForRegionInclusion() external view returns (IERC20);

    /// @notice Region ownership token
    /// @dev Immutable, initialized on creation
    function regionOwnershipToken() external view returns (IRegionOwnershipToken);

    /// @notice Distributions token
    /// @dev Immutable, initialized on creation
    function distributions() external view returns (IDistributions);

    /// @notice Cross eras memory
    /// @dev Immutable, initialized on creation
    function crossErasMemory() external view returns (ICrossErasMemory);

    /// @notice Reward pool
    /// @dev Immutable, initialized on creation
    function rewardPool() external view returns (IRewardPool);

    /// @notice Game begin time
    /// @dev Updated when #setGameBeginTime is called
    function gameBeginTime() external view returns (uint256);

    /// @notice Game end time
    /// @dev Updated when #setGameEndTime is called
    function gameEndTime() external view returns (uint256);

    /// @notice Geography
    /// @dev Immutable, initialized on creation
    function geography() external view returns (IGeography);

    /// @notice Current world era
    /// @dev Updated when #destroy is called
    function currentEraNumber() external view returns (uint256);

    /// @notice World eras
    /// @dev Updated when world initialized or #destroy is called
    function eras(uint256 eraNumber) external view returns (IEra);

    /// @notice Mapping containing assets implementations addresses by provided asset id
    /// @dev Updated when #setImplementations is called
    /// @dev Every worlds assets implementation (code, not data) will be defined by value from this mapping
    function implementations(bytes28 assetId) external view returns (address);

    /// @notice Mapping containing world asset type by provided era number and address
    /// @dev Updated when #addWorldAsset is called
    function worldAssets(uint256 eraNumber, address worldAsset) external view returns (bytes32);

    // Events

    /// @notice Emitted when world initialized
    /// @param registryAddress Registry contract address
    /// @param crossErasMemoryAddress Cross eras memory address
    /// @param geographyAddress Geography contract address
    /// @param bannersAddress Banners contract address
    /// @param erc20ForBuyingSettlementAddress ERC20 token for settlement purchase address
    /// @param erc20ForRegionInclusionAddress ERC20 token for region inclusion address
    /// @param regionOwnershipTokenAddress Region ownership token address
    /// @param distributionsAddress Distributions token address
    /// @param rewardPoolAddress Reward pool contract address
    event WorldInitialized(
        address registryAddress,
        address crossErasMemoryAddress,
        address geographyAddress,
        address bannersAddress,
        address erc20ForBuyingSettlementAddress,
        address erc20ForRegionInclusionAddress,
        address regionOwnershipTokenAddress,
        address distributionsAddress,
        address rewardPoolAddress
    );

    /// @notice Emitted when #setGameBeginTime is called
    /// @param newBeginTime New game begin time
    event GameBeginTimeUpdated(uint newBeginTime);

    /// @notice Emitted when #setGameEndTime is called
    /// @param newEndTime New game end time
    event GameEndTimeUpdated(uint newEndTime);

    /// @notice Emitted when world initialized or #destroyCurrentEra is called
    /// @param newEraAddress New era address
    /// @param newEraNumber New era number
    event EraCreated(address newEraAddress, uint256 newEraNumber);

    /// @notice Emitted after new era initialization
    /// @param newEraNumber New era number
    event CurrentEraNumberUpdated(uint256 newEraNumber);

    // Errors

    /// @notice Thrown when attempting to call action which can only be called in active game (started and not finished)
    error OnlyActiveGame();

    /// @notice Thrown when attempting to call action which can only be called by mighty creator
    error OnlyMightyCreator();

    /// @notice Thrown when attempting to call action which can only be called by mighty creator or reward pool
    error OnlyMightyCreatorOrRewardPool();

    /// @notice Thrown when attempting to call action which can only be called by world asset factory
    error OnlyFactory();

    /// @notice Thrown when attempting to destroy current era while cultists destruction delay not passed since last cultists summon
    error CurrentEraCannotBeDestroyedDueToCultistsNoDestructionDelayNotPassed();

    /// @notice Thrown when attempting to destroy current era while cultists limit not reached
    error CurrentEraCannotBeDestroyedDueCultistsLimitNotReached();

    // Functions

    /// @notice Proxy initializer
    /// @dev Called by address which created current instance
    /// @param packedAddresses Packed addresses (registry, crossErasMemory, geography, banners, erc20ForSettlementPurchase, erc20ForRegionInclusion, regionOwnershipToken, distributions, rewardPool)
    /// @param assetIds Asset ids
    /// @param implementationAddresses Implementation addresses
    function init(
        bytes calldata packedAddresses,
        bytes28[] calldata assetIds,
        address[] calldata implementationAddresses
    ) external;

    /// @notice Adds an address as world asset
    /// @dev Even though function is opened, it can only be called by factory contract
    /// @param eraNumber Era number
    /// @param worldAssetAddress World asset address
    /// @param assetType Asset type
    function addWorldAsset(
        uint256 eraNumber,
        address worldAssetAddress,
        bytes32 assetType
    ) external;

    /// @notice Sets provided address as implementation for provided asset ids
    /// @dev Even though function is opened, it can be called only by mightyCreator
    /// @param assetIds Asset ids
    /// @param implementationAddresses Implementation addresses
    function setImplementations(
        bytes28[] calldata assetIds,
        address[] calldata implementationAddresses
    ) external;

    /// @notice Mints workers to provided address
    /// @dev Even though function is opened, it can only be called by mighty creator
    /// @param eraNumber Era number
    /// @param to Address which will receive workers
    /// @param value Amount of workers to mint
    function mintWorkers(
        uint256 eraNumber,
        address to,
        uint256 value
    ) external;

    /// @notice Mints units to provided address
    /// @dev Even though function is opened, it can only be called by mighty creator
    /// @param eraNumber Era number
    /// @param unitTypeId Type id of unit to mint
    /// @param to Address which will receive units
    /// @param value Amount of units to mint
    function mintUnits(
        uint256 eraNumber,
        bytes32 unitTypeId,
        address to,
        uint256 value
    ) external;

    /// @notice Mints resource to provided address
    /// @dev Even though function is opened, it can only be called by mighty creator
    /// @param eraNumber Era number
    /// @param resourceTypeId Resource type id
    /// @param to Address which will receive resources
    /// @param value Amount of resources to mint
    function mintResources(
        uint256 eraNumber,
        bytes32 resourceTypeId,
        address to,
        uint256 value
    ) external;

    /// @notice Sets game end time
    /// @dev Even though function is opened, it can only be called by mighty creator or reward pool
    /// @param gameEndTime Game end time
    function setGameEndTime(uint256 gameEndTime) external;

    /// @notice Sets game begin time
    /// @dev Even though function is opened, it can only be called by mighty creator
    /// @param gameBeginTime Game begin time
    function setGameBeginTime(uint256 gameBeginTime) external;

    /// @notice Destroys current era if conditions are met
    /// @dev Anyone can call this function
    function destroyCurrentEra() external;

    /// @notice Returns region radius which is used to determine average region size
    /// @dev Immutable
    /// @return regionRadius Region radius
    function getRegionRadius() external pure returns (uint64 regionRadius);

    /// @notice Returns region seed which is used to determine region ids for positions
    /// @dev Immutable
    /// @return regionSeed Region seed
    function getRegionSeed() external pure returns (bytes32 regionSeed);

    /// @notice Returns tile bonuses seed
    /// @dev Immutable
    /// @return tileBonusesSeed Tile bonuses seed
    function getTileBonusesSeed() external pure returns (bytes32 tileBonusesSeed);

    /// @notice Returns region tier seed
    /// @dev Updated when era is changed
    /// @return regionTierSeed Region tier seed
    function getRegionTierSeed() external view returns (bytes32 regionTierSeed);
}
