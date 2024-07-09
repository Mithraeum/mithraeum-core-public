import { ethers } from "hardhat";
import {
  Building,
  Resource__factory
} from '../../typechain-types';
import { toLowBN } from "../../scripts/utils/const";
import { WorldHelper } from "./WorldHelper";
import { ResourceType } from "../enums/resourceType";
import {zip} from "lodash";

export class ResourceHelper {
  public static getResourceTypeId(
      resourceType: ResourceType
  ) {
    return ethers.solidityPackedKeccak256(["string"], [resourceType]);
  }

  public static getResourceTypeByResourceTypeId(
      resourceTypeId: string
  ): ResourceType {
    const allResourceTypeStringValues = Object.values(ResourceType) as string[];
    const allResourceTypeIds = allResourceTypeStringValues.map(resourceTypeString => ethers.solidityPackedKeccak256(["string"], [resourceTypeString]));
    const zippedResourceTypeStringValuesWithIds = zip(allResourceTypeStringValues, allResourceTypeIds);
    const tupleByResourceTypeId = zippedResourceTypeStringValuesWithIds
        .find(([resourceTypeStringValue, resourceTypeIdOfStringValue]) => {
          return resourceTypeId === resourceTypeIdOfStringValue;
        });

    if (!tupleByResourceTypeId) {
      throw new Error(`ResourceType not found for ${resourceTypeId}`);
    }

    return tupleByResourceTypeId[0] as ResourceType;
  }

  public static async getResourceQuantity(
    userAddress: string,
    resourceType: ResourceType
  ) {
    const signer = await ethers.getSigner(userAddress);
    const eraInstance = await WorldHelper.getCurrentEraInstance();
    const resourceTypeId = this.getResourceTypeId(resourceType);
    const resourceAddress = await eraInstance.resources(resourceTypeId);
    const resourceInstance = Resource__factory.connect(resourceAddress, signer);

    return toLowBN(await resourceInstance.balanceOf(userAddress));
  }

  public static async getResourcesQuantity(
    userAddress: string,
    resourceTypes: ResourceType[]
  ) {
    return Object.fromEntries(await Promise.all(resourceTypes.map(async resourceType => {
      return [resourceType, await this.getResourceQuantity(userAddress, resourceType)];
    })));
  }

  public static async getResourceStateBalanceOf(
    userAddress: string,
    resourceType: ResourceType
  ) {
    const signer = await ethers.getSigner(userAddress);
    const eraInstance = await WorldHelper.getCurrentEraInstance();
    const resourceTypeId = this.getResourceTypeId(resourceType);
    const resourceAddress = await eraInstance.resources(resourceTypeId);
    const resourceInstance = Resource__factory.connect(resourceAddress, signer);

    return toLowBN(await resourceInstance.stateBalanceOf(userAddress));
  }

  public static async getResourcesStateBalanceOf(
    userAddress: string,
    resourceTypes: ResourceType[]
  ) {
    return Object.fromEntries(await Promise.all(resourceTypes.map(async resourceType => {
      return [resourceType, await this.getResourceStateBalanceOf(userAddress, resourceType)];
    })));
  }

  public static async getBuildingTreasuryAmount(
      buildingInstance: Building
  ) {
    const productionConfig = await buildingInstance.getConfig();
    const producingResourceConfig = productionConfig.find((config) => config.isProducing);
    const producingResourceType = this.getResourceTypeByResourceTypeId(producingResourceConfig!.resourceTypeId);

    return await this.getResourceQuantity(await buildingInstance.getAddress(), producingResourceType);
  }
}
