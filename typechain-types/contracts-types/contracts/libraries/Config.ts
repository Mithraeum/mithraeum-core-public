/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface ConfigInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "armyStunDurationByJoiningBattleAtAttackingSide"
      | "armyStunDurationPerRobberyMultiplier"
      | "baseBattleDuration"
      | "battleDurationLosingArmyStunMultiplier"
      | "battleDurationWinningArmyStunMultiplier"
      | "buildingCooldownDurationAfterActivation"
      | "buildingTokenTransferThresholdPercent"
      | "captureTileDurationPerTile"
      | "captureTileInitialDuration"
      | "cultistUnitTypeId"
      | "cultistsNoDestructionDelay"
      | "cultistsPerRegionMultiplier"
      | "cultistsSummonDelay"
      | "demilitarizationCooldown"
      | "globalMultiplier"
      | "initialCaptureProsperityBasicValue"
      | "initialCaptureProsperityPerTileValue"
      | "initialCorruptionIndexPerCultistMultiplier"
      | "maneuverStunDuration"
      | "maxAdvancedProductionTileBuff"
      | "maxAllowedRobberyMultiplierIncreaseValue"
      | "maxAllowedUnitsToBuyPerTransaction"
      | "maxAllowedWorkersToBuyPerTransaction"
      | "maxCultistsPerRegion"
      | "maxRegionTier"
      | "maxSettlementsPerRegion"
      | "minimumBattleDuration"
      | "minimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion"
      | "necessaryProsperityPercentForClaimingTileCapture"
      | "newSettlementPriceIncreaseMultiplier"
      | "newSettlementStartingPrice"
      | "nextCaptureProsperityBasicThreshold"
      | "nextCaptureProsperityPerTileThreshold"
      | "productionTicksInSecond"
      | "robberyPointsPerDamageMultiplier"
      | "settlementPayToDecreaseCorruptionIndexPenaltyMultiplier"
      | "settlementPriceMultiplierPerIncreasedRegionTier"
      | "startingWorkerPrice"
      | "stunDurationOfCancelledSecretManeuver"
      | "tileCaptureCancellationFee"
      | "toTreasuryPercent"
      | "unitHiringFortHpMultiplier"
      | "workersAmountForBuildingActivation"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "armyStunDurationByJoiningBattleAtAttackingSide",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "armyStunDurationPerRobberyMultiplier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "baseBattleDuration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "battleDurationLosingArmyStunMultiplier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "battleDurationWinningArmyStunMultiplier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "buildingCooldownDurationAfterActivation",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "buildingTokenTransferThresholdPercent",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "captureTileDurationPerTile",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "captureTileInitialDuration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "cultistUnitTypeId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "cultistsNoDestructionDelay",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "cultistsPerRegionMultiplier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "cultistsSummonDelay",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "demilitarizationCooldown",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "globalMultiplier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialCaptureProsperityBasicValue",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialCaptureProsperityPerTileValue",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "initialCorruptionIndexPerCultistMultiplier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maneuverStunDuration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxAdvancedProductionTileBuff",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxAllowedRobberyMultiplierIncreaseValue",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxAllowedUnitsToBuyPerTransaction",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxAllowedWorkersToBuyPerTransaction",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxCultistsPerRegion",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxRegionTier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "maxSettlementsPerRegion",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "minimumBattleDuration",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "minimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "necessaryProsperityPercentForClaimingTileCapture",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "newSettlementPriceIncreaseMultiplier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "newSettlementStartingPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "nextCaptureProsperityBasicThreshold",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "nextCaptureProsperityPerTileThreshold",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "productionTicksInSecond",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "robberyPointsPerDamageMultiplier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "settlementPayToDecreaseCorruptionIndexPenaltyMultiplier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "settlementPriceMultiplierPerIncreasedRegionTier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "startingWorkerPrice",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "stunDurationOfCancelledSecretManeuver",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tileCaptureCancellationFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "toTreasuryPercent",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "unitHiringFortHpMultiplier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "workersAmountForBuildingActivation",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "armyStunDurationByJoiningBattleAtAttackingSide",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "armyStunDurationPerRobberyMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "baseBattleDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "battleDurationLosingArmyStunMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "battleDurationWinningArmyStunMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "buildingCooldownDurationAfterActivation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "buildingTokenTransferThresholdPercent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "captureTileDurationPerTile",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "captureTileInitialDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cultistUnitTypeId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cultistsNoDestructionDelay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cultistsPerRegionMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cultistsSummonDelay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "demilitarizationCooldown",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "globalMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initialCaptureProsperityBasicValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initialCaptureProsperityPerTileValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "initialCorruptionIndexPerCultistMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maneuverStunDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxAdvancedProductionTileBuff",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxAllowedRobberyMultiplierIncreaseValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxAllowedUnitsToBuyPerTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxAllowedWorkersToBuyPerTransaction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxCultistsPerRegion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxRegionTier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxSettlementsPerRegion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "minimumBattleDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "minimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "necessaryProsperityPercentForClaimingTileCapture",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "newSettlementPriceIncreaseMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "newSettlementStartingPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nextCaptureProsperityBasicThreshold",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nextCaptureProsperityPerTileThreshold",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "productionTicksInSecond",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "robberyPointsPerDamageMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "settlementPayToDecreaseCorruptionIndexPenaltyMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "settlementPriceMultiplierPerIncreasedRegionTier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "startingWorkerPrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stunDurationOfCancelledSecretManeuver",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "tileCaptureCancellationFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "toTreasuryPercent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unitHiringFortHpMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "workersAmountForBuildingActivation",
    data: BytesLike
  ): Result;
}

