import {ArmyUnits, BattleSide, UnitAmount} from "../../entities";

export type ArmiesAddressesBySides = Record<number, string[]>;

export type BattleCasualties = {
    sideALosses: UnitAmount[];
    sideBLosses: UnitAmount[];
    winningSide: BattleSide | null;
};

export type BattleResults = BattleCasualties & {
    casualtiesByArmy: Record<BattleSide, ArmyUnits[]>;
    sideExhaustion: Record<BattleSide, bigint>;
    battleDuration: bigint;
};