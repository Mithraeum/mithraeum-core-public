import chaiModule from "chai";
import {chaiEthers} from "chai-ethers";
import {chaiBigNumber} from "./test/_helpers/bignumber";
chaiModule.use(chaiEthers);
chaiModule.use(chaiBigNumber);
export = chaiModule;
