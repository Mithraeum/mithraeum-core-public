import { ethers, getNamedAccounts } from "hardhat";
import { UserHelper } from "../../shared/helpers/UserHelper";
import { expect } from "chai";
import {toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import BigNumber from "bignumber.js";
import { WorldHelper } from "../../shared/helpers/WorldHelper";
import { BuildingType } from "../../shared/enums/buildingType";
import { ProductionHelper } from "../../shared/helpers/ProductionHelper";
import { EvmUtils } from "../../shared/helpers/EvmUtils";
import { BuildingHelper } from "../../shared/helpers/BuildingHelper";
import { ONE_DAY_IN_SECONDS } from "../../shared/constants/time";
import { WorkerHelper } from "../../shared/helpers/WorkerHelper";
import { ProsperityHelper } from '../../shared/helpers/ProsperityHelper';
import { RegionHelper } from '../../shared/helpers/RegionHelper';

export class WorkersCoreTest {
    public static async workersHireWithPriceDropTest(workerQuantity: number){
        const {testUser1} = await getNamedAccounts();

        const prosperityAmount = 50;
        const priceDropTime = 10;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

        const registryInstance = await WorldHelper.getRegistryInstance();

        const workerPriceDrop = await registryInstance.getWorkerPriceDrop();
        const workerPriceDropMultiplier = toLowBN(workerPriceDrop[0]).dividedBy(toLowBN(workerPriceDrop[1]));

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance,
            BuildingType.SMITHY,
            prosperityAmount
        );

        const workerPriceBeforeDrop = await WorkerHelper.getTotalWorkerPriceByRegion(regionInstance, 1);
        const timeBeforeDrop = await EvmUtils.getCurrentTime();

        await EvmUtils.increaseTime(priceDropTime);

        const timeAfterDrop = await EvmUtils.getCurrentTime();
        const passedTime = timeAfterDrop - timeBeforeDrop;

        const expectedWorkerPriceAfterDrop = workerPriceBeforeDrop.multipliedBy(workerPriceDropMultiplier.pow(passedTime));

        let workerPrice = await WorkerHelper.getTotalWorkerPriceByRegion(regionInstance, 1);
        expect(workerPrice).isInCloseRangeWith(expectedWorkerPriceAfterDrop, 'Worker price is not correct');

        let expectedTotalUnitPrice = workerPrice;
        for (let i = 1; i < workerQuantity; i++) {
            workerPrice = workerPrice.plus(workerPrice.multipliedBy(0.004));
            expectedTotalUnitPrice = expectedTotalUnitPrice.plus(workerPrice);
        }

        const totalWorkerPrice = await WorkerHelper.getTotalWorkerPriceByRegion(regionInstance, workerQuantity);
        expect(totalWorkerPrice).isInCloseRangeWith(expectedTotalUnitPrice, 'Total worker price is not correct');

        await userSettlementInstance.updateProsperityAmount().then((tx) => tx.wait());

        const workerQuantityBefore = await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance);
        const prosperityBalanceBefore = await ProsperityHelper.getProsperityBalance(userSettlementInstance);

        //workers hire
        await userSettlementInstance.swapProsperityForExactWorkers(
          transferableFromLowBN(new BigNumber(workerQuantity)),
          transferableFromLowBN(prosperityBalanceBefore)
        ).then((tx) => tx.wait());

        const expectedProsperityBalance = prosperityBalanceBefore.minus(totalWorkerPrice);
        const expectedWorkerQuantity = workerQuantityBefore.plus(workerQuantity);
        const expectedWorkerPrice = workerPrice.plus(workerPrice.multipliedBy(0.004));

        const actualProsperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        const actualWorkerQuantity = await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance);
        const actualWorkerPrice = await WorkerHelper.getTotalWorkerPriceByRegion(regionInstance, 1);

        expect(actualProsperityBalance).isInCloseRangeWith(expectedProsperityBalance, 'Prosperity balance is not correct');
        expect(actualWorkerQuantity).eql(expectedWorkerQuantity, 'Worker quantity is not correct');
        expect(actualWorkerPrice).isInCloseRangeWith(expectedWorkerPrice, 'Worker price is not correct');
    }

    public static async workersAssignTest(buildingType: BuildingType){
        const { testUser1 } = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const assignedWorkersBefore = toLowBN(await buildingInstance.getAssignedWorkers());
        const unassignedWorkersBefore = await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance);
        const workersCapOnCurrentLevel = toLowBN(await buildingInstance.getWorkersCapacity());

        const expectedAssignedWorkers = assignedWorkersBefore.plus(workersCapOnCurrentLevel);
        const expectedAvailableWorkers = unassignedWorkersBefore.minus(workersCapOnCurrentLevel);
        expect(assignedWorkersBefore).eql(new BigNumber(0), 'Assigned worker quantity is not correct');

        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
          ethers.ZeroAddress,
          await buildingInstance.getAddress(),
          transferableFromLowBN(workersCapOnCurrentLevel),
          [],
          []
        ).then((tx) => tx.wait());

        const actualAssignedWorkers = toLowBN(await buildingInstance.getAssignedWorkers());
        const actualUnassignedWorkers = await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance);

        expect(actualAssignedWorkers).eql(expectedAssignedWorkers, 'Assigned worker quantity is not correct');
        expect(actualUnassignedWorkers).eql(expectedAvailableWorkers, 'Unassigned worker quantity is not correct');
    }

    public static async impossibleWorkersAssignMoreThanMaxCapTest(buildingType: BuildingType){
        const { testUser1 } = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const workersCapOnCurrentLevel = toLowBN(await buildingInstance.getWorkersCapacity());

        await expect(
          userSettlementInstance.assignResourcesAndWorkersToBuilding(
            ethers.ZeroAddress,
            await buildingInstance.getAddress(),
            transferableFromLowBN(workersCapOnCurrentLevel.plus(1)),
            [],
            []
          ).then((tx) => tx.wait())
        ).to.be.revertedWith("SettlementCannotSendWorkersToBuildingOverMaximumAllowedCapacity()");
    }

    public static async workersWithdrawTest(buildingType: BuildingType) {
        const {testUser1} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const workersCapOnCurrentLevel = toLowBN(await buildingInstance.getWorkersCapacity());

        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
          ethers.ZeroAddress,
          await buildingInstance.getAddress(),
          transferableFromLowBN(workersCapOnCurrentLevel),
          [],
          []
        ).then((tx) => tx.wait());

        const assignedWorkersBefore = toLowBN(await buildingInstance.getAssignedWorkers());
        const unassignedWorkersBefore = await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance);

        await buildingInstance.removeResourcesAndWorkers(
          await userSettlementInstance.getAddress(),
          transferableFromLowBN(workersCapOnCurrentLevel),
          testUser1,
          [],
          []
        ).then((tx) => tx.wait());

        const expectedAssignedWorkers = assignedWorkersBefore.minus(workersCapOnCurrentLevel);
        const expectedUnassignedWorkers = unassignedWorkersBefore.plus(workersCapOnCurrentLevel);

        const actualAssignedWorkers = toLowBN(await buildingInstance.getAssignedWorkers());
        const actualUnassignedWorkers = await WorkerHelper.getUnassignedWorkerQuantity(userSettlementInstance);

        expect(actualAssignedWorkers).eql(expectedAssignedWorkers, 'Assigned worker quantity is not correct');
        expect(actualUnassignedWorkers).eql(expectedUnassignedWorkers, 'Unassigned worker quantity is not correct');
    }

    public static async impossibleWorkersWithdrawMoreThanAssignedTest(buildingType: BuildingType) {
        const { testUser1 } = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(userSettlementInstance, buildingType);

        const workersCapOnCurrentLevel = toLowBN(await buildingInstance.getWorkersCapacity());

        await userSettlementInstance.assignResourcesAndWorkersToBuilding(
          ethers.ZeroAddress,
          await buildingInstance.getAddress(),
          transferableFromLowBN(workersCapOnCurrentLevel),
          [],
          []
        ).then((tx) => tx.wait());

        const assignedWorkersBefore = toLowBN(await buildingInstance.getAssignedWorkers());
        expect(assignedWorkersBefore).eql(workersCapOnCurrentLevel, 'Assigned worker quantity is not correct');

        await expect(
          buildingInstance.removeResourcesAndWorkers(
            await userSettlementInstance.getAddress(),
            transferableFromLowBN(workersCapOnCurrentLevel.plus(1)),
            testUser1,
            [],
            []
          ).then((tx) => tx.wait())
        ).to.be.revertedWith("VM Exception while processing transaction: reverted with reason string 'ERC20: transfer amount exceeds balance'");
    }

    public static async impossibleWorkersHireWithoutProsperityTest() {
        const {testUser1} = await getNamedAccounts();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        const workerPrice = await WorkerHelper.getTotalWorkerPriceByRegion(regionInstance, 1);
        expect(prosperityBalance).lt(workerPrice, 'Prosperity balance is not correct');

        await expect(
          userSettlementInstance.swapProsperityForExactWorkers(
            transferableFromLowBN(new BigNumber(1)),
            transferableFromLowBN(prosperityBalance)
          ).then((tx) => tx.wait())
        ).to.be.revertedWith("CannotHireWorkersDueToTheirCostIsHigherThanMaxProsperityToSellSpecified()");
    }

    public static async workerPriceBeforeGameStartedTest() {
        const regionId = await RegionHelper.getRegionIdByNumber(1);
        const regionInstance = await RegionHelper.getRegionInstanceById(regionId);

        const workerPrice = await WorkerHelper.getTotalWorkerPriceByRegion(regionInstance, 1);

        await EvmUtils.increaseTime(100);

        const workerPriceBeforeStart = await WorkerHelper.getTotalWorkerPriceByRegion(regionInstance, 1);
        expect(workerPriceBeforeStart).eql(workerPrice, 'Worker price is not correct');

        await EvmUtils.increaseTime(ONE_DAY_IN_SECONDS);

        const workerPriceAfterStart = await WorkerHelper.getTotalWorkerPriceByRegion(regionInstance, 1);
        expect(workerPriceAfterStart).lt(workerPriceBeforeStart, 'Worker price is not correct');
    }

    public static async impossibleWorkersHireDueTransactionLimitTest() {
        const {testUser1} = await getNamedAccounts();

        const settlersAmount = 100;
        const resourcesAmount = 5000000000000;
        const resourceIds = await WorldHelper.getGameResources();

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const regionInstance = await RegionHelper.getRegionInstanceBySettlement(userSettlementInstance);

        await WorldHelper.mintWorkers(
            transferableFromLowBN(new BigNumber(settlersAmount)),
            await userSettlementInstance.getAddress()
        );

        for (let i = 0; i < resourceIds.length; i++) {
            await WorldHelper.mintResource(
                resourceIds[i],
                transferableFromLowBN(new BigNumber(resourcesAmount)),
                testUser1
            );
        }

        const registryInstance = await WorldHelper.getRegistryInstance();
        const maxAllowedWorkersToBuyPerTransaction = toLowBN(await registryInstance.getMaxAllowedWorkersToBuyPerTransaction());

        const totalWorkerPrice = await WorkerHelper.getTotalWorkerPriceByRegion(
            regionInstance,
            maxAllowedWorkersToBuyPerTransaction.plus(1).toNumber()
        );

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance,
            BuildingType.SMITHY,
            totalWorkerPrice.integerValue(BigNumber.ROUND_CEIL).toNumber()
        );

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);

        await expect(
            userSettlementInstance.swapProsperityForExactWorkers(
                transferableFromLowBN(maxAllowedWorkersToBuyPerTransaction.plus(1)),
                transferableFromLowBN(prosperityBalance)
            ).then((tx) => tx.wait())
        ).to.be.revertedWith("CannotHireWorkersExceedingTransactionLimit()");
    }
}
