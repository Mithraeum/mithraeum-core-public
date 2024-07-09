// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./assets/IWorldAssetFactory.sol";

/// @title Registry interface
/// @notice Functions related to current game configuration
interface IRegistry {
    struct GameResource {
        string tokenName;
        string tokenSymbol;
        bytes32 resourceTypeId;
    }

    struct GameUnit {
        string tokenName;
        string tokenSymbol;
        bytes32 unitTypeId;
    }

    struct UnitStats {
        uint256 offenseStage1;
        uint256 defenceStage1;
        uint256 offenseStage2;
        uint256 defenceStage2;
        uint256 siegePower;
        uint256 siegeSupport;
    }

    // State variables

    /// @notice An address which can configure/reconfigure current game
    /// @dev Immutable, initialized on the registry creation
    function mightyCreator() external view returns (address);

    /// @notice World asset factory
    /// @dev During new world asset creation process registry is asked for factory contract
    function worldAssetFactory() external view returns (IWorldAssetFactory);

    /// @notice Global multiplier
    /// @dev Immutable, initialized on the registry creation
    function globalMultiplier() external view returns (uint256);

    /// @notice Settlement starting price
    /// @dev Immutable, initialized on the registry creation
    function settlementStartingPrice() external view returns (uint256);

    // Errors

    /// @notice Thrown when attempting to call action which can only be called by mighty creator
    error OnlyMightyCreator();

    /// @notice Thrown when attempting to call function by providing unknown parameter
    error UnknownInputParameter();

    // Functions

    /// @notice Proxy initializer
    /// @dev Called by address which created current instance
    /// @param globalMultiplier Global multiplier
    /// @param settlementStartingPrice Settlement starting price
    function init(
        uint256 globalMultiplier,
        uint256 settlementStartingPrice
    ) external;

    /// @notice Sets new mighty creator
    /// @dev Even though function is opened, it can be called only by mightyCreator
    /// @param newMightyCreator New mighty creator
    function setMightyCreator(address newMightyCreator) external;

    /// @notice Sets provided address as world asset factory contract
    /// @dev Even though function is opened, it can be called only by mightyCreator
    /// @param worldAssetFactoryAddress World asset factory address
    function setWorldAssetFactory(address worldAssetFactoryAddress) external;

    /// @notice Calculates worker capacity coefficient for provided building type id
    /// @dev Used for internal calculation of max workers for each building
    /// @param buildingTypeId Building type id
    /// @return workerCapacityCoefficient Worker capacity coefficient
    function getWorkerCapacityCoefficient(bytes32 buildingTypeId) external pure returns (uint256 workerCapacityCoefficient);

    /// @notice Calculates basic production building coefficient
    /// @dev used for internal calculation of production result
    /// @param buildingTypeId Building type id
    /// @return basicProductionBuildingCoefficient Basic production building coefficient
    function getBasicProductionBuildingCoefficient(bytes32 buildingTypeId) external pure returns (uint256 basicProductionBuildingCoefficient);

    /// @notice Returns corruptionIndex by resource type id
    /// @dev Used for calculation of how much corruptionIndex increased/decreased
    /// @param resourceTypeId Resource type id
    /// @return corruptionIndex Amount of corruptionIndex per 1 resource (both are in 1e18 precision)
    function getCorruptionIndexByResource(bytes32 resourceTypeId) external pure returns (uint256 corruptionIndex);

    /// @notice Returns resource weight
    /// @dev Used for calculation how much prosperity will be produced by resource in treasury
    /// @param resourceTypeId Resource type id
    /// @return resourceWeight Resource weight (in 1e0 precision)
    function getResourceWeight(bytes32 resourceTypeId) external pure returns (uint256 resourceWeight);

    /// @notice Returns robbery points per damage multiplier
    /// @dev Used for determination how much robbery points will be given
    /// @return robberyPointsPerDamageMultiplier Robbery points per damage multiplier (in 1e18 precision)
    function getRobberyPointsPerDamageMultiplier() external pure returns (uint256 robberyPointsPerDamageMultiplier);

    /// @notice Returns robbery point multiplier by provided resource type id
    /// @dev Used in calculation how many resources can be exchanged for robbery points
    /// @param resourceTypeId Resource type id
    /// @return robberyPointsToResourceMultiplier Robbery point multiplier (in 1e18 precision)
    function getRobberyPointsToResourceMultiplier(bytes32 resourceTypeId) external view returns (uint256 robberyPointsToResourceMultiplier);

