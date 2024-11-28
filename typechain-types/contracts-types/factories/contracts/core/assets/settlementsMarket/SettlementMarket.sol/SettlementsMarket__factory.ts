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
import type { NonPayableOverrides } from "../../../../../../common";
import type {
  SettlementsMarket,
  SettlementsMarketInterface,
} from "../../../../../../contracts/core/assets/settlementsMarket/SettlementMarket.sol/SettlementsMarket";

const _abi = [
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
    name: "OnlyWorldAssetFromSameEra",
    type: "error",
  },
  {
    inputs: [],
    name: "ReentrantCall",
    type: "error",
  },
  {
    inputs: [],
    name: "SettlementCannotBeBoughtDueInsufficientValueSent",
    type: "error",
  },
  {
    inputs: [],
    name: "SettlementCannotBeBoughtDueToCostIsHigherThanMaxTokensToUseSpecified",
    type: "error",
  },
  {
    inputs: [],
    name: "SettlementCannotBeBoughtForFreeAfterGameBegan",
    type: "error",
  },
  {
    inputs: [],
    name: "SettlementCannotBeBoughtForNotOwnerBannerNft",
    type: "error",
  },
  {
    inputs: [],
    name: "SettlementCannotBeBoughtOnNonExistentPosition",
    type: "error",
  },
  {
    inputs: [],
    name: "SettlementCannotBeBoughtOnPositionWhichIsNotRelatedToThisSettlementMarket",
    type: "error",
  },
  {
    inputs: [],
    name: "UnknownInputParameter",
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
        name: "settlementAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "settlementCost",
        type: "uint256",
      },
    ],
    name: "SettlementBought",
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
        internalType: "uint64",
        name: "position",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "bannerId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxTokensToUse",
        type: "uint256",
      },
    ],
    name: "buySettlement",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "position",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "bannerId",
        type: "uint256",
      },
    ],
    name: "buySettlementForFreeByMightyCreator",
    outputs: [],
    stateMutability: "nonpayable",
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
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "getNewSettlementCost",
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
    name: "marketCreationTime",
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
    inputs: [],
    name: "updateState",
    outputs: [],
    stateMutability: "nonpayable",
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
  "0x6080604052348015600f57600080fd5b50612d548061001f6000396000f3fe6080604052600436106100bd5760003560e01c80637b1039991161006f5780637b103999146101995780637d884c74146101ae57806384ba89e3146101c3578063b0a0c9ce146101d8578063e6c15c99146101f8578063ece56a1a1461021f578063fbbdf4b01461023457600080fd5b80630b4e99c3146100c2578063143e55e0146100ea5780631d8557d71461011757806323aea47f1461012e57806330b67baa146101445780634ddf47d4146101595780636ce3c63f14610179575b600080fd5b3480156100ce57600080fd5b506100d7610247565b6040519081526020015b60405180910390f35b3480156100f657600080fd5b506100ff610284565b6040516001600160a01b0390911681526020016100e1565b34801561012357600080fd5b5061012c610308565b005b34801561013a57600080fd5b506100d760015481565b34801561015057600080fd5b506100ff6104fc565b34801561016557600080fd5b5061012c6101743660046128fc565b610506565b34801561018557600080fd5b5061012c6101943660046129ca565b61065a565b3480156101a557600080fd5b506100ff610bf6565b3480156101ba57600080fd5b506100d7610c3d565b3480156101cf57600080fd5b506100d7610c7a565b3480156101e457600080fd5b506100d76101f33660046129f6565b610cb7565b34801561020457600080fd5b506000546100ff90630100000090046001600160a01b031681565b34801561022b57600080fd5b506100ff61114a565b61012c610242366004612a0f565b611191565b604080516020808252818301909252600091309183918291906020820181803683370190505090506020607a60208301853c602001519392505050565b600061028e6104fc565b6001600160a01b031663720a70bd6102a4610c3d565b6040518263ffffffff1660e01b81526004016102c291815260200190565b602060405180830381865afa1580156102df573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103039190612a59565b905090565b60008060039054906101000a90046001600160a01b03166001600160a01b031663b2fd89336040518163ffffffff1660e01b8152600401602060405180830381865afa15801561035c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103809190612a76565b9050600061038c6104fc565b6001600160a01b031663a8d66c756040518163ffffffff1660e01b8152600401602060405180830381865afa1580156103c9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ed9190612a59565b905060006103f9611a8b565b60405163a57415d960e01b81526001600160401b038516600482015290915081906001600160a01b0384169063a57415d990602401602060405180830381865afa15801561044b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061046f9190612a93565b0361047957505050565b816001600160a01b031663c29f8ac28461049284610cb7565b6040516001600160e01b031960e085901b1681526001600160401b039092166004830152602482015260448101849052606401600060405180830381600087803b1580156104df57600080fd5b505af11580156104f3573d6000803e3d6000fd5b50505050505050565b6000610303611b93565b600054610100900460ff16158080156105265750600054600160ff909116105b806105405750303b158015610540575060005460ff166001145b6105a85760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b60648201526084015b60405180910390fd5b6000805460ff1916600117905580156105cb576000805461ff0019166101001790555b6000828060200190518101906105e19190612a59565b600080546001600160a01b039092166301000000026301000000600160b81b031990921691909117905550426001558015610656576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050565b610662611bd0565b61066a610308565b60006106746104fc565b9050806001600160a01b0316633c8ca83d6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156106b4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106d89190612a93565b42106106f75760405163389c286560e21b815260040160405180910390fd5b6000816001600160a01b031663183100fa6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610737573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061075b9190612a59565b6001600160a01b0316636352211e846040518263ffffffff1660e01b815260040161078891815260200190565b602060405180830381865afa1580156107a5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107c99190612a59565b9050336001600160a01b038216146107f457604051636e6ff5ad60e01b815260040160405180910390fd5b600080836001600160a01b031663f5f026a36040518163ffffffff1660e01b8152600401602060405180830381865afa158015610835573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108599190612a59565b604051630915dd5d60e01b81526001600160401b03881660048201526001600160a01b039190911690630915dd5d906024016040805180830381865afa1580156108a7573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108cb9190612ac1565b91509150806108ed576040516376bc71ab60e11b815260040160405180910390fd5b600060039054906101000a90046001600160a01b03166001600160a01b031663b2fd89336040518163ffffffff1660e01b8152600401602060405180830381865afa158015610940573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109649190612a76565b6001600160401b0316826001600160401b0316146109955760405163ad75401b60e01b815260040160405180910390fd5b60006109a042610cb7565b905060006109ac610284565b604051636b29d33560e11b81526001600160401b03808b16600483015286166024820152604481018990526001600160a01b03919091169063d653a66a906064016020604051808303816000875af1158015610a0c573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a309190612a59565b90506000670de0b6b3a7640000610a4f67120a871cc002000085612b0c565b610a599190612b39565b9050866001600160a01b031663a8d66c756040518163ffffffff1660e01b8152600401602060405180830381865afa158015610a99573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610abd9190612a59565b6001600160a01b031663c29f8ac2600060039054906101000a90046001600160a01b03166001600160a01b031663b2fd89336040518163ffffffff1660e01b8152600401602060405180830381865afa158015610b1e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b429190612a76565b6040516001600160e01b031960e084901b1681526001600160401b03909116600482015260248101849052426044820152606401600060405180830381600087803b158015610b9057600080fd5b505af1158015610ba4573d6000803e3d6000fd5b5050604080516001600160a01b0386168152600060208201527f6586502516238f1ec2240c09c57f98f6900dc29cb7e1a9dde2cdef56b17c291e935001905060405180910390a1505050505050505050565b6000610c006104fc565b6001600160a01b0316637b1039996040518163ffffffff1660e01b8152600401602060405180830381865afa1580156102df573d6000803e3d6000fd5b604080516020808252818301909252600091309183918291906020820181803683370190505090506020609a60208301853c602001519392505050565b604080516020808252818301909252600091309183918291906020820181803683370190505090506020605a60208301853c602001519392505050565b600081600003610cc5574291505b60008060039054906101000a90046001600160a01b03166001600160a01b031663b2fd89336040518163ffffffff1660e01b8152600401602060405180830381865afa158015610d19573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610d3d9190612a76565b90506000610d496104fc565b90506000816001600160a01b031663a8d66c756040518163ffffffff1660e01b8152600401602060405180830381865afa158015610d8b573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610daf9190612a59565b604051631373443d60e31b81526001600160401b03851660048201529091506000906001600160a01b03831690639b9a21e890602401602060405180830381865afa158015610e02573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e269190612a93565b60405163a57415d960e01b81526001600160401b03861660048201529091506000906001600160a01b0384169063a57415d990602401602060405180830381865afa158015610e79573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e9d9190612a93565b90506000610f0f856001600160a01b0316633c8ca83d6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610ee2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f069190612a93565b60015484611c6c565b90506000610f7e89876001600160a01b03166344d9bc5f6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610f55573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f799190612a93565b611c98565b90506000866001600160a01b031663f5f026a36040518163ffffffff1660e01b8152600401602060405180830381865afa158015610fc0573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610fe49190612a59565b90506000846000036110985760405163335cf12b60e11b81526001600160401b038a1660048201526000906001600160a01b038416906366b9e25690602401602060405180830381865afa158015611040573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906110649190612a93565b9050611071600182612b4d565b61107c906002612c47565b611090906902a5a058fc295ed00000612b0c565b91505061110c565b604051631970403960e01b81526001600160401b038a1660048201526001600160a01b03881690631970403990602401602060405180830381865afa1580156110e5573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906111099190612a93565b90505b828410611121579a9950505050505050505050565b600061112e858589611cba565b905061113a8183611d7e565b9c9b505050505050505050505050565b6000611154610bf6565b6001600160a01b031663ece56a1a6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156102df573d6000803e3d6000fd5b611199611e3a565b60005462010000900460ff1615156001036111c7576040516306fda65d60e31b815260040160405180910390fd5b6000805462ff00001916620100001790556111e0610308565b60006111ea6104fc565b90506000816001600160a01b031663183100fa6040518163ffffffff1660e01b8152600401602060405180830381865afa15801561122c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112509190612a59565b6001600160a01b0316636352211e856040518263ffffffff1660e01b815260040161127d91815260200190565b602060405180830381865afa15801561129a573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906112be9190612a59565b9050336001600160a01b038216146112e957604051636e6ff5ad60e01b815260040160405180910390fd5b6000826001600160a01b031663f5f026a36040518163ffffffff1660e01b8152600401602060405180830381865afa158015611329573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061134d9190612a59565b604051630915dd5d60e01b81526001600160401b038816600482015290915060009081906001600160a01b03841690630915dd5d906024016040805180830381865afa1580156113a1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906113c59190612ac1565b91509150806113e7576040516376bc71ab60e11b815260040160405180910390fd5b600060039054906101000a90046001600160a01b03166001600160a01b031663b2fd89336040518163ffffffff1660e01b8152600401602060405180830381865afa15801561143a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061145e9190612a76565b6001600160401b0316826001600160401b03161461148f5760405163ad75401b60e01b815260040160405180910390fd5b600061149a42610cb7565b9050808710156114bd576040516372b861db60e01b815260040160405180910390fd5b60405163335cf12b60e11b81526001600160401b0384166004820152600090670de0b6b3a764000090611544906001600160a01b038816906366b9e25690602401602060405180830381865afa15801561151b573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061153f9190612a93565b611f6e565b61154e9084612b0c565b6115589190612b39565b905060006115668284612b4d565b90506000886001600160a01b031663c1897e346040518163ffffffff1660e01b8152600401602060405180830381865afa1580156115a8573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906115cc9190612a59565b90506001600160a01b03811661172157833410156115fd5760405163e76f88bf60e01b815260040160405180910390fd5b600084341161160d576000611617565b6116178534612b4d565b90508015611629576116293382611fde565b821561169a5761169a8a6001600160a01b03166366666aa96040518163ffffffff1660e01b8152600401602060405180830381865afa158015611670573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906116949190612a59565b84611fde565b831561171b5760405163f791a01f60e01b81526001600160401b038816600482015261171b906001600160a01b038a169063f791a01f90602401602060405180830381865afa1580156116f1573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906117159190612a59565b85611fde565b50611819565b81156117945761179481338b6001600160a01b03166366666aa96040518163ffffffff1660e01b8152600401602060405180830381865afa15801561176a573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061178e9190612a59565b856120f7565b82156118195760405163f791a01f60e01b81526001600160401b038716600482015261181990829033906001600160a01b038b169063f791a01f90602401602060405180830381865afa1580156117ef573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118139190612a59565b866120f7565b6000611823610284565b6001600160a01b031663d653a66a8e898f6040518463ffffffff1660e01b8152600401611871939291906001600160401b039384168152919092166020820152604081019190915260600190565b6020604051808303816000875af1158015611890573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906118b49190612a59565b90506000670de0b6b3a76400006118d367120a871cc002000088612b0c565b6118dd9190612b39565b90508a6001600160a01b031663a8d66c756040518163ffffffff1660e01b8152600401602060405180830381865afa15801561191d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119419190612a59565b6001600160a01b031663c29f8ac2600060039054906101000a90046001600160a01b03166001600160a01b031663b2fd89336040518163ffffffff1660e01b8152600401602060405180830381865afa1580156119a2573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906119c69190612a76565b6040516001600160e01b031960e084901b1681526001600160401b03909116600482015260248101849052426044820152606401600060405180830381600087803b158015611a1457600080fd5b505af1158015611a28573d6000803e3d6000fd5b5050604080516001600160a01b0386168152602081018a90527f6586502516238f1ec2240c09c57f98f6900dc29cb7e1a9dde2cdef56b17c291e935001905060405180910390a150506000805462ff000019169055505050505050505050505050565b600080611a966104fc565b90506000816001600160a01b0316633c8ca83d6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611ad8573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611afc9190612a93565b90506000826001600160a01b03166344d9bc5f6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611b3e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611b629190612a93565b90504282811015611b705750815b81600003611b8057949350505050565b611b8a8183612157565b94505050505090565b604080516014808252818301909252600091309183918291906020820181803683370190505090506014602a60208301853c601401519392505050565b611bd8610bf6565b6001600160a01b031663271530506040518163ffffffff1660e01b8152600401602060405180830381865afa158015611c15573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611c399190612a59565b6001600160a01b0316336001600160a01b031614611c6a5760405163d136afd560e01b815260040160405180910390fd5b565b600081600003611c8757611c808385612166565b9050611c91565b611c808483612166565b9392505050565b60008115611cb157611caa8383612157565b9050611cb4565b50815b92915050565b600080611cc78585612b4d565b90506000611cd7610e1083612b39565b90506000611d16611ce86001612175565b611d11611cf7600a6064612193565b611d0c611d06600b600a612193565b8a6121cd565b6123f0565b612448565b90506000611d2482846121cd565b90506000611d3c83611d37866001612c53565b6121cd565b90506000611d57611d4f610e1088612c66565b610e10612193565b9050611d7083611d11611d6a8686612448565b8461247b565b9a9950505050505050505050565b60006001607f1b600f84900b01611dc2576002600160c01b03198212158015611dab5750600160c01b8213155b611db457600080fd5b506000819003603f1b611cb4565b60008084600f0b1215611dda57836000039350600190505b6000831215611dec5760009290920391155b6000611df885856124b1565b90508115611e1d57600160ff1b811115611e1157600080fd5b6000039150611cb49050565b6001600160ff1b03811115611e3157600080fd5b9150611cb49050565b6000611e446104fc565b90506000816001600160a01b0316633c8ca83d6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611e86573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611eaa9190612a93565b90506000826001600160a01b03166344d9bc5f6040518163ffffffff1660e01b8152600401602060405180830381865afa158015611eec573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190611f109190612a93565b9050811580611f1e57508142105b15611f3c5760405163a00eda6960e01b815260040160405180910390fd5b8015801590611f4b5750804210155b15611f695760405163a00eda6960e01b815260040160405180910390fd5b505050565b600081600103611f87575067058d15e176280000919050565b81600203611f9e57506702c68af0bb140000919050565b81600303611fb5575067016345785d8a0000919050565b81600403611fc557506000919050565b60405163ea3b0abb60e01b815260040160405180910390fd5b8047101561202e5760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a20696e73756666696369656e742062616c616e6365000000604482015260640161059f565b6000826001600160a01b03168260405160006040518083038185875af1925050503d806000811461207b576040519150601f19603f3d011682016040523d82523d6000602084013e612080565b606091505b5050905080611f695760405162461bcd60e51b815260206004820152603a60248201527f416464726573733a20756e61626c6520746f2073656e642076616c75652c207260448201527f6563697069656e74206d61792068617665207265766572746564000000000000606482015260840161059f565b604080516001600160a01b0385811660248301528416604482015260648082018490528251808303909101815260849091019091526020810180516001600160e01b03166323b872dd60e01b17905261215190859061251c565b50505050565b6000818310611cb15750919050565b6000818311611cb15781611c91565b6000677fffffffffffffff82111561218c57600080fd5b5060401b90565b6000816000036121a257600080fd5b60006121ae84846125f1565b905060016001607f1b036001600160801b0382161115611c9157600080fd5b600080600084600f0b1280156121e65750826001166001145b905060008085600f0b126121fa57846121ff565b846000035b6001600160801b03169050600160801b600160401b821161229457603f82901b91505b841561228c576001851615612237578102607f1c5b908002607f1c90600285161561224d578102607f1c5b908002607f1c906004851615612263578102607f1c5b908002607f1c906008851615612279578102607f1c5b60049490941c93908002607f1c90612222565b60401c6123aa565b603f600160601b8310156122ae5760209290921b91601f19015b600160701b8310156122c65760109290921b91600f19015b600160781b8310156122de5760089290921b91600719015b6001607c1b8310156122f65760049290921b91600319015b6001607e1b83101561230e5760029290921b91600119015b6001607f1b8310156123265760019290921b91600019015b60005b8615612393576040821061233c57600080fd5b600187161561236257918302607f1c918101600160801b83111561236257600192831c92015b928002607f1c9260019190911b90600160801b841061238757600193841c9391909101905b600187901c9650612329565b604081106123a057600080fd5b6040039190911c90505b6000836123b757816123bc565b816000035b905060016001607f1b031981128015906123dd575060016001607f1b038113155b6123e657600080fd5b9695505050505050565b600081600f0b60000361240257600080fd5b600082600f0b604085600f0b901b8161241d5761241d612b23565b05905060016001607f1b0319811280159061243f575060016001607f1b038113155b611c9157600080fd5b6000600f82810b9084900b0360016001607f1b0319811280159061243f575060016001607f1b03811315611c9157600080fd5b6000600f83810b9083900b0260401d60016001607f1b0319811280159061243f575060016001607f1b03811315611c9157600080fd5b6000816000036124c357506000611cb4565b600083600f0b12156124d457600080fd5b600f83900b6001600160801b038316810260401c90608084901c026001600160c01b0381111561250357600080fd5b60401b811981111561251457600080fd5b019392505050565b6000612571826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166127569092919063ffffffff16565b90508051600014806125925750808060200190518101906125929190612c7a565b611f695760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b606482015260840161059f565b60008160000361260057600080fd5b60006001600160c01b03841161262b5782604085901b8161262357612623612b23565b049050612742565b60c084811c6401000000008110612644576020918201911c5b620100008110612656576010918201911c5b6101008110612667576008918201911c5b60108110612677576004918201911c5b60048110612687576002918201911c5b60028110612696576001820191505b60bf820360018603901c6001018260ff0387901b816126b7576126b7612b23565b0492506001600160801b038311156126ce57600080fd5b608085901c83026001600160801b038616840260c088901c604089901b828110156126fa576001820391505b608084901b92900382811015612711576001820391505b829003608084901c821461272757612727612c95565b88818161273657612736612b23565b04870196505050505050505b6001600160801b03811115611c9157600080fd5b6060612765848460008561276d565b949350505050565b6060824710156127ce5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f6044820152651c8818d85b1b60d21b606482015260840161059f565b600080866001600160a01b031685876040516127ea9190612ccf565b60006040518083038185875af1925050503d8060008114612827576040519150601f19603f3d011682016040523d82523d6000602084013e61282c565b606091505b509150915061283d87838387612848565b979650505050505050565b606083156128b75782516000036128b0576001600160a01b0385163b6128b05760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e7472616374000000604482015260640161059f565b5081612765565b61276583838151156128cc5781518083602001fd5b8060405162461bcd60e51b815260040161059f9190612ceb565b634e487b7160e01b600052604160045260246000fd5b60006020828403121561290e57600080fd5b81356001600160401b0381111561292457600080fd5b8201601f8101841361293557600080fd5b80356001600160401b0381111561294e5761294e6128e6565b604051601f8201601f19908116603f011681016001600160401b038111828210171561297c5761297c6128e6565b60405281815282820160200186101561299457600080fd5b81602084016020830137600091810160200191909152949350505050565b6001600160401b03811681146129c757600080fd5b50565b600080604083850312156129dd57600080fd5b82356129e8816129b2565b946020939093013593505050565b600060208284031215612a0857600080fd5b5035919050565b600080600060608486031215612a2457600080fd5b8335612a2f816129b2565b95602085013595506040909401359392505050565b6001600160a01b03811681146129c757600080fd5b600060208284031215612a6b57600080fd5b8151611c9181612a44565b600060208284031215612a8857600080fd5b8151611c91816129b2565b600060208284031215612aa557600080fd5b5051919050565b80518015158114612abc57600080fd5b919050565b60008060408385031215612ad457600080fd5b8251612adf816129b2565b9150612aed60208401612aac565b90509250929050565b634e487b7160e01b600052601160045260246000fd5b8082028115828204841417611cb457611cb4612af6565b634e487b7160e01b600052601260045260246000fd5b600082612b4857612b48612b23565b500490565b81810381811115611cb457611cb4612af6565b6001815b6001841115612b9b57808504811115612b7f57612b7f612af6565b6001841615612b8d57908102905b60019390931c928002612b64565b935093915050565b600082612bb257506001611cb4565b81612bbf57506000611cb4565b8160018114612bd55760028114612bdf57612bfb565b6001915050611cb4565b60ff841115612bf057612bf0612af6565b50506001821b611cb4565b5060208310610133831016604e8410600b8410161715612c1e575081810a611cb4565b612c2b6000198484612b60565b8060001904821115612c3f57612c3f612af6565b029392505050565b6000611c918383612ba3565b80820180821115611cb457611cb4612af6565b600082612c7557612c75612b23565b500690565b600060208284031215612c8c57600080fd5b611c9182612aac565b634e487b7160e01b600052600160045260246000fd5b60005b83811015612cc6578181015183820152602001612cae565b50506000910152565b60008251612ce1818460208701612cab565b9190910192915050565b6020815260008251806020840152612d0a816040850160208701612cab565b601f01601f1916919091016040019291505056fea2646970667358221220d9728751d535629e4a0048a200591fc0878eb18a7c550da67539f5a60170003b64736f6c634300081a0033";

type SettlementsMarketConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SettlementsMarketConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SettlementsMarket__factory extends ContractFactory {
  constructor(...args: SettlementsMarketConstructorParams) {
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
      SettlementsMarket & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): SettlementsMarket__factory {
    return super.connect(runner) as SettlementsMarket__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SettlementsMarketInterface {
    return new Interface(_abi) as SettlementsMarketInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): SettlementsMarket {
    return new Contract(address, _abi, runner) as unknown as SettlementsMarket;
  }
}
