// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

// Group types
bytes32 constant ARMY_GROUP_TYPE_ID = keccak256(bytes(("army")));
bytes32 constant ERA_GROUP_TYPE_ID = keccak256(bytes(("era")));
bytes32 constant WORKERS_POOL_GROUP_TYPE_ID = keccak256(bytes("workersPool"));
bytes32 constant UNITS_POOL_GROUP_TYPE_ID = keccak256(bytes("unitsPool"));
bytes32 constant SETTLEMENT_MARKET_GROUP_TYPE_ID = keccak256(bytes("settlementsMarket"));
bytes32 constant BATTLE_GROUP_TYPE_ID = keccak256(bytes("battle"));
bytes32 constant REGION_GROUP_TYPE_ID = keccak256(bytes("region"));
bytes32 constant SETTLEMENT_GROUP_TYPE_ID = keccak256(bytes("settlement"));
bytes32 constant TILE_CAPTURING_SYSTEM_GROUP_TYPE_ID = keccak256(bytes("tileCapturingSystem"));
bytes32 constant PROSPERITY_GROUP_TYPE_ID = keccak256(bytes("prosperity"));
bytes32 constant WORKERS_GROUP_TYPE_ID = keccak256(bytes("workers"));
bytes32 constant RESOURCE_GROUP_TYPE_ID = keccak256(bytes("resource"));
bytes32 constant UNITS_GROUP_TYPE_ID = keccak256(bytes("units"));
bytes32 constant BUILDING_GROUP_TYPE_ID = keccak256(bytes("building"));
bytes32 constant SIEGE_GROUP_TYPE_ID = keccak256(bytes("siege"));

// Asset types

// Basic type
bytes32 constant BASIC_TYPE_ID = keccak256(bytes("BASIC"));

// Settlement type
bytes32 constant CULTISTS_SETTLEMENT_TYPE_ID = keccak256(bytes("CULTISTS"));

// Unit pool types
bytes32 constant INGOTS_UNIT_POOL_TYPE_ID = keccak256(bytes("INGOTS_UNIT_POOL"));
bytes32 constant WORKERS_UNIT_POOL_TYPE_ID = keccak256(bytes("WORKERS_UNIT_POOL"));

// Resource types
bytes32 constant FOOD_TYPE_ID = keccak256(bytes("FOOD"));
bytes32 constant WOOD_TYPE_ID = keccak256(bytes("WOOD"));
bytes32 constant ORE_TYPE_ID = keccak256(bytes("ORE"));
bytes32 constant INGOT_TYPE_ID = keccak256(bytes("INGOT"));
bytes32 constant HEALTH_TYPE_ID = keccak256(bytes("HEALTH"));

// Building types
bytes32 constant FARM_TYPE_ID = keccak256(bytes("FARM"));
bytes32 constant LUMBERMILL_TYPE_ID = keccak256(bytes("LUMBERMILL"));
bytes32 constant MINE_TYPE_ID = keccak256(bytes("MINE"));
bytes32 constant SMITHY_TYPE_ID = keccak256(bytes("SMITHY"));
bytes32 constant FORT_TYPE_ID = keccak256(bytes("FORT"));

// Unit types
bytes32 constant WARRIOR_TYPE_ID = keccak256(bytes("WARRIOR"));
bytes32 constant ARCHER_TYPE_ID = keccak256(bytes("ARCHER"));
bytes32 constant HORSEMAN_TYPE_ID = keccak256(bytes("HORSEMAN"));
