import {ethers} from "hardhat";
import {WorldHelper} from "./WorldHelper";
import {
  Army,
  CultistsSettlement__factory,
  Settlement__factory,
  Units__factory,
  IUnitsPool__factory,
  Region, Settlement
} from "../../typechain-types";
import {toBN, toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import {UnitType} from "../enums/unitType";
import BigNumber from "bignumber.js";
import {ResourceType} from "../enums/resourceType";
import {zip} from "lodash";
import {ResourceHelper} from "./ResourceHelper";
import {HardhatHelper} from "./HardhatHelper";
import {SettlementHelper} from "./SettlementHelper";
import {BuildingHelper} from "./BuildingHelper";
import {RegionHelper} from './RegionHelper';

export class UnitHelper {
  public static getUnitTypeId(
      unitType: UnitType
  ) {
    return ethers.solidityPackedKeccak256(["string"], [unitType]);
  }

  public static getUnitTypeByUnitTypeId(
      unitTypeId: string
  ): UnitType {
    const allStringValues = Object.values(UnitType) as string[];
    const allTypeIds = allStringValues.map(typeString => ethers.solidityPackedKeccak256(["string"], [typeString]));
    const zippedTypeStringValuesWithIds = zip(allStringValues, allTypeIds);
    const tupleByTypeId = zippedTypeStringValuesWithIds
        .find(([typeStringValue, typeIdOfStringValue]) => {
          return unitTypeId === typeIdOfStringValue;
        });

    if (!tupleByTypeId) {
      throw new Error(`UnitType not found for ${tupleByTypeId}`);
    }

    return tupleByTypeId[0] as UnitType;
  }

  public static async getCultistsSettlementInstance(
    regionInstance: Region
  ) {
    const cultistsSettlementAddress = await regionInstance.cultistsSettlement();
    return CultistsSettlement__factory.connect(cultistsSettlementAddress, regionInstance.runner);
  }

  public static async getCultistQuantity(
    regionInstance: Region
  ) {
    const registryInstance = await WorldHelper.getRegistryInstance();
    const eraInstance = await WorldHelper.getCurrentEraInstance();

    const cultistsSettlementInstance = await this.getCultistsSettlementInstance(regionInstance);
    const cultistsArmyAddress = await cultistsSettlementInstance.army();
    const cultistUnitTypeId = await registryInstance.getCultistUnitTypeId();
    const cultistUnitAddress = await eraInstance.units(cultistUnitTypeId);
    const cultistUnitInstance = Units__factory.connect(cultistUnitAddress, regionInstance.runner);

    return toLowBN(await cultistUnitInstance.balanceOf(cultistsArmyAddress));
  }

  public static async getUnitQuantity(
    userAddress: string,
    unitType: UnitType
  ) {
    const signer = await ethers.getSigner(userAddress);
    const eraInstance = await WorldHelper.getCurrentEraInstance();
    const unitTypeId = this.getUnitTypeId(unitType);
    const unitAddress = await eraInstance.units(unitTypeId);
    const userUnits = Units__factory.connect(unitAddress, signer);

    return toLowBN(await userUnits.balanceOf(userAddress));
  }

  public static async getUnitsQuantity(
    userAddress: string,
    unitTypes: UnitType[]
  ) {
    return Object.fromEntries(await Promise.all(unitTypes.map(async unitType => {
      return [unitType, await this.getUnitQuantity(userAddress, unitType)];
    })));
  }

  public static async getUnitStats(
    unitType: UnitType
  ) {
    const registryInstance = await WorldHelper.getRegistryInstance();
    const unitTypeId = this.getUnitTypeId(unitType);
    return await registryInstance.getUnitStats(unitTypeId);
  }

  public static async getUnitsStats(
      unitTypes: UnitType[]
  ): Promise<{[key in UnitType]: {
    offenseStage1: BigNumber;
    defenceStage1: BigNumber;
    offenseStage2: BigNumber;
    defenceStage2: BigNumber;
    siegePower: BigNumber;
    siegeMaxRobberyPoints: BigNumber;
    siegeSupport: BigNumber;
  }}> {
    return Object.fromEntries(await Promise.all(unitTypes.map(async unitType => {
      return [unitType, await this.getUnitStats(unitType)];
    })));
  }

  public static async hireUnits(
      army: Army,
      unitTypes: UnitType[],
      unitQuantity: number
  ) {
    const userSettlementAddress = await army.relatedSettlement();
    const userSettlementInstance = Settlement__factory.connect(userSettlementAddress, army.runner);

    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    const ingotQuantity = await ResourceHelper.getResourceQuantity(
        HardhatHelper.getRunnerAddress(army.runner),
        ResourceType.INGOT,
    );

    await regionInstance.buyUnitsBatch(
        ethers.ZeroAddress,
        userSettlementAddress,
        unitTypes.map(unitType => this.getUnitTypeId(unitType)),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity))),
        unitTypes.map(_ => transferableFromLowBN(ingotQuantity))
    ).then((tx) => tx.wait());
  }

  public static async getTotalUnitPriceByRegion(
    regionInstance: Region,
    unitType: UnitType,
    unitQuantity: number
  ) {
    const unitTypeId = this.getUnitTypeId(unitType);
    const unitsPoolAddress = await regionInstance.unitsPools(unitTypeId);
    const unitsPoolInstance = IUnitsPool__factory.connect(unitsPoolAddress, regionInstance.runner);

    return toLowBN((await unitsPoolInstance.calculateTokensForExactUnits(unitQuantity))[0]);
  }

  public static async getMaxAvailableUnitQuantityToHire(
      settlementInstance: Settlement
  ) {
    const registryInstance = await WorldHelper.getRegistryInstance();

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const fort = await SettlementHelper.getFort(settlementInstance);
    await fort.updateState().then((tx) => tx.wait());

    const unitHiringFortHpMultiplier = toLowBN(await registryInstance.getUnitHiringFortHpMultiplier());
    const buildingCoefficient = await BuildingHelper.getBuildingCoefficient(toBN(await fort.getBuildingLevel()));

    const maxUnitQuantityToHire = toLowBN(await fort.health()).multipliedBy(unitHiringFortHpMultiplier).dividedBy(buildingCoefficient).integerValue(BigNumber.ROUND_FLOOR);

    let userUnitQuantity = new BigNumber(0);
    for (let i = 0; i < unitTypes.length; i++) {
      userUnitQuantity = userUnitQuantity.plus(await this.getUnitQuantity(await settlementInstance.army(), unitTypes[i]));
    }

    return maxUnitQuantityToHire.minus(userUnitQuantity);
  }

  public static async isHirePossible(
      army: Army,
      unitTypes: UnitType[],
      unitQuantity: number
  ) {
    const userSettlementAddress = await army.relatedSettlement();
    const userSettlementInstance = Settlement__factory.connect(userSettlementAddress, army.runner);

    const unitQuantityToHire = new BigNumber(unitQuantity).multipliedBy(unitTypes.length);
    const maxAvailableUnitQuantityToHire = await this.getMaxAvailableUnitQuantityToHire(userSettlementInstance);

    return unitQuantityToHire.toNumber() <= maxAvailableUnitQuantityToHire.toNumber();
  }
}
