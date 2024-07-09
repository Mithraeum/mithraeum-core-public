## IFort


Functions to read state/modify state in order to get current fort parameters and/or interact with it





### health

```solidity
function health() external view returns (uint256)
```

Fort health

_Updated when #updateHealth is called_




### HealthUpdated

```solidity
event HealthUpdated(uint256 newHealth)
```

Emitted when #updateState is called (if health is changed in the process)


| Name | Type | Description |
| ---- | ---- | ----------- |
| newHealth | uint256 | New health |



### Disabled

```solidity
error Disabled()
```

Thrown when attempting to call action which is disabled





### getMaxHealthOnLevel

```solidity
function getMaxHealthOnLevel(uint256 level) external view returns (uint256 maxHealth)
```

Calculates maximum amount of health for provided level

_Useful to determine maximum amount of health will be available at provided level_

| Name | Type | Description |
| ---- | ---- | ----------- |
| level | uint256 | Level at which calculate maximum amount of health |

| Name | Type | Description |
| ---- | ---- | ----------- |
| maxHealth | uint256 | Maximum amount of health for provided level |


### calculateDamageDone

```solidity
function calculateDamageDone(uint256 timestamp) external view returns (uint256 damage)
```

Calculates damage done at specified timestamp

_Uses fort production and siege parameters to forecast health and damage will be dealt at specified time_

| Name | Type | Description |
| ---- | ---- | ----------- |
| timestamp | uint256 | Time at which calculate parameters |

| Name | Type | Description |
| ---- | ---- | ----------- |
| damage | uint256 | Amount of damage done from fort.productionInfo.lastUpdateState to specified timestamp |


