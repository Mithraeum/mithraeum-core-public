import {ethers, getNamedAccounts} from "hardhat";
import {UserHelper} from "../../shared/helpers/UserHelper";
import {Battle__factory} from "../../typechain-types";
import {toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import BigNumber from "bignumber.js";
import {expect} from "chai";
import {ResourceHelper} from "../../shared/helpers/ResourceHelper";
import {UnitType} from "../../shared/enums/unitType";
import {ResourceType} from "../../shared/enums/resourceType";
import {SettlementHelper} from "../../shared/helpers/SettlementHelper";
import {UnitHelper} from "../../shared/helpers/UnitHelper";
import {WorldHelper} from "../../shared/helpers/WorldHelper";
import {EvmUtils} from "../../shared/helpers/EvmUtils";
import {MovementHelper} from "../../shared/helpers/MovementHelper";
import {ONE_DAY_IN_SECONDS} from "../../shared/constants/time";
import {BuildingHelper} from "../../shared/helpers/BuildingHelper";
import {WorkerHelper} from "../../shared/helpers/WorkerHelper";
import {FortHelper} from "../../shared/helpers/FortHelper";
import {TokenUtils} from "../../shared/helpers/TokenUtils";
import {ArmyHelper} from "../../shared/helpers/ArmyHelper";
import {ProsperityHelper} from '../../shared/helpers/ProsperityHelper';
import {RegionHelper} from '../../shared/helpers/RegionHelper';

export class UnitsCoreTest {
  public static async unitsHireWithPriceDropTest(unitType: UnitType, unitQuantity: number) {
    const { testUser1 } = await getNamedAccounts();

    const priceDropTime = 10;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    const unitTypeId = UnitHelper.getUnitTypeId(unitType);
    const priceDrop = await registryInstance.getUnitPriceDropByUnitTypeId(unitTypeId);
    const priceDropMultiplier = toLowBN(priceDrop[0]).dividedBy(toLowBN(priceDrop[1]));

    const resourceQuantityBefore = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.INGOT);
    const unitQuantityBefore = await UnitHelper.getUnitQuantity(await userSettlementInstance.army(), unitType);

    const unitPriceBeforeDrop = await UnitHelper.getTotalUnitPriceByRegion(regionInstance, unitType, 1);
    const timeBeforeDrop = await EvmUtils.getCurrentTime();

    await EvmUtils.increaseTime(priceDropTime);

    const timeAfterDrop = await EvmUtils.getCurrentTime();
    const passedTime = timeAfterDrop - timeBeforeDrop;

    const expectedUnitPriceAfterDrop = unitPriceBeforeDrop.multipliedBy(priceDropMultiplier.pow(passedTime));

    let unitPriceAfterDrop = await UnitHelper.getTotalUnitPriceByRegion(regionInstance, unitType, 1);
    expect(unitPriceAfterDrop).isInCloseRangeWith(expectedUnitPriceAfterDrop, 'Unit price is not correct');

    let expectedTotalUnitPrice = unitPriceAfterDrop;
    for (let i = 1; i < unitQuantity; i++) {
      unitPriceAfterDrop = unitPriceAfterDrop.plus(unitPriceAfterDrop.multipliedBy(0.004));
      expectedTotalUnitPrice = expectedTotalUnitPrice.plus(unitPriceAfterDrop);
    }

    const totalUnitPrice = await UnitHelper.getTotalUnitPriceByRegion(regionInstance, unitType, unitQuantity);
    expect(totalUnitPrice).isInCloseRangeWith(expectedTotalUnitPrice, 'Total unit price is not correct');

    const army = await SettlementHelper.getArmy(userSettlementInstance);

    //units hire
    expect(await UnitHelper.isHirePossible(army, [unitType], unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, [unitType], unitQuantity);

    const expectedResourceQuantity = resourceQuantityBefore.minus(totalUnitPrice);
    const expectedUnitQuantity = unitQuantityBefore.plus(unitQuantity);
    const expectedUnitPrice = unitPriceAfterDrop.plus(unitPriceAfterDrop.multipliedBy(0.004));

    const actualResourceQuantity = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.INGOT);
    const actualUnitQuantity = await UnitHelper.getUnitQuantity(await userSettlementInstance.army(), unitType);
    const actualUnitPrice = await UnitHelper.getTotalUnitPriceByRegion(regionInstance, unitType, 1);

    expect(actualResourceQuantity).isInCloseRangeWith(expectedResourceQuantity, 'Resource quantity is not correct');
    expect(actualUnitQuantity).eql(expectedUnitQuantity, 'Unit quantity is not correct');
    expect(actualUnitPrice).isInCloseRangeWith(expectedUnitPrice, 'Unit price is not correct');
  }

  public static async warriorsHireTest(unitQuantity: number) {
    const { testUser1 } = await getNamedAccounts();

    const unitType = UnitType.WARRIOR;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    const unassignedWorkersBefore =  await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance);
    const unitQuantityBefore = await UnitHelper.getUnitQuantity(await userSettlementInstance.army(), unitType);

    const totalUnitPrice = await UnitHelper.getTotalUnitPriceByRegion(regionInstance, unitType, unitQuantity);

    const army = await SettlementHelper.getArmy(userSettlementInstance);

    //units hire
    expect(await UnitHelper.isHirePossible(army, [unitType], unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, [unitType], unitQuantity);

    const expectedUnitQuantity = unitQuantityBefore.plus(unitQuantity);
    const expectedUnassignedWorkers = unassignedWorkersBefore.minus(totalUnitPrice);

    const actualUnassignedWorkers =  await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance);
    const actualUnitQuantity = await UnitHelper.getUnitQuantity(await userSettlementInstance.army(), unitType);

    expect(actualUnassignedWorkers)
        .isInCloseRangeWith(expectedUnassignedWorkers, 'Unassigned worker quantity is not correct');
    expect(actualUnitQuantity).eql(expectedUnitQuantity, 'Unit quantity is not correct');
  }

  public static async unitsHireByAnotherUserResourcesTest(unitType: UnitType, unitQuantity: number) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);
    const eraInstance = await WorldHelper.getCurrentEraInstance();

    const resourceQuantityBefore = await ResourceHelper.getResourceQuantity(testUser2, ResourceType.INGOT);
    const unitQuantityBefore = await UnitHelper.getUnitQuantity(await userSettlementInstance.army(), unitType);

    const unitPrice = await UnitHelper.getTotalUnitPriceByRegion(regionInstance, unitType, 1);
    const totalUnitPrice = await UnitHelper.getTotalUnitPriceByRegion(regionInstance, unitType, unitQuantity);

    const ingotTypeId = ResourceHelper.getResourceTypeId(ResourceType.INGOT);
    const tokenAddress = await eraInstance.resources(ingotTypeId);
    await TokenUtils.approveTokens(testUser2, tokenAddress, transferableFromLowBN(totalUnitPrice), testUser1);

    const maxAvailableUnitQuantityToHire = await UnitHelper.getMaxAvailableUnitQuantityToHire(userSettlementInstance);
    expect(new BigNumber(unitQuantity)).lte(maxAvailableUnitQuantityToHire, 'Unit quantity is not correct');

    //units hire
    await regionInstance.buyUnitsBatch(
      testUser2,
      await userSettlementInstance.getAddress(),
      [unitType].map(unitType => UnitHelper.getUnitTypeId(unitType)),
      [transferableFromLowBN(new BigNumber(unitQuantity))],
      [transferableFromLowBN(totalUnitPrice)]
    ).then((tx) => tx.wait());

    const expectedResourceQuantity = resourceQuantityBefore.minus(totalUnitPrice);
    const expectedUnitQuantity = unitQuantityBefore.plus(unitQuantity);
    const expectedUnitPrice = unitPrice.plus(unitPrice.multipliedBy(0.004));

    const actualResourceQuantity = await ResourceHelper.getResourceQuantity(testUser2, ResourceType.INGOT);
    const actualUnitQuantity = await UnitHelper.getUnitQuantity(await userSettlementInstance.army(), unitType);
    const actualUnitPrice = await UnitHelper.getTotalUnitPriceByRegion(regionInstance, unitType, 1);

    expect(actualResourceQuantity).isInCloseRangeWith(expectedResourceQuantity, 'Resource quantity is not correct');
    expect(actualUnitQuantity).eql(expectedUnitQuantity, 'Unit quantity is not correct');
    expect(actualUnitPrice).isInCloseRangeWith(expectedUnitPrice, 'Unit price is not correct');
  }

  public static async impossibleUnitsHireByAnotherUserWithoutApproveTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitType = UnitType.ARCHER;
    const unitQuantity = 2;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    const ingotQuantity = await ResourceHelper.getResourceQuantity(
        testUser2,
        ResourceType.INGOT,
    );

    const maxAvailableUnitQuantityToHire = await UnitHelper.getMaxAvailableUnitQuantityToHire(userSettlementInstance);
    expect(new BigNumber(unitQuantity)).lte(maxAvailableUnitQuantityToHire, 'Unit quantity is not correct');

    await expect(
      regionInstance.buyUnitsBatch(
        testUser2,
        await userSettlementInstance.getAddress(),
        [unitType].map(unitType => UnitHelper.getUnitTypeId(unitType)),
        [transferableFromLowBN(new BigNumber(unitQuantity))],
        [transferableFromLowBN(ingotQuantity)]
      ).then((tx) => tx.wait())
    ).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'ERC20: insufficient allowance'");
  }

  public static async impossibleUnitsHireMoreThanMaxLimitTest() {
    const { testUser1 } = await getNamedAccounts();

    const unitType = UnitType.WARRIOR;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const maxAvailableUnitQuantityToHire = await UnitHelper.getMaxAvailableUnitQuantityToHire(userSettlementInstance);

    const army = await SettlementHelper.getArmy(userSettlementInstance);
    await expect(
      UnitHelper.hireUnits(army, [unitType], maxAvailableUnitQuantityToHire.plus(1).toNumber())
    ).to.be.revertedWith("CannotHireUnitsExceedingArmyUnitsLimit()");
  }

  public static async impossibleUnitsHireDuringStunTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitType = UnitType.WARRIOR;
    const unitQuantity = 2;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, [unitType], unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, [unitType], unitQuantity);

    //maneuver to another settlement
    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    //maneuver back to home
    await MovementHelper.moveArmy(army, await userSettlementInstance1.position(), 0, false);

    expect(await UnitHelper.isHirePossible(army, [unitType], unitQuantity)).to.be.true;
    await expect(
        UnitHelper.hireUnits(army, [unitType], unitQuantity)
    ).to.be.revertedWith("CannotHireUnitsWhileArmyIsStunned()");
  }

  public static async impossibleUnitsHireIfIngotsToSellIsMoreThanSpecifiedLimitTest() {
    const { testUser1 } = await getNamedAccounts();

    const unitType = UnitType.ARCHER;
    const unitQuantity = 2;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    const totalUnitPrice = await UnitHelper.getTotalUnitPriceByRegion(regionInstance, unitType, unitQuantity);

    const maxAvailableUnitQuantityToHire = await UnitHelper.getMaxAvailableUnitQuantityToHire(userSettlementInstance);
    expect(new BigNumber(unitQuantity)).lte(maxAvailableUnitQuantityToHire, 'Unit quantity is not correct');

    await expect(
        regionInstance.buyUnitsBatch(
            ethers.ZeroAddress,
            await userSettlementInstance.getAddress(),
            [unitType].map(unitType => UnitHelper.getUnitTypeId(unitType)),
            [transferableFromLowBN(new BigNumber(unitQuantity))],
            [transferableFromLowBN(totalUnitPrice.multipliedBy(0.9))]
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("CannotHireUnitsDueToTheirCostIsHigherThanMaxTokensToSellSpecified()");
  }

  public static async unitsDemilitarizeTest(unitType: UnitType, unitQuantity: number) {
    const { testUser1 } = await getNamedAccounts();

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const unitTypeId = UnitHelper.getUnitTypeId(unitType);

    const army = await SettlementHelper.getArmy(userSettlementInstance);

    //units hire
    expect(await UnitHelper.isHirePossible(army, [unitType], unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, [unitType], unitQuantity);

    const unitQuantityBefore = await UnitHelper.getUnitQuantity(await userSettlementInstance.army(), unitType);

    const unassignedWorkersBefore = await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance);
    const prosperityBalanceBefore = await ProsperityHelper.getProsperityBalance(userSettlementInstance);

    //units demilitarize
    await army.demilitarize(
      [unitTypeId],
      [transferableFromLowBN(new BigNumber(unitQuantity))]
    ).then((tx) => tx.wait());

    const expectedUnitQuantity = unitQuantityBefore.minus(unitQuantity);

    const actualUnitQuantity = await UnitHelper.getUnitQuantity(await userSettlementInstance.army(), unitType);
    expect(actualUnitQuantity).eql(expectedUnitQuantity, 'Unit quantity is not correct');

    if (unitType === UnitType.WARRIOR) {
      const workersForUnitLiquidation = toLowBN(await registryInstance.getWorkersForUnitLiquidation(unitTypeId));
      const expectedUnassignedWorkers = unassignedWorkersBefore.plus((workersForUnitLiquidation).multipliedBy(unitQuantity));

      const actualUnassignedWorkers = await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance);
      expect(actualUnassignedWorkers).eql(expectedUnassignedWorkers, 'Unassigned worker quantity is not correct');
    } else {
      const prosperityForDemilitarization = toLowBN(await registryInstance.getProsperityForUnitLiquidation(unitTypeId));
      const expectedProsperityBalance = prosperityBalanceBefore.plus((prosperityForDemilitarization).multipliedBy(unitQuantity));

      const actualProsperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
      expect(actualProsperityBalance).eql(expectedProsperityBalance, 'Prosperity balance is not correct');
    }
  }

  public static async unitsDemilitarizeOnAnotherSettlementTest(unitType: UnitType, unitQuantity: number) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const registryInstance = await WorldHelper.getRegistryInstance();

    const unitTypeId = UnitHelper.getUnitTypeId(unitType);
    const prosperityForDemilitarization = toLowBN(await registryInstance.getProsperityForUnitLiquidation(unitTypeId));

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, [unitType], unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, [unitType], unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    const unitQuantityBefore = await UnitHelper.getUnitQuantity(await userSettlementInstance1.army(), unitType);
    const prosperityBalanceBefore = await ProsperityHelper.getProsperityBalance(userSettlementInstance2);

    await army.demilitarize(
      [unitTypeId],
      [transferableFromLowBN(new BigNumber(unitQuantity))]
    ).then((tx) => tx.wait());

    const expectedUnitQuantity = unitQuantityBefore.minus(unitQuantity);
    const expectedProsperityBalance = prosperityBalanceBefore.plus((prosperityForDemilitarization).multipliedBy(unitQuantity));

    const actualUnitQuantity = await UnitHelper.getUnitQuantity(await userSettlementInstance1.army(), unitType);
    const actualProsperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance2);

    expect(actualUnitQuantity).eql(expectedUnitQuantity, 'Unit quantity is not correct');
    expect(actualProsperityBalance).eql(expectedProsperityBalance, 'Prosperity balance is not correct');
  }

  public static async impossibleUnitsDemilitarizeMoreThanAvailableTest() {
    const { testUser1 } = await getNamedAccounts();

    const unitType = UnitType.WARRIOR;
    const unitQuantity = 2;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

    const army = await SettlementHelper.getArmy(userSettlementInstance);

    //units hire
    expect(await UnitHelper.isHirePossible(army, [unitType], unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, [unitType], unitQuantity);

    await expect(
      army.demilitarize(
        [unitType].map(unitType => UnitHelper.getUnitTypeId(unitType)),
        [transferableFromLowBN(new BigNumber(unitQuantity + 1))]
      ).then((tx) => tx.wait())
    ).to.be.revertedWith("NotEnoughUnitsForDemilitarization()");
  }

  public static async impossibleUnitsDemilitarizeDuringBattleTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitType = UnitType.WARRIOR;
    const unitQuantity = 2;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    expect(await UnitHelper.isHirePossible(army1, [unitType], unitQuantity)).to.be.true;
    expect(await UnitHelper.isHirePossible(army2, [unitType], unitQuantity)).to.be.true;

    await UnitHelper.hireUnits(army1, [unitType], unitQuantity);
    await UnitHelper.hireUnits(army2, [unitType], unitQuantity);

    await MovementHelper.moveArmy(army1, await userSettlementInstance2.position(), 0, true);

    await army1.beginBattle(
      await army2.getAddress(),
      [unitType].map(unitType => UnitHelper.getUnitTypeId(unitType)),
      [transferableFromLowBN(new BigNumber(unitQuantity))]
    ).then((tx) => tx.wait());

    await expect(
      army1.demilitarize(
        [unitType].map(unitType => UnitHelper.getUnitTypeId(unitType)),
        [transferableFromLowBN(new BigNumber(unitQuantity))]
      ).then((tx) => tx.wait())
    ).to.be.revertedWith("ArmyIsInBattle()");
  }

  public static async impossibleUnitsDemilitarizeDuringStunTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitType = UnitType.WARRIOR;
    const unitQuantity = 2;

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, [unitType], unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, [unitType], unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, false);

    await expect(
      army.demilitarize(
        [unitType].map(unitType => UnitHelper.getUnitTypeId(unitType)),
        [transferableFromLowBN(new BigNumber(unitQuantity))]
      ).then((tx) => tx.wait())
    ).to.be.revertedWith("ArmyIsStunned()");
  }

  public static async unitsHireDuringBattleTest(unitType: UnitType) {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 1;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
    const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

    await army1.beginBattle(
      await army2.getAddress(),
      unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
      unitTypes.map(_ => transferableFromLowBN(new BigNumber(2)))
    ).then((tx) => tx.wait());

    const battleInstance = Battle__factory.connect(await army1.battle(), army1.runner);

    const unitQuantityBefore = await UnitHelper.getUnitQuantity(await userSettlementInstance2.army(), unitType);
    const unitQuantityInBattleBefore = toLowBN(await battleInstance.sideUnitsAmount(2, UnitHelper.getUnitTypeId(unitType)));

    //units hire
    expect(await UnitHelper.isHirePossible(army2, [unitType], unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army2, [unitType], unitQuantity);

    const expectedUnitQuantity = unitQuantityBefore.plus(unitQuantity);

    const actualUnitQuantity = await UnitHelper.getUnitQuantity(await userSettlementInstance2.army(), unitType);
    const unitQuantityInBattleAfter = toLowBN(await battleInstance.sideUnitsAmount(2, UnitHelper.getUnitTypeId(unitType)));

    expect(actualUnitQuantity).eql(expectedUnitQuantity, 'Unit quantity is not correct');
    expect(unitQuantityInBattleAfter).eql(unitQuantityInBattleBefore, 'Unit quantity in battle is not correct');
  }

  public static async impossibleUnitsHireWithoutResourcesTest() {
    const { testUser1 } = await getNamedAccounts();

    const unitType = UnitType.ARCHER;
    const maxIngotQuantity = 1000;
    const unitQuantity = 2;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

    const resourceQuantity = await ResourceHelper.getResourceQuantity(testUser1, ResourceType.INGOT);
    const totalUnitPrice = await UnitHelper.getTotalUnitPriceByRegion(regionInstance, unitType, unitQuantity);

    const army = await SettlementHelper.getArmy(userSettlementInstance);

    expect(await UnitHelper.isHirePossible(army, [unitType], unitQuantity)).to.be.true;
    expect(resourceQuantity).lt(totalUnitPrice, 'Resource quantity is not correct');

    await expect(
        regionInstance.buyUnitsBatch(
            ethers.ZeroAddress,
            await userSettlementInstance.getAddress(),
            [unitType].map(unitType => UnitHelper.getUnitTypeId(unitType)),
            [transferableFromLowBN(new BigNumber(unitQuantity))],
            [transferableFromLowBN(new BigNumber(maxIngotQuantity))]
        ).then((tx) => tx.wait())
    ).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'ERC20: burn amount exceeds balance'");
  }

  public static async impossibleUnitsHireOnAnotherSettlementTest() {
    const { testUser1, testUser2 } = await getNamedAccounts();

    const unitQuantity = 1;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

    const army = await SettlementHelper.getArmy(userSettlementInstance1);

    expect(await UnitHelper.isHirePossible(army, unitTypes, unitQuantity)).to.be.true;
    await UnitHelper.hireUnits(army, unitTypes, unitQuantity);

    await MovementHelper.moveArmy(army, await userSettlementInstance2.position(), 0, true);

    await expect(
        UnitHelper.hireUnits(army, unitTypes, unitQuantity)
    ).to.be.revertedWith("CannotHireUnitsWhileArmyIsNotOnHomePosition()");
  }

  public static async impossibleUnitsHireFromAnotherRegionTest() {
    const { testUser1 } = await getNamedAccounts();

    const unitQuantity = 1;

    const gameUnits = await WorldHelper.getGameUnits();
    const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

    const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser1, 2);

    const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance2);

    const ingotQuantity = await ResourceHelper.getResourceQuantity(
        testUser1,
        ResourceType.INGOT,
    );

    const maxAvailableUnitQuantityToHire = await UnitHelper.getMaxAvailableUnitQuantityToHire(userSettlementInstance1);
    expect(new BigNumber(unitQuantity).multipliedBy(unitTypes.length))
        .lte(maxAvailableUnitQuantityToHire, 'Unit quantity is not correct');

    await expect(
      regionInstance.buyUnitsBatch(
        ethers.ZeroAddress,
        await userSettlementInstance1.getAddress(),
        unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
        unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity))),
        unitTypes.map(_ => transferableFromLowBN(ingotQuantity))
      ).then((tx) => tx.wait())
    ).to.be.revertedWith("CannotHireUnitsForArmyWhichSettlementDoesNotBelongToRelatedRegion()");
  }

  public static async unitPriceBeforeGameStartedTest() {
    const unitType = UnitType.ARCHER;

    const regionId = await RegionHelper.getRegionIdByNumber(1);
    const regionInstance = await RegionHelper.getRegionInstanceById(regionId);

    const unitPrice = await UnitHelper.getTotalUnitPriceByRegion(regionInstance, unitType, 1);

    await EvmUtils.increaseTime(100);

    const unitPriceBeforeStart = await UnitHelper.getTotalUnitPriceByRegion(regionInstance, unitType, 1);
    expect(unitPriceBeforeStart).eql(unitPrice, 'Unit price is not correct');

    await EvmUtils.increaseTime(ONE_DAY_IN_SECONDS);

    const unitPriceAfterStart = await UnitHelper.getTotalUnitPriceByRegion(regionInstance, unitType, 1);
    expect(unitPriceAfterStart).lt(unitPriceBeforeStart, 'Unit price is not correct');
  }

  public static async armySelfStunTest() {
    const { testUser1 } = await getNamedAccounts();
    const stunDuration = 100;

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const army = await SettlementHelper.getArmy(userSettlementInstance);

    const stunDurationBefore = await ArmyHelper.getStunDuration(army);
    expect(stunDurationBefore).eql(new BigNumber(0), 'Stun duration is not correct');

    await army.applySelfStun(stunDuration).then((tx) => tx.wait());

    const stunDurationAfter = await ArmyHelper.getStunDuration(army);
    expect(stunDurationAfter).eql(stunDurationBefore.plus(stunDuration), 'Stun duration is not correct');
  }

  public static async impossibleUnitsHireDueTransactionLimitTest() {
    const {testUser1} = await getNamedAccounts();

    const buildingLevel = 21;
    const assignWorkerQuantity = 10;
    const unitTypes = [UnitType.ARCHER];

    const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
    const fort = await SettlementHelper.getFort(userSettlementInstance);

    const registryInstance = await WorldHelper.getRegistryInstance();
    const maxAllowedUnitsToBuyPerTransaction = toLowBN(await registryInstance.getMaxAllowedUnitsToBuyPerTransaction());

    await BuildingHelper.upgradeBuildingToSpecifiedLevel(fort, buildingLevel, true);

    const actualMaxHealth = toLowBN(await fort.getMaxHealthOnLevel(buildingLevel));
    await FortHelper.repairFort(userSettlementInstance, assignWorkerQuantity, actualMaxHealth);

    const maxAvailableUnitQuantityToHire = await UnitHelper.getMaxAvailableUnitQuantityToHire(userSettlementInstance);
    expect(maxAvailableUnitQuantityToHire).gt(maxAllowedUnitsToBuyPerTransaction, 'Unit quantity is not correct');

    const army = await SettlementHelper.getArmy(userSettlementInstance);

    await expect(
        UnitHelper.hireUnits(army, unitTypes, maxAvailableUnitQuantityToHire.integerValue(BigNumber.ROUND_FLOOR).toNumber())
    ).to.be.revertedWith("CannotHireUnitsExceedingTransactionLimit()");
  }
}
