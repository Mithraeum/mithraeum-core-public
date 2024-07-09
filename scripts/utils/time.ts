import BigNumber from "bignumber.js";

export class Time {
    public static seconds(n: number): BigNumber {
        return new BigNumber(n);
    }

    public static minutes(n: number): BigNumber {
        return Time.seconds(60).multipliedBy(new BigNumber(n));
    }

    public static hours(n: number): BigNumber {
        return Time.minutes(60).multipliedBy(new BigNumber(n));
    }

    public static days(n: number): BigNumber {
        return Time.hours(24).multipliedBy(new BigNumber(n));
    }

    public static weeks(n: number): BigNumber {
        return Time.days(7).multipliedBy(new BigNumber(n));
    }

    public static months(n: number): BigNumber {
        return Time.weeks(4).multipliedBy(new BigNumber(n));
    }

    public static years(n: number): BigNumber {
        return Time.months(12).multipliedBy(new BigNumber(n));
    }
}