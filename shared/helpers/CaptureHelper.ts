import {Settlement, TileCapturingSystem__factory} from "../../typechain-types";
import {transferableFromLowBN} from "../../scripts/utils/const";
import BigNumber from "bignumber.js";
import {EvmUtils} from "./EvmUtils";
import {WorldHelper} from "./WorldHelper";
import {MovementHelper} from "./MovementHelper";

export class CaptureHelper {
    public static async getCaptureDurationByDistance(
        distanceBetweenPositions: number
    ) {
        const registryInstance = await WorldHelper.getRegistryInstance();
        const captureTileDurationPerTile = Number(await registryInstance.getCaptureTileDurationPerTile());

        return captureTileDurationPerTile * distanceBetweenPositions;
    }

    public static async captureTile(
        settlementInstance: Settlement,
        tilePosition: bigint,
        prosperityStake: number
    ) {
        const settlementPosition = await settlementInstance.position();
        const distanceBetweenPositions = MovementHelper.getDistanceBetweenPositions(settlementPosition, tilePosition);

        const captureDuration = await this.getCaptureDurationByDistance(distanceBetweenPositions);

        await settlementInstance
            .beginTileCapture(tilePosition, transferableFromLowBN(new BigNumber(prosperityStake)))
            .then((tx) => tx.wait());

        await EvmUtils.increaseTime(captureDuration);
    }

    public static async isTileCapturedBySettlement(
        tilePosition: bigint,
        settlementInstance: Settlement
    ) {
        const eraInstance = await WorldHelper.getCurrentEraInstance();
        const tileCapturingSystemAddress = await eraInstance.tileCapturingSystem();
        const tileCapturingSystemInstance = TileCapturingSystem__factory.connect(
            tileCapturingSystemAddress,
            settlementInstance.runner
        );

        const capturedTilesWithAdvancedBonus = await tileCapturingSystemInstance.getCapturedTilesBySettlementAddress(
            await settlementInstance.getAddress(),
            1
        );

        const capturedTilesWithMilitaryBonus = await tileCapturingSystemInstance.getCapturedTilesBySettlementAddress(
            await settlementInstance.getAddress(),
            2
        );

        const capturedTiles = capturedTilesWithAdvancedBonus.concat(capturedTilesWithMilitaryBonus);

        return !!capturedTiles.find((capturedTilePosition) => capturedTilePosition === tilePosition);
    }
}
