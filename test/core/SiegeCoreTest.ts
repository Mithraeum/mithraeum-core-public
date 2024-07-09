import { ethers, getNamedAccounts } from "hardhat";
import { UnitHelper } from "../../shared/helpers/UnitHelper";
import { UserHelper } from "../../shared/helpers/UserHelper";
import {
  Battle__factory,
  Siege__factory
} from "../../typechain-types";
import { toBN, toLowBN, transferableFromLowBN } from "../../scripts/utils/const";
import BigNumber from "bignumber.js";
import { SettlementHelper } from "../../shared/helpers/SettlementHelper";
import { EvmUtils } from "../../shared/helpers/EvmUtils";
import { UnitType } from "../../shared/enums/unitType";
import { expect } from "chai";
import { ResourceHelper } from "../../shared/helpers/ResourceHelper";
import { MovementHelper } from "../../shared/helpers/MovementHelper";
import { FortHelper } from "../../shared/helpers/FortHelper";
import { BuildingType } from "../../shared/enums/buildingType";
import { ProductionHelper } from "../../shared/helpers/ProductionHelper";
import { BuildingHelper } from "../../shared/helpers/BuildingHelper";
import { WorldHelper } from "../../shared/helpers/WorldHelper";
import { BattleHelper } from "../../shared/helpers/BattleHelper";
import {ArmyHelper} from "../../shared/helpers/ArmyHelper";
import {WorkerHelper} from "../../shared/helpers/WorkerHelper";
import { ProsperityHelper } from '../../shared/helpers/ProsperityHelper';
import { RegionHelper } from '../../shared/helpers/RegionHelper';

