// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../core/assets/army/IArmy.sol";
import "../core/assets/era/IEra.sol";
import "../core/assets/IWorldAsset.sol";
import "../core/assets/battle/IBattle.sol";
import "../libraries/MathExtension.sol";

/// @title Army view contract
/// @notice Contains helper functions to query army in simple read requests
contract ArmyView {
    struct ArmyCombinedData {
        address id;
        address owner;
        address ownerSettlementId;
        uint64 currentPosition;
        address currentPositionSettlementId;
        uint64 destinationPosition;
        address destinationPositionSettlementId;
        uint64 secretDestinationRegionId;
        bytes32 secretDestinationPosition;
        uint64 maneuverBeginTime;
        uint64 maneuverEndTime;
        address battleId;
        uint256[] units;
        uint256[] besiegingUnits;
        uint256 robberyPoints;
        uint64 stunBeginTime;
        uint64 stunEndTime;
    }

    /// @notice Calculates combined army data
    /// @dev Provided timestamp takes into account robberyPoints, maneuver, battle, stun
    /// @param armyAddress Army address
    /// @param timestamp Timestamp at which army data will be calculated
    /// @return armyCombinedData Army combined data
    function getArmyCombinedData(address armyAddress, uint256 timestamp)
        public
        view
        returns (ArmyCombinedData memory armyCombinedData)
    {
        if (timestamp == 0) {
            timestamp = block.timestamp;
        }

        IArmy army = IArmy(armyAddress);

        IWorld world = IWorldAsset(armyAddress).world();
        IEra era = IWorldAsset(armyAddress).era();

        bytes32[] memory unitTypeIds = Config.getUnitTypeIds();

        armyCombinedData.id = armyAddress;

        armyCombinedData.currentPosition = army.currentPosition();
        armyCombinedData.currentPositionSettlementId = address(era.settlementByPosition(armyCombinedData.currentPosition));

        (armyCombinedData.stunBeginTime, armyCombinedData.stunEndTime) = army.stunInfo();
        (
            armyCombinedData.maneuverBeginTime,
            armyCombinedData.maneuverEndTime,
            armyCombinedData.destinationPosition,
            armyCombinedData.secretDestinationRegionId,
            armyCombinedData.secretDestinationPosition
        ) = army.maneuverInfo();

        armyCombinedData.destinationPositionSettlementId = armyCombinedData.maneuverEndTime != 0
            ? address(era.settlementByPosition(armyCombinedData.destinationPosition))
            : address(0);

        if (armyCombinedData.maneuverEndTime != 0 && timestamp >= armyCombinedData.maneuverEndTime) {
            armyCombinedData.currentPosition = armyCombinedData.destinationPosition;
            armyCombinedData.currentPositionSettlementId = armyCombinedData.destinationPositionSettlementId;
            armyCombinedData.destinationPosition = 0;
            armyCombinedData.destinationPositionSettlementId = address(0);

            uint64 maneuverDuration = armyCombinedData.maneuverEndTime - armyCombinedData.maneuverBeginTime;
            uint64 maneuverStunDuration = uint64(Config.maneuverStunDuration / Config.globalMultiplier);
            uint64 maneuverStunBeginTime = armyCombinedData.maneuverEndTime;
            uint64 maneuverStunEndTime = maneuverStunBeginTime + maneuverStunDuration;

            if (maneuverStunEndTime > armyCombinedData.stunEndTime) {
                armyCombinedData.stunBeginTime = maneuverStunBeginTime;
                armyCombinedData.stunEndTime = maneuverStunEndTime;
            }

            armyCombinedData.maneuverBeginTime = 0;
            armyCombinedData.maneuverEndTime = 0;
        }

        armyCombinedData.owner = _getArmyOwner(army);
        armyCombinedData.ownerSettlementId = address(army.relatedSettlement());

        armyCombinedData.units = new uint256[](unitTypeIds.length);

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            armyCombinedData.units[i] = era.units(unitTypeIds[i]).balanceOf(armyAddress);
        }

        armyCombinedData.battleId = address(army.battle());
        if (armyCombinedData.battleId != address(0)) {
            IBattle battle = IBattle(armyCombinedData.battleId);
            if (_canEndBattleAtProvidedTimestamp(battle, timestamp)) {
                (bool isArmyWon, uint256[] memory casualties) = battle.calculateArmyCasualties(armyAddress);
                for (uint256 i = 0; i < unitTypeIds.length; i++) {
                    armyCombinedData.units[i] = armyCombinedData.units[i] - casualties[i];
                }

                (uint64 battleBeginTime, uint64 battleDuration,) = battle.battleTimeInfo();
                uint256 battleStunMultiplier = isArmyWon
                    ? Config.battleDurationWinningArmyStunMultiplier
                    : Config.battleDurationLosingArmyStunMultiplier;

                uint64 stunDuration = uint64(battleDuration * battleStunMultiplier / 1e18);
                uint64 battleStunBeginTime = battleBeginTime + battleDuration;
                uint64 battleStunEndTime = battleStunBeginTime + stunDuration;

                if (battleStunEndTime > armyCombinedData.stunEndTime) {
                    armyCombinedData.stunBeginTime = battleStunBeginTime;
                    armyCombinedData.stunEndTime = battleStunEndTime;
                }

                armyCombinedData.battleId = address(0);
            }
        }

        if (timestamp >= armyCombinedData.stunEndTime) {
            armyCombinedData.stunBeginTime = 0;
            armyCombinedData.stunEndTime = 0;
        }

        if (!_isCultistsArmy(army)) {
            ISiege siegeOnCurrentPosition = ISettlement(armyCombinedData.currentPositionSettlementId).siege();
            armyCombinedData.robberyPoints = siegeOnCurrentPosition.getArmyRobberyPoints(armyAddress, timestamp);
            armyCombinedData.besiegingUnits = siegeOnCurrentPosition.getArmyBesiegingUnitsAmounts(armyAddress);
        }
    }

    /// @dev Calculates army owner
    function _getArmyOwner(IArmy army) internal view returns (address) {
        return !_isCultistsArmy(army) ? army.relatedSettlement().getSettlementOwner() : address(0);
    }

    /// @dev Calculates if army owner is cultists settlement or not
    function _isCultistsArmy(IArmy army) internal view returns (bool) {
        return address(army.relatedSettlement()) == address(army.relatedSettlement().relatedRegion().cultistsSettlement());
    }

    /// @dev Calculates if battle can be ended at provided timestamp
    function _canEndBattleAtProvidedTimestamp(
        IBattle battle,
        uint256 timestamp
    ) internal view returns (bool) {
        (uint64 beginTime, uint64 battleDuration, ) = battle.battleTimeInfo();
        return beginTime > 0 && timestamp >= beginTime + battleDuration;
    }
}
