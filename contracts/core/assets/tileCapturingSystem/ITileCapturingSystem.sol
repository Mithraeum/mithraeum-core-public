// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

/// @title Tile capturing system interface
/// @notice Functions to read state/modify state in order to get current system parameters and/or interact with it
interface ITileCapturingSystem {
    struct TileInfo {
        address ownerSettlementAddress;
        address usurperSettlementAddress;
        uint256 usurperProsperityStake;
        uint64 usurperCaptureBeginTime;
        uint64 usurperCaptureEndTime;
    }

    // State variables

    /// @notice Mapping containing settlements' current capturing tile
    /// @dev Updated when #beginTileCaptureBySettlement or #claimTileCaptureBySettlement, #cancelTileCaptureBySettlement is called
    function settlementCapturingTile(address settlementAddress) external view returns (uint64);

    /// @notice Mapping containing tile info by provided position
    /// @dev Updated when #beginTileCaptureBySettlement or #claimTileCaptureBySettlement, #cancelTileCaptureBySettlement is called
    function tilesInfo(uint64 position) external view returns (
        address ownerSettlementAddress,
        address usurperSettlementAddress,
        uint256 usurperProsperityStake,
        uint64 usurperCaptureBeginTime,
        uint64 usurperCaptureEndTime
    );

    // Events

    /// @notice Emitted when #beginTileCaptureBySettlement is called
    /// @param previousUsurperAddress Previous usurper address
    /// @param position Position
    /// @param settlementAddress Settlement address
    /// @param prosperityStake Prosperity stake
    /// @param captureBeginTime Capture begin time
    /// @param captureEndTime Capture end time
    event TileCapturingBegan(
        address previousUsurperAddress,
        uint64 position,
        address settlementAddress,
        uint256 prosperityStake,
        uint64 captureBeginTime,
        uint64 captureEndTime
    );

    /// @notice Emitted when #cancelTileCaptureBySettlement
    /// @param position Position
    /// @param settlementAddress Settlement address
    event TileCapturingCancelled(
        uint64 position,
        address settlementAddress
    );

    /// @notice Emitted when #claimTileCaptureBySettlement
    /// @param previousSettlementOwnerAddress Previous settlement owner address
    /// @param position Position
    /// @param settlementAddress Settlement address
    /// @param prosperityStake Prosperity stake
    event CapturedTileClaimed(
        address previousSettlementOwnerAddress,
        uint64 position,
        address settlementAddress,
        uint256 prosperityStake
    );

    /// @notice Emitted when #giveUpCapturedTile
    /// @param position Position
    /// @param settlementAddress Settlement address
    event CapturedTileGivenUp(
        uint64 position,
        address settlementAddress
    );

    // Errors

    /// @notice Thrown when attempting to begin tile capture of non existent position
    error CannotBeginTileCaptureDueToNonExistentPositionSpecified();

    /// @notice Thrown when attempting to begin tile capture of position on not activated region
    error CannotBeginTileCaptureOnNotActivatedRegion();

    /// @notice Thrown when attempting to begin tile capture on position with settlement on it
    error CannotBeginTileCaptureOnPositionWithSettlement();

    /// @notice Thrown when attempting to begin tile capture by settlement which is already capturing tile
    error CannotBeginTileCaptureBySettlementWhichIsAlreadyCapturingTile();

    /// @notice Thrown when attempting to begin tile capture by settlement which already has maximum allowed tiles with same bonus as specified tile
    error CannotBeginTileCaptureBySettlementAlreadyHavingMaximumCapturedTilesWithSameBonus();

    /// @notice Thrown when attempting to begin tile capture of position without tile bonus
    error CannotBeginTileCaptureOfPositionWithoutBonus();

    /// @notice Thrown when attempting to begin tile capture with not having specified amount of prosperity
    error CannotBeginTileCaptureDueToNotHavingSpecifiedProsperity();

    /// @notice Thrown when attempting to begin tile capture with prosperity stake lower than next minimum prosperity stake
    error CannotBeginTileCaptureDueToNotReachedNextMinimumProsperityStake();

    /// @notice Thrown when attempting to cancel tile capture by settlement which is not currently capturing specified tile
    error TileCaptureCannotBeCancelledBySettlementWhichIsNotCurrentTileUsurper();

    /// @notice Thrown when attempting to give up captured tile by settlement which is not owner of specified tile
    error CapturedTileCannotBeGivenUpByNonSettlementOwner();

    /// @notice Thrown when attempting to claim captured tile by settlement which was not capturing specified tile
    error ClaimTileCaptureCannotBeDoneByNonUsurperSettlement();

    /// @notice Thrown when attempting to claim captured tile at this time (it is still capturing)
    error ClaimTileCaptureCannotBeDoneAtThisTime();

    /// @notice Thrown when attempting to claim captured tile without necessary prosperity in settlement
    error ClaimTileCaptureCannotBeDoneWithoutNecessaryProsperity();

    /// @notice Thrown when attempting to apply or remove tile bonus. It should not be thrown ever, if it does this will indicate logic error
    error UnknownTileBonus();

    // Functions

    /// @notice Begins tile capturing
    /// @dev Even though function is opened, it can be called only by world asset
    /// @param settlementAddress Settlement address
    /// @param position Position
    function beginTileCapture(address settlementAddress, uint64 position, uint256 prosperityStake) external;

    /// @notice Cancels tile capturing
    /// @dev Even though function is opened, it can be called only by world asset
    /// @param settlementAddress Settlement address
    /// @param position Position
    function cancelTileCapture(address settlementAddress, uint64 position) external;

    /// @notice Gives up captured tile
    /// @dev Even though function is opened, it can be called only by world asset
    /// @param settlementAddress Settlement address
    /// @param position Position
    function giveUpCapturedTile(address settlementAddress, uint64 position) external;

    /// @notice Claims captured tile
    /// @dev Even though function is opened, it can be called only by world asset
    /// @param settlementAddress Settlement address
    /// @param position Position
    function claimTileCapture(address settlementAddress, uint64 position) external;

    /// @notice Returns positions of captured tiles for provided settlement address
    /// @dev Returns only claimed tiles
    /// @param settlementAddress Settlement address
    /// @param tileBonusType Tile bonus type
    /// @return positions Positions of captured tiles
    function getCapturedTilesBySettlementAddress(address settlementAddress, uint8 tileBonusType) external view returns (uint64[] memory positions);

    /// @notice New settlement handler
    /// @dev Even though function is opened, it can be called only by world asset
    /// @param position Position
    function handleSettlementCreatedOnPosition(uint64 position) external;
}
