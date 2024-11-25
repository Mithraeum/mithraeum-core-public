// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "./IRegion.sol";
import "../unitsPool/IUnitsPool.sol";
import "../../../libraries/MathExtension.sol";
import "../WorldAsset.sol";
import "../../../const/GameAssetTypes.sol";

contract Region is WorldAsset, IRegion {
    /// @inheritdoc IRegion
    IWorkersPool public override workersPool;
    /// @inheritdoc IRegion
    mapping(bytes32 => IUnitsPool) public override unitsPools;
    /// @inheritdoc IRegion
    ISettlementsMarket public override settlementsMarket;
    /// @inheritdoc IRegion
    ISettlement public override cultistsSettlement;
    /// @inheritdoc IRegion
    uint256 public override lastCultistsSummonIntervalNumber;
    /// @inheritdoc IRegion
    int256 public override corruptionIndex;
    /// @inheritdoc IRegion
    uint64 public override regionId;
    /// @inheritdoc IRegion
    uint256 public override lastUpdateTime;
    /// @inheritdoc IRegion
    uint256 public override lastUpdateRegionTime;

    /// @dev Only era units modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyEraUnits() {
        _onlyEraUnits();
        _;
    }

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {
        (
            uint64 _regionId
        ) = abi.decode(initParams, (uint64));

        regionId = _regionId;
        lastUpdateTime = block.timestamp;
        lastUpdateRegionTime = getRegionTime(block.timestamp);

        IWorld _world = world();
        uint256 _eraNumber = eraNumber();
        IWorldAssetFactory factory = worldAssetFactory();

        // 1. create workers pool
        address workersPoolAddress = factory.create(
            address(_world),
            _eraNumber,
            WORKERS_POOL_GROUP_TYPE_ID,
            BASIC_TYPE_ID,
            abi.encode(address(this))
        );

        workersPool = IWorkersPool(workersPoolAddress);
        emit WorkersPoolCreated(workersPoolAddress);

        // 2. create settlements market
        address settlementsMarketAddress = factory.create(
            address(_world),
            _eraNumber,
            SETTLEMENT_MARKET_GROUP_TYPE_ID,
            BASIC_TYPE_ID,
            abi.encode(address(this))
        );

        settlementsMarket = ISettlementsMarket(settlementsMarketAddress);
        emit SettlementsMarketCreated(settlementsMarketAddress);

        // 3. create units pool
        bytes32[] memory unitTypeIds = Config.getUnitTypeIds();

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            bytes32 unitTypeId = unitTypeIds[i];

            address unitsPoolAddress = factory.create(
                address(_world),
                _eraNumber,
                UNITS_POOL_GROUP_TYPE_ID,
                Config.getUnitPoolType(unitTypeId),
                abi.encode(address(this), unitTypeId)
            );

            unitsPools[unitTypeId] = IUnitsPool(unitsPoolAddress);
            emit UnitsPoolCreated(unitsPoolAddress, unitTypeId);
        }
    }

    /// @inheritdoc IRegion
    function getRegionTime(uint256 timestamp) public override view returns (uint256) {
        if (timestamp == 0) {
            timestamp = block.timestamp;
        }

        IWorld _world = world();
        uint256 gameBeginTime = _world.gameBeginTime();
        if (timestamp < gameBeginTime) {
            timestamp = gameBeginTime;
        }

        uint256 gameEndTime = _world.gameEndTime();
        if (gameEndTime != 0 && timestamp > gameEndTime) {
            timestamp = gameEndTime;
        }

        uint256 _lastUpdateTime = lastUpdateTime;
        uint256 _lastUpdateRegionTime = lastUpdateRegionTime;
        if (_lastUpdateTime < gameBeginTime) {
            _lastUpdateTime = gameBeginTime;
            _lastUpdateRegionTime = 0;
        }

        if (timestamp <= _lastUpdateTime) {
            return _lastUpdateRegionTime;
        }

        uint256 timeDelta = timestamp - _lastUpdateTime;
        uint256 penalty = getPenaltyFromCultists();

        return _lastUpdateRegionTime + (timeDelta * (1e18 - penalty));
    }

    /// @inheritdoc IRegion
    function updateState() public override {
        _tryToEndCultistsBattle();
        _tryToSummonCultists();
    }

    /// @inheritdoc IRegion
    function updateRegionTime(uint256 globalTime) public override onlyWorldAssetFromSameEra {
        if (lastUpdateTime == globalTime) {
            return;
        }

        lastUpdateRegionTime = getRegionTime(globalTime);
        lastUpdateTime = globalTime;
        emit RegionTimeChanged(lastUpdateTime, lastUpdateRegionTime);
    }

    /// @inheritdoc IRegion
    function createCultistsSettlement(
        uint64 cultistsPosition
    ) public override onlyWorldAssetFromSameEra {
        address cultistsSettlementAddress = era().createSettlementByType(
            0,
            regionId,
            cultistsPosition,
            CULTISTS_SETTLEMENT_TYPE_ID
        );

        cultistsSettlement = ISettlement(cultistsSettlementAddress);

        uint256 _regionTier = world().geography().getRegionTier(regionId);
        uint256 initialCultistsAmount = Config.getInitialCultistsAmountByRegionTier(_regionTier);
        _summonCultists(initialCultistsAmount, _getCurrentCultistsSummonIntervalNumber());

        uint256 initialCorruptionIndexAmount = initialCultistsAmount * Config.initialCorruptionIndexPerCultistMultiplier;
        _increaseCorruptionIndex(address(0), initialCorruptionIndexAmount);
    }

    /// @inheritdoc IRegion
    function buyUnitsBatch(
        address resourcesOwner,
        address settlementAddress,
        bytes32[] memory unitTypeIds,
        uint256[] memory unitsAmounts,
        uint256[] memory maxTokensToSell
    ) public override {
        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            unitsPools[unitTypeIds[i]].swapTokensForExactUnitsByRegion(
                resourcesOwner,
                msg.sender,
                settlementAddress,
                unitsAmounts[i],
                maxTokensToSell[i]
            );
        }
    }

    /// @inheritdoc IRegion
    function increaseCorruptionIndex(
        address settlementAddress,
        uint256 value
    ) public override onlyWorldAssetFromSameEra {
        updateState();

        _increaseCorruptionIndex(
            settlementAddress,
            value
        );
    }

    /// @inheritdoc IRegion
    function decreaseCorruptionIndex(
        address settlementAddress,
        uint256 value
    ) public override onlyWorldAssetFromSameEra {
        updateState();

        _decreaseCorruptionIndex(
            settlementAddress,
            value
        );
    }

    /// @inheritdoc IRegion
    function handleCultistsSummoned(
        uint256 value
    ) public override onlyEraUnits {
        era().increaseTotalCultists(value);
        emit RegionCultistsChanged(_getCurrentCultistsAmount());
    }

    /// @inheritdoc IRegion
    function handleCultistsDefeated(
        uint256 value
    ) public override onlyEraUnits {
        era().decreaseTotalCultists(value);
        emit RegionCultistsChanged(_getCurrentCultistsAmount());
    }

    /// @inheritdoc IRegion
    function getPenaltyFromCultists() public view returns (uint256) {
        uint256 cultistsAmount = _getCurrentCultistsAmount();
        uint256 penalty = cultistsAmount * 1e18 / Config.maxCultistsPerRegion;

        if (penalty > 1e18) {
            return 1e18;
        }

        return penalty;
    }

    /// @dev Allows caller to be only current era's units
    function _onlyEraUnits() internal view {
        bytes32 unitTypeId = IUnits(msg.sender).unitTypeId();
        if (address(era().units(unitTypeId)) != msg.sender) revert OnlyEraUnits();
    }

    /// @dev Tries to end cultists battle (if battle exist)
    function _tryToEndCultistsBattle() internal {
        IBattle cultistsBattle = cultistsSettlement.army().battle();
        if (address(cultistsBattle) != address(0) && !cultistsBattle.isEndedBattle() && cultistsBattle.canEndBattle()) {
            cultistsBattle.endBattle();
        }
    }

    /// @dev Tries to summons cultists (if conditions are met)
    function _tryToSummonCultists() internal {
        // Cultists are not summoned in inactive era
        if (eraNumber() != world().currentEraNumber()) {
            return;
        }

        uint256 cultistsSummonIntervalNumberOfCurrenTime = _getCurrentCultistsSummonIntervalNumber();
        if (lastCultistsSummonIntervalNumber >= cultistsSummonIntervalNumberOfCurrenTime) {
            return;
        }

        uint256 _absCorruptionIndex = corruptionIndex > 0
            ? uint256(corruptionIndex)
            : 0;

        uint256 cultistsToSummon = 0;
        if (_absCorruptionIndex > 0) {
            uint256 currentCultistsAmount = _getCurrentCultistsAmount();

            cultistsToSummon = currentCultistsAmount / 6 > _absCorruptionIndex / 30
                ? 0
                : Math.min(
                    MathExtension.roundDownWithPrecision(_absCorruptionIndex / 30 - currentCultistsAmount / 6, 1e18),
                    Config.maxCultistsPerRegion - currentCultistsAmount
                );
        }

        _summonCultists(cultistsToSummon, cultistsSummonIntervalNumberOfCurrenTime);
    }

    /// @dev Summons cultists with saving last time cultists were summoned
    function _summonCultists(uint256 cultistsAmountToSummon, uint256 cultistsSummonIntervalNumber) internal {
        era().units(Config.cultistUnitTypeId).mint(
            address(cultistsSettlement.army()),
            cultistsAmountToSummon
        );

        lastCultistsSummonIntervalNumber = cultistsSummonIntervalNumber;
        emit LastCultistsSummonIntervalNumberUpdated(cultistsSummonIntervalNumber);
    }

    /// @dev Calculates cultists summon interval number of current time
    function _getCurrentCultistsSummonIntervalNumber() internal view returns (uint256) {
        uint256 _epochCreationTime = Math.max(era().creationTime(), world().gameBeginTime());
        return block.timestamp > _epochCreationTime
            ? (block.timestamp - _epochCreationTime) / (Config.cultistsSummonDelay / Config.globalMultiplier)
            : 0;
    }

    /// @dev Calculates current cultists amount
    function _getCurrentCultistsAmount() internal view returns (uint256) {
        return era().units(Config.cultistUnitTypeId).balanceOf(address(cultistsSettlement.army()));
    }

    /// @dev Increases corruptionIndex
    function _increaseCorruptionIndex(
        address settlementAddress,
        uint256 corruptionIndexAmount
    ) internal {
        // If action is happening in old era, it does not affect corruptionIndex
        if (eraNumber() != world().currentEraNumber()) {
            return;
        }

        corruptionIndex += int256(corruptionIndexAmount);
        emit CorruptionIndexIncreased(settlementAddress, corruptionIndexAmount);

        if (settlementAddress != address(0)) {
            ISettlement(settlementAddress).increaseProducedCorruptionIndex(corruptionIndexAmount);
        }
    }

    /// @dev Decreases corruptionIndex
    function _decreaseCorruptionIndex(
        address settlementAddress,
        uint256 corruptionIndexAmount
    ) internal {
        // If action is happening in old era, it does not affect corruptionIndex
        if (eraNumber() != world().currentEraNumber()) {
            return;
        }

        corruptionIndex -= int256(corruptionIndexAmount);
        emit CorruptionIndexDecreased(settlementAddress, corruptionIndexAmount);

        if (settlementAddress != address(0)) {
            ISettlement(settlementAddress).decreaseProducedCorruptionIndex(corruptionIndexAmount);
        }
    }
}
