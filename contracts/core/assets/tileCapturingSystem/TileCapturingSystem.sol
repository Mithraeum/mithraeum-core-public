// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "../WorldAsset.sol";
import "./ITileCapturingSystem.sol";
import "../../../const/GameAssetTypes.sol";

contract TileCapturingSystem is WorldAsset, ITileCapturingSystem {
    using EnumerableSet for EnumerableSet.UintSet;

    /// @dev Mapping containing captured tiles by provided settlement address
    mapping(address => mapping(IGeography.TileBonusType => EnumerableSet.UintSet)) private settlementCapturedTiles;

    /// @inheritdoc ITileCapturingSystem
    mapping(address => uint64) public override settlementCapturingTile;
    /// @inheritdoc ITileCapturingSystem
    mapping(uint64 => TileInfo) public override tilesInfo;

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {

    }

    /// @inheritdoc ITileCapturingSystem
    function beginTileCapture(
        address settlementAddress,
        uint64 position,
        uint256 prosperityStake
    )
        public
        override
        onlyWorldAssetFromSameEra
    {
        ISettlement settlement = ISettlement(settlementAddress);

        // Update callers' settlement prosperity
        settlement.updateProsperityAmount();

        (uint64 regionId, bool isPositionExist) = world().geography().getRegionIdByPosition(position);
        if (!isPositionExist) revert CannotBeginTileCaptureDueToNonExistentPositionSpecified();

        IGeography.TileBonus memory tileBonus = _getTileBonus(regionId, position);

        if (address(era().regions(regionId)) == address(0)) revert CannotBeginTileCaptureOnNotActivatedRegion();
        if (address(world().crossErasMemory().settlementByPosition(position)) != address(0)) revert CannotBeginTileCaptureOnPositionWithSettlement();
        if (settlementCapturingTile[settlementAddress] != 0) revert CannotBeginTileCaptureBySettlementWhichIsAlreadyCapturingTile();
        if (settlementCapturedTiles[settlementAddress][tileBonus.tileBonusType].length() == registry().getMaxCapturedTilesForSettlement(uint8(tileBonus.tileBonusType))) revert CannotBeginTileCaptureBySettlementAlreadyHavingMaximumCapturedTilesWithSameBonus();
        if (tileBonus.tileBonusType == IGeography.TileBonusType.NO_BONUS) revert CannotBeginTileCaptureOfPositionWithoutBonus();
        if (era().prosperity().balanceOf(settlementAddress) < prosperityStake) revert CannotBeginTileCaptureDueToNotHavingSpecifiedProsperity();

        TileInfo storage tileInfo = tilesInfo[position];
        address previousUsurperSettlementAddress = tileInfo.usurperSettlementAddress;

        uint256 previousUsurperProsperityStake = previousUsurperSettlementAddress != address(0)
            ? tileInfo.usurperProsperityStake
            : 0;

        uint256 distanceBetweenSettlementAndTile = world().geography().getDistanceBetweenPositions(
            position,
            settlement.position()
        );

        if (prosperityStake < _calculateNextMinProsperityStake(previousUsurperProsperityStake, distanceBetweenSettlementAndTile)) revert CannotBeginTileCaptureDueToNotReachedNextMinimumProsperityStake();

        if (previousUsurperSettlementAddress != address(0)) {
            settlementCapturingTile[previousUsurperSettlementAddress] = 0;

            // Update usurper settlement prosperity
            ISettlement(previousUsurperSettlementAddress).updateProsperityAmount();

            // And remove 25% prosperity of old stake
            era().prosperity().spend(
                previousUsurperSettlementAddress,
                previousUsurperProsperityStake * registry().getTileCaptureCancellationFee() / 1e18
            );
        }

        uint64 captureBeginTime = uint64(block.timestamp);
        uint64 captureEndTime = uint64(block.timestamp + distanceBetweenSettlementAndTile * registry().getCaptureTileDurationPerTile() / registry().getGlobalMultiplier());

        tileInfo.usurperProsperityStake = prosperityStake;
        tileInfo.usurperSettlementAddress = settlementAddress;
        tileInfo.usurperCaptureBeginTime = captureBeginTime;
        tileInfo.usurperCaptureEndTime = captureEndTime;

        settlementCapturingTile[settlementAddress] = position;

        emit TileCapturingBegan(
            previousUsurperSettlementAddress,
            position,
            settlementAddress,
            prosperityStake,
            captureBeginTime,
            captureEndTime
        );
    }

    /// @inheritdoc ITileCapturingSystem
    function cancelTileCapture(address settlementAddress, uint64 position)
        public
        override
        onlyWorldAssetFromSameEra
    {
        TileInfo storage tileInfo = tilesInfo[position];

        if (tileInfo.usurperSettlementAddress != settlementAddress) revert TileCaptureCannotBeCancelledBySettlementWhichIsNotCurrentTileUsurper();

        // Has cancellation penalty
        if (uint64(block.timestamp) < tileInfo.usurperCaptureEndTime) {
            // Update callers' settlement prosperity
            ISettlement(settlementAddress).updateProsperityAmount();

            era().prosperity().spend(
                settlementAddress,
                tileInfo.usurperProsperityStake * registry().getTileCaptureCancellationFee() / 1e18
            );
        }

        tileInfo.usurperProsperityStake = 0;
        tileInfo.usurperSettlementAddress = address(0);
        tileInfo.usurperCaptureBeginTime = 0;
        tileInfo.usurperCaptureEndTime = 0;

        settlementCapturingTile[settlementAddress] = 0;

        emit TileCapturingCancelled(position, settlementAddress);
    }

    /// @inheritdoc ITileCapturingSystem
    function giveUpCapturedTile(address settlementAddress, uint64 position)
        public
        override
        onlyWorldAssetFromSameEra
    {
        TileInfo storage tileInfo = tilesInfo[position];

        if (tileInfo.ownerSettlementAddress != settlementAddress) revert CapturedTileCannotBeGivenUpByNonSettlementOwner();

        (uint64 regionId, ) = world().geography().getRegionIdByPosition(position);
        IGeography.TileBonus memory tileBonus = _getTileBonus(regionId, position);
        settlementCapturedTiles[settlementAddress][tileBonus.tileBonusType].remove(position);
        _removeTileBonus(tileBonus, settlementAddress);

        tileInfo.ownerSettlementAddress = address(0);

        emit CapturedTileGivenUp(position, settlementAddress);
    }

    /// @inheritdoc ITileCapturingSystem
    function claimTileCapture(
        address settlementAddress,
        uint64 position
    )
        public
        override
        onlyWorldAssetFromSameEra
    {
        // Update callers' settlement prosperity
        ISettlement(settlementAddress).updateProsperityAmount();

        TileInfo storage tileInfo = tilesInfo[position];

        (uint64 regionId, ) = world().geography().getRegionIdByPosition(position);
        IGeography.TileBonus memory tileBonus = _getTileBonus(regionId, position);

        if (tileInfo.usurperSettlementAddress != settlementAddress) revert ClaimTileCaptureCannotBeDoneByNonUsurperSettlement();
        if (uint64(block.timestamp) < tileInfo.usurperCaptureEndTime) revert ClaimTileCaptureCannotBeDoneAtThisTime();

        uint256 usurperProsperityStake = tileInfo.usurperProsperityStake;

        uint256 necessaryProsperityForClaiming = usurperProsperityStake * registry().getNecessaryProsperityPercentForClaimingTileCapture() / 1e18;
        if (era().prosperity().balanceOf(settlementAddress) < necessaryProsperityForClaiming) revert ClaimTileCaptureCannotBeDoneWithoutNecessaryProsperity();

        address previousSettlementOwnerAddress = tileInfo.ownerSettlementAddress;

        if (previousSettlementOwnerAddress != address(0)) {
            settlementCapturedTiles[previousSettlementOwnerAddress][tileBonus.tileBonusType].remove(position);
            _removeTileBonus(tileBonus, previousSettlementOwnerAddress);
        }

        tileInfo.ownerSettlementAddress = settlementAddress;

        tileInfo.usurperProsperityStake = 0;
        tileInfo.usurperSettlementAddress = address(0);
        tileInfo.usurperCaptureBeginTime = 0;
        tileInfo.usurperCaptureEndTime = 0;

        settlementCapturingTile[settlementAddress] = 0;

        _applyTileBonus(tileBonus, settlementAddress);
        settlementCapturedTiles[settlementAddress][tileBonus.tileBonusType].add(position);

        emit CapturedTileClaimed(previousSettlementOwnerAddress, position, settlementAddress, usurperProsperityStake);
    }

    /// @inheritdoc ITileCapturingSystem
    function getCapturedTilesBySettlementAddress(address settlementAddress, uint8 tileBonusType) public view override returns (uint64[] memory) {
        uint256[] memory positions = settlementCapturedTiles[settlementAddress][IGeography.TileBonusType(tileBonusType)].values();
        uint64[] memory result = new uint64[](positions.length);
        for (uint256 i = 0; i < positions.length; i++) {
            result[i] = uint64(positions[i]);
        }

        return result;
    }

    /// @inheritdoc ITileCapturingSystem
    function handleSettlementCreatedOnPosition(
        uint64 position
    ) public override onlyWorldAssetFromSameEra {
        (uint64 regionId, ) = world().geography().getRegionIdByPosition(position);
        IGeography.TileBonus memory tileBonus = _getTileBonus(regionId, position);

        if (tileBonus.tileBonusType == IGeography.TileBonusType.NO_BONUS) {
            return;
        }

        TileInfo storage tileInfo = tilesInfo[position];
        if (tileInfo.ownerSettlementAddress != address(0)) {
            settlementCapturedTiles[tileInfo.ownerSettlementAddress][tileBonus.tileBonusType].remove(position);
            _removeTileBonus(tileBonus, tileInfo.ownerSettlementAddress);
        }

        if (tileInfo.usurperSettlementAddress != address(0)) {
            settlementCapturingTile[tileInfo.usurperSettlementAddress] = 0;
        }

        tileInfo.ownerSettlementAddress = address(0);

        tileInfo.usurperProsperityStake = 0;
        tileInfo.usurperSettlementAddress = address(0);
        tileInfo.usurperCaptureBeginTime = 0;
        tileInfo.usurperCaptureEndTime = 0;
    }

    /// @dev Returns tile bonus by position
    function _getTileBonus(
        uint64 regionId,
        uint64 position
    ) internal view returns (IGeography.TileBonus memory) {
        IWorld _world = world();
        IGeography geography = _world.geography();
        uint256 regionTier = geography.getRegionTier(regionId);
        uint256 chanceForTileWithBonus = registry().getChanceForTileWithBonusByRegionTier(regionTier);
        bytes32 tileBonusesSeed = _world.getTileBonusesSeed();

        return geography.getTileBonus(tileBonusesSeed, chanceForTileWithBonus, position);
    }

    /// @dev Calculates next min prosperity stake
    function _calculateNextMinProsperityStake(
        uint256 previousUsurperProsperityStake,
        uint256 distanceBetweenSettlementAndTile
    ) internal view returns (uint256) {
        if (previousUsurperProsperityStake == 0) {
            return registry().getInitialCaptureProsperityBasicValue() +
                distanceBetweenSettlementAndTile * registry().getInitialCaptureProsperityPerTileValue();
        }

        uint256 nextCaptureProsperityThreshold = registry().getNextCaptureProsperityBasicThreshold() +
            distanceBetweenSettlementAndTile * registry().getNextCaptureProsperityPerTileThreshold();

        uint256 nextMinProsperityStake = previousUsurperProsperityStake * nextCaptureProsperityThreshold / 1e18;
        return nextMinProsperityStake;
    }

    /// @dev Applies tile bonus to
    function _applyTileBonus(
        IGeography.TileBonus memory tileBonus,
        address settlementAddress
    ) internal {
        ISettlement settlement = ISettlement(settlementAddress);

        if (tileBonus.tileBonusType == IGeography.TileBonusType.ADVANCED_PRODUCTION) {
            (bytes32 buildingTypeId, uint256 capacityAmount) = registry().getAdvancedProductionTileBonusByVariation(tileBonus.tileBonusVariation);
            settlement.buildings(buildingTypeId).increaseAdditionalWorkersCapacityMultiplier(capacityAmount);
            return;
        }

        if (tileBonus.tileBonusType == IGeography.TileBonusType.ARMY_BATTLE_STATS) {
            (bytes32 unitTypeId, uint256 unitBattleMultiplier) = registry().getUnitBattleMultiplierTileBonusByVariation(tileBonus.tileBonusVariation);
            settlement.army().increaseUnitBattleMultiplier(unitTypeId, unitBattleMultiplier);
            return;
        }

        revert UnknownTileBonus();
    }

    /// @dev Removes tile bonus
    function _removeTileBonus(
        IGeography.TileBonus memory tileBonus,
        address settlementAddress
    ) internal {
        ISettlement settlement = ISettlement(settlementAddress);

        if (tileBonus.tileBonusType == IGeography.TileBonusType.ADVANCED_PRODUCTION) {
            (bytes32 buildingTypeId, uint256 capacityAmount) = registry().getAdvancedProductionTileBonusByVariation(tileBonus.tileBonusVariation);
            settlement.buildings(buildingTypeId).decreaseAdditionalWorkersCapacityMultiplier(capacityAmount);
            return;
        }

        if (tileBonus.tileBonusType == IGeography.TileBonusType.ARMY_BATTLE_STATS) {
            (bytes32 unitTypeId, uint256 unitBattleMultiplier) = registry().getUnitBattleMultiplierTileBonusByVariation(tileBonus.tileBonusVariation);
            settlement.army().decreaseUnitBattleMultiplier(unitTypeId, unitBattleMultiplier);
            return;
        }

        revert UnknownTileBonus();
    }
}
