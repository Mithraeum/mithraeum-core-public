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
  CultistsSettlement,
  CultistsSettlementInterface,
} from "../../../../../contracts/core/assets/settlement/CultistsSettlement";

const _abi = [
  {
    inputs: [],
    name: "CannotTransferProducingResourceFromBuilding",
    type: "error",
  },
  {
    inputs: [],
    name: "Disabled",
    type: "error",
  },
  {
    inputs: [],
    name: "GovernorCannotBeAddedIfSenderNotSettlementOwnerOrAnotherGovernor",
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
    name: "OnlyRulerOrWorldAsset",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlySettlementOwner",
    type: "error",
  },
  {
    inputs: [],
    name: "OnlyWorldAssetFromSameEra",
    type: "error",
  },
  {
    inputs: [],
    name: "SettlementCannotBeDestroyedIfItsAlreadyRebuilt",
    type: "error",
  },
  {
    inputs: [],
    name: "SettlementCannotBeDestroyedIfItsNotRotten",
    type: "error",
  },
  {
    inputs: [],
    name: "SettlementCannotDecreaseCorruptionIndexViaPaymentInInactiveEra",
    type: "error",
  },
  {
    inputs: [],
    name: "SettlementCannotDecreaseCorruptionIndexViaPaymentWrongParamProvided",
    type: "error",
  },
  {
    inputs: [],
    name: "SettlementCannotSendWorkersToBuildingOverMaximumAllowedCapacity",
    type: "error",
  },
  {
    inputs: [],
    name: "SettlementCannotSendWorkersWithFractions",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "armyAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "position",
        type: "uint64",
      },
    ],
    name: "ArmyCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "buildingAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "buildingTypeId",
        type: "bytes32",
      },
    ],
    name: "BuildingCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "Destroyed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "currentGovernorsGeneration",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "governorAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "modifiedByAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "newStatus",
        type: "bool",
      },
    ],
    name: "GovernorStatusChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newGovernorsGeneration",
        type: "uint256",
      },
    ],
    name: "GovernorsGenerationChanged",
    type: "event",
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
        name: "siegeAddress",
        type: "address",
      },
    ],
    name: "SiegeCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "governorAddress",
        type: "address",
      },
    ],
    name: "addGovernor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "army",
    outputs: [
      {
        internalType: "contract IArmy",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
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
    inputs: [],
    name: "bannerId",
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
        internalType: "uint64",
        name: "position",
        type: "uint64",
      },
      {
        internalType: "uint256",
        name: "prosperityStake",
        type: "uint256",
      },
    ],
    name: "beginTileCapture",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "buildingTypeId",
        type: "bytes32",
      },
    ],
    name: "buildings",
    outputs: [
      {
        internalType: "contract IBuilding",
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
        internalType: "uint64",
        name: "position",
        type: "uint64",
      },
    ],
    name: "cancelTileCapture",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint64",
        name: "position",
        type: "uint64",
      },
    ],
    name: "claimCapturedTile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "currentGovernorsGeneration",
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
        name: "amount",
        type: "uint256",
      },
    ],
    name: "decreaseProducedCorruptionIndex",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "destroyRottenSettlement",
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
        name: "prosperityAmount",
        type: "uint256",
      },
    ],
    name: "extendProsperity",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "extendedProsperityAmount",
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
    name: "getSettlementOwner",
    outputs: [
      {
        internalType: "address",
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
        internalType: "uint64",
        name: "position",
        type: "uint64",
      },
    ],
    name: "giveUpCapturedTile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "era",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "isGovernor",
        type: "address",
      },
    ],
    name: "governors",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "increaseProducedCorruptionIndex",
    outputs: [],
    stateMutability: "nonpayable",
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
    name: "isRottenSettlement",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "potentialRuler",
        type: "address",
      },
    ],
    name: "isRuler",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "bytes32",
            name: "buildingTypeId",
            type: "bytes32",
          },
          {
            internalType: "bool",
            name: "isTransferringWorkersFromBuilding",
            type: "bool",
          },
          {
            internalType: "uint256",
            name: "workersAmount",
            type: "uint256",
          },
          {
            components: [
              {
                internalType: "bool",
                name: "isTransferringResourcesFromBuilding",
                type: "bool",
              },
              {
                internalType: "address",
                name: "resourcesOwnerOrResourcesReceiver",
                type: "address",
              },
              {
                internalType: "bytes32",
                name: "resourceTypeId",
                type: "bytes32",
              },
              {
                internalType: "uint256",
                name: "resourcesAmount",
                type: "uint256",
              },
            ],
            internalType: "struct ISettlement.ResourcesModificationParam[]",
            name: "resources",
            type: "tuple[]",
          },
        ],
        internalType:
          "struct ISettlement.BuildingProductionModificationParam[]",
        name: "params",
        type: "tuple[]",
      },
    ],
    name: "modifyBuildingsProduction",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokensAmount",
        type: "uint256",
      },
    ],
    name: "payToDecreaseCorruptionIndex",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "position",
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
    name: "producedCorruptionIndex",
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
        name: "governorAddress",
        type: "address",
      },
    ],
    name: "removeGovernor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "removeGovernors",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "siege",
    outputs: [
      {
        internalType: "contract ISiege",
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
        name: "workersToBuy",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxProsperityToSell",
        type: "uint256",
      },
    ],
    name: "swapProsperityForExactWorkers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateFortHealth",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "updateProsperityAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "resourceTypeId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdrawResources",
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
  "0x6080604052348015600f57600080fd5b50610fa58061001f6000396000f3fe6080604052600436106102255760003560e01c80637fd4d5e511610123578063c023c095116100ab578063d9bbf2a81161006f578063d9bbf2a81461048e578063e6c15c99146104c4578063ece56a1a146104ea578063eecdac8814610386578063f10e38af146104ff57600080fd5b8063c023c0951461048e578063c433a1601461048e578063c68cf906146104a9578063ca825043146102b3578063d63a68ec1461042657600080fd5b80639dd26bd2116100f25780639dd26bd214610426578063aef281d314610371578063b5acd45614610347578063b942d2c114610473578063bea42f9c1461037157600080fd5b80637fd4d5e51461042657806384ba89e31461043b578063977a2d1314610450578063996bebda1461046557600080fd5b80633133f7d9116101b157806352fa2c8e1161017557806352fa2c8e146103715780636e5cf15c146103dc5780637b103999146103fc5780637d884c74146104115780637e6fc4f01461042657600080fd5b80633133f7d9146103715780633c4a25d0146103865780633fa95a4a146102b357806341b989d9146103a15780634ddf47d4146103bc57600080fd5b8063143e55e0116101f8578063143e55e0146102ce57806316e8d7ff146102fb5780631b0b969d146103165780632de7e9b01461034757806330b67baa1461035c57600080fd5b806309218e911461022a5780630b4e99c31461026e5780630f4175ef1461029157806310592e24146102b3575b600080fd5b34801561023657600080fd5b5060015461025190600160a01b90046001600160401b031681565b6040516001600160401b0390911681526020015b60405180910390f35b34801561027a57600080fd5b5061028361051f565b604051908152602001610265565b34801561029d57600080fd5b506102b16102ac366004610b1d565b61055c565b005b3480156102bf57600080fd5b506102b16102ac366004610ce0565b3480156102da57600080fd5b506102e3610575565b6040516001600160a01b039091168152602001610265565b34801561030757600080fd5b506102b16102ac366004610cf9565b34801561032257600080fd5b50610337610331366004610d1b565b50600090565b6040519015158152602001610265565b34801561035357600080fd5b506102e36105f9565b34801561036857600080fd5b506102e3610614565b34801561037d57600080fd5b506102b161055c565b34801561039257600080fd5b506102b16102ac366004610d1b565b3480156103ad57600080fd5b506102b16102ac366004610d3f565b3480156103c857600080fd5b506102b16103d7366004610d77565b61061e565b3480156103e857600080fd5b506102e36103f7366004610ce0565b6105f9565b34801561040857600080fd5b506102e361091a565b34801561041d57600080fd5b50610283610961565b34801561043257600080fd5b506102836105f9565b34801561044757600080fd5b5061028361099e565b34801561045c57600080fd5b506103376105f9565b6102b16102ac366004610ce0565b34801561047f57600080fd5b506103376103f7366004610e0f565b34801561049a57600080fd5b506102b16102ac366004610e54565b3480156104b557600080fd5b506102b16102ac366004610e71565b3480156104d057600080fd5b506000546102e3906201000090046001600160a01b031681565b3480156104f657600080fd5b506102e36109db565b34801561050b57600080fd5b506001546102e3906001600160a01b031681565b604080516020808252818301909252600091309183918291906020820181803683370190505090506020607a60208301853c602001519392505050565b604051633ac4266d60e11b815260040160405180910390fd5b600061057f610614565b6001600160a01b031663720a70bd610595610961565b6040518263ffffffff1660e01b81526004016105b391815260200190565b602060405180830381865afa1580156105d0573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105f49190610e9d565b905090565b6000604051633ac4266d60e11b815260040160405180910390fd5b60006105f4610a22565b600054610100900460ff161580801561063e5750600054600160ff909116105b806106585750303b158015610658575060005460ff166001145b6106bf5760405162461bcd60e51b815260206004820152602e60248201527f496e697469616c697a61626c653a20636f6e747261637420697320616c72656160448201526d191e481a5b9a5d1a585b1a5e995960921b606482015260840160405180910390fd5b6000805460ff1916600117905580156106e2576000805461ff0019166101001790555b6000806000848060200190518101906106fb9190610eba565b6000805462010000600160b01b031916620100006001600160a01b038516021781556001805467ffffffffffffffff60a01b1916600160a01b6001600160401b0385160217905592955090935091506107526109db565b6001600160a01b031663c19755fd610768610614565b610770610961565b604080518082018252600481526361726d7960e01b602091820152815180830183526005815264424153494360d81b908201528151308183015282518082039092018252808301928390526001600160e01b031960e087901b1690925261081f9392917f1dfa95949f0b18e5ee916f85d0296148ce2f94b82b74404d6a5d6e64ed9b8c5f917fdc0ae866100b2876ab26eb62a50ca2cd083944f439e6d78aab2fc402e669e9ee91604401610efd565b6020604051808303816000875af115801561083e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108629190610e9d565b600180546001600160a01b0319166001600160a01b0383169081179182905560408051918252600160a01b9092046001600160401b031660208201529192507f36e6a2ad1103b62e30506738cea4d983c8be134a35b666a8403fd1469c675451910160405180910390a1505050508015610916576000805461ff0019169055604051600181527f7f26b83ff96e1f2b6a682f133852f6798a09c465da95921460cefb38474024989060200160405180910390a15b5050565b6000610924610614565b6001600160a01b0316637b1039996040518163ffffffff1660e01b8152600401602060405180830381865afa1580156105d0573d6000803e3d6000fd5b604080516020808252818301909252600091309183918291906020820181803683370190505090506020609a60208301853c602001519392505050565b604080516020808252818301909252600091309183918291906020820181803683370190505090506020605a60208301853c602001519392505050565b60006109e561091a565b6001600160a01b031663ece56a1a6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156105d0573d6000803e3d6000fd5b604080516014808252818301909252600091309183918291906020820181803683370190505090506014602a60208301853c601401519392505050565b634e487b7160e01b600052604160045260246000fd5b604051608081016001600160401b0381118282101715610a9757610a97610a5f565b60405290565b604051601f8201601f191681016001600160401b0381118282101715610ac557610ac5610a5f565b604052919050565b60006001600160401b03821115610ae657610ae6610a5f565b5060051b60200190565b80358015158114610b0057600080fd5b919050565b6001600160a01b0381168114610b1a57600080fd5b50565b600060208284031215610b2f57600080fd5b81356001600160401b03811115610b4557600080fd5b8201601f81018413610b5657600080fd5b8035610b69610b6482610acd565b610a9d565b8082825260208201915060208360051b850101925086831115610b8b57600080fd5b602084015b83811015610cd55780356001600160401b03811115610bae57600080fd5b85016080818a03601f19011215610bc457600080fd5b610bcc610a75565b60208201358152610bdf60408301610af0565b60208201526060820135604082015260808201356001600160401b03811115610c0757600080fd5b60208184010192505089601f830112610c1f57600080fd5b8135610c2d610b6482610acd565b8082825260208201915060208360071b86010192508c831115610c4f57600080fd5b6020850194505b82851015610cbf576080858e031215610c6e57600080fd5b610c76610a75565b610c7f86610af0565b81526020860135610c8f81610b05565b60208281019190915260408781013590830152606080880135908301529083526080909501949190910190610c56565b6060840152505084525060209283019201610b90565b509695505050505050565b600060208284031215610cf257600080fd5b5035919050565b60008060408385031215610d0c57600080fd5b50508035926020909101359150565b600060208284031215610d2d57600080fd5b8135610d3881610b05565b9392505050565b600080600060608486031215610d5457600080fd5b833592506020840135610d6681610b05565b929592945050506040919091013590565b600060208284031215610d8957600080fd5b81356001600160401b03811115610d9f57600080fd5b8201601f81018413610db057600080fd5b80356001600160401b03811115610dc957610dc9610a5f565b610ddc601f8201601f1916602001610a9d565b818152856020838501011115610df157600080fd5b81602084016020830137600091810160200191909152949350505050565b60008060408385031215610e2257600080fd5b823591506020830135610e3481610b05565b809150509250929050565b6001600160401b0381168114610b1a57600080fd5b600060208284031215610e6657600080fd5b8135610d3881610e3f565b60008060408385031215610e8457600080fd5b8235610e8f81610e3f565b946020939093013593505050565b600060208284031215610eaf57600080fd5b8151610d3881610b05565b600080600060608486031215610ecf57600080fd5b835192506020840151610ee181610b05565b6040850151909250610ef281610e3f565b809150509250925092565b60018060a01b038616815284602082015283604082015282606082015260a06080820152600082518060a084015260005b81811015610f4b57602081860181015160c0868401015201610f2e565b50600060c0828501015260c0601f19601f830116840101915050969550505050505056fea2646970667358221220d9efb1243bb3f4078a3834bea23bb69054b61873dcbb1fa609fbae4a92e3eb6664736f6c634300081a0033";

type CultistsSettlementConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: CultistsSettlementConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class CultistsSettlement__factory extends ContractFactory {
  constructor(...args: CultistsSettlementConstructorParams) {
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
      CultistsSettlement & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): CultistsSettlement__factory {
    return super.connect(runner) as CultistsSettlement__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): CultistsSettlementInterface {
    return new Interface(_abi) as CultistsSettlementInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): CultistsSettlement {
    return new Contract(address, _abi, runner) as unknown as CultistsSettlement;
  }
}