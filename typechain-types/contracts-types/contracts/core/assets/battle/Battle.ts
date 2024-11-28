/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../../../common";

export interface BattleInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "acceptArmyInBattle"
      | "armySide"
      | "armyUnitsAdditionalMultipliers"
      | "armyUnitsAmount"
      | "assetGroupId"
      | "assetTypeId"
      | "battleTimeInfo"
      | "calculateAllCasualties"
      | "calculateArmyCasualties"
      | "calculateBattleDuration"
      | "calculateStage1Casualties"
      | "calculateStage2Casualties"
      | "canEndBattle"
      | "casualties"
      | "endBattle"
      | "era"
      | "eraNumber"
      | "getBattleDuration"
      | "init"
      | "isEndedBattle"
      | "isLobbyTime"
      | "position"
      | "registry"
      | "sideUnitsAmount"
      | "winningSide"
      | "world"
      | "worldAssetFactory"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "ArmyJoined" | "BattleEnded" | "Initialized"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "acceptArmyInBattle",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "armySide",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "armyUnitsAdditionalMultipliers",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "armyUnitsAmount",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "assetGroupId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "assetTypeId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "battleTimeInfo",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "calculateAllCasualties",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "calculateArmyCasualties",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateBattleDuration",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      boolean,
      BigNumberish,
      BigNumberish,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "calculateStage1Casualties",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "calculateStage2Casualties",
    values: [BigNumberish[], BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "canEndBattle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "casualties",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "endBattle", values?: undefined): string;
  encodeFunctionData(functionFragment: "era", values?: undefined): string;
  encodeFunctionData(functionFragment: "eraNumber", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getBattleDuration",
    values: [boolean, BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "init", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "isEndedBattle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isLobbyTime",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "position", values?: undefined): string;
  encodeFunctionData(functionFragment: "registry", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "sideUnitsAmount",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "winningSide",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "world", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "worldAssetFactory",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "acceptArmyInBattle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "armySide", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "armyUnitsAdditionalMultipliers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "armyUnitsAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "assetGroupId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "assetTypeId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "battleTimeInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateAllCasualties",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateArmyCasualties",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateBattleDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateStage1Casualties",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "calculateStage2Casualties",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "canEndBattle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "casualties", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "endBattle", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "era", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "eraNumber", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getBattleDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isEndedBattle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isLobbyTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "position", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "registry", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "sideUnitsAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "winningSide",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "world", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "worldAssetFactory",
    data: BytesLike
  ): Result;
}

export namespace ArmyJoinedEvent {
  export type InputTuple = [armyAddress: AddressLike, side: BigNumberish];
  export type OutputTuple = [armyAddress: string, side: bigint];
  export interface OutputObject {
    armyAddress: string;
    side: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BattleEndedEvent {
  export type InputTuple = [endTime: BigNumberish];
  export type OutputTuple = [endTime: bigint];
  export interface OutputObject {
    endTime: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace InitializedEvent {
  export type InputTuple = [version: BigNumberish];
  export type OutputTuple = [version: bigint];
  export interface OutputObject {
    version: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Battle extends BaseContract {
  connect(runner?: ContractRunner | null): Battle;
  waitForDeployment(): Promise<this>;

  interface: BattleInterface;

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

  acceptArmyInBattle: TypedContractMethod<
    [armyAddress: AddressLike, side: BigNumberish],
    [void],
    "nonpayable"
  >;

  armySide: TypedContractMethod<[arg0: AddressLike], [bigint], "view">;

  armyUnitsAdditionalMultipliers: TypedContractMethod<
    [arg0: AddressLike, arg1: BytesLike],
    [bigint],
    "view"
  >;

  armyUnitsAmount: TypedContractMethod<
    [arg0: AddressLike, arg1: BytesLike],
    [bigint],
    "view"
  >;

  assetGroupId: TypedContractMethod<[], [string], "view">;

  assetTypeId: TypedContractMethod<[], [string], "view">;

  battleTimeInfo: TypedContractMethod<
    [],
    [
      [bigint, bigint, bigint] & {
        beginTime: bigint;
        duration: bigint;
        endTime: bigint;
      }
    ],
    "view"
  >;

  calculateAllCasualties: TypedContractMethod<
    [],
    [[bigint[], bigint[], bigint]],
    "view"
  >;

  calculateArmyCasualties: TypedContractMethod<
    [armyAddress: AddressLike],
    [[boolean, bigint[]]],
    "view"
  >;

  calculateBattleDuration: TypedContractMethod<
    [
      globalMultiplier: BigNumberish,
      baseBattleDuration: BigNumberish,
      minimumBattleDuration: BigNumberish,
      isCultistsAttacked: boolean,
      side1UnitsAmount: BigNumberish,
      side2UnitsAmount: BigNumberish,
      maxBattleDuration: BigNumberish
    ],
    [bigint],
    "view"
  >;

  calculateStage1Casualties: TypedContractMethod<
    [],
    [
      [bigint[], bigint[], string] & {
        _side1Casualties: bigint[];
        _side2Casualties: bigint[];
        stageParams: string;
      }
    ],
    "view"
  >;

  calculateStage2Casualties: TypedContractMethod<
    [
      stage1Side1Casualties: BigNumberish[],
      stage1Side2Casualties: BigNumberish[]
    ],
    [
      [bigint[], bigint[], string] & {
        _side1Casualties: bigint[];
        _side2Casualties: bigint[];
        stageParams: string;
      }
    ],
    "view"
  >;

  canEndBattle: TypedContractMethod<[], [boolean], "view">;

  casualties: TypedContractMethod<
    [arg0: BigNumberish, arg1: BytesLike],
    [bigint],
    "view"
  >;

  endBattle: TypedContractMethod<[], [void], "nonpayable">;

  era: TypedContractMethod<[], [string], "view">;

  eraNumber: TypedContractMethod<[], [bigint], "view">;

  getBattleDuration: TypedContractMethod<
    [
      isCultistsAttacked: boolean,
      maxBattleDuration: BigNumberish,
      side1UnitsAmount: BigNumberish,
      side2UnitsAmount: BigNumberish
    ],
    [bigint],
    "view"
  >;

  init: TypedContractMethod<[initParams: BytesLike], [void], "nonpayable">;

  isEndedBattle: TypedContractMethod<[], [boolean], "view">;

  isLobbyTime: TypedContractMethod<[], [boolean], "view">;

  position: TypedContractMethod<[], [bigint], "view">;

  registry: TypedContractMethod<[], [string], "view">;

  sideUnitsAmount: TypedContractMethod<
    [arg0: BigNumberish, arg1: BytesLike],
    [bigint],
    "view"
  >;

  winningSide: TypedContractMethod<[], [bigint], "view">;

  world: TypedContractMethod<[], [string], "view">;

  worldAssetFactory: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "acceptArmyInBattle"
  ): TypedContractMethod<
    [armyAddress: AddressLike, side: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "armySide"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "armyUnitsAdditionalMultipliers"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: BytesLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "armyUnitsAmount"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: BytesLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "assetGroupId"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "assetTypeId"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "battleTimeInfo"
  ): TypedContractMethod<
    [],
    [
      [bigint, bigint, bigint] & {
        beginTime: bigint;
        duration: bigint;
        endTime: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "calculateAllCasualties"
  ): TypedContractMethod<[], [[bigint[], bigint[], bigint]], "view">;
  getFunction(
    nameOrSignature: "calculateArmyCasualties"
  ): TypedContractMethod<
    [armyAddress: AddressLike],
    [[boolean, bigint[]]],
    "view"
  >;
  getFunction(
    nameOrSignature: "calculateBattleDuration"
  ): TypedContractMethod<
    [
      globalMultiplier: BigNumberish,
      baseBattleDuration: BigNumberish,
      minimumBattleDuration: BigNumberish,
      isCultistsAttacked: boolean,
      side1UnitsAmount: BigNumberish,
      side2UnitsAmount: BigNumberish,
      maxBattleDuration: BigNumberish
    ],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "calculateStage1Casualties"
  ): TypedContractMethod<
    [],
    [
      [bigint[], bigint[], string] & {
        _side1Casualties: bigint[];
        _side2Casualties: bigint[];
        stageParams: string;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "calculateStage2Casualties"
  ): TypedContractMethod<
    [
      stage1Side1Casualties: BigNumberish[],
      stage1Side2Casualties: BigNumberish[]
    ],
    [
      [bigint[], bigint[], string] & {
        _side1Casualties: bigint[];
        _side2Casualties: bigint[];
        stageParams: string;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "canEndBattle"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "casualties"
  ): TypedContractMethod<
    [arg0: BigNumberish, arg1: BytesLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "endBattle"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "era"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "eraNumber"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getBattleDuration"
  ): TypedContractMethod<
    [
      isCultistsAttacked: boolean,
      maxBattleDuration: BigNumberish,
      side1UnitsAmount: BigNumberish,
      side2UnitsAmount: BigNumberish
    ],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "init"
  ): TypedContractMethod<[initParams: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "isEndedBattle"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "isLobbyTime"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "position"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "registry"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "sideUnitsAmount"
  ): TypedContractMethod<
    [arg0: BigNumberish, arg1: BytesLike],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "winningSide"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "world"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "worldAssetFactory"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "ArmyJoined"
  ): TypedContractEvent<
    ArmyJoinedEvent.InputTuple,
    ArmyJoinedEvent.OutputTuple,
    ArmyJoinedEvent.OutputObject
  >;
  getEvent(
    key: "BattleEnded"
  ): TypedContractEvent<
    BattleEndedEvent.InputTuple,
    BattleEndedEvent.OutputTuple,
    BattleEndedEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;

  filters: {
    "ArmyJoined(address,uint256)": TypedContractEvent<
      ArmyJoinedEvent.InputTuple,
      ArmyJoinedEvent.OutputTuple,
      ArmyJoinedEvent.OutputObject
    >;
    ArmyJoined: TypedContractEvent<
      ArmyJoinedEvent.InputTuple,
      ArmyJoinedEvent.OutputTuple,
      ArmyJoinedEvent.OutputObject
    >;

    "BattleEnded(uint256)": TypedContractEvent<
      BattleEndedEvent.InputTuple,
      BattleEndedEvent.OutputTuple,
      BattleEndedEvent.OutputObject
    >;
    BattleEnded: TypedContractEvent<
      BattleEndedEvent.InputTuple,
      BattleEndedEvent.OutputTuple,
      BattleEndedEvent.OutputObject
    >;

    "Initialized(uint8)": TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
    Initialized: TypedContractEvent<
      InitializedEvent.InputTuple,
      InitializedEvent.OutputTuple,
      InitializedEvent.OutputObject
    >;
  };
}