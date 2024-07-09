## UnitsPool








### currentZone

```solidity
contract IZone currentZone
```

Zone to which this pool belongs

_Immutable, initialized on the zone creation_




### lastPurchaseTime

```solidity
uint256 lastPurchaseTime
```

Time at which last purchase is performed

_Updated every time when #swapWeaponsForExactUnits or #swapWeaponsForExactUnitsByZone is called_




### unitsType

```solidity
string unitsType
```

Units type

_Immutable, initialized on the zone creation_




### startingPrice

```solidity
uint256 startingPrice
```

Starting unit price

_Updated every time when #swapWeaponsForExactUnits or #swapWeaponsForExactUnitsByZone is called_




### onlyZone

```solidity
modifier onlyZone()
```



_Allows caller to be only zone_




### weapons

```solidity
function weapons() internal view returns (contract IResource)
```



_Returns weapons_




### units

```solidity
function units() internal view returns (contract IUnits)
```



_Returns units by pool unit type_




### init

```solidity
function init(address _zoneAddress, string _unitsType) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _zoneAddress | address |  |
| _unitsType | string |  |



### getDroppedPrice

```solidity
function getDroppedPrice() internal view returns (int128)
```



_Calculates dropped price after last purchase time_




### calculatePriceShiftForUnits

```solidity
function calculatePriceShiftForUnits(uint256 amountOfUnits, int128 priceShiftPerUnit64) internal view returns (uint256, uint256)
```



_Calculates amount of weapons and new starting price according to amount of units and price shift per unit interaction with the pool_




### getDemilitarizationResult

```solidity
function getDemilitarizationResult(uint256 unitsToDemilitarize) public view returns (uint256, uint256)
```

Calculates amount of weapons to be received and new starting price

_Returns valid output only for integer unitsToDemilitarize value (not in 1e18 precision)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsToDemilitarize | uint256 | Amount of workers to buy |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


### getAmountIn

```solidity
function getAmountIn(uint256 unitsToBuy) public view returns (uint256, uint256)
```

Calculates input of weapons based on output whole amount of units

_Returns valid output only for integer unitsToBuy value (not in 1e18 precision)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsToBuy | uint256 | Amount of workers to buy |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


### demilitarizeArmyUnits

```solidity
function demilitarizeArmyUnits(address armyAddress, address settlementAddress, uint256 unitsCount) public
```

Demilitarizes units from army

_Even though function is opened it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| settlementAddress | address | Address of settlement which will receive prosperity for demilitarized units |
| unitsCount | uint256 | Amount of units to demilitarize from army |



### swapWeaponsForExactUnits

```solidity
function swapWeaponsForExactUnits(address settlementAddress, uint256 unitsToBuy, uint256 maxWeaponsToSell) public returns (uint256)
```

Swaps weapons() for exact units()

_msg.sender will be used as weapons payer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address, army of which, will receive units |
| unitsToBuy | uint256 | Exact amount of units |
| maxWeaponsToSell | uint256 | Maximum amount of weapons to be taken for exact amount of units |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### swapWeaponsForExactUnitsByZone

```solidity
function swapWeaponsForExactUnitsByZone(address weaponsPayer, address settlementAddress, uint256 unitsToBuy, uint256 maxWeaponsToSell) public returns (uint256)
```

Swaps weapons() for exact units()

_Even though function is opened it can be called only by zone_

| Name | Type | Description |
| ---- | ---- | ----------- |
| weaponsPayer | address | Address from which weapons will be taken |
| settlementAddress | address | Settlement address, army of which, will receive units |
| unitsToBuy | uint256 | Exact amount of units |
| maxWeaponsToSell | uint256 | Maximum amount of weapons to be taken for exact amount of units |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### _swapWeaponsForExactUnits

```solidity
function _swapWeaponsForExactUnits(address weaponsPayer, address settlementAddress, uint256 unitsToBuy, uint256 maxWeaponsToSell) internal returns (uint256)
```



_Core logic related to swapping weapons for exact units_




### updateAndGetHealth

```solidity
function updateAndGetHealth(address settlementAddress) internal returns (uint256)
```



_Updates provided settlements fort health up to current block and returns its new value_




### updateAndGetArmyTotalUnits

```solidity
function updateAndGetArmyTotalUnits(address settlementAddress) internal returns (uint256 totalUnits)
```



_Updates provided settlements army up to current block and returns its total units count_




### getMaxAllowedToBuy

```solidity
function getMaxAllowedToBuy(uint256 health, uint256 currentUnits) internal returns (uint256)
```



_Calculates maximum allowed extra units that can be bought and placed into army given its total units count and fort health_




## UnitsPool








### currentZone

```solidity
contract IZone currentZone
```

Zone to which this pool belongs

_Immutable, initialized on the zone creation_




### lastPurchaseTime

```solidity
uint256 lastPurchaseTime
```

Time at which last purchase is performed

_Updated every time when #swapWeaponsForExactUnits or #swapWeaponsForExactUnitsByZone is called_




### unitsType

```solidity
string unitsType
```

Units type

_Immutable, initialized on the zone creation_




### startingPrice

```solidity
uint256 startingPrice
```

Starting unit price

_Updated every time when #swapWeaponsForExactUnits or #swapWeaponsForExactUnitsByZone is called_




### onlyZone

```solidity
modifier onlyZone()
```



_Allows caller to be only zone_




### weapons

```solidity
function weapons() internal view returns (contract IResource)
```



_Returns weapons_




### units

```solidity
function units() internal view returns (contract IUnits)
```



_Returns units by pool unit type_




### init

```solidity
function init(address _zoneAddress, string _unitsType) public
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| _zoneAddress | address |  |
| _unitsType | string |  |



