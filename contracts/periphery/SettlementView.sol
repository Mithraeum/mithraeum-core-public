// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../core/assets/settlement/ISettlement.sol";
import "../core/assets/IWorldAsset.sol";
import "../const/GameAssetTypes.sol";

/// @title Settlement view contract
/// @notice Contains helper read/write requests for interacting with settlement
contract SettlementView {
    /// @notice Distributes all unharvested resources of all settlement buildings to its shareholders
    /// @dev Caller may pay high amount of gas if there will be a lot of shareholders. Use with caution
    /// @param settlementAddress Settlement address
    function distributeAllBuildingsUnharvestedResources(
        address settlementAddress
    ) public {
        ISettlement settlement = ISettlement(settlementAddress);
        settlement.buildings(FARM_TYPE_ID).distributeToAllShareholders();
        settlement.buildings(LUMBERMILL_TYPE_ID).distributeToAllShareholders();
        settlement.buildings(MINE_TYPE_ID).distributeToAllShareholders();
        settlement.buildings(SMITHY_TYPE_ID).distributeToAllShareholders();
    }

    /// @notice Calculates current prosperity at specified timestamp
    /// @dev Uses buildings productions to forecast amount of prosperity will settlement will have at specified time
    /// @param settlementAddress Settlement address
    /// @param timestamp Time at which calculate current prosperity
    /// @return Amount of prosperity at specified time
    function accumulatedCurrentProsperity(
        address settlementAddress,
        uint256 timestamp
    ) public view returns (int256) {
        ISettlement settlement = ISettlement(settlementAddress);
        IWorldAsset worldAsset = IWorldAsset(settlementAddress);

        if (timestamp == 0) {
            timestamp = block.timestamp;
        }

        IWorld world = worldAsset.world();
        IRegistry registry = worldAsset.registry();
        IEra settlementEra = worldAsset.era();

        uint256 spentProsperity = settlementEra.prosperity().prosperitySpent(settlementAddress);
        uint256 extendedProsperityAmount = settlement.extendedProsperityAmount();

        bytes32[] memory buildingTypeIds = registry.getBuildingTypeIds();

        for (uint256 i = 0; i < buildingTypeIds.length; i++) {
            IBuilding building = settlement.buildings(buildingTypeIds[i]);
            extendedProsperityAmount += _calculateProsperityByBuilding(registry, building, timestamp);
        }

        return int256(extendedProsperityAmount) - int256(spentProsperity);
    }

    /// @dev Calculates prosperity building provides at given timestamp
    function _calculateProsperityByBuilding(
        IRegistry registry,
        IBuilding building,
        uint256 timestamp
    ) internal view returns (uint256) {
        return building.getTreasuryAmount(timestamp)
            * registry.getResourceWeight(building.getProducingResourceTypeId())
            / building.getBuildingCoefficient(building.getBuildingLevel())
            / 1e18;
    }
}