export interface Config extends BaseContract {
  connect(runner?: ContractRunner | null): Config;
  waitForDeployment(): Promise<this>;

  interface: ConfigInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  armyStunDurationByJoiningBattleAtAttackingSide: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  armyStunDurationPerRobberyMultiplier: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  baseBattleDuration: TypedContractMethod<[], [bigint], "view">;

  battleDurationLosingArmyStunMultiplier: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  battleDurationWinningArmyStunMultiplier: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  buildingCooldownDurationAfterActivation: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  buildingTokenTransferThresholdPercent: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  captureTileDurationPerTile: TypedContractMethod<[], [bigint], "view">;

  captureTileInitialDuration: TypedContractMethod<[], [bigint], "view">;

  cultistUnitTypeId: TypedContractMethod<[], [string], "view">;

  cultistsNoDestructionDelay: TypedContractMethod<[], [bigint], "view">;

  cultistsPerRegionMultiplier: TypedContractMethod<[], [bigint], "view">;

  cultistsSummonDelay: TypedContractMethod<[], [bigint], "view">;

  demilitarizationCooldown: TypedContractMethod<[], [bigint], "view">;

  globalMultiplier: TypedContractMethod<[], [bigint], "view">;

  initialCaptureProsperityBasicValue: TypedContractMethod<[], [bigint], "view">;

  initialCaptureProsperityPerTileValue: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  initialCorruptionIndexPerCultistMultiplier: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  maneuverStunDuration: TypedContractMethod<[], [bigint], "view">;

  maxAdvancedProductionTileBuff: TypedContractMethod<[], [bigint], "view">;

  maxAllowedRobberyMultiplierIncreaseValue: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  maxAllowedUnitsToBuyPerTransaction: TypedContractMethod<[], [bigint], "view">;

  maxAllowedWorkersToBuyPerTransaction: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  maxCultistsPerRegion: TypedContractMethod<[], [bigint], "view">;

  maxRegionTier: TypedContractMethod<[], [bigint], "view">;

  maxSettlementsPerRegion: TypedContractMethod<[], [bigint], "view">;

  minimumBattleDuration: TypedContractMethod<[], [bigint], "view">;

  minimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  necessaryProsperityPercentForClaimingTileCapture: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  newSettlementPriceIncreaseMultiplier: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  newSettlementStartingPrice: TypedContractMethod<[], [bigint], "view">;

  nextCaptureProsperityBasicThreshold: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  nextCaptureProsperityPerTileThreshold: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  productionTicksInSecond: TypedContractMethod<[], [bigint], "view">;

  robberyPointsPerDamageMultiplier: TypedContractMethod<[], [bigint], "view">;

  settlementPayToDecreaseCorruptionIndexPenaltyMultiplier: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  settlementPriceMultiplierPerIncreasedRegionTier: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  startingWorkerPrice: TypedContractMethod<[], [bigint], "view">;

  stunDurationOfCancelledSecretManeuver: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  tileCaptureCancellationFee: TypedContractMethod<[], [bigint], "view">;

  toTreasuryPercent: TypedContractMethod<[], [bigint], "view">;

  unitHiringFortHpMultiplier: TypedContractMethod<[], [bigint], "view">;

  workersAmountForBuildingActivation: TypedContractMethod<[], [bigint], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "armyStunDurationByJoiningBattleAtAttackingSide"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "armyStunDurationPerRobberyMultiplier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "baseBattleDuration"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "battleDurationLosingArmyStunMultiplier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "battleDurationWinningArmyStunMultiplier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "buildingCooldownDurationAfterActivation"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "buildingTokenTransferThresholdPercent"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "captureTileDurationPerTile"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "captureTileInitialDuration"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "cultistUnitTypeId"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "cultistsNoDestructionDelay"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "cultistsPerRegionMultiplier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "cultistsSummonDelay"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "demilitarizationCooldown"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "globalMultiplier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "initialCaptureProsperityBasicValue"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "initialCaptureProsperityPerTileValue"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "initialCorruptionIndexPerCultistMultiplier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "maneuverStunDuration"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxAdvancedProductionTileBuff"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxAllowedRobberyMultiplierIncreaseValue"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxAllowedUnitsToBuyPerTransaction"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxAllowedWorkersToBuyPerTransaction"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxCultistsPerRegion"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxRegionTier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "maxSettlementsPerRegion"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "minimumBattleDuration"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "minimumUserSettlementsCountInNeighboringRegionRequiredToIncludeRegion"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "necessaryProsperityPercentForClaimingTileCapture"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "newSettlementPriceIncreaseMultiplier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "newSettlementStartingPrice"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "nextCaptureProsperityBasicThreshold"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "nextCaptureProsperityPerTileThreshold"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "productionTicksInSecond"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "robberyPointsPerDamageMultiplier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "settlementPayToDecreaseCorruptionIndexPenaltyMultiplier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "settlementPriceMultiplierPerIncreasedRegionTier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "startingWorkerPrice"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "stunDurationOfCancelledSecretManeuver"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "tileCaptureCancellationFee"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "toTreasuryPercent"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "unitHiringFortHpMultiplier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "workersAmountForBuildingActivation"
  ): TypedContractMethod<[], [bigint], "view">;

  filters: {};
}
