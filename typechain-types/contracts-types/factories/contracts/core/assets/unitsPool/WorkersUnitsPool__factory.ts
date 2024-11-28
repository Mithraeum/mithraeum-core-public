/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../../../../common";
import type {
  WorkersUnitsPool,
  WorkersUnitsPoolInterface,
} from "../../../../../contracts/core/assets/unitsPool/WorkersUnitsPool";

const _abi = [
  {
    inputs: [],
    name: "CannotHireUnitsDueToTheirCostIsHigherThanMaxTokensToSellSpecified",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotHireUnitsExceedingArmyUnitsLimit",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotHireUnitsExceedingTransactionLimit",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotHireUnitsForArmyWhichSettlementDoesNotBelongToRelatedRegion",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotHireUnitsInvalidUnitsToBuySpecified",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotHireUnitsWhileArmyIsManeuvering",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotHireUnitsWhileArmyIsNotOnHomePosition",
    type: "error",
  },
  {
    inputs: [],
    name: "CannotHireUnitsWhileArmyIsStunned",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyActiveGame",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyMightyCreator",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyRelatedRegion",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyRulerOrWorldAsset",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyWorldAssetFromSameEra",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint8",
        name: "version",
        type: "uint8",
      },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "armyAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "boughtUnitsAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "spentTokensAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "newUnitPrice",
        type: "uint256",
      },
    ],
    name: "UnitsBought",
    type: "event",
  },
  {
    inputs: [],
    name: "assetGroupId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "assetTypeId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "unitsToBuy",
        type: "uint256",
      },
    ],
    name: "calculateTokensForExactUnits",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
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
    name: "era",
    outputs: [
      {
        internalType: "contract IEra",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "eraNumber",
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
    inputs: [
      {
        internalType: "bytes",
        name: "initParams",
        type: "bytes",
      },
    ],
    name: "init",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "lastPurchaseTime",
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
    name: "registry",
    outputs: [
      {
        internalType: "contract IRegistry",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "relatedRegion",
    outputs: [
      {
        internalType: "contract IRegion",
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
        name: "tokensOwner",
        type: "address",
      },
      {
        internalType: "address",
        name: "settlementAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "unitsToBuy",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxTokensToSell",
        type: "uint256",
      },
    ],
    name: "swapTokensForExactUnits",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
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
        name: "msgSender",
        type: "address",
      },
      {
        internalType: "address",
        name: "settlementAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "unitsToBuy",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxTokensToSell",
        type: "uint256",
      },
    ],
    name: "swapTokensForExactUnitsByRegion",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unitPrice",
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
    name: "unitTypeId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "world",
    outputs: [
      {
        internalType: "contract IWorld",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "worldAssetFactory",
    outputs: [
      {
        internalType: "contract IWorldAssetFactory",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052348015600f57600080fd5b506118c78061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100d55760003560e01c80637d884c74116100875780637d884c741461015657806384ba89e31461015e578063a7d6911c14610166578063c14bafb11461018e578063e6c15c9914610197578063e73faa2d146101b0578063ece56a1a146101b9578063fb75b12c146101c157600080fd5b80630b4e99c3146100da578063143e55e0146100f557806330b67baa146101155780634ddf47d41461011d5780635920c54314610132578063772584511461013b5780637b1039991461014e575b600080fd5b6100e26101d4565b6040519081526020015b60405180910390f35b6100fd610211565b6040516001600160a01b0390911681526020016100ec565b6100fd610295565b61013061012b366004611589565b61029f565b005b6100e260025481565b6100e261014936600461165a565b610402565b6100fd610439565b6100e2610480565b6100e26104bd565b6101796101743660046116b5565b6104fa565b604080519283526020830191909152016100ec565b6100e260015481565b6000546100fd906201000090046001600160a01b031681565b6100e260035481565b6100fd610517565b6100e26101cf3660046116ce565b61055e565b604080516020808252818301909252600091309183918291906020820181803683370190505090506020607a60208301853c602001519392505050565b600061021b610295565b6001600160a01b031663720a70bd610231610480565b6040518263ffffffff1660e01b815260040161024f91815260200190565b602060405180830381865afa15801561026c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102909190611714565b905090565b600061029061058c565b600054610100900460ff16158080156102bf5750600054600160ff909116105b806102d95750303b1580156102d9575060005460ff166001145b6103405760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b6000805460ff191660011790558015610363576000805461ff0019166101001790555b6000808380602001905181019061037a9190611731565b600080546001600160a01b03909316620100000262010000600160b01b031990931692909217909155600255505042600155670de0b6b3a764000060035580156103fe576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050565b600061040c6105c9565b6104146106fd565b84846104208282610730565b61042d8888888888610851565b98975050505050505050565b6000610443610295565b6001600160a01b0316637b1039996040518163ffffffff1660e01b8152600401602060405180830381865afa15801561026c573d6000803e3d6000fd5b604080516020808252818301909252600091309183918291906020820181803683370190505090506020609a60208301853c602001519392505050565b604080516020808252818301909252600091309183918291906020820181803683370190505090506020605a60208301853c602001519392505050565b6000806003548361050b9190611775565b60035491509150915091565b6000610521610439565b6001600160a01b031663ece56a1a6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561026c573d6000803e3d6000fd5b60006105686105c9565b33846105748282610730565b6105818733888888610851565b979650505050505050565b604080516014808252818301909252600091309183918291906020820181803683370190505090506014602a60208301853c601401519392505050565b60006105d3610295565b90506000816001600160a01b0316633c8ca83d6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610615573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610639919061178c565b90506000826001600160a01b03166344d9bc5f6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561067b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061069f919061178c565b90508115806106ad57508142105b156106cb5760405163a00eda6960e01b815260040160405180910390fd5b80158015906106da5750804210155b156106f85760405163a00eda6960e01b815260040160405180910390fd5b505050565b6000546201000090046001600160a01b0316331461072e57604051630ca829d560e31b815260040160405180910390fd5b565b604051631b0b969d60e01b81526001600160a01b038381166004830152821690631b0b969d90602401602060405180830381865afa158015610776573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061079a91906117a5565b158015610833575060006107ac610295565b6001600160a01b031663ebbe80346107c2610480565b6040516001600160e01b031960e084901b16815260048101919091526001600160a01b0386166024820152604401602060405180830381865afa15801561080d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610831919061178c565b145b156103fe57604051636b6ee4e160e11b815260040160405180910390fd5b6000808490506000816001600160a01b031663f10e38af6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610897573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108bb9190611714565b9050816001600160a01b031663aef281d36040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156108f857600080fd5b505af115801561090c573d6000803e3d6000fd5b50505050806001600160a01b0316631d8557d76040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561094b57600080fd5b505af115801561095f573d6000803e3d6000fd5b50505050806001600160a01b0316638ff54e356040518163ffffffff1660e01b8152600401602060405180830381865afa1580156109a1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109c591906117a5565b156109e35760405163100c419560e01b815260040160405180910390fd5b806001600160a01b031663bc3b0c4b6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610a21573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a4591906117a5565b610a625760405163a854541160e01b815260040160405180910390fd5b841580610a7e5750610a7c85670de0b6b3a7640000610e7a565b155b15610a9c5760405163a700f36360e01b815260040160405180910390fd5b600060029054906101000a90046001600160a01b03166001600160a01b0316826001600160a01b031663e6c15c996040518163ffffffff1660e01b8152600401602060405180830381865afa158015610af9573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b1d9190611714565b6001600160a01b031614610b445760405163194d6c7d60e21b815260040160405180910390fd5b610b4e8282610e90565b851115610b6e57604051633181b8d360e01b815260040160405180910390fd5b69010f0cf064dd59200000851115610b99576040516302d67e2960e41b815260040160405180910390fd5b600080610bb1610174670de0b6b3a7640000896117dd565b9150915085821115610bd65760405163331a433f60e11b815260040160405180910390fd5b6000836001600160a01b0316638e55bdc06040518163ffffffff1660e01b81526004016040805180830381865afa158015610c15573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610c39919061180e565b91505067ffffffffffffffff811615610c65576040516384cc247f60e01b815260040160405180910390fd5b6000610c6f610211565b9050806001600160a01b031663cabb62f06040518163ffffffff1660e01b8152600401602060405180830381865afa158015610caf573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610cd39190611714565b60405163079cc67960e41b81526001600160a01b038c811660048301526024820187905291909116906379cc679090604401600060405180830381600087803b158015610d1f57600080fd5b505af1158015610d33573d6000803e3d6000fd5b505060025460405163feae7dc360e01b815260048101919091526001600160a01b038416925063feae7dc39150602401602060405180830381865afa158015610d80573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610da49190611714565b6040516340c10f1960e01b81526001600160a01b038781166004830152602482018c905291909116906340c10f1990604401600060405180830381600087803b158015610df057600080fd5b505af1158015610e04573d6000803e3d6000fd5b50505060038490555042600155604080516001600160a01b03808e168252871660208201529081018a905260608101859052608081018490527f2cdc858ec98ef184c62b1a5ad6d7fcfd26ec15fd28a95398a046e9593bb5ce1d9060a00160405180910390a150969a9950505050505050505050565b6000610e868284611841565b1590505b92915050565b6000806000610e9e85610f12565b915091506000610ead85611104565b90506000610ef283670de0b6b3a7640000610ed0671bc16d674ec8000088611775565b610eda91906117dd565b610ee491906117dd565b670de0b6b3a764000061123b565b9050808210610f08576000945050505050610e8a565b6105818282611855565b6040805180820182526004808252631193d49560e21b6020909201919091529051631b973c5760e21b8152600091829182916001600160a01b03861691636e5cf15c91610f85917f2911d5ca388af24ed7f391a4eb24469bc0fd8935cd73bb1075ca7e702a42eb19910190815260200190565b602060405180830381865afa158015610fa2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fc69190611714565b9050806001600160a01b0316637633a22c6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611006573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061102a919061178c565b816001600160a01b031663e91bde76836001600160a01b0316638545bc586040518163ffffffff1660e01b8152600401602060405180830381865afa158015611077573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061109b919061178c565b6040518263ffffffff1660e01b81526004016110b991815260200190565b602060405180830381865afa1580156110d6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110fa919061178c565b9250925050915091565b60008061110f611259565b9050600061111b610211565b90506000805b835181101561123257826001600160a01b031663feae7dc385838151811061114b5761114b611868565b60200260200101516040518263ffffffff1660e01b815260040161117191815260200190565b602060405180830381865afa15801561118e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111b29190611714565b6040516370a0823160e01b81526001600160a01b03888116600483015291909116906370a0823190602401602060405180830381865afa1580156111fa573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061121e919061178c565b611228908361187e565b9150600101611121565b50949350505050565b60008161124881856117dd565b6112529190611775565b9392505050565b60606000611265611305565b90506000815167ffffffffffffffff81111561128357611283611573565b6040519080825280602002602001820160405280156112ac578160200160208202803683370190505b50905060005b81518110156112fe578281815181106112cd576112cd611868565b6020026020010151604001518282815181106112eb576112eb611868565b60209081029190910101526001016112b2565b5092915050565b6040805160038082526080820190925260609160009190816020015b604080516060808201835280825260208201526000918101919091528152602001906001900390816113215750506040805160a0810182526011606082019081527026b4ba343930b2bab6902bb0b93934b7b960791b6080830152815281518083018352600881526736aba0a92924a7a960c11b602080830191909152808301919091528251808401845260078152662ba0a92924a7a960c91b9101527f69c5317e5ce44f1a1fb56c6a5eff904214e6353da6310ab0a6b511eef9a7c3919181019190915281519192509082906000906113fd576113fd611868565b6020908102919091018101919091526040805160a0810182526010606082019081526f26b4ba343930b2bab69020b931b432b960811b6080830152815281518083018352600781526636a0a921a422a960c91b818501528184015281518083018352600681526520a921a422a960d11b9301929092527f42de5fbfc07577d3e9942df95dd4e61cabcab8907d5d333240140b2999379e40908201528151829060019081106114ad576114ad611868565b6020908102919091018101919091526040805160a0810182526012606082019081527126b4ba343930b2bab6902437b939b2b6b0b760711b6080830152815281518083018352600981526836a427a929a2a6a0a760b91b81850152818401528151808301835260088152672427a929a2a6a0a760c11b9301929092527f89d5ee6f4fcb32fb3c151bc25e6bc320fec82ba89cb3b29d1969d907e0e679399082015281518290600290811061156357611563611868565b6020908102919091010152919050565b634e487b7160e01b600052604160045260246000fd5b60006020828403121561159b57600080fd5b813567ffffffffffffffff8111156115b257600080fd5b8201601f810184136115c357600080fd5b803567ffffffffffffffff8111156115dd576115dd611573565b604051601f8201601f19908116603f0116810167ffffffffffffffff8111828210171561160c5761160c611573565b60405281815282820160200186101561162457600080fd5b81602084016020830137600091810160200191909152949350505050565b6001600160a01b038116811461165757600080fd5b50565b600080600080600060a0868803121561167257600080fd5b853561167d81611642565b9450602086013561168d81611642565b9350604086013561169d81611642565b94979396509394606081013594506080013592915050565b6000602082840312156116c757600080fd5b5035919050565b600080600080608085870312156116e457600080fd5b84356116ef81611642565b935060208501356116ff81611642565b93969395505050506040820135916060013590565b60006020828403121561172657600080fd5b815161125281611642565b6000806040838503121561174457600080fd5b825161174f81611642565b6020939093015192949293505050565b634e487b7160e01b600052601160045260246000fd5b8082028115828204841417610e8a57610e8a61175f565b60006020828403121561179e57600080fd5b5051919050565b6000602082840312156117b757600080fd5b8151801515811461125257600080fd5b634e487b7160e01b600052601260045260246000fd5b6000826117ec576117ec6117c7565b500490565b805167ffffffffffffffff8116811461180957600080fd5b919050565b6000806040838503121561182157600080fd5b61182a836117f1565b9150611838602084016117f1565b90509250929050565b600082611850576118506117c7565b500690565b81810381811115610e8a57610e8a61175f565b634e487b7160e01b600052603260045260246000fd5b80820180821115610e8a57610e8a61175f56fea26469706673582212206bfc44fe068cdbe62a2cf7679a883485572d0cef041d72db34a561e8a72fa6db64736f6c634300081a0033";

type WorkersUnitsPoolConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: WorkersUnitsPoolConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class WorkersUnitsPool__factory extends ContractFactory {
  constructor(...args: WorkersUnitsPoolConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      WorkersUnitsPool & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): WorkersUnitsPool__factory {
    return super.connect(runner) as WorkersUnitsPool__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): WorkersUnitsPoolInterface {
    return new Interface(_abi) as WorkersUnitsPoolInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): WorkersUnitsPool {
    return new Contract(address, _abi, runner) as unknown as WorkersUnitsPool;
  }
}