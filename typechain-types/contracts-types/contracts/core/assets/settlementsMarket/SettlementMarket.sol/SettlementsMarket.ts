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
} from "../../../../../common";

export interface SettlementsMarketInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "assetGroupId"
      | "assetTypeId"
      | "buySettlement"
      | "buySettlementForFreeByMightyCreator"
      | "era"
      | "eraNumber"
      | "getNewSettlementCost"
      | "init"
      | "marketCreationTime"
      | "registry"
      | "relatedRegion"
      | "updateState"
      | "world"
      | "worldAssetFactory"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "Initialized" | "SettlementBought"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "assetGroupId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "assetTypeId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "buySettlement",
    values: [BigNumberish, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "buySettlementForFreeByMightyCreator",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "era", values?: undefined): string;
  encodeFunctionData(functionFragment: "eraNumber", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getNewSettlementCost",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "init", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "marketCreationTime",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "registry", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "relatedRegion",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "updateState",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "world", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "worldAssetFactory",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "assetGroupId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "assetTypeId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "buySettlement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "buySettlementForFreeByMightyCreator",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "era", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "eraNumber", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getNewSettlementCost",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "marketCreationTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "registry", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "relatedRegion",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "world", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "worldAssetFactory",
    data: BytesLike
  ): Result;
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

export namespace SettlementBoughtEvent {
  export type InputTuple = [
    settlementAddress: AddressLike,
    settlementCost: BigNumberish
  ];
  export type OutputTuple = [settlementAddress: string, settlementCost: bigint];
  export interface OutputObject {
    settlementAddress: string;
    settlementCost: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface SettlementsMarket extends BaseContract {
  connect(runner?: ContractRunner | null): SettlementsMarket;
  waitForDeployment(): Promise<this>;

  interface: SettlementsMarketInterface;

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

  assetGroupId: TypedContractMethod<[], [string], "view">;

  assetTypeId: TypedContractMethod<[], [string], "view">;

  buySettlement: TypedContractMethod<
    [
      position: BigNumberish,
      bannerId: BigNumberish,
      maxTokensToUse: BigNumberish
    ],
    [void],
    "payable"
  >;

  buySettlementForFreeByMightyCreator: TypedContractMethod<
    [position: BigNumberish, bannerId: BigNumberish],
    [void],
    "nonpayable"
  >;

  era: TypedContractMethod<[], [string], "view">;

  eraNumber: TypedContractMethod<[], [bigint], "view">;

  getNewSettlementCost: TypedContractMethod<
    [timestamp: BigNumberish],
    [bigint],
    "view"
  >;

  init: TypedContractMethod<[initParams: BytesLike], [void], "nonpayable">;

  marketCreationTime: TypedContractMethod<[], [bigint], "view">;

  registry: TypedContractMethod<[], [string], "view">;

  relatedRegion: TypedContractMethod<[], [string], "view">;

  updateState: TypedContractMethod<[], [void], "nonpayable">;

  world: TypedContractMethod<[], [string], "view">;

  worldAssetFactory: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "assetGroupId"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "assetTypeId"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "buySettlement"
  ): TypedContractMethod<
    [
      position: BigNumberish,
      bannerId: BigNumberish,
      maxTokensToUse: BigNumberish
    ],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "buySettlementForFreeByMightyCreator"
  ): TypedContractMethod<
    [position: BigNumberish, bannerId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "era"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "eraNumber"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getNewSettlementCost"
  ): TypedContractMethod<[timestamp: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "init"
  ): TypedContractMethod<[initParams: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "marketCreationTime"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "registry"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "relatedRegion"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "updateState"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "world"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "worldAssetFactory"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "SettlementBought"
  ): TypedContractEvent<
    SettlementBoughtEvent.InputTuple,
    SettlementBoughtEvent.OutputTuple,
    SettlementBoughtEvent.OutputObject
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

    "SettlementBought(address,uint256)": TypedContractEvent<
      SettlementBoughtEvent.InputTuple,
      SettlementBoughtEvent.OutputTuple,
      SettlementBoughtEvent.OutputObject
    >;
    SettlementBought: TypedContractEvent<
      SettlementBoughtEvent.InputTuple,
      SettlementBoughtEvent.OutputTuple,
      SettlementBoughtEvent.OutputObject
    >;
  };
}
