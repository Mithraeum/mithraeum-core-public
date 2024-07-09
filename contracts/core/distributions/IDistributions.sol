// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "../IWorld.sol";

interface IDistributions is IERC1155 {
    // State variables

    /// @notice World
    /// @dev Immutable, initialized on creation
    function world() external view returns (IWorld);

    /// @notice Mapping containing distribution id to assigned building address
    /// @dev Updated when #mint is called
    function distributionIdToBuildingAddress(uint256 distributionId) external view returns (address);

    /// @notice Last nft token id
    /// @dev Updated when #mint is called
    function lastDistributionId() external view returns (uint256);

    // Errors

    /// @notice Thrown when attempting to call method by not world asset from same era
    error OnlyWorldAssetFromSameEra();

    /// @notice Thrown when attempting to transfer distribution shares of building to building with equal building types (ex. farm to farm)
    error CannotTransferDistributionSharesToBuildingOfSameBuildingType();

    // Functions

    /// @notice Returns set of receivers as an array
    /// @dev
    /// @param distributionId Distribution id
    /// @return receivers An array of receivers
    function getDistributionReceivers(uint256 distributionId) external view returns (address[] memory receivers);

    /// @notice Mints new distribution Nft to specified address
    /// @dev Can be called only by world asset from active era
    /// @param to An address which will receive new nft
    /// @return newDistributionId Newly minted distribution id
    function mint(address to) external returns (uint256 newDistributionId);

    /// @notice Returns items per nft
    /// @dev Used to determine percent holdings
    /// @return itemsPerNft Items per nft
    function getItemsPerNft() external pure returns (uint256 itemsPerNft);
}