    /// @notice Returns global multiplier
    /// @dev Used everywhere, where time is involved. Essentially determines game speed
    /// @return globalMultiplier Global multiplier
    function getGlobalMultiplier() external view returns (uint256 globalMultiplier);

    /// @notice Returns unit stats by provided unit type
    /// @dev Used everywhere, where game logic based on unit stats
    /// @param unitTypeId Unit type id
    /// @return unitStats Unit stats
    function getUnitStats(bytes32 unitTypeId) external pure returns (UnitStats memory unitStats);

    /// @notice Returns production to treasury percent
    /// @dev Determines how much of buildings production will go to treasury (if not full)
    /// @param toTreasuryPercent Production to treasury percent (in 1e18 precision, where 1e18 is 100%)
    function getToTreasuryPercent() external pure returns (uint256 toTreasuryPercent);

    /// @notice Returns base battle duration
    /// @dev Used internally to determine how long battle will last
    /// @return baseBattleDuration Base battle duration
    function getBaseBattleDuration() external view returns (uint256 baseBattleDuration);

    /// @notice Returns battle duration losing army stun multiplier
    /// @dev Used internally to determine how long stun will last after army lost the battle
    /// @return battleDurationLosingArmyStunMultiplier Battle duration losing army stun multiplier
    function getBattleDurationLosingArmyStunMultiplier() external pure returns (uint256 battleDurationLosingArmyStunMultiplier);

    /// @notice Returns battle duration winning army stun multiplier
    /// @dev Used internally to determine how long stun will last after army won the battle
    /// @return battleDurationWinningArmyStunMultiplier Battle duration winning army stun multiplier
    function getBattleDurationWinningArmyStunMultiplier() external pure returns (uint256 battleDurationWinningArmyStunMultiplier);

    /// @notice Returns maneuver duration stun multiplier
    /// @dev Used internally to determine how long stun will last after armies' maneuver
    /// @return maneuverDurationStunMultiplier Maneuver duration stun multiplier
    function getManeuverDurationStunMultiplier() external pure returns (uint256 maneuverDurationStunMultiplier);

    /// @notice Returns game building type ids
    /// @dev Used internally to determine which buildings will be created on placing settlement
    /// @return buildingTypeIds Building type ids
    function getBuildingTypeIds() external view returns (bytes32[] memory buildingTypeIds);

    /// @notice Returns game unit type ids
    /// @dev Used internally in many places where interaction with units is necessary
    /// @return unitTypeIds Unit type ids
    function getUnitTypeIds() external view returns (bytes32[] memory unitTypeIds);

    /// @notice Returns game resources
    /// @dev Used internally to determine upgrade costs and providing initial resources for settlement owner based on his tier
    /// @param resources Game resources
    function getGameResources() external view returns (GameResource[] memory resources);

    /// @notice Returns game units
    /// @dev Used internally in many places where interaction with units is necessary
    /// @return units Game units
    function getGameUnits() external view returns (GameUnit[] memory units);

    /// @notice Returns unit hiring fort hp multiplier
    /// @dev Used to determine how much units in army can be presented based on its current fort hp and this parameter
    /// @return unitHiringFortHpMultiplier Unit hiring fort hp multiplier
    function getUnitHiringFortHpMultiplier() external pure returns (uint256 unitHiringFortHpMultiplier);

    /// @notice Returns how much resource unit can take from treasury to reduce maneuver duration
    /// @dev Used internally to calculate army's maneuver speed
    /// @param unitTypeId Unit type id
    /// @return unitResourceUsagePer1SecondOfDecreasedManeuverDuration Amount of resource to spend per unit per 1 second of decreased maneuver duration (in 1e18 precision)
    function getUnitResourceUsagePer1SecondOfDecreasedManeuverDuration(bytes32 unitTypeId) external pure returns (uint256 unitResourceUsagePer1SecondOfDecreasedManeuverDuration);

    /// @notice Returns how much prosperity will be given for provided unit type id
    /// @dev Used internally to calculate how much prosperity will be given
    /// @return prosperityPerUnit Prosperity amount per one unit (in 1e18 precision)
    function getProsperityForUnitLiquidation(bytes32 unitTypeId) external pure returns (uint256 prosperityPerUnit);

    /// @notice Returns how much workers will be given for provided unit type id
    /// @dev Used internally to calculate how much workers will be given
    /// @return workersPerUnit Workers amount per one unit (in 1e18 precision)
    function getWorkersForUnitLiquidation(bytes32 unitTypeId) external pure returns (uint256 workersPerUnit);

