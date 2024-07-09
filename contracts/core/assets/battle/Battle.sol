// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "./IBattle.sol";
import "../army/IArmy.sol";
import "../../../libraries/MathExtension.sol";
import "../../IRegistry.sol";
import "../WorldAsset.sol";
import "../../../const/GameAssetTypes.sol";

contract Battle is WorldAsset, IBattle {
    struct BattleWithCultistsInitiationInfo {
        bytes32[] maxUnitTypeIdsToAttack;
        uint256[] maxUnitsToAttack;
    }

    /// @dev Specifies amount of cultists to draw into the battle if battle is initiated by attacking them
    BattleWithCultistsInitiationInfo private battleWithCultistsInitiationInfo;

    /// @inheritdoc IBattle
    uint64 public override position;
    /// @inheritdoc IBattle
    mapping(uint256 => mapping(bytes32 => uint256)) public override sideUnitsAmount;
    /// @inheritdoc IBattle
    mapping(address => mapping(bytes32 => uint256)) public override armyUnitsAmount;
    /// @inheritdoc IBattle
    mapping(address => mapping(bytes32 => uint256)) public override armyUnitsAdditionalMultipliers;
    /// @inheritdoc IBattle
    mapping(uint256 => mapping(bytes32 => uint256)) public override casualties;
    /// @inheritdoc IBattle
    mapping(address => uint256) public override armySide;
    /// @inheritdoc IBattle
    BattleTimeInfo public override battleTimeInfo;
    /// @inheritdoc IBattle
    uint256 public override winningSide;

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {
        (
            address attackerArmyAddress,
            address attackedArmyAddress,
            bytes32[] memory maxUnitTypeIdsToAttack,
            uint256[] memory maxUnitsToAttack
        ) = abi.decode(initParams, (address, address, bytes32[], uint256[]));

        IArmy attackerArmy = IArmy(attackerArmyAddress);
        IArmy attackedArmy = IArmy(attackedArmyAddress);

        position = attackerArmy.getCurrentPosition();

        battleTimeInfo.beginTime = uint64(block.timestamp);

        bool isCultistsAttacked = _isCultistsArmy(attackedArmyAddress);

        if (!isCultistsAttacked) {
            if (_isArmyUnitsExceeds(attackedArmyAddress, maxUnitTypeIdsToAttack, maxUnitsToAttack)) revert BattleCannotBeCreatedWhenArmyUnitsExceedDesiredAmountToAttack();
        } else {
            uint256 totalUnitsToAttack = 0;

            for (uint256 i = 0; i < maxUnitTypeIdsToAttack.length; i++) {
                bytes32 unitTypeId = maxUnitTypeIdsToAttack[i];
                uint256 maxUnitAmountToAttack = maxUnitsToAttack[i];

                battleWithCultistsInitiationInfo.maxUnitTypeIdsToAttack.push(maxUnitTypeIdsToAttack[i]);
                battleWithCultistsInitiationInfo.maxUnitsToAttack.push(maxUnitsToAttack[i]);

                totalUnitsToAttack += maxUnitAmountToAttack;
            }

            if (totalUnitsToAttack == 0) revert BattleCannotBeCreatedByDesiringToAttackCultistsArmyWithoutUnits();
        }

        (, uint64 attackedArmyManeuverEndTime,,,) = attackedArmy.maneuverInfo();

        uint256 maxBattleDuration = 0;
        // If attackedArmy maneuvering openly (has endTime and its bigger than battle begin time) -> battle duration is reduced
        if (attackedArmyManeuverEndTime > battleTimeInfo.beginTime) {
            maxBattleDuration = attackedArmyManeuverEndTime - battleTimeInfo.beginTime;

            // However it cannot be reduced lower than minimum battle duration
            if (maxBattleDuration < registry().getMinimumBattleDuration()) revert BattleCannotBeCreatedWhenAttackedArmyIsAlmostOnAnotherPosition();
        }

        battleTimeInfo.duration = getBattleDuration(
            isCultistsAttacked,
            maxBattleDuration,
            _calculateUnitsAmount(attackerArmyAddress),
            _calculateUnitsAmount(attackedArmyAddress)
        );

        attackerArmy.joinBattle(address(this), 1);
        attackedArmy.joinBattle(address(this), 2);
    }

    /// @inheritdoc IBattle
    function isLobbyTime() public view override returns (bool) {
        uint256 _gameEndTime = world().gameEndTime();
        uint256 currentTimestamp = _gameEndTime == 0 ? block.timestamp : Math.min(block.timestamp, _gameEndTime);

        uint256 lobbyEndTime = battleTimeInfo.beginTime + battleTimeInfo.duration;
        return currentTimestamp >= battleTimeInfo.beginTime && currentTimestamp < lobbyEndTime;
    }

    /// @inheritdoc IBattle
    function acceptArmyInBattle(
        address armyAddress,
        uint256 side
    ) public override onlyWorldAssetFromSameEra {
        bytes32[] memory allUnitTypeIds = registry().getUnitTypeIds();

        // 1. Add units to battle based on army type
        // If cultists -> add selected amount
        // Else -> Add all
        bool isCultistsArmy = _isCultistsArmy(armyAddress);
        bytes32[] memory unitTypeIds = isCultistsArmy
            ? battleWithCultistsInitiationInfo.maxUnitTypeIdsToAttack
            : allUnitTypeIds;

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            bytes32 unitTypeId = unitTypeIds[i];

            uint256 actualUnitsAmount = era().units(unitTypeId).balanceOf(armyAddress);
            uint256 amountOfUnitsToJoinBattle = actualUnitsAmount;

            if (isCultistsArmy) {
                uint256 desiredUnitsAmount = battleWithCultistsInitiationInfo.maxUnitsToAttack[i];
                if (actualUnitsAmount < desiredUnitsAmount) revert BattleCannotAcceptCultistsArmyWhenCultistsAmountChangedToLowerValueThanDesired();

                amountOfUnitsToJoinBattle = desiredUnitsAmount;
            }

            uint256 additionalUnitMultiplier = IArmy(armyAddress).additionalUnitsBattleMultipliers(unitTypeId);
            uint256 multipliedUnitsAmount = amountOfUnitsToJoinBattle * (1e18 + additionalUnitMultiplier) / 1e18;

            sideUnitsAmount[side][unitTypeId] += multipliedUnitsAmount;
            armyUnitsAmount[armyAddress][unitTypeId] = multipliedUnitsAmount;
            armyUnitsAdditionalMultipliers[armyAddress][unitTypeId] = additionalUnitMultiplier;
        }

        // 2. Check if opposite side has units in order to launch battle casualties calculation
        bool hasUnitsInOppositeSide = false;
        uint256 oppositeSide = side == 1 ? 2 : 1;
        for (uint256 i = 0; i < allUnitTypeIds.length; i++) {
            if (sideUnitsAmount[oppositeSide][allUnitTypeIds[i]] > 0) {
                hasUnitsInOppositeSide = true;
                break;
            }
        }

        armySide[armyAddress] = side;

        if (hasUnitsInOppositeSide) {
            _calculateAndSaveCasualties();
        }

        emit ArmyJoined(armyAddress, side);
    }

    /// @inheritdoc IBattle
    function canEndBattle() public view override returns (bool) {
        uint256 _gameEndTime = world().gameEndTime();
        uint256 currentTimestamp = _gameEndTime == 0 ? block.timestamp : Math.min(block.timestamp, _gameEndTime);

        return battleTimeInfo.beginTime > 0 && currentTimestamp >= battleTimeInfo.beginTime + battleTimeInfo.duration;
    }

    /// @inheritdoc IBattle
    function isEndedBattle() public view override returns (bool) {
        return battleTimeInfo.endTime != 0;
    }

    /// @inheritdoc IBattle
    function calculateArmyCasualties(address armyAddress)
        public
        view
        override
        returns (bool, uint256[] memory)
    {
        uint256 side = armySide[armyAddress];

        bytes32[] memory unitTypeIds = registry().getUnitTypeIds();

        uint256[] memory result = new uint256[](unitTypeIds.length);

        bool isArmyWon = side == winningSide;

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            bytes32 unitTypeId = unitTypeIds[i];

            uint256 _sideUnitsAmount = sideUnitsAmount[side][unitTypeId];
            uint256 _armyUnitsAmount = armyUnitsAmount[armyAddress][unitTypeId];

            if (_sideUnitsAmount == 0 || _armyUnitsAmount == 0) {
                continue;
            }

            uint256 percent = (_armyUnitsAmount * 1e18) / _sideUnitsAmount;
            uint256 sideUnitsCasualties = casualties[side][unitTypeId];
            uint256 armyUnitMultiplier = 1e18 + armyUnitsAdditionalMultipliers[armyAddress][unitTypeId];

            uint256 armyCasualties = (sideUnitsCasualties * percent) / armyUnitMultiplier;

            if (armyCasualties == 0) {
                continue;
            }

            uint256 integerArmyCasualties = MathExtension.roundDownWithPrecision(armyCasualties, 1e18);
            if (!isArmyWon) {
                uint256 roundedUpIntegerArmyCasualties = MathExtension.roundUpWithPrecision(armyCasualties, 1e18);
                integerArmyCasualties = _armyUnitsAmount >= roundedUpIntegerArmyCasualties
                    ? roundedUpIntegerArmyCasualties
                    : integerArmyCasualties;
            }

            result[i] = integerArmyCasualties;
        }

        return (isArmyWon, result);
    }

    /// @inheritdoc IBattle
    function calculateBattleDuration(
        uint256 globalMultiplier,
        uint256 baseBattleDuration,
        uint256 minimumBattleDuration,
        bool isCultistsAttacked,
        uint256 side1UnitsAmount,
        uint256 side2UnitsAmount,
        uint256 maxBattleDuration
    ) public view override returns (uint64) {
        if (side1UnitsAmount == 0 || side2UnitsAmount == 0) revert BattleCannotBeCreatedWithArmiesHavingZeroUnits();

        uint64 battleDuration = uint64(baseBattleDuration / globalMultiplier);
        if (!isCultistsAttacked) {
            if (side1UnitsAmount >= side2UnitsAmount && side1UnitsAmount / side2UnitsAmount > 1) {
                battleDuration = uint64(battleDuration * 2 * side2UnitsAmount / side1UnitsAmount);
            }

            if (side2UnitsAmount > side1UnitsAmount && side2UnitsAmount / side1UnitsAmount > 1) {
                battleDuration = uint64(battleDuration * 2 * side1UnitsAmount / side2UnitsAmount);
            }
        }

        if (maxBattleDuration != 0 && maxBattleDuration < battleDuration) {
            battleDuration = uint64(maxBattleDuration);
        }

        if (battleDuration < minimumBattleDuration) {
            battleDuration = uint64(minimumBattleDuration);
        }

        return battleDuration;
    }

    /// @inheritdoc IBattle
    function getBattleDuration(
        bool isCultistsAttacked,
        uint256 maxBattleDuration,
        uint256 side1UnitsAmount,
        uint256 side2UnitsAmount
    ) public view override returns (uint64) {
        uint256 globalMultiplier = registry().getGlobalMultiplier();
        uint256 baseBattleDuration = registry().getBaseBattleDuration();
        uint256 minimumBattleDuration = registry().getMinimumBattleDuration();

        return calculateBattleDuration(
            globalMultiplier,
            baseBattleDuration,
            minimumBattleDuration,
            isCultistsAttacked,
            side1UnitsAmount,
            side2UnitsAmount,
            maxBattleDuration
        );
    }

    /// @inheritdoc IBattle
    function endBattle() public override {
        if (!canEndBattle()) revert BattleCannotBeFinishedAtThisTime();
        if (isEndedBattle()) revert BattleCannotBeFinishedMoreThanOnce();

        battleTimeInfo.endTime = uint64(battleTimeInfo.beginTime + battleTimeInfo.duration);

        emit BattleEnded(battleTimeInfo.endTime);

        // In case if battle is ended on cultists position & cultists are in this battle
        // => update cultists army state (aka remove them from ended battle)
        ISettlement settlementOnThisPosition = era().settlementByPosition(position);
        bytes32 settlementAssetTypeId = IWorldAssetStorageAccessor(address(settlementOnThisPosition)).assetTypeId();

        if (settlementAssetTypeId == CULTISTS_SETTLEMENT_TYPE_ID) {
            IArmy cultistsArmy = settlementOnThisPosition.army();
            if (address(cultistsArmy.battle()) == address(this)) {
                cultistsArmy.updateState();
            }
        }
    }

    /// @inheritdoc IBattle
    function calculateStage1Casualties()
        public
        view
        override
        returns (
            uint256[] memory _side1Casualties,
            uint256[] memory _side2Casualties,
            bytes memory stageParams
        )
    {
        bytes32[] memory unitTypeIds = registry().getUnitTypeIds();

        _side1Casualties = new uint256[](unitTypeIds.length);
        _side2Casualties = new uint256[](unitTypeIds.length);

        uint256 side1Offense;
        uint256 side2Offense;

        uint256 side1Defence;
        uint256 side2Defence;

        // 1st stage
        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            bytes32 unitTypeId = unitTypeIds[i];

            IRegistry.UnitStats memory unitStats = registry().getUnitStats(unitTypeId);

            side1Offense += sideUnitsAmount[1][unitTypeId] * unitStats.offenseStage1 * 1e18;
            side2Offense += sideUnitsAmount[2][unitTypeId] * unitStats.offenseStage1 * 1e18;

            side1Defence += sideUnitsAmount[1][unitTypeId] * unitStats.defenceStage1 * 1e18;
            side2Defence += sideUnitsAmount[2][unitTypeId] * unitStats.defenceStage1 * 1e18;
        }

        stageParams = abi.encode(side1Offense, side2Offense, side1Defence, side2Defence);

        uint256 side1LossPercentageAfterStage1 = _calculateSideLossPercentage(
            side2Offense,
            side1Defence,
            battleTimeInfo.duration,
            registry().getBaseBattleDuration() / registry().getGlobalMultiplier()
        );

        uint256 side2LossPercentageAfterStage1 = _calculateSideLossPercentage(
            side1Offense,
            side2Defence,
            battleTimeInfo.duration,
            registry().getBaseBattleDuration() / registry().getGlobalMultiplier()
        );

        // 2nd stage
        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            bytes32 unitTypeId = unitTypeIds[i];

            uint256 side1UnitsLost = (sideUnitsAmount[1][unitTypeId] * side1LossPercentageAfterStage1) / 1e18;
            if (side1UnitsLost > sideUnitsAmount[1][unitTypeId]) {
                _side1Casualties[i] = sideUnitsAmount[1][unitTypeId];
            } else {
                _side1Casualties[i] = side1UnitsLost;
            }

            uint256 side2UnitsLost = (sideUnitsAmount[2][unitTypeId] * side2LossPercentageAfterStage1) / 1e18;
            if (side2UnitsLost > sideUnitsAmount[2][unitTypeId]) {
                _side2Casualties[i] = sideUnitsAmount[2][unitTypeId];
            } else {
                _side2Casualties[i] = side2UnitsLost;
            }
        }
    }

    /// @inheritdoc IBattle
    function calculateStage2Casualties(
        uint256[] memory stage1Side1Casualties,
        uint256[] memory stage1Side2Casualties
    )
        public
        view
        override
        returns (
            uint256[] memory _side1Casualties,
            uint256[] memory _side2Casualties,
            bytes memory stageParams
        )
    {
        bytes32[] memory unitTypeIds = registry().getUnitTypeIds();

        _side1Casualties = new uint256[](unitTypeIds.length);
        _side2Casualties = new uint256[](unitTypeIds.length);

        uint256 side1Offense;
        uint256 side2Offense;

        uint256 side1Defence;
        uint256 side2Defence;

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            bytes32 unitTypeId = unitTypeIds[i];

            IRegistry.UnitStats memory unitStats = registry().getUnitStats(unitTypeId);

            uint256 unitsARemaining = sideUnitsAmount[1][unitTypeId] - stage1Side1Casualties[i];
            uint256 unitsBRemaining = sideUnitsAmount[2][unitTypeId] - stage1Side2Casualties[i];

            side1Offense += unitsARemaining * unitStats.offenseStage2 * 1e18;
            side2Offense += unitsBRemaining * unitStats.offenseStage2 * 1e18;

            side1Defence += unitsARemaining * unitStats.defenceStage2 * 1e18;
            side2Defence += unitsBRemaining * unitStats.defenceStage2 * 1e18;
        }

        stageParams = abi.encode(side1Offense, side2Offense, side1Defence, side2Defence);

        // In case if no units left in either side -> no stage 2 casualties
        if (side1Defence == 0 || side2Defence == 0) {
            return (
                _side1Casualties,
                _side2Casualties,
                stageParams
            );
        }

        uint256 side1LossPercentageAfterStage2 = _calculateSideLossPercentage(
            side2Offense,
            side1Defence,
            battleTimeInfo.duration,
            registry().getBaseBattleDuration() / registry().getGlobalMultiplier()
        );

        uint256 side2LossPercentageAfterStage2 = _calculateSideLossPercentage(
            side1Offense,
            side2Defence,
            battleTimeInfo.duration,
            registry().getBaseBattleDuration() / registry().getGlobalMultiplier()
        );

       // result
       for (uint256 i = 0; i < unitTypeIds.length; i++) {
           bytes32 unitTypeId = unitTypeIds[i];

           {
               uint256 side1Units = sideUnitsAmount[1][unitTypeId] - stage1Side1Casualties[i];
               uint256 side1UnitsLost = (side1Units * side1LossPercentageAfterStage2) / 1e18;
               if (side1UnitsLost >= side1Units) {
                   _side1Casualties[i] = side1Units;
               } else {
                   _side1Casualties[i] = side1UnitsLost;
               }
           }

           {
               uint256 side2Units = sideUnitsAmount[2][unitTypeId] - stage1Side2Casualties[i];
               uint256 side2UnitsLost = (side2Units * side2LossPercentageAfterStage2) / 1e18;
               if (side2UnitsLost >= side2Units) {
                   _side2Casualties[i] = side2Units;
               } else {
                   _side2Casualties[i] = side2UnitsLost;
               }
           }
       }
    }

    /// @inheritdoc IBattle
    function calculateAllCasualties()
        public
        view
        override
        returns (
            uint256[] memory,
            uint256[] memory,
            uint256 //Winning side (0 - both sides lost, 1 - side A Won, 2 - side B Won
        )
    {
        //calculate stage1 casualties (based on initial sides)
        (
            uint256[] memory stage1Side1Casualties,
            uint256[] memory stage1Side2Casualties,
            bytes memory stage1Params
        ) = calculateStage1Casualties();

        //calculate stage2 casualties (based on (initial-stage1Losses))
        (
            uint256[] memory stage2Side1Casualties,
            uint256[] memory stage2Side2Casualties,
            bytes memory stage2Params
        ) = calculateStage2Casualties(
            stage1Side1Casualties,
            stage1Side2Casualties
        );

        uint256 calculatedWinningSide = _calculateWinningSide(
            stage1Params,
            stage2Params
        );

        uint256[] memory side1Casualties = new uint256[](stage1Side1Casualties.length);
        uint256[] memory side2Casualties = new uint256[](stage1Side2Casualties.length);

        for (uint256 i = 0; i < stage1Side1Casualties.length; i++) {
            side1Casualties[i] = stage1Side1Casualties[i] + stage2Side1Casualties[i];
            side2Casualties[i] = stage1Side2Casualties[i] + stage2Side2Casualties[i];
        }

        return (side1Casualties, side2Casualties, calculatedWinningSide);
    }

    /// @dev Calculate side loss percentage (in 1e18 precision)
    function _calculateSideLossPercentage(
        uint256 sideOffence,
        uint256 sideDefence,
        uint256 battleDuration,
        uint256 baseBattleDuration
    ) internal pure returns (uint256) {
        uint256 loweredByBattleTimeOffence = (sideOffence * battleDuration) / baseBattleDuration;
        return (loweredByBattleTimeOffence * 1e18) / sideDefence;
    }

    /// @dev Calculates total amount of units of specified army
    function _calculateUnitsAmount(address armyAddress) internal view returns (uint256) {
        bytes32[] memory unitTypeIds = registry().getUnitTypeIds();

        uint256 unitsAmount = 0;
        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            bytes32 unitTypeId = unitTypeIds[i];
            unitsAmount += era().units(unitTypeId).balanceOf(armyAddress);
        }

        return unitsAmount;
    }

    /// @dev Calculates and saves casualties
    function _calculateAndSaveCasualties() internal {
        (
            uint256[] memory _side1Casualties,
            uint256[] memory _side2Casualties,
            uint256 _winningSide
        ) = calculateAllCasualties();

        bytes32[] memory unitTypeIds = registry().getUnitTypeIds();

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            bytes32 unitTypeId = unitTypeIds[i];

            casualties[1][unitTypeId] = _side1Casualties[i];
            casualties[2][unitTypeId] = _side2Casualties[i];
        }

        winningSide = _winningSide;
    }

    /// @dev Calculates winning side by side-stage params
    function _calculateWinningSide(
        bytes memory stage1Params,
        bytes memory stage2Params
    ) internal view returns (uint256) {
        (
            uint256 stage1Side1Offence,
            uint256 stage1Side2Offence,
            uint256 stage1Side1Defence,
            uint256 stage1Side2Defence
        ) = abi.decode(stage1Params, (uint256, uint256, uint256, uint256));

        (
            uint256 stage2Side1Offence,
            uint256 stage2Side2Offence,
            uint256 stage2Side1Defence,
            uint256 stage2Side2Defence
        ) = abi.decode(stage2Params, (uint256, uint256, uint256, uint256));

        uint256 calculatedWinningSide = 0;

        // Loss coefficient split in 2 because, for example, in 1st stage there could be no units left in either side
        // And this means -> no second stage
        uint256 side1LossCoefficient = stage1Side2Offence * 1e18 / stage1Side1Defence;
        uint256 side2LossCoefficient = stage1Side1Offence * 1e18 / stage1Side2Defence;

        if (stage2Side1Defence > 0 && stage2Side2Defence > 0) {
            side1LossCoefficient += stage2Side2Offence * 1e18 / stage2Side1Defence;
            side2LossCoefficient += stage2Side1Offence * 1e18 / stage2Side2Defence;
        }

        if (side1LossCoefficient > side2LossCoefficient) {
            calculatedWinningSide = 2;
        }

        if (side1LossCoefficient < side2LossCoefficient) {
            calculatedWinningSide = 1;
        }

        return calculatedWinningSide;
    }

    /// @dev Checks if provided army address belongs to cultists settlement or not
    function _isCultistsArmy(address armyAddress) internal view returns (bool) {
        address armiesSettlementAddress = address(IArmy(armyAddress).relatedSettlement());
        return IWorldAssetStorageAccessor(armiesSettlementAddress).assetTypeId() == CULTISTS_SETTLEMENT_TYPE_ID;
    }

    /// @dev Calculates if provided army has more than specified units
    function _isArmyUnitsExceeds(
        address armyAddress,
        bytes32[] memory unitTypeIds,
        uint256[] memory maxUnits
    ) internal view returns (bool) {
        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            uint256 balance = era().units(unitTypeIds[i]).balanceOf(armyAddress);
            if (balance > maxUnits[i]) {
                return true;
            }
        }

        return false;
    }
}
