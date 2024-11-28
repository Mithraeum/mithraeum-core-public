/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
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
} from "../../common";

export interface ResolverInterface extends Interface {
  getFunction(nameOrSignature: "setWorldAddress" | "worlds"): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "NewWorldAddress"): EventFragment;

  encodeFunctionData(
    functionFragment: "setWorldAddress",
    values: [string, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "worlds",
    values: [AddressLike, string]
  ): string;

  decodeFunctionResult(
    functionFragment: "setWorldAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "worlds", data: BytesLike): Result;
}

export namespace NewWorldAddressEvent {
  export type InputTuple = [
    deployer: AddressLike,
    environmentName: string,
    worldAddress: AddressLike
  ];
  export type OutputTuple = [
    deployer: string,
    environmentName: string,
    worldAddress: string
  ];
  export interface OutputObject {
    deployer: string;
    environmentName: string;
    worldAddress: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Resolver extends BaseContract {
  connect(runner?: ContractRunner | null): Resolver;
  waitForDeployment(): Promise<this>;

  interface: ResolverInterface;

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

  setWorldAddress: TypedContractMethod<
    [environmentName: string, worldAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  worlds: TypedContractMethod<
    [arg0: AddressLike, arg1: string],
    [string],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "setWorldAddress"
  ): TypedContractMethod<
    [environmentName: string, worldAddress: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "worlds"
  ): TypedContractMethod<[arg0: AddressLike, arg1: string], [string], "view">;

  getEvent(
    key: "NewWorldAddress"
  ): TypedContractEvent<
    NewWorldAddressEvent.InputTuple,
    NewWorldAddressEvent.OutputTuple,
    NewWorldAddressEvent.OutputObject
  >;

  filters: {
    "NewWorldAddress(address,string,address)": TypedContractEvent<
      NewWorldAddressEvent.InputTuple,
      NewWorldAddressEvent.OutputTuple,
      NewWorldAddressEvent.OutputObject
    >;
    NewWorldAddress: TypedContractEvent<
      NewWorldAddressEvent.InputTuple,
      NewWorldAddressEvent.OutputTuple,
      NewWorldAddressEvent.OutputObject
    >;
  };
}