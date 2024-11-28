export interface ArmyActivitiesProps {
  battleAddress: string | null;
  siegePower: bigint;
  besiegingUnitsCount: bigint;
  nextPositionSettlementAddress: string;
  targetSettlementAddress: string | undefined;
  stunDurationLeft: bigint;
  inSecretManeuver: boolean;
}
