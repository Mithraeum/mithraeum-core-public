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

export declare namespace IBuilding {
  export type ProductionConfigItemStruct = {
    resourceTypeId: BytesLike;
    amountPerTick: BigNumberish;
    isProducing: boolean;
  };

  export type ProductionConfigItemStructOutput = [
    resourceTypeId: string,
    amountPerTick: bigint,
    isProducing: boolean
  ] & { resourceTypeId: string; amountPerTick: bigint; isProducing: boolean };

  export type ProductionResultItemStruct = {
    resourceTypeId: BytesLike;
    balanceDelta: BigNumberish;
    isProduced: boolean;
  };

  export type ProductionResultItemStructOutput = [
    resourceTypeId: string,
    balanceDelta: bigint,
    isProduced: boolean
  ] & { resourceTypeId: string; balanceDelta: bigint; isProduced: boolean };
}

export interface SmithyInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "activateBuilding"
      | "advancedProduction"
      | "assetGroupId"
      | "assetTypeId"
      | "basicProduction"
      | "buildingActivationInfo"
      | "buildingTypeId"
      | "burnTreasury"
      | "claimWorkersForBuildingActivation"
      | "decreaseAdditionalWorkersCapacityMultiplier"
      | "distributeToAllShareholders"
      | "distributeToSingleShareholder"
      | "distributionId"
      | "era"
      | "eraNumber"
      | "getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier"
      | "getAdvancedUpgradeCooldownDuration"
      | "getAssignedWorkers"
      | "getAvailableForAdvancedProductionWorkersCapacity"
      | "getBasicUpgradeCooldownDuration"
      | "getBuildingCoefficient"
      | "getBuildingLevel"
      | "getConfig"
      | "getMaxTreasuryByLevel"
      | "getProducingResourceTypeId"
      | "getProductionResult"
      | "getResourcesAmount"
      | "getTreasuryAmount"
      | "getUpgradePrice"
      | "getWorkersCapacity"
      | "givenProsperityAmount"
      | "handleProductionResourcesChanged"
      | "increaseAdditionalWorkersCapacityMultiplier"
      | "init"
      | "isResourceAcceptable"
      | "onERC1155BatchReceived"
      | "onERC1155Received"
      | "producedResourceDebt"
      | "productionInfo"
      | "registry"
      | "relatedSettlement"
      | "resetDistribution"
      | "stealTreasury"
      | "supportsInterface"
      | "updateDebtsAccordingToNewDistributionsAmounts"
      | "updateState"
      | "upgradeAdvancedProduction"
      | "upgradeBasicProduction"
      | "upgradeCooldownEndTime"
      | "world"
      | "worldAssetFactory"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AdvancedProductionAdditionalWorkersCapacityMultiplierUpdated"
      | "AdvancedProductionUpgraded"
      | "BasicProductionUpgraded"
      | "DistributedToShareHolder"
      | "DistributionCreated"
      | "Initialized"
      | "ProducedResourceDebtUpdated"
      | "ProductionInfoUpdated"
      | "WorkersClaimed"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "activateBuilding",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "advancedProduction",
    values?: undefined
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
    functionFragment: "basicProduction",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "buildingActivationInfo",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "buildingTypeId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "burnTreasury",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "claimWorkersForBuildingActivation",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "decreaseAdditionalWorkersCapacityMultiplier",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "distributeToAllShareholders",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "distributeToSingleShareholder",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "distributionId",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "era", values?: undefined): string;
  encodeFunctionData(functionFragment: "eraNumber", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAdvancedUpgradeCooldownDuration",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAssignedWorkers",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getAvailableForAdvancedProductionWorkersCapacity",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getBasicUpgradeCooldownDuration",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getBuildingCoefficient",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getBuildingLevel",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "getConfig", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getMaxTreasuryByLevel",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getProducingResourceTypeId",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getProductionResult",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getResourcesAmount",
    values: [BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getTreasuryAmount",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getUpgradePrice",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getWorkersCapacity",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "givenProsperityAmount",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "handleProductionResourcesChanged",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "increaseAdditionalWorkersCapacityMultiplier",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "init", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "isResourceAcceptable",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC1155BatchReceived",
    values: [
      AddressLike,
      AddressLike,
      BigNumberish[],
      BigNumberish[],
      BytesLike
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "onERC1155Received",
    values: [AddressLike, AddressLike, BigNumberish, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "producedResourceDebt",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "productionInfo",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "registry", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "relatedSettlement",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "resetDistribution",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "stealTreasury",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateDebtsAccordingToNewDistributionsAmounts",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "updateState",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeAdvancedProduction",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeBasicProduction",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "upgradeCooldownEndTime",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "world", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "worldAssetFactory",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "activateBuilding",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "advancedProduction",
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
    functionFragment: "basicProduction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "buildingActivationInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "buildingTypeId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "burnTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimWorkersForBuildingActivation",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "decreaseAdditionalWorkersCapacityMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "distributeToAllShareholders",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "distributeToSingleShareholder",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "distributionId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "era", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "eraNumber", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAdvancedUpgradeCooldownDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAssignedWorkers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAvailableForAdvancedProductionWorkersCapacity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBasicUpgradeCooldownDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBuildingCoefficient",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBuildingLevel",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getConfig", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getMaxTreasuryByLevel",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getProducingResourceTypeId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getProductionResult",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getResourcesAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTreasuryAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getUpgradePrice",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getWorkersCapacity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "givenProsperityAmount",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "handleProductionResourcesChanged",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseAdditionalWorkersCapacityMultiplier",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "init", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isResourceAcceptable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC1155BatchReceived",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "onERC1155Received",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "producedResourceDebt",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "productionInfo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "registry", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "relatedSettlement",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "resetDistribution",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "stealTreasury",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateDebtsAccordingToNewDistributionsAmounts",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "upgradeAdvancedProduction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "upgradeBasicProduction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "upgradeCooldownEndTime",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "world", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "worldAssetFactory",
    data: BytesLike
  ): Result;
}

export namespace AdvancedProductionAdditionalWorkersCapacityMultiplierUpdatedEvent {
  export type InputTuple = [
    newAdditionalWorkersCapacityMultiplier: BigNumberish
  ];
  export type OutputTuple = [newAdditionalWorkersCapacityMultiplier: bigint];
  export interface OutputObject {
    newAdditionalWorkersCapacityMultiplier: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace AdvancedProductionUpgradedEvent {
  export type InputTuple = [
    newAdvancedProductionLevel: BigNumberish,
    newAdvancedProductionCoefficient: BigNumberish
  ];
  export type OutputTuple = [
    newAdvancedProductionLevel: bigint,
    newAdvancedProductionCoefficient: bigint
  ];
  export interface OutputObject {
    newAdvancedProductionLevel: bigint;
    newAdvancedProductionCoefficient: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace BasicProductionUpgradedEvent {
  export type InputTuple = [
    newBasicProductionLevel: BigNumberish,
    newBasicProductionCoefficient: BigNumberish
  ];
  export type OutputTuple = [
    newBasicProductionLevel: bigint,
    newBasicProductionCoefficient: bigint
  ];
  export interface OutputObject {
    newBasicProductionLevel: bigint;
    newBasicProductionCoefficient: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DistributedToShareHolderEvent {
  export type InputTuple = [
    resourceTypeId: BytesLike,
    holder: AddressLike,
    amount: BigNumberish
  ];
  export type OutputTuple = [
    resourceTypeId: string,
    holder: string,
    amount: bigint
  ];
  export interface OutputObject {
    resourceTypeId: string;
    holder: string;
    amount: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DistributionCreatedEvent {
  export type InputTuple = [newDistributionId: BigNumberish];
  export type OutputTuple = [newDistributionId: bigint];
  export interface OutputObject {
    newDistributionId: bigint;
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

export namespace ProducedResourceDebtUpdatedEvent {
  export type InputTuple = [
    distributionNftHolder: AddressLike,
    newDebt: BigNumberish
  ];
  export type OutputTuple = [distributionNftHolder: string, newDebt: bigint];
  export interface OutputObject {
    distributionNftHolder: string;
    newDebt: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ProductionInfoUpdatedEvent {
  export type InputTuple = [
    lastUpdateStateTime: BigNumberish,
    lastUpdateStateRegionTime: BigNumberish,
    readyToBeDistributed: BigNumberish,
    totalDebt: BigNumberish
  ];
  export type OutputTuple = [
    lastUpdateStateTime: bigint,
    lastUpdateStateRegionTime: bigint,
    readyToBeDistributed: bigint,
    totalDebt: bigint
  ];
  export interface OutputObject {
    lastUpdateStateTime: bigint;
    lastUpdateStateRegionTime: bigint;
    readyToBeDistributed: bigint;
    totalDebt: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WorkersClaimedEvent {
  export type InputTuple = [];
  export type OutputTuple = [];
  export interface OutputObject {}
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Smithy extends BaseContract {
  connect(runner?: ContractRunner | null): Smithy;
  waitForDeployment(): Promise<this>;

  interface: SmithyInterface;

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

  activateBuilding: TypedContractMethod<
    [resourcesOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  advancedProduction: TypedContractMethod<
    [],
    [
      [bigint, bigint, bigint, bigint] & {
        level: bigint;
        coefficient: bigint;
        additionalWorkersCapacityMultiplier: bigint;
        toBeProducedTicks: bigint;
      }
    ],
    "view"
  >;

  assetGroupId: TypedContractMethod<[], [string], "view">;

  assetTypeId: TypedContractMethod<[], [string], "view">;

  basicProduction: TypedContractMethod<
    [],
    [[bigint, bigint] & { level: bigint; coefficient: bigint }],
    "view"
  >;

  buildingActivationInfo: TypedContractMethod<
    [],
    [[bigint, boolean] & { activationTime: bigint; isWorkersClaimed: boolean }],
    "view"
  >;

  buildingTypeId: TypedContractMethod<[], [string], "view">;

  burnTreasury: TypedContractMethod<
    [burnAmount: BigNumberish],
    [void],
    "nonpayable"
  >;

  claimWorkersForBuildingActivation: TypedContractMethod<
    [],
    [void],
    "nonpayable"
  >;

  decreaseAdditionalWorkersCapacityMultiplier: TypedContractMethod<
    [capacityAmount: BigNumberish],
    [void],
    "nonpayable"
  >;

  distributeToAllShareholders: TypedContractMethod<[], [void], "nonpayable">;

  distributeToSingleShareholder: TypedContractMethod<
    [holder: AddressLike],
    [void],
    "nonpayable"
  >;

  distributionId: TypedContractMethod<[], [bigint], "view">;

  era: TypedContractMethod<[], [string], "view">;

  eraNumber: TypedContractMethod<[], [bigint], "view">;

  getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  getAdvancedUpgradeCooldownDuration: TypedContractMethod<
    [level: BigNumberish],
    [bigint],
    "view"
  >;

  getAssignedWorkers: TypedContractMethod<[], [bigint], "view">;

  getAvailableForAdvancedProductionWorkersCapacity: TypedContractMethod<
    [],
    [bigint],
    "view"
  >;

  getBasicUpgradeCooldownDuration: TypedContractMethod<
    [level: BigNumberish],
    [bigint],
    "view"
  >;

  getBuildingCoefficient: TypedContractMethod<
    [level: BigNumberish],
    [bigint],
    "view"
  >;

  getBuildingLevel: TypedContractMethod<[], [bigint], "view">;

  getConfig: TypedContractMethod<
    [],
    [IBuilding.ProductionConfigItemStructOutput[]],
    "view"
  >;

  getMaxTreasuryByLevel: TypedContractMethod<
    [level: BigNumberish],
    [bigint],
    "view"
  >;

  getProducingResourceTypeId: TypedContractMethod<[], [string], "view">;

  getProductionResult: TypedContractMethod<
    [timestamp: BigNumberish],
    [IBuilding.ProductionResultItemStructOutput[]],
    "view"
  >;

  getResourcesAmount: TypedContractMethod<
    [resourceTypeId: BytesLike, timestamp: BigNumberish],
    [bigint],
    "view"
  >;

  getTreasuryAmount: TypedContractMethod<
    [timestamp: BigNumberish],
    [bigint],
    "view"
  >;

  getUpgradePrice: TypedContractMethod<[level: BigNumberish], [bigint], "view">;

  getWorkersCapacity: TypedContractMethod<[], [bigint], "view">;

  givenProsperityAmount: TypedContractMethod<[], [bigint], "view">;

  handleProductionResourcesChanged: TypedContractMethod<
    [],
    [void],
    "nonpayable"
  >;

  increaseAdditionalWorkersCapacityMultiplier: TypedContractMethod<
    [capacityAmount: BigNumberish],
    [void],
    "nonpayable"
  >;

  init: TypedContractMethod<[initParams: BytesLike], [void], "nonpayable">;

  isResourceAcceptable: TypedContractMethod<
    [resourceTypeId: BytesLike],
    [boolean],
    "view"
  >;

  onERC1155BatchReceived: TypedContractMethod<
    [
      operator: AddressLike,
      from: AddressLike,
      ids: BigNumberish[],
      values: BigNumberish[],
      data: BytesLike
    ],
    [string],
    "nonpayable"
  >;

  onERC1155Received: TypedContractMethod<
    [
      operator: AddressLike,
      from: AddressLike,
      id: BigNumberish,
      value: BigNumberish,
      data: BytesLike
    ],
    [string],
    "nonpayable"
  >;

  producedResourceDebt: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  productionInfo: TypedContractMethod<
    [],
    [
      [bigint, bigint, bigint, bigint] & {
        lastUpdateStateTime: bigint;
        lastUpdateStateRegionTime: bigint;
        readyToBeDistributed: bigint;
        totalDebt: bigint;
      }
    ],
    "view"
  >;

  registry: TypedContractMethod<[], [string], "view">;

  relatedSettlement: TypedContractMethod<[], [string], "view">;

  resetDistribution: TypedContractMethod<[], [void], "nonpayable">;

  stealTreasury: TypedContractMethod<
    [stealerSettlementAddress: AddressLike, amount: BigNumberish],
    [[bigint, bigint]],
    "nonpayable"
  >;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  updateDebtsAccordingToNewDistributionsAmounts: TypedContractMethod<
    [from: AddressLike, to: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  updateState: TypedContractMethod<[], [void], "nonpayable">;

  upgradeAdvancedProduction: TypedContractMethod<
    [resourcesOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  upgradeBasicProduction: TypedContractMethod<
    [resourcesOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  upgradeCooldownEndTime: TypedContractMethod<[], [bigint], "view">;

  world: TypedContractMethod<[], [string], "view">;

  worldAssetFactory: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "activateBuilding"
  ): TypedContractMethod<[resourcesOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "advancedProduction"
  ): TypedContractMethod<
    [],
    [
      [bigint, bigint, bigint, bigint] & {
        level: bigint;
        coefficient: bigint;
        additionalWorkersCapacityMultiplier: bigint;
        toBeProducedTicks: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "assetGroupId"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "assetTypeId"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "basicProduction"
  ): TypedContractMethod<
    [],
    [[bigint, bigint] & { level: bigint; coefficient: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "buildingActivationInfo"
  ): TypedContractMethod<
    [],
    [[bigint, boolean] & { activationTime: bigint; isWorkersClaimed: boolean }],
    "view"
  >;
  getFunction(
    nameOrSignature: "buildingTypeId"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "burnTreasury"
  ): TypedContractMethod<[burnAmount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "claimWorkersForBuildingActivation"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "decreaseAdditionalWorkersCapacityMultiplier"
  ): TypedContractMethod<[capacityAmount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "distributeToAllShareholders"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "distributeToSingleShareholder"
  ): TypedContractMethod<[holder: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "distributionId"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "era"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "eraNumber"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getAdditionalWorkersFromAdditionalWorkersCapacityMultiplier"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getAdvancedUpgradeCooldownDuration"
  ): TypedContractMethod<[level: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getAssignedWorkers"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getAvailableForAdvancedProductionWorkersCapacity"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getBasicUpgradeCooldownDuration"
  ): TypedContractMethod<[level: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getBuildingCoefficient"
  ): TypedContractMethod<[level: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getBuildingLevel"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getConfig"
  ): TypedContractMethod<
    [],
    [IBuilding.ProductionConfigItemStructOutput[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getMaxTreasuryByLevel"
  ): TypedContractMethod<[level: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getProducingResourceTypeId"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "getProductionResult"
  ): TypedContractMethod<
    [timestamp: BigNumberish],
    [IBuilding.ProductionResultItemStructOutput[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getResourcesAmount"
  ): TypedContractMethod<
    [resourceTypeId: BytesLike, timestamp: BigNumberish],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getTreasuryAmount"
  ): TypedContractMethod<[timestamp: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getUpgradePrice"
  ): TypedContractMethod<[level: BigNumberish], [bigint], "view">;
  getFunction(
    nameOrSignature: "getWorkersCapacity"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "givenProsperityAmount"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "handleProductionResourcesChanged"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "increaseAdditionalWorkersCapacityMultiplier"
  ): TypedContractMethod<[capacityAmount: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "init"
  ): TypedContractMethod<[initParams: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "isResourceAcceptable"
  ): TypedContractMethod<[resourceTypeId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "onERC1155BatchReceived"
  ): TypedContractMethod<
    [
      operator: AddressLike,
      from: AddressLike,
      ids: BigNumberish[],
      values: BigNumberish[],
      data: BytesLike
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "onERC1155Received"
  ): TypedContractMethod<
    [
      operator: AddressLike,
      from: AddressLike,
      id: BigNumberish,
      value: BigNumberish,
      data: BytesLike
    ],
    [string],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "producedResourceDebt"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "productionInfo"
  ): TypedContractMethod<
    [],
    [
      [bigint, bigint, bigint, bigint] & {
        lastUpdateStateTime: bigint;
        lastUpdateStateRegionTime: bigint;
        readyToBeDistributed: bigint;
        totalDebt: bigint;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "registry"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "relatedSettlement"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "resetDistribution"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "stealTreasury"
  ): TypedContractMethod<
    [stealerSettlementAddress: AddressLike, amount: BigNumberish],
    [[bigint, bigint]],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "updateDebtsAccordingToNewDistributionsAmounts"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "updateState"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "upgradeAdvancedProduction"
  ): TypedContractMethod<[resourcesOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "upgradeBasicProduction"
  ): TypedContractMethod<[resourcesOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "upgradeCooldownEndTime"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "world"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "worldAssetFactory"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "AdvancedProductionAdditionalWorkersCapacityMultiplierUpdated"
  ): TypedContractEvent<
    AdvancedProductionAdditionalWorkersCapacityMultiplierUpdatedEvent.InputTuple,
    AdvancedProductionAdditionalWorkersCapacityMultiplierUpdatedEvent.OutputTuple,
    AdvancedProductionAdditionalWorkersCapacityMultiplierUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "AdvancedProductionUpgraded"
  ): TypedContractEvent<
    AdvancedProductionUpgradedEvent.InputTuple,
    AdvancedProductionUpgradedEvent.OutputTuple,
    AdvancedProductionUpgradedEvent.OutputObject
  >;
  getEvent(
    key: "BasicProductionUpgraded"
  ): TypedContractEvent<
    BasicProductionUpgradedEvent.InputTuple,
    BasicProductionUpgradedEvent.OutputTuple,
    BasicProductionUpgradedEvent.OutputObject
  >;
  getEvent(
    key: "DistributedToShareHolder"
  ): TypedContractEvent<
    DistributedToShareHolderEvent.InputTuple,
    DistributedToShareHolderEvent.OutputTuple,
    DistributedToShareHolderEvent.OutputObject
  >;
  getEvent(
    key: "DistributionCreated"
  ): TypedContractEvent<
    DistributionCreatedEvent.InputTuple,
    DistributionCreatedEvent.OutputTuple,
    DistributionCreatedEvent.OutputObject
  >;
  getEvent(
    key: "Initialized"
  ): TypedContractEvent<
    InitializedEvent.InputTuple,
    InitializedEvent.OutputTuple,
    InitializedEvent.OutputObject
  >;
  getEvent(
    key: "ProducedResourceDebtUpdated"
  ): TypedContractEvent<
    ProducedResourceDebtUpdatedEvent.InputTuple,
    ProducedResourceDebtUpdatedEvent.OutputTuple,
    ProducedResourceDebtUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "ProductionInfoUpdated"
  ): TypedContractEvent<
    ProductionInfoUpdatedEvent.InputTuple,
    ProductionInfoUpdatedEvent.OutputTuple,
    ProductionInfoUpdatedEvent.OutputObject
  >;
  getEvent(
    key: "WorkersClaimed"
  ): TypedContractEvent<
    WorkersClaimedEvent.InputTuple,
    WorkersClaimedEvent.OutputTuple,
    WorkersClaimedEvent.OutputObject
  >;

  filters: {
    "AdvancedProductionAdditionalWorkersCapacityMultiplierUpdated(uint256)": TypedContractEvent<
      AdvancedProductionAdditionalWorkersCapacityMultiplierUpdatedEvent.InputTuple,
      AdvancedProductionAdditionalWorkersCapacityMultiplierUpdatedEvent.OutputTuple,
      AdvancedProductionAdditionalWorkersCapacityMultiplierUpdatedEvent.OutputObject
    >;
    AdvancedProductionAdditionalWorkersCapacityMultiplierUpdated: TypedContractEvent<
      AdvancedProductionAdditionalWorkersCapacityMultiplierUpdatedEvent.InputTuple,
      AdvancedProductionAdditionalWorkersCapacityMultiplierUpdatedEvent.OutputTuple,
      AdvancedProductionAdditionalWorkersCapacityMultiplierUpdatedEvent.OutputObject
    >;

    "AdvancedProductionUpgraded(uint256,uint256)": TypedContractEvent<
      AdvancedProductionUpgradedEvent.InputTuple,
      AdvancedProductionUpgradedEvent.OutputTuple,
      AdvancedProductionUpgradedEvent.OutputObject
    >;
    AdvancedProductionUpgraded: TypedContractEvent<
      AdvancedProductionUpgradedEvent.InputTuple,
      AdvancedProductionUpgradedEvent.OutputTuple,
      AdvancedProductionUpgradedEvent.OutputObject
    >;

    "BasicProductionUpgraded(uint256,uint256)": TypedContractEvent<
      BasicProductionUpgradedEvent.InputTuple,
      BasicProductionUpgradedEvent.OutputTuple,
      BasicProductionUpgradedEvent.OutputObject
    >;
    BasicProductionUpgraded: TypedContractEvent<
      BasicProductionUpgradedEvent.InputTuple,
      BasicProductionUpgradedEvent.OutputTuple,
      BasicProductionUpgradedEvent.OutputObject
    >;

    "DistributedToShareHolder(bytes32,address,uint256)": TypedContractEvent<
      DistributedToShareHolderEvent.InputTuple,
      DistributedToShareHolderEvent.OutputTuple,
      DistributedToShareHolderEvent.OutputObject
    >;
    DistributedToShareHolder: TypedContractEvent<
      DistributedToShareHolderEvent.InputTuple,
      DistributedToShareHolderEvent.OutputTuple,
      DistributedToShareHolderEvent.OutputObject
    >;

    "DistributionCreated(uint256)": TypedContractEvent<
      DistributionCreatedEvent.InputTuple,
      DistributionCreatedEvent.OutputTuple,
      DistributionCreatedEvent.OutputObject
    >;
    DistributionCreated: TypedContractEvent<
      DistributionCreatedEvent.InputTuple,
      DistributionCreatedEvent.OutputTuple,
      DistributionCreatedEvent.OutputObject
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

    "ProducedResourceDebtUpdated(address,uint256)": TypedContractEvent<
      ProducedResourceDebtUpdatedEvent.InputTuple,
      ProducedResourceDebtUpdatedEvent.OutputTuple,
      ProducedResourceDebtUpdatedEvent.OutputObject
    >;
    ProducedResourceDebtUpdated: TypedContractEvent<
      ProducedResourceDebtUpdatedEvent.InputTuple,
      ProducedResourceDebtUpdatedEvent.OutputTuple,
      ProducedResourceDebtUpdatedEvent.OutputObject
    >;

    "ProductionInfoUpdated(uint256,uint256,uint256,uint256)": TypedContractEvent<
      ProductionInfoUpdatedEvent.InputTuple,
      ProductionInfoUpdatedEvent.OutputTuple,
      ProductionInfoUpdatedEvent.OutputObject
    >;
    ProductionInfoUpdated: TypedContractEvent<
      ProductionInfoUpdatedEvent.InputTuple,
      ProductionInfoUpdatedEvent.OutputTuple,
      ProductionInfoUpdatedEvent.OutputObject
    >;

    "WorkersClaimed()": TypedContractEvent<
      WorkersClaimedEvent.InputTuple,
      WorkersClaimedEvent.OutputTuple,
      WorkersClaimedEvent.OutputObject
    >;
    WorkersClaimed: TypedContractEvent<
      WorkersClaimedEvent.InputTuple,
      WorkersClaimedEvent.OutputTuple,
      WorkersClaimedEvent.OutputObject
    >;
  };
}
