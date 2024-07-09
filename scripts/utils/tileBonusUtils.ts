import {ethers} from "ethers";

export interface TileBonus {
    tileBonusType: bigint;
    tileBonusVariation: bigint;
}

export function getTileBonusByPosition(
    tileBonusesSeed: string,
    chanceForTileWithBonus: bigint,
    position: bigint
): TileBonus {
    const randomHash = ethers.solidityPackedKeccak256(["int64", "bytes32"], [position, tileBonusesSeed]);

    let randomValue = BigInt(randomHash) % BigInt(1e18);
    if (randomValue > chanceForTileWithBonus) {
        return {
            tileBonusType: BigInt(0),
            tileBonusVariation: BigInt(0),
        }
    }

    randomValue = BigInt(ethers.solidityPackedKeccak256(["bytes32"], [randomHash])) % BigInt(1e18);

    //total weight = 1e18
    const bonusVariationWeights = [];
    bonusVariationWeights[0] = 0.1e18;
    bonusVariationWeights[1] = 0.07e18;
    bonusVariationWeights[2] = 0.09e18;
    bonusVariationWeights[3] = 0.06e18;
    bonusVariationWeights[4] = 0.07e18;
    bonusVariationWeights[5] = 0.05e18;
    bonusVariationWeights[6] = 0.06e18;
    bonusVariationWeights[7] = 0.05e18;
    bonusVariationWeights[8] = 0.07e18;
    bonusVariationWeights[9] = 0.05e18;

    let currentWeight = 0;
    for (let i = 0; i < bonusVariationWeights.length; i++) {
        const newWeight = currentWeight + bonusVariationWeights[i];
        if (randomValue >= currentWeight && randomValue < newWeight) {
            return {
                tileBonusType: BigInt(1),
                tileBonusVariation: BigInt(i),
            };
        }

        currentWeight = newWeight;
    }

    const battleMultiplierBonusVariationWeights = [];
    battleMultiplierBonusVariationWeights[0] = 0.17e18;
    battleMultiplierBonusVariationWeights[1] = 0.1e18;
    battleMultiplierBonusVariationWeights[2] = 0.06e18;

    for (let i = 0; i < battleMultiplierBonusVariationWeights.length; i++) {
        const newWeight = currentWeight + battleMultiplierBonusVariationWeights[i];
        if (randomValue >= currentWeight && randomValue < newWeight) {
            return {
                tileBonusType: BigInt(2),
                tileBonusVariation: BigInt(i),
            };
        }

        currentWeight = newWeight;
    }

    throw new Error("unreachable code");
}
