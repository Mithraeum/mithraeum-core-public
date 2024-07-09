// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "../../../libraries/MathExtension.sol";
import "../region/IRegion.sol";
import "./ISettlement.sol";
import "../building/impl/IFort.sol";
import "../WorldAsset.sol";
import "../../../const/GameAssetTypes.sol";
import "../../../periphery/ProxyReentrancyGuard.sol";

contract Settlement is WorldAsset, ISettlement, ProxyReentrancyGuard {
    /// @inheritdoc ISettlement
    IRegion public override relatedRegion;
    /// @inheritdoc ISettlement
    uint256 public override bannerId;
    /// @inheritdoc ISettlement
    ISiege public override siege;
    /// @inheritdoc ISettlement
    mapping(bytes32 => IBuilding) public override buildings;
    /// @inheritdoc ISettlement
    uint256 public override currentGovernorsGeneration;
    /// @inheritdoc ISettlement
    mapping(uint256 => mapping(address => bool)) public override governors;
    /// @inheritdoc ISettlement
    IArmy public override army;
    /// @inheritdoc ISettlement
    uint256 public override extendedProsperityAmount;
    /// @inheritdoc ISettlement
    uint64 public override position;
    /// @inheritdoc ISettlement
    int256 public override producedCorruptionIndex;

    /// @dev Only settlement owner modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlySettlementOwner() {
        _onlySettlementOwner();
        _;
    }

    /// @dev Only ruler or world asset modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyRulerOrWorldAsset() {
        _onlyRulerOrWorldAsset();
        _;
    }

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {
        (
            uint256 createdWithBannerId,
            address regionAddress,
            uint64 settlementPosition
        ) = abi.decode(initParams, (uint256, address, uint64));

        relatedRegion = IRegion(regionAddress);
        bannerId = createdWithBannerId;
        position = settlementPosition;

        _createBuildings();
        _createArmy();
        _createSiege();
        _mintInitialWorkers();
    }

    /// @inheritdoc ISettlement
    function getSettlementOwner() public view override returns (address) {
        return world().bannerContract().ownerOf(bannerId);
    }

    /// @inheritdoc ISettlement
    function updateProsperityAmount() public override {
        bytes32[] memory buildingTypeIds = registry().getBuildingTypeIds();

        for (uint256 i = 0; i < buildingTypeIds.length; i++) {
            buildings[buildingTypeIds[i]].updateState();
        }
    }

    /// @inheritdoc ISettlement
    function withdrawResources(
        bytes32 resourceTypeId,
        address to,
        uint256 amount
    ) public override onlyRulerOrWorldAsset {
        era().resources(resourceTypeId).transfer(to, amount);
    }

    /// @inheritdoc ISettlement
    function assignResourcesAndWorkersToBuilding(
        address resourcesOwner,
        address buildingAddress,
        uint256 workersAmount,
        bytes32[] memory resourceTypeIds,
        uint256[] memory resourcesAmounts
    ) public override onlyActiveGame onlyRulerOrWorldAsset {
        if (workersAmount > 0) {
            _transferWorkers(buildingAddress, workersAmount);
        }

        for (uint256 i = 0; i < resourceTypeIds.length; i++) {
            IResource resource = era().resources(resourceTypeIds[i]);

            if (resourcesOwner == address(0)) {
                resource.transferFrom(msg.sender, buildingAddress, resourcesAmounts[i]);
            } else {
                resource.spendAllowance(resourcesOwner, msg.sender, resourcesAmounts[i]);
                resource.transferFrom(resourcesOwner, buildingAddress, resourcesAmounts[i]);
            }
        }
    }

    /// @inheritdoc ISettlement
    function updateFortHealth() public override {
        buildings[FORT_TYPE_ID].updateState();
    }

    /// @inheritdoc ISettlement
    function addGovernor(address governorAddress) public override onlyActiveGame {
        if (msg.sender != getSettlementOwner() && !governors[currentGovernorsGeneration][msg.sender]) revert GovernorCannotBeAddedIfSenderNotSettlementOwnerOrAnotherGovernor();
        governors[currentGovernorsGeneration][governorAddress] = true;
        emit GovernorStatusChanged(currentGovernorsGeneration, governorAddress, msg.sender, true);
    }

    /// @inheritdoc ISettlement
    function removeGovernor(address governorAddress) public override onlyActiveGame onlySettlementOwner {
        governors[currentGovernorsGeneration][governorAddress] = false;
        emit GovernorStatusChanged(currentGovernorsGeneration, governorAddress, msg.sender, false);
    }

    /// @inheritdoc ISettlement
    function removeGovernors() public override onlyActiveGame onlySettlementOwner {
        currentGovernorsGeneration++;
        emit GovernorsGenerationChanged(currentGovernorsGeneration);
    }

    /// @inheritdoc ISettlement
    function swapProsperityForExactWorkers(uint256 workersToBuy, uint256 maxProsperityToSell)
        public
        override
        onlyActiveGame
        onlyRulerOrWorldAsset
    {
        uint256 newWorkers = relatedRegion.workersPool().swapProsperityForExactWorkers(address(this), workersToBuy, maxProsperityToSell);
    }

    /// @inheritdoc ISettlement
    function isRuler(address potentialRuler) public view override returns (bool) {
        return getSettlementOwner() == potentialRuler || governors[currentGovernorsGeneration][potentialRuler];
    }

    /// @inheritdoc ISettlement
    function extendProsperity(uint256 prosperityAmount) public override onlyWorldAssetFromSameEra {
        era().prosperity().mint(address(this), prosperityAmount);
        extendedProsperityAmount += prosperityAmount;
    }

    /// @inheritdoc ISettlement
    function beginTileCapture(uint64 position, uint256 prosperityStake) public override onlyActiveGame onlyRulerOrWorldAsset {
        era().tileCapturingSystem().beginTileCapture(address(this), position, prosperityStake);
    }

    /// @inheritdoc ISettlement
    function cancelTileCapture(uint64 position) public override onlyActiveGame onlyRulerOrWorldAsset {
        era().tileCapturingSystem().cancelTileCapture(address(this), position);
    }

    /// @inheritdoc ISettlement
    function giveUpCapturedTile(uint64 position) public override onlyActiveGame onlyRulerOrWorldAsset {
        era().tileCapturingSystem().giveUpCapturedTile(address(this), position);
    }

    /// @inheritdoc ISettlement
    function claimCapturedTile(uint64 position) public override onlyActiveGame onlyRulerOrWorldAsset {
        era().tileCapturingSystem().claimTileCapture(address(this), position);
    }

    /// @inheritdoc ISettlement
    function increaseProducedCorruptionIndex(uint256 amount) public override onlyWorldAssetFromSameEra {
        producedCorruptionIndex += int256(amount);
    }

    /// @inheritdoc ISettlement
    function decreaseProducedCorruptionIndex(uint256 amount) public override onlyWorldAssetFromSameEra {
        producedCorruptionIndex -= int256(amount);
    }

    /// @inheritdoc ISettlement
    function isRottenSettlement() public view override returns (bool) {
        uint256 currentActiveEraNumber = world().currentEraNumber();
        if (eraNumber() >= currentActiveEraNumber) {
            return false;
        }

        if (producedCorruptionIndex <= 0) {
            return false;
        }

        return true;
    }

    /// @inheritdoc ISettlement
    function destroyRottenSettlement() public override onlyActiveGame {
        if (!isRottenSettlement()) revert SettlementCannotBeDestroyedIfItsNotRotten();

        ICrossErasMemory crossErasMemory = world().crossErasMemory();
        if (address(crossErasMemory.settlementByPosition(position)) != address(this)) revert SettlementCannotBeDestroyedIfItsAlreadyRebuilt();

        // 1. freshRegion.settlementMarket.updateState() in order to persist current price
        IEra currentActiveEra = world().eras(world().currentEraNumber());
        IRegion sameRegionOfCurrentActiveEra = currentActiveEra.regions(relatedRegion.regionId());
        ISettlementsMarket settlementMarket = sameRegionOfCurrentActiveEra.settlementsMarket();
        settlementMarket.updateState();

        // 2.
        // - remove from CEM.settlements & CEM.userSettlements (in order to free up map slot, free up banner)
        // (it will cause -> oldEra.settlements[pos] oldEra.userSettlements[nftId] will have data but CEM will not)
        // - decrement CEM.regionSettlementsCount
        crossErasMemory.removeUserSettlement(address(this));

        emit Destroyed();
    }

    /// @inheritdoc ISettlement
    function payToDecreaseCorruptionIndex(uint256 tokensAmount)
        public
        payable
        override
        onlyActiveGame
        nonReentrant
    {
        if (eraNumber() != world().currentEraNumber()) revert SettlementCannotDecreaseCorruptionIndexViaPaymentInInactiveEra();

        IERC20 erc20ForSettlementPurchase = world().erc20ForSettlementPurchase();
        bool isNativeCurrency = address(erc20ForSettlementPurchase) == address(0);

        if (isNativeCurrency && tokensAmount != 0) revert SettlementCannotDecreaseCorruptionIndexViaPaymentWrongParamProvided();

        uint256 _tokensAmount = isNativeCurrency
            ? msg.value
            : tokensAmount;

        if (isNativeCurrency) {
            Address.sendValue(payable(address(world().rewardPool())), _tokensAmount);
        } else {
            SafeERC20.safeTransferFrom(
                erc20ForSettlementPurchase,
                msg.sender,
                address(world().rewardPool()),
                _tokensAmount
            );
        }

        uint256 currentRewardPoolTokenPrice = world().rewardPool().getCurrentPrice();
        uint256 ingotsEquivalentOfTokensAmount = _tokensAmount * currentRewardPoolTokenPrice / 1e18;
        uint256 corruptionIndexEquivalentOfIngots = ingotsEquivalentOfTokensAmount * registry().getCorruptionIndexByResource(INGOT_TYPE_ID) / 1e18;
        uint256 corruptionIndexForTokensAmount = corruptionIndexEquivalentOfIngots * registry().getSettlementPayToDecreaseCorruptionIndexPenaltyMultiplier() / 1e18;

        relatedRegion.decreaseCorruptionIndex(address(this), corruptionIndexForTokensAmount);
    }

    /// @dev Allows caller to be settlement owner
    function _onlySettlementOwner() internal view {
        if (msg.sender != getSettlementOwner()) revert OnlySettlementOwner();
    }

    /// @dev Allows caller to be settlement ruler or world asset
    function _onlyRulerOrWorldAsset() internal view {
        if (!isRuler(msg.sender) && world().worldAssets(eraNumber(), msg.sender) == bytes32(0)) revert OnlyRulerOrWorldAsset();
    }

    /// @dev Transfers workers to specified building address
    function _transferWorkers(
        address buildingAddress,
        uint256 workersAmount
    ) internal {
        if (!MathExtension.isIntegerWithPrecision(workersAmount, 1e18)) revert SettlementCannotSendWorkersWithFractions();

        uint256 newWorkersAmount = IBuilding(buildingAddress).getAssignedWorkers() + workersAmount;
        uint256 availableForAdvancedProductionWorkersCapacity = IBuilding(buildingAddress).getAvailableForAdvancedProductionWorkersCapacity();
        if (newWorkersAmount > availableForAdvancedProductionWorkersCapacity) revert SettlementCannotSendWorkersToBuildingOverMaximumAllowedCapacity();

        era().workers().transfer(buildingAddress, workersAmount);
    }

    /// @dev Mints initial settlement workers
    function _mintInitialWorkers() internal {
        era().workers().mint(address(this), 7e18);
    }

    /// @dev Creates settlements buildings
    function _createBuildings() internal {
        bytes32[] memory buildingTypeIds = registry().getBuildingTypeIds();
        for (uint256 i = 0; i < buildingTypeIds.length; i++) {
            _createBuilding(buildingTypeIds[i]);
        }
    }

    /// @dev Creates settlements army
    function _createArmy() internal {
        address newArmyAddress = worldAssetFactory().create(
            address(world()),
            eraNumber(),
            ARMY_GROUP_TYPE_ID,
            BASIC_TYPE_ID,
            abi.encode(address(this))
        );

        army = IArmy(newArmyAddress);

        emit ArmyCreated(newArmyAddress, position);
    }

    /// @dev Creates building
    function _createBuilding(bytes32 buildingTypeId) internal {
        address newBuildingAddress = worldAssetFactory().create(
            address(world()),
            eraNumber(),
            BUILDING_GROUP_TYPE_ID,
            buildingTypeId,
            abi.encode(address(this), buildingTypeId)
        );

        buildings[buildingTypeId] = IBuilding(newBuildingAddress);

        emit BuildingCreated(newBuildingAddress, buildingTypeId);
    }

    /// @dev Creates new siege
    function _createSiege() internal {
        address newSiegeAddress = worldAssetFactory().create(
            address(world()),
            eraNumber(),
            SIEGE_GROUP_TYPE_ID,
            BASIC_TYPE_ID,
            abi.encode(address(this))
        );

        siege = ISiege(newSiegeAddress);

        emit SiegeCreated(newSiegeAddress);
    }
}
