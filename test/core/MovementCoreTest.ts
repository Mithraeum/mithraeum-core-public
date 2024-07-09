import {ethers, getNamedAccounts} from "hardhat";
import {Battle__factory} from "../../typechain-types";
import {UserHelper} from "../../shared/helpers/UserHelper";
import {toBN, toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import BigNumber from "bignumber.js";
import {EvmUtils} from "../../shared/helpers/EvmUtils";
import {expect} from "chai";
import {SettlementHelper} from "../../shared/helpers/SettlementHelper";
import {UnitType} from "../../shared/enums/unitType";
import {MovementHelper} from "../../shared/helpers/MovementHelper";
import {UnitHelper} from "../../shared/helpers/UnitHelper";
import {FortHelper} from "../../shared/helpers/FortHelper";
import {ResourceHelper} from "../../shared/helpers/ResourceHelper";
import {ArmyUnits} from "./BattleCoreTest";
import {WorldHelper} from "../../shared/helpers/WorldHelper";
import {BattleHelper} from "../../shared/helpers/BattleHelper";
import {ArmyHelper} from "../../shared/helpers/ArmyHelper";
import {BuildingHelper} from "../../shared/helpers/BuildingHelper";
import {BuildingType} from "../../shared/enums/buildingType";
import {ProductionHelper} from "../../shared/helpers/ProductionHelper";
import {WorkerHelper} from "../../shared/helpers/WorkerHelper";
import {CultistsHelper} from '../../shared/helpers/CultistsHelper';
import {ProsperityHelper} from '../../shared/helpers/ProsperityHelper';
import {RegionHelper} from '../../shared/helpers/RegionHelper';

export class MovementCoreTest {
  public static async maneuverTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 4;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const positionBefore = await army.getCurrentPosition();
    const nextSettlementPosition = await userSettlementInstance2.position();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, nextSettlementPosition);

    //maneuver to another settlement
    await army.beginOpenManeuver(
        nextSettlementPosition,
        0
    ).then((tx) => tx.wait());

    const expectedManeuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);

    const actualManeuverDuration = await ArmyHelper.getManeuverDuration(army);
    expect(actualManeuverDuration).eql(expectedManeuverDuration, 'Maneuver duration is not correct');

    await EvmUtils.increaseTime(expectedManeuverDuration);

    const maneuverDurationStunMultiplier = toLowBN(await registryInstance.getManeuverDurationStunMultiplier());
    const expectedStunDuration = maneuverDurationStunMultiplier.multipliedBy(expectedManeuverDuration);

    await army.updateState().then((tx) => tx.wait());

    const actualArmyPosition = await army.getCurrentPosition();
    const actualStunDuration = await ArmyHelper.getStunDuration(army);

    expect(actualArmyPosition).eql(nextSettlementPosition, 'Army position is not correct');
    expect(actualStunDuration).eql(expectedStunDuration, 'Stun duration is not correct');
  }

  public static async impossibleManeuverDuringStunTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 4;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const userSettlementPosition1 = await userSettlementInstance1.position();
    const userSettlementPosition2 = await userSettlementInstance2.position();

    //maneuver to another settlement
    await MovementHelper.moveArmy(army, userSettlementPosition2, 0, false);

    await expect(
      MovementHelper.moveArmy(army, userSettlementPosition1, 0, true)
    ).to.be.revertedWith("ArmyIsStunned()");
  }

  public static async maneuverSpeedUpTest(speedUpPercentage: number) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 1;
    const buildingType = BuildingType.FARM;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    speedUpPercentage = speedUpPercentage > 100 ? 100 : speedUpPercentage;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance1, buildingType);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const positionBefore = await army.getCurrentPosition();
    const nextSettlementPosition = await userSettlementInstance2.position();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, nextSettlementPosition);

    //maneuver with speed up
    const resourceAmountForSpeedUp = await MovementHelper.getResourceAmountForSpeedUp(
        army,
        distanceBetweenPositions,
        new BigNumber(speedUpPercentage).dividedBy(100)
    );

    const toReservePercent = toLowBN(await registryInstance.getToTreasuryPercent());
    const productionTime = await ProductionHelper.getBasicProductionTimeToProduceResources(
        userSettlementInstance1,
        buildingType,
        resourceAmountForSpeedUp.dividedBy(toReservePercent)
    );

    await EvmUtils.increaseTime(productionTime);

    await buildingInstance.updateState().then((tx) => tx.wait());

    const buildingTreasuryAmountBefore = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);
    expect(buildingTreasuryAmountBefore).gte(resourceAmountForSpeedUp, 'Building treasury amount is not correct');

    await army.beginOpenManeuver(
        nextSettlementPosition,
        transferableFromLowBN(resourceAmountForSpeedUp)
    ).then((tx) => tx.wait());

    const buildingTreasuryAmountAfter = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);
    expect(buildingTreasuryAmountBefore.minus(buildingTreasuryAmountAfter))
        .isInCloseRangeWith(resourceAmountForSpeedUp, 'Building treasury amount is not correct');

    const actualManeuverDurationWithSpeedUp = await ArmyHelper.getManeuverDuration(army);
    await EvmUtils.increaseTime(actualManeuverDurationWithSpeedUp);

    const speedUpMultiplier = 1 - speedUpPercentage / 100;
    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);
    const maneuverDurationWithMaxSpeedUp = MovementHelper.getManeuverDurationByDistance(Math.sqrt(distanceBetweenPositions));
    const maneuverDurationDifference = maneuverDuration - maneuverDurationWithMaxSpeedUp;
    const maneuverDurationBySpeedUpPercentage = maneuverDurationDifference * speedUpMultiplier;

    const expectedManeuverDurationWithSpeedUp = Math.floor(maneuverDurationWithMaxSpeedUp + maneuverDurationBySpeedUpPercentage);
    expect(actualManeuverDurationWithSpeedUp).eql(expectedManeuverDurationWithSpeedUp, 'Army maneuver was not speeded up');

    const actualArmyPosition = await army.getCurrentPosition();
    expect(actualArmyPosition).eql(nextSettlementPosition, 'Army position is not correct');

    const maneuverDurationStunMultiplier = toLowBN(await registryInstance.getManeuverDurationStunMultiplier());
    const expectedStunDuration = (maneuverDurationStunMultiplier.multipliedBy(actualManeuverDurationWithSpeedUp))
        .integerValue(BigNumber.ROUND_FLOOR);

    await army.updateState().then((tx) => tx.wait());

    const actualStunDuration = await ArmyHelper.getStunDuration(army);
    expect(actualStunDuration).eql(expectedStunDuration, 'Stun duration is not correct');
  }

  public static async maneuverSpeedUpWithLowResourceAmountTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 1;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(
        userSettlementInstance1,
        BuildingType.FARM
    );

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const positionBefore = await army.getCurrentPosition();
    const nextSettlementPosition = await userSettlementInstance2.position();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, nextSettlementPosition);

    const buildingTreasuryAmount = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);

    await army.beginOpenManeuver(
        nextSettlementPosition,
        transferableFromLowBN(buildingTreasuryAmount)
    ).then((tx) => tx.wait());

    const actualManeuverDurationWithSpeedUp = await ArmyHelper.getManeuverDuration(army);
    await EvmUtils.increaseTime(actualManeuverDurationWithSpeedUp);

    const maxResourceAmountForSpeedUp = await MovementHelper.getResourceAmountForSpeedUp(
        army,
        distanceBetweenPositions,
        new BigNumber(1)
    );
    expect(buildingTreasuryAmount).lte(maxResourceAmountForSpeedUp, 'Building treasury amount is not correct');

    const speedUpMultiplier = new BigNumber(1).minus(buildingTreasuryAmount.dividedBy(maxResourceAmountForSpeedUp));
    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);
    const maneuverDurationWithMaxSpeedUp = MovementHelper.getManeuverDurationByDistance(Math.sqrt(distanceBetweenPositions));
    const maneuverDurationDifference = maneuverDuration - maneuverDurationWithMaxSpeedUp;
    const maneuverDurationBySpeedUpPercentage = maneuverDurationDifference * speedUpMultiplier.toNumber();

    const expectedManeuverDurationWithSpeedUp = Math.ceil(maneuverDurationWithMaxSpeedUp + maneuverDurationBySpeedUpPercentage);
    expect(actualManeuverDurationWithSpeedUp).eql(expectedManeuverDurationWithSpeedUp, 'Army maneuver was not speeded up');

    const actualArmyPosition = await army.getCurrentPosition();
    expect(actualArmyPosition).eql(nextSettlementPosition, 'Army position is not correct');
  }

  public static async impossibleManeuverSpeedUpWithoutTreasuryResourceAmountTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 8;
    const siegeUnitQuantity = unitQuantity / 2;
    const unitTypes = [UnitType.WARRIOR];
    const speedUpPercentage = 100;
    const robberyMultiplier = 1;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity)).to.be.true;
    expect(await UnitHelper.isHirePossible(army2, unitTypes, siegeUnitQuantity)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity);
    await UnitHelper.hireUnits(army2, unitTypes, siegeUnitQuantity);

    const userSettlementPosition1 = await userSettlementInstance1.position();
    const userSettlementPosition2 = await userSettlementInstance2.position();

    await MovementHelper.moveArmy(army1, userSettlementPosition2, 0, true);

    const farm = await SettlementHelper.getFarm(userSettlementInstance2);

    await army1.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(robberyMultiplier))
    ).then((tx) => tx.wait());

    const fort = await SettlementHelper.getFort(userSettlementInstance2);

    const armyStunDuration = await ArmyHelper.getStunDuration(army1);
    const fortDestructionTime = await FortHelper.getSettlementFortDestructionTime(userSettlementInstance2);
    await EvmUtils.increaseTime(fortDestructionTime);

    await fort.updateState().then((tx) => tx.wait());

    const fortHealth = toLowBN(await fort.health());
    expect(fortHealth).eql(new BigNumber(0), 'Fort health is not correct');

    await farm.updateState().then((tx) => tx.wait());

    const buildingTreasuryAmountBefore = await ResourceHelper.getBuildingTreasuryAmount(farm);

    const robberyPointsRegenerationTime = await FortHelper.getSettlementFortRobberyPointsRegenerationTime(
        userSettlementInstance2,
        buildingTreasuryAmountBefore
    );

    fortDestructionTime + robberyPointsRegenerationTime > armyStunDuration.toNumber()
        ?   await EvmUtils.increaseTime(robberyPointsRegenerationTime)
        :   await EvmUtils.increaseTime(armyStunDuration.toNumber() - fortDestructionTime);

    await army1.swapRobberyPointsForResourceFromBuildingTreasury(
        await farm.getAddress(),
        transferableFromLowBN(buildingTreasuryAmountBefore)
    ).then((tx) => tx.wait());

    const actualBuildingTreasuryAmount = await ResourceHelper.getBuildingTreasuryAmount(farm);

    await army1.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => false),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(robberyMultiplier))
    ).then((tx) => tx.wait());

    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(userSettlementPosition2, userSettlementPosition1);

    const resourceAmountForSpeedUp = await MovementHelper.getResourceAmountForSpeedUp(
        army2,
        distanceBetweenPositions,
        new BigNumber(speedUpPercentage).dividedBy(100)
    );
    expect(actualBuildingTreasuryAmount).lt(resourceAmountForSpeedUp, 'Building treasury amount is not correct');

    await expect(
      MovementHelper.moveArmy(army2, userSettlementPosition1, resourceAmountForSpeedUp.toNumber(), false)
    ).to.be.revertedWith("ArmyCannotUseMoreResourcesForAccelerationThanBuildingTreasuryHas()");
  }

  public static async impossibleManeuverSpeedUpDueMaxLimitTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 1;
    const speedUpPercentage = 150;
    const buildingType = BuildingType.FARM;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance1, buildingType);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const positionBefore = await army.getCurrentPosition();
    const nextSettlementPosition = await userSettlementInstance2.position();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, nextSettlementPosition);

    const resourceAmountForSpeedUp = await MovementHelper.getResourceAmountForSpeedUp(
        army,
        distanceBetweenPositions,
        new BigNumber(speedUpPercentage).dividedBy(100)
    );
    const maxResourceAmountForSpeedUp = await MovementHelper.getResourceAmountForSpeedUp(
        army,
        distanceBetweenPositions,
        new BigNumber(1)
    );
    expect(resourceAmountForSpeedUp).gt(maxResourceAmountForSpeedUp, 'Resource amount for speed up is not correct');

    const toReservePercent = toLowBN(await registryInstance.getToTreasuryPercent());
    const productionTime = await ProductionHelper.getBasicProductionTimeToProduceResources(
        userSettlementInstance1,
        buildingType,
        resourceAmountForSpeedUp.dividedBy(toReservePercent)
    );

    await EvmUtils.increaseTime(productionTime);

    const buildingTreasuryAmountBefore = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);
    expect(buildingTreasuryAmountBefore).gte(resourceAmountForSpeedUp, 'Building treasury amount is not correct');

    await army.beginOpenManeuver(
        nextSettlementPosition,
        transferableFromLowBN(resourceAmountForSpeedUp)
    ).then((tx) => tx.wait());

    const buildingTreasuryAmountAfter = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);
    expect(buildingTreasuryAmountBefore.minus(buildingTreasuryAmountAfter))
        .isInCloseRangeWith(maxResourceAmountForSpeedUp, 'Building treasury amount is not correct');

    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);
    await EvmUtils.increaseTime(maneuverDuration);

    await army.updateState().then((tx) => tx.wait());

    const actualArmyPosition = await army.getCurrentPosition();
    expect(actualArmyPosition).eql(nextSettlementPosition, 'Army position is not correct');
  }

  public static async impossibleManeuverSpeedUpWithEmptyArmyTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity1 = 1;
    const unitQuantity2 = 2;
    const speedUpFoodQuantity = 5;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity1)).to.be.true;
    expect(await UnitHelper.isHirePossible(army2, unitTypes, unitQuantity2)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity1);
    await UnitHelper.hireUnits(army2, unitTypes, unitQuantity2);

    await MovementHelper.moveArmy(army1, await userSettlementInstance2.position(), 0, true);

    await army1.beginBattle(
      await army2.getAddress(),
      unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
      unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity2)))
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army1.battle(), army1.runner);

    const battleDuration = await BattleHelper.getBattleDuration(battleInstance);
    await EvmUtils.increaseTime(battleDuration);

    const army1UnitsBefore = await UnitHelper.getUnitsQuantity(await army1.getAddress(), unitTypes);

    for (let i = 0; i < unitTypes.length; i++) {
      expect(army1UnitsBefore[unitTypes[i]]).not.eql(new BigNumber(0), `Army 1 ${unitTypes[i]} quantity is not correct`);
    }

    await battleInstance.endBattle().then((tx) => tx.wait());

    await army1.updateState().then((tx) => tx.wait());
    await army2.updateState().then((tx) => tx.wait());

    const actualArmy1Units = await UnitHelper.getUnitsQuantity(await army1.getAddress(), unitTypes);

    for (let i = 0; i < unitTypes.length; i++) {
      expect(actualArmy1Units[unitTypes[i]]).eql(new BigNumber(0), `Army 1 ${unitTypes[i]} quantity is not correct`);
    }

    const stunDuration = await ArmyHelper.getStunDuration(army1);
    await EvmUtils.increaseTime(stunDuration.toNumber());

    await expect(
      MovementHelper.moveArmy(army1, await userSettlementInstance1.position(), speedUpFoodQuantity,  true)
    ).to.be.revertedWith("ArmyWithoutUnitsCannotAccelerate()");
  }

  public static async impossibleManeuverWithEmptyArmyTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const unitTypeIds = await WorldHelper.getGameUnits();

    const army = await SettlementHelper.getArmy(userSettlementInstance1);
    const armyUnits = await UnitHelper.getUnitsQuantity(
        await army.getAddress(),
        unitTypeIds.map(unitTypeId => UnitHelper.getUnitTypeByUnitTypeId(unitTypeId))
    );

    for (let i = 0; i < unitTypeIds.length; i++) {
      const unitType = UnitHelper.getUnitTypeByUnitTypeId(unitTypeIds[i]);
      expect(armyUnits[unitType]).eql(new BigNumber(0), `Army ${unitType} quantity is not correct`);
    }

    await expect(
      MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0,  true)
    ).to.be.revertedWith("ArmyWithoutUnitsCannotManeuverToNotHomeSettlement()");
  }

  public static async battleDuringMovementAndCalculateCasualtiesTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 2;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();

    const userSettlementPosition1 = await userSettlementInstance1.position();

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    const positionBefore = await army1.getCurrentPosition();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, userSettlementPosition1);
    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);

    //maneuver to testUser1 settlement
    await army1.beginOpenManeuver(
        userSettlementPosition1,
        0
    ).then((tx) => tx.wait());

    const maneuverInfo = await army1.maneuverInfo();

    await EvmUtils.increaseTime(maneuverDuration / 2);

    const actualArmyPosition = Number(await army1.getCurrentPosition());
    expect(actualArmyPosition).not.eql(userSettlementPosition1, 'Army position is not correct');

    await army2.beginBattle(
      await army1.getAddress(),
      unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
      unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity)))
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army2.battle(), army2.runner);

    const battleTimeInfo = await battleInstance.battleTimeInfo();
    const actualBattleDuration = battleTimeInfo.duration;
    await EvmUtils.increaseTime(Number(actualBattleDuration));

    const battleEndTime = battleTimeInfo.beginTime + actualBattleDuration;
    expect(battleEndTime).eql(maneuverInfo.endTime, 'Battle end time is not correct');

    //Stage 1
    //Side A
    const sideAUnits: ArmyUnits = await BattleHelper.getSideUnitsAmount(battleInstance, 1, unitTypes);
    const sideAStage1TotalUnits = await BattleHelper.getTotalSideUnitsCount(sideAUnits);

    const sideAStage1TotalOffense = (await BattleHelper.getTotalSideUnitsStats(sideAUnits))["offenseStage1"];
    const sideAStage1TotalDefence = (await BattleHelper.getTotalSideUnitsStats(sideAUnits))["defenceStage1"];

    //Side B
    const sideBUnits = await BattleHelper.getSideUnitsAmount(battleInstance, 2, unitTypes);
    const sideBStage1TotalUnits = await BattleHelper.getTotalSideUnitsCount(sideBUnits);

    const sideBStage1TotalOffense = (await BattleHelper.getTotalSideUnitsStats(sideBUnits))["offenseStage1"];
    const sideBStage1TotalDefence = (await BattleHelper.getTotalSideUnitsStats(sideBUnits))["defenceStage1"];

    const sideRatio = sideAStage1TotalUnits.toNumber() < sideBStage1TotalUnits.toNumber()
      ? sideAStage1TotalUnits.dividedBy(sideBStage1TotalUnits)
      : sideBStage1TotalUnits.dividedBy(sideAStage1TotalUnits);
    const battleDurationMultiplier = sideRatio.toNumber() < 0.5 ? sideRatio.toNumber() : 0.5;

    const baseBattleDuration = Number(await registryInstance.getBaseBattleDuration());
    const expectedBattleDuration = baseBattleDuration * (2 * battleDurationMultiplier);
    expect(Number(actualBattleDuration)).lt(expectedBattleDuration, 'Battle duration is not correct');

    const durationRatio = Number(actualBattleDuration) / expectedBattleDuration;

    const casualtiesPercentSideAStage1 = (await sideBStage1TotalOffense.dividedBy(sideAStage1TotalDefence)).multipliedBy(durationRatio);
    const casualtiesPercentSideBStage1 = (await sideAStage1TotalOffense.dividedBy(sideBStage1TotalDefence)).multipliedBy(durationRatio);

    //Stage 2
    //Side A
    const sideAUnitsAfterStage1 = Object.fromEntries(
        unitTypes.map(unitType => [unitType, sideAUnits[unitType].minus(casualtiesPercentSideAStage1.multipliedBy(sideAUnits[unitType]))])
    );

    const sideAStage2TotalOffense = (await BattleHelper.getTotalSideUnitsStats(sideAUnitsAfterStage1 as ArmyUnits))["offenseStage2"];
    const sideAStage2TotalDefence = (await BattleHelper.getTotalSideUnitsStats(sideAUnitsAfterStage1 as ArmyUnits))["defenceStage2"];

    //Side B
    const sideBUnitsAfterStage1 = Object.fromEntries(
        unitTypes.map(unitType => [unitType, sideBUnits[unitType].minus(casualtiesPercentSideBStage1.multipliedBy(sideBUnits[unitType]))])
    );

    const sideBStage2TotalOffense = (await BattleHelper.getTotalSideUnitsStats(sideBUnitsAfterStage1 as ArmyUnits))["offenseStage2"];
    const sideBStage2TotalDefence = (await BattleHelper.getTotalSideUnitsStats(sideBUnitsAfterStage1 as ArmyUnits))["defenceStage2"];

    const casualtiesPercentSideAStage2 = (await sideBStage2TotalOffense.dividedBy(sideAStage2TotalDefence)).multipliedBy(durationRatio);
    const casualtiesPercentSideBStage2 = (await sideAStage2TotalOffense.dividedBy(sideBStage2TotalDefence)).multipliedBy(durationRatio);

    const createExpectedArmyUnits = (
      armyBefore: ArmyUnits,
      armyPercentCasualties: BigNumber
    ): ArmyUnits => {
      return Object.fromEntries(
        unitTypes.map(unitType => {
          const unitBeforeMinusCasualties = (armyBefore[unitType]
            .minus(armyPercentCasualties.multipliedBy(armyBefore[unitType]))).integerValue(BigNumber.ROUND_DOWN);

          return [
            unitType as UnitType,
            unitBeforeMinusCasualties.isNegative() ? new BigNumber(0) : unitBeforeMinusCasualties
          ];
        })
      ) as ArmyUnits;
    };

    const expectedArmy1Units = createExpectedArmyUnits(sideAUnitsAfterStage1 as ArmyUnits, casualtiesPercentSideAStage2);
    const expectedArmy2Units = createExpectedArmyUnits(sideBUnitsAfterStage1 as ArmyUnits, casualtiesPercentSideBStage2);

    await battleInstance.endBattle().then((tx) => tx.wait());

    await army1.updateState().then((tx) => tx.wait());
    await army2.updateState().then((tx) => tx.wait());

    const actualArmy1Units = await UnitHelper.getUnitsQuantity(await army1.getAddress(), unitTypes);
    const actualArmy2Units = await UnitHelper.getUnitsQuantity(await army2.getAddress(), unitTypes);

    for (let i = 0; i < unitTypes.length; i++) {
      expect(actualArmy1Units[unitTypes[i]]).eql(expectedArmy1Units[unitTypes[i]], `Army 1 ${unitTypes[i]} quantity is not correct`);
      expect(actualArmy2Units[unitTypes[i]]).eql(expectedArmy2Units[unitTypes[i]], `Army 2 ${unitTypes[i]} quantity is not correct`);
    }
  }

  public static async impossibleBattleDuringManeuverDueLowDurationLeftTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 2;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const minimumBattleDuration = Number(await registryInstance.getMinimumBattleDuration());

    const userSettlementPosition1 = await userSettlementInstance1.position();

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    //maneuver to testUser1 settlement
    await army1.beginOpenManeuver(
        userSettlementPosition1,
        0
    ).then((tx) => tx.wait());

    const maneuverDuration = await ArmyHelper.getManeuverDuration(army1);
    await EvmUtils.increaseTime(maneuverDuration - minimumBattleDuration + 1);

    const armyPosition = Number(await army1.getCurrentPosition());
    expect(armyPosition).not.eql(userSettlementPosition1, 'Army position is not correct');

    await expect(
        army2.beginBattle(
            await army1.getAddress(),
            unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
            unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity)))
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("BattleCannotBeCreatedWhenAttackedArmyIsAlmostOnAnotherPosition()");
  }

  public static async revealHiddenManeuverTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 4;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const positionBefore = await army.getCurrentPosition();
    const nextSettlementPosition = await userSettlementInstance2.position();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, nextSettlementPosition);

    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(nextSettlementPosition, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(nextSettlementPosition);

    //hidden maneuver to another settlement
    await army.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army)).to.be.true;

    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);
    const hiddenManeuverDuration = maneuverDuration / 2;

    const timeBefore = await EvmUtils.getCurrentTime();
    await EvmUtils.increaseTime(hiddenManeuverDuration);

    await army.revealSecretManeuver(
        nextSettlementPosition,
        revealKey,
        transferableFromLowBN(new BigNumber(0))
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army)).to.be.false;

    const timeAfter = await EvmUtils.getCurrentTime();
    const passedTime = timeAfter - timeBefore;

    await EvmUtils.increaseTime(maneuverDuration - passedTime);

    const actualArmyPosition = await army.getCurrentPosition();
    expect(actualArmyPosition).eql(nextSettlementPosition, 'Army position is not correct');
  }

  public static async impossibleRevealHiddenManeuverTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 4;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const positionBefore = await army.getCurrentPosition();
    const nextSettlementPosition = await userSettlementInstance2.position();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, nextSettlementPosition);

    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(nextSettlementPosition, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(nextSettlementPosition);

    const wrongRevealKey = ethers.solidityPackedKeccak256(["string"], ["wrongRevealKey"]);
    expect(wrongRevealKey).not.eql(revealKey);

    //hidden maneuver to another settlement
    await army.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army)).to.be.true;

    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);
    const hiddenManeuverDuration = maneuverDuration / 2;

    await EvmUtils.increaseTime(hiddenManeuverDuration);

    await expect(
        army.revealSecretManeuver(
            nextSettlementPosition,
            wrongRevealKey,
            transferableFromLowBN(new BigNumber(0))
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("WrongSecretManeuverRevealInfo()");
  }

  public static async revealHiddenManeuverDuringBattleTest() {
    const { testUser1, testUser3 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity1 = 4;
    const unitQuantity3 = 1;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance3 = await UserHelper.getUserSettlementByNumber(testUser3, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army3 = await SettlementHelper.getArmy(userSettlementInstance3);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity1)).to.be.true;
    expect(await UnitHelper.isHirePossible(army3, unitTypes, unitQuantity3)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity1);
    await UnitHelper.hireUnits(army3, unitTypes, unitQuantity3);

    const userSettlementPosition1 = await userSettlementInstance1.position();
    const userSettlementPosition3 = await userSettlementInstance3.position();

    const positionBefore = await army1.getCurrentPosition();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, userSettlementPosition3);

    //army 3 maneuver to testUser1 settlement
    await MovementHelper.moveArmy(army3, userSettlementPosition1, 0, true);

    //army 1 hidden maneuver to testUser3 settlement
    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(userSettlementPosition3, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(userSettlementPosition3);

    await army1.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army1)).to.be.true;

    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);
    const hiddenManeuverDuration = maneuverDuration / 2;

    await EvmUtils.increaseTime(hiddenManeuverDuration);

    await army3.beginBattle(
        await army1.getAddress(),
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity1)))
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army3.battle(), army3.runner);
    const battleDuration = await BattleHelper.getBattleDuration(battleInstance);

    const battleDurationWinningArmyStunMultiplier = toLowBN(await registryInstance.getBattleDurationWinningArmyStunMultiplier());
    const battleDurationLosingArmyStunMultiplier = toLowBN(await registryInstance.getBattleDurationLosingArmyStunMultiplier());
    const stunDuration = unitQuantity1 > unitQuantity3
        ? battleDurationWinningArmyStunMultiplier.multipliedBy(battleDuration)
        : battleDurationLosingArmyStunMultiplier.multipliedBy(battleDuration);
    expect(stunDuration.plus(battleDuration).plus(hiddenManeuverDuration)).lt(new BigNumber(maneuverDuration));

    await army1.revealSecretManeuver(
        userSettlementPosition3,
        revealKey,
        transferableFromLowBN(new BigNumber(0))
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army1)).to.be.false;
  }

  public static async impossibleRevealHiddenManeuverDuringBattleTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity1 = 4;
    const unitQuantity2 = 4;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity1)).to.be.true;
    expect(await UnitHelper.isHirePossible(army2, unitTypes, unitQuantity2)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity1);
    await UnitHelper.hireUnits(army2, unitTypes, unitQuantity2);

    const userSettlementPosition1 = await userSettlementInstance1.position();
    const userSettlementPosition2 = await userSettlementInstance2.position();

    const positionBefore = await army1.getCurrentPosition();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, userSettlementPosition2);

    //army 2 maneuver to testUser1 settlement
    await MovementHelper.moveArmy(army2, userSettlementPosition1, 0, true);

    //army 1 hidden maneuver to testUser2 settlement
    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(userSettlementPosition2, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(userSettlementPosition2);

    await army1.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army1)).to.be.true;

    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);
    const hiddenManeuverDuration = maneuverDuration / 2;

    await EvmUtils.increaseTime(hiddenManeuverDuration);

    await army2.beginBattle(
        await army1.getAddress(),
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity1)))
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army2.battle(), army2.runner);
    const battleDuration = await BattleHelper.getBattleDuration(battleInstance);

    const battleDurationWinningArmyStunMultiplier = toLowBN(await registryInstance.getBattleDurationWinningArmyStunMultiplier());
    const battleDurationLosingArmyStunMultiplier = toLowBN(await registryInstance.getBattleDurationLosingArmyStunMultiplier());
    const stunDuration = unitQuantity1 > unitQuantity2
        ? battleDurationWinningArmyStunMultiplier.multipliedBy(battleDuration)
        : battleDurationLosingArmyStunMultiplier.multipliedBy(battleDuration);
    expect(stunDuration.plus(battleDuration).plus(hiddenManeuverDuration)).gt(new BigNumber(maneuverDuration));

    await expect(
        army1.revealSecretManeuver(
            userSettlementPosition2,
            revealKey,
            transferableFromLowBN(new BigNumber(0))
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("SecretManeuverRevealNotPossibleAtThisTime()");
  }

  public static async revealHiddenManeuverWithSpeedUpTest(speedUpPercentage: number) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 4;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(
        userSettlementInstance1,
        BuildingType.LUMBERMILL
    );

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const positionBefore = await army.getCurrentPosition();
    const nextSettlementPosition = await userSettlementInstance2.position();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, nextSettlementPosition);

    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(nextSettlementPosition, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(nextSettlementPosition);

    //hidden maneuver to another settlement
    await army.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army)).to.be.true;

    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);
    const minHiddenManeuverDuration = MovementHelper.getManeuverDurationByDistance(Math.sqrt(distanceBetweenPositions));

    const timeBefore = await EvmUtils.getCurrentTime();
    await EvmUtils.increaseTime(minHiddenManeuverDuration);

    const resourceAmountForSpeedUp = await MovementHelper.getResourceAmountForSpeedUp(
        army,
        distanceBetweenPositions,
        new BigNumber(speedUpPercentage).dividedBy(100)
    );
    const buildingTreasuryAmountBefore = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);
    expect(buildingTreasuryAmountBefore).gte(resourceAmountForSpeedUp);

    await army.revealSecretManeuver(
        nextSettlementPosition,
        revealKey,
        transferableFromLowBN(resourceAmountForSpeedUp)
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army)).to.be.false;

    const buildingTreasuryAmountAfter = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);
    expect(buildingTreasuryAmountAfter)
        .isInCloseRangeWith(buildingTreasuryAmountBefore.minus(resourceAmountForSpeedUp), 'Building treasury amount is not correct');

    const actualManeuverDuration = await ArmyHelper.getManeuverDuration(army);
    expect(actualManeuverDuration).lt(maneuverDuration, 'Maneuver duration is not correct');

    const timeAfter = await EvmUtils.getCurrentTime();
    const passedTime = timeAfter - timeBefore;

    await EvmUtils.increaseTime(actualManeuverDuration - passedTime);

    const actualArmyPosition = await army.getCurrentPosition();
    expect(actualArmyPosition).eql(nextSettlementPosition, 'Army position is not correct');
  }

  public static async impossibleRevealHiddenManeuverWithSpeedUpTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 4;
    const speedUpPercentage = 30;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(
        userSettlementInstance1,
        BuildingType.LUMBERMILL
    );

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const positionBefore = await army.getCurrentPosition();
    const nextSettlementPosition = await userSettlementInstance2.position();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, nextSettlementPosition);

    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(nextSettlementPosition, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(nextSettlementPosition);

    //hidden maneuver to another settlement
    await army.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army)).to.be.true;

    const minHiddenManeuverDuration = MovementHelper.getManeuverDurationByDistance(Math.sqrt(distanceBetweenPositions));
    await EvmUtils.increaseTime(minHiddenManeuverDuration / 2);

    const resourceAmountForSpeedUp = await MovementHelper.getResourceAmountForSpeedUp(
        army,
        distanceBetweenPositions,
        new BigNumber(speedUpPercentage).dividedBy(100)
    );
    const buildingTreasuryAmount = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);
    expect(buildingTreasuryAmount).gte(resourceAmountForSpeedUp, 'Building treasury amount is not correct');

    await expect(
        army.revealSecretManeuver(
            nextSettlementPosition,
            revealKey,
            transferableFromLowBN(resourceAmountForSpeedUp)
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("SecretManeuverRevealNotPossibleAtThisTime()");
  }

  public static async revealHiddenManeuverWithSpeedUpAfterBattleTest() {
    const { testUser1, testUser3 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity1 = 4;
    const unitQuantity3 = 1;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance3 = await UserHelper.getUserSettlementByNumber(testUser3, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army3 = await SettlementHelper.getArmy(userSettlementInstance3);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity1)).to.be.true;
    expect(await UnitHelper.isHirePossible(army3, unitTypes, unitQuantity3)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity1);
    await UnitHelper.hireUnits(army3, unitTypes, unitQuantity3);

    const userSettlementPosition1 = await userSettlementInstance1.position();
    const userSettlementPosition3 = await userSettlementInstance3.position();

    const positionBefore = await army1.getCurrentPosition();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, userSettlementPosition3);

    //army 3 maneuver to testUser1 settlement
    await MovementHelper.moveArmy(army3, userSettlementPosition1, 0, true);

    //army 1 hidden maneuver to testUser3 settlement
    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(userSettlementPosition3, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(userSettlementPosition3);

    await army1.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army1)).to.be.true;

    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);
    const minHiddenManeuverDuration = MovementHelper.getManeuverDurationByDistance(Math.sqrt(distanceBetweenPositions));

    await EvmUtils.increaseTime(Math.ceil(minHiddenManeuverDuration));

    await army3.beginBattle(
        await army1.getAddress(),
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity1)))
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army3.battle(), army3.runner);

    const battleDuration = await BattleHelper.getBattleDuration(battleInstance);
    await EvmUtils.increaseTime(battleDuration);

    await battleInstance.endBattle().then((tx) => tx.wait());
    await army1.updateState().then((tx) => tx.wait());

    const stunDuration = await ArmyHelper.getStunDuration(army1);
    expect(stunDuration.plus(battleDuration).plus(minHiddenManeuverDuration)).lt(new BigNumber(maneuverDuration));

    await EvmUtils.increaseTime(stunDuration.toNumber());

    await army1.revealSecretManeuver(
        userSettlementPosition3,
        revealKey,
        transferableFromLowBN(new BigNumber(1))
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army1)).to.be.false;

    const actualManeuverDuration = await ArmyHelper.getManeuverDuration(army1);
    expect(actualManeuverDuration).lt(maneuverDuration, 'Maneuver duration is not correct');
  }

  public static async impossibleRevealHiddenManeuverWithSpeedUpDuringBattleTest() {
    const { testUser1, testUser3 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity1 = 4;
    const unitQuantity3 = 1;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance3 = await UserHelper.getUserSettlementByNumber(testUser3, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army3 = await SettlementHelper.getArmy(userSettlementInstance3);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity1)).to.be.true;
    expect(await UnitHelper.isHirePossible(army3, unitTypes, unitQuantity3)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity1);
    await UnitHelper.hireUnits(army3, unitTypes, unitQuantity3);

    const userSettlementPosition1 = await userSettlementInstance1.position();
    const userSettlementPosition3 = await userSettlementInstance3.position();

    const positionBefore = await army1.getCurrentPosition();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, userSettlementPosition3);

    //army 3 maneuver to testUser1 settlement
    await MovementHelper.moveArmy(army3, userSettlementPosition1, 0, true);

    //army 1 hidden maneuver to testUser3 settlement
    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(userSettlementPosition3, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(userSettlementPosition3);

    await army1.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army1)).to.be.true;

    const minHiddenManeuverDuration = MovementHelper.getManeuverDurationByDistance(Math.sqrt(distanceBetweenPositions));

    await EvmUtils.increaseTime(Math.ceil(minHiddenManeuverDuration));

    await army3.beginBattle(
        await army1.getAddress(),
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity1)))
    ).then((tx) => tx.wait());

    await expect(
        army1.revealSecretManeuver(
            userSettlementPosition3,
            revealKey,
            transferableFromLowBN(new BigNumber(1))
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("ArmyIsInBattle()");
  }

  public static async cancelHiddenManeuverTest(unitType: UnitType) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 4;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const unitTypeId = UnitHelper.getUnitTypeId(unitType);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, [unitType], unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, [unitType], unitQuantity);

    const armyUnitsBefore = await UnitHelper.getUnitsQuantity(await army.getAddress(), [unitType]);
    for (let i = 0; i < [unitType].length; i++) {
      expect(armyUnitsBefore[[unitType][i]]).not.eql(new BigNumber(0), `Army ${[unitType][i]} quantity in battle is not correct`);
    }

    const positionBefore = await army.getCurrentPosition();
    const nextSettlementPosition = await userSettlementInstance2.position();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, nextSettlementPosition);

    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(nextSettlementPosition, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(nextSettlementPosition);

    //hidden maneuver to another settlement
    await army.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());
    const timeBefore = await EvmUtils.getCurrentTime();
    expect(await ArmyHelper.isArmyInHiddenManeuver(army)).to.be.true;

    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);
    const hiddenManeuverDuration = maneuverDuration / 2;

    await EvmUtils.increaseTime(hiddenManeuverDuration);

    const timeAfter = await EvmUtils.getCurrentTime();
    const passedTime = timeAfter - timeBefore;

    const unassignedWorkersBefore = await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance1);
    const prosperityBalanceBefore = await ProsperityHelper.getProsperityBalance(userSettlementInstance1);

    await army.cancelSecretManeuver().then((tx) => tx.wait());

    const armyUnitsAfter = await UnitHelper.getUnitsQuantity(await army.getAddress(), [unitType]);
    for (let i = 0; i < [unitType].length; i++) {
      expect(armyUnitsAfter[[unitType][i]]).eql(new BigNumber(0), `Army ${[unitType][i]} quantity in battle is not correct`);
    }

    if (unitType === UnitType.WARRIOR) {
      const workersForUnitLiquidation = toLowBN(await registryInstance.getWorkersForUnitLiquidation(unitTypeId));
      const expectedUnassignedWorkers = unassignedWorkersBefore.plus((workersForUnitLiquidation).multipliedBy(unitQuantity));

      const actualUnassignedWorkers = await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance1);
      expect(actualUnassignedWorkers).eql(expectedUnassignedWorkers, 'Unassigned worker quantity is not correct');
    } else {
      const prosperityForDemilitarization = toLowBN(await registryInstance.getProsperityForUnitLiquidation(unitTypeId));
      const expectedProsperityBalance = prosperityBalanceBefore.plus((prosperityForDemilitarization).multipliedBy(unitQuantity));

      const actualProsperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance1);
      expect(actualProsperityBalance).eql(expectedProsperityBalance, 'Prosperity balance is not correct');
    }

    const actualArmyPosition = await army.getCurrentPosition();
    expect(actualArmyPosition).eql(positionBefore, 'Army position is not correct');

    const stunDurationMultiplierOfCancelledSecretManeuver = toLowBN(await registryInstance.getStunDurationMultiplierOfCancelledSecretManeuver());
    const expectedStunDuration = stunDurationMultiplierOfCancelledSecretManeuver.multipliedBy(passedTime);

    const actualStunDuration = await ArmyHelper.getStunDuration(army);
    expect(actualStunDuration).eql(expectedStunDuration.integerValue(BigNumber.ROUND_CEIL), 'Stun duration is not correct');
  }

  public static async cancelHiddenManeuverByEraChangeTest(unitType: UnitType) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 4;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const worldInstance = await WorldHelper.getWorldInstance();

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, [unitType], unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, [unitType], unitQuantity);

    const eraNumberBefore = await WorldHelper.getCurrentEraNumber();
    const armyUnitsBefore = await UnitHelper.getUnitsQuantity(await army.getAddress(), [unitType]);

    for (let i = 0; i < [unitType].length; i++) {
      expect(armyUnitsBefore[[unitType][i]]).not.eql(new BigNumber(0), `Army ${[unitType][i]} quantity in battle is not correct`);
    }

    const nextSettlementPosition = await userSettlementInstance2.position();

    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(nextSettlementPosition, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(nextSettlementPosition);

    //hidden maneuver to another settlement
    await army.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());

    await CultistsHelper.summonEnoughCultistsForWipeInCurrentSettlementRegion(userSettlementInstance1);

    expect(await ArmyHelper.isArmyInHiddenManeuver(army)).to.be.true;

    expect(await CultistsHelper.isWipePossible()).to.be.true;
    await WorldHelper.passToEraDestructionInterval();
    await worldInstance.destroyCurrentEra().then((tx) => tx.wait());

    const eraNumberAfter = await WorldHelper.getCurrentEraNumber();
    const armyUnitsAfter = await UnitHelper.getUnitsQuantity(await army.getAddress(), [unitType]);

    expect(toBN(eraNumberAfter)).eql(toBN(eraNumberBefore).plus(1), 'Era number is not correct');

    for (let i = 0; i < [unitType].length; i++) {
      expect(armyUnitsAfter[[unitType][i]]).eql(new BigNumber(0), `Army ${[unitType][i]} quantity in battle is not correct`);
    }
  }

  public static async impossibleCancelHiddenManeuverByAnotherUserTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 4;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const positionBefore = await army.getCurrentPosition();
    const nextSettlementPosition = await userSettlementInstance2.position();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, nextSettlementPosition);

    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(nextSettlementPosition, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(nextSettlementPosition);

    //hidden maneuver to another settlement
    await army.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army)).to.be.true;

    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);
    await EvmUtils.increaseTime(maneuverDuration);

    const armyFromAnotherUser = await SettlementHelper.getArmy(userSettlementInstance1, testUser2);

    await expect(
        armyFromAnotherUser.cancelSecretManeuver().then((tx) => tx.wait())
    ).to.be.revertedWith("OnlyRulerOrWorldAssetFromSameEra()");
  }

  public static async impossibleCancelHiddenManeuverDuringStunTest() {
    const { testUser1, testUser3 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity1 = 4;
    const unitQuantity3 = 1;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance3 = await UserHelper.getUserSettlementByNumber(testUser3, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army3 = await SettlementHelper.getArmy(userSettlementInstance3);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity1)).to.be.true;
    expect(await UnitHelper.isHirePossible(army3, unitTypes, unitQuantity3)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity1);
    await UnitHelper.hireUnits(army3, unitTypes, unitQuantity3);

    const userSettlementPosition1 = await userSettlementInstance1.position();
    const userSettlementPosition3 = await userSettlementInstance3.position();

    const positionBefore = await army1.getCurrentPosition();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, userSettlementPosition3);

    //army 3 maneuver to testUser1 settlement
    await MovementHelper.moveArmy(army3, userSettlementPosition1, 0, true);

    //army 1 hidden maneuver to testUser3 settlement
    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(userSettlementPosition3, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(userSettlementPosition3);

    await army1.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army1)).to.be.true;

    const minHiddenManeuverDuration = MovementHelper.getManeuverDurationByDistance(Math.sqrt(distanceBetweenPositions));

    await EvmUtils.increaseTime(Math.ceil(minHiddenManeuverDuration));

    await army3.beginBattle(
        await army1.getAddress(),
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity1)))
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army3.battle(), army3.runner);

    const battleDuration = await BattleHelper.getBattleDuration(battleInstance);
    await EvmUtils.increaseTime(battleDuration);

    await battleInstance.endBattle().then((tx) => tx.wait());
    await army1.updateState().then((tx) => tx.wait());

    await expect(
        army1.cancelSecretManeuver().then((tx) => tx.wait())
    ).to.be.revertedWith("ArmyIsStunned()");
  }

  public static async impossibleCancelHiddenManeuverDuringBattleTest() {
    const { testUser1, testUser3 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity1 = 4;
    const unitQuantity3 = 1;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance3 = await UserHelper.getUserSettlementByNumber(testUser3, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army3 = await SettlementHelper.getArmy(userSettlementInstance3);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity1)).to.be.true;
    expect(await UnitHelper.isHirePossible(army3, unitTypes, unitQuantity3)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity1);
    await UnitHelper.hireUnits(army3, unitTypes, unitQuantity3);

    const userSettlementPosition1 = await userSettlementInstance1.position();
    const userSettlementPosition3 = await userSettlementInstance3.position();

    const positionBefore = await army1.getCurrentPosition();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, userSettlementPosition3);

    //army 3 maneuver to testUser1 settlement
    await MovementHelper.moveArmy(army3, userSettlementPosition1, 0, true);

    //army 1 hidden maneuver to testUser3 settlement
    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(userSettlementPosition3, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(userSettlementPosition3);

    await army1.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army1)).to.be.true;

    const minHiddenManeuverDuration = MovementHelper.getManeuverDurationByDistance(Math.sqrt(distanceBetweenPositions));

    await EvmUtils.increaseTime(Math.ceil(minHiddenManeuverDuration));

    await army3.beginBattle(
        await army1.getAddress(),
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity1)))
    ).then((tx) => tx.wait());

    await expect(
        army1.cancelSecretManeuver().then((tx) => tx.wait())
    ).to.be.revertedWith("ArmyIsInBattle()");
  }

  public static async maneuverSpeedUpFromCultistsSettlementTest() {
    const { testUser1 } = await getNamedAccounts();

    const unitQuantity = 1;
    const buildingType = BuildingType.FARM;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

    const army = await SettlementHelper.getArmy(userSettlementInstance);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);
    const cultistsSettlementInstance = await UnitHelper.getCultistsSettlementInstance(regionInstance);

    const positionBefore = await army.getCurrentPosition();
    const nextSettlementPosition = await cultistsSettlementInstance.position();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, nextSettlementPosition);
    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);

    await MovementHelper.moveArmy(army, nextSettlementPosition, 0, true);

    const cultistsAmount = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistsAmount).eql(new BigNumber(0), 'Cultists amount is not correct');

    const buildingTreasuryAmountBefore = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);

    const resourceAmountForSpeedUp = await MovementHelper.getResourceAmountForSpeedUp(
        army,
        distanceBetweenPositions,
        new BigNumber(1)
    );

    await army.beginOpenManeuver(
        positionBefore,
        transferableFromLowBN(resourceAmountForSpeedUp)
    ).then((tx) => tx.wait());

    const maneuverDurationWithMaxSpeedUp = MovementHelper.getManeuverDurationByDistance(Math.sqrt(distanceBetweenPositions));
    const actualManeuverDurationWithSpeedUp = await ArmyHelper.getManeuverDuration(army);

    await EvmUtils.increaseTime(actualManeuverDurationWithSpeedUp);

    expect(actualManeuverDurationWithSpeedUp).lt(maneuverDuration, 'Maneuver duration is not correct');
    expect(actualManeuverDurationWithSpeedUp)
        .eql(Math.ceil(maneuverDurationWithMaxSpeedUp), 'Maneuver duration is not correct');

    const buildingTreasuryAmountAfter = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);
    expect(buildingTreasuryAmountAfter).eql(buildingTreasuryAmountBefore, 'Building treasury amount is not correct');

    const actualArmyPosition = await army.getCurrentPosition();
    expect(actualArmyPosition).eql(positionBefore, 'Army position is not correct');
  }

  public static async revealHiddenManeuverWithSpeedUpFromCultistsSettlementTest() {
    const { testUser1 } = await getNamedAccounts();

    const unitQuantity = 1;
    const buildingType = BuildingType.LUMBERMILL;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

    const army = await SettlementHelper.getArmy(userSettlementInstance);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);
    const cultistsSettlementInstance = await UnitHelper.getCultistsSettlementInstance(regionInstance);

    const positionBefore = await army.getCurrentPosition();
    const nextSettlementPosition = await cultistsSettlementInstance.position();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, nextSettlementPosition);
    const maneuverDuration = MovementHelper.getManeuverDurationByDistance(distanceBetweenPositions);

    await MovementHelper.moveArmy(army, nextSettlementPosition, 0, true);

    const cultistsAmount = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistsAmount).eql(new BigNumber(0), 'Cultists amount is not correct');

    const revealKey = MovementHelper.getRevealKey();
    const secretDestinationPosition = MovementHelper.getSecretDestinationPosition(positionBefore, revealKey);
    const secretDestinationRegionId = await RegionHelper.getRegionIdByPosition(positionBefore);

    await army.beginSecretManeuver(
        secretDestinationRegionId,
        secretDestinationPosition
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army)).to.be.true;

    const minHiddenManeuverDuration = MovementHelper.getManeuverDurationByDistance(Math.sqrt(distanceBetweenPositions));

    const timeBefore = await EvmUtils.getCurrentTime();
    await EvmUtils.increaseTime(Math.floor(minHiddenManeuverDuration));

    const resourceAmountForSpeedUp = await MovementHelper.getResourceAmountForSpeedUp(
        army,
        distanceBetweenPositions,
        new BigNumber(1)
    );
    const buildingTreasuryAmountBefore = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);

    await army.revealSecretManeuver(
        positionBefore,
        revealKey,
        transferableFromLowBN(resourceAmountForSpeedUp)
    ).then((tx) => tx.wait());
    expect(await ArmyHelper.isArmyInHiddenManeuver(army)).to.be.false;

    const maneuverDurationWithMaxSpeedUp = MovementHelper.getManeuverDurationByDistance(Math.sqrt(distanceBetweenPositions));
    const actualManeuverDurationWithSpeedUp = await ArmyHelper.getManeuverDuration(army);

    const buildingTreasuryAmountAfter = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance);
    expect(buildingTreasuryAmountAfter).eql(buildingTreasuryAmountBefore, 'Building treasury amount is not correct');

    const actualManeuverDuration = await ArmyHelper.getManeuverDuration(army);
    expect(actualManeuverDuration).lt(maneuverDuration, 'Maneuver duration is not correct');
    expect(new BigNumber(actualManeuverDurationWithSpeedUp))
        .isInCloseRangeWith(new BigNumber(maneuverDurationWithMaxSpeedUp)
            .integerValue(BigNumber.ROUND_CEIL), 'Maneuver duration is not correct');

    const timeAfter = await EvmUtils.getCurrentTime();
    const passedTime = timeAfter - timeBefore;

    await EvmUtils.increaseTime(actualManeuverDuration - passedTime);

    const actualArmyPosition = await army.getCurrentPosition();
    expect(actualArmyPosition).eql(positionBefore, 'Army position is not correct');
  }

  public static async impossibleManeuverSpeedUpFromCultistsSettlementTest() {
    const { testUser1 } = await getNamedAccounts();

    const unitQuantity = 1;
    const corruptionIndexAmount = 1000;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const army = await SettlementHelper.getArmy(userSettlementInstance);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);
    const cultistsSettlementInstance = await UnitHelper.getCultistsSettlementInstance(regionInstance);

    const positionBefore = await army.getCurrentPosition();
    const nextSettlementPosition = await cultistsSettlementInstance.position();
    const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(positionBefore, nextSettlementPosition);

    await MovementHelper.moveArmy(army, nextSettlementPosition, 0, true);

    //cultists summon
    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
    await EvmUtils.increaseTime(summonDelay);

    await regionInstance.updateState().then((tx) => tx.wait());

    const cultistsAmount = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistsAmount).gt(new BigNumber(0), 'Cultists amount is not correct');

    const resourceAmountForSpeedUp = await MovementHelper.getResourceAmountForSpeedUp(
        army,
        distanceBetweenPositions,
        new BigNumber(1)
    );

    await expect(
        army.beginOpenManeuver(
            positionBefore,
            transferableFromLowBN(resourceAmountForSpeedUp)
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("ArmyCannotAccelerateManeuverFromCultistsSettlementWithNonZeroCultistsArmy()");
  }
}
