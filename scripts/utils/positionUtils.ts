import {getRegionCenterByPosition, Oddq, oddqToPosition, positionToOddq} from "./geographyUtils";

function getNeighborPosition(position: bigint, direction: number): bigint {
    const getPosition = (x: bigint, y: bigint): bigint => {
        const oddq: Oddq = {x, y};
        return oddqToPosition(oddq);
    };

    const isEvenPosition = (oddq: Oddq) => {
        return oddq.x % BigInt(2) === BigInt(0);
    }

    const oddq = positionToOddq(position);
    const isEven = isEvenPosition(oddq);

    const _1 = BigInt(1);

    switch (direction)  {
        case 0: return getPosition(oddq.x, oddq.y - _1);
        case 1: return isEven ? getPosition(oddq.x + _1, oddq.y - _1) : getPosition(oddq.x + _1, oddq.y);
        case 2: return isEven ? getPosition(oddq.x + _1, oddq.y) : getPosition(oddq.x + _1, oddq.y + _1);
        case 3: return getPosition(oddq.x, oddq.y + _1);
        case 4: return isEven ? getPosition(oddq.x - _1, oddq.y) : getPosition(oddq.x - _1, oddq.y + _1);
        case 5: return isEven ? getPosition(oddq.x - _1, oddq.y - _1) : getPosition(oddq.x - _1, oddq.y);
    }

    throw new Error("wrong direction passed");
}
export function getPositionsByRadius(position: bigint, radius: number): bigint[] {
    let neighborPositions = [];
    let currentPosition = position;
    for (let i = 0; i < radius; i++) {
        currentPosition = getNeighborPosition(currentPosition, 4);
    }

    for (let j = 0; j < 6; j++) {
        for (let i = 0; i < radius; i++) {
            currentPosition = getNeighborPosition(currentPosition, j);
            neighborPositions.push(currentPosition);
        }

    }
    return neighborPositions;
}

function isPossibleToPlaceSettlement(positionsForSettlements: bigint[], allPositions: bigint[], possibleSettlementPosition: bigint) {
    const validPositions = findValidCoordinates(positionsForSettlements, allPositions);
    for (let i = 0; i < validPositions.length; i++) {
        if (validPositions[i] === possibleSettlementPosition) {
            return true;
        }
    }
    return false;
}

function findValidCoordinates(usedPositions: bigint[], allPositions: bigint[]): bigint[] {
    const invalidPositions = usedPositions.flatMap((position) => [
        ...getPositionsByRadius(position, 1),
        ...getPositionsByRadius(position, 2),
        position,
    ]);

    const validPositions = allPositions.filter((position) => {
        const hasPositionInInvalidPositions = !!invalidPositions.find(
            (invalidPosition) => invalidPosition === position
        );

        return !hasPositionInInvalidPositions;
    });

    return validPositions;
}

export function getRegionPositions(regionId: bigint, regionRadius: bigint, regionSeed: string): bigint[] {
    let result = [];

    result.push(regionId);

    let zeroPositionsFoundCount = 0;
    for (let radius = 1; zeroPositionsFoundCount < 5; radius++) {
        const ringPositions = getPositionsByRadius(regionId, radius);
        const regionPositions = ringPositions
            .map(position => {
                const [regionCenter, isPositionExist] = getRegionCenterByPosition(position, regionRadius, regionSeed);
                return [position, regionCenter, isPositionExist] as [bigint, bigint, boolean];
            })
            .filter(([position, regionCenter, isExist]) => isExist && regionCenter == regionId)
            .map(([position, regionCenter, isExist]) => position);

        result = result.concat(regionPositions);

        if (regionPositions.length === 0) {
            zeroPositionsFoundCount++;
        }
    }

    return result;
}

export function getPositionsForSettlements(
    regionId: bigint,
    settlementsCount: number,
    regionRadius: bigint,
    regionSeed: string
) {
    const regionPositions = getRegionPositions(regionId, regionRadius, regionSeed);

    const cultistsPosition = regionId;
    const positionsQueue = [cultistsPosition];
    const positionsForSettlements = [];

    while (positionsQueue.length > 1 || positionsForSettlements.length < settlementsCount) {
        let currentCoordinates = positionsQueue[0];
        let potentialSettlementPositions = getPositionsByRadius(currentCoordinates, 3);

        for (let i = 0; i < potentialSettlementPositions.length; i++) {
            const potentialSettlementPosition = potentialSettlementPositions[i];
            if (isPossibleToPlaceSettlement([...positionsForSettlements, cultistsPosition], regionPositions, potentialSettlementPosition)) {
                positionsForSettlements.push(potentialSettlementPosition);
                positionsQueue.push(potentialSettlementPosition);
            }
        }
        positionsQueue.shift();
    }

    return positionsForSettlements.slice(0, settlementsCount);
}

