import {ethers, getNamedAccounts} from "hardhat";
import {UserHelper} from "../../shared/helpers/UserHelper";
import {EvmUtils} from "../../shared/helpers/EvmUtils";
import {MovementHelper} from "../../shared/helpers/MovementHelper";
import {toLowBN, transferableFromLowBN} from "../../scripts/utils/const";
import {WorldHelper} from "../../shared/helpers/WorldHelper";
import BigNumber from "bignumber.js";
import {BuildingType} from "../../shared/enums/buildingType";
import {expect} from "chai";
import {ProductionHelper} from "../../shared/helpers/ProductionHelper";
import {SettlementHelper} from "../../shared/helpers/SettlementHelper";
import {CaptureHelper} from "../../shared/helpers/CaptureHelper";
import {DEFAULT_BANNER_NAME} from "../../shared/constants/banners";
import {FortHelper} from "../../shared/helpers/FortHelper";
import {BuildingHelper} from "../../shared/helpers/BuildingHelper";
import {UnitType} from "../../shared/enums/unitType";
import {ensureSettlementCreated} from "../../shared/fixtures/common/ensureSettlementCreated";
import {UnitHelper} from "../../shared/helpers/UnitHelper";
import {Battle__factory} from "../../typechain-types";
import {BattleHelper} from "../../shared/helpers/BattleHelper";
import {ProsperityHelper} from '../../shared/helpers/ProsperityHelper';
import {RegionHelper} from '../../shared/helpers/RegionHelper';

export class TileCaptureCoreTest {
    public static async tileCaptureTest(buildingType: BuildingType, regionNumber: number) {
        const {testUser1} = await getNamedAccounts();

        const assignResourceQuantity = 5000;
        const productionTime = 1000;
        const prosperityStake = 10;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(
            userSettlementInstance,
            buildingType
        );

        const registryInstance = await WorldHelper.getRegistryInstance();
        const necessaryProsperityPercentForClaimingTileCapture = toLowBN(
            await registryInstance.getNecessaryProsperityPercentForClaimingTileCapture()
        );

        const tilePosition = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            buildingType,
            regionNumber
        );
        const actualWorkersCap = toLowBN(await buildingInstance.getWorkersCapacity());

