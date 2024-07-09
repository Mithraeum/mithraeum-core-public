// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Receiver.sol";

/// @title Banners Nft
/// @notice Acts as ERC721 Nft token, which supports ERC721 and ERC1155 parts as properties of every banner nft
contract Banners is ERC721Enumerable, Ownable, ERC1155Receiver {
    struct Part {
        address addr;
        uint256 id;
    }

    struct BannerData {
        string name;
        Part[16] parts;
        bytes data;
    }

    /// @notice Mapping containing banner data by provided token id
    /// @dev Updated when #updateBanner or #mint is called
    mapping(uint256 => BannerData) public bannerData;

    /// @notice Base URI for computing token uri
    /// @dev Updated on creation or when #updateURI is called
    string public baseURI;

    /// @notice Last created token id
    /// @dev Updated when #mint is called
    uint256 public lastTokenId = 0;

    /// @notice Maximum amount of banners each address can mint
    /// @dev Immutable, initialized in constructor
    uint256 public maxAmountOfMintedBannersPerAddress;

    /// @notice Mapping containing amount of minted banners by address
    /// @dev Updated when #mint is called
    mapping(address => uint256) public mintedBannersByAddress;

    /// @notice Emitted when #mint is called
    /// @param tokenId Newly created token id
    /// @param bannerName Banner name
    /// @param bannerParts Banner parts
    /// @param data Banner custom parameters
    event BannerCreated(uint256 tokenId, string bannerName, Part[16] bannerParts, bytes data);

    /// @notice Emitted when #updateBanner is called
    /// @param tokenId Token id which was updated
    /// @param newBannerName New banner name
    /// @param newBannerParts New parts struct
    /// @param data Banner custom parameters
    event BannerUpdated(uint256 tokenId, string newBannerName, Part[16] newBannerParts, bytes data);

    /// @notice Thrown when attempting to mint banner while reached maximum amount of banners able to be minted by address
    error CannotMintMoreThanMaximumAllowedAmountToMintForThisMsgSender();

    /// @notice Thrown when attempting to update banner while not being the owner of it
    error UnableToUpdateBannerDueToTokenIdDoesNotBelongToCaller();

    constructor(
        string memory name_,
        string memory symbol_,
        string memory uri_,
        uint256 maxAmountOfMintedBannersPerAddress_
    ) ERC721(name_, symbol_) {
        baseURI = uri_;
        maxAmountOfMintedBannersPerAddress = maxAmountOfMintedBannersPerAddress_;
    }

    /// @inheritdoc IERC165
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Enumerable, ERC1155Receiver)
        returns (bool)
    {
        return ERC721Enumerable.supportsInterface(interfaceId) || ERC1155Receiver.supportsInterface(interfaceId);
    }

    /// @dev Overridden value from ERC721
    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    /// @inheritdoc IERC1155Receiver
    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        return IERC1155Receiver.onERC1155Received.selector;
    }

    /// @inheritdoc IERC1155Receiver
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    /// @notice Returns banner data with parts
    /// @dev Default mapping read method does not return all data
    /// @param tokenIndex Token index
    /// @return name Banner name
    /// @return parts Banner parts
    /// @return data Banner data
    function getBannerData(uint256 tokenIndex)
        public
        view
        returns (
            string memory name,
            Part[16] memory parts,
            bytes memory data
        )
    {
        return (bannerData[tokenIndex].name, bannerData[tokenIndex].parts, bannerData[tokenIndex].data);
    }

    /// @notice Returns all token ids for specified holder address
    /// @dev Used to query all token ids without asking them one by one (may not work for holder with very large amount of nfts)
    /// @param holderAddress Holder address
    /// @return tokenIds Token ids holder owns
    function getTokenIdsByAddress(address holderAddress) public view returns (uint256[] memory tokenIds) {
        uint256 userBalance = balanceOf(holderAddress);
        tokenIds = new uint256[](userBalance);

        for (uint256 i = 0; i < userBalance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(holderAddress, i);
        }
    }

    /// @notice Returns all banners data for specified token ids
    /// @dev Used to query all banner data without asking them one by one (may not work for holder with very large amount of token ids)
    /// @param tokenIds Token ids
    /// @return bannersData Banner data for every token id
    function getBannersDataByTokenIds(uint256[] memory tokenIds)
        public
        view
        returns (BannerData[] memory bannersData)
    {
        bannersData = new BannerData[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            bannersData[i] = bannerData[tokenIds[i]];
        }
    }

    /// @notice Updates base token uri
    /// @dev Only owner can modify base token uri
    function updateURI(string memory _uri) public onlyOwner {
        baseURI = _uri;
    }

    /// @notice Mints banner with specified parameters
    /// @dev Specified banner parts will be taken from msg.sender
    /// @param name Banner name
    /// @param parts Banner parts
    /// @param data Banner custom parameters
    function mint(
        string calldata name,
        Part[16] memory parts,
        bytes memory data
    ) public {
        uint256 amountOfBannersMintedByMsgSender = mintedBannersByAddress[msg.sender];
        if (amountOfBannersMintedByMsgSender >= maxAmountOfMintedBannersPerAddress) {
            revert CannotMintMoreThanMaximumAllowedAmountToMintForThisMsgSender();
        }

        lastTokenId++;

        bannerData[lastTokenId].name = name;
        bannerData[lastTokenId].data = data;
        _addParts(lastTokenId, parts);

        _safeMint(msg.sender, lastTokenId, data);

        mintedBannersByAddress[msg.sender] = amountOfBannersMintedByMsgSender + 1;

        emit BannerCreated(lastTokenId, name, parts, data);
    }

    /// @notice Updates banner with specified parameters
    /// @param tokenId banner token id which will be updated, old banner parts, if replaced, will be refunded to the owner
    /// @param name New banner name
    /// @param parts New banner parts
    /// @param data Banner custom parameters
    function updateBanner(
        uint256 tokenId,
        string calldata name,
        Part[16] memory parts,
        bytes memory data
    ) public {
        if (msg.sender != ownerOf(tokenId)) revert UnableToUpdateBannerDueToTokenIdDoesNotBelongToCaller();

        for (uint256 i = 0; i < parts.length; i++) {
            if (parts[i].addr == bannerData[tokenId].parts[i].addr && parts[i].id == bannerData[tokenId].parts[i].id) {
                continue;
            }

            // We support parts ERC1155 as well as ERC712
            // This means we are trying to get both standards, if first call fails -> we try second, otherwise call reverts

            // Firstly we transfer new parts to this contract
            if (parts[i].addr != address(0)) {
                try IERC1155(parts[i].addr).safeTransferFrom(msg.sender, address(this), parts[i].id, 1, "0x") {} catch (
                    bytes memory
                ) {
                    IERC721(parts[i].addr).safeTransferFrom(msg.sender, address(this), parts[i].id);
                }
            }

            // Secondly we return old parts to the owner
            if (bannerData[tokenId].parts[i].addr != address(0)) {
                try
                    IERC1155(bannerData[tokenId].parts[i].addr).safeTransferFrom(
                        address(this),
                        msg.sender,
                        bannerData[tokenId].parts[i].id,
                        1,
                        "0x"
                    )
                {} catch (
                    bytes memory
                ) {
                    IERC721(bannerData[tokenId].parts[i].addr).safeTransferFrom(
                        address(this),
                        msg.sender,
                        bannerData[tokenId].parts[i].id
                    );
                }
            }

            bannerData[tokenId].parts[i] = parts[i];
        }

        bannerData[tokenId].name = name;
        bannerData[tokenId].data = data;
        emit BannerUpdated(tokenId, name, parts, data);
    }

    /// @dev Transfers specified banner parts from msg.sender to this contract
    function _addParts(uint256 tokenId, Part[16] memory parts) internal {
        for (uint256 i = 0; i < parts.length; i++) {
            if (parts[i].addr == address(0)) {
                continue;
            }

            // We support parts ERC1155 as well as ERC712
            // This means we are trying to get both standards, if first call fails -> we try second, otherwise call reverts
            try IERC1155(parts[i].addr).safeTransferFrom(msg.sender, address(this), parts[i].id, 1, "0x") {} catch (
                bytes memory
            ) {
                IERC721(parts[i].addr).safeTransferFrom(msg.sender, address(this), parts[i].id);
            }

            bannerData[tokenId].parts[i] = parts[i];
        }
    }
}