    /// @notice Returns cultists summon delay
    /// @dev Used to determine is cultists can be re-summoned
    /// @return cultistsSummonDelay Cultists summon delay (in seconds)
    function getCultistsSummonDelay() external pure returns (uint256 cultistsSummonDelay);

    /// @notice Returns max settlements that can be placed in one region
    /// @dev Cultists does not count (so +1 with cultists)
    /// @return maxSettlementsPerRegion Max settlements that can be placed in one region
    function getMaxSettlementsPerRegion() external pure returns (uint256 maxSettlementsPerRegion);

    /// @notice Returns interval duration where world is not destructible after recent cultists summon
    /// @dev Used to determine if destruction is available or not
    /// @return cultistsNoDestructionDelay No destruction interval duration (in seconds)
    function getCultistsNoDestructionDelay() external pure returns (uint256 cultistsNoDestructionDelay);

    /// @notice Returns value of cultists per region which determines cultists threshold for world destruction
    /// @dev Used to determine amount of cultists that have to be present for world destruction
    /// @return cultistsPerRegionMultiplier Value of cultists per region
    function getCultistsPerRegionMultiplier() external pure returns (uint256 cultistsPerRegionMultiplier);

    /// @notice Returns maximum amount of cultists that can be present in region
    /// @dev Used to determine how many cultists will be summoned
    /// @return maxCultistsPerRegion Maximum amount of cultists
    function getMaxCultistsPerRegion() external pure returns (uint256 maxCultistsPerRegion);

    /// @notice Returns unit type id of cultists army
    /// @dev Determines type of unit in cultists army
    /// @return cultistUnitTypeId Cultists unit type id
    function getCultistUnitTypeId() external pure returns (bytes32 cultistUnitTypeId);

    /// @notice Returns building token transfer threshold percent
    /// @dev Used to determine is building token transfer allowed based on treasury percent
    /// @return buildingTokenTransferThresholdPercent Building token transfer threshold percent
    function getBuildingTokenTransferThresholdPercent() external pure returns (uint256 buildingTokenTransferThresholdPercent);

    /// @notice Returns new settlement starting price in settlements market
    /// @dev Used to determine how much base price for first settlement will be
    /// @return newSettlementStartingPrice New settlement starting price
    function getNewSettlementStartingPrice() external view returns (uint256 newSettlementStartingPrice);

    /// @notice Returns amount of production ticks
    /// @dev Used for production calculation
    /// @return ticks Amount of production ticks
    function getProductionTicksInSecond() external view returns (uint256 ticks);

    /// @notice Returns unit price increase in unit pool for each extra unit to buy (value returned as numerator and denominator)
    /// @dev Used for determination of unit price
    /// @return numerator Numerator
    /// @return denominator Denominator
    function getUnitPriceIncreaseForEachUnit() external pure returns (uint256 numerator, uint256 denominator);

    /// @notice Returns max allowed units to buy per transaction
    /// @dev Limit specified in order to limit potential price overflows (value is returned in 1e18 precision)
    /// @return maxAllowedUnitsToBuy Max allowed units to buy
    function getMaxAllowedUnitsToBuyPerTransaction() external pure returns (uint256 maxAllowedUnitsToBuy);

    /// @notice Returns unit pool price drop per second for provided unit type id (value returned as numerator and denominator)
    /// @dev Used for determination of current unit pool price
    /// @param unitTypeId Unit type id
    /// @return numerator Numerator
    /// @return denominator Denominator
    function getUnitPriceDropByUnitTypeId(bytes32 unitTypeId) external pure returns (uint256 numerator, uint256 denominator);

    /// @notice Returns worker pool price drop per second for each worker (value returned as numerator and denominator)
    /// @dev Used for determination of worker price
    /// @return numerator Numerator
    /// @return denominator Denominator
    function getWorkerPriceIncreaseForEachWorker() external pure returns (uint256 numerator, uint256 denominator);

    /// @notice Returns max allowed workers to buy per transaction
    /// @dev Limit specified in order to limit potential price overflows (value is returned in 1e18 precision)
    /// @return maxAllowedWorkersToBuy Max allowed workers to buy
    function getMaxAllowedWorkersToBuyPerTransaction() external pure returns (uint256 maxAllowedWorkersToBuy);

    /// @notice Returns workers pool price drop per second, provided as numerator and denominator
    /// @dev Used for determination of current workers pool price
    /// @return numerator Numerator
    /// @return denominator Denominator
    function getWorkerPriceDrop() external pure returns (uint256 numerator, uint256 denominator);

