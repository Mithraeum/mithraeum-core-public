// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../core/IWorld.sol";
import "../core/assets/era/IEra.sol";
import "../core/assets/settlement/ISettlement.sol";
import "../core/assets/IWorldAsset.sol";

contract EraView {
    /// @notice Returns user settlements by provided banners ids
    /// @dev Useful to batch query settlement addresses by banners ids
    /// @param eraAddress Era address
    /// @param bannerIds Banners ids
    /// @return userSettlements Settlement addresses
    function getUserSettlements(
        address eraAddress,
        uint256[] memory bannerIds
    ) public view returns (address[] memory) {
        IEra era = IEra(eraAddress);

        address[] memory result = new address[](bannerIds.length);

        for (uint256 i = 0; i < bannerIds.length; i++) {
            result[i] = address(era.settlementByBannerId(bannerIds[i]));
        }

        return result;
    }

    /// @notice If necessary activates region and restores settlement
    /// @dev Activates region (if it is not activated yet) and restores settlement on position
    /// @param eraAddress Era address
    /// @param position Position
    /// @param regionId Region id of position
    function restoreSettlementWithRegionActivation(
        address eraAddress,
        uint64 position,
        uint64 regionId
    ) public {
        IEra era = IEra(eraAddress);

        if (address(era.regions(regionId)) == address(0)) {
            era.activateRegion(regionId);
        }

        era.restoreUserSettlement(position);
    }

    /// @notice If necessary activates region and destroys settlement
    /// @dev Activates region (if it is not activated yet) and destroys settlement
    /// @param settlementAddress Settlement address
    function destroySettlementWithRegionActivation(
        address settlementAddress
    ) public {
        ISettlement settlement = ISettlement(settlementAddress);
        IWorldAsset settlementWorldAsset = IWorldAsset(settlementAddress);
        IWorld world = settlementWorldAsset.world();
        IEra currentlyActiveEra = world.eras(world.currentEraNumber());

        uint64 regionId = settlement.relatedRegion().regionId();

        if (address(currentlyActiveEra.regions(regionId)) == address(0)) {
            currentlyActiveEra.activateRegion(regionId);
        }

        settlement.destroyRottenSettlement();
    }
}
