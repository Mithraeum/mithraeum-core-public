// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Default Banner parts nft
/// @notice Acts as ERC1155 Nft token for banner parts
contract BannerParts is ERC1155, Ownable {
    /// @notice Collection name
    /// @dev Immutable, initialized on creation
    string public name;

    /// @notice Collection symbol
    /// @dev Immutable, initialized on creation
    string public symbol;

    /// @notice Mapping containing if specified token id free or not
    /// @dev Updated when #setFreeParts is called
    /* @dev
     * Id represents banner elements.
     * 1 - 9999999999: first part
     * 10000000000 - 19999999999: second part
     * 20000000000 - 29999999999: third part
     * 30000000000 - 39999999999: fourth part
     * 40000000000 - 49999999999: fifth part
     * 50000000000 - 59999999999: sixth part
     * etc
     */
    mapping(uint256 => bool) public isFreePart;

    /// @notice Trusted addresses map which can transfer without approve (For example: Opensea contract can be trusted so user can list its parts without approve)
    /// @dev Updated when #setSafeApprovedAddress
    mapping(address => bool) public isSafeApprovedAddress;

    /// @notice Thrown when attempting to query balance of zero address
    error UnableToQueryBalanceOfZeroAddress();

    constructor(
        string memory _name,
        string memory _symbol,
        string memory uri_
    ) public ERC1155(uri_) {
        name = _name;
        symbol = _symbol;
    }

    /// @notice Marks provided address as trusted for transfers without approve
    /// @dev Even though function is opened, it can only by contract owner
    /// @param _address An address which will be marked as trusted or not
    /// @param _status Is address trusted or not
    function setSafeApprovedAddress(address _address, bool _status) public onlyOwner {
        isSafeApprovedAddress[_address] = _status;
    }

    /// @notice Updates base token uri
    /// @dev Only owner can modify base token uri
    function updateURI(string memory uri_) public onlyOwner {
        _setURI(uri_);
    }

    /// @notice Sets specified ids as free parts or not free parts
    /// @dev Only owner can modify free parts
    /// @param ids Token ids
    /// @param statuses Is free parts or not
    function setFreeParts(uint256[] calldata ids, bool[] calldata statuses) public onlyOwner {
        for (uint256 i = 0; i < ids.length; i++) {
            isFreePart[ids[i]] = statuses[i];
        }
    }

    /// @inheritdoc IERC1155
    function isApprovedForAll(address _owner, address _operator) public view override returns (bool isOperator) {
        if (isSafeApprovedAddress[_operator]) {
            return true;
        }

        return ERC1155.isApprovedForAll(_owner, _operator);
    }

    /// @notice Mints specified ids with specified amounts to specified address
    /// @dev Only owner can mint new parts
    /// @param account An address which will receive new parts
    /// @param id New part id
    /// @param amount Amount of nft that will be minted
    /// @param data Custom data
    function mint(
        address account,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public onlyOwner {
        if (!isFreePart[id]) {
            _mint(account, id, amount, data);
        }
    }

    /// @notice Mints batch amount of ids with specified amounts to specified address
    /// @dev Only owner can mint new parts
    /// @param to An address which will receive new parts
    /// @param ids New part ids
    /// @param amounts Amounts of nfts that will be minted
    /// @param data Custom data
    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        uint256 count;
        for (uint256 i = 0; i < ids.length; i++) {
            if (!isFreePart[ids[i]]) {
                count++;
            }
        }

        uint256[] memory idsTrue = new uint256[](count);
        uint256[] memory amountsTrue = new uint256[](count);

        uint256 index;
        for (uint256 i = 0; i < ids.length; i++) {
            if (!isFreePart[ids[i]]) {
                idsTrue[index] = ids[i];
                amountsTrue[index] = amounts[i];
                index++;
            }
        }
        _mintBatch(to, idsTrue, amountsTrue, data);
    }

    /// @notice Burns specified id with specified amount from specified address
    /// @dev Only owner can burn parts
    /// @param from An address from which tokens will be burned
    /// @param id Token id
    /// @param amount Amount of nft that will be burned
    function burn(
        address from,
        uint256 id,
        uint256 amount
    ) public onlyOwner {
        if (!isFreePart[id]) {
            _burn(from, id, amount);
        }
    }

    /// @inheritdoc IERC1155
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        if (!isFreePart[id]) {
            super.safeTransferFrom(from, to, id, amount, data);
        }
    }

    /// @inheritdoc IERC1155
    function balanceOf(address account, uint256 id) public view virtual override returns (uint256) {
        if (account == address(0)) revert UnableToQueryBalanceOfZeroAddress();
        if (isFreePart[id]) {
            return 1e6;
        }

        return super.balanceOf(account, id);
    }
}
