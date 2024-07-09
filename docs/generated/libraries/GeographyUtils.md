## GeographyUtils








### Oddq








```solidity
struct Oddq {
  int64 x;
  int64 y;
}
```

### Axial








```solidity
struct Axial {
  int64 q;
  int64 r;
}
```

### getArea

```solidity
function getArea(uint64 radius) internal pure returns (uint64)
```







### getShift

```solidity
function getShift(uint64 radius) internal pure returns (uint64)
```







### positionToOddq

```solidity
function positionToOddq(uint64 position) internal pure returns (struct GeographyUtils.Oddq)
```







### oddqToAxial

```solidity
function oddqToAxial(struct GeographyUtils.Oddq oddq) internal pure returns (struct GeographyUtils.Axial)
```







### axialToOddq

```solidity
function axialToOddq(struct GeographyUtils.Axial axial) internal pure returns (struct GeographyUtils.Oddq)
```







### oddqToPosition

```solidity
function oddqToPosition(struct GeographyUtils.Oddq oddq) internal pure returns (uint64)
```







### getNeighboringCenter0

```solidity
function getNeighboringCenter0(struct GeographyUtils.Axial axial, int64 radius) internal pure returns (struct GeographyUtils.Axial)
```







### getNeighboringCenter1

```solidity
function getNeighboringCenter1(struct GeographyUtils.Axial axial, int64 radius) internal pure returns (struct GeographyUtils.Axial)
```







### getNeighboringCenter2

```solidity
function getNeighboringCenter2(struct GeographyUtils.Axial axial, int64 radius) internal pure returns (struct GeographyUtils.Axial)
```







### getNeighboringCenter3

```solidity
function getNeighboringCenter3(struct GeographyUtils.Axial axial, int64 radius) internal pure returns (struct GeographyUtils.Axial)
```







### getNeighboringCenter4

```solidity
function getNeighboringCenter4(struct GeographyUtils.Axial axial, int64 radius) internal pure returns (struct GeographyUtils.Axial)
```







### getNeighboringCenter5

```solidity
function getNeighboringCenter5(struct GeographyUtils.Axial axial, int64 radius) internal pure returns (struct GeographyUtils.Axial)
```







### getClosestFakeCenter

```solidity
function getClosestFakeCenter(struct GeographyUtils.Axial position, struct GeographyUtils.Axial center, uint64 radius, bytes32 seed, uint64 shift, uint64 area) internal pure returns (struct GeographyUtils.Axial)
```







### isValidCenter

```solidity
function isValidCenter(struct GeographyUtils.Axial center, uint64 radius) internal pure returns (bool)
```







### getDistanceBetweenPositions

```solidity
function getDistanceBetweenPositions(struct GeographyUtils.Axial axial1, struct GeographyUtils.Axial axial2) internal pure returns (uint64)
```







### getRegionCenterByPosition

```solidity
function getRegionCenterByPosition(uint64 position, uint64 radius, bytes32 seed) internal pure returns (uint64, bool)
```







### hasPosition

```solidity
function hasPosition(struct GeographyUtils.Oddq oddq) internal pure returns (bool)
```







### hexmodToAxial

```solidity
function hexmodToAxial(uint64 hexmod, uint64 radius, uint64 shift) internal pure returns (struct GeographyUtils.Axial)
```







### getRealCenter

```solidity
function getRealCenter(struct GeographyUtils.Axial axial, uint64 radius, uint64 shift, uint64 area) internal pure returns (struct GeographyUtils.Axial)
```







### getFakeCenter

```solidity
function getFakeCenter(struct GeographyUtils.Axial axial, bytes32 seed, uint64 radius, uint64 shift, uint64 area) internal pure returns (struct GeographyUtils.Axial)
```







