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
} from "../../../common";

export declare namespace IGeography {
  export type TileBonusStruct = {
    tileBonusType: BigNumberish;
    tileBonusVariation: BigNumberish;
  };

  export type TileBonusStructOutput = [
    tileBonusType: bigint,
    tileBonusVariation: bigint
  ] & { tileBonusType: bigint; tileBonusVariation: bigint };
}

export interface GeographyInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getDistanceBetweenPositions"
      | "getRegionIdByPosition"
      | "getRegionOwner"
      | "getRegionTier"
      | "getRegionsCount"
      | "getRingPositions"
      | "getTileBonus"
      | "includeRegion"
      | "init"
      | "isRegionIncluded"
      | "world"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "Initialized" | "RegionIncluded"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "getDistanceBetweenPositions",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRegionIdByPosition",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRegionOwner",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRegionTier",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRegionsCount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getRingPositions",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTileBonus",
    values: [BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "includeRegion",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "init", values: [AddressLike]): string;
  encodeFunctionData(
    functionFragment: "isRegionIncluded",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "world", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "getDistanceBetweenPositions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRegionIdByPosition",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRegionOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRegionTier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRegionsCount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRingPositions",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTileBonus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "includeRegion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isRegionIncluded",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "world", data: BytesLike): Result;
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

export namespace RegionIncludedEvent {
  export type InputTuple = [regionId: BigNumberish];
  export type OutputTuple = [regionId: bigint];
  export interface OutputObject {
    regionId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Geography extends BaseContract {
  connect(runner?: ContractRunner | null): Geography;
  waitForDeployment(): Promise<this>;

  interface: GeographyInterface;

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

  getDistanceBetweenPositions: TypedContractMethod<
    [position1: BigNumberish, position2: BigNumberish],
    [bigint],
    "view"
  >;

  getRegionIdByPosition: TypedContractMethod<
    [position: BigNumberish],
    [[bigint, boolean]],
    "view"
  >;

  getRegionOwner: TypedContractMethod<
    [regionId: BigNumberish],
    [string],
    "view"
  >;

  getRegionTier: TypedContractMethod<
    [regionId: BigNumberish],
    [bigint],
    "view"
  >;

  getRegionsCount: TypedContractMethod<[], [bigint], "view">;

  getRingPositions: TypedContractMethod<
    [position: BigNumberish, radius: BigNumberish],
    [[bigint[], bigint]],
    "view"
  >;

  getTileBonus: TypedContractMethod<
    [
      tileBonusesSeed: BytesLike,
      chanceForTileWithBonus: BigNumberish,
      position: BigNumberish
    ],
    [IGeography.TileBonusStructOutput],
    "view"
  >;

  includeRegion: TypedContractMethod<
    [newRegionPosition: BigNumberish, neighborRegionPosition: BigNumberish],
    [void],
    "payable"
  >;

  init: TypedContractMethod<[worldAddress: AddressLike], [void], "nonpayable">;

  isRegionIncluded: TypedContractMethod<
    [regionId: BigNumberish],
    [boolean],
    "view"
  >;

  world: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getDistanceBetweenPositions"
  ): TypedContractMethod<
    [position1: BigNumberish, position2: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getRegionIdByPosition"
  ): TypedContractMethod<[position: BigNumberish], [[bigint, boolean]], "view">;
  getFunction(
    nameOrSignature: "getRegionOwner"
  ): TypedContractMethod<[regionId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getRegionTier"
  ): TypedContractMethod<[regionId: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getRegionsCount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getRingPositions"
  ): TypedContractMethod<
    [position: BigNumberish, radius: BigNumberish],
    [[bigint[], bigint]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getTileBonus"
  ): TypedContractMethod<
    [
      tileBonusesSeed: BytesLike,
      chanceForTileWithBonus: BigNumberish,
      position: BigNumberish
    ],
    [IGeography.TileBonusStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "includeRegion"
  ): TypedContractMethod<
    [newRegionPosition: BigNumberish, neighborRegionPosition: BigNumberish],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "init"
  ): TypedContractMethod<[worldAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "isRegionIncluded"
  ): TypedContractMethod<[regionId: BigNumberish], [boolean], "view">;
  getFunction(
    nameOrSignature: "world"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "RegionIncluded"
  ): TypedContractEvent<
    RegionIncludedEvent.InputTuple,
    RegionIncludedEvent.OutputTuple,
    RegionIncludedEvent.OutputObject
  >;

  filters: {
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

    "RegionIncluded(uint64)": TypedContractEvent<
      RegionIncludedEvent.InputTuple,
      RegionIncludedEvent.OutputTuple,
      RegionIncludedEvent.OutputObject
    >;
    RegionIncluded: TypedContractEvent<
      RegionIncludedEvent.InputTuple,
      RegionIncludedEvent.OutputTuple,
      RegionIncludedEvent.OutputObject
    >;
  };
}