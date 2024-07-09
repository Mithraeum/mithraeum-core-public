// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../assets/settlement/ISettlement.sol";

interface IGeography {
    enum TileBonusType {
        NO_BONUS, //0
        ADVANCED_PRODUCTION, //1
        ARMY_BATTLE_STATS //2
    }

    struct TileBonus {
        TileBonusType tileBonusType;
        uint8 tileBonusVariation;
    }

    // State variables

    // Events

    /// @notice Emitted when #includeRegion is called
    /// @param regionId Region id
    event RegionIncluded(
        uint64 regionId
    );

    // Errors

    /// @notice Thrown when attempting to include first region by non mighty creator address
    error FirstRegionCanOnlyBeIncludedByMightyCreator();

    /// @notice Thrown when attempting to include region by providing invalid region inclusion proof
    error CannotIncludeRegionWithInvalidRegionInclusionProofProvided();

    /// @notice Thrown when attempting to include already included region
    error CannotIncludeAlreadyIncludedRegion();

    /// @notice Thrown when attempting to include region with insufficient value sent (only if world.erc20ForRegionInclusion == address(0), which is equivalent of native token)
    error CannotIncludeRegionDueToInsufficientValueSent();

    /// @notice Thrown when attempting to include region with insufficient amount of user settlements in neighboring region
    error CannotIncludeRegionDueToInsufficientUserSettlementsCountInNeighboringRegion();

    /// @notice Thrown when attempting to _getNeighborPosition with invalid neighbor direction. It should not be thrown ever, if it does this will indicate logic error
    error InvalidNeighborDirectionSpecified();

    /// @notice Thrown when attempting to calculate tile bonus. It should not be thrown ever, if it does this will indicate logic error
    error InvalidTileBonusConfiguration();

    // Functions

    /// @notice Proxy initializer
    /// @dev Called by address which created current instance
    /// @param worldAddress World address
    function init(address worldAddress) external;

    /// @notice Returns region owner
    /// @dev Updated when #includeRegion is called
    /// @param regionId Region id
    /// @return regionOwner Region owner
    function getRegionOwner(uint64 regionId) external view returns (address regionOwner);

    /// @notice Returns region tier
    /// @dev Updated when #includeRegion is called
    /// @param regionId Region id
    /// @return regionTier Region tier
    function getRegionTier(uint64 regionId) external view returns (uint256 regionTier);

    /// @notice Returns created regions count
    /// @dev Updated when #includeRegion is called
    /// @return regionsCount Regions count
    function getRegionsCount() external view returns (uint256 regionsCount);

    /// @notice Includes new region to the game
    /// @dev In case if there is more than zero regions in the game caller must provide two neighboring positions: first for new region, second of already existing region
    /// @dev In case if zero included regions -> second param is ignored
    /// @param newRegionPosition New region position
    /// @param neighborRegionPosition Neighbor region position
    function includeRegion(
        uint64 newRegionPosition,
        uint64 neighborRegionPosition
    ) external payable;

    /// @notice Checks if region is included to the game
    /// @dev Used to determine whether region can be activated or not
    /// @param regionId Region id
    /// @return isRegionIncluded Is region included
    function isRegionIncluded(uint64 regionId) external view returns (bool isRegionIncluded);

    /// @notice Returns region id by position
    /// @param position Provided position
    /// @return regionId Region id
    /// @return isPositionExist Is position exist (may not exist due to region cavities)
    function getRegionIdByPosition(uint64 position) external view returns (uint64 regionId, bool isPositionExist);

    /// @notice Calculates all ring positions by provided position and radius
    /// @param position Position
    /// @param radius Ring radius
    /// @return ringPositions Ring positions
    /// @return ringPositionsLength Ring positions length (array is initialized 6 * radius, however not all values should be used)
    function getRingPositions(uint64 position, uint256 radius) external pure returns (uint64[] memory ringPositions, uint256 ringPositionsLength);

    /// @notice Returns tile bonus by provided position
    /// @param tileBonusesSeed Tile bonuses seed
    /// @param chanceForTileWithBonus Chance for tile with bonus (in 1e18 precision)
    /// @param position Position
    /// @return tileBonus Tile bonus struct
    function getTileBonus(bytes32 tileBonusesSeed, uint256 chanceForTileWithBonus, uint64 position) external pure returns (TileBonus memory tileBonus);

    /// @notice Calculates distance between positions
    /// @param position1 First position
    /// @param position2 Second position
    /// @param distance Distance
    function getDistanceBetweenPositions(uint64 position1, uint64 position2) external pure returns (uint64 distance);
}
