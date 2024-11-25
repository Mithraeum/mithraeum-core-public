// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./ICrossErasMemory.sol";
import "../WorldInitializable.sol";
import "../assets/IWorldAssetStorageAccessor.sol";

contract CrossErasMemory is ICrossErasMemory, WorldInitializable  {
    /// @inheritdoc ICrossErasMemory
    mapping(uint64 => ISettlement) public override settlementByPosition;
    /// @inheritdoc ICrossErasMemory
    mapping(uint256 => ISettlement) public override settlementByBannerId;
    /// @inheritdoc ICrossErasMemory
    mapping(uint64 => uint256) public override regionUserSettlementsCount;
    /// @inheritdoc ICrossErasMemory
    mapping(uint64 => uint256) public override regionSettlementPrice;
    /// @inheritdoc ICrossErasMemory
    mapping(uint64 => uint256) public override regionSettlementPriceUpdateTime;

    /// @dev Only active era modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyActiveEra() {
        _onlyActiveEra();
        _;
    }

    /// @dev Only world asset from old era modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyWorldAssetFromOldEra() {
        _onlyWorldAssetFromOldEra();
        _;
    }

    /// @dev Only world asset from active era modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyWorldAssetFromActiveEra() {
        _onlyWorldAssetFromActiveEra();
        _;
    }

    /// @inheritdoc ICrossErasMemory
    function init(address worldAddress) public override initializer {
        setWorld(worldAddress);
    }

    /// @inheritdoc ICrossErasMemory
    function addUserSettlement(
        uint256 bannerId,
        uint64 regionId,
        address settlementAddress,
        bool isNewSettlement
    ) public onlyActiveEra {
        settlementByBannerId[bannerId] = ISettlement(settlementAddress);
        emit SettlementByBannerIdUpdated(bannerId, settlementAddress);

        if (isNewSettlement) {
            regionUserSettlementsCount[regionId]++;
        }
    }

    /// @inheritdoc ICrossErasMemory
    function placeSettlementOnMap(
        uint64 position,
        address settlementAddress
    ) public onlyActiveEra {
        settlementByPosition[position] = ISettlement(settlementAddress);
        emit SettlementOnPositionUpdated(position, settlementAddress);
    }

    /// @inheritdoc ICrossErasMemory
    function changeRegionSettlementPrice(
        uint64 regionId,
        uint256 settlementPrice,
        uint256 lastUpdateTime
    ) public onlyWorldAssetFromActiveEra {
        regionSettlementPrice[regionId] = settlementPrice;
        regionSettlementPriceUpdateTime[regionId] = lastUpdateTime;
    }

    /// @inheritdoc ICrossErasMemory
    function removeUserSettlement(address settlementAddress) public override onlyWorldAssetFromOldEra {
        ISettlement settlement = ISettlement(settlementAddress);
        uint64 position = settlement.position();
        uint64 regionId = settlement.relatedRegion().regionId();
        uint256 bannerId = settlement.bannerId();

        settlementByPosition[position] = ISettlement(address(0));
        emit SettlementOnPositionUpdated(position, address(0));

        settlementByBannerId[bannerId] = ISettlement(address(0));
        emit SettlementByBannerIdUpdated(bannerId, address(0));

        regionUserSettlementsCount[regionId]--;
    }

    /// @dev Allows caller to be only active world era
    function _onlyActiveEra() internal view {
        IWorld _world = world;

        if (msg.sender != address(_world.eras(_world.currentEraNumber()))) revert OnlyActiveEra();
    }

    /// @dev Allows caller to be only world asset from its era
    function _onlyWorldAssetFromOldEra() internal view {
        IWorld _world = world;

        uint256 eraNumberOfPotentialWorldAsset = IWorldAssetStorageAccessor(msg.sender).eraNumber();
        if (eraNumberOfPotentialWorldAsset >= _world.currentEraNumber() ||
            _world.worldAssets(eraNumberOfPotentialWorldAsset, msg.sender) == bytes32(0)) revert OnlyWorldAssetFromOldEra();
    }

    /// @dev Allows caller to be only active world era
    function _onlyWorldAssetFromActiveEra() internal view {
        IWorld _world = world;

        if (_world.worldAssets(_world.currentEraNumber(), msg.sender) == bytes32(0)) revert OnlyWorldAssetFromActiveEra();
    }
}
