// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "./IResource.sol";
import "../../building/IBuilding.sol";
import "../../unitsPool/IUnitsPool.sol";
import "../../WorldAsset.sol";
import "../../../../const/GameAssetTypes.sol";

contract Resource is ERC20Burnable, IResource, WorldAsset {
    /// @inheritdoc IResource
    string public tokenName;
    /// @inheritdoc IResource
    string public tokenSymbol;
    /// @inheritdoc IResource
    bytes32 public resourceTypeId;

    /// @dev Only world asset from same era or reward pool modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyWorldAssetFromSameEraOrRewardPool() {
        _onlyWorldAssetFromSameEraOrRewardPool();
        _;
    }

    /// @dev Removes error for compiling, default constructor does nothing because its a proxy
    constructor() ERC20("", "") public {

    }

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {
        (
            string memory _tokenName,
            string memory _tokenSymbol,
            bytes32 _resourceTypeId
        ) = abi.decode(initParams, (string, string, bytes32));

        tokenName = _tokenName;
        tokenSymbol = _tokenSymbol;
        resourceTypeId = _resourceTypeId;
    }

    /// @inheritdoc IERC20Metadata
    function name() public view override returns (string memory) {
        return string.concat(string.concat(tokenName, " @"), Strings.toString(eraNumber()));
    }

    /// @inheritdoc IERC20Metadata
    function symbol() public view override returns (string memory) {
        return string.concat(string.concat(tokenSymbol, " @"), Strings.toString(eraNumber()));
    }

    /// @inheritdoc IResource
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

    /// @notice Transferred disabled if trying to transfer to the game building which does not use this resource
    /// @inheritdoc IERC20
    function transfer(address to, uint256 amount) public override(ERC20, IERC20) returns (bool success) {
        if (world().worldAssets(eraNumber(), to) == BUILDING_GROUP_TYPE_ID && !IBuilding(to).isResourceAcceptable(resourceTypeId)) {
            revert ResourceNotAcceptable();
        }

        return ERC20.transfer(to, amount);
    }

    /// @notice Transferred disabled if trying to transfer to the game building which does not use this resource
    /// @inheritdoc IERC20
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override(ERC20, IERC20) returns (bool success) {
        if (world().worldAssets(eraNumber(), to) == BUILDING_GROUP_TYPE_ID && !IBuilding(to).isResourceAcceptable(resourceTypeId)) {
            revert ResourceNotAcceptable();
        }

        if (_isWorldAsset(msg.sender) || _isRewardPool(msg.sender)) {
            _transfer(from, to, amount);
            return true;
        } else {
            return ERC20.transferFrom(from, to, amount);
        }
    }

    /// @inheritdoc IResource
    function spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) public override onlyWorldAssetFromSameEraOrRewardPool {
        _spendAllowance(owner, spender, amount);
    }

    /// @notice If called for building then it returns amount of resource as if building state was applied
    /// @inheritdoc IERC20
    function balanceOf(address tokenOwner) public view override(ERC20, IERC20) returns (uint256) {
        if (world().worldAssets(eraNumber(), tokenOwner) == BUILDING_GROUP_TYPE_ID) {
            return IBuilding(tokenOwner).getResourcesAmount(resourceTypeId, block.timestamp);
        }

        return ERC20.balanceOf(tokenOwner);
    }

    /// @inheritdoc IResource
    function stateBalanceOf(address tokenOwner) public view override returns (uint256 balance) {
        return ERC20.balanceOf(tokenOwner);
    }

    /// @dev Allows caller to be only world or world asset or reward pool
    function _onlyWorldAssetFromSameEraOrRewardPool() internal view {
        if (msg.sender != address(world()) &&
            world().worldAssets(eraNumber(), msg.sender) == bytes32(0) &&
            msg.sender != address(world().rewardPool())) revert OnlyWorldAssetFromSameEraOrRewardPool();
    }

    /// @dev Checks if provided resource is required for building production
    function _isRequiredForBuildingProduction(
        bytes32 resourceTypeId,
        address buildingAddress,
        bool isProducingResource
    ) internal view returns (bool) {
        IBuilding.ProductionConfigItem[] memory productionConfigItems = IBuilding(buildingAddress).getConfig();
        for (uint256 i = 0; i < productionConfigItems.length; i++) {
            if (productionConfigItems[i].isProducing == isProducingResource && resourceTypeId == productionConfigItems[i].resourceTypeId) {
                return true;
            }
        }

        return false;
    }

    /// @dev Checks if provided address is reward pool
    function _isRewardPool(address addressToCheck) internal view returns (bool) {
        return address(world().rewardPool()) == addressToCheck;
    }

    /// @dev Checks if provided address is world or world asset
    function _isWorldAsset(address addressToCheck) internal view returns (bool) {
        return addressToCheck == address(world()) || world().worldAssets(eraNumber(), addressToCheck) != bytes32(0);
    }

    /// @notice Behaves same as default ERC20._transfer, however if resource is transferred to the building part of the resource is burned according to cultists balance
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        bool isTransferringFromBuilding = world().worldAssets(eraNumber(), from) == BUILDING_GROUP_TYPE_ID;
        bool isTransferringToBuilding = world().worldAssets(eraNumber(), to) == BUILDING_GROUP_TYPE_ID;
        bool isResourceProducedAtFromBuilding = isTransferringFromBuilding ? _isRequiredForBuildingProduction(resourceTypeId, from, true) : false;
        bool isResourceProducedAtToBuilding = isTransferringToBuilding ? _isRequiredForBuildingProduction(resourceTypeId, to, true) : false;

        //before
        if (isTransferringFromBuilding) {
            IBuilding(from).updateState();
        }

        if (isTransferringToBuilding) {
            IBuilding(to).updateState();
        }

        //transfer
        if (isTransferringFromBuilding && isTransferringToBuilding && isResourceProducedAtFromBuilding && isResourceProducedAtToBuilding) {
            ERC20._transfer(from, to, amount);
        } else if (isTransferringToBuilding && isResourceProducedAtToBuilding) {
            ERC20._transfer(from, to, 0);
        } else if (isTransferringToBuilding) {
            ISettlement settlementOfBuilding = IBuilding(to).relatedSettlement();
            uint256 penalty = settlementOfBuilding.relatedRegion().getPenaltyFromCultists();

            uint256 amountToBeBurned = amount * penalty / 1e18;
            uint256 amountToBeSent = amount - amountToBeBurned;

            ERC20._transfer(from, to, amountToBeSent);

            if (amountToBeBurned > 0) {
                ERC20._burn(from, amountToBeBurned);
            }
        } else {
            ERC20._transfer(from, to, amount);
        }

        //after
        if (isTransferringFromBuilding) {
            IBuilding(from).handleProductionResourcesChanged();

            bool isResourceRequiredForProductionAtFromBuilding = _isRequiredForBuildingProduction(resourceTypeId, from, false);

            // If anyone takes resource required for production from building -> we consider them as unlocked and increase region corruptionIndex
            if (isResourceRequiredForProductionAtFromBuilding) {
                ISettlement settlementOfBuilding = IBuilding(from).relatedSettlement();
                settlementOfBuilding.relatedRegion().increaseCorruptionIndex(
                    address(settlementOfBuilding),
                    registry().getCorruptionIndexByResource(resourceTypeId) * amount / 1e18
                );
            }
        }

        if (isTransferringToBuilding) {
            IBuilding(to).handleProductionResourcesChanged();

            bool isResourceRequiredForProductionAtToBuilding = _isRequiredForBuildingProduction(resourceTypeId, to, false);

            // If anyone sends resource required for production to building -> we consider them as locked and we should lower its region corruptionIndex
            if (isResourceRequiredForProductionAtToBuilding) {
                ISettlement settlementOfBuilding = IBuilding(to).relatedSettlement();
                settlementOfBuilding.relatedRegion().decreaseCorruptionIndex(
                    address(settlementOfBuilding),
                    registry().getCorruptionIndexByResource(resourceTypeId) * amount / 1e18
                );
            }
        }
    }

    /// @notice Behaves same as default ERC20._mint, however if resource is minted to building's production (non producing resource) cultists penalty should be applied
    function _mint(address to, uint256 amount) internal override {
        bool isMintingToBuilding = world().worldAssets(eraNumber(), to) == BUILDING_GROUP_TYPE_ID;
        bool isResourceProducedAtToBuilding = isMintingToBuilding ? _isRequiredForBuildingProduction(resourceTypeId, to, true) : false;

        //before
        if (isMintingToBuilding) {
            IBuilding(to).updateState();
        }

        //transfer
        if (isMintingToBuilding && !isResourceProducedAtToBuilding) {
            // Same as at _transfer, however since there are no resources no need to burn and there is a need to mint instead of transfer
            ISettlement settlementOfBuilding = IBuilding(to).relatedSettlement();
            uint256 penalty = settlementOfBuilding.relatedRegion().getPenaltyFromCultists();

            uint256 amountToBeBurned = amount * penalty / 1e18;
            uint256 amountToBeMinted = amount - amountToBeBurned;

            ERC20._mint(to, amountToBeMinted);
        } else {
            ERC20._mint(to, amount);
        }

        //after
        if (isMintingToBuilding) {
            IBuilding(to).handleProductionResourcesChanged();

            bool isResourceRequiredForProductionAtToBuilding = _isRequiredForBuildingProduction(resourceTypeId, to, false);

            if (isResourceRequiredForProductionAtToBuilding) {
                ISettlement settlementOfBuilding = IBuilding(to).relatedSettlement();
                settlementOfBuilding.relatedRegion().decreaseCorruptionIndex(
                    address(settlementOfBuilding),
                    registry().getCorruptionIndexByResource(resourceTypeId) * amount / 1e18
                );
            }
        }
    }

    /// @notice Behaves same as default ERC20._burn
    function _burn(address from, uint256 amount) internal override {
        bool isBurningFromBuilding = world().worldAssets(eraNumber(), from) == BUILDING_GROUP_TYPE_ID;

        //before
        if (isBurningFromBuilding) {
            IBuilding(from).updateState();
        }

        //transfer
        ERC20._burn(from, amount);

        //after
        if (isBurningFromBuilding) {
            IBuilding(from).handleProductionResourcesChanged();
        }
    }
}
