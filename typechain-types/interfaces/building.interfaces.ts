import type { AddressLike, BigNumberish } from "ethers";
import { BuildingType, ResourceType } from "../enums";

export type BuildingWorkersParamStruct = {
  isTransferringWorkersFromBuilding: boolean;
  workersAmount: BigNumberish;
};

export type BuildingResourcesModificationParamStruct = {
  isTransferringResourcesFromBuilding: boolean;
  resourcesOwnerOrResourcesReceiver: AddressLike;
  resourceType: ResourceType;
  resourcesAmount: BigNumberish;
};
