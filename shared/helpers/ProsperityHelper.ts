import {
	Settlement
} from '../../typechain-types';
import { toLowBN } from '../../scripts/utils/const';
import { WorldHelper } from "./WorldHelper";

export class ProsperityHelper {
	public static async getProsperityBalance(
		settlementInstance: Settlement
	) {
		const prosperityInstance = await WorldHelper.getProsperityInstance();
		return toLowBN(await prosperityInstance.balanceOf(await settlementInstance.getAddress()));
	}

	public static async getRealProsperityBalance(
		settlementInstance: Settlement
	) {
		const prosperityInstance = await WorldHelper.getProsperityInstance();
		return toLowBN(await prosperityInstance.realBalanceOf(await settlementInstance.getAddress()));
	}
}
