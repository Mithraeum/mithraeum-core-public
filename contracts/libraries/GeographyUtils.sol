// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/math/SignedMath.sol";
import "./PerlinNoise.sol";

library GeographyUtils {
    struct Oddq {
        int64 x;
        int64 y;
    }

    struct Axial {
        int64 q;
        int64 r;
    }

    function getArea(uint64 radius) internal pure returns (uint64) {
        return 3 * radius * (radius + 1) + 1;
    }

    function getShift(uint64 radius) internal pure returns (uint64) {
        return 3 * radius + 2;
    }

    function positionToOddq(uint64 position) internal pure returns (Oddq memory) {
        int64 y = int64(uint64(uint32(position >> 32)));
        int64 x = int64(uint64(uint32(position)));
        return Oddq(x, y);
    }

    function oddqToAxial(Oddq memory oddq) internal pure returns (Axial memory) {
        int64 q = oddq.x;
        int64 r = oddq.y - oddq.x / 2;
        return Axial(q, r);
    }

    function axialToOddq(Axial memory axial) internal pure returns (Oddq memory) {
        int64 x = axial.q;
        int64 y = axial.r + (axial.q - (axial.q & 1)) / 2;
        return Oddq(x, y);
    }

    function oddqToPosition(Oddq memory oddq) internal pure returns (uint64) {
        return (uint64(oddq.y) << 32) + uint64(oddq.x);
    }

    function getNeighboringCenter0(Axial memory axial, int64 radius) internal pure returns (Axial memory) {
        int64 q = axial.q + 2 * radius + 1;
        int64 r = axial.r - radius;

        return Axial(q, r);
    }

    function getNeighboringCenter1(Axial memory axial, int64 radius) internal pure returns (Axial memory) {
        int64 q = axial.q + radius;
        int64 r = axial.r + radius + 1;

        return Axial(q, r);
    }

    function getNeighboringCenter2(Axial memory axial, int64 radius) internal pure returns (Axial memory) {
        int64 q = axial.q - (radius + 1);
        int64 r = axial.r + (2 * radius + 1);

        return Axial(q, r);
    }

    function getNeighboringCenter3(Axial memory axial, int64 radius) internal pure returns (Axial memory) {
        int64 q = axial.q - (2 * radius + 1);
        int64 r = axial.r + radius;

        return Axial(q, r);
    }

    function getNeighboringCenter4(Axial memory axial, int64 radius) internal pure returns (Axial memory) {
        int64 q = axial.q - radius;
        int64 r = axial.r - (radius + 1);

        return Axial(q, r);
    }

    function getNeighboringCenter5(Axial memory axial, int64 radius) internal pure returns (Axial memory) {
        int64 q = axial.q + radius + 1;
        int64 r = axial.r - (2 * radius + 1);

        return Axial(q, r);
    }

    function getClosestFakeCenter(
        Axial memory position,
        Axial memory center,
        uint64 radius,
        bytes32 seed,
        uint64 shift,
        uint64 area
    ) internal pure returns (Axial memory) {
        Axial[] memory centers = new Axial[](18);

        int64 intRadius = int64(radius);

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

        Axial memory closestFakeCenterToPosition = getFakeCenter(center, seed, radius, shift, area);
        uint64 distanceFromClosestFakeCenterToPosition = getDistanceBetweenPositions(position, closestFakeCenterToPosition);
        for (uint256 i = 0; i < 18; i++) {
            Axial memory realCenter = centers[i];
            Axial memory fakeCenter = getFakeCenter(realCenter, seed, radius, shift, area);
            if (!isValidCenter(fakeCenter, radius)) {
                continue;
            }

            uint64 distanceFromNewFakeCenterToPosition = getDistanceBetweenPositions(position, fakeCenter);
            if (distanceFromNewFakeCenterToPosition < distanceFromClosestFakeCenterToPosition) {
                closestFakeCenterToPosition = fakeCenter;
                distanceFromClosestFakeCenterToPosition = distanceFromNewFakeCenterToPosition;
            }
        }

        return closestFakeCenterToPosition;
    }

    function isValidCenter(Axial memory center, uint64 radius) internal pure returns (bool) {
        Oddq memory oddq = axialToOddq(center);
        int64 lowerBound = int64(uint64(type(uint32).max)) - 1 - int64(radius);
        return oddq.x >= int64(radius) && oddq.x <= lowerBound && oddq.y >= int64(radius) && oddq.y <= lowerBound;
    }

    function getDistanceBetweenPositions(Axial memory axial1, Axial memory axial2) internal pure returns (uint64) {
        int64 axial1S = -axial1.q - axial1.r;
        int64 axial2S = -axial2.q - axial2.r;
        return uint64((SignedMath.abs(axial1.q - axial2.q) + SignedMath.abs(axial1.r - axial2.r) + SignedMath.abs(axial1S - axial2S)) / 2);
    }

    function getRegionCenterByPosition(uint64 position, uint64 radius, bytes32 seed) internal pure returns (uint64, bool) {
        Oddq memory oddqPosition = positionToOddq(position);
        Axial memory axialPosition = oddqToAxial(oddqPosition);
        uint64 shift = getShift(radius);
        uint64 area = getArea(radius);

        Axial memory realCenterOfPosition = getRealCenter(axialPosition, radius, shift, area);
        Axial memory fakeCenter = getFakeCenter(realCenterOfPosition, seed, radius, shift, area);
        if (!isValidCenter(fakeCenter, radius)) {
            return (0, false);
        }

        bool isPositionSameAsItsFakeCenter = fakeCenter.q == axialPosition.q && fakeCenter.r == axialPosition.r;
        if (!isPositionSameAsItsFakeCenter && !hasPosition(oddqPosition)) {
            return (0, false);
        }

        Axial memory closestFakeCenterToPosition = getClosestFakeCenter(axialPosition, realCenterOfPosition, radius, seed, shift, area);
        return (oddqToPosition(axialToOddq(closestFakeCenterToPosition)), true);
    }

    function hasPosition(Oddq memory oddq) internal pure returns (bool) {
        int256 noise = PerlinNoise.noise2d(
            int256(oddq.x * 3200),
            int256(oddq.y * 3200)
        );

        if (noise >= 26660) {
            return false;
        }

        noise = PerlinNoise.noise2d(
            int256(oddq.x * 5000),
            int256(oddq.y * 5000)
        );

        if (noise >= 13000) {
            return false;
        }

        return true;
    }

    function hexmodToAxial(uint64 hexmod, uint64 radius, uint64 shift) internal pure returns (Axial memory) {
        uint64 _2xRadius = 2 * radius;

        uint64 ms = (hexmod + radius) / shift;
        uint64 mcs = (hexmod + _2xRadius) / (shift - 1);

        uint64 msxRadius = ms * radius;
        uint64 mcsxRadius = mcs * radius;

        int64 q = int64(msxRadius + ms) - int64(mcsxRadius);
        int64 r = int64(hexmod) - int64(msxRadius * 2 + ms) - int64(mcsxRadius + mcs);

        return Axial(q, r);
    }

    function getRealCenter(Axial memory axial, uint64 radius, uint64 shift, uint64 area) internal pure returns (Axial memory) {
        uint64 hexmod = uint64((axial.r + int64(shift) * axial.q) % int64(area));

        Axial memory axialHexmod = hexmodToAxial(hexmod, radius, shift);
        Axial memory axialCenter = Axial(
            axial.q - axialHexmod.q,
            axial.r - axialHexmod.r
        );

        return axialCenter;
    }

    function getFakeCenter(Axial memory axial, bytes32 seed, uint64 radius, uint64 shift, uint64 area) internal pure returns (Axial memory) {
        bytes32 hash = keccak256(abi.encodePacked(axial.q, axial.r, seed));
        uint256 randomValue = uint256(hash) % 1e18;

        uint64 randomHexmod = uint64(randomValue * area / 1e18);
        Axial memory axialHexmod = hexmodToAxial(randomHexmod, radius, shift);

        return Axial(
            axial.q + axialHexmod.q,
            axial.r + axialHexmod.r
        );
    }
}
