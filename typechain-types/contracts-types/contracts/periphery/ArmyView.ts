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
} from "../../common";

export declare namespace ArmyView {
  export type ArmyCombinedDataStruct = {
    id: AddressLike;
    owner: AddressLike;
    ownerSettlementId: AddressLike;
    currentPosition: BigNumberish;
    currentPositionSettlementId: AddressLike;
    destinationPosition: BigNumberish;
    destinationPositionSettlementId: AddressLike;
    secretDestinationRegionId: BigNumberish;
    secretDestinationPosition: BytesLike;
    maneuverBeginTime: BigNumberish;
    maneuverEndTime: BigNumberish;
    battleId: AddressLike;
    units: BigNumberish[];
    besiegingUnits: BigNumberish[];
    robberyPoints: BigNumberish;
    stunBeginTime: BigNumberish;
    stunEndTime: BigNumberish;
  };

  export type ArmyCombinedDataStructOutput = [
    id: string,
    owner: string,
    ownerSettlementId: string,
    currentPosition: bigint,
    currentPositionSettlementId: string,
    destinationPosition: bigint,
    destinationPositionSettlementId: string,
    secretDestinationRegionId: bigint,
    secretDestinationPosition: string,
    maneuverBeginTime: bigint,
    maneuverEndTime: bigint,
    battleId: string,
    units: bigint[],
    besiegingUnits: bigint[],
    robberyPoints: bigint,
    stunBeginTime: bigint,
    stunEndTime: bigint
  ] & {
    id: string;
    owner: string;
    ownerSettlementId: string;
    currentPosition: bigint;
    currentPositionSettlementId: string;
    destinationPosition: bigint;
    destinationPositionSettlementId: string;
    secretDestinationRegionId: bigint;
    secretDestinationPosition: string;
    maneuverBeginTime: bigint;
    maneuverEndTime: bigint;
    battleId: string;
    units: bigint[];
    besiegingUnits: bigint[];
    robberyPoints: bigint;
    stunBeginTime: bigint;
    stunEndTime: bigint;
  };
}

export interface ArmyViewInterface extends Interface {
  getFunction(nameOrSignature: "getArmyCombinedData"): FunctionFragment;

  encodeFunctionData(
    functionFragment: "getArmyCombinedData",
    values: [AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "getArmyCombinedData",
    data: BytesLike
  ): Result;
}

export interface ArmyView extends BaseContract {
  connect(runner?: ContractRunner | null): ArmyView;
  waitForDeployment(): Promise<this>;

  interface: ArmyViewInterface;

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

  getArmyCombinedData: TypedContractMethod<
    [armyAddress: AddressLike, timestamp: BigNumberish],
    [ArmyView.ArmyCombinedDataStructOutput],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getArmyCombinedData"
  ): TypedContractMethod<
    [armyAddress: AddressLike, timestamp: BigNumberish],
    [ArmyView.ArmyCombinedDataStructOutput],
    "view"
  >;

  filters: {};
}