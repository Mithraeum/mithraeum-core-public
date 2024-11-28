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
  AddressLike,
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
} from "../../../common";

export interface IWorldAssetFactoryInterface extends Interface {
  getFunction(nameOrSignature: "create"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "create",
    values: [AddressLike, BigNumberish, BytesLike, BytesLike, BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "create", data: BytesLike): Result;
}

export interface IWorldAssetFactory extends BaseContract {
  connect(runner?: ContractRunner | null): IWorldAssetFactory;
  waitForDeployment(): Promise<this>;

  interface: IWorldAssetFactoryInterface;

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

  create: TypedContractMethod<
    [
      worldAddress: AddressLike,
      eraNumber: BigNumberish,
      assetGroupId: BytesLike,
      assetTypeId: BytesLike,
      initParams: BytesLike
    ],
    [string],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "create"
  ): TypedContractMethod<
    [
      worldAddress: AddressLike,
      eraNumber: BigNumberish,
      assetGroupId: BytesLike,
      assetTypeId: BytesLike,
      initParams: BytesLike
    ],
    [string],
    "nonpayable"
  >;

  filters: {};
}