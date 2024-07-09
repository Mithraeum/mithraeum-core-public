import {
  Army, Settlement__factory,
} from "../../typechain-types";
import { toBN } from "../../scripts/utils/const";
import {WorldHelper} from "./WorldHelper";

export class ArmyHelper {
  public static async getStunDuration(
    army: Army
  ) {
    const stunInfo = await army.stunInfo();
    return toBN(stunInfo.endTime - stunInfo.beginTime);
  }

  public static async getManeuverDuration(
    army: Army
  ) {
    const maneuverInfo = await army.maneuverInfo();
    return Number(maneuverInfo.endTime - maneuverInfo.beginTime);
  }

  public static async isArmyInHiddenManeuver(
      army: Army
  ) {
    const maneuverInfo = await army.maneuverInfo();
    return Number(maneuverInfo.beginTime) !== 0 && Number(maneuverInfo.endTime) === 0 && Number(maneuverInfo.secretDestinationPosition) !== 0;
  }

  public static async getSiegeAddressOnArmyPosition(
      army: Army
  ) {
    const currentPosition = await army.getCurrentPosition();

    const crossErasMemoryInstance = await WorldHelper.getCrossErasMemoryInstance()
    const settlementAddressAtPosition = await crossErasMemoryInstance.settlementByPosition(currentPosition);

    const settlementInstance = Settlement__factory.connect(settlementAddressAtPosition, army.runner);
    return await settlementInstance.siege();
  }
}
