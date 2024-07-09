// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../workersPool/IWorkersPool.sol";
import "../era/IEra.sol";
import "../unitsPool/IUnitsPool.sol";
import "../settlement/ISettlement.sol";
import "../settlementsMarket/ISettlementMarket.sol";

/// @title Region interface
/// @notice Functions to read state/modify state in order to get current region parameters and/or interact with it
interface IRegion {

    // State variables

    /// @notice Workers pool
    /// @dev Immutable, initialized on the region creation
    function workersPool() external view returns (IWorkersPool);

    /// @notice Mapping containing units pool for provided unit type id
    /// @dev Immutable, initialized on the region creation
    function unitsPools(bytes32 unitTypeId) external view returns (IUnitsPool);

    /// @notice Mapping containing units market for provided unit type
    /// @dev Immutable, initialized on the region creation
    function settlementsMarket() external view returns (ISettlementsMarket);

    /// @notice Cultists settlement of this region
    /// @dev Immutable, initialized on the region creation
    function cultistsSettlement() external view returns (ISettlement);

    /// @notice Last cultists summon interval number of this region
    /// @dev Updated when #_summonCultists is called
    function lastCultistsSummonIntervalNumber() external view returns (uint256);

    /// @notice Amount of corruptionIndex in this region
    /// @dev Updated when #increaseCorruptionIndex or #decreaseCorruptionIndex is called
    function corruptionIndex() external view returns (int256);

    /// @notice Region id
    /// @dev Immutable, initialized on the region creation
    function regionId() external view returns (uint64);

    /// @notice Last update time
    /// @dev Updated when #updateRegionTime is called
    function lastUpdateTime() external view returns (uint256);

    /// @notice Last apply state region time
    /// @dev Updated when #updateRegionTime is called
    function lastUpdateRegionTime() external view returns (uint256);

    // Events

    /// @notice Emitted when region initialized
    /// @param workersPoolAddress Workers pool address
    event WorkersPoolCreated(address workersPoolAddress);

    /// @notice Emitted when region initialized
    /// @param settlementsMarketAddress Settlements market address
    event SettlementsMarketCreated(address settlementsMarketAddress);

    /// @notice Emitted when region initialized
    /// @param unitsPoolAddress Units pool address
    /// @param unitTypeId Unit type id
    event UnitsPoolCreated(address unitsPoolAddress, bytes32 unitTypeId);

    /// @notice Emitted when #increaseCorruptionIndex is called
    /// @param settlementAddress An address of settlement which triggered corruptionIndex increase (can be address(0))
    /// @param addedCorruptionIndexAmount Amount of added corruptionIndex
    event CorruptionIndexIncreased(address settlementAddress, uint256 addedCorruptionIndexAmount);

    /// @notice Emitted when #decreaseCorruptionIndex is called
    /// @param settlementAddress An address of settlement which triggered corruptionIndex decrease (can be address(0))
    /// @param reducedCorruptionIndexAmount Amount of reduced corruptionIndex
    event CorruptionIndexDecreased(address settlementAddress, uint256 reducedCorruptionIndexAmount);

    /// @notice Emitted when #updateState is called
    /// @param lastUpdateTime Time at which region time changed
    /// @param lastUpdateRegionTime Region time at 'lastUpdateTime'
    event RegionTimeChanged(uint256 lastUpdateTime, uint256 lastUpdateRegionTime);

    /// @notice Emitted when #handleCultistsSummoned or #handleCultistsDefeated is called
    /// @param newRegionCultistsAmount New region cultists amount
    event RegionCultistsChanged(uint256 newRegionCultistsAmount);

    /// @notice Emitted when #_summonCultists is called
    /// @param newCultistsSummonIntervalNumber New cultists summon interval number
    event LastCultistsSummonIntervalNumberUpdated(uint256 newCultistsSummonIntervalNumber);

    // Errors

    /// @notice Thrown when attempting to call action which can only be called by current era Units
    error OnlyEraUnits();

    // Functions

    /// @notice Persists region time upto specified global time
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param globalTime Global time
    function updateRegionTime(uint256 globalTime) external;

    /// @notice Creates cultists settlement
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param cultistsPosition Cultists position
    function createCultistsSettlement(uint64 cultistsPosition) external;

    /// @notice Buys specified units for specified amount of tokens in current region
    /// @dev If tokensOwner == address(0) -> tokens will be taken from msg.sender
    /// @dev If tokensOwner != address(0) and tokensOwner has given allowance to msg.sender >= amount of tokens for units -> tokens will be taken from tokensOwner
    /// @param tokensOwner Tokens owner
    /// @param settlementAddress Settlement's address army of which will receive units
    /// @param unitTypeIds Unit type ids
    /// @param unitsAmounts Units amounts
    /// @param maxTokensToSell Maximum amounts of tokens to sell for each unit types
    function buyUnitsBatch(
        address tokensOwner,
        address settlementAddress,
        bytes32[] memory unitTypeIds,
        uint256[] memory unitsAmounts,
        uint256[] memory maxTokensToSell
    ) external;

    /// @notice Increases corruptionIndex in region
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param settlementAddress An address of the settlement which triggered corruptionIndex increase (address(0) if triggered by non-settlement action)
    /// @param value Amount of corruptionIndex
    function increaseCorruptionIndex(
        address settlementAddress,
        uint256 value
    ) external;

    /// @notice Decreases corruptionIndex in region
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param settlementAddress An address of the settlement which triggered corruptionIndex decrease (address(0) if triggered by non-settlement action)
    /// @param value Amount of corruptionIndex
    function decreaseCorruptionIndex(
        address settlementAddress,
        uint256 value
    ) external;

    /// @notice Region cultists summon handler
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param value Amount of cultists minted
    function handleCultistsSummoned(
        uint256 value
    ) external;

    /// @notice Region cultists defeat handler
    /// @dev Even though function is opened, it can only be called by world asset
    /// @param value Amount of cultists burned
    function handleCultistsDefeated(
        uint256 value
    ) external;

    /// @notice Calculates penalty according to current cultists count
    /// @dev Uses unit.balanceOf to determine penalty
    /// @return penalty Penalty from cultists
    function getPenaltyFromCultists() external view returns (uint256 penalty);

    /// @notice Updates region state
    /// @dev This function is called every time when production should be modified
    function updateState() external;

    /// @notice Calculates region time with provided timestamp
    /// @dev Takes into an account previous value and current cultists penalty and extrapolates to value at provided timestamp
    /// @param timestamp Timestamp
    /// @return regionTime Extrapolated region time
    function getRegionTime(uint256 timestamp) external view returns (uint256 regionTime);
}
