import { Battle } from "../../typechain-types";
import BigNumber from "bignumber.js";
import {toBN, toLowBN} from "../../scripts/utils/const";
import { UnitType } from "../enums/unitType";
import { ArmyUnits } from "../../test/core/BattleCoreTest";
import { UnitHelper } from "./UnitHelper";
import {WorldHelper} from "./WorldHelper";

export class BattleHelper {
  public static async getSideUnitsAmount(
    battleInstance: Battle,
    side: number,
    unitTypes: UnitType[]
  ): Promise<ArmyUnits> {
    return Object.fromEntries(
      await Promise.all(
        unitTypes.map(async unitType => [unitType, toLowBN(await battleInstance.sideUnitsAmount(side, UnitHelper.getUnitTypeId(unitType)))])
      )
    )
  }

  public static async getTotalSideUnitsCount(
    sideUnitsCount: ArmyUnits
  ) {
    return Object.entries(sideUnitsCount).reduce(
      (total, [unitType, unitsBalance]) => {
        return total.plus(unitsBalance);
      },
      new BigNumber(0)
    )
  }

  public static async getTotalSideUnitsStats(
    sideUnitsCount: ArmyUnits
  ) {
    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));
    const unitsStats = await UnitHelper.getUnitsStats(unitTypes);

    const keys = [
      "offenseStage1",
      "defenceStage1",
      "offenseStage2",
      "defenceStage2",
      "siegePower",
      "siegeSupport"
  ]
    return Object.fromEntries(
      keys.map((key) => {
        const value = Object.entries(sideUnitsCount).reduce(
          (total, [unitType, unitsBalance]) => {
            return total.plus(unitsBalance.multipliedBy(toBN((unitsStats[unitType as UnitType] as any)[key])));
          },
          new BigNumber(0)
        )
        return [key, value]
      })
    )
  }

  public static async getBattleDuration(
      battleInstance: Battle
  ) {
    const battleTimeInfo = await battleInstance.battleTimeInfo();
    return Number(battleTimeInfo.duration);
  }
}
