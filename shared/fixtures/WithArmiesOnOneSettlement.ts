import { deployments, getNamedAccounts } from "hardhat";
import { UserHelper } from "../helpers/UserHelper";
import { WithEnoughResources } from "./WithEnoughResources";
import { MovementHelper } from "../helpers/MovementHelper";
import { SettlementHelper } from "../helpers/SettlementHelper";
import { UnitHelper } from "../helpers/UnitHelper";
import { WorldHelper } from "../helpers/WorldHelper";
import { expect } from 'chai';
import { FortHelper } from '../helpers/FortHelper';
import BigNumber from 'bignumber.js';

export const WithArmiesOnOneSettlement = deployments.createFixture(
  async () => {
    await WithEnoughResources();

    const {testUser1, testUser2, testUser3 } = await getNamedAccounts();

    const unitQuantity = 2;
    const assignWorkerQuantity = 2;
    const fortHealth = 10;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);
    const userSettlementInstance3 = await UserHelper.getUserSettlementByNumber(testUser3, 1);

    await FortHelper.repairFort(userSettlementInstance1, assignWorkerQuantity, new BigNumber(fortHealth));
    await FortHelper.repairFort(userSettlementInstance2, assignWorkerQuantity, new BigNumber(fortHealth));
    await FortHelper.repairFort(userSettlementInstance3, assignWorkerQuantity, new BigNumber(fortHealth));

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);
    const army3 = await SettlementHelper.getArmy(userSettlementInstance3);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity)).to.be.true;
    expect(await UnitHelper.isHirePossible(army2, unitTypes, unitQuantity)).to.be.true;
    expect(await UnitHelper.isHirePossible(army3, unitTypes, unitQuantity)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity);
    await UnitHelper.hireUnits(army2, unitTypes, unitQuantity);
    await UnitHelper.hireUnits(army3, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army1, await userSettlementInstance2.position(), 0, true);
    await MovementHelper.moveArmy(army3, await userSettlementInstance2.position(), 0, true);
  }
);
