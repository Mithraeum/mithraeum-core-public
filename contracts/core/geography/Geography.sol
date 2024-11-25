// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./IGeography.sol";
import "../../libraries/GeographyUtils.sol";
import "../WorldInitializable.sol";
import "../../periphery/ProxyReentrancyGuard.sol";

contract Geography is IGeography, WorldInitializable, ProxyReentrancyGuard {
    /// @notice Mapping containing region id to its inclusion order
    /// @dev Values are stored each time region is included and used in #isRegionIncluded
    mapping(uint64 => uint256) private includedRegions;

    /// @notice Mapping containing region id to its tier
    /// @dev Values are stored each time region is included and used in #getRegionTier in order to persists tiers between eras
    mapping(uint64 => uint256) private regionTiers;

    /// @notice Amount of included regions
    /// @dev Value is accessible via #getRegionsCount
    uint64 private regionsCount;

    /// @inheritdoc IGeography
    function init(address worldAddress) public override initializer {
        setWorld(worldAddress);
    }

    /// @inheritdoc IGeography
    function getRegionOwner(uint64 regionId) public view override returns (address) {
        return world.regionOwnershipToken().ownerOf(regionId);
    }

    /// @inheritdoc IGeography
    function getRegionTier(uint64 regionId) public view override returns (uint256) {
        uint256 savedRegionTier = regionTiers[regionId];
        if (savedRegionTier != 0) {
            return savedRegionTier;
        }

        return _generateRegionTier(regionId);
    }

    /// @inheritdoc IGeography
    function getRegionsCount() public view override returns (uint256) {
        return regionsCount;
    }

    /// @inheritdoc IGeography
    function includeRegion(
        uint64 newRegionPosition,
        uint64 neighborRegionPosition
    ) public payable override nonReentrant {
        IWorld _world = world;
        address mightyCreator = _world.registry().mightyCreator();

        if (regionsCount == 0 && msg.sender != mightyCreator) {
            revert FirstRegionCanOnlyBeIncludedByMightyCreator();
        }

        (uint64 newRegionId, bool isNewRegionPositionExist) = getRegionIdByPosition(newRegionPosition);

        if (!isNewRegionPositionExist) revert CannotIncludeRegionWithInvalidRegionInclusionProofProvided();
        if (isRegionIncluded(newRegionId)) revert CannotIncludeAlreadyIncludedRegion();

        if (regionsCount > 0) {
            (uint64 neighborRegionId, bool isNeighborRegionPositionExist) = getRegionIdByPosition(neighborRegionPosition);

            if (!isNeighborRegionPositionExist) revert CannotIncludeRegionWithInvalidRegionInclusionProofProvided();
            if (!isRegionIncluded(neighborRegionId)) revert CannotIncludeRegionWithInvalidRegionInclusionProofProvided();
            if (!_areNeighbors(newRegionPosition, neighborRegionPosition)) revert CannotIncludeRegionWithInvalidRegionInclusionProofProvided();

            if (msg.sender != mightyCreator) {
                if (_world.crossErasMemory().regionUserSettlementsCount(neighborRegionId) < Config.minimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion) revert CannotIncludeRegionDueToInsufficientUserSettlementsCountInNeighboringRegion();
            }
        }

        if (regionsCount > 0) {
            uint256 regionTier = _generateRegionTier(newRegionId);
            regionTiers[newRegionId] = regionTier;

            uint256 regionInclusionPrice = Config.getRegionInclusionPrice(regionTier);

            IERC20 erc20ForRegionInclusion = _world.erc20ForRegionInclusion();
            if (address(erc20ForRegionInclusion) == address(0)) {
                if (msg.value < regionInclusionPrice) revert CannotIncludeRegionDueToInsufficientValueSent();

                uint256 valueToSendBack = msg.value > regionInclusionPrice ? msg.value - regionInclusionPrice : 0;
                if (valueToSendBack > 0) {
                    Address.sendValue(payable(msg.sender), valueToSendBack);
                }

                Address.sendValue(payable(mightyCreator), regionInclusionPrice);
            } else {
                SafeERC20.safeTransferFrom(
                    erc20ForRegionInclusion,
                    msg.sender,
                    mightyCreator,
                    regionInclusionPrice
                );
            }
        } else {
            regionTiers[newRegionId] = Config.maxRegionTier;
        }

        regionsCount++;
        includedRegions[newRegionId] = regionsCount;
        _world.regionOwnershipToken().mint(msg.sender, newRegionId);

        emit RegionIncluded(newRegionId);
    }

    /// @inheritdoc IGeography
    function isRegionIncluded(uint64 regionId) public view override returns (bool) {
        return includedRegions[regionId] != 0;
    }

    /// @inheritdoc IGeography
    function getTileBonus(
        bytes32 tileBonusesSeed,
        uint256 chanceForTileWithBonus,
        uint64 position
    ) public pure override returns (TileBonus memory) {
        bytes32 randomHash = keccak256(abi.encodePacked(position, tileBonusesSeed));
        uint256 randomValue = uint256(randomHash) % 1e18;
        if (randomValue > chanceForTileWithBonus) {
            return TileBonus(TileBonusType.NO_BONUS, 0);
        }

        randomValue = uint256(keccak256(abi.encodePacked(randomHash))) % 1e18;

        // Advanced production (extra workers)
        // 0.67e18 total weight
        uint256[] memory advancedProductionBonusVariationWeights = new uint256[](10);
        advancedProductionBonusVariationWeights[0] = 0.1e18;
        advancedProductionBonusVariationWeights[1] = 0.07e18;
        advancedProductionBonusVariationWeights[2] = 0.09e18;
        advancedProductionBonusVariationWeights[3] = 0.06e18;
        advancedProductionBonusVariationWeights[4] = 0.07e18;
        advancedProductionBonusVariationWeights[5] = 0.05e18;
        advancedProductionBonusVariationWeights[6] = 0.06e18;
        advancedProductionBonusVariationWeights[7] = 0.05e18;
        advancedProductionBonusVariationWeights[8] = 0.07e18;
        advancedProductionBonusVariationWeights[9] = 0.05e18;

        uint256 currentWeight = 0;
        for (uint8 i = 0; i < advancedProductionBonusVariationWeights.length; i++) {
            uint256 newWeight = currentWeight + advancedProductionBonusVariationWeights[i];
            if (randomValue >= currentWeight && randomValue < newWeight) {
                return TileBonus(TileBonusType.ADVANCED_PRODUCTION, i);
            }

            currentWeight = newWeight;
        }

        // Battle multiplier
        // 0.33e18 total weight
        uint256[] memory battleMultiplierBonusVariationWeights = new uint256[](3);
        battleMultiplierBonusVariationWeights[0] = 0.17e18;
        battleMultiplierBonusVariationWeights[1] = 0.1e18;
        battleMultiplierBonusVariationWeights[2] = 0.06e18;

        for (uint8 i = 0; i < battleMultiplierBonusVariationWeights.length; i++) {
            uint256 newWeight = currentWeight + battleMultiplierBonusVariationWeights[i];
            if (randomValue >= currentWeight && randomValue < newWeight) {
                return TileBonus(TileBonusType.ARMY_BATTLE_STATS, i);
            }

            currentWeight = newWeight;
        }

        revert InvalidTileBonusConfiguration();
    }

    /// @inheritdoc IGeography
    function getRegionIdByPosition(uint64 position) public view override returns (uint64, bool) {
        IWorld _world = world;
        return GeographyUtils.getRegionCenterByPosition(position, _world.getRegionRadius(), _world.getRegionSeed());
    }

    /// @inheritdoc IGeography
    function getRingPositions(uint64 position, uint256 radius) public pure override returns (uint64[] memory, uint256) {
        uint64[] memory ringPositions = new uint64[](radius * 6);

        GeographyUtils.Oddq memory movingPosition = GeographyUtils.positionToOddq(position);

        for (uint256 i = 0; i < radius; i++) {
            movingPosition = _getNeighborPosition(movingPosition, 4);
        }

        uint256 length = 0;
        for (uint256 i = 0; i < 6; i++) {
            for (uint256 j = 0; j < radius; j++) {
                if (_isPositionInBounds(movingPosition)) {
                    ringPositions[length] = GeographyUtils.oddqToPosition(movingPosition);
                    length++;
                }

                movingPosition = _getNeighborPosition(movingPosition, i);
            }
        }

        return (ringPositions, length);
    }

    /// @inheritdoc IGeography
    function getDistanceBetweenPositions(uint64 position1, uint64 position2) public pure override returns (uint64) {
        GeographyUtils.Oddq memory oddq1 = GeographyUtils.positionToOddq(position1);
        GeographyUtils.Oddq memory oddq2 = GeographyUtils.positionToOddq(position2);

        GeographyUtils.Axial memory axial1 = GeographyUtils.oddqToAxial(oddq1);
        GeographyUtils.Axial memory axial2 = GeographyUtils.oddqToAxial(oddq2);

        return GeographyUtils.getDistanceBetweenPositions(axial1, axial2);
    }

    /// @dev Checks if provided position is in game bounds
    function _isPositionInBounds(GeographyUtils.Oddq memory oddq) internal pure returns (bool) {
        return oddq.x >= 0 && oddq.x < int64(uint64(type(uint32).max)) && oddq.y >= 0 && oddq.y < int64(uint64(type(uint32).max));
    }

    /// @dev Calculates neighbor position of position according to provided direction
    function _getNeighborPosition(GeographyUtils.Oddq memory oddq, uint256 direction) internal pure returns (GeographyUtils.Oddq memory) {
        int64 x = oddq.x;
        int64 y = oddq.y;

        bool isEven = (x & 1) == 0;

        if (direction == 0) {
            return GeographyUtils.Oddq(x, y - 1);
        }

        if (direction == 1) {
            if (isEven) {
                return GeographyUtils.Oddq(x + 1, y - 1);
            } else {
                return GeographyUtils.Oddq(x + 1, y);
            }
        }

        if (direction == 2) {
            if (isEven) {
                return GeographyUtils.Oddq(x + 1, y);
            } else {
                return GeographyUtils.Oddq(x + 1, y + 1);
            }
        }

        if (direction == 3) {
            return GeographyUtils.Oddq(x, y + 1);
        }

        if (direction == 4) {
            if (isEven) {
                return GeographyUtils.Oddq(x - 1, y);
            } else {
                return GeographyUtils.Oddq(x - 1, y + 1);
            }
        }

        if (direction == 5) {
            if (isEven) {
                return GeographyUtils.Oddq(x - 1, y - 1);
            } else {
                return GeographyUtils.Oddq(x - 1, y);
            }
        }

        revert InvalidNeighborDirectionSpecified();
    }

    /// @dev Checks if positions are neighbors
    function _areNeighbors(uint64 position1, uint64 position2) internal pure returns (bool) {
        return getDistanceBetweenPositions(position1, position2) == 1;
    }

    /// @dev Generates region tier by region id
    function _generateRegionTier(uint64 regionId) internal view returns (uint256) {
        bytes32 randomHash = keccak256(abi.encodePacked(regionId, world.getRegionTierSeed()));
        uint256 randomValue = uint256(randomHash) % 1e18;
        uint256 regionTier = ((randomValue * (Config.maxRegionTier)) / 1e18) + 1;

        return regionTier;
    }
}
