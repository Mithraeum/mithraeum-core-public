## IUnitsPool


Functions to read state/modify state in order to mint units/swap weapons for units





### UnitsBought

```solidity
event UnitsBought(address buyer, address armyAddress, uint256 unitsBought, uint256 weaponsSpent)
```

Emitted when #swapWeaponsForExactUnits or #swapWeaponsForExactUnitsByZone is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| buyer | address | The address which payed weapons |
| armyAddress | address | The address of the army which received units |
| unitsBought | uint256 | Amount of units bought |
| weaponsSpent | uint256 | Amount of weapons spent |



### UnitsDemilitarized

```solidity
event UnitsDemilitarized(address armyAddress, address settlementAddress, uint256 amountOfDemilitarizedUnits, uint256 receivedProsperity, uint256 newStartingPrice)
```

Emitted when #demilitarizeArmyUnits is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| settlementAddress | address | Settlement address which received prosperity |
| amountOfDemilitarizedUnits | uint256 | Amount of demilitarized units |
| receivedProsperity | uint256 | Amount of received prosperity |
| newStartingPrice | uint256 | New starting price |



### currentZone

```solidity
function currentZone() external view returns (contract IZone)
```

Zone to which this pool belongs

_Immutable, initialized on the zone creation_




### unitsType

```solidity
function unitsType() external view returns (string)
```

Units type

_Immutable, initialized on the zone creation_




### lastPurchaseTime

```solidity
function lastPurchaseTime() external view returns (uint256)
```

Time at which last purchase is performed

_Updated every time when #swapWeaponsForExactUnits or #swapWeaponsForExactUnitsByZone is called_




### startingPrice

```solidity
function startingPrice() external view returns (uint256)
```

Starting unit price

_Updated every time when #swapWeaponsForExactUnits or #swapWeaponsForExactUnitsByZone is called_




### init

```solidity
function init(address zoneAddress, string unitsType) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneAddress | address | Zone address |
| unitsType | string | Units type |



### swapWeaponsForExactUnits

```solidity
function swapWeaponsForExactUnits(address settlementAddress, uint256 unitsToBuy, uint256 maxWeaponsToSell) external returns (uint256 unitsCount)
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
| unitsCount | uint256 | Amount of units bought by weapons |


### swapWeaponsForExactUnitsByZone