### getDroppedPrice

```solidity
function getDroppedPrice() internal view returns (int128)
```



_Calculates dropped price after last purchase time_




### calculatePriceShiftForUnits

```solidity
function calculatePriceShiftForUnits(uint256 amountOfUnits, int128 priceShiftPerUnit64) internal view returns (uint256, uint256)
```



_Calculates amount of weapons and new starting price according to amount of units and price shift per unit interaction with the pool_




### getDemilitarizationResult

```solidity
function getDemilitarizationResult(uint256 unitsToDemilitarize) public view returns (uint256, uint256)
```

Calculates amount of weapons to be received and new starting price

_Returns valid output only for integer unitsToDemilitarize value (not in 1e18 precision)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsToDemilitarize | uint256 | Amount of workers to buy |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


### getAmountIn

```solidity
function getAmountIn(uint256 unitsToBuy) public view returns (uint256, uint256)
```

Calculates input of weapons based on output whole amount of units

_Returns valid output only for integer unitsToBuy value (not in 1e18 precision)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsToBuy | uint256 | Amount of workers to buy |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |
| [1] | uint256 |  |


### demilitarizeArmyUnits

```solidity
function demilitarizeArmyUnits(address armyAddress, address settlementAddress, uint256 unitsCount) public
```

Demilitarizes units from army

_Even though function is opened it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| settlementAddress | address | Address of settlement which will receive prosperity for demilitarized units |
| unitsCount | uint256 | Amount of units to demilitarize from army |



### swapWeaponsForExactUnits

```solidity
function swapWeaponsForExactUnits(address settlementAddress, uint256 unitsToBuy, uint256 maxWeaponsToSell) public returns (uint256)
```

Swaps weapons() for exact units()

_msg.sender will be used as weapons payer_

| Name | Type | Description |
| ---- | ---- | ----------- |
| settlementAddress | address | Settlement address, army of which, will receive units |
| unitsToBuy | uint256 | Exact amount of units |
| maxWeaponsToSell | uint256 | Maximum amount of weapons to be taken for exact amount of units |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### swapWeaponsForExactUnitsByZone

```solidity
function swapWeaponsForExactUnitsByZone(address weaponsPayer, address settlementAddress, uint256 unitsToBuy, uint256 maxWeaponsToSell) public returns (uint256)
```

Swaps weapons() for exact units()

_Even though function is opened it can be called only by zone_

| Name | Type | Description |
| ---- | ---- | ----------- |
| weaponsPayer | address | Address from which weapons will be taken |
| settlementAddress | address | Settlement address, army of which, will receive units |
| unitsToBuy | uint256 | Exact amount of units |
| maxWeaponsToSell | uint256 | Maximum amount of weapons to be taken for exact amount of units |

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | uint256 |  |


### _swapWeaponsForExactUnits

```solidity
function _swapWeaponsForExactUnits(address weaponsPayer, address settlementAddress, uint256 unitsToBuy, uint256 maxWeaponsToSell) internal returns (uint256)
```



_Core logic related to swapping weapons for exact units_




### updateAndGetHealth

```solidity
function updateAndGetHealth(address settlementAddress) internal returns (uint256)
```



_Updates provided settlements fort health up to current block and returns its new value_




### updateAndGetArmyTotalUnits

```solidity
function updateAndGetArmyTotalUnits(address settlementAddress) internal returns (uint256 totalUnits)
```



_Updates provided settlements army up to current block and returns its total units count_




### getMaxAllowedToBuy

```solidity
function getMaxAllowedToBuy(uint256 health, uint256 currentUnits) internal returns (uint256)
```



_Calculates maximum allowed extra units that can be bought and placed into army given its total units count and fort health_




