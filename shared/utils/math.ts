import BigNumber from "bignumber.js";

export function isBigNumbersInRange(x: BigNumber, y: BigNumber, range: BigNumber): boolean {
  if (x.isZero() || y.isZero()) {
    return (x.minus(y)).abs().lte(range);
  } else {
    return (new BigNumber(1).minus(x.dividedBy(y))).abs().lte(range);
  }
}

