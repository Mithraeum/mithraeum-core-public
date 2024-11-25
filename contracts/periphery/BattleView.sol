// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "../core/assets/battle/IBattle.sol";
import "../core/assets/IWorldAsset.sol";

/// @title Battle view contract
/// @notice Contains helper functions to query battle in simple read requests
contract BattleView {
    struct BattleCombinedData {
        address id;
        uint64 battleBeginTime;
        uint64 battleDuration;
        uint64 battleEndDate;
        address battleSettlementId;
        uint64 battleGamePosition;
        uint256[] side1Casualties;
        uint256[] side2Casualties;
        uint256[] side1UnitsAmount;
        uint256[] side2UnitsAmount;
    }

    /// @notice Calculates combined battle data
    /// @dev In case of very big battle, this function may not work due to array nature of battle sides
    /// @param battleAddress Battle address
    /// @return battleCombinedData Battle combined data
    function getBattleCombinedData(address battleAddress) public view returns (BattleCombinedData memory battleCombinedData) {
        IBattle battle = IBattle(battleAddress);
        IWorld world = IWorldAsset(battleAddress).world();
        IEra era = IWorldAsset(battleAddress).era();

        bytes32[] memory unitTypeIds = Config.getUnitTypeIds();

        uint256[] memory side1Casualties = new uint256[](unitTypeIds.length);
        uint256[] memory side2Casualties = new uint256[](unitTypeIds.length);

        uint256[] memory side1UnitsAmount = new uint256[](unitTypeIds.length);
        uint256[] memory side2UnitsAmount = new uint256[](unitTypeIds.length);

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            bytes32 unitTypeId = unitTypeIds[i];

            side1UnitsAmount[i] = battle.sideUnitsAmount(1, unitTypeId);
            side2UnitsAmount[i] = battle.sideUnitsAmount(2, unitTypeId);

            side1Casualties[i] = battle.casualties(1, unitTypeId);
            side2Casualties[i] = battle.casualties(2, unitTypeId);
        }

        IBattle.BattleTimeInfo memory battleTimeInfo = getBattleTimeInfo(battleAddress);
        uint64 position = IBattle(battleAddress).position();

        return
            BattleCombinedData({
                id: battleAddress,
                battleBeginTime: battleTimeInfo.beginTime,
                battleDuration: battleTimeInfo.duration,
                battleEndDate: battleTimeInfo.endTime,
                battleSettlementId: address(era.settlementByPosition(position)),
                battleGamePosition: position,
                side1UnitsAmount: side1UnitsAmount,
                side2UnitsAmount: side2UnitsAmount,
                side1Casualties: side1Casualties,
                side2Casualties: side2Casualties
            });
    }

    function getBattleTimeInfo(address battleAddress) public view returns (IBattle.BattleTimeInfo memory battleTimeInfo) {
        IBattle battle = IBattle(battleAddress);
        (uint64 beginTime, uint64 duration, uint64 endTime) = battle.battleTimeInfo();

        battleTimeInfo.beginTime = beginTime;
        battleTimeInfo.duration = duration;
        battleTimeInfo.endTime = endTime;
    }
}
