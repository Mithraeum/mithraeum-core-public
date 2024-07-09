/// <reference types="chai" />
import './types';

import BigNumber from "bignumber.js";
import AssertionStatic = Chai.AssertionStatic;
import {Assertion} from "chai";
import {isBigNumbersInRange} from "../../../shared/utils/math";

export function chaiBigNumber(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
    chai.Assertion.addMethod('isInCloseRangeWith', function (expected: BigNumber) {
        new Assertion(expected).to.be.instanceof(BigNumber);

        const actual = this._obj as BigNumber;
        new Assertion(actual).to.be.instanceof(BigNumber);

        this.assert(
            isBigNumbersInRange(actual, expected, new BigNumber(0.01)),
            `expected ${actual.toString(10)} to be in close range with ${expected.toString(10)}`,
            `expected ${actual.toString(10)} NOT to be in close range with ${expected.toString(10)}`,
            expected.toString(10),
            actual.toString(10),
        )
    });

    const overrideFunctionCreator = (functionName: keyof BigNumber, readableFunctionName: string) => {
        return (_super: any) => {
            return function(...args: any[]) {
                // @ts-ignore
                const _this = this;

                if (!(args[0] instanceof BigNumber) || !(_this._obj instanceof BigNumber)) {
                    _super.apply(_this, args);
                    return;
                }

                const actual: BigNumber = args[0] as BigNumber;
                const expected = _this._obj as BigNumber;

                _this.assert(
                    // @ts-ignore
                    expected[functionName](actual),
                    `Expected ${expected} to ${readableFunctionName} to ${actual}`,
                    `Expected ${expected} NOT to ${readableFunctionName} to ${actual}`,
                    expected.toString(10),
                    actual.toString(10)
                );
            };
        }
    }

    const overwriteMethods = (methodNames: string[], method: (this: AssertionStatic, ...args: any[]) => any): any => {
        methodNames.forEach(methodName => {
            chai.Assertion.overwriteMethod(methodName, method);
        })
    };

    overwriteMethods(
        ['equal', 'eq', 'eql', 'equals', 'eqls'],
        overrideFunctionCreator('isEqualTo', 'equal to')
    );

    overwriteMethods(
        ['gt', 'above', 'greaterThan'],
        overrideFunctionCreator('isGreaterThan', 'greater than')
    );

    overwriteMethods(
        ['gte', 'least', 'greaterThanOrEqual'],
        overrideFunctionCreator('isGreaterThanOrEqualTo', 'greater than or equal')
    );

    overwriteMethods(
        ['lt', 'below', 'lessThan'],
        overrideFunctionCreator('isLessThan', 'less than')
    );

    overwriteMethods(
        ['lte', 'most', 'lessThanOrEqual'],
        overrideFunctionCreator('isLessThanOrEqualTo', 'less than or equal')
    );
}