        const productionConfig = await buildingInstance.getConfig();
        const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);

        const tileBonus = await RegionHelper.getTileBonusByPosition(tilePosition);
        const [advancedProductionTileBonusTypeId, advancedProductionTileBonusPercent] =
            await registryInstance.getAdvancedProductionTileBonusByVariation(tileBonus.tileBonusVariation);

        expect(tileBonus.tileBonusType).eql(BigInt(1), 'Tile bonus type is not correct');
        expect(BuildingHelper.getBuildingTypeId(buildingType))
            .eql(advancedProductionTileBonusTypeId, 'Bonus type id is not correct');

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance,
            BuildingType.SMITHY,
            prosperityStake
        );

        await userSettlementInstance.modifyBuildingsProduction(
            [
                {
                    buildingTypeId: await buildingInstance.buildingTypeId(),
                    workersAmount: transferableFromLowBN(actualWorkersCap),
                    isTransferringWorkersFromBuilding: false,
                    resources: spendingResourceConfigs.map(value => {
                        return {
                            resourceTypeId: value.resourceTypeId,
                            resourcesAmount: transferableFromLowBN(new BigNumber(assignResourceQuantity)),
                            resourcesOwnerOrResourcesReceiver: ethers.ZeroAddress,
                            isTransferringResourcesFromBuilding: false
                        }
                    })
                }
            ]
        ).then((tx) => tx.wait());
        // await userSettlementInstance
        //     .assignResourcesAndWorkersToBuilding(
        //         ethers.ZeroAddress,
        //         await buildingInstance.getAddress(),
        //         transferableFromLowBN(actualWorkersCap),
        //         spendingResourceConfigs.map((value) => value.resourceTypeId),
        //         spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
        //     )
        //     .then((tx) => tx.wait());

        const productionPerSecond = await ProductionHelper.getProductionPerSecond(
            userSettlementInstance,
            buildingType,
            productionTime
        );

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        const assignedWorkersBefore = toLowBN(await buildingInstance.getAssignedWorkers());

        expect(prosperityBalance).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');
        await CaptureHelper.captureTile(userSettlementInstance, tilePosition, prosperityStake);

        const prosperityBalanceBeforeClaim = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        expect(prosperityBalanceBeforeClaim).gte(
            necessaryProsperityPercentForClaimingTileCapture
                .multipliedBy(prosperityStake), 'Prosperity balance is not correct'
        );

        await userSettlementInstance.claimCapturedTile(tilePosition).then((tx) => tx.wait());

        const assignedWorkersAfter = toLowBN(await buildingInstance.getAssignedWorkers());
        expect(assignedWorkersAfter).eql(
            assignedWorkersBefore.minus(
                assignedWorkersBefore
                    .multipliedBy(toLowBN(advancedProductionTileBonusPercent))
                    .integerValue(BigNumber.ROUND_DOWN)
            ), 'Worker Quantity is not correct'
        );

        await expect(
            userSettlementInstance.modifyBuildingsProduction(
                [
                    {
                        buildingTypeId: await buildingInstance.buildingTypeId(),
                        workersAmount: transferableFromLowBN(actualWorkersCap.minus(assignedWorkersAfter)),
                        isTransferringWorkersFromBuilding: false,
                        resources: []
                    }
                ]
            ).then((tx) => tx.wait())

            // userSettlementInstance
            //     .assignResourcesAndWorkersToBuilding(
            //         ethers.ZeroAddress,
            //         await buildingInstance.getAddress(),
            //         transferableFromLowBN(actualWorkersCap.minus(assignedWorkersAfter)),
            //         [],
            //         []
            //     )
            //     .then((tx) => tx.wait())
        ).to.be.revertedWith(
            "SettlementCannotSendWorkersToBuildingOverMaximumAllowedCapacity()"
        );

        const newProductionPerSecond = await ProductionHelper.getProductionPerSecond(
            userSettlementInstance,
            buildingType,
            productionTime
        );
        expect(newProductionPerSecond).eql(productionPerSecond, 'Production per second is not correct');
    }

    public static async fortTileCaptureTest(regionNumber: number) {
        const {testUser1, testUser2} = await getNamedAccounts();

        const assignResourceQuantity = 5000;
        const regenerationTime = 100;
        const prosperityStake = 5;
        const unitQuantity = 1;

        const gameUnits = await WorldHelper.getGameUnits();
        const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));

        const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

        const registryInstance = await WorldHelper.getRegistryInstance();
        const necessaryProsperityPercentForClaimingTileCapture = toLowBN(
            await registryInstance.getNecessaryProsperityPercentForClaimingTileCapture()
        );

        const army = await SettlementHelper.getArmy(userSettlementInstance1);
        const fort = await SettlementHelper.getFort(userSettlementInstance2);

        const tilePosition = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            BuildingType.FORT,
            regionNumber,
            true
        );

        const actualWorkersCap = toLowBN(await fort.getWorkersCapacity());

        const productionConfig = await fort.getConfig();
        const spendingResourceConfigs = productionConfig.filter((config) => !config.isProducing);

        const tileBonus = await RegionHelper.getTileBonusByPosition(tilePosition);
        const [advancedProductionTileBonusTypeId, advancedProductionTileBonusPercent] =
            await registryInstance.getAdvancedProductionTileBonusByVariation(tileBonus.tileBonusVariation);

        expect(tileBonus.tileBonusType).eql(BigInt(1), 'Tile bonus type is not correct');
        expect(BuildingHelper.getBuildingTypeId(BuildingType.FORT))
            .eql(advancedProductionTileBonusTypeId, 'Bonus type id is not correct');

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance2,
            BuildingType.SMITHY,
            prosperityStake
        );

        await army.modifySiege(
            unitTypes.map(unitType => UnitHelper.getUnitTypeId(unitType)),
            unitTypes.map(_ => true),
            unitTypes.map(_ => transferableFromLowBN(new BigNumber(unitQuantity))),
            transferableFromLowBN(new BigNumber(1))
        ).then((tx) => tx.wait());

        const destructionTime = await FortHelper.getSettlementFortDestructionTime(userSettlementInstance2);
        await EvmUtils.increaseTime(destructionTime);

        await userSettlementInstance2.modifyBuildingsProduction(
            [
                {
                    buildingTypeId: await fort.buildingTypeId(),
                    workersAmount: transferableFromLowBN(actualWorkersCap),
                    isTransferringWorkersFromBuilding: false,
                    resources: spendingResourceConfigs.map(value => {
                        return {
                            resourceTypeId: value.resourceTypeId,
                            resourcesAmount: transferableFromLowBN(new BigNumber(assignResourceQuantity)),
                            resourcesOwnerOrResourcesReceiver: ethers.ZeroAddress,
                            isTransferringResourcesFromBuilding: false
                        }
                    })
                }
            ]
        ).then((tx) => tx.wait())
        // await userSettlementInstance2
        //     .assignResourcesAndWorkersToBuilding(
        //         ethers.ZeroAddress,
        //         await fort.getAddress(),
        //         transferableFromLowBN(actualWorkersCap),
        //         spendingResourceConfigs.map((value) => value.resourceTypeId),
        //         spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
        //     )
        //     .then((tx) => tx.wait());

        const regenerationPerSecond = await FortHelper.getFortRegenerationPerSecond(fort, regenerationTime);
        const assignedWorkersBefore = toLowBN(await fort.getAssignedWorkers());

        await userSettlementInstance2.modifyBuildingsProduction(
            [
                {
                    buildingTypeId: await fort.buildingTypeId(),
                    workersAmount: transferableFromLowBN(actualWorkersCap),
                    isTransferringWorkersFromBuilding: true,
                    resources: spendingResourceConfigs.map(value => {
                        return {
                            resourceTypeId: value.resourceTypeId,
                            resourcesAmount: transferableFromLowBN(new BigNumber(assignResourceQuantity)),
                            resourcesOwnerOrResourcesReceiver: testUser1,
                            isTransferringResourcesFromBuilding: true
                        }
                    })
                }
            ]
        ).then((tx) => tx.wait())
        // await fort
        //     .removeResourcesAndWorkers(
        //         await userSettlementInstance2.getAddress(),
        //         transferableFromLowBN(actualWorkersCap),
        //         testUser1,
        //         spendingResourceConfigs.map((value) => value.resourceTypeId),
        //         spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
        //     )
        //     .then((tx) => tx.wait());

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance2);
        expect(prosperityBalance).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');

        await CaptureHelper.captureTile(userSettlementInstance2, tilePosition, prosperityStake);

        const prosperityBalanceBeforeClaim = await ProsperityHelper.getProsperityBalance(userSettlementInstance2);
        expect(prosperityBalanceBeforeClaim).gte(
            necessaryProsperityPercentForClaimingTileCapture
                .multipliedBy(prosperityStake), 'Prosperity balance is not correct'
        );

        await userSettlementInstance2.modifyBuildingsProduction(
            [
                {
                    buildingTypeId: await fort.buildingTypeId(),
                    workersAmount: transferableFromLowBN(actualWorkersCap),
                    isTransferringWorkersFromBuilding: false,
                    resources: spendingResourceConfigs.map(value => {
                        return {
                            resourceTypeId: value.resourceTypeId,
                            resourcesAmount: transferableFromLowBN(new BigNumber(assignResourceQuantity)),
                            resourcesOwnerOrResourcesReceiver: ethers.ZeroAddress,
                            isTransferringResourcesFromBuilding: false
                        }
                    })
                }
            ]
        ).then((tx) => tx.wait())
        // await userSettlementInstance2
        //     .assignResourcesAndWorkersToBuilding(
        //         ethers.ZeroAddress,
        //         await fort.getAddress(),
        //         transferableFromLowBN(actualWorkersCap),
        //         spendingResourceConfigs.map((value) => value.resourceTypeId),
        //         spendingResourceConfigs.map((_) => transferableFromLowBN(new BigNumber(assignResourceQuantity)))
        //     )
        //     .then((tx) => tx.wait());

        await userSettlementInstance2.claimCapturedTile(tilePosition).then((tx) => tx.wait());

        const assignedWorkersAfter = toLowBN(await fort.getAssignedWorkers());
        expect(assignedWorkersAfter).eql(
            assignedWorkersBefore.minus(
                assignedWorkersBefore
                    .multipliedBy(toLowBN(advancedProductionTileBonusPercent))
                    .integerValue(BigNumber.ROUND_DOWN)
            ), 'Worker Quantity is not correct'
        );

        await expect(
            userSettlementInstance2.modifyBuildingsProduction(
                [
                    {
                        buildingTypeId: await fort.buildingTypeId(),
                        workersAmount: transferableFromLowBN(actualWorkersCap.minus(assignedWorkersAfter)),
                        isTransferringWorkersFromBuilding: false,
                        resources: []
                    }
                ]
            ).then((tx) => tx.wait())

            // userSettlementInstance2
            //     .assignResourcesAndWorkersToBuilding(
            //         ethers.ZeroAddress,
            //         await fort.getAddress(),
            //         transferableFromLowBN(actualWorkersCap.minus(assignedWorkersAfter)),
            //         [],
            //         []
            //     )
            //     .then((tx) => tx.wait())
        ).to.be.revertedWith(
            "SettlementCannotSendWorkersToBuildingOverMaximumAllowedCapacity()"
        );

        const newRegenerationPerSecond = await FortHelper.getFortRegenerationPerSecond(fort, regenerationTime);
        expect(newRegenerationPerSecond).eql(regenerationPerSecond, 'Regeneration per second is not correct');
    }

    public static async militaryTileCaptureTest(unitType: UnitType) {
        const {testUser1, testUser2} = await getNamedAccounts();

        const unitQuantity = 4;
        const prosperityStake = 5;
        const regionNumber = 1;

        const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

        const registryInstance = await WorldHelper.getRegistryInstance();

        const gameUnits = await WorldHelper.getGameUnits();
        const unitTypes = gameUnits.map(gameUnits => UnitHelper.getUnitTypeByUnitTypeId(gameUnits));
        const unitIndexByType = unitTypes.indexOf(unitType);

        const army1 = await SettlementHelper.getArmy(userSettlementInstance1);
        const army2 = await SettlementHelper.getArmy(userSettlementInstance2);

        expect(await UnitHelper.isHirePossible(army1, [unitType], unitQuantity)).to.be.true;
        expect(await UnitHelper.isHirePossible(army2, [unitType], unitQuantity)).to.be.true;

        await UnitHelper.hireUnits(army1, [unitType], unitQuantity);
        await UnitHelper.hireUnits(army2, [unitType], unitQuantity);

        const tilePosition = await RegionHelper.getPositionOfMilitaryTileBonusByUnitTypeInRegion(unitType, regionNumber);

        const tileBonus = await RegionHelper.getTileBonusByPosition(tilePosition);
        const [militaryTileBonusTypeId, militaryTileBonusPercent] =
            await registryInstance.getUnitBattleMultiplierTileBonusByVariation(tileBonus.tileBonusVariation);

        expect(tileBonus.tileBonusType).eql(BigInt(2), 'Tile bonus type is not correct');
        expect(UnitHelper.getUnitTypeId(unitType)).eql(militaryTileBonusTypeId, 'Bonus type id is not correct');

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance1,
            BuildingType.SMITHY,
            prosperityStake
        );

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance1);
        expect(prosperityBalance).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');

        await CaptureHelper.captureTile(userSettlementInstance1, tilePosition, prosperityStake);
        await userSettlementInstance1.claimCapturedTile(tilePosition).then((tx) => tx.wait());

        const isTileCaptured = await CaptureHelper.isTileCapturedBySettlement(
            tilePosition,
            userSettlementInstance1
        );
        expect(isTileCaptured).to.be.true;

        await MovementHelper.moveArmy(army1, await userSettlementInstance2.position(), 0, true);

        await army1.beginBattle(
            await army2.getAddress(),
            [UnitHelper.getUnitTypeId(unitType)],
            [transferableFromLowBN(new BigNumber(unitQuantity))]
        ).then((tx) => tx.wait());

        const battleInstance = Battle__factory.connect(await army1.battle(), army1.runner);

        const army1UnitsBefore = await UnitHelper.getUnitsQuantity(await army1.getAddress(), [unitType]);
        const army2UnitsBefore = await UnitHelper.getUnitsQuantity(await army2.getAddress(), [unitType]);

        const actualBattleDuration = await BattleHelper.getBattleDuration(battleInstance);
        await EvmUtils.increaseTime(actualBattleDuration);

        const militaryBonusMultiplier = new BigNumber(1).plus(toLowBN(militaryTileBonusPercent));

        const sideAUnits = await BattleHelper.getSideUnitsAmount(battleInstance, 1, [unitType]);
        expect(sideAUnits[unitType]).eql(
            militaryBonusMultiplier.multipliedBy(unitQuantity),
            "Unit quantity is not correct",
        );

        const sideBUnits = await BattleHelper.getSideUnitsAmount(battleInstance, 2, [unitType]);
        expect(sideAUnits[unitType]).gt(sideBUnits[unitType], "Unit quantity is not correct");

        const casualtiesStage1 = await battleInstance.calculateStage1Casualties();
        const casualtiesStage2 = await battleInstance.calculateStage2Casualties(
            [...casualtiesStage1._side1Casualties],
            [...casualtiesStage1._side2Casualties],
        );

        const casualtiesSideA = (toLowBN(casualtiesStage1._side1Casualties[unitIndexByType])
            .plus(toLowBN(casualtiesStage2._side1Casualties[unitIndexByType])));
        const casualtiesSideB = (toLowBN(casualtiesStage1._side2Casualties[unitIndexByType])
            .plus(toLowBN(casualtiesStage2._side2Casualties[unitIndexByType])));

        await battleInstance.endBattle().then((tx) => tx.wait());
        const winningSide = await battleInstance.winningSide();
        expect(winningSide).eql(BigInt(1), 'Winning side is not correct');

        await army1.updateState().then((tx) => tx.wait());
        await army2.updateState().then((tx) => tx.wait());

        const actualArmy1Units = await UnitHelper.getUnitsQuantity(await army1.getAddress(), [unitType]);
        const actualArmy2Units = await UnitHelper.getUnitsQuantity(await army2.getAddress(), [unitType]);

        const army1Casualties = casualtiesSideA.dividedBy(militaryBonusMultiplier).integerValue(BigNumber.ROUND_DOWN);
        const army2Casualties = casualtiesSideB.integerValue(BigNumber.ROUND_UP);

        expect(actualArmy1Units[unitType])
            .eql(army1UnitsBefore[unitType].minus(army1Casualties), `Army 1 ${unitType} quantity is not correct`);
        expect(actualArmy2Units[unitType])
            .eql(army2UnitsBefore[unitType].minus(army2Casualties), `Army 2 ${unitType} quantity is not correct`);
    }

    public static async impossibleTileCaptureWithoutProsperityTest() {
        const {testUser1} = await getNamedAccounts();

        const regionNumber = 1;
        const prosperityStake = 5;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

        const tilePosition = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            BuildingType.LUMBERMILL,
            regionNumber
        );

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        expect(prosperityBalance).lt(new BigNumber(prosperityStake), 'Prosperity balance is not correct');

        await expect(
            userSettlementInstance
                .beginTileCapture(tilePosition, transferableFromLowBN(new BigNumber(prosperityStake)))
                .then((tx) => tx.wait())
        ).to.be.revertedWith(
            "CannotBeginTileCaptureDueToNotHavingSpecifiedProsperity()"
        );
    }

    public static async impossibleTileCaptureByStakeLowerThanInitialProsperityStakeTest() {
        const {testUser1} = await getNamedAccounts();

        const regionNumber = 1;
        const prosperityStake = 1;
        const buildingType = BuildingType.LUMBERMILL;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

        const registryInstance = await WorldHelper.getRegistryInstance();

        const initialCaptureProsperityPerTileValue = toLowBN(await registryInstance.getInitialCaptureProsperityPerTileValue());
        const initialCaptureProsperityBasicValue = toLowBN(await registryInstance.getInitialCaptureProsperityBasicValue());

        const tilePosition = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            buildingType,
            regionNumber
        );

        const userSettlementPosition = await userSettlementInstance.position();
        const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(userSettlementPosition, tilePosition);
        const initialProsperityStake = initialCaptureProsperityBasicValue
            .plus(initialCaptureProsperityPerTileValue.multipliedBy(distanceBetweenPositions));

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance,
            buildingType,
            prosperityStake
        );

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        expect(prosperityBalance).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');
        expect(prosperityBalance).lt(initialProsperityStake, 'Prosperity balance is not correct');

        await expect(
            userSettlementInstance
                .beginTileCapture(tilePosition, transferableFromLowBN(new BigNumber(prosperityStake)))
                .then((tx) => tx.wait())
        ).to.be.revertedWith(
            "CannotBeginTileCaptureDueToNotReachedNextMinimumProsperityStake()"
        );
    }

    public static async impossibleTileClaimWithoutProsperityTest() {
        const {testUser1} = await getNamedAccounts();

        const regionNumber = 1;
        const prosperityStake = 60;
        const hireWorkerQuantity = 6;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

        const registryInstance = await WorldHelper.getRegistryInstance();
        const necessaryProsperityPercentForClaimingTileCapture = toLowBN(
            await registryInstance.getNecessaryProsperityPercentForClaimingTileCapture()
        );

        const tilePosition = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            BuildingType.LUMBERMILL,
            regionNumber
        );

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance,
            BuildingType.SMITHY,
            prosperityStake
        );

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        expect(prosperityBalance).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');

        await CaptureHelper.captureTile(userSettlementInstance, tilePosition, prosperityStake);

        const prosperityBalanceBeforeHire = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        expect(prosperityBalanceBeforeHire).gte(
            necessaryProsperityPercentForClaimingTileCapture
                .multipliedBy(prosperityStake), 'Prosperity balance is not correct'
        );

        //workers hire
        await userSettlementInstance
            .swapProsperityForExactWorkers(
                transferableFromLowBN(new BigNumber(hireWorkerQuantity)),
                transferableFromLowBN(prosperityBalanceBeforeHire)
            )
            .then((tx) => tx.wait());

        const prosperityBalanceBeforeClaim = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        expect(prosperityBalanceBeforeClaim).lt(
            necessaryProsperityPercentForClaimingTileCapture
                .multipliedBy(prosperityStake), 'Prosperity balance is not correct'
        );

        await expect(
            userSettlementInstance.claimCapturedTile(tilePosition).then((tx) => tx.wait())
        ).to.be.revertedWith(
            "ClaimTileCaptureCannotBeDoneWithoutNecessaryProsperity()"
        );
    }

    public static async impossibleTileClaimDuringCaptureTest() {
        const {testUser1} = await getNamedAccounts();

        const regionNumber = 1;
        const prosperityStake = 5;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

        const tilePosition = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            BuildingType.LUMBERMILL,
            regionNumber
        );

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance,
            BuildingType.SMITHY,
            prosperityStake
        );

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        expect(prosperityBalance).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');

        await userSettlementInstance
            .beginTileCapture(tilePosition, transferableFromLowBN(new BigNumber(prosperityStake)))
            .then((tx) => tx.wait());

        await expect(
            userSettlementInstance.claimCapturedTile(tilePosition).then((tx) => tx.wait())
        ).to.be.revertedWith(
            "ClaimTileCaptureCannotBeDoneAtThisTime()"
        );
    }

    public static async impossibleTilesCaptureAtTheSameTimeTest() {
        const {testUser1} = await getNamedAccounts();

        const regionNumber = 1;
        const prosperityStake = 5;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

        const tilePosition1 = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            BuildingType.LUMBERMILL,
            regionNumber
        );
        const tilePosition2 = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            BuildingType.SMITHY,
            regionNumber
        );

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance,
            BuildingType.SMITHY,
            prosperityStake
        );

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        expect(prosperityBalance).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');

        await userSettlementInstance
            .beginTileCapture(tilePosition1, transferableFromLowBN(new BigNumber(prosperityStake)))
            .then((tx) => tx.wait());

        await expect(
            userSettlementInstance
                .beginTileCapture(tilePosition2, transferableFromLowBN(new BigNumber(prosperityStake)))
                .then((tx) => tx.wait())
        ).to.be.revertedWith(
            "CannotBeginTileCaptureBySettlementWhichIsAlreadyCapturingTile()"
        );
    }

    public static async impossibleTileCaptureDueMaxLimitTest(tileBonusType: number) {
        const {testUser1} = await getNamedAccounts();

        const regionNumber = 2;
        const prosperityStake = 10;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

        const registryInstance = await WorldHelper.getRegistryInstance();
        const maxCapturedTilesForSettlement = Number(await registryInstance.getMaxCapturedTilesForSettlement(tileBonusType));

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance,
            BuildingType.SMITHY,
            prosperityStake
        );

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        expect(prosperityBalance).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');

        const allPositionsOfAdvancedProductionTileBonus = await RegionHelper.getPositionsOfTileBonusByRegionNumber(
            tileBonusType,
            maxCapturedTilesForSettlement + 1,
            regionNumber
        );

        for (let i = 0; i < maxCapturedTilesForSettlement; i++) {
            const tilePosition = allPositionsOfAdvancedProductionTileBonus[i];

            await CaptureHelper.captureTile(userSettlementInstance, tilePosition, prosperityStake);
            await userSettlementInstance.claimCapturedTile(tilePosition).then((tx) => tx.wait());
        }

        await expect(
            CaptureHelper.captureTile(
                userSettlementInstance,
                allPositionsOfAdvancedProductionTileBonus[maxCapturedTilesForSettlement],
                prosperityStake
            )
        ).to.be.revertedWith(
            "CannotBeginTileCaptureBySettlementAlreadyHavingMaximumCapturedTilesWithSameBonus()"
        );
    }

    public static async tileMaxBuffLimitTest() {
        const {testUser1} = await getNamedAccounts();

        const buildingType = BuildingType.SMITHY;
        const prosperityStake = 10;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(
            userSettlementInstance,
            buildingType
        );

        const registryInstance = await WorldHelper.getRegistryInstance();

        const maxAdvancedProductionTileBuff = toLowBN(await registryInstance.getMaxAdvancedProductionTileBuff());
        const actualWorkersCap = toLowBN(await buildingInstance.getWorkersCapacity());

        const tilePosition1 = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            buildingType,
            1
        );
        const tilePosition2 = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            buildingType,
            2
        );

        const tileBonus1 = await RegionHelper.getTileBonusByPosition(tilePosition1);
        const [advancedProductionTileBonusType1Id, advancedProductionTileBonusPercent1] =
            await registryInstance.getAdvancedProductionTileBonusByVariation(tileBonus1.tileBonusVariation);
        expect(BuildingHelper.getBuildingTypeId(buildingType))
            .eql(advancedProductionTileBonusType1Id, 'Building type id is not correct');

        const tileBonus2 = await RegionHelper.getTileBonusByPosition(tilePosition2);
        const [advancedProductionTileBonusType2Id, advancedProductionTileBonusPercent2] =
            await registryInstance.getAdvancedProductionTileBonusByVariation(tileBonus2.tileBonusVariation);
        expect(BuildingHelper.getBuildingTypeId(buildingType))
            .eql(advancedProductionTileBonusType2Id, 'Building type id is not correct');

        expect(toLowBN(advancedProductionTileBonusPercent1).plus(toLowBN(advancedProductionTileBonusPercent2)))
            .gt(maxAdvancedProductionTileBuff, 'Advanced Production Tile Buff is not correct');

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance,
            BuildingType.SMITHY,
            prosperityStake
        );

        await userSettlementInstance.modifyBuildingsProduction(
            [
                {
                    buildingTypeId: await buildingInstance.buildingTypeId(),
                    workersAmount: transferableFromLowBN(actualWorkersCap),
                    isTransferringWorkersFromBuilding: false,
                    resources: []
                }
            ]
        ).then((tx) => tx.wait())
        // await userSettlementInstance
        //     .assignResourcesAndWorkersToBuilding(
        //         ethers.ZeroAddress,
        //         await buildingInstance.getAddress(),
        //         transferableFromLowBN(actualWorkersCap),
        //         [],
        //         []
        //     )
        //     .then((tx) => tx.wait());

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        expect(prosperityBalance).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');

        const assignedWorkersBefore = toLowBN(await buildingInstance.getAssignedWorkers());

        await CaptureHelper.captureTile(userSettlementInstance, tilePosition1, prosperityStake);
        await userSettlementInstance.claimCapturedTile(tilePosition1).then((tx) => tx.wait());

        await CaptureHelper.captureTile(userSettlementInstance, tilePosition2, prosperityStake);
        await userSettlementInstance.claimCapturedTile(tilePosition2).then((tx) => tx.wait());

        const assignedWorkersAfter = toLowBN(await buildingInstance.getAssignedWorkers());
        expect(assignedWorkersAfter).eql(
            assignedWorkersBefore.minus(
                assignedWorkersBefore.multipliedBy(maxAdvancedProductionTileBuff).integerValue(BigNumber.ROUND_DOWN)
            ), 'Worker Quantity is not correct'
        );
    }

    public static async tileGiveUpTest() {
        const {testUser1} = await getNamedAccounts();

        const regionNumber = 1;
        const buildingType = BuildingType.SMITHY;
        const prosperityStake = 5;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(
            userSettlementInstance,
            buildingType
        );

        const registryInstance = await WorldHelper.getRegistryInstance();

        const tilePosition = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            buildingType,
            regionNumber
        );
        const tileBonus = await RegionHelper.getTileBonusByPosition(tilePosition);

        const [advancedProductionTileBonusTypeId, advancedProductionTileBonusPercent] =
            await registryInstance.getAdvancedProductionTileBonusByVariation(tileBonus.tileBonusVariation);
        expect(BuildingHelper.getBuildingTypeId(buildingType))
            .eql(advancedProductionTileBonusTypeId, 'Building type id is not correct');

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance,
            buildingType,
            prosperityStake
        );

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance);
        expect(prosperityBalance).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');

        //tile capture
        await CaptureHelper.captureTile(userSettlementInstance, tilePosition, prosperityStake);
        await userSettlementInstance.claimCapturedTile(tilePosition).then((tx) => tx.wait());

        const isTileCapturedBefore = await CaptureHelper.isTileCapturedBySettlement(
            tilePosition,
            userSettlementInstance
        );
        expect(isTileCapturedBefore).to.be.true;

        const assignedWorkersBefore = toLowBN(await buildingInstance.getAssignedWorkers());

        await userSettlementInstance.giveUpCapturedTile(tilePosition).then((tx) => tx.wait());

        const isTileCapturedAfter = await CaptureHelper.isTileCapturedBySettlement(
            tilePosition,
            userSettlementInstance
        );
        expect(isTileCapturedAfter).to.be.false;

        const assignedWorkersAfter = toLowBN(await buildingInstance.getAssignedWorkers());
        expect(assignedWorkersAfter).eql(
            assignedWorkersBefore.plus(
                assignedWorkersBefore
                    .multipliedBy(toLowBN(advancedProductionTileBonusPercent))
                    .integerValue(BigNumber.ROUND_DOWN)
            ), 'Worker Quantity is not correct'
        );
    }

    public static async tileCaptureByAnotherUserTest() {
        const {testUser1, testUser2} = await getNamedAccounts();

        const regionNumber = 1;
        const buildingType = BuildingType.SMITHY;
        const prosperityStake = 5;

        const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

        const tilePosition = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            buildingType,
            regionNumber
        );

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance1,
            buildingType,
            prosperityStake
        );
        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance2,
            buildingType,
            prosperityStake)
        ;

        const prosperityBalance1 = await ProsperityHelper.getProsperityBalance(userSettlementInstance1);
        const prosperityBalance2 = await ProsperityHelper.getProsperityBalance(userSettlementInstance2);

        expect(prosperityBalance1).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');
        expect(prosperityBalance2).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');

        //tile capture by testUser1
        await CaptureHelper.captureTile(userSettlementInstance1, tilePosition, prosperityStake);
        await userSettlementInstance1.claimCapturedTile(tilePosition).then((tx) => tx.wait());

        const isTileCapturedBefore1 = await CaptureHelper.isTileCapturedBySettlement(
            tilePosition,
            userSettlementInstance1
        );
        const isTileCapturedBefore2 = await CaptureHelper.isTileCapturedBySettlement(
            tilePosition,
            userSettlementInstance2
        );

        expect(isTileCapturedBefore1).to.be.true;
        expect(isTileCapturedBefore2).to.be.false;

        //tile capture by testUser2
        await CaptureHelper.captureTile(userSettlementInstance2, tilePosition, prosperityStake);
        await userSettlementInstance2.claimCapturedTile(tilePosition).then((tx) => tx.wait());

        const isTileCapturedAfter1 = await CaptureHelper.isTileCapturedBySettlement(
            tilePosition,
            userSettlementInstance1
        );
        const isTileCapturedAfter2 = await CaptureHelper.isTileCapturedBySettlement(
            tilePosition,
            userSettlementInstance2
        );

        expect(isTileCapturedAfter1).to.be.false;
        expect(isTileCapturedAfter2).to.be.true;
    }

    public static async cancelTileCaptureTest() {
        const {testUser1} = await getNamedAccounts();

        const regionNumber = 1;
        const buildingType = BuildingType.SMITHY;
        const prosperityStake = 25;
        const hireWorkerQuantity = 2;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);

        const registryInstance = await WorldHelper.getRegistryInstance();
        const tileCaptureCancellationFee = toLowBN(await registryInstance.getTileCaptureCancellationFee());

        const tilePosition = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            buildingType,
            regionNumber
        );

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance,
            buildingType,
            prosperityStake
        );

        const prosperityBalance = await ProsperityHelper.getRealProsperityBalance(userSettlementInstance);
        expect(prosperityBalance).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');

        await userSettlementInstance
            .beginTileCapture(tilePosition, transferableFromLowBN(new BigNumber(prosperityStake)))
            .then((tx) => tx.wait());

        const prosperityBalanceAfterCaptureStarted = await ProsperityHelper.getRealProsperityBalance(userSettlementInstance);

        //workers hire
        await userSettlementInstance
            .swapProsperityForExactWorkers(
                transferableFromLowBN(new BigNumber(hireWorkerQuantity)),
                transferableFromLowBN(prosperityBalanceAfterCaptureStarted)
            )
            .then((tx) => tx.wait());

        const prosperityBalanceBeforeCancel = await ProsperityHelper.getRealProsperityBalance(userSettlementInstance);
        expect(prosperityBalanceBeforeCancel)
            .lt(tileCaptureCancellationFee.multipliedBy(prosperityStake), 'Prosperity balance is not correct');

        await userSettlementInstance.cancelTileCapture(tilePosition).then((tx) => tx.wait());

        const prosperityBalanceAfterCancel = await ProsperityHelper.getRealProsperityBalance(userSettlementInstance);

        const isTileCaptured = await CaptureHelper.isTileCapturedBySettlement(
            tilePosition,
            userSettlementInstance
        );
        expect(isTileCaptured).to.be.false;

        expect(prosperityBalanceAfterCancel).isInCloseRangeWith(
            prosperityBalanceBeforeCancel.minus(tileCaptureCancellationFee
                .multipliedBy(prosperityStake)), 'Prosperity balance is not correct'
        );
    }

    public static async settlementPurchaseOnTileWithBonusTest() {
        const {testUser1} = await getNamedAccounts();

        const position = await RegionHelper.getPositionForSettlementInRegionByNumber(1, 5);
        const buildingType = BuildingType.FARM;

        const userSettlementInstance = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const buildingInstance = await BuildingHelper.getSettlementBuildingInstanceByType(
            userSettlementInstance,
            buildingType
        );

        const registryInstance = await WorldHelper.getRegistryInstance();

        const actualWorkersCap = toLowBN(await buildingInstance.getWorkersCapacity());
        const tileBonus = await RegionHelper.getTileBonusByPosition(position);

        const [advancedProductionTileBonusTypeId, advancedProductionTileBonusPercent] =
            await registryInstance.getAdvancedProductionTileBonusByVariation(tileBonus.tileBonusVariation);
        expect(tileBonus.tileBonusType).eql(BigInt(1), 'Tile bonus type is not correct');
        expect(BuildingHelper.getBuildingTypeId(buildingType))
            .eql(advancedProductionTileBonusTypeId, 'Building type id is not correct');

        await userSettlementInstance.modifyBuildingsProduction(
            [
                {
                    buildingTypeId: await buildingInstance.buildingTypeId(),
                    workersAmount: transferableFromLowBN(actualWorkersCap),
                    isTransferringWorkersFromBuilding: false,
                    resources: []
                }
            ]
        ).then((tx) => tx.wait())
        // await userSettlementInstance
        //     .assignResourcesAndWorkersToBuilding(
        //         ethers.ZeroAddress,
        //         await buildingInstance.getAddress(),
        //         transferableFromLowBN(actualWorkersCap),
        //         [],
        //         []
        //     )
        //     .then((tx) => tx.wait());

        const assignedWorkersBefore = toLowBN(await buildingInstance.getAssignedWorkers());

        await ensureSettlementCreated(testUser1, position, DEFAULT_BANNER_NAME);

        const assignedWorkersAfter = toLowBN(await buildingInstance.getAssignedWorkers());
        expect(assignedWorkersAfter).eql(assignedWorkersBefore, 'Worker Quantity is not correct');
    }

    public static async ownTileCaptureTest() {
        const {testUser1, testUser2} = await getNamedAccounts();

        const regionNumber = 1;
        const buildingType = BuildingType.SMITHY;
        const prosperityStake = 5;

        const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

        const registryInstance = await WorldHelper.getRegistryInstance();
        const tileCaptureCancellationFee = toLowBN(await registryInstance.getTileCaptureCancellationFee());

        const tilePosition = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            buildingType,
            regionNumber
        );
        const userSettlementPosition = await userSettlementInstance1.position();
        const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(userSettlementPosition, tilePosition);

        const nextCaptureBasicProsperityThreshold = toLowBN(await registryInstance.getNextCaptureProsperityBasicThreshold());
        const nextCaptureProsperityPerTileThreshold = toLowBN(await registryInstance.getNextCaptureProsperityPerTileThreshold());
        const nextCaptureProsperityThreshold = nextCaptureBasicProsperityThreshold.plus(
            nextCaptureProsperityPerTileThreshold.multipliedBy(new BigNumber(distanceBetweenPositions))
        );

        const tileBonus = await RegionHelper.getTileBonusByPosition(tilePosition);

        const [advancedProductionTileBonusTypeId, advancedProductionTileBonusPercent] =
            await registryInstance.getAdvancedProductionTileBonusByVariation(tileBonus.tileBonusVariation);
        expect(BuildingHelper.getBuildingTypeId(buildingType))
            .eql(advancedProductionTileBonusTypeId, 'Building type id is not correct');

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance1,
            buildingType,
            prosperityStake
        );
        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance2,
            buildingType,
            prosperityStake
        );

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance1);
        expect(prosperityBalance).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');

        //tile capture
        await CaptureHelper.captureTile(userSettlementInstance1, tilePosition, prosperityStake);
        await userSettlementInstance1.claimCapturedTile(tilePosition).then((tx) => tx.wait());

        const isTileCapturedBefore = await CaptureHelper.isTileCapturedBySettlement(
            tilePosition,
            userSettlementInstance1
        );
        expect(isTileCapturedBefore).to.be.true;

        const captureDuration = await CaptureHelper.getCaptureDurationByDistance(distanceBetweenPositions);

        await userSettlementInstance2
            .beginTileCapture(tilePosition, transferableFromLowBN(new BigNumber(prosperityStake)))
            .then((tx) => tx.wait());

        const prosperityBalanceBeforeOverride = await ProsperityHelper.getProsperityBalance(userSettlementInstance2);

        await userSettlementInstance1
            .beginTileCapture(
                tilePosition,
                transferableFromLowBN(nextCaptureProsperityThreshold.multipliedBy(prosperityStake))
            )
            .then((tx) => tx.wait());

        const prosperityBalanceAfterOverride = await ProsperityHelper.getProsperityBalance(userSettlementInstance2);
        expect(prosperityBalanceAfterOverride)
            .isInCloseRangeWith(prosperityBalanceBeforeOverride.minus(tileCaptureCancellationFee.multipliedBy(prosperityStake)));

        await EvmUtils.increaseTime(captureDuration);
        await userSettlementInstance1.claimCapturedTile(tilePosition).then((tx) => tx.wait());

        const isTileCapturedAfter = await CaptureHelper.isTileCapturedBySettlement(
            tilePosition,
            userSettlementInstance1
        );
        expect(isTileCapturedAfter).to.be.true;
    }

    public static async impossibleOwnTileCaptureIfProsperityThresholdNotReachedTest() {
        const {testUser1, testUser2} = await getNamedAccounts();

        const regionNumber = 1;
        const prosperityStake = 5;
        const newProsperityStake = 6;
        const buildingType = BuildingType.LUMBERMILL;

        const userSettlementInstance1 = await UserHelper.getUserSettlementByNumber(testUser1, 1);
        const userSettlementInstance2 = await UserHelper.getUserSettlementByNumber(testUser2, 1);

        const registryInstance = await WorldHelper.getRegistryInstance();

        const tilePosition = await RegionHelper.getPositionOfAdvancedProductionTileBonusByBuildingInRegion(
            buildingType,
            regionNumber
        );
        const userSettlementPosition = await userSettlementInstance1.position();
        const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(userSettlementPosition, tilePosition);

        const nextCaptureBasicProsperityThreshold = toLowBN(await registryInstance.getNextCaptureProsperityBasicThreshold());
        const nextCaptureProsperityPerTileThreshold = toLowBN(await registryInstance.getNextCaptureProsperityPerTileThreshold());
        const nextCaptureProsperityThreshold = nextCaptureBasicProsperityThreshold.plus(
            nextCaptureProsperityPerTileThreshold.multipliedBy(new BigNumber(distanceBetweenPositions))
        );

        const tileBonus = await RegionHelper.getTileBonusByPosition(tilePosition);

        const [advancedProductionTileBonusTypeId, advancedProductionTileBonusPercent] =
            await registryInstance.getAdvancedProductionTileBonusByVariation(tileBonus.tileBonusVariation);
        expect(BuildingHelper.getBuildingTypeId(buildingType))
            .eql(advancedProductionTileBonusTypeId, 'Building type id is not correct');

        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance1,
            BuildingType.SMITHY,
            prosperityStake
        );
        await ProductionHelper.increaseProsperityByBuilding(
            userSettlementInstance2,
            BuildingType.SMITHY,
            prosperityStake
        );

        const prosperityBalance = await ProsperityHelper.getProsperityBalance(userSettlementInstance1);
        expect(prosperityBalance).gte(new BigNumber(prosperityStake), 'Prosperity balance is not correct');

        //tile capture
        await CaptureHelper.captureTile(userSettlementInstance1, tilePosition, prosperityStake);
        await userSettlementInstance1.claimCapturedTile(tilePosition).then((tx) => tx.wait());

        const isTileCapturedBefore = await CaptureHelper.isTileCapturedBySettlement(
            tilePosition,
            userSettlementInstance1
        );
        expect(isTileCapturedBefore).to.be.true;

        await userSettlementInstance2
            .beginTileCapture(tilePosition, transferableFromLowBN(new BigNumber(prosperityStake)))
            .then((tx) => tx.wait());

        expect(new BigNumber(newProsperityStake))
            .lt(nextCaptureProsperityThreshold.multipliedBy(prosperityStake), 'Prosperity stake is not correct');

        await expect(
            userSettlementInstance1
                .beginTileCapture(tilePosition, transferableFromLowBN(new BigNumber(newProsperityStake)))
                .then((tx) => tx.wait())
        ).to.be.revertedWith(
            "CannotBeginTileCaptureDueToNotReachedNextMinimumProsperityStake()"
        );
    }
}
