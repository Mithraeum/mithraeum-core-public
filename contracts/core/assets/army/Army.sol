// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/Math.sol";
import "./IArmy.sol";
import "../../IWorld.sol";
import "../settlement/ISettlement.sol";
import "../battle/IBattle.sol";
import "../era/IEra.sol";
import "../region/IRegion.sol";
import "../siege/ISiege.sol";
import "../../IRegistry.sol";
import "../../../libraries/MathExtension.sol";
import "../WorldAsset.sol";
import "../building/impl/IFort.sol";
import "../../../const/GameAssetTypes.sol";

contract Army is WorldAsset, IArmy {
    /// @inheritdoc IArmy
    ISettlement public override relatedSettlement;
    /// @inheritdoc IArmy
    uint64 public override currentPosition;
    /// @inheritdoc IArmy
    IBattle public override battle;
    /// @inheritdoc IArmy
    ManeuverInfo public override maneuverInfo;
    /// @inheritdoc IArmy
    StunInfo public override stunInfo;
    /// @inheritdoc IArmy
    mapping(bytes32 => uint256) public override additionalUnitsBattleMultipliers;
    /// @inheritdoc IArmy
    uint64 public override lastDemilitarizationTime;

    /// @dev Only ruler or world or world asset from same era modifier
    /// @dev Modifier is calling internal function in order to reduce contract size
    modifier onlyRulerOrWorldAssetFromSameEra() {
        _onlyRulerOrWorldAssetFromSameEra();
        _;
    }

    /// @inheritdoc WorldAsset
    function init(bytes memory initParams) public override initializer {
        (address settlementAddress) = abi.decode(initParams, (address));

        relatedSettlement = ISettlement(settlementAddress);
        currentPosition = relatedSettlement.position();
    }

    /// @inheritdoc IArmy
    function updateState() public override {
        if (_isInBattle()) {
            if (!battle.isEndedBattle() && battle.canEndBattle()) {
                battle.endBattle();
            }

            if (battle.isEndedBattle()) {
                IBattle oldBattle = battle;

                (bool isArmyWon, uint256[] memory unitsAmounts) = oldBattle.calculateArmyCasualties(address(this));

                // It is important to call 'setBattle' after 'burnUnits' because
                // burnUnits will trigger region.updateState and region.updateState rely on army.battle in order to properly save its time
                this.burnUnits(Config.getUnitTypeIds(), unitsAmounts);
                battle = IBattle(address(0));

                (uint64 battleBeginTime, uint64 battleDuration,) = oldBattle.battleTimeInfo();
                uint64 stunBeginTime = battleBeginTime + battleDuration;
                uint256 battleStunMultiplier = isArmyWon
                    ? Config.battleDurationWinningArmyStunMultiplier
                    : Config.battleDurationLosingArmyStunMultiplier;

                uint256 stunDuration = battleDuration * battleStunMultiplier / 1e18;
                _applyStun(stunBeginTime, stunDuration);

                emit ExitedFromBattle(address(oldBattle));
            }
        }

        if (_isManeuveringOpenly() && _hasComeToDestinationPosition()) {
            uint64 maneuverDuration = maneuverInfo.endTime - maneuverInfo.beginTime;
            uint64 stunBeginTime = maneuverInfo.endTime;
            uint256 stunDuration = Config.maneuverStunDuration / Config.globalMultiplier;

            currentPosition = maneuverInfo.destinationPosition;

            maneuverInfo = ManeuverInfo({
                beginTime: 0,
                endTime: 0,
                destinationPosition: 0,
                secretDestinationRegionId: 0,
                secretDestinationPosition: bytes32(0)
            });

            _applyStun(stunBeginTime, stunDuration);

            emit UpdatedPosition(address(era().settlementByPosition(currentPosition)), currentPosition);
        }

        if (_isStunned()) {
            uint256 _gameEndTime = world().gameEndTime();
            uint256 currentTimestamp = _gameEndTime == 0 ? block.timestamp : Math.min(block.timestamp, _gameEndTime);

            if (currentTimestamp >= stunInfo.endTime) {
                stunInfo.beginTime = 0;
                stunInfo.endTime = 0;
            }
        }
    }

    /// @inheritdoc IArmy
    function getOwner() public view override returns (address) {
        return relatedSettlement.getSettlementOwner();
    }

    /// @inheritdoc IArmy
    function burnUnits(bytes32[] memory unitTypeIds, uint256[] memory unitsAmounts)
        public
        override
        onlyWorldAssetFromSameEra
    {
        IEra _era = era();
        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            if (unitsAmounts[i] == 0) {
                continue;
            }

            IUnits units = _era.units(unitTypeIds[i]);
            uint256 unitsAmount = units.balanceOf(address(this));
            uint256 amountToBurn = unitsAmounts[i];
            if (amountToBurn > unitsAmount) {
                amountToBurn = unitsAmount;
            }

            units.burn(amountToBurn);
        }
    }

    /// @inheritdoc IArmy
    function liquidateUnits(bytes32[] memory unitTypeIds, uint256[] memory unitsAmounts)
        public
        override
        onlyWorldAssetFromSameEra
    {
        this.burnUnits(unitTypeIds, unitsAmounts);

        // If liquidation occurs not at cultists position -> we give prosperity (and/or workers) for each liquidated unit to the settlement where army stands
        ISettlement settlementOnPosition = _getSettlementOnCurrentPosition();
        ISettlement cultistsSettlementOnThisRegion = settlementOnPosition.relatedRegion().cultistsSettlement();
        IEra _era = era();

        if (address(cultistsSettlementOnThisRegion) != address(settlementOnPosition)) {
            uint256 prosperityForLiquidatedUnits = 0;
            uint256 workersForLiquidatedUnits = 0;
            for (uint256 i = 0; i < unitTypeIds.length; i++) {
                uint256 integerUnitsAmount = unitsAmounts[i] / 1e18;

                prosperityForLiquidatedUnits += integerUnitsAmount * Config.getProsperityForUnitLiquidation(unitTypeIds[i]);
                workersForLiquidatedUnits += integerUnitsAmount * Config.getWorkersForUnitLiquidation(unitTypeIds[i]);
            }

            if (prosperityForLiquidatedUnits > 0) {
                settlementOnPosition.extendProsperity(prosperityForLiquidatedUnits);
            }

            if (workersForLiquidatedUnits > 0) {
                _era.workers().mint(
                    address(settlementOnPosition),
                    MathExtension.roundDownWithPrecision(workersForLiquidatedUnits, 1e18)
                );
            }
        }
    }

    /// @inheritdoc IArmy
    function beginOpenManeuver(uint64 position, uint256 foodToSpendOnAcceleration)
        public
        override
        onlyActiveGame
        onlyRulerOrWorldAssetFromSameEra
    {
        updateState();

        if (_isStunned()) revert ArmyIsStunned();
        if (isManeuvering()) revert ArmyIsManeuvering();
        if (_isInBattle()) revert ArmyIsInBattle();
        if (_isBesieging()) revert ArmyIsInSiege();
        if (currentPosition == position) revert ArmyCannotManeuverToSamePosition();

        address destinationSettlementAddress = address(era().settlementByPosition(position));
        bool hasSettlementOnDestinationPosition = destinationSettlementAddress != address(0);

        if (!hasSettlementOnDestinationPosition) revert ArmyCannotManeuverToPositionWithoutSettlement();

        bool isEmptyArmy = _getArmyTotalUnitsAmount(address(this)) == 0;

        if (isEmptyArmy) {
            bool isDestinationSettlementHomeSettlement = destinationSettlementAddress == address(relatedSettlement);

            if (!isDestinationSettlementHomeSettlement) revert ArmyWithoutUnitsCannotManeuverToNotHomeSettlement();
            if (foodToSpendOnAcceleration > 0) revert ArmyWithoutUnitsCannotAccelerate();
        }

        uint64 distanceBetweenPositions = world().geography().getDistanceBetweenPositions(currentPosition, position);
        uint256 defaultManeuverDuration = _calculateDefaultManeuverDuration(distanceBetweenPositions);

        uint256 maneuverDuration = defaultManeuverDuration;
        if (foodToSpendOnAcceleration > 0) {
            uint256 maxDecreasedManeuverDuration = _calculateMaxDecreasedManeuverDuration(distanceBetweenPositions);
            uint256 maxManeuverDurationReduction = defaultManeuverDuration - maxDecreasedManeuverDuration;

            uint256 maneuverDurationReduction = _speedUpArmyByBurningTreasuryOnCurrentPosition(
                maxManeuverDurationReduction,
                distanceBetweenPositions,
                foodToSpendOnAcceleration,
                FARM_TYPE_ID
            );

            maneuverDuration -= maneuverDurationReduction;
        }

        uint64 maneuverBeginTime = uint64(block.timestamp);
        uint64 maneuverEndTime = uint64(block.timestamp + maneuverDuration);

        maneuverInfo = ManeuverInfo({
            beginTime: maneuverBeginTime,
            endTime: maneuverEndTime,
            destinationPosition: position,
            secretDestinationRegionId: 0,
            secretDestinationPosition: bytes32(0)
        });

        emit ManeuveringBegan(
            position,
            0,
            bytes32(0),
            maneuverBeginTime,
            maneuverEndTime,
            foodToSpendOnAcceleration
        );
    }

    /// @inheritdoc IArmy
    function beginSecretManeuver(
        uint64 secretDestinationRegionId,
        bytes32 secretDestinationPosition
    )
        public
        override
        onlyActiveGame
        onlyRulerOrWorldAssetFromSameEra
    {
        updateState();

        if (_isStunned()) revert ArmyIsStunned();
        if (isManeuvering()) revert ArmyIsManeuvering();
        if (_isInBattle()) revert ArmyIsInBattle();
        if (_isBesieging()) revert ArmyIsInSiege();
        if (_getArmyTotalUnitsAmount(address(this)) == 0) revert ArmyWithoutUnitsCannotBeginSecretManeuver();

        uint64 maneuverInfoBeginTime = uint64(block.timestamp);

        maneuverInfo.beginTime = maneuverInfoBeginTime;
        maneuverInfo.secretDestinationRegionId = secretDestinationRegionId;
        maneuverInfo.secretDestinationPosition = secretDestinationPosition;

        emit ManeuveringBegan(
            0,
            secretDestinationRegionId,
            secretDestinationPosition,
            maneuverInfoBeginTime,
            0,
            0
        );
    }

    /// @inheritdoc IArmy
    function revealSecretManeuver(uint64 destinationPosition, bytes32 revealKey, uint256 woodToSpendOnAcceleration)
        public
        override
        onlyActiveGame
    {
        updateState();

        ManeuverInfo memory _maneuverInfo = maneuverInfo;

        if (!_isManeuveringSecretly()) revert ArmyIsNotManeuveringSecretly();
        if (keccak256(abi.encodePacked(destinationPosition, revealKey)) != _maneuverInfo.secretDestinationPosition) revert WrongSecretManeuverRevealInfo();

        uint64 distanceBetweenPositions = world().geography().getDistanceBetweenPositions(currentPosition, destinationPosition);
        uint256 defaultManeuverDuration = _calculateDefaultManeuverDuration(distanceBetweenPositions);
        uint256 maneuverEndTimeWithoutAcceleration = _maneuverInfo.beginTime + defaultManeuverDuration;

        if (woodToSpendOnAcceleration > 0) {
            if (_isStunned()) revert ArmyIsStunned();
            if (_isInBattle()) revert ArmyIsInBattle();

            uint256 maxDecreasedManeuverDuration = _calculateMaxDecreasedManeuverDuration(distanceBetweenPositions);

            uint256 minAllowedRevealTime = _maneuverInfo.beginTime + maxDecreasedManeuverDuration;
            uint256 maxAllowedRevealTime = _maneuverInfo.beginTime + defaultManeuverDuration;

            if (block.timestamp < minAllowedRevealTime || block.timestamp >= maxAllowedRevealTime) revert SecretManeuverRevealNotPossibleAtThisTime();
        } else {
            if (_isInBattle()) {
                (uint64 battleBeginTime, uint64 battleDuration,) = battle.battleTimeInfo();
                uint256 projectedBattleEndTime = uint256(battleBeginTime + battleDuration);

                if (projectedBattleEndTime >= maneuverEndTimeWithoutAcceleration) revert SecretManeuverRevealNotPossibleAtThisTime();

                uint256 minAllowedRevealTime = _maneuverInfo.beginTime;
                uint256 maxAllowedRevealTime = maneuverEndTimeWithoutAcceleration;

                if (block.timestamp < minAllowedRevealTime || block.timestamp >= maxAllowedRevealTime) revert SecretManeuverRevealNotPossibleAtThisTime();
            } else {
                uint256 minAllowedRevealTime = _maneuverInfo.beginTime;
                uint256 maxAllowedRevealTime = maneuverEndTimeWithoutAcceleration;

                if (block.timestamp < minAllowedRevealTime || block.timestamp >= maxAllowedRevealTime) revert SecretManeuverRevealNotPossibleAtThisTime();
            }
        }

        ISettlement destinationSettlement = era().settlementByPosition(destinationPosition);
        if (address(destinationSettlement) == address(0)) revert ArmyCannotManeuverToPositionWithoutSettlement();
        if (destinationPosition == currentPosition) revert ArmyCannotManeuverToSamePosition();

        uint64 regionIdOfDestinationPosition = destinationSettlement.relatedRegion().regionId();
        if (_maneuverInfo.secretDestinationRegionId != regionIdOfDestinationPosition) revert SecretManeuverRevealNotPossibleToNotSpecifiedRegion();

        uint256 maneuverDuration = defaultManeuverDuration;
        if (woodToSpendOnAcceleration > 0) {
            uint256 maxManeuverDurationReduction = maneuverEndTimeWithoutAcceleration - block.timestamp;
            uint256 maneuverDurationReduction = _speedUpArmyByBurningTreasuryOnCurrentPosition(
                maxManeuverDurationReduction,
                distanceBetweenPositions,
                woodToSpendOnAcceleration,
                LUMBERMILL_TYPE_ID
            );

            maneuverDuration -= maneuverDurationReduction;
        }

        uint64 maneuverEndTime = _maneuverInfo.beginTime + uint64(maneuverDuration);

        maneuverInfo.endTime = maneuverEndTime;
        maneuverInfo.destinationPosition = destinationPosition;
        maneuverInfo.secretDestinationRegionId = 0;
        maneuverInfo.secretDestinationPosition = bytes32(0);

        // Event is emitted with old maneuverInfo because it is important to know old secret maneuver info at the moment of event emission
        emit ManeuveringBegan(
            destinationPosition,
            _maneuverInfo.secretDestinationRegionId,
            _maneuverInfo.secretDestinationPosition,
            _maneuverInfo.beginTime,
            maneuverEndTime,
            woodToSpendOnAcceleration
        );
    }

    /// @inheritdoc IArmy
    function cancelSecretManeuver()
        public
        override
        onlyActiveGame
        onlyRulerOrWorldAssetFromSameEra
    {
        updateState();

        if (!_isManeuveringSecretly()) revert ArmyIsNotManeuveringSecretly();
        if (_isStunned()) revert ArmyIsStunned();
        if (_isInBattle()) revert ArmyIsInBattle();

        IEra _era = era();

        uint256 stunDuration = Config.stunDurationOfCancelledSecretManeuver / Config.globalMultiplier;

        _applyStun(uint64(block.timestamp), stunDuration);

        maneuverInfo.beginTime = 0;
        maneuverInfo.secretDestinationRegionId = 0;
        maneuverInfo.secretDestinationPosition = bytes32(0);

        bytes32[] memory unitTypeIds = Config.getUnitTypeIds();
        uint256[] memory unitsAmounts = new uint256[](unitTypeIds.length);

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            unitsAmounts[i] = _era.units(unitTypeIds[i]).balanceOf(address(this));
        }

        this.liquidateUnits(unitTypeIds, unitsAmounts);

        emit SecretManeuverCancelled();
    }

    /// @inheritdoc IArmy
    function demilitarize(bytes32[] memory unitTypeIds, uint256[] memory unitsAmounts)
        public
        override
        onlyActiveGame
        onlyRulerOrWorldAssetFromSameEra
    {
        updateState();

        if (_isDemilitarizeOnCooldown()) revert ArmyCannotBeDemilitarizedDueToCooldown();
        if (_isStunned()) revert ArmyIsStunned();
        if (_isInBattle()) revert ArmyIsInBattle();

        IEra _era = era();

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            uint256 unitsAmount = unitsAmounts[i];
            if (unitsAmount == 0 || !MathExtension.isIntegerWithPrecision(unitsAmount, 1e18)) revert WrongDemilitarizationInput();

            uint256 actualUnitsAmount = _era.units(unitTypeIds[i]).balanceOf(address(this));
            if (actualUnitsAmount < unitsAmount) revert NotEnoughUnitsForDemilitarization();
        }

        this.liquidateUnits(unitTypeIds, unitsAmounts);

        lastDemilitarizationTime = uint64(block.timestamp);

        emit UnitsDemilitarized(unitTypeIds, unitsAmounts);
    }

    /// @inheritdoc IArmy
    function getCurrentPosition() public view override returns (uint64) {
        uint256 _gameEndTime = world().gameEndTime();
        uint256 currentTimestamp = _gameEndTime == 0 ? block.timestamp : Math.min(block.timestamp, _gameEndTime);

        if (_isManeuveringOpenly() && currentTimestamp >= maneuverInfo.endTime) {
            return maneuverInfo.destinationPosition;
        }

        return currentPosition;
    }

    /// @inheritdoc IArmy
    function beginBattle(
        address targetArmyAddress,
        bytes32[] calldata maxUnitTypeIdsToAttack,
        uint256[] calldata maxUnitsToAttack
    )
        public
        override
        onlyActiveGame
        onlyRulerOrWorldAssetFromSameEra
    {
        updateState();
        IArmy targetArmy = IArmy(targetArmyAddress);

        targetArmy.updateState();

        IWorld _world = world();
        uint256 _eraNumber = eraNumber();

        if (_world.worldAssets(_eraNumber, targetArmyAddress) != ARMY_GROUP_TYPE_ID) revert ArmyCannotAttackNotCurrentEraArmy();
        if (address(this) == targetArmyAddress) revert ArmyCannotAttackItself();
        if (_isStunned()) revert ArmyIsStunned();
        if (isManeuvering()) revert ArmyIsManeuvering();
        if (currentPosition != targetArmy.getCurrentPosition()) revert ArmyCannotAttackAnotherArmyIfTheyAreNotOnSamePosition();

        address newBattleAddress = worldAssetFactory().create(
            address(_world),
            _eraNumber,
            BATTLE_GROUP_TYPE_ID,
            BASIC_TYPE_ID,
            abi.encode(address(this), targetArmyAddress, maxUnitTypeIdsToAttack, maxUnitsToAttack)
        );

        emit BattleCreated(newBattleAddress, targetArmyAddress);
    }

    /// @inheritdoc IArmy
    function joinBattle(address battleAddress, uint256 side)
        public
        override
        onlyActiveGame
        onlyRulerOrWorldAssetFromSameEra
    {
        updateState();

        if (world().worldAssets(eraNumber(), battleAddress) != BATTLE_GROUP_TYPE_ID) revert ArmyCannotJoinToNotCurrentEraBattle();

        // If caller not the battle itself -> army cannot join if its maneuvering or stunned
        if (msg.sender != battleAddress) {
            if (isManeuvering()) revert ArmyIsManeuvering();
            if (_isStunned()) revert ArmyIsStunned();
        }

        if (_isInBattle()) revert ArmyIsInBattle();
        if (_getArmyTotalUnitsAmount(address(this)) == 0) revert ArmyWithoutUnitsCannotJoinBattle();
        if (side != 1 && side != 2) revert WrongJoinSide();

        IBattle battleToJoinTo = IBattle(battleAddress);
        if (!battleToJoinTo.isLobbyTime()) revert ArmyCannotJoinToBattleNotInLobbyPhase();
        if (battleToJoinTo.position() != currentPosition) revert ArmyCannotJoinToBattleNotAtSamePosition();

        battle = battleToJoinTo;

        bool isAttackingSide = side == 1;
        bool isFirstArmyInSide = !_hasUnitsInBattleAtProvidedSide(battleToJoinTo, side);

        battleToJoinTo.acceptArmyInBattle(address(this), side);

        if (isAttackingSide && !isFirstArmyInSide) {
            uint256 stunDuration = Config.armyStunDurationByJoiningBattleAtAttackingSide / Config.globalMultiplier;
            _applyStun(uint64(block.timestamp), stunDuration);
        }

        emit JoinedBattle(battleAddress, side);
    }

    /// @inheritdoc IArmy
    function modifySiege(
        bytes32[] calldata unitTypeIds,
        bool[] calldata toAddIndication,
        uint256[] calldata unitsAmounts,
        uint256 newRobberyMultiplier
    ) public override onlyActiveGame onlyRulerOrWorldAssetFromSameEra {
        updateState();

        if (_isStunned()) revert ArmyIsStunned();
        if (isManeuvering()) revert ArmyIsManeuvering();

        ISettlement settlementOnArmyPosition = _getSettlementOnCurrentPosition();

        if (address(settlementOnArmyPosition) == address(relatedSettlement)) revert ArmyCannotBesiegeOwnSettlement();

        bool hasUnitsToModify = false;

        // Grouped in order to reduce stack size
        {
            bool hasUnitsToAdd = false;

            for (uint256 i = 0; i < unitTypeIds.length; i++) {
                if (unitsAmounts[i] > 0) {
                    if (!hasUnitsToModify) {
                        hasUnitsToModify = true;
                    }

                    if (toAddIndication[i]) {
                        hasUnitsToAdd = true;
                    }
                }
            }

            if (hasUnitsToAdd && _isInBattle()) revert ArmyIsInBattle();
        }

        ISiege siege = settlementOnArmyPosition.siege();
        (uint256 oldRobberyMultiplier, , ) = siege.armyInfo(address(this));

        uint256 maxAllowedRobberyMultiplier = hasUnitsToModify
            ? Config.maxAllowedRobberyMultiplierIncreaseValue
            : oldRobberyMultiplier + Config.maxAllowedRobberyMultiplierIncreaseValue;

        if (newRobberyMultiplier > maxAllowedRobberyMultiplier) revert WrongRobberyMultiplierSpecified();
        if (!hasUnitsToModify && newRobberyMultiplier <= oldRobberyMultiplier) revert WrongRobberyMultiplierSpecified();

        siege.modifyArmySiege(
            address(this),
            unitTypeIds,
            toAddIndication,
            unitsAmounts,
            newRobberyMultiplier
        );

        uint256 robberyMultiplierPunishingValue = hasUnitsToModify
            ? newRobberyMultiplier
            : newRobberyMultiplier - oldRobberyMultiplier;

        uint256 stunDuration = (Config.armyStunDurationPerRobberyMultiplier * robberyMultiplierPunishingValue / 1e18) / Config.globalMultiplier;
        _applyStun(uint64(block.timestamp), stunDuration);

        if (siege.canLiquidateArmyBesiegingUnits(address(this))) revert ArmyCannotModifySiegeUnitsToLiquidatableState();
    }

    /// @inheritdoc IArmy
    function swapRobberyPointsForResourceFromBuildingTreasury(address buildingAddress, uint256 pointsToSpend)
        public
        override
        onlyActiveGame
        onlyRulerOrWorldAssetFromSameEra
    {
        updateState();

        if (_isStunned()) revert ArmyIsStunned();

        _getSettlementOnCurrentPosition().siege().swapRobberyPointsForResourceFromBuildingTreasury(buildingAddress, pointsToSpend);
    }

    /// @inheritdoc IArmy
    function getTotalSiegeSupport() public view override returns (uint256) {
        IEra _era = era();

        bytes32[] memory unitTypeIds = Config.getUnitTypeIds();
        uint256[] memory casualties = new uint256[](unitTypeIds.length);

        if (_isInBattle() && battle.canEndBattle()) {
            (, casualties) = battle.calculateArmyCasualties(address(this));
        }

        uint256 totalSiegeSupport = 0;
        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            bytes32 unitTypeId = unitTypeIds[i];
            Config.UnitStats memory unitStats = Config.getUnitStats(unitTypeId);

            totalSiegeSupport +=
                ((_era.units(unitTypeId).balanceOf(address(this)) - casualties[i]) * unitStats.siegeSupport) /
                1e18;
        }

        return totalSiegeSupport;
    }

    /// @inheritdoc IArmy
    function isAtHomePosition() public view override returns (bool) {
        if (_isManeuveringOpenly() && _hasComeToDestinationPosition()) {
            return maneuverInfo.destinationPosition == relatedSettlement.position();
        }

        return currentPosition == relatedSettlement.position();
    }

    /// @inheritdoc IArmy
    function isManeuvering() public view override returns (bool) {
        if (_isManeuveringOpenly() && !_hasComeToDestinationPosition()) {
            return true;
        }

        if (_isManeuveringSecretly()) {
            return true;
        }

        return false;
    }

    /// @inheritdoc IArmy
    function increaseUnitBattleMultiplier(bytes32 unitTypeId, uint256 unitBattleMultiplier) public override onlyWorldAssetFromSameEra {
        additionalUnitsBattleMultipliers[unitTypeId] += unitBattleMultiplier;
    }

    /// @inheritdoc IArmy
    function decreaseUnitBattleMultiplier(bytes32 unitTypeId, uint256 unitBattleMultiplier) public override onlyWorldAssetFromSameEra {
        additionalUnitsBattleMultipliers[unitTypeId] -= unitBattleMultiplier;
    }

    /// @inheritdoc IArmy
    function applySelfStun(uint64 stunDuration)
        public
        override
        onlyActiveGame
        onlyRulerOrWorldAssetFromSameEra
    {
        updateState();

        _applyStun(uint64(block.timestamp), stunDuration);
    }

    /// @dev Allows caller to be only ruler or any world asset
    function _onlyRulerOrWorldAssetFromSameEra() internal view {
        IWorld _world = world();

        if (!relatedSettlement.isRuler(msg.sender) &&
            msg.sender != address(_world) &&
            _world.worldAssets(eraNumber(), msg.sender) == bytes32(0)
        ) {
            revert OnlyRulerOrWorldAssetFromSameEra();
        }
    }

    /// @dev Calculates amount of needed resource per one second of decreased maneuver duration
    function _calculateResourceAmountPer1SecondOfDecreasedManeuverDuration() internal view returns (uint256) {
        IEra _era = era();

        bytes32[] memory unitTypeIds = Config.getUnitTypeIds();
        uint256 resourceAmountPer1SecondOfDecreasedManeuverDuration = 0;

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            uint256 unitsAmount = _era.units(unitTypeIds[i]).balanceOf(address(this));

            resourceAmountPer1SecondOfDecreasedManeuverDuration +=
                (unitsAmount / 1e18) * Config.getUnitResourceUsagePer1SecondOfDecreasedManeuverDuration(unitTypeIds[i]);
        }

        return resourceAmountPer1SecondOfDecreasedManeuverDuration * Config.globalMultiplier;
    }

    /// @dev Calculates total units amount
    function _getArmyTotalUnitsAmount(address armyAddress) internal view returns (uint256) {
        IEra _era = era();

        bytes32[] memory unitTypeIds = Config.getUnitTypeIds();
        uint256 totalUnitsAmount = 0;

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            totalUnitsAmount += _era.units(unitTypeIds[i]).balanceOf(armyAddress);
        }

        return totalUnitsAmount;
    }

    /// @dev Calculates default maneuver duration
    function _calculateDefaultManeuverDuration(uint64 distanceBetweenPositions) internal view returns (uint256) {
        return (5 hours * distanceBetweenPositions) / Config.globalMultiplier;
    }

    /// @dev Calculates max default maneuver duration
    function _calculateMaxDecreasedManeuverDuration(uint64 distanceBetweenPositions) internal view returns (uint256) {
        return ((5 hours * MathExtension.sqrt(distanceBetweenPositions * 1e8)) / 1e4) / Config.globalMultiplier;
    }

    /// @dev Updates building's treasury, burns resource specified for acceleration and returns maneuver duration duration reduction
    function _speedUpArmyByBurningTreasuryOnCurrentPosition(
        uint256 maxManeuverDurationReduction,
        uint64 distanceBetweenPositions,
        uint256 resourceToSpendOnAcceleration,
        bytes32 buildingTypeIdFromWhichBurnResource
    ) internal returns (uint256) {
        uint256 resourceAmountPer1SecondOfDecreasedManeuverDuration = _calculateResourceAmountPer1SecondOfDecreasedManeuverDuration();

        // Handles case when, for example, provided 123 resource but each second require 10 resource, actual provided value in this case is 120
        // or provided 7 food but each second require 10 resource => 0
        resourceToSpendOnAcceleration = resourceToSpendOnAcceleration - resourceToSpendOnAcceleration % resourceAmountPer1SecondOfDecreasedManeuverDuration;

        uint256 resourceAmountToMaxManeuverDurationReduction = maxManeuverDurationReduction * resourceAmountPer1SecondOfDecreasedManeuverDuration;

        if (resourceToSpendOnAcceleration > resourceAmountToMaxManeuverDurationReduction) {
            resourceToSpendOnAcceleration = resourceAmountToMaxManeuverDurationReduction;
        }

        ISettlement settlementOnPosition = _getSettlementOnCurrentPosition();
        bool isCultistsSettlementOnCurrentPosition = _isCultistsSettlement(settlementOnPosition);
        IArmy armyOfSettlementOnCurrentPosition = settlementOnPosition.army();

        if (isCultistsSettlementOnCurrentPosition) {
            // If settlement on current position is cultists settlement
            // -> we have to update its state in order to properly calculate whether free acceleration is possible
            armyOfSettlementOnCurrentPosition.updateState();

            if (_getArmyTotalUnitsAmount(address(armyOfSettlementOnCurrentPosition)) != 0) revert ArmyCannotAccelerateManeuverFromCultistsSettlementWithNonZeroCultistsArmy();
        }

        if (!isCultistsSettlementOnCurrentPosition) {
            IBuilding building = settlementOnPosition.buildings(buildingTypeIdFromWhichBurnResource);
            building.updateState();

            uint256 buildingTreasury = Math.min(
                era().resources(building.getProducingResourceTypeId()).stateBalanceOf(address(building)),
                building.getMaxTreasuryByLevel(building.getBuildingLevel())
            );

            if (buildingTreasury < resourceToSpendOnAcceleration) revert ArmyCannotUseMoreResourcesForAccelerationThanBuildingTreasuryHas();
            building.burnTreasury(resourceToSpendOnAcceleration);
        }

        return resourceToSpendOnAcceleration / resourceAmountPer1SecondOfDecreasedManeuverDuration;
    }

    /// @dev Checks if army is in battle
    function _isInBattle() internal view returns (bool) {
        return address(battle) != address(0);
    }

    /// @dev Checks if army is stunned
    function _isStunned() internal view returns (bool) {
        return stunInfo.endTime != 0;
    }

    /// @dev Check if demilitarize is on cooldown
    function _isDemilitarizeOnCooldown() internal view returns (bool) {
        return uint64(block.timestamp) < lastDemilitarizationTime + uint64(Config.demilitarizationCooldown / Config.globalMultiplier);
    }

    /// @dev Checks if army is maneuvering openly
    function _isManeuveringOpenly() internal view returns (bool) {
        return maneuverInfo.beginTime != 0 && maneuverInfo.endTime != 0;
    }

    /// @dev Checks if army is maneuvering secretly
    function _isManeuveringSecretly() internal view returns (bool) {
        return maneuverInfo.beginTime != 0 && maneuverInfo.secretDestinationPosition != bytes32(0);
    }

    /// @dev Checks if army can update position at the moment
    function _hasComeToDestinationPosition() internal view returns (bool) {
        uint256 _gameEndTime = world().gameEndTime();
        uint256 currentTimestamp = _gameEndTime == 0 ? block.timestamp : Math.min(block.timestamp, _gameEndTime);

        if (maneuverInfo.endTime != 0 && currentTimestamp >= maneuverInfo.endTime) {
            return true;
        }

        return false;
    }

    /// @dev Applies stun
    function _applyStun(
        uint64 stunBeginTime,
        uint256 stunDuration
    ) internal {
        if (stunDuration == 0) {
            return;
        }

        uint64 newStunEndTime = stunBeginTime + uint64(stunDuration);

        // If new stun ends later than old stun -> we overwrite old stun with new stun
        if (newStunEndTime > stunInfo.endTime) {
            stunInfo.endTime = newStunEndTime;
            stunInfo.beginTime = stunBeginTime;
            emit StunApplied(stunBeginTime, newStunEndTime);
        }
    }

    /// @dev Calculates settlement on current army position
    function _getSettlementOnCurrentPosition() internal view returns (ISettlement) {
        return era().settlementByPosition(getCurrentPosition());
    }

    /// @dev Calculates if army is currently in siege or not
    function _isBesieging() internal view returns (bool) {
        ISettlement settlementOnCurrentPosition = _getSettlementOnCurrentPosition();

        // If army is staying on cultists position -> it is not in the siege
        if (IWorldAssetStorageAccessor(address(settlementOnCurrentPosition)).assetTypeId() == CULTISTS_SETTLEMENT_TYPE_ID) {
            return false;
        }

        uint256[] memory besiegingUnitsAmounts = settlementOnCurrentPosition.siege().getArmyBesiegingUnitsAmounts(address(this));
        for (uint256 i = 0; i < besiegingUnitsAmounts.length; i++) {
            if (besiegingUnitsAmounts[i] > 0) {
                return true;
            }
        }

        return false;
    }

    /// @dev Calculates if battle has units at provided side
    function _hasUnitsInBattleAtProvidedSide(IBattle battle, uint256 side) internal view returns (bool) {
        bytes32[] memory unitTypeIds = Config.getUnitTypeIds();

        for (uint256 i = 0; i < unitTypeIds.length; i++) {
            if (battle.sideUnitsAmount(side, unitTypeIds[i]) > 0) {
                return true;
            }
        }

        return false;
    }

    /// @dev Calculates whether settlement is cultists settlement
    function _isCultistsSettlement(ISettlement settlement) internal view returns (bool) {
        return IWorldAssetStorageAccessor(address(settlement)).assetTypeId() == CULTISTS_SETTLEMENT_TYPE_ID;
    }
}
