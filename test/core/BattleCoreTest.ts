import {UnitType} from "../../shared/enums/unitType";
import {Battle__factory} from "../../typechain-types";
import {toBN, toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import BigNumber from "bignumber.js";
import {EvmUtils} from "../../shared/helpers/EvmUtils";
import {getNamedAccounts} from "hardhat";
import {UserHelper} from "../../shared/helpers/UserHelper";
import {UnitHelper} from "../../shared/helpers/UnitHelper";
import {expect} from "chai";
import {BigNumberish} from "ethers";
import {MovementHelper} from "../../shared/helpers/MovementHelper";
import {SettlementHelper} from "../../shared/helpers/SettlementHelper";
import {ProductionHelper} from "../../shared/helpers/ProductionHelper";
import {BuildingType} from "../../shared/enums/buildingType";
import {WorldHelper} from "../../shared/helpers/WorldHelper";
import {BattleHelper} from "../../shared/helpers/BattleHelper";
import {ArmyHelper} from "../../shared/helpers/ArmyHelper";
import {FortHelper} from "../../shared/helpers/FortHelper";
import {BuildingHelper} from "../../shared/helpers/BuildingHelper";
import { RegionHelper } from '../../shared/helpers/RegionHelper';

export type ArmyUnits = { [key in UnitType]: BigNumber };

export class BattleCoreTest {
  public static async joinBattleAndCalculateCasualtiesTest(side: number) {
    const { testUser1, testUser2, testUser3 } = await getNamedAccounts();

    const unitQuantity = 2;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);
    const userSettlementInstance3 = await UserHelper.getUserSettlementByNumber(testUser3, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();

    const armyStunDurationByJoiningBattleAtAttackingSide = toBN(
        await registryInstance.getArmyStunDurationByJoiningBattleAtAttackingSide(),
    );
    const baseBattleDuration = toBN(await registryInstance.getBaseBattleDuration());

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);
    const army3 = await SettlementHelper.getArmy(userSettlementInstance3);

    await army1.beginBattle(
      await army2.getAddress(),
      unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
      unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity)))
    ).then((tx) => tx.wait());

    await army3.joinBattle(await army1.battle(), side).then((tx) => tx.wait());
    const battleInstance = Battle__factory.connect(await army1.battle(), army1.runner);

    const expectedStunDurationAfterJoin = side === 1
      ? armyStunDurationByJoiningBattleAtAttackingSide
      : new BigNumber(0);

    const actualStunDurationAfterJoin = await ArmyHelper.getStunDuration(army3);
    expect(actualStunDurationAfterJoin).eql(expectedStunDurationAfterJoin, 'Stun duration is not correct');

    const battleDuration = await BattleHelper.getBattleDuration(battleInstance);
    await EvmUtils.increaseTime(battleDuration);

    const army1UnitsBefore = await UnitHelper.getUnitsQuantity(await army1.getAddress(), unitTypes);
    const army2UnitsBefore = await UnitHelper.getUnitsQuantity(await army2.getAddress(), unitTypes);
    const army3UnitsBefore = await UnitHelper.getUnitsQuantity(await army3.getAddress(), unitTypes);

    //Stage 1
    //Side A
    const sideAUnits = await BattleHelper.getSideUnitsAmount(battleInstance, 1, unitTypes);
    const sideAStage1TotalUnits = await BattleHelper.getTotalSideUnitsCount(sideAUnits);

    const sideAStage1TotalOffense = (await BattleHelper.getTotalSideUnitsStats(sideAUnits))["offenseStage1"];
    const sideAStage1TotalDefence = (await BattleHelper.getTotalSideUnitsStats(sideAUnits))["defenceStage1"];

    //Side B
    const sideBUnits = await BattleHelper.getSideUnitsAmount(battleInstance, 2, unitTypes);
    const sideBStage1TotalUnits = await BattleHelper.getTotalSideUnitsCount(sideBUnits);

    const sideBStage1TotalOffense = (await BattleHelper.getTotalSideUnitsStats(sideBUnits))["offenseStage1"];
    const sideBStage1TotalDefence = (await BattleHelper.getTotalSideUnitsStats(sideBUnits))["defenceStage1"];

    const casualtiesPercentSideAStage1 = await sideBStage1TotalOffense.dividedBy(sideAStage1TotalDefence)
        .multipliedBy(battleDuration).dividedBy(baseBattleDuration);
    const casualtiesPercentSideBStage1 = await sideAStage1TotalOffense.dividedBy(sideBStage1TotalDefence)
        .multipliedBy(battleDuration).dividedBy(baseBattleDuration);

    side === 1
      ? expect(sideAStage1TotalUnits).to.be.above(sideBStage1TotalUnits, 'Side A unit quantity is not correct')
      : expect(sideBStage1TotalUnits).to.be.above(sideAStage1TotalUnits, 'Side B unit quantity is not correct');

    const calculateCasualties = (
      armyBefore: ArmyUnits,
      casualtiesPercent: BigNumber
    ): ArmyUnits => {
      return Object.fromEntries(
        unitTypes.map(unitType => [unitType, armyBefore[unitType].multipliedBy(casualtiesPercent).gt(armyBefore[unitType])
            ? armyBefore[unitType]
            : armyBefore[unitType].multipliedBy(casualtiesPercent)])
      ) as ArmyUnits;
    };

    const casualtiesSideAStage1 = calculateCasualties(sideAUnits, casualtiesPercentSideAStage1);
    const casualtiesSideBStage1 = calculateCasualties(sideBUnits, casualtiesPercentSideBStage1);

    const expectedCasualtiesStage1 = await battleInstance.calculateStage1Casualties();

    for (let i = 0; i < unitTypes.length; i++) {
      expect(new BigNumber(casualtiesSideAStage1[unitTypes[i]]))
          .isInCloseRangeWith(toLowBN(expectedCasualtiesStage1._side1Casualties[i]), 'Casualties amount is not correct');
      expect(new BigNumber(casualtiesSideBStage1[unitTypes[i]]))
          .isInCloseRangeWith(toLowBN(expectedCasualtiesStage1._side2Casualties[i]), 'Casualties amount is not correct');
    }

    //Stage 2
    //Side A
    const sideAUnitsAfterStage1 = Object.fromEntries(
        unitTypes.map(unitType => [unitType, sideAUnits[unitType].minus(casualtiesSideAStage1[unitType])])
    );

    const sideAStage2TotalOffense = (await BattleHelper.getTotalSideUnitsStats(sideAUnitsAfterStage1 as ArmyUnits))["offenseStage2"];
    const sideAStage2TotalDefence = (await BattleHelper.getTotalSideUnitsStats(sideAUnitsAfterStage1 as ArmyUnits))["defenceStage2"];

    //Side B
    const sideBUnitsAfterStage1 = Object.fromEntries(
      unitTypes.map(unitType => [unitType, sideBUnits[unitType].minus(casualtiesSideBStage1[unitType])])
    );

    const sideBStage2TotalOffense = (await BattleHelper.getTotalSideUnitsStats(sideBUnitsAfterStage1 as ArmyUnits))["offenseStage2"];
    const sideBStage2TotalDefence = (await BattleHelper.getTotalSideUnitsStats(sideBUnitsAfterStage1 as ArmyUnits))["defenceStage2"];

    const casualtiesPercentSideAStage2 = await sideBStage2TotalOffense.dividedBy(sideAStage2TotalDefence)
        .multipliedBy(battleDuration).dividedBy(baseBattleDuration);
    const casualtiesPercentSideBStage2 = await sideAStage2TotalOffense.dividedBy(sideBStage2TotalDefence)
        .multipliedBy(battleDuration).dividedBy(baseBattleDuration);

    const casualtiesSideAStage2 = calculateCasualties(sideAUnitsAfterStage1 as ArmyUnits, casualtiesPercentSideAStage2);
    const casualtiesSideBStage2 = calculateCasualties(sideBUnitsAfterStage1 as ArmyUnits, casualtiesPercentSideBStage2);

    const casualtiesSideA = Object.fromEntries(
        unitTypes.map(unitType => [unitType, casualtiesSideAStage1[unitType].plus(casualtiesSideAStage2[unitType])])
    );

    const casualtiesSideB = Object.fromEntries(
        unitTypes.map(unitType => [unitType, casualtiesSideBStage1[unitType].plus(casualtiesSideBStage2[unitType])])
    );

    const army1Casualties = Object.fromEntries(
        unitTypes.map(unitType => [unitType, casualtiesSideA[unitType].multipliedBy(army1UnitsBefore[unitType]).dividedBy(sideAUnits[unitType])])
    );

    const army2Casualties = Object.fromEntries(
        unitTypes.map(unitType => [unitType, casualtiesSideB[unitType].multipliedBy(army2UnitsBefore[unitType]).dividedBy(sideBUnits[unitType])])
    );

    const army3Casualties = side === 1
      ? Object.fromEntries(
          unitTypes.map(unitType => [unitType, casualtiesSideA[unitType].multipliedBy(army3UnitsBefore[unitType]).dividedBy(sideAUnits[unitType])])
      )
      : Object.fromEntries(
          unitTypes.map(unitType => [unitType, casualtiesSideB[unitType].multipliedBy(army3UnitsBefore[unitType]).dividedBy(sideBUnits[unitType])])
      );

    const expectedCasualtiesStage2 = await battleInstance.calculateStage2Casualties(
        [...expectedCasualtiesStage1._side1Casualties],
        [...expectedCasualtiesStage1._side2Casualties]
    );

    for (let i = 0; i < unitTypes.length; i++) {
      expect(new BigNumber(casualtiesSideAStage2[unitTypes[i]]))
          .isInCloseRangeWith(toLowBN(expectedCasualtiesStage2._side1Casualties[i]), 'Casualties amount is not correct');
      expect(new BigNumber(casualtiesSideBStage2[unitTypes[i]]))
          .isInCloseRangeWith(toLowBN(expectedCasualtiesStage2._side2Casualties[i]), 'Casualties amount is not correct');
    }

    await battleInstance.endBattle().then((tx) => tx.wait());
    const winningSide = Number(await battleInstance.winningSide());

    const createExpectedArmy = (
      armyBefore: ArmyUnits,
      armyCasualties: ArmyUnits,
      side: number
    ): ArmyUnits => {
      return Object.fromEntries(
        unitTypes.map(unitType => {
          const unitBeforeMinusCasualties = side === winningSide
            ? armyBefore[unitType].minus(armyCasualties[unitType].integerValue(BigNumber.ROUND_DOWN))
            : armyBefore[unitType].minus(armyCasualties[unitType].integerValue(BigNumber.ROUND_UP));

          return [
            unitType as UnitType,
            unitBeforeMinusCasualties.isNegative() ? new BigNumber(0) : unitBeforeMinusCasualties
          ];
        })
      ) as ArmyUnits;
    };

    const expectedArmy1 = createExpectedArmy(army1UnitsBefore, army1Casualties as ArmyUnits, 1);
    const expectedArmy2 = createExpectedArmy(army2UnitsBefore, army2Casualties as ArmyUnits, 2);
    const expectedArmy3 = createExpectedArmy(army3UnitsBefore, army3Casualties as ArmyUnits, side);

    await army1.updateState().then((tx) => tx.wait());
    await army2.updateState().then((tx) => tx.wait());
    await army3.updateState().then((tx) => tx.wait());

    const actualArmy1Units = await UnitHelper.getUnitsQuantity(await army1.getAddress(), unitTypes);
    const actualArmy2Units = await UnitHelper.getUnitsQuantity(await army2.getAddress(), unitTypes);
    const actualArmy3Units = await UnitHelper.getUnitsQuantity(await army3.getAddress(), unitTypes);

    for (let i = 0; i < unitTypes.length; i++) {
      expect(actualArmy1Units[unitTypes[i]]).eql(expectedArmy1[unitTypes[i]], `Army 1 ${unitTypes[i]} quantity is not correct`);
      expect(actualArmy2Units[unitTypes[i]]).eql(expectedArmy2[unitTypes[i]], `Army 2 ${unitTypes[i]} quantity is not correct`);
      expect(actualArmy3Units[unitTypes[i]]).eql(expectedArmy3[unitTypes[i]], `Army 3 ${unitTypes[i]} quantity is not correct`);
    }
    expect(winningSide).eql(side, 'Winning side is not correct');

    const battleDurationWinningArmyStunMultiplier = toLowBN(await registryInstance.getBattleDurationWinningArmyStunMultiplier());
    const battleDurationLosingArmyStunMultiplier = toLowBN(await registryInstance.getBattleDurationLosingArmyStunMultiplier());

    const expectedArmy1StunDuration = winningSide === 1
      ? battleDurationWinningArmyStunMultiplier.multipliedBy(battleDuration)
      : battleDurationLosingArmyStunMultiplier.multipliedBy(battleDuration);

    const expectedArmy2StunDuration = winningSide === 1
        ? battleDurationLosingArmyStunMultiplier.multipliedBy(battleDuration)
        : battleDurationWinningArmyStunMultiplier.multipliedBy(battleDuration);

    const actualArmy1StunDuration = await ArmyHelper.getStunDuration(army1);
    const actualArmy2StunDuration = await ArmyHelper.getStunDuration(army2);

    expect(actualArmy1StunDuration).eql(expectedArmy1StunDuration, 'Army 1 stun duration is not correct');
    expect(actualArmy2StunDuration).eql(expectedArmy2StunDuration, 'Army 2 stun duration is not correct');
  }

  public static async impossibleBattleJoinDuringStunTest(side: BigNumberish) {
    const { testUser1, testUser2, testUser3 } = await getNamedAccounts();

    const unitQuantity = 1;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);
    const userSettlementInstance3 = await UserHelper.getUserSettlementByNumber(testUser3, 1);

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
    await MovementHelper.moveArmy(army3, await userSettlementInstance2.position(), 0, false);

    await army1.beginBattle(
      await army2.getAddress(),
      unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
      unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity)))
    ).then((tx) => tx.wait());

    await expect(
      army3.joinBattle(await army1.battle(), side).then((tx) => tx.wait())
    ).to.be.revertedWith("ArmyIsStunned()");
  }

  public static async impossibleBattleDuringStunTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 1;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity)).to.be.true;
    expect(await UnitHelper.isHirePossible(army2, unitTypes, unitQuantity)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity);
    await UnitHelper.hireUnits(army2, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army1, await userSettlementInstance2.position(), 0, false);

    await expect(
      army1.beginBattle(
        await army2.getAddress(),
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity)))
      ).then((tx) => tx.wait())
    ).to.be.revertedWith("ArmyIsStunned()");
  }

  public static async impossibleBattleDueMaxUnitsToAttackTest() {
    const {testUser1, testUser2} = await getNamedAccounts();

    const unitTypes = [UnitType.ARCHER];
    const unitQuantity = 2;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity)).to.be.true;
    expect(await UnitHelper.isHirePossible(army2, unitTypes, unitQuantity)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity);
    await UnitHelper.hireUnits(army2, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army1, await userSettlementInstance2.position(), 0, true);

    await expect(
        army1.beginBattle(
            await army2.getAddress(),
            unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
            unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity / 2)))
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("BattleCannotBeCreatedWhenArmyUnitsExceedDesiredAmountToAttack()");
  }

  public static async battleDrawTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 2;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    await army1.beginBattle(
      await army2.getAddress(),
      unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
      unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity)))
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army1.battle(), army1.runner);

    const battleDuration = await BattleHelper.getBattleDuration(battleInstance);
    await EvmUtils.increaseTime(battleDuration);

    const army1UnitsBefore = await UnitHelper.getUnitsQuantity(await army1.getAddress(), unitTypes);
    const army2UnitsBefore = await UnitHelper.getUnitsQuantity(await army2.getAddress(), unitTypes);

    for (let i = 0; i < unitTypes.length; i++) {
      expect(army1UnitsBefore[unitTypes[i]]).eql(army2UnitsBefore[unitTypes[i]], `Army ${unitTypes[i]} quantity is not correct`);
    }

    await battleInstance.endBattle().then((tx) => tx.wait());
    const winningSide = await battleInstance.winningSide();

    await army1.updateState().then((tx) => tx.wait());
    await army2.updateState().then((tx) => tx.wait());

    const actualArmy1Units = await UnitHelper.getUnitsQuantity(await army1.getAddress(), unitTypes);
    const actualArmy2Units = await UnitHelper.getUnitsQuantity(await army2.getAddress(), unitTypes);

    for (let i = 0; i < unitTypes.length; i++) {
      expect(actualArmy1Units[unitTypes[i]]).eql(actualArmy2Units[unitTypes[i]], `Army ${unitTypes[i]} quantity is not correct`);
    }
    expect(winningSide).eql(BigInt(0), 'Winning side is not correct');

    const battleDurationLosingArmyStunMultiplier = toLowBN(await registryInstance.getBattleDurationLosingArmyStunMultiplier());
    const expectedStunDuration = battleDurationLosingArmyStunMultiplier.multipliedBy(battleDuration);

    const actualArmy1StunDuration = await ArmyHelper.getStunDuration(army1);
    const actualArmy2StunDuration = await ArmyHelper.getStunDuration(army2);

    expect(actualArmy1StunDuration).eql(expectedStunDuration, 'Army 1 stun duration is not correct');
    expect(actualArmy2StunDuration).eql(expectedStunDuration, 'Army 2 stun duration is not correct');
  }

  public static async cultistsBattleWithDifferentArmiesAmountTest() {
    const { testUser1 } = await getNamedAccounts();

    const unitQuantity1 = 1;
    const unitQuantity2 = 2;
    const corruptionIndexAmount = 10000;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser1, 2);

    const registryInstance = await WorldHelper.getRegistryInstance();

    const regionInstance1 = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance1);
    const regionInstance2 = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance2);

    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance1,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );
    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance2,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
    await EvmUtils.increaseTime(summonDelay);

    await regionInstance1.updateState().then((tx) => tx.wait());
    await regionInstance2.updateState().then((tx) => tx.wait());

    const cultistAmountBefore1 = await UnitHelper.getCultistQuantity(regionInstance1);
    const cultistAmountBefore2 = await UnitHelper.getCultistQuantity(regionInstance2);

    expect(cultistAmountBefore1).gt(new BigNumber(0), 'Cultist amount is not correct');
    expect(cultistAmountBefore2).gt(new BigNumber(0), 'Cultist amount is not correct');

    const cultistsSettlementInstance1 = await UnitHelper.getCultistsSettlementInstance(regionInstance1);
    const cultistsSettlementInstance2 = await UnitHelper.getCultistsSettlementInstance(regionInstance2);
    const cultistUnitTypeId = await registryInstance.getCultistUnitTypeId();

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity1)).to.be.true;
    expect(await UnitHelper.isHirePossible(army2, unitTypes, unitQuantity2)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity1);
    await UnitHelper.hireUnits(army2, unitTypes, unitQuantity2);

    await MovementHelper.moveArmy(army1, await cultistsSettlementInstance1.position(), 0, true);
    await MovementHelper.moveArmy(army2, await cultistsSettlementInstance2.position(), 0, true);

    await army1.beginBattle(
      await cultistsSettlementInstance1.army(),
      [cultistUnitTypeId],
      [transferableFromLowBN(cultistAmountBefore1)]
    ).then((tx) => tx.wait());

    await army2.beginBattle(
      await cultistsSettlementInstance2.army(),
      [cultistUnitTypeId],
      [transferableFromLowBN(cultistAmountBefore2)]
    ).then((tx) => tx.wait());

    const battleInstance1 = Battle__factory.connect(await army1.battle(), army1.runner);
    const battleInstance2 = Battle__factory.connect(await army2.battle(), army2.runner);

    const battleDuration1 = await BattleHelper.getBattleDuration(battleInstance1);
    const battleDuration2 = await BattleHelper.getBattleDuration(battleInstance2);

    const battleDuration = Number(await registryInstance.getBaseBattleDuration());
    expect(battleDuration).eql(battleDuration1, 'Battle duration is not correct');
    expect(battleDuration).eql(battleDuration2, 'Battle duration is not correct');
  }

  public static async impossibleCultistsSummonDueBattleTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 1;
    const corruptionIndexAmount = 10000;

    const registryInstance = await WorldHelper.getRegistryInstance();

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity)).to.be.true;
    expect(await UnitHelper.isHirePossible(army2, unitTypes, unitQuantity)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity);
    await UnitHelper.hireUnits(army2, unitTypes, unitQuantity);

    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance1);

    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance1,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
    await EvmUtils.increaseTime(summonDelay);

    await regionInstance.updateState().then((tx) => tx.wait());

    const cultistAmountBefore = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistAmountBefore).gt(new BigNumber(0), 'Cultist amount is not correct');

    const cultistsSettlementInstance = await UnitHelper.getCultistsSettlementInstance(regionInstance);
    const cultistUnitTypeId = await registryInstance.getCultistUnitTypeId();

    await MovementHelper.moveArmy(army1, await cultistsSettlementInstance.position(), 0, true);
    await MovementHelper.moveArmy(army2, await cultistsSettlementInstance.position(), 0, true);

    await army1.beginBattle(
        await cultistsSettlementInstance.army(),
        [cultistUnitTypeId],
        [transferableFromLowBN(cultistAmountBefore)]
    ).then((tx) => tx.wait());

    await expect(
        army2.beginBattle(
            await cultistsSettlementInstance.army(),
            [cultistUnitTypeId],
            [transferableFromLowBN(new BigNumber(1))]
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("ArmyIsInBattle()");
  }

  public static async impossibleCultistsBattleDueLimitTest() {
    const { testUser1 } = await getNamedAccounts();

    const unitQuantity = 1;
    const corruptionIndexAmount = 10000;

    const registryInstance = await WorldHelper.getRegistryInstance();

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const army = await SettlementHelper.getArmy(userSettlementInstance);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
    await EvmUtils.increaseTime(summonDelay);

    await regionInstance.updateState().then((tx) => tx.wait());

    const cultistAmountBefore = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistAmountBefore).gt(new BigNumber(0), 'Cultist amount is not correct');

    const cultistsSettlementInstance = await UnitHelper.getCultistsSettlementInstance(regionInstance);
    const cultistUnitTypeId = await registryInstance.getCultistUnitTypeId();

    await MovementHelper.moveArmy(army, await cultistsSettlementInstance.position(), 0, true);

    await expect(
        army.beginBattle(
            await cultistsSettlementInstance.army(),
            [cultistUnitTypeId],
            [transferableFromLowBN(cultistAmountBefore.plus(1))]
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("BattleCannotAcceptCultistsArmyWhenCultistsAmountChangedToLowerValueThanDesired()");
  }

  public static async battleJoinVersusCultistsTest(side: number) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 1;
    const corruptionIndexAmount = 10000;

    const registryInstance = await WorldHelper.getRegistryInstance();

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, unitQuantity)).to.be.true;
    expect(await UnitHelper.isHirePossible(army2, unitTypes, unitQuantity)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, unitQuantity);
    await UnitHelper.hireUnits(army2, unitTypes, unitQuantity);

    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance1);

    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance1,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
    await EvmUtils.increaseTime(summonDelay);

    await regionInstance.updateState().then((tx) => tx.wait());

    const cultistAmountBefore = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistAmountBefore).gt(new BigNumber(0), 'Cultist amount is not correct');

    const cultistsSettlementInstance = await UnitHelper.getCultistsSettlementInstance(regionInstance);
    const cultistUnitTypeId = await registryInstance.getCultistUnitTypeId();

    await MovementHelper.moveArmy(army1, await cultistsSettlementInstance.position(), 0, true);
    await MovementHelper.moveArmy(army2, await cultistsSettlementInstance.position(), 0, true);

    const armyUnits = await UnitHelper.getUnitsQuantity(await army2.getAddress(), unitTypes);

    await army1.beginBattle(
        await cultistsSettlementInstance.army(),
        [cultistUnitTypeId],
        [transferableFromLowBN(cultistAmountBefore)]
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army1.battle(), army1.runner);

    const sideAUnitsBefore = await BattleHelper.getSideUnitsAmount(battleInstance, 1, unitTypes);
    const sideBUnitsBefore = await BattleHelper.getSideUnitsAmount(battleInstance, 2, unitTypes);

    await army2.joinBattle(await army1.battle(), side).then((tx) => tx.wait());

    const sideAUnitsAfter = await BattleHelper.getSideUnitsAmount(battleInstance, 1, unitTypes);
    const sideBUnitsAfter = await BattleHelper.getSideUnitsAmount(battleInstance, 2, unitTypes);

    if (side === 1) {
      for (let i = 0; i < unitTypes.length; i++) {
        expect(sideAUnitsAfter[unitTypes[i]]).eql(sideAUnitsBefore[unitTypes[i]].plus(armyUnits[unitTypes[i]]));
        expect(sideBUnitsAfter[unitTypes[i]]).eql(sideBUnitsBefore[unitTypes[i]]);
      }
    } else {
      for (let i = 0; i < unitTypes.length; i++) {
        expect(sideAUnitsAfter[unitTypes[i]]).eql(sideAUnitsBefore[unitTypes[i]]);
        expect(sideBUnitsAfter[unitTypes[i]]).eql(sideBUnitsBefore[unitTypes[i]].plus(armyUnits[unitTypes[i]]));
      }
    }
  }

  public static async productionPenaltyReduceAfterCultistsBattleTest() {
    const { testUser1 } = await getNamedAccounts();

    const corruptionIndexAmount = 10000;
    const unitQuantity = 2;
    const cultistAmount = new BigNumber(5);

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    await ProductionHelper.increaseCorruptionIndexBySettlementBuildingProduction(
        userSettlementInstance,
        BuildingType.SMITHY,
        corruptionIndexAmount
    );

    const summonDelay = Number(await registryInstance.getCultistsSummonDelay());
    await EvmUtils.increaseTime(summonDelay);

    await regionInstance.updateState().then((tx) => tx.wait());

    const cultistAmountBefore = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistAmountBefore).gt(new BigNumber(0), 'Cultist amount is not correct');

    const expectedProductionSlowdownPercentageBefore = cultistAmountBefore.dividedBy(100);
    const actualProductionSlowdownPercentageBefore = await ProductionHelper.getProductionSlowdownPercentage(
        userSettlementInstance,
        BuildingType.SMITHY
    );

    expect(actualProductionSlowdownPercentageBefore)
        .eql(expectedProductionSlowdownPercentageBefore, 'Production slowdown percentage is not correct');

    const cultistsSettlementInstance = await UnitHelper.getCultistsSettlementInstance(regionInstance);
    const cultistUnitTypeId = await registryInstance.getCultistUnitTypeId();

    const army = await SettlementHelper.getArmy(userSettlementInstance);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await cultistsSettlementInstance.position(), 0, true);

    expect(cultistAmount).lte(cultistAmountBefore, 'Cultist amount is not correct');

    await army.beginBattle(
      await cultistsSettlementInstance.army(),
      [cultistUnitTypeId],
      [transferableFromLowBN(cultistAmount)]
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army.battle(), army.runner);

    const battleDuration = await BattleHelper.getBattleDuration(battleInstance);
    await EvmUtils.increaseTime(battleDuration);

    await battleInstance.endBattle().then((tx) => tx.wait());

    const cultistAmountAfter = await UnitHelper.getCultistQuantity(regionInstance);
    expect(cultistAmountAfter).eql(cultistAmountBefore.minus(cultistAmount), 'Cultist amount is not correct');

    const expectedProductionSlowdownPercentageAfter = cultistAmountAfter.dividedBy(100);
    const actualProductionSlowdownPercentageAfter = await ProductionHelper.getProductionSlowdownPercentage(
        userSettlementInstance,
        BuildingType.SMITHY
    );

    expect(actualProductionSlowdownPercentageAfter)
        .eql(expectedProductionSlowdownPercentageAfter, 'Production slowdown percentage is not correct');
    expect(actualProductionSlowdownPercentageAfter)
        .lt(actualProductionSlowdownPercentageBefore, 'Production slowdown percentage is not correct');
  }

  public static async siegeEndDuringBattleTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 2;
    const siegeUnitQuantity = unitQuantity / 2;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    await army1.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => true),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(0))
    ).then((tx) => tx.wait());

    await army2.beginBattle(
      await army1.getAddress(),
      unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
      unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity)))
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army2.battle(), army2.runner);

    const armyUnitsBefore = await UnitHelper.getUnitsQuantity(await army1.getAddress(), unitTypes);
    const armyUnitsInBattleBefore = await BattleHelper.getSideUnitsAmount(battleInstance, 2, unitTypes);

    await army1.modifySiege(
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => false),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(siegeUnitQuantity))),
        transferableFromLowBN(new BigNumber(0))
    ).then((tx) => tx.wait());

    const armyUnitsAfter = await UnitHelper.getUnitsQuantity(await army1.getAddress(), unitTypes);
    const armyUnitsInBattleAfter = await BattleHelper.getSideUnitsAmount(battleInstance, 2, unitTypes);

    for (let i = 0; i < unitTypes.length; i++) {
      expect(armyUnitsAfter[unitTypes[i]]).eql(armyUnitsBefore[unitTypes[i]].plus(siegeUnitQuantity), `Army ${unitTypes[i]} quantity is not correct`);
    }
    expect(armyUnitsInBattleAfter).eql(armyUnitsInBattleBefore, 'Army unit quantity is not correct');
  }

  public static async battleDurationTest(army1UnitQuantity: number, army2UnitQuantity: number) {
    const {testUser1, testUser2} = await getNamedAccounts();

    const unitTypes = [UnitType.ARCHER];

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const baseBattleDuration = Number(await registryInstance.getBaseBattleDuration());

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    expect(await UnitHelper.isHirePossible(army1, unitTypes, army1UnitQuantity)).to.be.true;
    expect(await UnitHelper.isHirePossible(army2, unitTypes, army2UnitQuantity)).to.be.true;

    await UnitHelper.hireUnits(army1, unitTypes, army1UnitQuantity);
    await UnitHelper.hireUnits(army2, unitTypes, army2UnitQuantity);

    await MovementHelper.moveArmy(army1, await userSettlementInstance2.position(), 0, true);

    await army1.beginBattle(
        await army2.getAddress(),
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(army2UnitQuantity)))
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army1.battle(), army1.runner);

    const sideRatio = army1UnitQuantity < army2UnitQuantity
        ? army1UnitQuantity / army2UnitQuantity
        : army2UnitQuantity / army1UnitQuantity;
    const battleDurationMultiplier = sideRatio < 0.5 ? sideRatio : 0.5;

    const expectedBattleDuration = Math.floor(baseBattleDuration * (2 * battleDurationMultiplier));

    const actualBattleDuration = await BattleHelper.getBattleDuration(battleInstance);
    expect(expectedBattleDuration).eql(actualBattleDuration, 'Battle duration is not correct');
  }

  public static async minBattleDurationTest() {
    const {testUser1, testUser2} = await getNamedAccounts();

    const buildingLevel = 30;
    const assignWorkerQuantity = 10;
    const unitTypes = [UnitType.ARCHER];
    const unitQuantity = 1;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const fort = await SettlementHelper.getFort(userSettlementInstance1);

    const registryInstance = await WorldHelper.getRegistryInstance();

    await BuildingHelper.upgradeBuildingToSpecifiedLevel(fort, buildingLevel, true);

    const fortMaxHealth = toLowBN(await fort.getMaxHealthOnLevel(buildingLevel));
    await FortHelper.repairFort(userSettlementInstance1, assignWorkerQuantity, fortMaxHealth);

    const maxAllowedUnitsToBuyPerTransaction = toLowBN(await registryInstance.getMaxAllowedUnitsToBuyPerTransaction());
    const baseBattleDuration = Number(await registryInstance.getBaseBattleDuration());
    const minimumBattleDuration = Number(await registryInstance.getMinimumBattleDuration());

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    const maxAvailableUnitQuantityToHire = await UnitHelper.getMaxAvailableUnitQuantityToHire(userSettlementInstance1);
    expect(maxAvailableUnitQuantityToHire)
        .gte(maxAllowedUnitsToBuyPerTransaction.multipliedBy(3), 'Unit quantity is not correct');

    for (let i = 0; i < 3; i++) {
      await UnitHelper.hireUnits(army1, unitTypes, maxAllowedUnitsToBuyPerTransaction.toNumber());
    }

    expect(await UnitHelper.isHirePossible(army2, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army2, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army1, await userSettlementInstance2.position(), 0, true);

    await army1.beginBattle(
        await army2.getAddress(),
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(1)))
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army1.battle(), army1.runner);

    //Side A
    const sideAUnits = await BattleHelper.getSideUnitsAmount(battleInstance, 1, unitTypes);
    const sideATotalUnits = await BattleHelper.getTotalSideUnitsCount(sideAUnits);

    //Side B
    const sideBUnits = await BattleHelper.getSideUnitsAmount(battleInstance, 2, unitTypes);
    const sideBTotalUnits = await BattleHelper.getTotalSideUnitsCount(sideBUnits);

    const sideRatio = sideATotalUnits.toNumber() < sideBTotalUnits.toNumber()
        ? sideATotalUnits.dividedBy(sideBTotalUnits)
        : sideBTotalUnits.dividedBy(sideATotalUnits);
    const battleDurationMultiplier = sideRatio.toNumber() < 0.5 ? sideRatio.toNumber() : 0.5;

    const expectedBattleDuration = Math.floor(baseBattleDuration * (2 * battleDurationMultiplier));
    expect(expectedBattleDuration).lt(minimumBattleDuration, 'Battle duration is not correct');

    const actualBattleDuration = await BattleHelper.getBattleDuration(battleInstance);
    expect(actualBattleDuration).eql(minimumBattleDuration, 'Battle duration is not correct');
  }

  public static async battleCasualtiesTest(unitQuantity1: number, unitType1: UnitType, unitQuantity2: number, unitType2: UnitType) {
    const {testUser1, testUser2} = await getNamedAccounts();

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const baseBattleDuration = toBN(await registryInstance.getBaseBattleDuration());

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    expect(await UnitHelper.isHirePossible(army1, [unitType1], unitQuantity1)).to.be.true;
    expect(await UnitHelper.isHirePossible(army2, [unitType2], unitQuantity2)).to.be.true;

    await UnitHelper.hireUnits(army1, [unitType1], unitQuantity1);
    await UnitHelper.hireUnits(army2, [unitType2], unitQuantity2);

    await MovementHelper.moveArmy(army1, await userSettlementInstance2.position(), 0, true);

    await army1.beginBattle(
        await army2.getAddress(),
        [UnitHelper.getUnitTypeId(unitType2)],
        [transferableFromLowBN(new BigNumber(unitQuantity2))]
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army1.battle(), army1.runner);

    const battleDuration = await BattleHelper.getBattleDuration(battleInstance);
    await EvmUtils.increaseTime(battleDuration);

    const army1UnitsBefore = await UnitHelper.getUnitsQuantity(await army1.getAddress(), [unitType1]);
    const army2UnitsBefore = await UnitHelper.getUnitsQuantity(await army2.getAddress(), [unitType2]);

    //Stage 1
    //Side A
    const sideAUnits = await BattleHelper.getSideUnitsAmount(battleInstance, 1, [unitType1]);

    const sideAStage1TotalOffense = (await BattleHelper.getTotalSideUnitsStats(sideAUnits))["offenseStage1"];
    const sideAStage1TotalDefence = (await BattleHelper.getTotalSideUnitsStats(sideAUnits))["defenceStage1"];

    //Side B
    const sideBUnits = await BattleHelper.getSideUnitsAmount(battleInstance, 2, [unitType2]);

    const sideBStage1TotalOffense = (await BattleHelper.getTotalSideUnitsStats(sideBUnits))["offenseStage1"];
    const sideBStage1TotalDefence = (await BattleHelper.getTotalSideUnitsStats(sideBUnits))["defenceStage1"];

    const casualtiesPercentSideAStage1 = await sideBStage1TotalOffense.dividedBy(sideAStage1TotalDefence).multipliedBy(battleDuration).dividedBy(baseBattleDuration);
    const casualtiesPercentSideBStage1 = await sideAStage1TotalOffense.dividedBy(sideBStage1TotalDefence).multipliedBy(battleDuration).dividedBy(baseBattleDuration);

    const calculateCasualties = (
        armyBefore: ArmyUnits,
        casualtiesPercent: BigNumber
    ): ArmyUnits => {
      const unitTypes = Object.keys(armyBefore) as UnitType[];
      return Object.fromEntries(
          unitTypes.map(unitType => [unitType, armyBefore[unitType].multipliedBy(casualtiesPercent).gt(armyBefore[unitType])
              ? armyBefore[unitType]
              : armyBefore[unitType].multipliedBy(casualtiesPercent)])
      ) as ArmyUnits;
    };

    const casualtiesSideAStage1 = calculateCasualties(sideAUnits, casualtiesPercentSideAStage1);
    const casualtiesSideBStage1 = calculateCasualties(sideBUnits, casualtiesPercentSideBStage1);


    const expectedCasualtiesStage1 = await battleInstance.calculateStage1Casualties();

    expect(new BigNumber(casualtiesSideAStage1[unitType1]))
        .isInCloseRangeWith(toLowBN(expectedCasualtiesStage1._side1Casualties[unitTypes.indexOf(unitType1)]), 'Casualties amount is not correct');
    expect(new BigNumber(casualtiesSideBStage1[unitType2]))
        .isInCloseRangeWith(toLowBN(expectedCasualtiesStage1._side2Casualties[unitTypes.indexOf(unitType2)]), 'Casualties amount is not correct');

    //Stage 2
    //Side A
    const sideAUnitsAfterStage1 = Object.fromEntries(
        [unitType1].map(unitType => [unitType, sideAUnits[unitType].minus(casualtiesSideAStage1[unitType])])
    );

    const sideAStage2TotalOffense = (await BattleHelper.getTotalSideUnitsStats(sideAUnitsAfterStage1 as ArmyUnits))["offenseStage2"];
    const sideAStage2TotalDefence = (await BattleHelper.getTotalSideUnitsStats(sideAUnitsAfterStage1 as ArmyUnits))["defenceStage2"];

    //Side B
    const sideBUnitsAfterStage1 = Object.fromEntries(
        [unitType2].map(unitType => [unitType, sideBUnits[unitType].minus(casualtiesSideBStage1[unitType])])
    );

    const sideBStage2TotalOffense = (await BattleHelper.getTotalSideUnitsStats(sideBUnitsAfterStage1 as ArmyUnits))["offenseStage2"];
    const sideBStage2TotalDefence = (await BattleHelper.getTotalSideUnitsStats(sideBUnitsAfterStage1 as ArmyUnits))["defenceStage2"];

    const casualtiesPercentSideAStage2 = await sideBStage2TotalOffense.dividedBy(sideAStage2TotalDefence).multipliedBy(battleDuration).dividedBy(baseBattleDuration);
    const casualtiesPercentSideBStage2 = await sideAStage2TotalOffense.dividedBy(sideBStage2TotalDefence).multipliedBy(battleDuration).dividedBy(baseBattleDuration);

    const casualtiesSideAStage2 = calculateCasualties(sideAUnitsAfterStage1 as ArmyUnits, casualtiesPercentSideAStage2);
    const casualtiesSideBStage2 = calculateCasualties(sideBUnitsAfterStage1 as ArmyUnits, casualtiesPercentSideBStage2);

    const casualtiesSideA = Object.fromEntries(
        [unitType1].map(unitType => [unitType, casualtiesSideAStage1[unitType].plus(casualtiesSideAStage2[unitType])])
    );

    const casualtiesSideB = Object.fromEntries(
        [unitType2].map(unitType => [unitType, casualtiesSideBStage1[unitType].plus(casualtiesSideBStage2[unitType])])
    );

    const army1Casualties = Object.fromEntries(
        [unitType1].map(unitType => [unitType, casualtiesSideA[unitType].multipliedBy(army1UnitsBefore[unitType]).dividedBy(sideAUnits[unitType])])
    );

    const army2Casualties = Object.fromEntries(
        [unitType2].map(unitType => [unitType, casualtiesSideB[unitType].multipliedBy(army2UnitsBefore[unitType]).dividedBy(sideBUnits[unitType])])
    );

    const expectedCasualtiesStage2 = await battleInstance.calculateStage2Casualties(
        [...expectedCasualtiesStage1._side1Casualties],
        [...expectedCasualtiesStage1._side2Casualties]
    );

    expect(new BigNumber(casualtiesSideAStage2[unitType1]))
        .isInCloseRangeWith(toLowBN(expectedCasualtiesStage2._side1Casualties[unitTypes.indexOf(unitType1)]), 'Casualties amount is not correct');
    expect(new BigNumber(casualtiesSideBStage2[unitType2]))
        .isInCloseRangeWith(toLowBN(expectedCasualtiesStage2._side2Casualties[unitTypes.indexOf(unitType2)]), 'Casualties amount is not correct');

    await battleInstance.endBattle().then((tx) => tx.wait());
    const winningSide = Number(await battleInstance.winningSide());

    const createExpectedArmy = (
        armyBefore: ArmyUnits,
        armyCasualties: ArmyUnits,
        side: number
    ): ArmyUnits => {
      const unitTypes = Object.keys(armyBefore) as UnitType[];
      return Object.fromEntries(
          unitTypes.map(unitType => {
            const unitBeforeMinusCasualties = side === winningSide
                ? armyBefore[unitType].minus(armyCasualties[unitType].integerValue(BigNumber.ROUND_DOWN))
                : armyBefore[unitType].minus(armyCasualties[unitType].integerValue(BigNumber.ROUND_UP));

            return [
              unitType as UnitType,
              unitBeforeMinusCasualties.isNegative() ? new BigNumber(0) : unitBeforeMinusCasualties
            ];
          })
      ) as ArmyUnits;
    };

    const expectedArmy1 = createExpectedArmy(army1UnitsBefore, army1Casualties as ArmyUnits, 1);
    const expectedArmy2 = createExpectedArmy(army2UnitsBefore, army2Casualties as ArmyUnits, 2);

    await army1.updateState().then((tx) => tx.wait());
    await army2.updateState().then((tx) => tx.wait());

    const actualArmy1Units = await UnitHelper.getUnitsQuantity(await army1.getAddress(), [unitType1]);
    const actualArmy2Units = await UnitHelper.getUnitsQuantity(await army2.getAddress(), [unitType2]);

    for (let i = 0; i < unitTypes.length; i++) {
      expect(actualArmy1Units[unitTypes[i]]).eql(expectedArmy1[unitTypes[i]], `Army 1 ${unitTypes[i]} quantity is not correct`);
      expect(actualArmy2Units[unitTypes[i]]).eql(expectedArmy2[unitTypes[i]], `Army 2 ${unitTypes[i]} quantity is not correct`);
    }

    const battleDurationWinningArmyStunMultiplier = toLowBN(await registryInstance.getBattleDurationWinningArmyStunMultiplier());
    const battleDurationLosingArmyStunMultiplier = toLowBN(await registryInstance.getBattleDurationLosingArmyStunMultiplier());

    const expectedArmy1StunDuration = winningSide === 1
        ? battleDurationWinningArmyStunMultiplier.multipliedBy(battleDuration)
        : battleDurationLosingArmyStunMultiplier.multipliedBy(battleDuration);

    const expectedArmy2StunDuration = winningSide === 1
        ? battleDurationLosingArmyStunMultiplier.multipliedBy(battleDuration)
        : battleDurationWinningArmyStunMultiplier.multipliedBy(battleDuration);

    const actualArmy1StunDuration = await ArmyHelper.getStunDuration(army1);
    const actualArmy2StunDuration = await ArmyHelper.getStunDuration(army2);

    expect(actualArmy1StunDuration).eql(expectedArmy1StunDuration, 'Army 1 stun duration is not correct');
    expect(actualArmy2StunDuration).eql(expectedArmy2StunDuration, 'Army 2 stun duration is not correct');
  }
}
