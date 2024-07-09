// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IDistributions.sol";
import "../IWorld.sol";
import "../assets/building/IBuilding.sol";
import "../assets/IWorldAsset.sol";
import "../assets/IWorldAssetStorageAccessor.sol";
import "../../const/GameAssetTypes.sol";

contract Distributions is IDistributions, ERC1155, Ownable {
    using EnumerableSet for EnumerableSet.AddressSet;

    /// @dev Contains set of holders for specified nft id
    mapping(uint256 => EnumerableSet.AddressSet) private distributionReceivers;

    /// @inheritdoc IDistributions
    IWorld public override world;
    /// @inheritdoc IDistributions
    mapping(uint256 => address) public override distributionIdToBuildingAddress;
    /// @inheritdoc IDistributions
    uint256 public override lastDistributionId;

    /// @dev Only world asset from same era modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyWorldAssetFromSameEra() {
        _onlyWorldAssetFromSameEra();
        _;
    }

    constructor(
        address worldAddress_,
        string memory uri_
    ) ERC1155(uri_) {
        world = IWorld(worldAddress_);
    }

    /// @notice Updates token uri
    /// @dev Only owner can modify token uri
    function updateURI(string memory _newUri) public onlyOwner {
        _setURI(_newUri);
    }

    /// @inheritdoc IDistributions
    function getDistributionReceivers(uint256 distributionId) public view returns (address[] memory) {
        return distributionReceivers[distributionId].values();
    }

    /// @inheritdoc IDistributions
    function mint(
        address to
    ) public onlyWorldAssetFromSameEra returns (uint256) {
        uint256 newDistributionId = lastDistributionId + 1;

        _mint(
            to,
            newDistributionId,
            getItemsPerNft(),
            bytes("")
        );

        lastDistributionId = newDistributionId;
        distributionIdToBuildingAddress[newDistributionId] = msg.sender;
        return newDistributionId;
    }

    /// @inheritdoc IDistributions
    function getItemsPerNft() public pure returns (uint256) {
        return 100;
    }

    /// @dev Allows caller to be only world asset from same era
    function _onlyWorldAssetFromSameEra() internal view {
        uint256 eraNumber = IWorldAssetStorageAccessor(msg.sender).eraNumber();
        if (world.worldAssets(eraNumber, msg.sender) == bytes32(0)) revert OnlyWorldAssetFromSameEra();
    }

    /// @dev ERC1155 _beforeTokenTransfer hook
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        for (uint256 i = 0; i < ids.length; i++) {
            address buildingAddress = distributionIdToBuildingAddress[ids[i]];
            if (buildingAddress == address(0)) {
                continue;
            }

            // Blocks shares transfer of one building (determined by tokenId) to same type of second building (determined by 'to')
            IBuilding building = IBuilding(buildingAddress);
            uint256 eraNumberOfBuilding = IWorldAssetStorageAccessor(buildingAddress).eraNumber();

            if (world.worldAssets(eraNumberOfBuilding, to) == BUILDING_GROUP_TYPE_ID && IBuilding(to).buildingTypeId() == building.buildingTypeId()) {
                revert CannotTransferDistributionSharesToBuildingOfSameBuildingType();
            }

            // Distributes productions to shares sender and receiver
            building.distributeToSingleShareholder(from);
            building.distributeToSingleShareholder(to);
        }
    }

    /// @dev ERC1155 _afterTokenTransfer hook
    function _afterTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override {
        for (uint256 i = 0; i < ids.length; i++) {
            EnumerableSet.AddressSet storage receivers = distributionReceivers[ids[i]];

            if (from != address(0) && balanceOf(from, ids[i]) == 0) {
                receivers.remove(from);
            }

            // In case 'to' is already a receiver -> this will do nothing
            receivers.add(to);

            // Its necessary to update produced resource debt for both 'from' and 'to' in order to maintain valid resources distribution
            address buildingAddress = distributionIdToBuildingAddress[ids[i]];
            if (buildingAddress != address(0)) {
                IBuilding(buildingAddress).updateDebtsAccordingToNewDistributionsAmounts(from, to, amounts[i]);
            }
        }
    }
}
