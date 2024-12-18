/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IRegion,
  IRegionInterface,
} from "../../../../../contracts/core/assets/region/IRegion";

const _abi = [
  {
    inputs: [],
    name: "OnlyEraUnits",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "settlementAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "reducedCorruptionIndexAmount",
        type: "uint256",
      },
    ],
    name: "CorruptionIndexDecreased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "settlementAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "addedCorruptionIndexAmount",
        type: "uint256",
      },
    ],
    name: "CorruptionIndexIncreased",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newCultistsSummonIntervalNumber",
        type: "uint256",
      },
    ],
    name: "LastCultistsSummonIntervalNumberUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newRegionCultistsAmount",
        type: "uint256",
      },
    ],
    name: "RegionCultistsChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "lastUpdateTime",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "lastUpdateRegionTime",
        type: "uint256",
      },
    ],
    name: "RegionTimeChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "settlementsMarketAddress",
        type: "address",
      },
    ],
    name: "SettlementsMarketCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "unitsPoolAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "unitTypeId",
        type: "bytes32",
      },
    ],
    name: "UnitsPoolCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "workersPoolAddress",
        type: "address",
      },
    ],
    name: "WorkersPoolCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokensOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "settlementAddress",
        type: "address",
      },
      {
        internalType: "bytes32[]",
        name: "unitTypeIds",
        type: "bytes32[]",
      },
      {
        internalType: "uint256[]",
        name: "unitsAmounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "maxTokensToSell",
        type: "uint256[]",
      },
    ],
    name: "buyUnitsBatch",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "corruptionIndex",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "cultistsPosition",
        type: "uint64",
      },
    ],
    name: "createCultistsSettlement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cultistsSettlement",
    outputs: [
      {
        internalType: "contract ISettlement",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "settlementAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "decreaseCorruptionIndex",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getPenaltyFromCultists",
    outputs: [
      {
        internalType: "uint256",
        name: "penalty",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "getRegionTime",
    outputs: [
      {
        internalType: "uint256",
        name: "regionTime",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "handleCultistsDefeated",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "handleCultistsSummoned",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "settlementAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "increaseCorruptionIndex",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lastCultistsSummonIntervalNumber",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastUpdateRegionTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "lastUpdateTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "regionId",
    outputs: [
      {
        internalType: "uint64",
        name: "",
        type: "uint64",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "settlementsMarket",
    outputs: [
      {
        internalType: "contract ISettlementsMarket",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "unitTypeId",
        type: "bytes32",
      },
    ],
    name: "unitsPools",
    outputs: [
      {
        internalType: "contract IUnitsPool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "globalTime",
        type: "uint256",
      },
    ],
    name: "updateRegionTime",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateState",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "workersPool",
    outputs: [
      {
        internalType: "contract IWorkersPool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export class IRegion__factory {
  static readonly abi = _abi;
  static createInterface(): IRegionInterface {
    return new Interface(_abi) as IRegionInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): IRegion {
    return new Contract(address, _abi, runner) as unknown as IRegion;
  }
}
