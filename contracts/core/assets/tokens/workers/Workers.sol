// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "../../building/IBuilding.sol";
import "../../workersPool/IWorkersPool.sol";
import "./IWorkers.sol";
import "../../WorldAsset.sol";
import "../../../../const/GameAssetTypes.sol";

contract Workers is ERC20Burnable, IWorkers, WorldAsset {

    /// @dev Removes error for compiling, default constructor does nothing because its a proxy
    constructor() ERC20("", "") public {

    }

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {

    }

    /// @inheritdoc IERC20Metadata
    function name() public view override returns (string memory) {
        return string.concat("Workers @", Strings.toString(eraNumber()));
    }

    /// @inheritdoc IERC20Metadata
    function symbol() public view override returns (string memory) {
        return string.concat("WRK @", Strings.toString(eraNumber()));
    }

    /// @inheritdoc IWorkers
    function mint(address to, uint256 amount) public override onlyWorldAssetFromSameEra {
        _mint(to, amount);
    }

    /// @inheritdoc IERC20Burnable
    function burnFrom(address from, uint256 amount) public override(ERC20Burnable, IERC20Burnable) {
        if (_isWorldAsset(msg.sender)) {
            _burn(from, amount);
        } else {
            ERC20Burnable.burnFrom(from, amount);
        }
    }

    /// @inheritdoc IERC20Burnable
    function burn(uint256 amount) public override(ERC20Burnable, IERC20Burnable) {
        ERC20Burnable.burn(amount);
    }

    /// @inheritdoc IERC20
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override(ERC20, IERC20) returns (bool) {
        if (_isWorldAsset(msg.sender)) {
            _transfer(from, to, amount);
            return true;
        } else {
            return ERC20.transferFrom(from, to, amount);
        }
    }

    /// @dev Checks if provided address is world or world asset
    function _isWorldAsset(address addressToCheck) internal view returns (bool) {
        IWorld _world = world();

        return addressToCheck == address(_world) || _world.worldAssets(eraNumber(), addressToCheck) != bytes32(0);
    }

    /// @dev Returns this buildings settlement
    function _getSettlementByBuilding(address buildingAddress) internal view returns (address) {
        return address(IBuilding(buildingAddress).relatedSettlement());
    }

    /// @dev ERC20 _beforeTokenTransfer hook
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        IWorld _world = world();
        uint256 _eraNumber = eraNumber();

        bool isFromWorkersPool = _world.worldAssets(_eraNumber, from) == WORKERS_POOL_GROUP_TYPE_ID;
        bool isFromSettlement = _world.worldAssets(_eraNumber, from) == SETTLEMENT_GROUP_TYPE_ID;
        bool isFromBuilding = _world.worldAssets(_eraNumber, from) == BUILDING_GROUP_TYPE_ID;

        //From can be address(0) or settlement or building
        if (from != address(0) && !isFromWorkersPool && !isFromSettlement && !isFromBuilding) revert WorkersTransferInvalidParams();

        bool isToSettlement = _world.worldAssets(_eraNumber, to) == SETTLEMENT_GROUP_TYPE_ID;
        bool isToBuilding = _world.worldAssets(_eraNumber, to) == BUILDING_GROUP_TYPE_ID;

        //To can be address(0) or settlement or building
        if (to != address(0) && !isToSettlement && !isToBuilding) revert WorkersTransferInvalidParams();

        //Workers can be minted to settlement
        //Workers can be transferred from settlement to building
        //Workers can be transferred from building to settlement
        //Workers can be transferred from building to building
        //Everything else is disabled

        if (to == address(0)) {
            return;
        }

        if (from == address(0) && isToSettlement) {
            return;
        }

        if (isFromSettlement && isToBuilding && _getSettlementByBuilding(to) == from) {
            IBuilding(to).updateState();
            return;
        }

        if (isFromBuilding && isToSettlement && _getSettlementByBuilding(from) == to) {
            IBuilding(from).updateState();
            return;
        }

        if (isFromBuilding && isToBuilding && _getSettlementByBuilding(from) == _getSettlementByBuilding(to)) {
            IBuilding(from).updateState();
            IBuilding(to).updateState();
            return;
        }

        revert WorkersTransferInvalidParams();
    }
}