    /// @notice Returns max potential advanced production buff gain from capturing tiles
    /// @dev Used for determination advanced production multiplier
    /// @return maxAdvancedProductionTileBuff Max potential advanced production from tile buff
    function getMaxAdvancedProductionTileBuff() external pure returns (uint256 maxAdvancedProductionTileBuff);

    /// @notice Returns capture tile duration per each tile in distance from settlement to selected tile
    /// @dev Used to capture tile duration calculation
    /// @return captureTileDurationPerTile Capture tile duration per tile
    function getCaptureTileDurationPerTile() external pure returns (uint256 captureTileDurationPerTile);

    /// @notice Returns next capture prosperity basic threshold
    /// @dev Used to determine if new bid on captured tile is possible
    /// @return nextCaptureProsperityBasicThreshold Next capture prosperity basic threshold
    function getNextCaptureProsperityBasicThreshold() external pure returns (uint256 nextCaptureProsperityBasicThreshold);

    /// @notice Returns next capture prosperity per tile threshold
    /// @dev Used to determine if new bid on captured tile is possible
    /// @return nextCaptureProsperityPerTileThreshold Next capture prosperity per tile threshold
    function getNextCaptureProsperityPerTileThreshold() external pure returns (uint256 nextCaptureProsperityPerTileThreshold);

    /// @notice Returns percent of prosperity that has to be in settlement for claiming captured tile
    /// @dev Used to determine if tile claim is possible
    /// @return necessaryProsperityPercentForClaimingTileCapture Necessary prosperity percent for claiming tile capture
    function getNecessaryProsperityPercentForClaimingTileCapture() external pure returns (uint256 necessaryProsperityPercentForClaimingTileCapture);

    /// @notice Returns tile capture cancellation fee
    /// @dev Used to determine how much prosperity has to be given in order to cancel tile capture
    /// @return tileCaptureCancellationFee Tile capture cancellation fee
    function getTileCaptureCancellationFee() external pure returns (uint256 tileCaptureCancellationFee);

    /// @notice Returns max captured tiles for settlement
    /// @dev Used to determine whether settlement can initiate tile capture
    /// @param tileBonusType Tile bonus type
    /// @return maxCapturedTilesForSettlement Max captured tiles for settlement with this bonus type
    function getMaxCapturedTilesForSettlement(uint8 tileBonusType) external pure returns (uint256 maxCapturedTilesForSettlement);

    /// @notice Returns advanced production tile bonus by variation
    /// @dev Used to determine tile bonus by tile bonus variation
    /// @param tileBonusVariation Tile bonus variation
    /// @return buildingTypeId Building type id
    /// @return capacityAmountMultiplier Capacity amount multiplier
    function getAdvancedProductionTileBonusByVariation(uint8 tileBonusVariation) external pure returns (bytes32 buildingTypeId, uint256 capacityAmountMultiplier);

    /// @notice Returns unit battle multiplier tile bonus by variation
    /// @dev Used to determine tile bonus by tile bonus variation
    /// @param tileBonusVariation Tile bonus variation
    /// @return unitTypeId Unit type id
    /// @return unitBattleMultiplier Unit battle multiplier
    function getUnitBattleMultiplierTileBonusByVariation(uint8 tileBonusVariation) external pure returns (bytes32 unitTypeId, uint256 unitBattleMultiplier);

    /// @notice Returns max region tier
    /// @dev Used in validation in region tier increase
    /// @return maxRegionTier Max region tier
    function getMaxRegionTier() external pure returns (uint256 maxRegionTier);

    /// @notice Returns initial cultists amount per region tier
    /// @dev Used in region activation
    /// @return initialCultistsAmount Initial cultists amount
    function getInitialCultistsAmountPerRegionTier() external pure returns (uint256 initialCultistsAmount);

    /// @notice Returns initial corruptionIndex amount per region tier
    /// @dev Used in region activation and region tier increase handler
    /// @return initialCorruptionIndexAmount Initial corruptionIndex amount
    function getInitialCorruptionIndexAmountPerRegionTier() external pure returns (uint256 initialCorruptionIndexAmount);

    /// @notice Returns settlement price multiplier per increased region tier
    /// @dev Used in calculation of new settlement price
    /// @return settlementPriceMultiplierPerIncreasedRegionTier Settlement price multiplier per increased region tier
    function getSettlementPriceMultiplierPerIncreasedRegionTier() external pure returns (uint256 settlementPriceMultiplierPerIncreasedRegionTier);