export class SiegeCoreTest {
  public static async armyLiquidationDuringSiegeTest() {
    const { testUser1, testUser2, testUser3 } = await getNamedAccounts();
    const signer3 = await ethers.getSigner(testUser3);

    const unitQuantity = 2;
    const siegeUnitQuantity = unitQuantity / 2;

    const registryInstance = await WorldHelper.getRegistryInstance();

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const workersForUnitLiquidation = toLowBN(await registryInstance.getWorkersForUnitLiquidation(gameUnits[0]));
    let prosperityForUnitLiquidation = new BigNumber(0);
    for (let i = 1; i < gameUnits.length; i++) {
      prosperityForUnitLiquidation = prosperityForUnitLiquidation
          .plus(toLowBN(await registryInstance.getProsperityForUnitLiquidation(gameUnits[i])));
    }

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity)).to.be.true;
    expect(await UnitHelper.isHirePossible(army2, unitTypes, unitQuantity)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity);
    await UnitHelper.hireUnits(army2, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army1, await userSettlementInstance2.position(), 0, true);

    await army1.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(1))
    ).then((tx) => tx.wait());

    const siegeInstance = Siege__factory.connect(await ArmyHelper.getSiegeAddressOnArmyPosition(army1), signer3);

    const armyUnitsBefore = await UnitHelper.getUnitsQuantity(await army1.getAddress(), unitTypes);
    const siegeArmyUnitsBefore = await UnitHelper.getUnitsQuantity(await siegeInstance.getAddress(), unitTypes);
    for (let i = 0; i < unitTypes.length; i++) {
      expect(armyUnitsBefore[unitTypes[i]])
          .not.eql(new BigNumber(0), `Army ${unitTypes[i]} quantity in battle is not correct`);
      expect(siegeArmyUnitsBefore[unitTypes[i]])
          .not.eql(new BigNumber(0), `Army ${unitTypes[i]} quantity in siege is not correct`);
    }
    expect(await siegeInstance.canLiquidateArmyBesiegingUnits(await army1.getAddress())).to.be.false;

    await army2.beginBattle(
      await army1.getAddress(),
      unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
      unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity)))
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army2.battle(), army2.runner);

    const actualBattleDuration = await BattleHelper.getBattleDuration(battleInstance);
    await EvmUtils.increaseTime(actualBattleDuration);

    await battleInstance.endBattle().then((tx) => tx.wait());

    await army1.updateState().then((tx) => tx.wait());
    await army2.updateState().then((tx) => tx.wait());

    const armyUnitsBeforeLiquidation = await UnitHelper.getUnitsQuantity(await army1.getAddress(), unitTypes);
    const siegeArmyUnitsBeforeLiquidation = await UnitHelper.getUnitsQuantity(await siegeInstance.getAddress(), unitTypes);
    for (let i = 0; i < unitTypes.length; i++) {
      expect(armyUnitsBeforeLiquidation[unitTypes[i]])
          .eql(new BigNumber(0), `Army ${unitTypes[i]} quantity in battle is not correct`);
      expect(siegeArmyUnitsBeforeLiquidation[unitTypes[i]])
          .not.eql(new BigNumber(0), `Army ${unitTypes[i]} quantity in siege is not correct`);
    }
    expect(await siegeInstance.canLiquidateArmyBesiegingUnits(await army1.getAddress())).to.be.true;

    const unassignedWorkersBefore =  await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance2);
    const prosperityBalanceBefore = await ProsperityHelper.getProsperityBalance(userSettlementInstance2);

    await siegeInstance.liquidate(await army1.getAddress()).then((tx) => tx.wait());

    const armyUnitsAfterLiquidation = await UnitHelper.getUnitsQuantity(await army1.getAddress(), unitTypes);
    const siegeArmyUnitsAfterLiquidation = await UnitHelper.getUnitsQuantity(await siegeInstance.getAddress(), unitTypes);
    for (let i = 0; i < unitTypes.length; i++) {
      expect(armyUnitsAfterLiquidation[unitTypes[i]])
          .eql(new BigNumber(0), `Army ${unitTypes[i]} quantity in battle is not correct`);
      expect(siegeArmyUnitsAfterLiquidation[unitTypes[i]])
          .eql(new BigNumber(0), `Army ${unitTypes[i]} quantity in siege is not correct`);
    }

    const unassignedWorkersAfter =  await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance2);
    const prosperityBalanceAfter = await ProsperityHelper.getProsperityBalance(userSettlementInstance2);

    expect(unassignedWorkersAfter)
        .eql(unassignedWorkersBefore.plus(workersForUnitLiquidation
            .multipliedBy(siegeUnitQuantity)), `Unassigned worker quantity is not correct`);
    expect(prosperityBalanceAfter)
        .eql(prosperityBalanceBefore.plus(prosperityForUnitLiquidation
            .multipliedBy(siegeUnitQuantity)), `Prosperity balance is not correct`);
  }

  public static async impossibleSiegeDuringStunTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 4;
    const siegeUnitQuantity = unitQuantity / 2;
    const unitTypes = [UnitType.WARRIOR];

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, false);

    await expect(
        army.modifySiege(
            unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
            unitTypes.map(_ => true),
            unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
            transferableFromLowBN(new BigNumber(1))
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("ArmyIsStunned()");
  }

  public static async robberyTest(buildingType: BuildingType, exchangePoints: number, robberyMultiplier: number, isBuildingUpgraded: boolean) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 8;
    const siegeUnitQuantity = 5;
    const assignResourceQuantity = 100;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const buildingInstance1 = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance1, buildingType);
    const buildingInstance2 = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance2, buildingType);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const maxAllowedRobberyMultiplierIncreaseValue = toLowBN(await registryInstance.getMaxAllowedRobberyMultiplierIncreaseValue());

    const productionConfig = await buildingInstance1.getConfig();
    const spendingResourceConfigs = productionConfig.filter(config => !config.isProducing);
    const producingResourceConfig = productionConfig.find(config => config.isProducing);
    const producingResourceTypeId = producingResourceConfig!.resourceTypeId;
    const producingResourceType = ResourceHelper.getResourceTypeByResourceTypeId(producingResourceTypeId);
    expect(producingResourceConfig).to.exist;

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    await userSettlementInstance2.assignResourcesAndWorkersToBuilding(
      ethers.ZeroAddress,
      await buildingInstance2.getAddress(),
      transferableFromLowBN(new BigNumber(1)),
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    expect(new BigNumber(robberyMultiplier))
        .lte(maxAllowedRobberyMultiplierIncreaseValue, 'Robbery multiplier is not correct');

    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(robberyMultiplier))
    ).then((tx) => tx.wait());

    const siegeInstance = Siege__factory.connect(await ArmyHelper.getSiegeAddressOnArmyPosition(army), army.runner);

    const fort = await SettlementHelper.getFort(userSettlementInstance2);
    const fortDestructionTime = await FortHelper.getSettlementFortDestructionTime(userSettlementInstance2);
    const armyStunDuration = await ArmyHelper.getStunDuration(army);

    await EvmUtils.increaseTime(fortDestructionTime);

    await fort.updateState().then((tx) => tx.wait());

    const fortHealth = toLowBN(await fort.health());
    expect(fortHealth).eql(new BigNumber(0), 'Fort health is not correct');

    const robberyPointsRegenerationTime = await FortHelper.getSettlementFortRobberyPointsRegenerationTime(
        userSettlementInstance2,
        new BigNumber(exchangePoints)
    );

    fortDestructionTime + robberyPointsRegenerationTime > armyStunDuration.toNumber()
        ?   await EvmUtils.increaseTime(robberyPointsRegenerationTime)
        :   await EvmUtils.increaseTime(armyStunDuration.toNumber() - fortDestructionTime);

    await buildingInstance2.updateState().then((tx) => tx.wait());

    const robberyPointsBefore = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));
    const buildingTreasuryAmountBefore1 = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance1);
    const buildingTreasuryAmountBefore2 = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance2);

    const exchangedPoints = exchangePoints > buildingTreasuryAmountBefore2.toNumber() ? buildingTreasuryAmountBefore2 : exchangePoints;
    const expectedRobberyPoints = robberyPointsBefore.minus(exchangedPoints);

    if (isBuildingUpgraded) {
      await BuildingHelper.upgradeBuildingToSpecifiedLevel(buildingInstance1, 5, true);
    }

    const user1ResourceBefore = await ResourceHelper.getResourceQuantity(testUser1, producingResourceType);

    await army.swapRobberyPointsForResourceFromBuildingTreasury(
        await buildingInstance2.getAddress(),
        transferableFromLowBN(new BigNumber(exchangePoints))
    ).then((tx) => tx.wait());

    const actualRobberyPoints = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));
    const actualBuildingTreasuryAmount1 = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance1);
    const actualBuildingTreasuryAmount2 = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance2);
    const actualUser1Resource = await ResourceHelper.getResourceQuantity(testUser1, producingResourceType);

    expect(actualRobberyPoints).isInCloseRangeWith(expectedRobberyPoints, 'Robbery points quantity is not correct');
    expect(actualBuildingTreasuryAmount2).isInCloseRangeWith(buildingTreasuryAmountBefore2.minus(
        exchangedPoints), 'User 2 building treasury quantity is not correct');
    expect(actualUser1Resource).eql(user1ResourceBefore, 'User 1 resource quantity is not correct');

    isBuildingUpgraded
      ? expect(actualBuildingTreasuryAmount1).isInCloseRangeWith(buildingTreasuryAmountBefore1.plus(
            exchangedPoints), 'User 1 building treasury quantity is not correct')
      : expect(actualBuildingTreasuryAmount1).eql(buildingTreasuryAmountBefore1, 'User 1 building treasury quantity is not correct');

    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => false),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(robberyMultiplier))
    ).then((tx) => tx.wait());

    const robberyPointsAfterSiege = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));
    expect(robberyPointsAfterSiege).eql(new BigNumber(0), 'Robbery points quantity after siege is not correct');
  }

  public static async impossibleSiegeByWrongRobberyMultiplierTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 4;
    const siegeUnitQuantity = unitQuantity / 2;
    const robberyMultiplier = 4;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const maxAllowedRobberyMultiplierIncreaseValue = toLowBN(await registryInstance.getMaxAllowedRobberyMultiplierIncreaseValue());

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    expect(new BigNumber(robberyMultiplier))
        .gt(maxAllowedRobberyMultiplierIncreaseValue, 'Robbery multiplier is not correct');

    await expect(
        army.modifySiege(
            unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
            unitTypes.map(_ => true),
            unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
            transferableFromLowBN(new BigNumber(robberyMultiplier))
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("WrongRobberyMultiplierSpecified()");
  }

  public static async impossibleRobberyWithoutRobberyTokensTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 6;
    const siegeUnitQuantity = unitQuantity / 2;
    const assignResourceQuantity = 100;
    const exchangePoints = 10;
    const buildingType = BuildingType.SMITHY;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance2, buildingType);

    const productionConfig = await buildingInstance.getConfig();
    const spendingResourceConfigs = productionConfig.filter(config => !config.isProducing);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    await userSettlementInstance2.assignResourcesAndWorkersToBuilding(
      ethers.ZeroAddress,
      await buildingInstance.getAddress(),
      transferableFromLowBN(new BigNumber(1)),
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(1))
    ).then((tx) => tx.wait());

    const siegeInstance = Siege__factory.connect(await ArmyHelper.getSiegeAddressOnArmyPosition(army), army.runner);

    const fort = await SettlementHelper.getFort(userSettlementInstance2);
    const fortDestructionTime = await FortHelper.getSettlementFortDestructionTime(userSettlementInstance2);
    const armyStunDuration = await ArmyHelper.getStunDuration(army);

    fortDestructionTime > armyStunDuration.toNumber()
        ?   await EvmUtils.increaseTime(fortDestructionTime)
        :   await EvmUtils.increaseTime(armyStunDuration.toNumber());

    await fort.updateState().then((tx) => tx.wait());

    const fortHealth = toLowBN(await fort.health());
    expect(fortHealth).eql(new BigNumber(0), 'Fort health is not correct');

    await buildingInstance.updateState().then((tx) => tx.wait());

    const robberyPointsBefore = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));
    expect(robberyPointsBefore).lt(new BigNumber(exchangePoints), 'Robbery points quantity is not correct');

    await expect(
        army.swapRobberyPointsForResourceFromBuildingTreasury(
            await buildingInstance.getAddress(),
            transferableFromLowBN(new BigNumber(exchangePoints))
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("RobberyPointsSwapNotAllowedDueToWrongMaxPointsToSpendSpecified()");
  }

  public static async robberyWithPenaltyTest(buildingType: BuildingType) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 8;
    const siegeUnitQuantity = 5;
    const assignResourceQuantity = 100;
    const robberyMultiplier = 1;
    const robberyPointsRegenerationTime = 1000;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const buildingInstance1 = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance1, buildingType);
    const buildingInstance2 = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance2, buildingType);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const maxAllowedRobberyMultiplierIncreaseValue = toLowBN(await registryInstance.getMaxAllowedRobberyMultiplierIncreaseValue());

    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance1);

    const productionConfig = await buildingInstance1.getConfig();
    const spendingResourceConfigs = productionConfig.filter(config => !config.isProducing);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    await userSettlementInstance2.assignResourcesAndWorkersToBuilding(
        ethers.ZeroAddress,
        await buildingInstance2.getAddress(),
        transferableFromLowBN(new BigNumber(1)),
        spendingResourceConfigs.map((value) => value.resourceTypeId),
        spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    expect(new BigNumber(robberyMultiplier))
        .lte(maxAllowedRobberyMultiplierIncreaseValue, 'Robbery multiplier is not correct');

    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(robberyMultiplier))
    ).then((tx) => tx.wait());

    const siegeInstance = Siege__factory.connect(await ArmyHelper.getSiegeAddressOnArmyPosition(army), army.runner);

    const fort = await SettlementHelper.getFort(userSettlementInstance2);
    const fortDestructionTime = await FortHelper.getSettlementFortDestructionTime(userSettlementInstance2);
    const armyStunDuration = await ArmyHelper.getStunDuration(army);

    await EvmUtils.increaseTime(fortDestructionTime);

    await fort.updateState().then((tx) => tx.wait());

    const fortHealth = toLowBN(await fort.health());
    expect(fortHealth).eql(new BigNumber(0), 'Fort health is not correct');

    //robbery without penalty

    const robberyPointsWithoutPenaltyBefore = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));
    const buildingLastUpdateStateTimeWithoutPenaltyBefore = await EvmUtils.getCurrentTime();

    fortDestructionTime + robberyPointsRegenerationTime > armyStunDuration.toNumber()
        ?   await EvmUtils.increaseTime(robberyPointsRegenerationTime)
        :   await EvmUtils.increaseTime(armyStunDuration.toNumber() - fortDestructionTime);

    await buildingInstance2.updateState().then((tx) => tx.wait());

    const buildingLastUpdateStateTimeWithoutPenaltyAfter = await EvmUtils.getCurrentTime();
    const passedTimeWithoutPenalty = buildingLastUpdateStateTimeWithoutPenaltyAfter - buildingLastUpdateStateTimeWithoutPenaltyBefore;

    const robberyPointsWithoutPenaltyAfter = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));
    const robberyPointsDifferenceWithoutPenalty = robberyPointsWithoutPenaltyAfter.minus(robberyPointsWithoutPenaltyBefore);
    const robberyPointsRegenerationPerSecWithoutPenalty = robberyPointsDifferenceWithoutPenalty.dividedBy(passedTimeWithoutPenalty);

    await buildingInstance1.upgradeAdvancedProduction(ethers.ZeroAddress).then((tx) => tx.wait());

    const buildingTreasuryAmountWithoutPenaltyBefore1 = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance1);
    const buildingTreasuryAmountWithoutPenaltyBefore2 = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance2);

    await army.swapRobberyPointsForResourceFromBuildingTreasury(
        await buildingInstance2.getAddress(),
        transferableFromLowBN(robberyPointsDifferenceWithoutPenalty)
    ).then((tx) => tx.wait());

    const buildingTreasuryAmountWithoutPenaltyAfter1 = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance1);
    const buildingTreasuryAmountWithoutPenaltyAfter2 = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance2);

    expect(buildingTreasuryAmountWithoutPenaltyAfter1).isInCloseRangeWith(buildingTreasuryAmountWithoutPenaltyBefore1.plus(
        robberyPointsDifferenceWithoutPenalty), 'Building treasury amount is not correct');
    expect(buildingTreasuryAmountWithoutPenaltyAfter2).isInCloseRangeWith(buildingTreasuryAmountWithoutPenaltyBefore2.minus(
        robberyPointsDifferenceWithoutPenalty), 'Building treasury amount is not correct');

    //cultists summon
    const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
    await EvmUtils.increaseTime(summonDelay);

    await regionInstance.updateState().then((tx) => tx.wait());

    const actualSummonedCultists = await UnitHelper.getCultistQuantity(regionInstance);
    expect(actualSummonedCultists).gt(new BigNumber(0), 'Cultist amount is not correct');

    //robbery with penalty

    const robberyPointsWithPenaltyBefore = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));
    const buildingLastUpdateStateTimeWithPenaltyBefore = await EvmUtils.getCurrentTime();

    await EvmUtils.increaseTime(robberyPointsRegenerationTime);

    const buildingLastUpdateStateTimeWithPenaltyAfter = await EvmUtils.getCurrentTime();
    const passedTimeWithPenalty = buildingLastUpdateStateTimeWithPenaltyAfter - buildingLastUpdateStateTimeWithPenaltyBefore;

    const robberyPointsWithPenaltyAfter = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));
    const robberyPointsDifferenceWithPenalty = robberyPointsWithPenaltyAfter.minus(robberyPointsWithPenaltyBefore);
    const robberyPointsRegenerationPerSecWithPenalty = robberyPointsDifferenceWithPenalty.dividedBy(passedTimeWithPenalty);

    expect(robberyPointsRegenerationPerSecWithPenalty)
        .eql(robberyPointsRegenerationPerSecWithoutPenalty, 'Robbery points regeneration per second is not correct');

    await buildingInstance1.upgradeAdvancedProduction(ethers.ZeroAddress).then((tx) => tx.wait());

    const buildingTreasuryAmountWithPenaltyBefore1 = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance1);
    const buildingTreasuryAmountWithPenaltyBefore2 = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance2);

    await army.swapRobberyPointsForResourceFromBuildingTreasury(
        await buildingInstance2.getAddress(),
        transferableFromLowBN(robberyPointsDifferenceWithPenalty)
    ).then((tx) => tx.wait());

    const buildingTreasuryAmountWithPenaltyAfter1 = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance1);
    const buildingTreasuryAmountWithPenaltyAfter2 = await ResourceHelper.getBuildingTreasuryAmount(buildingInstance2);

    expect(buildingTreasuryAmountWithPenaltyAfter1).isInCloseRangeWith(buildingTreasuryAmountWithPenaltyBefore1.plus(
        robberyPointsDifferenceWithPenalty), 'Building treasury amount is not correct');
    expect(buildingTreasuryAmountWithPenaltyAfter2).isInCloseRangeWith(buildingTreasuryAmountWithPenaltyBefore2.minus(
        robberyPointsDifferenceWithPenalty), 'Building treasury amount is not correct');
  }

  public static async fortRepairmentTest() {
    const { testUser1 } = await getNamedAccounts();

    const assignWorkerQuantity = 2;
    const assignResourceQuantity = 100;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const fort = await SettlementHelper.getFort(userSettlementInstance);

    const productionConfig = await fort.getConfig();
    const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);

    const fortHealthBeforeRepairment = toLowBN(await fort.health());
    const expectedFortHealth = toLowBN(await fort.getMaxHealthOnLevel(await fort.getBuildingLevel()));
    expect(fortHealthBeforeRepairment).lt(expectedFortHealth, 'Fort health is not correct');

    const buildingLastUpdateStateTimeAfterSiege = toBN((await fort.productionInfo()).lastUpdateStateTime);

    await userSettlementInstance.assignResourcesAndWorkersToBuilding(
      ethers.ZeroAddress,
      await fort.getAddress(),
      transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    const assignedWorkers = toLowBN(await fort.getAssignedWorkers());

    const basicProductionPerTick = await ProductionHelper.getBasicProductionPerTick(userSettlementInstance, BuildingType.FORT);
    const advancedProductionPerTick = await ProductionHelper.getAdvancedProductionPerTick(
        userSettlementInstance,
        BuildingType.FORT,
        assignedWorkers.toNumber()
    );
    const totalProductionPerTick = advancedProductionPerTick.plus(basicProductionPerTick);

    const fortRepairmentTime = (expectedFortHealth.dividedBy(totalProductionPerTick)).integerValue(BigNumber.ROUND_CEIL);
    const buildingResourceBeforeRepairment = await ResourceHelper.getResourcesQuantity(
      await fort.getAddress(),
      spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
    );

    const buildingLastUpdateStateTimeBefore = toBN((await fort.productionInfo()).lastUpdateStateTime);

    await EvmUtils.increaseTime((fortRepairmentTime.dividedBy(2).integerValue(BigNumber.ROUND_CEIL)).toNumber());
    await fort.updateState().then((tx) => tx.wait());

    const buildingLastUpdateStateTimeAfter = toBN((await fort.productionInfo()).lastUpdateStateTime);

    const timePassed = buildingLastUpdateStateTimeAfter.minus(buildingLastUpdateStateTimeBefore);
    const timePassedFromSiege = buildingLastUpdateStateTimeAfter.minus(buildingLastUpdateStateTimeAfterSiege);
    const fortHealthAfterPassiveRepairment = fortHealthBeforeRepairment.plus(basicProductionPerTick.multipliedBy(timePassedFromSiege));
    const expectedFortHealthAfterRepairment = fortHealthAfterPassiveRepairment.plus(advancedProductionPerTick.multipliedBy(timePassed));

    const fortHealthAfterRepairment = toLowBN(await fort.health());
    expect(fortHealthAfterRepairment).isInCloseRangeWith(expectedFortHealthAfterRepairment, 'Fort health is not correct');

    await EvmUtils.increaseTime((fortRepairmentTime.dividedBy(2).integerValue(BigNumber.ROUND_CEIL)).toNumber());
    await fort.updateState().then((tx) => tx.wait());

    const actualFortHealth = toLowBN(await fort.health());
    const buildingResourceAfterRepairment = await ResourceHelper.getResourcesQuantity(
      await fort.getAddress(),
      spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
    );

    expect(actualFortHealth).eql(expectedFortHealth, 'Fort health is not correct');

    for (let i = 0; i < spendingResourceConfigs.length; i++) {
      const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(spendingResourceConfigs[i].resourceTypeId);

      expect(buildingResourceBeforeRepairment[resourceType]).to.be.above(
        buildingResourceAfterRepairment[resourceType]);
    }

    await EvmUtils.increaseTime(10);

    const actualBuildingResource = await ResourceHelper.getResourcesQuantity(
      await fort.getAddress(),
      spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
    );
    expect(actualBuildingResource).eql(buildingResourceAfterRepairment, 'Building resource quantity is not correct');
  }

  public static async fortDestructionTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 2;
    const siegeUnitQuantity = unitQuantity / 2;
    const robberyMultiplier = 1;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(robberyMultiplier))
    ).then((tx) => tx.wait());

    const fort = await SettlementHelper.getFort(userSettlementInstance2);

    const siegeInstance = Siege__factory.connect(await ArmyHelper.getSiegeAddressOnArmyPosition(army), army.runner);

    let expectedTotalSiegePowerPerTick = 0;
    for (let i = 0; i < unitTypes.length; i++) {
      const unitSiegePower = toLowBN((await UnitHelper.getUnitStats(unitTypes[i])).siegePower);
      expectedTotalSiegePowerPerTick += siegeUnitQuantity * unitSiegePower.toNumber() * robberyMultiplier;
    }

    const totalSiegePowerPerTick = toLowBN(await siegeInstance.totalSiegePower());
    expect(new BigNumber(expectedTotalSiegePowerPerTick))
        .eql(totalSiegePowerPerTick, 'Total siege power per second is not correct');

    const fortPassiveRegenerationPerTick = await ProductionHelper.getBasicProductionPerTick(userSettlementInstance2, BuildingType.FORT);

    const fortHealthBeforeSiege = toLowBN(await fort.health());
    const fortDestructionPerTick = totalSiegePowerPerTick.minus(fortPassiveRegenerationPerTick);
    const fortDestructionTime = (fortHealthBeforeSiege.dividedBy(fortDestructionPerTick)).integerValue(BigNumber.ROUND_CEIL);

    const buildingLastUpdateStateTimeBefore = toBN((await fort.productionInfo()).lastUpdateStateTime);

    await EvmUtils.increaseTime((fortDestructionTime.dividedBy(2).integerValue(BigNumber.ROUND_CEIL)).toNumber());
    await fort.updateState().then((tx) => tx.wait());

    const buildingLastUpdateStateTimeAfter = toBN((await fort.productionInfo()).lastUpdateStateTime);

    const timePassed = buildingLastUpdateStateTimeAfter.minus(buildingLastUpdateStateTimeBefore);

    const fortHealthAfterSiege = toLowBN(await fort.health());
    const robberyPointsDuringSiege = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));

    expect(fortHealthAfterSiege).eql(fortHealthBeforeSiege.minus(fortDestructionPerTick.multipliedBy(timePassed)));
    expect(robberyPointsDuringSiege).eql(new BigNumber(0), 'Robbery points amount is not correct');

    await EvmUtils.increaseTime((fortDestructionTime.dividedBy(2).integerValue(BigNumber.ROUND_CEIL)).toNumber());
    await fort.updateState().then((tx) => tx.wait());

    const actualFortHealth = toLowBN(await fort.health());
    const actualRobberyPoints = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));

    expect(actualFortHealth).eql(new BigNumber(0), 'Fort health is not correct');
    expect(actualRobberyPoints).to.be.above(new BigNumber(0), 'Robbery points amount is not correct');
  }

  public static async fortRepairmentDuringSiegeTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 2;
    const siegeUnitQuantity = unitQuantity / 2;
    const assignWorkerQuantity = 4;
    const assignResourceQuantity = 200;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(1))
    ).then((tx) => tx.wait());

    const fort = await SettlementHelper.getFort(userSettlementInstance2);

    const productionConfig = await fort.getConfig();
    const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);
    const producingResourceConfig = productionConfig.find((config) => config.isProducing);
    expect(producingResourceConfig).to.exist;

    const fortDestructionTime = await FortHelper.getSettlementFortDestructionTime(userSettlementInstance2);
    await EvmUtils.increaseTime(fortDestructionTime);

    await fort.updateState().then((tx) => tx.wait());

    const fortHealthAfterDestruction = toLowBN(await fort.health());
    expect(fortHealthAfterDestruction).eql(new BigNumber(0), 'Fort health is not correct');

    //fort repairment
    await userSettlementInstance2.assignResourcesAndWorkersToBuilding(
      ethers.ZeroAddress,
      await fort.getAddress(),
      transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    const assignedWorkers = toLowBN(await fort.getAssignedWorkers());

    const basicProductionPerTick = await ProductionHelper.getBasicProductionPerTick(userSettlementInstance2, BuildingType.FORT);
    const advancedProductionPerTick = await ProductionHelper.getAdvancedProductionPerTick(
        userSettlementInstance2,
        BuildingType.FORT,
        assignedWorkers.toNumber()
    );
    const totalProductionPerSecond = advancedProductionPerTick.plus(basicProductionPerTick);

    const siegeInstance = Siege__factory.connect(await ArmyHelper.getSiegeAddressOnArmyPosition(army), army.runner);

    const totalSiegePowerPerSecond = toLowBN(await siegeInstance.totalSiegePower());
    const realRegenerationPerSecond = totalProductionPerSecond.minus(totalSiegePowerPerSecond);

    const maxFortHealth = toLowBN(await fort.getMaxHealthOnLevel(await fort.getBuildingLevel()));
    const fortRepairmentTime = (maxFortHealth.dividedBy(realRegenerationPerSecond)).integerValue(BigNumber.ROUND_CEIL);

    //first half fort repairment
    const buildingResourceBeforeRepairment = await ResourceHelper.getResourcesStateBalanceOf(
      await fort.getAddress(),
      spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
    );

    const buildingLastUpdateStateTimeBeforeFirstHalfFortRepairment = toBN((await fort.productionInfo()).lastUpdateStateTime);
    await EvmUtils.increaseTime(fortRepairmentTime.dividedBy(2).integerValue(BigNumber.ROUND_CEIL).toNumber());
    await fort.updateState().then((tx) => tx.wait());

    const buildingLastUpdateStateTimeAfterFirstHalfFortRepairment = toBN((await fort.productionInfo()).lastUpdateStateTime);
    const timePassedDuringFirstHalfFortRepairment = buildingLastUpdateStateTimeAfterFirstHalfFortRepairment.minus(
        buildingLastUpdateStateTimeBeforeFirstHalfFortRepairment);

    const fortHealthAfterFirstHalfRepairment = toLowBN(await fort.health());
    expect(fortHealthAfterFirstHalfRepairment).eql(fortHealthAfterDestruction.plus(
        realRegenerationPerSecond.multipliedBy(timePassedDuringFirstHalfFortRepairment)), 'Fort health is not correct');

    //second half fort repairment
    await EvmUtils.increaseTime((fortRepairmentTime.minus(fortRepairmentTime.dividedBy(2)
        .integerValue(BigNumber.ROUND_CEIL))).toNumber());
    await fort.updateState().then((tx) => tx.wait());

    const fortHealthAfterRepairment = toLowBN(await fort.health());
    const buildingResourceAfterRepairment = await ResourceHelper.getResourcesStateBalanceOf(
      await fort.getAddress(),
      spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
    );

    expect(fortHealthAfterRepairment).eql(maxFortHealth, 'Fort health is not correct');

    for (let i = 0; i < spendingResourceConfigs.length; i++) {
      const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(spendingResourceConfigs[i].resourceTypeId);

      expect(buildingResourceBeforeRepairment[resourceType]).to.be.above(
        buildingResourceAfterRepairment[resourceType], 'Resource quantity is not correct');
    }

    const calculateProductionTicksAmount = BigNumber.min(
        ...spendingResourceConfigs.map(value => {
          const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId);
          return buildingResourceAfterRepairment[resourceType].dividedBy(toLowBN(value.amountPerTick));
        })
    );

    const toBeProducedValue = toLowBN(producingResourceConfig!.amountPerTick).multipliedBy(calculateProductionTicksAmount);
    const timeToResourcesGone = toBeProducedValue.dividedBy((totalSiegePowerPerSecond.minus(basicProductionPerTick)));

    //first half fort repairment with max health
    const buildingLastUpdateStateTimeBeforeFirstHalfFortRepairmentWithMaxHealth =
        toBN((await fort.productionInfo()).lastUpdateStateTime);
    const firstHalfRepairmentTime = (timeToResourcesGone.integerValue(BigNumber.ROUND_FLOOR).dividedBy(2))
        .integerValue(BigNumber.ROUND_FLOOR);
    await EvmUtils.increaseTime(firstHalfRepairmentTime.toNumber());

    await fort.updateState().then((tx) => tx.wait());

    const buildingLastUpdateStateTimeAfterFirstHalfFortRepairmentWithMaxHealth =
        toBN((await fort.productionInfo()).lastUpdateStateTime);
    const timePassedDuringFistHalfFortRepairmentWithMaxHealth = buildingLastUpdateStateTimeAfterFirstHalfFortRepairmentWithMaxHealth.minus(
        buildingLastUpdateStateTimeBeforeFirstHalfFortRepairmentWithMaxHealth);

    const ticksPerSecond = ((totalSiegePowerPerSecond.minus(basicProductionPerTick)).dividedBy(
        toLowBN(producingResourceConfig!.amountPerTick))).integerValue(BigNumber.ROUND_CEIL);
    const totalTicksThatHaveToBeProducedDuringFistHalfFortRepairmentWithMaxHealth = ticksPerSecond.multipliedBy(
        timePassedDuringFistHalfFortRepairmentWithMaxHealth);

    const buildingResourceAfterFirstHalfFortRepairmentWithMaxHealth = await ResourceHelper.getResourcesStateBalanceOf(
      await fort.getAddress(),
      spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
    );

    expect(fortHealthAfterRepairment).eql(maxFortHealth, 'Fort health is not correct');

    for (let i = 0; i < spendingResourceConfigs.length; i++) {
      const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(spendingResourceConfigs[i].resourceTypeId);
      expect(buildingResourceAfterFirstHalfFortRepairmentWithMaxHealth[resourceType]).eql(
          buildingResourceAfterRepairment[resourceType].minus(
              totalTicksThatHaveToBeProducedDuringFistHalfFortRepairmentWithMaxHealth
                  .multipliedBy(toLowBN(spendingResourceConfigs[i].amountPerTick))), 'Resource quantity is not correct');
    }

    //second half fort repairment with max health
    const secondHalfRepairmentTime = timeToResourcesGone.integerValue(BigNumber.ROUND_FLOOR).minus(firstHalfRepairmentTime);
    await EvmUtils.increaseTime(secondHalfRepairmentTime.toNumber());

    await fort.updateState().then((tx) => tx.wait());

    const timePassedDuringSecondHalfFortRepairmentWithMaxHealth = timeToResourcesGone.integerValue(
        BigNumber.ROUND_FLOOR).minus(timePassedDuringFistHalfFortRepairmentWithMaxHealth);
    const totalTicksThatHaveToBeProducedDuringSecondHalfFortRepairmentWithMaxHealth = ticksPerSecond.multipliedBy(
        timePassedDuringSecondHalfFortRepairmentWithMaxHealth);

    const buildingResourceAfterSecondHalfFortRepairmentWithMaxHealth = await ResourceHelper.getResourcesStateBalanceOf(
      await fort.getAddress(),
      spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
    );

    for (let i = 0; i < spendingResourceConfigs.length; i++) {
      const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(spendingResourceConfigs[i].resourceTypeId);
      expect(buildingResourceAfterSecondHalfFortRepairmentWithMaxHealth[resourceType]).isInCloseRangeWith(
          (buildingResourceAfterFirstHalfFortRepairmentWithMaxHealth[resourceType].minus(
              totalTicksThatHaveToBeProducedDuringSecondHalfFortRepairmentWithMaxHealth
                  .multipliedBy(toLowBN(spendingResourceConfigs[i].amountPerTick)))), 'Resource quantity is not correct');
    }

    //fort destruction after resources gone
    await EvmUtils.increaseTime(10);
    await fort.updateState().then((tx) => tx.wait());

    const actualBuildingResource = await ResourceHelper.getResourcesQuantity(
      await fort.getAddress(),
      spendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
    );

    const actualFortHealth = toLowBN(await fort.health());
    expect(actualFortHealth).to.be.below(maxFortHealth, 'Fort health is not correct');

    for (let i = 0; i < spendingResourceConfigs.length; i++) {
      const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(spendingResourceConfigs[i].resourceTypeId);
      expect(buildingResourceAfterSecondHalfFortRepairmentWithMaxHealth[resourceType])
          .eql(actualBuildingResource[resourceType], 'Resource quantity is not correct');
    }
  }

  public static async fortDestructionDuringRepairmentTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 4;
    const siegeUnitQuantity = unitQuantity / 2;
    const assignWorkerQuantity = 1;
    const assignResourceQuantity = 200;
    const fortHealth = 6;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    await FortHelper.repairFort(userSettlementInstance1, assignWorkerQuantity, new BigNumber(fortHealth));

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    const farm = await SettlementHelper.getFarm(userSettlementInstance2);

    const farmProductionConfig = await farm.getConfig();
    const farmSpendingResourceConfigs = farmProductionConfig.filter((config) => !config.isProducing);

    //testUser2 resource investment into farm
    await userSettlementInstance2.assignResourcesAndWorkersToBuilding(
      ethers.ZeroAddress,
      await farm.getAddress(),
      transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
      farmSpendingResourceConfigs.map((value) => value.resourceTypeId),
      farmSpendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity / 2)))
    ).then((tx) => tx.wait());

    const fort = await SettlementHelper.getFort(userSettlementInstance2);

    const fortProductionConfig = await fort.getConfig();
    const fortSpendingResourceConfigs = fortProductionConfig.filter((config) => !config.isProducing);
    const fortProducingResourceConfig = fortProductionConfig.find((config) => config.isProducing);
    expect(fortProducingResourceConfig).to.exist;

    const fortHealthBeforeRepairment = toLowBN(await fort.health());

    //fort repairment
    await userSettlementInstance2.assignResourcesAndWorkersToBuilding(
      ethers.ZeroAddress,
      await fort.getAddress(),
      transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
      fortSpendingResourceConfigs.map((value) => value.resourceTypeId),
      fortSpendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    const assignedWorkers = toLowBN(await fort.getAssignedWorkers());

    const basicProductionPerTick = await ProductionHelper.getBasicProductionPerTick(userSettlementInstance2, BuildingType.FORT);
    const advancedProductionPerTick = await ProductionHelper.getAdvancedProductionPerTick(
        userSettlementInstance2,
        BuildingType.FORT,
        assignedWorkers.toNumber()
    );
    const totalProductionPerTick = advancedProductionPerTick.plus(basicProductionPerTick);

    const maxFortHealth = toLowBN(await fort.getMaxHealthOnLevel(await fort.getBuildingLevel()));
    const fortRepairmentTime = ((maxFortHealth.minus(fortHealthBeforeRepairment)).dividedBy(totalProductionPerTick))
        .integerValue(BigNumber.ROUND_CEIL);
    await EvmUtils.increaseTime(fortRepairmentTime.toNumber());
    await fort.updateState().then((tx) => tx.wait());

    const fortHealthAfterRepairment = toLowBN(await fort.health());
    expect(fortHealthAfterRepairment).eql(maxFortHealth, 'Fort health is not correct');

    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(1))
    ).then((tx) => tx.wait());

    const siegeInstance = Siege__factory.connect(await ArmyHelper.getSiegeAddressOnArmyPosition(army), army.runner);

    const totalSiegePowerPerSecond = toLowBN(await siegeInstance.totalSiegePower());
    const realDestructionPerSecond = totalSiegePowerPerSecond.minus(totalProductionPerTick);
    const fortDestructionTime = (fortHealthAfterRepairment.dividedBy(realDestructionPerSecond))
        .integerValue(BigNumber.ROUND_CEIL);
    const stunDuration = await ArmyHelper.getStunDuration(army);

    const buildingResourceBeforeDestruction = await ResourceHelper.getResourcesStateBalanceOf(
      await fort.getAddress(),
      fortSpendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
    );

    //first half destruction
    const buildingLastUpdateStateTimeBeforeFirstHalfDestruction = toBN((await fort.productionInfo()).lastUpdateStateTime);
    await EvmUtils.increaseTime((fortDestructionTime.integerValue(BigNumber.ROUND_CEIL).dividedBy(2))
        .integerValue(BigNumber.ROUND_CEIL).toNumber());

    await fort.updateState().then((tx) => tx.wait());

    const buildingLastUpdateStateTimeAfterFirstHalfDestruction = toBN((await fort.productionInfo()).lastUpdateStateTime);
    const timePassedDuringFirstHalfDestruction = buildingLastUpdateStateTimeAfterFirstHalfDestruction
        .minus(buildingLastUpdateStateTimeBeforeFirstHalfDestruction);

    const fortHealthAfterFirstHalfDestruction = toLowBN(await fort.health());
    expect(fortHealthAfterFirstHalfDestruction)
        .eql(fortHealthAfterRepairment.minus(realDestructionPerSecond
            .multipliedBy(timePassedDuringFirstHalfDestruction)), 'Fort health is not correct');

    //second half fort destruction
    await EvmUtils.increaseTime((fortDestructionTime.minus(fortDestructionTime.dividedBy(2)
        .integerValue(BigNumber.ROUND_CEIL))).toNumber());
    await fort.updateState().then((tx) => tx.wait());

    const robberyPointsAfterSecondHalfDestruction = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));

    const fortHealthAfterSecondHalfDestruction = toLowBN(await fort.health());
    expect(fortHealthAfterSecondHalfDestruction).eql(new BigNumber(0), 'Fort health is not correct');

    const buildingLastUpdateStateTimeBeforeDestructionWithResource = toBN((await fort.productionInfo()).lastUpdateStateTime);
    await EvmUtils.increaseTime(((fortDestructionTime.dividedBy(50).integerValue(BigNumber.ROUND_CEIL))).toNumber());

    await fort.updateState().then((tx) => tx.wait());

    const buildingLastUpdateStateTimeAfterDestructionWithResource = toBN((await fort.productionInfo()).lastUpdateStateTime);
    const timePassedDuringDestructionWithResource = buildingLastUpdateStateTimeAfterDestructionWithResource.minus(
        buildingLastUpdateStateTimeBeforeDestructionWithResource);

    const robberyPointsAfterDestructionWithResource = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));
    const robberyPointsRegenPerSecondWithResource = (robberyPointsAfterDestructionWithResource.minus(
        robberyPointsAfterSecondHalfDestruction)).dividedBy(timePassedDuringDestructionWithResource);

    const buildingResourceAfterDestruction = await ResourceHelper.getResourcesStateBalanceOf(
      await fort.getAddress(),
      fortSpendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
    );

    for (let i = 0; i < fortSpendingResourceConfigs.length; i++) {
      const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(fortSpendingResourceConfigs[i].resourceTypeId);

      expect(buildingResourceBeforeDestruction[resourceType]).to.be.above(
        buildingResourceAfterDestruction[resourceType], 'Resource quantity is not correct');
    }

    const calculateProductionTicksAmount = BigNumber.min(
        ...fortSpendingResourceConfigs.map(value => {
          const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId);
          return buildingResourceAfterDestruction[resourceType].dividedBy(toLowBN(value.amountPerTick));
        })
    );

    const toBeProducedValue = toLowBN(fortProducingResourceConfig!.amountPerTick).multipliedBy(calculateProductionTicksAmount);
    const timeToResourcesGone = toBeProducedValue.dividedBy(advancedProductionPerTick);

    //first half fort destruction with no health
    const buildingLastUpdateStateTimeBeforeFirstHalfFortRepairmentWithNoHealth =
        toBN((await fort.productionInfo()).lastUpdateStateTime);
    const firstHalfDestructionTime = (timeToResourcesGone.integerValue(BigNumber.ROUND_FLOOR).dividedBy(2))
        .integerValue(BigNumber.ROUND_CEIL);
    await EvmUtils.increaseTime(firstHalfDestructionTime.toNumber());

    await fort.updateState().then((tx) => tx.wait());

    const buildingLastUpdateStateTimeAfterFirstHalfFortRepairmentWithNoHealth =
        toBN((await fort.productionInfo()).lastUpdateStateTime);
    const timePassedDuringFistHalfFortRepairmentWithNoHealth = buildingLastUpdateStateTimeAfterFirstHalfFortRepairmentWithNoHealth.minus(
        buildingLastUpdateStateTimeBeforeFirstHalfFortRepairmentWithNoHealth);

    const ticksPerSecond = (advancedProductionPerTick.dividedBy(toLowBN(fortProducingResourceConfig!.amountPerTick)))
        .integerValue(BigNumber.ROUND_CEIL);
    const totalTicksThatHaveToBeProducedDuringFistHalfFortRepairmentWithNoHealth = ticksPerSecond.multipliedBy(
        timePassedDuringFistHalfFortRepairmentWithNoHealth);

    const buildingResourceAfterFirstHalfFortDestructionWithNoHealth = await ResourceHelper.getResourcesStateBalanceOf(
      await fort.getAddress(),
      fortSpendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
    );

    const fortHealthAfterFirstHalfDestructionWithNoHealth = toLowBN(await fort.health());
    expect(fortHealthAfterFirstHalfDestructionWithNoHealth).eql(new BigNumber(0), 'Fort health is not correct');

    for (let i = 0; i < fortSpendingResourceConfigs.length; i++) {
      const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(fortSpendingResourceConfigs[i].resourceTypeId);
      expect(buildingResourceAfterFirstHalfFortDestructionWithNoHealth[resourceType]).eql(
          buildingResourceAfterDestruction[resourceType].minus(
              totalTicksThatHaveToBeProducedDuringFistHalfFortRepairmentWithNoHealth
                  .multipliedBy(toLowBN(fortSpendingResourceConfigs[i].amountPerTick))), 'Resource quantity is not correct');
    }

    //second half fort destruction with no health
    const secondHalfDestructionTime = timeToResourcesGone.integerValue(BigNumber.ROUND_FLOOR).minus(firstHalfDestructionTime);

    fortDestructionTime.toNumber() + firstHalfDestructionTime.toNumber() + secondHalfDestructionTime.toNumber() > stunDuration.toNumber()
      ? await EvmUtils.increaseTime(secondHalfDestructionTime.toNumber())
      : await EvmUtils.increaseTime(stunDuration.toNumber() - fortDestructionTime.toNumber() - firstHalfDestructionTime.toNumber());

    await fort.updateState().then((tx) => tx.wait());

    const timePassedDuringSecondHalfFortRepairmentWithNoHealth = timeToResourcesGone.integerValue(BigNumber.ROUND_FLOOR).minus(
        timePassedDuringFistHalfFortRepairmentWithNoHealth);
    const totalTicksThatHaveToBeProducedDuringSecondHalfFortRepairmentWithNoHealth = ticksPerSecond.multipliedBy(
        timePassedDuringSecondHalfFortRepairmentWithNoHealth);

    const buildingResourceAfterSecondHalfFortRepairmentWithNoHealth = await ResourceHelper.getResourcesStateBalanceOf(
      await fort.getAddress(),
      fortSpendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
    );

    const fortHealthAfterSecondHalfDestructionWithNoHealth = toLowBN(await fort.health());
    expect(fortHealthAfterSecondHalfDestructionWithNoHealth).eql(new BigNumber(0), 'Fort health is not correct');

    for (let i = 0; i < fortSpendingResourceConfigs.length; i++) {
      const resourceType = ResourceHelper.getResourceTypeByResourceTypeId(fortSpendingResourceConfigs[i].resourceTypeId);
      expect(buildingResourceAfterSecondHalfFortRepairmentWithNoHealth[resourceType]).eql(
          buildingResourceAfterFirstHalfFortDestructionWithNoHealth[resourceType]
              .minus(totalTicksThatHaveToBeProducedDuringSecondHalfFortRepairmentWithNoHealth
                  .multipliedBy(toLowBN(fortSpendingResourceConfigs[i].amountPerTick))), 'Resource quantity is not correct');
    }

    //tokens spending
    await army.swapRobberyPointsForResourceFromBuildingTreasury(
        await farm.getAddress(),
        transferableFromLowBN(new BigNumber(10))
    ).then((tx) => tx.wait());

    const robberyPointsAfterClaimResources = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));

    //fort destruction after resources gone
    const buildingLastUpdateStateTimeBeforeDestructionWithNoResource = toBN((await fort.productionInfo()).lastUpdateStateTime);
    await EvmUtils.increaseTime(10);

    await fort.updateState().then((tx) => tx.wait());

    const buildingLastUpdateStateTimeAfterDestructionWithNoResource = toBN((await fort.productionInfo()).lastUpdateStateTime);
    const timePassedDuringDestructionWithNoResource = buildingLastUpdateStateTimeAfterDestructionWithNoResource.minus(
        buildingLastUpdateStateTimeBeforeDestructionWithNoResource);

    const actualRobberyPoints = toLowBN(await siegeInstance.getArmyRobberyPoints(await army.getAddress(), 0));
    const robberyPointsRegenPerSecondWithNoResource = (actualRobberyPoints.minus(robberyPointsAfterClaimResources))
        .dividedBy(timePassedDuringDestructionWithNoResource);
    expect(robberyPointsRegenPerSecondWithNoResource)
        .gt(robberyPointsRegenPerSecondWithResource, 'Robbery points regeneration per second is not correct');

    const actualBuildingResource = await ResourceHelper.getResourcesQuantity(
      await fort.getAddress(),
      fortSpendingResourceConfigs.map((value) => ResourceHelper.getResourceTypeByResourceTypeId(value.resourceTypeId))
    );

    const actualFortHealth = toLowBN(await fort.health());
    expect(actualFortHealth).eql(new BigNumber(0), 'Fort health is not correct');

    for (let i = 0; i < fortSpendingResourceConfigs.length; i++) {
      const resourceType = fortSpendingResourceConfigs[i].resourceTypeId;
      expect(buildingResourceAfterSecondHalfFortRepairmentWithNoHealth[resourceType])
          .eql(actualBuildingResource[resourceType], 'Resource quantity is not correct');
    }
  }

  public static async fortRepairmentWithSummonedCultistsTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 6;
    const siegeUnitQuantity = unitQuantity / 2;
    const unitTypes = [UnitType.WARRIOR];
    const assignWorkerQuantity = 3;
    const assignResourceQuantity = 100;
    const fortRepairmentTime = 50000;
    const corruptionIndexAmount = 10000;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const fort = await SettlementHelper.getFort(userSettlementInstance2);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance2);

    const productionConfig = await fort.getConfig();
    const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    //fort destruction
    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(1))
    ).then((tx) => tx.wait());

    const fortDestructionTime = await FortHelper.getSettlementFortDestructionTime(userSettlementInstance2);
    await EvmUtils.increaseTime(fortDestructionTime);

    await fort.updateState().then((tx) => tx.wait());

    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => false),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(1))
    ).then((tx) => tx.wait());

    const fortHealthBefore = toLowBN(await fort.health());

    await userSettlementInstance2.assignResourcesAndWorkersToBuilding(
      ethers.ZeroAddress,
      await fort.getAddress(),
      transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    const buildingLastUpdateStateTimeBefore = toBN((await fort.productionInfo()).lastUpdateStateTime);

    await EvmUtils.increaseTime(fortRepairmentTime);

    await fort.removeResourcesAndWorkers(
      await userSettlementInstance2.getAddress(),
      transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
      testUser2,
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    await fort.updateState().then((tx) => tx.wait());

    const buildingLastUpdateStateTimeAfter = toBN((await fort.productionInfo()).lastUpdateStateTime);
    const timePassed = buildingLastUpdateStateTimeAfter.minus(buildingLastUpdateStateTimeBefore);

    const fortHealthAfter = toLowBN(await fort.health());
    const regenerationPerSecond = (fortHealthAfter.minus(fortHealthBefore)).dividedBy(timePassed);

    //corruptionIndex increase
    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance1,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    //cultists summon
    const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
    await EvmUtils.increaseTime(summonDelay);

    await regionInstance.updateState().then((tx) => tx.wait());

    const cultistUnitAmount = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistUnitAmount).gt(new BigNumber(0), 'Cultist amount is not correct');

    //fort destruction
    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(1))
    ).then((tx) => tx.wait());

    const fortDestructionTimeWithSummonedCultists = await FortHelper.getSettlementFortDestructionTime(userSettlementInstance2);
    await EvmUtils.increaseTime(fortDestructionTimeWithSummonedCultists);

    await fort.updateState().then((tx) => tx.wait());

    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => false),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(1))
    ).then((tx) => tx.wait());

    const fortHealthWithSummonedCultists = toLowBN(await fort.health());

    await userSettlementInstance2.assignResourcesAndWorkersToBuilding(
      ethers.ZeroAddress,
      await fort.getAddress(),
      transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    const buildingLastUpdateStateTimeWithSummonedCultistsBefore = toBN((await fort.productionInfo()).lastUpdateStateTime);

    await EvmUtils.increaseTime(fortRepairmentTime);

    await fort.removeResourcesAndWorkers(
      await userSettlementInstance2.getAddress(),
      transferableFromLowBN(new BigNumber(assignWorkerQuantity)),
      testUser2,
      spendingResourceConfigs.map((value) => value.resourceTypeId),
      spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
    ).then((tx) => tx.wait());

    await fort.updateState().then((tx) => tx.wait());

    const buildingLastUpdateStateTimeWithSummonedCultistsAfter = toBN((await fort.productionInfo()).lastUpdateStateTime);
    const timePassedWithSummonedCultists = buildingLastUpdateStateTimeWithSummonedCultistsAfter
        .minus(buildingLastUpdateStateTimeWithSummonedCultistsBefore);
    const actualFortHealth = toLowBN(await fort.health());

    const regenerationPerSecondWithSummonedCultists = (actualFortHealth.minus(fortHealthWithSummonedCultists))
        .dividedBy(timePassedWithSummonedCultists);
    expect(regenerationPerSecondWithSummonedCultists)
        .isInCloseRangeWith(regenerationPerSecond, 'Regeneration per second is not correct');
  }

  public static async robberySpeedUpTest(robberyMultiplierBefore: number, robberyMultiplierIncreaseValue: number) {
    const {testUser1, testUser2} = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 8;
    const siegeUnitQuantity = 5;
    const exchangePoints = 20;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();

    const armyStunDurationPerRobberyMultiplier = toBN(await registryInstance.getArmyStunDurationPerRobberyMultiplier());
    const maxAllowedRobberyMultiplierIncreaseValue = toLowBN(await registryInstance.getMaxAllowedRobberyMultiplierIncreaseValue());

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    expect(new BigNumber(robberyMultiplierBefore))
        .lte(maxAllowedRobberyMultiplierIncreaseValue, 'Robbery multiplier is not correct');

    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(robberyMultiplierBefore))
    ).then((tx) => tx.wait());

    const fort = await SettlementHelper.getFort(userSettlementInstance2);
    const fortDestructionTime = await FortHelper.getSettlementFortDestructionTime(userSettlementInstance2);
    await EvmUtils.increaseTime(fortDestructionTime);

    await fort.updateState().then((tx) => tx.wait());

    const fortHealth = toLowBN(await fort.health());
    expect(fortHealth).eql(new BigNumber(0), 'Fort health is not correct');

    const robberyPointsRegenerationTimeBefore = await FortHelper.getSettlementFortRobberyPointsRegenerationTime(
        userSettlementInstance2,
        new BigNumber(exchangePoints)
    );
    const expectedArmyStunDurationBefore = armyStunDurationPerRobberyMultiplier.multipliedBy(robberyMultiplierBefore);
    const actualArmyStunDurationBefore = await ArmyHelper.getStunDuration(army);
    expect(actualArmyStunDurationBefore).eql(expectedArmyStunDurationBefore, 'Stun duration is not correct');

    await EvmUtils.increaseTime(actualArmyStunDurationBefore.toNumber());

    expect(new BigNumber(robberyMultiplierIncreaseValue))
        .lte(maxAllowedRobberyMultiplierIncreaseValue, 'Robbery multiplier is not correct')

    const robberyMultiplierAfter = new BigNumber(robberyMultiplierBefore).plus(robberyMultiplierIncreaseValue);

    await army.modifySiege(
        [],
        [],
        [],
        transferableFromLowBN(robberyMultiplierAfter)
    ).then((tx) => tx.wait());

    const robberyPointsRegenerationTimeAfter = await FortHelper.getSettlementFortRobberyPointsRegenerationTime(
        userSettlementInstance2,
        new BigNumber(exchangePoints)
    );
    const expectedArmyStunDurationAfter = armyStunDurationPerRobberyMultiplier
        .multipliedBy(robberyMultiplierAfter.minus(robberyMultiplierBefore));
    const actualArmyStunDurationAfter = await ArmyHelper.getStunDuration(army);

    expect(new BigNumber(robberyPointsRegenerationTimeAfter))
        .lt(new BigNumber(robberyPointsRegenerationTimeBefore), 'Robbery points regeneration time is not correct');
    expect(actualArmyStunDurationAfter).eql(expectedArmyStunDurationAfter, 'Stun duration is not correct');
  }

  public static async robberyMultiplierChangeTest(robberyMultiplierBefore: number, robberyMultiplierAfter: number) {
    const {testUser1, testUser2} = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 8;
    const siegeUnitQuantity = unitQuantity / 2;
    const exchangePoints = 20;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();

    const armyStunDurationPerRobberyMultiplier = toBN(await registryInstance.getArmyStunDurationPerRobberyMultiplier());
    const maxAllowedRobberyMultiplierIncreaseValue = toLowBN(await registryInstance.getMaxAllowedRobberyMultiplierIncreaseValue());

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    expect(new BigNumber(robberyMultiplierBefore))
        .lte(maxAllowedRobberyMultiplierIncreaseValue, 'Robbery multiplier is not correct');

    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(robberyMultiplierBefore))
    ).then((tx) => tx.wait());

    const fort = await SettlementHelper.getFort(userSettlementInstance2);
    const fortDestructionTime = await FortHelper.getSettlementFortDestructionTime(userSettlementInstance2);
    await EvmUtils.increaseTime(fortDestructionTime);

    await fort.updateState().then((tx) => tx.wait());

    const fortHealth = toLowBN(await fort.health());
    expect(fortHealth).eql(new BigNumber(0), 'Fort health is not correct');

    const robberyPointsRegenerationTimeBefore = await FortHelper.getSettlementFortRobberyPointsRegenerationTime(
        userSettlementInstance2,
        new BigNumber(exchangePoints)
    );
    const expectedArmyStunDurationBefore = armyStunDurationPerRobberyMultiplier.multipliedBy(robberyMultiplierBefore);
    const actualArmyStunDurationBefore = await ArmyHelper.getStunDuration(army);
    expect(actualArmyStunDurationBefore).eql(expectedArmyStunDurationBefore, 'Stun duration is not correct');

    await EvmUtils.increaseTime(actualArmyStunDurationBefore.toNumber());

    expect(new BigNumber(robberyMultiplierAfter))
        .lte(maxAllowedRobberyMultiplierIncreaseValue, 'Robbery multiplier is not correct')

    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => false),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity).dividedBy(2))),
        transferableFromLowBN(new BigNumber(robberyMultiplierAfter))
    ).then((tx) => tx.wait());

    const robberyPointsRegenerationTimeAfter = await FortHelper.getSettlementFortRobberyPointsRegenerationTime(
        userSettlementInstance2,
        new BigNumber(exchangePoints)
    );
    const expectedArmyStunDurationAfter = armyStunDurationPerRobberyMultiplier.multipliedBy(robberyMultiplierAfter);
    const actualArmyStunDurationAfter = await ArmyHelper.getStunDuration(army);

    expect(new BigNumber(robberyPointsRegenerationTimeAfter))
        .not.eql(new BigNumber(robberyPointsRegenerationTimeBefore), 'Robbery points regeneration time is not correct');
    expect(actualArmyStunDurationAfter).eql(expectedArmyStunDurationAfter, 'Stun duration is not correct');
  }

  public static async impossibleChangeSiegeUnitQuantityDuringStunTest() {
      const { testUser1, testUser2 } = await getNamedAccounts();

      const unitTypes = [UnitType.WARRIOR];
      const unitQuantity = 8;
      const siegeUnitQuantity = 5;
      const robberyMultiplier = 1;

      const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
      const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

      const registryInstance = await WorldHelper.getRegistryInstance();

      const armyStunDurationPerRobberyMultiplier = toBN(await registryInstance.getArmyStunDurationPerRobberyMultiplier());
      const maxAllowedRobberyMultiplierIncreaseValue = toLowBN(await registryInstance.getMaxAllowedRobberyMultiplierIncreaseValue());

      const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
      await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

      await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

      expect(new BigNumber(robberyMultiplier))
          .lte(maxAllowedRobberyMultiplierIncreaseValue, 'Robbery multiplier is not correct');

      await army.modifySiege(
          unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
          unitTypes.map(_ => true),
          unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
          transferableFromLowBN(new BigNumber(robberyMultiplier))
      ).then((tx) => tx.wait());

    const expectedArmyStunDuration = armyStunDurationPerRobberyMultiplier.multipliedBy(robberyMultiplier);

    const actualArmyStunDuration = await ArmyHelper.getStunDuration(army);
    expect(actualArmyStunDuration).eql(expectedArmyStunDuration, 'Stun duration is not correct');

    await EvmUtils.increaseTime(expectedArmyStunDuration.multipliedBy(0.9).integerValue().toNumber());

    await expect(
        army.modifySiege(
            unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
            unitTypes.map(_ => false),
            unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
            transferableFromLowBN(new BigNumber(robberyMultiplier))
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("ArmyIsStunned()");
    }

  public static async impossibleTokensExchangeDuringStunTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitTypes = [UnitType.WARRIOR];
    const unitQuantity = 8;
    const siegeUnitQuantity = 5;
    const robberyMultiplier = 1;
    const exchangeTokens = new BigNumber(10);
    const buildingType = BuildingType.FARM;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance2, buildingType);

    const registryInstance = await WorldHelper.getRegistryInstance();

    const armyStunDurationPerRobberyMultiplier = toBN(await registryInstance.getArmyStunDurationPerRobberyMultiplier());
    const maxAllowedRobberyMultiplierIncreaseValue = toLowBN(await registryInstance.getMaxAllowedRobberyMultiplierIncreaseValue());

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    expect(new BigNumber(robberyMultiplier))
        .lte(maxAllowedRobberyMultiplierIncreaseValue, 'Robbery multiplier is not correct');

    await army.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(robberyMultiplier))
    ).then((tx) => tx.wait());

    const expectedArmyStunDuration = armyStunDurationPerRobberyMultiplier.multipliedBy(robberyMultiplier);

    const actualArmyStunDuration = await ArmyHelper.getStunDuration(army);
    expect(actualArmyStunDuration).eql(expectedArmyStunDuration, 'Stun duration is not correct');

    await EvmUtils.increaseTime(expectedArmyStunDuration.multipliedBy(0.9).integerValue().toNumber());

    await expect(
        army.swapRobberyPointsForResourceFromBuildingTreasury(
            await buildingInstance.getAddress(),
            transferableFromLowBN(exchangeTokens)
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("ArmyIsStunned()");
  }
}
