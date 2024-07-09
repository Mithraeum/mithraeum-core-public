import {ethers} from "ethers";
import {noise2d} from "./perlinNoise";

export interface Oddq {
    x: bigint;
    y: bigint;
}

interface Axial {
    q: bigint;
    r: bigint;
}

const _2_POW32 = BigInt(4294967296);

function bigintAbs(value: bigint): bigint {
    if (value >= BigInt(0)) {
        return value;
    }

    return -value;
}

function getArea(radius: bigint): bigint {
    return BigInt(3) * radius * (radius + BigInt(1)) + BigInt(1);
}

function getShift(radius: bigint): bigint {
    return BigInt(3) * radius + BigInt(2);
}

export function positionToOddq(position: bigint): Oddq {
    const y = position / _2_POW32;
    const x = position % _2_POW32;
    return {x, y};
}

export function oddqToAxial(oddq: Oddq): Axial {
    const q = oddq.x;
    const r = oddq.y - oddq.x / BigInt(2);
    return {q, r};
}

function axialToOddq(axial: Axial): Oddq {
    const x = axial.q;
    const y = axial.r + (axial.q - (axial.q & BigInt(1))) / BigInt(2);
    return {x, y};
}

export function oddqToPosition(oddq: Oddq): bigint {
    return oddq.y * _2_POW32 + oddq.x;
}

function getNeighboringCenter0(axial: Axial, radius: bigint): Axial {
    const q = axial.q + BigInt(2) * radius + BigInt(1);
    const r = axial.r - radius;

    return {q, r};
}

function getNeighboringCenter1(axial: Axial, radius: bigint): Axial {
    const q = axial.q + radius;
    const r = axial.r + radius + BigInt(1);

    return {q, r};
}

function getNeighboringCenter2(axial: Axial, radius: bigint): Axial {
    const q = axial.q - (radius + BigInt(1));
    const r = axial.r + (BigInt(2) * radius + BigInt(1));

    return {q, r};
}

function getNeighboringCenter3(axial: Axial, radius: bigint): Axial {
    const q = axial.q - (BigInt(2) * radius + BigInt(1));
    const r = axial.r + radius;

    return {q, r};
}

function getNeighboringCenter4(axial: Axial, radius: bigint): Axial {
    const q = axial.q - radius;
    const r = axial.r - (radius + BigInt(1));

    return {q, r};
}

function getNeighboringCenter5(axial: Axial, radius: bigint): Axial {
    const q = axial.q + radius + BigInt(1);
    const r = axial.r - (BigInt(2) * radius + BigInt(1));

    return {q, r};
}

function getClosestFakeCenter(
    position: Axial,
    center: Axial,
    radius: bigint,
    seed: string,
    shift: bigint,
    area: bigint
): Axial {
    const centers: Axial[] = [];

    const intRadius = radius;

    centers[0] = getNeighboringCenter0(center, intRadius);
    centers[1] = getNeighboringCenter1(center, intRadius);
    centers[2] = getNeighboringCenter2(center, intRadius);
    centers[3] = getNeighboringCenter3(center, intRadius);
    centers[4] = getNeighboringCenter4(center, intRadius);
    centers[5] = getNeighboringCenter5(center, intRadius);
    centers[6] = getNeighboringCenter0(centers[0], intRadius);
    centers[7] = getNeighboringCenter0(centers[1], intRadius);
    centers[8] = getNeighboringCenter1(centers[1], intRadius);
    centers[9] = getNeighboringCenter2(centers[1], intRadius);
    centers[10] = getNeighboringCenter2(centers[2], intRadius);
    centers[11] = getNeighboringCenter3(centers[2], intRadius);
    centers[12] = getNeighboringCenter3(centers[3], intRadius);
    centers[13] = getNeighboringCenter3(centers[4], intRadius);
    centers[14] = getNeighboringCenter4(centers[4], intRadius);
    centers[15] = getNeighboringCenter4(centers[5], intRadius);
    centers[16] = getNeighboringCenter5(centers[5], intRadius);
    centers[17] = getNeighboringCenter0(centers[5], intRadius);

    let closestFakeCenterToPosition = getFakeCenter(center, seed, radius, shift, area);
    let distanceFromClosestFakeCenterToPosition = getDistanceBetweenPositions(position, closestFakeCenterToPosition);
    for (let i = 0; i < 18; i++) {
        const realCenter = centers[i];
        const fakeCenter = getFakeCenter(realCenter, seed, radius, shift, area);
        if (!isValidCenter(fakeCenter, radius)) {
            continue;
        }

        const distanceFromNewFakeCenterToPosition = getDistanceBetweenPositions(position, fakeCenter);
        if (distanceFromNewFakeCenterToPosition < distanceFromClosestFakeCenterToPosition) {
            closestFakeCenterToPosition = fakeCenter;
            distanceFromClosestFakeCenterToPosition = distanceFromNewFakeCenterToPosition;
        }
    }

    return closestFakeCenterToPosition;
}