```solidity
function swapWeaponsForExactUnitsByZone(address weaponsPayer, address settlementAddress, uint256 unitsToBuy, uint256 maxWeaponsToSell) external returns (uint256 unitsCount)
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
| unitsCount | uint256 | Amount of units bought by weapons |


### demilitarizeArmyUnits

```solidity
function demilitarizeArmyUnits(address armyAddress, address settlementAddress, uint256 unitsCount) external
```

Demilitarizes units from army

_Even though function is opened it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| settlementAddress | address | Address of settlement which will receive prosperity for demilitarized units |
| unitsCount | uint256 | Amount of units to demilitarize from army |



### getDemilitarizationResult

```solidity
function getDemilitarizationResult(uint256 unitsToDemilitarize) external returns (uint256 weaponsToBeReceived, uint256 newStartingPrice)
```

Calculates amount of weapons to be received and new starting price

_Returns valid output only for integer unitsToDemilitarize value (not in 1e18 precision)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsToDemilitarize | uint256 | Amount of workers to buy |

| Name | Type | Description |
| ---- | ---- | ----------- |
| weaponsToBeReceived | uint256 | Amount of weapons to be received |
| newStartingPrice | uint256 | New starting price |


### getAmountIn

```solidity
function getAmountIn(uint256 unitsToBuy) external returns (uint256 weaponsToSell, uint256 newStartingPrice)
```

Calculates input of weapons based on output whole amount of units

_Returns valid output only for integer unitsToBuy value (not in 1e18 precision)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsToBuy | uint256 | Amount of workers to buy |

| Name | Type | Description |
| ---- | ---- | ----------- |
| weaponsToSell | uint256 | Amount of weapons needed for unitsToBuy |
| newStartingPrice | uint256 | New starting price |


## IUnitsPool


Functions to read state/modify state in order to mint units/swap weapons for units





### UnitsBought

```solidity
event UnitsBought(address buyer, address armyAddress, uint256 unitsBought, uint256 weaponsSpent)
```

Emitted when #swapWeaponsForExactUnits or #swapWeaponsForExactUnitsByZone is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| buyer | address | The address which payed weapons |
| armyAddress | address | The address of the army which received units |
| unitsBought | uint256 | Amount of units bought |
| weaponsSpent | uint256 | Amount of weapons spent |



### UnitsDemilitarized

```solidity
event UnitsDemilitarized(address armyAddress, address settlementAddress, uint256 amountOfDemilitarizedUnits, uint256 receivedProsperity, uint256 newStartingPrice)
```

Emitted when #demilitarizeArmyUnits is called


| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| settlementAddress | address | Settlement address which received prosperity |
| amountOfDemilitarizedUnits | uint256 | Amount of demilitarized units |
| receivedProsperity | uint256 | Amount of received prosperity |
| newStartingPrice | uint256 | New starting price |



### currentZone

```solidity
function currentZone() external view returns (contract IZone)
```

Zone to which this pool belongs

_Immutable, initialized on the zone creation_




### unitsType

```solidity
function unitsType() external view returns (string)
```

Units type

_Immutable, initialized on the zone creation_




### lastPurchaseTime

```solidity
function lastPurchaseTime() external view returns (uint256)
```

Time at which last purchase is performed

_Updated every time when #swapWeaponsForExactUnits or #swapWeaponsForExactUnitsByZone is called_




### startingPrice

```solidity
function startingPrice() external view returns (uint256)
```

Starting unit price

_Updated every time when #swapWeaponsForExactUnits or #swapWeaponsForExactUnitsByZone is called_




### init

```solidity
function init(address zoneAddress, string unitsType) external
```

Proxy initializer

_Called by factory contract which creates current instance_

| Name | Type | Description |
| ---- | ---- | ----------- |
| zoneAddress | address | Zone address |
| unitsType | string | Units type |



### swapWeaponsForExactUnits

```solidity
function swapWeaponsForExactUnits(address settlementAddress, uint256 unitsToBuy, uint256 maxWeaponsToSell) external returns (uint256 unitsCount)
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
| unitsCount | uint256 | Amount of units bought by weapons |


### swapWeaponsForExactUnitsByZone

```solidity
function swapWeaponsForExactUnitsByZone(address weaponsPayer, address settlementAddress, uint256 unitsToBuy, uint256 maxWeaponsToSell) external returns (uint256 unitsCount)
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
| unitsCount | uint256 | Amount of units bought by weapons |


### demilitarizeArmyUnits

```solidity
function demilitarizeArmyUnits(address armyAddress, address settlementAddress, uint256 unitsCount) external
```

Demilitarizes units from army

_Even though function is opened it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| armyAddress | address | Army address |
| settlementAddress | address | Address of settlement which will receive prosperity for demilitarized units |
| unitsCount | uint256 | Amount of units to demilitarize from army |



### getDemilitarizationResult

```solidity
function getDemilitarizationResult(uint256 unitsToDemilitarize) external returns (uint256 weaponsToBeReceived, uint256 newStartingPrice)
```

Calculates amount of weapons to be received and new starting price

_Returns valid output only for integer unitsToDemilitarize value (not in 1e18 precision)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsToDemilitarize | uint256 | Amount of workers to buy |

| Name | Type | Description |
| ---- | ---- | ----------- |
| weaponsToBeReceived | uint256 | Amount of weapons to be received |
| newStartingPrice | uint256 | New starting price |


### getAmountIn

```solidity
function getAmountIn(uint256 unitsToBuy) external returns (uint256 weaponsToSell, uint256 newStartingPrice)
```

Calculates input of weapons based on output whole amount of units

_Returns valid output only for integer unitsToBuy value (not in 1e18 precision)_

| Name | Type | Description |
| ---- | ---- | ----------- |
| unitsToBuy | uint256 | Amount of workers to buy |

| Name | Type | Description |
| ---- | ---- | ----------- |
| weaponsToSell | uint256 | Amount of weapons needed for unitsToBuy |
| newStartingPrice | uint256 | New starting price |


