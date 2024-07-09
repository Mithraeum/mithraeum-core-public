// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../IWorld.sol";
import "./IRegionOwnershipToken.sol";

contract RegionOwnershipToken is IRegionOwnershipToken, ERC721Enumerable, Ownable {
    /// @notice World contract
    /// @dev Immutable, initialized on creation
    IWorld public world;

    /// @notice Base URI for computing token uri
    /// @dev Updated on creation or when #updateURI is called
    string public baseURI;

    modifier onlyGeography() {
        if (msg.sender != address(world.geography())) revert OnlyGeography();
        _;
    }

    constructor(
        string memory name_,
        string memory symbol_,
        string memory uri_,
        address worldAddress_
    ) ERC721(name_, symbol_) {
        world = IWorld(worldAddress_);
        baseURI = uri_;
    }

    /// @dev Overridden value from ERC721
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /// @inheritdoc IRegionOwnershipToken
    function updateURI(string memory _uri) public onlyOwner {
        baseURI = _uri;
    }

    /// @inheritdoc IRegionOwnershipToken
    function getTokenIdsByAddress(address holderAddress) public view returns (uint256[] memory tokenIds) {
        uint256 userBalance = balanceOf(holderAddress);
        tokenIds = new uint256[](userBalance);

        for (uint256 i = 0; i < userBalance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(holderAddress, i);
        }
    }

    /// @inheritdoc IRegionOwnershipToken
    function mint(
        address to,
        uint256 regionId
    ) public onlyGeography {
        _safeMint(to, regionId, "");
    }
}