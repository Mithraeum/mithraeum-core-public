## IFort


Functions to read state/modify state in order to get current fort parameters and/or interact with it





### health

```solidity
function health() external view returns (uint256)
```

Fort health

_Updated when #updateHealth is called_




### updateHealth

```solidity
function updateHealth(uint256 value) external
```

Updates fort health

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 | New fort health |



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


## IFort


Functions to read state/modify state in order to get current fort parameters and/or interact with it





### health

```solidity
function health() external view returns (uint256)
```

Fort health

_Updated when #updateHealth is called_




### updateHealth

```solidity
function updateHealth(uint256 value) external
```

Updates fort health

_Even though function is opened, it can be called only by world asset_

| Name | Type | Description |
| ---- | ---- | ----------- |
| value | uint256 | New fort health |



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


