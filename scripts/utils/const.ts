import BigNumber from "bignumber.js";

export const _1e18 = new BigNumber(10).pow(18);

export function toHexString(bn: bigint): string {
    return "0x" + (bn < 0 ? bn * -1n : bn).toString(16).toUpperCase();
}

export function toBN(bn: bigint): BigNumber {
    const hexString = bn < 0 ? '-' + toHexString(bn) : toHexString(bn);
    return new BigNumber(hexString);
}

export function toLowBN(bn: bigint): BigNumber {
    return toBN(bn).dividedBy(_1e18);
}

export function toAbsLowBN(bn: bigint): BigNumber {
    return toBN(bn).dividedToIntegerBy(_1e18);
}

export function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function transferableFromLowBN(value: BigNumber): string {
    return value.multipliedBy(_1e18).toFixed(0);
}

export function transferableFromBN(value: BigNumber): string {
    return value.toString(10);
}

export function cmpAddress(add1: string, add2: string) {
    if (!add1 || !add2) {
        return false;
    }

    return add1.toLowerCase() === add2.toLowerCase();
}
