import {
    Army,
    Army__factory,
    Building,
    Building__factory,
    Farm,
    Farm__factory,
    Fort,
    Fort__factory,
    Lumbermill,
    Lumbermill__factory,
    Mine,
    Mine__factory,
    Settlement,
    Smithy,
    Smithy__factory
} from "../../typechain-types";
import {BuildingType} from "../enums/buildingType";
import {ethers} from "hardhat";

export class SettlementHelper {
    public static async getBuilding(
        settlementInstance: Settlement,
        buildingType: BuildingType
    ): Promise<Building> {
        const buildingTypeId = ethers.solidityPackedKeccak256(["string"], [buildingType]);
        const buildingAddress = await settlementInstance.buildings(buildingTypeId);
        return Building__factory.connect(buildingAddress, settlementInstance.runner);
    }

    public static async getFarm(
        settlementInstance: Settlement
    ): Promise<Farm> {
        const building = await this.getBuilding(settlementInstance, BuildingType.FARM);
        return Farm__factory.connect(await building.getAddress(), settlementInstance.runner);
    }

    public static async getLumbermill(
        settlementInstance: Settlement
    ): Promise<Lumbermill> {
        const building = await this.getBuilding(settlementInstance, BuildingType.LUMBERMILL);
        return Lumbermill__factory.connect(await building.getAddress(), settlementInstance.runner);
    }

    public static async getMine(
        settlementInstance: Settlement
    ): Promise<Mine> {
        const building = await this.getBuilding(settlementInstance, BuildingType.MINE);
        return Mine__factory.connect(await building.getAddress(), settlementInstance.runner);
    }

    public static async getSmithy(
        settlementInstance: Settlement
    ): Promise<Smithy> {
        const building = await this.getBuilding(settlementInstance, BuildingType.SMITHY);
        return Smithy__factory.connect(await building.getAddress(), settlementInstance.runner);
    }

    public static async getArmy(
        settlementInstance: Settlement,
        asAddress?: string
    ): Promise<Army> {
        const signer = !asAddress ? settlementInstance.runner : await ethers.getSigner(asAddress);
        const armyAddress = await settlementInstance.army();
        return Army__factory.connect(armyAddress, signer);
    }

    public static async getFort(
        settlementInstance: Settlement
    ): Promise<Fort> {
        const building = await this.getBuilding(settlementInstance, BuildingType.FORT);
        return Fort__factory.connect(await building.getAddress(), settlementInstance.runner);
    }
}
