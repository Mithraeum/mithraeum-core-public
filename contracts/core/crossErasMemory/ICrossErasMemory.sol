// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../assets/settlement/ISettlement.sol";

/// @title Cross era memory interface
/// @notice Functions to read state/modify state in order to get cross era memory parameters and/or interact with it
interface ICrossErasMemory {
    // State variables

    /// @notice Mapping containing settlement by provided position
    /// @dev Updated when #placeSettlementOnMap is called
    function settlementByPosition(uint64 position) external view returns (ISettlement);

    /// @notice Mapping containing settlement address by provided banner id
    /// @dev Updated when #addUserSettlement is called
    function settlementByBannerId(uint256 bannerId) external view returns (ISettlement);

    /// @notice Mapping containing count of user settlement by provided region id
    /// @dev Updated when #addUserSettlement or #removeUserSettlement is called
    function regionUserSettlementsCount(uint64 regionId) external view returns (uint256);

    /// @notice Mapping containing settlement price by provided region id
    /// @dev Updated when #changeRegionSettlementPrice is called
    function regionSettlementPrice(uint64 regionId) external view returns (uint256);

    /// @notice Mapping containing settlement price update time by provided region id
    /// @dev Updated when #changeRegionSettlementPrice is called
    function regionSettlementPriceUpdateTime(uint64 regionId) external view returns (uint256);

    // Events

    /// @notice Emitted when #placeSettlementOnMap or #removeUserSettlement is called
    event SettlementOnPositionUpdated(uint64 position, address settlementAddress);

    // Errors

    /// @notice Thrown when attempting to call action which can only be called by active era
    error OnlyActiveEra();

    /// @notice Thrown when attempting to call action which can only be called by old era
    error OnlyWorldAssetFromOldEra();

    /// @notice Thrown when attempting to call action which can only be called by world asset from active era
    error OnlyWorldAssetFromActiveEra();

    // Functions

    /// @notice Proxy initializer
    /// @dev Called by address which created current instance
    /// @param worldAddress World address
    function init(address worldAddress) external;

    /// @notice Adds user settlement
    /// @dev Even though this function is opened, it can only be called by world asset
    /// @param bannerId Banners token id which will represent to which settlement will be attached to
    /// @param regionId Region id
    /// @param settlementAddress New settlement address
    /// @param isNewSettlement Is new settlement
    function addUserSettlement(
        uint256 bannerId,
        uint64 regionId,
        address settlementAddress,
        bool isNewSettlement
    ) external;

    /// @notice Changes region settlement price
    /// @dev Even though this function is opened, it can only be called by world asset from active era
    /// @param regionId Region id
    /// @param settlementPrice Settlement price
    /// @param lastUpdateTime Time at which price is changed
    function changeRegionSettlementPrice(
        uint64 regionId,
        uint256 settlementPrice,
        uint256 lastUpdateTime
    ) external;

    /// @notice Places settlement on map (including system ones, like CULTISTS)
    /// @dev Even though this function is opened, it can only be called by active era
    /// @param position Position
    /// @param settlementAddress Settlement address
    function placeSettlementOnMap(
        uint64 position,
        address settlementAddress
    ) external;

    /// @notice Removes user settlement
    /// @dev Even though this function is opened, it can only be called by world asset from its era
    /// @param settlementAddress Settlement address
    function removeUserSettlement(
        address settlementAddress
    ) external;
}
