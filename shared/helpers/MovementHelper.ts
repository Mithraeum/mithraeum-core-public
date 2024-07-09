import { Army } from "../../typechain-types";
import { EvmUtils } from "./EvmUtils";
import BigNumber from "bignumber.js";
import { toLowBN, transferableFromLowBN } from "../../scripts/utils/const";
import { UnitHelper } from "./UnitHelper";
import { ArmyUnits } from "../../test/core/BattleCoreTest";
import { ONE_HOUR_IN_SECONDS } from "../constants/time";
import { WorldHelper } from "./WorldHelper";
import {getDistanceBetweenPositions, oddqToAxial, positionToOddq} from "../../scripts/utils/geographyUtils";
import {ArmyHelper} from "./ArmyHelper";
import { ethers } from 'hardhat';

export class MovementHelper {
  public static getDistanceBetweenPositions(
      position1: bigint,
      position2: bigint
  ) {
    return Number(
        getDistanceBetweenPositions(
            oddqToAxial(positionToOddq(position1)),
            oddqToAxial(positionToOddq(position2))
        )
    );
  }

  public static getManeuverDurationByDistance(
    distance: number
  ) {
    return distance * 5 * ONE_HOUR_IN_SECONDS;
  }

  public static async moveArmy(
    army: Army,
    destination: bigint,
    foodToSpendOnFeeding: number,
    shouldWaitStun: boolean
  ) {
    const positionBefore = await army.getCurrentPosition();
    const distanceBetweenPositions = this.getDistanceBetweenPositions(positionBefore, destination);

    await army.beginOpenManeuver(
        destination,
        transferableFromLowBN(new BigNumber(foodToSpendOnFeeding))
    ).then((tx) => tx.wait());

    const maneuverDuration = this.getManeuverDurationByDistance(distanceBetweenPositions)
    await EvmUtils.increaseTime(maneuverDuration);

    if (shouldWaitStun) {
      await army.updateState().then((tx) => tx.wait());
      const stunDuration = await ArmyHelper.getStunDuration(army);
      await EvmUtils.increaseTime(stunDuration.toNumber());
    }
  }

  public static async getResourceAmountForSpeedUp(
      army: Army,
      distance: number,
      speedUpBonusMultiplier: BigNumber
  ) {
    const registryInstance = await WorldHelper.getRegistryInstance();
    const unitTypeIds = await WorldHelper.getGameUnits();

    const resourceAmountForUnits: ArmyUnits = Object.fromEntries(
        await Promise.all(
            unitTypeIds.map(async unitTypeId => {
              const unitType = UnitHelper.getUnitTypeByUnitTypeId(unitTypeId);
              const armyAddress = await army.getAddress();
              const unitQuantity = await UnitHelper.getUnitQuantity(armyAddress, unitType);
              const unitResourceUsage = toLowBN(await registryInstance.getUnitResourceUsagePer1SecondOfDecreasedManeuverDuration(unitTypeId));

              return [unitType, unitQuantity.multipliedBy(unitResourceUsage)];
            })
        )
    );

    const totalFoodAmountForUnits = Object.entries(resourceAmountForUnits).reduce(
        (total, [unitType, resourceAmountForUnit]) => {
          return total.plus(resourceAmountForUnit);
        },
        new BigNumber(0)
    );

    return (new BigNumber(distance).minus(new BigNumber(distance).sqrt()))
        .multipliedBy(5)
        .multipliedBy(ONE_HOUR_IN_SECONDS)
        .multipliedBy(totalFoodAmountForUnits)
        .multipliedBy(speedUpBonusMultiplier);
  }

    public static getRevealKey() {
        return ethers.solidityPackedKeccak256(["string"], ["revealKey"]);
    }

    public static getSecretDestinationPosition(
        position: bigint,
        revealKey: string
    ) {
        return ethers.solidityPackedKeccak256(
            ["uint64", "bytes32"],
            [position, revealKey]
        );
    }
}
