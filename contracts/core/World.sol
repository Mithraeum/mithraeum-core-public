// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "./IRegistry.sol";
import "./IWorld.sol";
import "./assets/building/IBuilding.sol";
import "./crossErasMemory/ICrossErasMemory.sol";
import "../const/GameAssetTypes.sol";

contract World is IWorld, Initializable {
    /// @inheritdoc IWorld
    IRegistry public override registry;
    /// @inheritdoc IWorld
    IGeography public override geography;
    /// @inheritdoc IWorld
    IERC721 public override bannerContract;
    /// @inheritdoc IWorld
    IERC20 public override erc20ForSettlementPurchase;
    /// @inheritdoc IWorld
    IERC20 public override erc20ForRegionInclusion;
    /// @inheritdoc IWorld
    IRegionOwnershipToken public override regionOwnershipToken;
    /// @inheritdoc IWorld
    IDistributions public override distributions;
    /// @inheritdoc IWorld
    ICrossErasMemory public override crossErasMemory;
    /// @inheritdoc IWorld
    IRewardPool public override rewardPool;

    /// @inheritdoc IWorld
    uint256 public override gameBeginTime;
    /// @inheritdoc IWorld
    uint256 public override gameEndTime;

    /// @inheritdoc IWorld
    uint256 public override currentEraNumber;
    /// @inheritdoc IWorld
    mapping(uint256 => IEra) public override eras;

    /// @inheritdoc IWorld
    mapping(bytes28 => address) public override implementations;
    /// @inheritdoc IWorld
    mapping(uint256 => mapping(address => bytes32)) public override worldAssets;

    /// @dev Only active game modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyActiveGame() {
        _onlyActiveGame();
        _;
    }

    /// @dev Only mighty creator or reward pool modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyMightyCreatorOrRewardPool() {
        _onlyMightyCreatorOrRewardPool();
        _;
    }

    /// @dev Only mighty creator modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyMightyCreator() {
        _onlyMightyCreator();
        _;
    }

    /// @dev Only factory modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyFactory() {
        _onlyFactory();
        _;
    }

    /// @inheritdoc IWorld
    function init(
        bytes calldata packedAddresses,
        bytes28[] calldata assetIds,
        address[] calldata implementationAddresses
    ) public override initializer {
        (
            address registryContractAddress,
            address crossErasMemoryAddress,
            address geographyAddress,
            address bannersAddress,
            address erc20ForSettlementPurchaseAddress,
            address erc20ForRegionInclusionAddress,
            address regionOwnershipTokenAddress,
            address distributionsAddress,
            address rewardPoolAddress
        ) = abi.decode(
            packedAddresses,
            (address, address, address, address, address, address, address, address, address)
        );

        registry = IRegistry(registryContractAddress);
        crossErasMemory = ICrossErasMemory(crossErasMemoryAddress);
        geography = IGeography(geographyAddress);
        bannerContract = IERC721(bannersAddress);
        erc20ForSettlementPurchase = IERC20(erc20ForSettlementPurchaseAddress);
        erc20ForRegionInclusion = IERC20(erc20ForRegionInclusionAddress);
        regionOwnershipToken = IRegionOwnershipToken(regionOwnershipTokenAddress);
        distributions = IDistributions(distributionsAddress);
        rewardPool = IRewardPool(rewardPoolAddress);

        setImplementations(assetIds, implementationAddresses);

        emit WorldInitialized(
            registryContractAddress,
            crossErasMemoryAddress,
            geographyAddress,
            bannersAddress,
            erc20ForSettlementPurchaseAddress,
            erc20ForRegionInclusionAddress,
            regionOwnershipTokenAddress,
            distributionsAddress,
            rewardPoolAddress
        );

        _createAndAssignEra(currentEraNumber);
    }

    /// @inheritdoc IWorld
    function addWorldAsset(
        uint256 eraNumber,
        address worldAsset,
        bytes32 assetType
    ) public override onlyFactory {
        worldAssets[eraNumber][worldAsset] = assetType;
    }

    /// @inheritdoc IWorld
    function setImplementations(
        bytes28[] calldata assetIds,
        address[] calldata implementationAddresses
    ) public override onlyMightyCreator {
        for (uint256 i = 0; i < assetIds.length; i++) {
            implementations[assetIds[i]] = implementationAddresses[i];
        }
    }

    /// @inheritdoc IWorld
    function setGameBeginTime(uint256 value) public override onlyMightyCreator {
        gameBeginTime = value;
        emit GameBeginTimeUpdated(value);
    }

    /// @inheritdoc IWorld
    function setGameEndTime(uint256 value) public override onlyMightyCreatorOrRewardPool {
        gameEndTime = value;
        emit GameEndTimeUpdated(value);
    }

    /// @inheritdoc IWorld
    function mintWorkers(
        uint256 eraNumber,
        address _to,
        uint256 _value
    ) public override onlyMightyCreator {
        eras[eraNumber].workers().mint(_to, _value);
    }

    /// @inheritdoc IWorld
    function mintUnits(
        uint256 eraNumber,
        bytes32 unitTypeId,
        address to,
        uint256 value
    ) public override onlyMightyCreator {
        eras[eraNumber].units(unitTypeId).mint(to, value);
    }

    /// @inheritdoc IWorld
    function mintResources(
        uint256 eraNumber,
        bytes32 resourceTypeId,
        address to,
        uint256 value
    ) public override onlyMightyCreator {
        eras[eraNumber].resources(resourceTypeId).mint(to, value);
    }

    /// @inheritdoc IWorld
    function destroyCurrentEra() public override onlyActiveGame {
        IEra currentEra = eras[currentEraNumber];

        uint256 _globalMultiplier = Config.globalMultiplier;
        uint256 _summonDelay = Config.cultistsSummonDelay / _globalMultiplier;
        uint256 _noDestructionDelay = Config.cultistsNoDestructionDelay / _globalMultiplier;

        uint256 _epochCreationTime = Math.max(currentEra.creationTime(), gameBeginTime);
        if (block.timestamp <= _epochCreationTime) revert CurrentEraCannotBeDestroyedDueToCultistsNoDestructionDelayNotPassed();

        uint256 _timePassedSinceEpochCreationTime = block.timestamp - _epochCreationTime;
        uint256 _timeInsideCurrentSummonInterval = _timePassedSinceEpochCreationTime % _summonDelay;
        if (_timeInsideCurrentSummonInterval <= _noDestructionDelay) revert CurrentEraCannotBeDestroyedDueToCultistsNoDestructionDelayNotPassed();

        uint256 maxAllowedCultists = geography.getRegionsCount() * Config.cultistsPerRegionMultiplier;
        if (currentEra.totalCultists() <= maxAllowedCultists) revert CurrentEraCannotBeDestroyedDueCultistsLimitNotReached();

        uint256 newEraNumber = currentEraNumber + 1;
        _createAndAssignEra(newEraNumber);
    }

    /// @inheritdoc IWorld
    function getRegionRadius() public pure override returns (uint64) {
        return 15;
    }

    /// @inheritdoc IWorld
    function getRegionSeed() public pure override returns (bytes32) {
        return bytes32(0);
    }

    /// @inheritdoc IWorld
    function getTileBonusesSeed() public pure override returns (bytes32) {
        return bytes32(0);
    }

    /// @inheritdoc IWorld
    function getRegionTierSeed() public view override returns (bytes32) {
        return keccak256(abi.encodePacked(address(this), currentEraNumber));
    }

    /// @dev Allows function to be callable only while game is active (block.timestamp in [beginTime, endTime) or [beginTime, inf)
    function _onlyActiveGame() internal view {
        uint256 _gameBeginTime = gameBeginTime;
        uint256 _gameEndTime = gameEndTime;
        if (_gameBeginTime == 0 || block.timestamp < _gameBeginTime) revert OnlyActiveGame();
        if (_gameEndTime != 0 && block.timestamp >= _gameEndTime) revert OnlyActiveGame();
    }

    /// @dev Allows caller to be only mighty creator or reward pool
    function _onlyMightyCreatorOrRewardPool() internal view {
        if (msg.sender != registry.mightyCreator() && msg.sender != address(rewardPool)) revert OnlyMightyCreatorOrRewardPool();
    }

    /// @dev Allows caller to be only mighty creator
    function _onlyMightyCreator() internal view {
        if (msg.sender != registry.mightyCreator()) revert OnlyMightyCreator();
    }

    /// @dev Allows caller to be only factory contract
    function _onlyFactory() internal view {
        if (msg.sender != address(registry.worldAssetFactory())) revert OnlyFactory();
    }

    /// @dev Creates era
    function _createEra(uint256 eraNumber) internal returns (IEra) {
        return IEra(
            registry.worldAssetFactory().create(
                address(this),
                eraNumber,
                ERA_GROUP_TYPE_ID,
                BASIC_TYPE_ID,
                abi.encode(eraNumber)
            )
        );
    }

    /// @dev Create and assign era
    function _createAndAssignEra(uint256 eraNumber) internal {
        IEra newEra = _createEra(eraNumber);

        eras[eraNumber] = newEra;
        emit EraCreated(address(newEra), eraNumber);

        _setCurrentEraNumber(eraNumber);
    }

    /// @dev Sets current era number
    function _setCurrentEraNumber(uint256 newEraNumber) internal {
        currentEraNumber = newEraNumber;
        emit CurrentEraNumberUpdated(newEraNumber);
    }
}
