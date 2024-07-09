/// <reference types="chai" />
declare namespace Chai {
    interface Assertion extends LanguageChains {
        isInCloseRangeWith: BigNumberAssertion
    }

    interface BigNumberAssertion {
        (value: any, message?: string): Assertion;
    }
}
