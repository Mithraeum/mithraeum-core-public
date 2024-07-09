// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./IUnits.sol";
import "../../building/IBuilding.sol";
import "../../unitsPool/IUnitsPool.sol";
import "../../WorldAsset.sol";
import "../../../../const/GameAssetTypes.sol";

contract Units is ERC20Burnable, IUnits, WorldAsset {
    /// @inheritdoc IUnits
    string public tokenName;
    /// @inheritdoc IUnits
    string public tokenSymbol;
    /// @inheritdoc IUnits
    bytes32 public override unitTypeId;

    /// @dev Removes error for compiling, default constructor does nothing because its a proxy
    constructor() ERC20("", "") public {

    }

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {
        (
            string memory _tokenName,
            string memory _tokenSymbol,
            bytes32 _unitTypeId
        ) = abi.decode(initParams, (string, string, bytes32));

        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
        unitTypeId = _unitTypeId;
    }

    /// @inheritdoc IERC20Metadata
    function name() public view override returns (string memory) {
        return string.concat(string.concat(tokenName, " @"), Strings.toString(eraNumber()));
    }

    /// @inheritdoc IERC20Metadata
    function symbol() public view override returns (string memory) {
        return string.concat(string.concat(tokenSymbol, " @"), Strings.toString(eraNumber()));
    }

    /// @inheritdoc IUnits
    function mint(address to, uint256 amount) public override onlyWorldAssetFromSameEra {
        _mint(to, amount);
    }

    /// @inheritdoc IERC20Burnable
    function burn(uint256 amount) public override(ERC20Burnable, IERC20Burnable) {
        ERC20Burnable.burn(amount);
    }

    /// @inheritdoc IERC20Burnable
    function burnFrom(address account, uint256 amount) public override(ERC20Burnable, IERC20Burnable) {
        if (_isWorldAsset(msg.sender)) {
            _burn(account, amount);
        } else {
            ERC20Burnable.burnFrom(account, amount);
        }
    }

    /// @notice Transfer is disabled
    /// @inheritdoc IERC20
    function transfer(address to, uint256 amount) public override(ERC20, IERC20) returns (bool success) {
        revert Disabled();
    }

    /// @notice Transfer from is disabled
    /// @inheritdoc IERC20
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override(ERC20, IERC20) returns (bool success) {
        if (_isWorldAsset(msg.sender)) {
            _transfer(from, to, amount);
            return true;
        } else {
            revert Disabled();
        }
    }

    /// @dev Checks if provided settlement cultists settlement or not
    function _isCultistsSettlement(ISettlement settlement) internal view returns (bool) {
        return IWorldAssetStorageAccessor(address(settlement)).assetTypeId() == CULTISTS_SETTLEMENT_TYPE_ID;
    }

    /// @dev Checks if provided address is world or world asset
    function _isWorldAsset(address addressToCheck) internal view returns (bool) {
        return addressToCheck == address(world()) || world().worldAssets(eraNumber(), addressToCheck) != bytes32(0);
    }

    /// @dev ERC20 _beforeTokenTransfer hook
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        //1. If Cultists is minted/burned -> updateState in region (in order to apply workers before cultists penalty is applied)
        // Mint units
        if (from == address(0) && world().worldAssets(eraNumber(), to) == ARMY_GROUP_TYPE_ID) {
            ISettlement relatedSettlement = IArmy(to).relatedSettlement();
            if (_isCultistsSettlement(relatedSettlement)) {
                // Minting cultists means we have to update region time according to cultists amount before actual mint, and to this moment exactly (block.timestamp)
                relatedSettlement.relatedRegion().updateRegionTime(block.timestamp);
            }
        }

        // Burn units
        if (to == address(0) && world().worldAssets(eraNumber(), from) == ARMY_GROUP_TYPE_ID) {
            IArmy army = IArmy(from);
            ISettlement relatedSettlement = army.relatedSettlement();
            if (_isCultistsSettlement(relatedSettlement)) {
                // Burning cultists units means we have to update region time according to cultists amount before actual burn, but cultists burning could only be done at battle exiting
                // (we need to get battle end time and update time up to it)
                IBattle cultistsBattle = army.battle();
                (,, uint64 battleEndTime) = cultistsBattle.battleTimeInfo();
                relatedSettlement.relatedRegion().updateRegionTime(battleEndTime);
            }
        }
    }

    /// @dev ERC20 _afterTokenTransfer hook
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        // Minting
        if (from == address(0) && world().worldAssets(eraNumber(), to) == ARMY_GROUP_TYPE_ID) {
            ISettlement relatedSettlement = IArmy(to).relatedSettlement();
            if (_isCultistsSettlement(relatedSettlement)) {
                relatedSettlement.relatedRegion().handleCultistsSummoned(amount);
            }
        }

        // Burning
        if (to == address(0) && world().worldAssets(eraNumber(), from) == ARMY_GROUP_TYPE_ID) {
            ISettlement relatedSettlement = IArmy(from).relatedSettlement();
            if (_isCultistsSettlement(relatedSettlement)) {
                relatedSettlement.relatedRegion().handleCultistsDefeated(amount);
            }
        }
    }
}
