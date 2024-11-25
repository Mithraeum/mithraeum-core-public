// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../region/IRegion.sol";
import "../WorldAsset.sol";
import "./IEra.sol";
import "../../geography/IGeography.sol";
import "../../../const/GameAssetTypes.sol";

contract Era is WorldAsset, IEra {
    /// @inheritdoc IEra
    mapping(uint64 => IRegion) public override regions;
    /// @inheritdoc IEra
    mapping(uint64 => ISettlement) public override settlementByPosition;
    /// @inheritdoc IEra
    mapping(uint256 => ISettlement) public override settlementByBannerId;
    /// @inheritdoc IEra
    uint256 public override totalCultists;
    /// @inheritdoc IEra
    uint256 public override creationTime;

    /// @inheritdoc IEra
    IWorkers public override workers;
    /// @inheritdoc IEra
    IProsperity public override prosperity;
    /// @inheritdoc IEra
    mapping(bytes32 => IResource) public override resources;
    /// @inheritdoc IEra
    mapping(bytes32 => IUnits) public override units;
    /// @inheritdoc IEra
    ITileCapturingSystem public override tileCapturingSystem;

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {
        creationTime = block.timestamp;

        (
            uint256 eraNumber
        ) = abi.decode(initParams, (uint256));

        address worldAddress = address(world());
        IWorldAssetFactory factory = worldAssetFactory();

        // 1. create new resources
        Config.GameResource[] memory gameResources = Config.getGameResources();
        for (uint256 i = 0; i < gameResources.length; i++) {
            Config.GameResource memory gameResource = gameResources[i];

            address resourceAddress = factory.create(
                worldAddress,
                eraNumber,
                RESOURCE_GROUP_TYPE_ID,
                BASIC_TYPE_ID,
                abi.encode(gameResource.tokenName, gameResource.tokenSymbol, gameResource.resourceTypeId)
            );

            resources[gameResource.resourceTypeId] = IResource(resourceAddress);
            emit ResourceCreated(resourceAddress, gameResource.resourceTypeId);
        }

        // 2. create new units
        Config.GameUnit[] memory gameUnits = Config.getGameUnits();
        for (uint256 i = 0; i < gameUnits.length; i++) {
            Config.GameUnit memory gameUnit = gameUnits[i];

            address unitsAddress = factory.create(
                worldAddress,
                eraNumber,
                UNITS_GROUP_TYPE_ID,
                BASIC_TYPE_ID,
                abi.encode(gameUnit.tokenName, gameUnit.tokenSymbol, gameUnit.unitTypeId)
            );

            units[gameUnit.unitTypeId] = IUnits(unitsAddress);
            emit UnitsCreated(unitsAddress, gameUnit.unitTypeId);
        }

        // 3. create new workers
        address workersAddress = factory.create(
            worldAddress,
            eraNumber,
            WORKERS_GROUP_TYPE_ID,
            BASIC_TYPE_ID,
            abi.encode()
        );

        workers = IWorkers(workersAddress);
        emit WorkersCreated(workersAddress);

        // 4. create new prosperity
        address prosperityAddress = factory.create(
            worldAddress,
            eraNumber,
            PROSPERITY_GROUP_TYPE_ID,
            BASIC_TYPE_ID,
            abi.encode()
        );

        prosperity = IProsperity(prosperityAddress);
        emit ProsperityCreated(prosperityAddress);

        // 5. create new tile capturing system
        address tileCapturingSystemAddress = factory.create(
            worldAddress,
            eraNumber,
            TILE_CAPTURING_SYSTEM_GROUP_TYPE_ID,
            BASIC_TYPE_ID,
            abi.encode()
        );

        tileCapturingSystem = ITileCapturingSystem(tileCapturingSystemAddress);
        emit TileCapturingSystemCreated(tileCapturingSystemAddress);
    }

    /// @inheritdoc IEra
    function activateRegion(uint64 regionId) public override {
        IWorld _world = world();

        if (address(regions[regionId]) != address(0)) revert EraCannotActivateRegionMoreThanOnce();
        if (!_world.geography().isRegionIncluded(regionId)) revert EraCannotActivateNotIncludedRegion();

        //1. create region
        address regionAddress = worldAssetFactory().create(
            address(_world),
            eraNumber(),
            REGION_GROUP_TYPE_ID,
            BASIC_TYPE_ID,
            abi.encode(regionId)
        );

        IRegion region = IRegion(regionAddress);
        regions[regionId] = region;
        emit RegionActivated(regionAddress, regionId);

        //2. creates region cultists settlement
        region.createCultistsSettlement(regionId);
    }

    /// @inheritdoc IEra
    function restoreUserSettlement(
        uint64 position
    ) public override onlyActiveGame {
        IWorld _world = world();

        if (eraNumber() != _world.currentEraNumber()) revert UserSettlementCannotBeRestoredFromInactiveEra();

        ICrossErasMemory crossErasMemory = _world.crossErasMemory();

        ISettlement settlement = crossErasMemory.settlementByPosition(position);
        if (settlement.isRottenSettlement()) revert UserSettlementCannotBeRestoredIfItsRotten();

        uint256 bannerIdByPosition = settlement.bannerId();

        (uint64 regionId, bool isPositionExist) = _world.geography().getRegionIdByPosition(position);

        address settlementAddress = this.createSettlementByType(
            bannerIdByPosition,
            position,
            regionId,
            BASIC_TYPE_ID
        );

        _addUserSettlement(crossErasMemory, settlementAddress, false);

        emit SettlementRestored(settlementAddress, position);
    }

    /// @inheritdoc IEra
    function createUserSettlement(
        uint64 position,
        uint64 regionId,
        uint256 bannerId
    ) public override onlyWorldAssetFromSameEra returns (address) {
        IWorld _world = world();
        IGeography geography = _world.geography();
        ICrossErasMemory crossErasMemory = _world.crossErasMemory();

        if (address(crossErasMemory.settlementByPosition(position)) != address(0)) revert UserSettlementCannotBeCreatedOnPositionWithAnotherSettlement();
        if (_hasSettlementInRadius(geography, crossErasMemory, position, 2)) revert UserSettlementCannotBeCreatedOnPositionWhichIsToCloseToAnotherSettlement();
        if (address(crossErasMemory.settlementByBannerId(bannerId)) != address(0)) revert UserSettlementCannotBeCreatedIfBannerNftIdIsAlreadyTakenByAnotherSettlement();
        if (eraNumber() != _world.currentEraNumber()) revert UserSettlementCannotBeCreatedInInactiveEra();
        if (crossErasMemory.regionUserSettlementsCount(regionId) == Config.maxSettlementsPerRegion) revert UserSettlementCannotBeCreatedInRegionWithMaximumAllowedSettlements();
        if (!_hasSettlementInRingRadius(geography, crossErasMemory, position, 3)) revert UserSettlementCannotBeCreatedOnPositionWhichIsNotConnectedToAnotherSettlement();

        address settlementAddress = this.createSettlementByType(
            bannerId,
            position,
            regionId,
            BASIC_TYPE_ID
        );

        _addUserSettlement(crossErasMemory, settlementAddress, true);

        return settlementAddress;
    }

    /// @inheritdoc IEra
    function createSettlementByType(
        uint256 bannerId,
        uint64 position,
        uint64 regionId,
        bytes32 assetTypeId
    ) public override onlyWorldAssetFromSameEra returns (address) {
        IWorld _world = world();

        address regionAddress = address(regions[regionId]);

        address settlementAddress = worldAssetFactory().create(
            address(_world),
            eraNumber(),
            SETTLEMENT_GROUP_TYPE_ID,
            assetTypeId,
            abi.encode(bannerId, regionAddress, position)
        );

        ICrossErasMemory crossErasMemory = _world.crossErasMemory();
        _placeSettlementOnMap(crossErasMemory, settlementAddress);

        tileCapturingSystem.handleSettlementCreatedOnPosition(position);

        emit SettlementCreated(settlementAddress, assetTypeId, regionAddress, position, bannerId);

        return settlementAddress;
    }

    /// @inheritdoc IEra
    function increaseTotalCultists(
        uint256 value
    ) public override onlyWorldAssetFromSameEra {
        totalCultists += value;
        emit TotalCultistsChanged(totalCultists);
    }

    /// @inheritdoc IEra
    function decreaseTotalCultists(
        uint256 value
    ) public override onlyWorldAssetFromSameEra {
        totalCultists -= value;
        emit TotalCultistsChanged(totalCultists);
    }

    /// @dev Calculates does any settlement exists in provided radius
    function _hasSettlementInRadius(
        IGeography geography,
        ICrossErasMemory crossErasMemory,
        uint64 position,
        uint256 radius
    ) internal view returns (bool) {
        for (uint256 i = 1; i <= radius; i++) {
            if (_hasSettlementInRingRadius(geography, crossErasMemory, position, i)) {
                return true;
            }
        }

        return false;
    }

    /// @dev Calculates does any settlement exists in provided ring radius
    function _hasSettlementInRingRadius(
        IGeography geography,
        ICrossErasMemory crossErasMemory,
        uint64 position,
        uint256 radius
    ) internal view returns (bool) {
        (uint64[] memory ringPositions, uint256 ringPositionsLength) = geography.getRingPositions(position, radius);
        for (uint256 i = 0; i < ringPositionsLength; i++) {
            if (address(crossErasMemory.settlementByPosition(ringPositions[i])) != address(0)) {
                return true;
            }
        }

        return false;
    }

    /// @dev Adds user settlement
    function _addUserSettlement(
        ICrossErasMemory crossErasMemory,
        address settlementAddress,
        bool isNewSettlement
    ) internal {
        ISettlement settlement = ISettlement(settlementAddress);

        uint256 bannerId = settlement.bannerId();
        uint64 regionId = settlement.relatedRegion().regionId();

        settlementByBannerId[bannerId] = settlement;
        crossErasMemory.addUserSettlement(
            bannerId,
            regionId,
            settlementAddress,
            isNewSettlement
        );
    }

    /// @dev Places settlement on map
    function _placeSettlementOnMap(
        ICrossErasMemory crossErasMemory,
        address settlementAddress
    ) internal {
        ISettlement settlement = ISettlement(settlementAddress);
        uint64 position = settlement.position();

        settlementByPosition[position] = settlement;
        world().crossErasMemory().placeSettlementOnMap(position, settlementAddress);
    }
}
