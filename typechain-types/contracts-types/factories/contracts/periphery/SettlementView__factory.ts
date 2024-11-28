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
import type { NonPayableOverrides } from "../../../common";
import type {
  SettlementView,
  SettlementViewInterface,
} from "../../../contracts/periphery/SettlementView";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "settlementAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "accumulatedCurrentProsperity",
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
        internalType: "address",
        name: "settlementAddress",
        type: "address",
      },
    ],
    name: "distributeAllBuildingsUnharvestedResources",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6080604052348015600f57600080fd5b50610e918061001f6000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806337cb2a5e1461003b578063d33f1b2114610050575b600080fd5b61004e610049366004610d3d565b610075565b005b61006361005e366004610d5a565b610467565b60405190815260200160405180910390f35b6040805180820182526004808252634641524d60e01b6020909201919091529051631b973c5760e21b815282916001600160a01b03831691636e5cf15c916100e3917f15e7d524175663fc8929751799c4e1a8d04fec20bebd7ac2f10532927c1b5c0d910190815260200190565b602060405180830381865afa158015610100573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101249190610d86565b6001600160a01b03166365e6f4ce6040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561015e57600080fd5b505af1158015610172573d6000803e3d6000fd5b5050604080518082018252600a8152691315535091549352531360b21b60209091015251631b973c5760e21b81527f6efa3da32b5b0a21cf9c6f5bc9edeb1d9e3a4b88cc5eb7b649f1e5029410165960048201526001600160a01b0384169250636e5cf15c9150602401602060405180830381865afa1580156101f9573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061021d9190610d86565b6001600160a01b03166365e6f4ce6040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561025757600080fd5b505af115801561026b573d6000803e3d6000fd5b50506040805180820182526004808252634d494e4560e01b6020909201919091529051631b973c5760e21b81526001600160a01b0385169350636e5cf15c92506102db917f458fc043506cc6fea16e7daa38390499ef978846d88dd78fe56678ac9de79444910190815260200190565b602060405180830381865afa1580156102f8573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061031c9190610d86565b6001600160a01b03166365e6f4ce6040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561035657600080fd5b505af115801561036a573d6000803e3d6000fd5b50506040805180820182526006815265534d4954485960d01b60209091015251631b973c5760e21b81527fe8d22c09878b0ae66551f207dc5f243823c9e1989bc2d5dfab58fb1a93386fd260048201526001600160a01b0384169250636e5cf15c9150602401602060405180830381865afa1580156103ed573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104119190610d86565b6001600160a01b03166365e6f4ce6040518163ffffffff1660e01b8152600401600060405180830381600087803b15801561044b57600080fd5b505af115801561045f573d6000803e3d6000fd5b505050505050565b60008280838303610476574293505b6000816001600160a01b03166330b67baa6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156104b6573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104da9190610d86565b90506000826001600160a01b0316637b1039996040518163ffffffff1660e01b8152600401602060405180830381865afa15801561051c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105409190610d86565b90506000836001600160a01b031663143e55e06040518163ffffffff1660e01b8152600401602060405180830381865afa158015610582573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105a69190610d86565b90506000816001600160a01b031663c91b95666040518163ffffffff1660e01b8152600401602060405180830381865afa1580156105e8573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061060c9190610d86565b604051633365906960e21b81526001600160a01b038b81166004830152919091169063cd9641a490602401602060405180830381865afa158015610654573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106789190610da3565b90506000866001600160a01b0316639dd26bd26040518163ffffffff1660e01b8152600401602060405180830381865afa1580156106ba573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906106de9190610da3565b905060006106ea6107c0565b905060005b81518110156107a4576000896001600160a01b0316636e5cf15c84848151811061071b5761071b610dbc565b60200260200101516040518263ffffffff1660e01b815260040161074191815260200190565b602060405180830381865afa15801561075e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107829190610d86565b905061078f87828e61095c565b6107999085610de8565b9350506001016106ef565b506107af8383610dfb565b985050505050505050505b92915050565b60408051600580825260c08201909252606091600091906020820160a08036833750506040805180820190915260048152634641524d60e01b6020909101525080519091507f15e7d524175663fc8929751799c4e1a8d04fec20bebd7ac2f10532927c1b5c0d90829060009061083857610838610dbc565b6020026020010181815250506040518060400160405280600a8152602001691315535091549352531360b21b815250805190602001208160018151811061088157610881610dbc565b602002602001018181525050604051806040016040528060048152602001634d494e4560e01b81525080519060200120816002815181106108c4576108c4610dbc565b60200260200101818152505060405180604001604052806006815260200165534d4954485960d01b815250805190602001208160038151811061090957610909610dbc565b602002602001018181525050604051806040016040528060048152602001631193d49560e21b815250805190602001208160048151811061094c5761094c610dbc565b6020908102919091010152919050565b600080836001600160a01b0316638545bc586040518163ffffffff1660e01b8152600401602060405180830381865afa15801561099d573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906109c19190610da3565b9050806000036109d5576000915050610b5c565b60405163748def3b60e11b8152600481018290526000906001600160a01b0386169063e91bde7690602401602060405180830381865afa158015610a1d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a419190610da3565b90506000610a5b610a56836305f5e100610e22565b610b63565b9050655af3107a400081610acf886001600160a01b03166304b10ac86040518163ffffffff1660e01b8152600401602060405180830381865afa158015610aa6573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610aca9190610da3565b610bd3565b604051633acd614d60e21b8152600481018990526001600160a01b038a169063eb35853490602401602060405180830381865afa158015610b14573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610b389190610da3565b610b429190610e22565b610b4c9190610e39565b610b569190610e39565b93505050505b9392505050565b60006003821115610bc45750806000610b7d600283610e39565b610b88906001610de8565b90505b81811015610bbe57905080600281610ba38186610e39565b610bad9190610de8565b610bb79190610e39565b9050610b8b565b50919050565b8115610bce575060015b919050565b6040805180820190915260048152631193d3d160e21b60209091015260007fd090a5d9e290baeb3c0f657cb8df01a7c37d0d11b8a73165ba04298bd71606c38201610c2757506706f05b59d3b20000919050565b60408051808201909152600481526315d3d3d160e21b6020909101527fa0c2c402a49ee67eb7d8a3e87eb93de113a3a54817e8a70c39ae8ab51c0e12be8201610c795750670de0b6b3a7640000919050565b6040805180820190915260038152624f524560e81b6020909101527f624ae31110c92d70b58ec456bb42524ff16773a98936d8ef150f1e6b104b34ab8201610cca5750671bc16d674ec80000919050565b604080518082019091526005815264125391d3d560da1b6020909101527f0b2c26746c5e8d6f1877c4437947c29fc4d8103cd72878c4c039b7afe27c1a8e8201610d1d57506729a2241af62c0000919050565b506000919050565b6001600160a01b0381168114610d3a57600080fd5b50565b600060208284031215610d4f57600080fd5b8135610b5c81610d25565b60008060408385031215610d6d57600080fd5b8235610d7881610d25565b946020939093013593505050565b600060208284031215610d9857600080fd5b8151610b5c81610d25565b600060208284031215610db557600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b808201808211156107ba576107ba610dd2565b8181036000831280158383131683831282161715610e1b57610e1b610dd2565b5092915050565b80820281158282048414176107ba576107ba610dd2565b600082610e5657634e487b7160e01b600052601260045260246000fd5b50049056fea26469706673582212205d6e17a65e7c0a7eddd014149cd51aefe30019d7190e9c8c930bdfec3b19738564736f6c634300081a0033";

type SettlementViewConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SettlementViewConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SettlementView__factory extends ContractFactory {
  constructor(...args: SettlementViewConstructorParams) {
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
      SettlementView & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): SettlementView__factory {
    return super.connect(runner) as SettlementView__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SettlementViewInterface {
    return new Interface(_abi) as SettlementViewInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): SettlementView {
    return new Contract(address, _abi, runner) as unknown as SettlementView;
  }
}