function isValidCenter(center: Axial, radius: bigint): boolean {
    const oddq = axialToOddq(center);
    const lowerBound = _2_POW32 - BigInt(1) - radius;
    return oddq.x >= radius && oddq.x <= lowerBound && oddq.y >= radius && oddq.y <= lowerBound;
}

export function getDistanceBetweenPositions(axial1: Axial, axial2: Axial): bigint {
    const axial1S = -axial1.q - axial1.r;
    const axial2S = -axial2.q - axial2.r;
    return ((bigintAbs(axial1.q - axial2.q) + bigintAbs(axial1.r - axial2.r) + bigintAbs(axial1S - axial2S)) / BigInt(2));
}

export function getRegionCenterByPosition(position: bigint, radius: bigint, seed: string): [bigint, boolean] {
    const oddqPosition = positionToOddq(position);
    const axialPosition = oddqToAxial(oddqPosition);
    const shift = getShift(radius);
    const area = getArea(radius);

    const realCenterOfPosition = getRealCenter(axialPosition, radius, shift, area);
    const fakeCenter = getFakeCenter(realCenterOfPosition, seed, radius, shift, area);
    if (!isValidCenter(fakeCenter, radius)) {
        return [BigInt(0), false];
    }

    const isPositionSameAsItsFakeCenter = fakeCenter.q == axialPosition.q && fakeCenter.r == axialPosition.r;
    if (!isPositionSameAsItsFakeCenter && !hasPosition(oddqPosition)) {
        return [BigInt(0), false];
    }

    const closestFakeCenterToPosition = getClosestFakeCenter(axialPosition, realCenterOfPosition, radius, seed, shift, area);
    return [oddqToPosition(axialToOddq(closestFakeCenterToPosition)), true];
}

function hasPosition(oddq: Oddq): boolean {
    let noise = noise2d(
        Number(oddq.x) * 3200,
        Number(oddq.y) * 3200
    );

    if (noise >= 26660) {
        return false;
    }

    noise = noise2d(
        Number(oddq.x) * 5000,
        Number(oddq.y) * 5000
    );

    if (noise >= 13000) {
        return false;
    }

    return true;
}

function hexmodToAxial(hexmod: bigint, radius: bigint, shift: bigint): Axial {
    const _2xRadius = BigInt(2) * radius;

    const ms = (hexmod + radius) / shift;
    const mcs = (hexmod + _2xRadius) / (shift - BigInt(1));

    const msxRadius = ms * radius;
    const mcsxRadius = mcs * radius;

    const q = (msxRadius + ms) - (mcsxRadius);
    const r = (hexmod) - (msxRadius * BigInt(2) + ms) - (mcsxRadius + mcs);

    return {q, r};
}

function getRealCenter(axial: Axial, radius: bigint, shift: bigint, area: bigint): Axial {
    const hexmod = ((axial.r + (shift) * axial.q) % (area));

    const axialHexmod = hexmodToAxial(hexmod, radius, shift);
    const axialCenter = {
        q: axial.q - axialHexmod.q,
        r: axial.r - axialHexmod.r
    }

    return axialCenter;
}

function getFakeCenter(axial: Axial, seed: string, radius: bigint, shift: bigint, area: bigint): Axial {
    const hash = ethers.solidityPackedKeccak256(["int64", "int64", "bytes32"], [axial.q, axial.r, seed]);
    const _1e18n = 1000000000000000000n;
    const randomValue = BigInt(hash) % _1e18n;

    const randomHexmod = (randomValue * area / _1e18n);
    const axialHexmod = hexmodToAxial(randomHexmod, radius, shift);

    return {
        q: axial.q + axialHexmod.q,
        r: axial.r + axialHexmod.r
    }
}
