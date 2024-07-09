// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

interface IRegionOwnershipToken is IERC721Enumerable {
    // Errors

    /// @notice Thrown when attempting to call action which only possible to be called by geography
    error OnlyGeography();

    // Functions

    /// @notice Updates base token uri
    /// @dev Only owner can modify base token uri
    /// @param _uri New base token uri
    function updateURI(string memory _uri) external;

    /// @notice Returns all token ids for specified holder address
    /// @dev Used to query all token ids without asking them one by one (may not work for holder with very large amount of nfts)
    /// @param holderAddress Holder address
    /// @return tokenIds Token ids holder owns
    function getTokenIdsByAddress(address holderAddress) external view returns (uint256[] memory tokenIds);

    /// @notice Mints region ownership token
    /// @dev Can only be called by geography contract
    /// @param to Mint to address
    /// @param regionId Region id
    function mint(
        address to,
        uint256 regionId
    ) external;
}