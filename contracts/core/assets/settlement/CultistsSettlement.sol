// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../region/IRegion.sol";
import "./ISettlement.sol";
import "../WorldAsset.sol";
import "../../../const/GameAssetTypes.sol";

contract CultistsSettlement is WorldAsset, ISettlement {
    /// @inheritdoc ISettlement
    IRegion public override relatedRegion;
    /// @inheritdoc ISettlement
    IArmy public override army;
    /// @inheritdoc ISettlement
    uint64 public override position;

    /// @notice Thrown when attempting to call action which is disabled
    error Disabled();

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {
        (
            uint256 createdWithBannerId,
            address regionAddress,
            uint64 settlementPosition
        ) = abi.decode(initParams, (uint256, address, uint64));

        relatedRegion = IRegion(regionAddress);
        position = settlementPosition;

        _createArmy();
    }

    /// @notice For cultists settlement any provided address is not ruler
    /// @inheritdoc ISettlement
    function isRuler(address potentialRuler) public view override returns (bool) {
        return false;
    }

    // Stubs for ISettlement

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function getSettlementOwner() public view override returns (address) {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function addGovernor(address governorAddress) public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function removeGovernor(address governorAddress) public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function removeGovernors() public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function swapProsperityForExactWorkers(uint256 workersToBuy, uint256 maxProsperityToSell) public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function bannerId() public view returns (uint256) {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function siege() public view returns (ISiege) {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function producedCorruptionIndex() public view returns (int256) {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function buildings(bytes32 buildingTypeId) public view returns (IBuilding) {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function currentGovernorsGeneration() public view returns (uint256) {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function governors(uint256 era, address isGovernor) public view returns (bool) {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function extendedProsperityAmount() public view returns (uint256) {
        revert Disabled();
    }

    // Functions

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function assignResourcesAndWorkersToBuilding(
        address resourcesOwner,
        address buildingAddress,
        uint256 workersAmount,
        bytes32[] memory resourceTypeIds,
        uint256[] memory resourcesAmounts
    ) public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function withdrawResources(
        bytes32 resourceTypeId,
        address to,
        uint256 amount
    ) public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function updateFortHealth() public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function updateProsperityAmount() public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function extendProsperity(uint256 prosperityAmount) public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function beginTileCapture(uint64 position, uint256 prosperityStake) public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function cancelTileCapture(uint64 position) public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function giveUpCapturedTile(uint64 position) public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function claimCapturedTile(uint64 position) public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function increaseProducedCorruptionIndex(uint256 amount) public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function decreaseProducedCorruptionIndex(uint256 amount) public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function isRottenSettlement() public view override returns (bool) {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function destroyRottenSettlement() public override {
        revert Disabled();
    }

    /// @notice For cultists settlement this function is disabled
    /// @inheritdoc ISettlement
    function payToDecreaseCorruptionIndex(uint256 tokensAmount) public payable override {
        revert Disabled();
    }

    /// @dev Creates settlements army
    function _createArmy() internal {
        address armyAddress = worldAssetFactory().create(
            address(world()),
            eraNumber(),
            ARMY_GROUP_TYPE_ID,
            BASIC_TYPE_ID,
            abi.encode(address(this))
        );

        army = IArmy(armyAddress);

        emit ArmyCreated(armyAddress, position);
    }
}