    /// @notice Returns stun duration multiplier of cancelled secret maneuver
    /// @dev Used in calculation of stun duration during cancelling secret maneuver
    /// @return stunMultiplierOfCancelledSecretManeuver Stun multiplier of cancelled secret maneuver
    function getStunDurationMultiplierOfCancelledSecretManeuver() external pure returns (uint256 stunMultiplierOfCancelledSecretManeuver);

    /// @notice Returns max allowed robbery multiplier increase value
    /// @dev Used in army siege modification
    /// @return maxAllowedRobberyMultiplierIncreaseValue Max allowed robbery multiplier increase value
    function getMaxAllowedRobberyMultiplierIncreaseValue() external pure returns (uint256 maxAllowedRobberyMultiplierIncreaseValue);

    /// @notice Returns army stun duration per one point of added robbery multiplier
    /// @dev Used in army siege modification
    /// @return armyStunDurationPerRobberyMultiplier Army stun duration per robbery multiplier
    function getArmyStunDurationPerRobberyMultiplier() external pure returns (uint256 armyStunDurationPerRobberyMultiplier);

    /// @notice Returns chance for tile with bonus by region tier
    /// @dev Used to determine whether tile has bonus or not
    /// @param regionTier Region tier
    /// @return chanceForTileWithBonus Chance for tile with bonus (in 1e18 precision)
    function getChanceForTileWithBonusByRegionTier(uint256 regionTier) external pure returns (uint256 chanceForTileWithBonus);

    /// @notice Returns region inclusion price
    /// @dev Used to determine amount of token to be taken from msg.sender in order to include region
    /// @param regionTier Region tier
    /// @return regionInclusionPrice Region inclusion price
    function getRegionInclusionPrice(uint256 regionTier) external pure returns (uint256 regionInclusionPrice);

    /// @notice Returns region owner settlement purchase percent
    /// @dev Used to determine amount of tokens to be sent to region owner when another user buys settlement in his region
    /// @param regionTier Region tier
    /// @return percent Percent (in 1e18 precision)
    function getRegionOwnerSettlementPurchasePercent(uint256 regionTier) external pure returns (uint256 percent);

    /// @notice Returns unit pool type by unit type id
    /// @dev Used to determine which implementation of unit pool to use for provided unit type
    /// @param unitTypeId Unit type id
    /// @return unitPoolType Unit pool type
    function getUnitPoolType(bytes32 unitTypeId) external pure returns (bytes32 unitPoolType);

    /// @notice Returns stun duration army will receive by joining battle at attacking side
    /// @dev Used to determine stun duration army will receive by joining battle at attacking side
    /// @return stunDuration Stun duration
    function getArmyStunDurationByJoiningBattleAtAttackingSide() external pure returns (uint256 stunDuration);

    /// @notice Returns initial capture prosperity basic value
    /// @dev Used to determine if new bid on captured tile is possible
    /// @return initialCaptureProsperityBasicValue Initial capture prosperity basic value
    function getInitialCaptureProsperityBasicValue() external pure returns (uint256 initialCaptureProsperityBasicValue);

    /// @notice Returns initial capture prosperity per tile value
    /// @dev Used to determine if new bid on captured tile is possible
    /// @return initialCaptureProsperityPerTileValue Initial capture prosperity per tile value
    function getInitialCaptureProsperityPerTileValue() external pure returns (uint256 initialCaptureProsperityPerTileValue);

    /// @notice Returns minimum user settlements count in neighboring region required to include region
    /// @dev Used to determine whether region can be included or not
    /// @return minimumUserSettlementsCount Minimum user settlements count
    function getMinimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion() external pure returns (uint256 minimumUserSettlementsCount);

    /// @notice Returns settlement pay to decrease corruptionIndex penalty multiplier
    /// @dev Used to determine how much corruptionIndex penalty settlement will endure whenever its corruptionIndex is lowered by paying to reward pool
    /// @return penaltyMultiplier Penalty multiplier
    function getSettlementPayToDecreaseCorruptionIndexPenaltyMultiplier() external pure returns (uint256 penaltyMultiplier);

    /// @notice Returns minimum battle duration
    /// @dev Used to determine battle duration ignoring current world multiplier
    /// @return minimumBattleDuration Minimum battle duration
    function getMinimumBattleDuration() external pure returns (uint256 minimumBattleDuration);

    /// @notice Returns new settlement price increase multiplier
    /// @dev Used to determine new settlement purchase price (in 1e18 precision)
    /// @return newSettlementPriceIncreaseMultiplier New settlement price increase multiplier
    function getNewSettlementPriceIncreaseMultiplier() external pure returns (uint256 newSettlementPriceIncreaseMultiplier);
}
