"use strict";
import "dotenv/config";

import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { WorldsController } from "#controllers/v4/worlds.js";
import { WorldStatsController } from "#controllers/v4/world_stats.js";
import { 
	SchemaGetWorldList, 
	SchemaGetRandomWorld,
	SchemaGetWorld,
	SchemaSearchWorld,
	SchemaGetWorldListStats,
	SchemaGetWorldStats,
	SchemaGetPlayersInWorldList,
	SchemaGetPlayersInWorld,
} from "#schemas/routes/worlds.js";

const plugin: FastifyPluginAsyncTypebox = async function (fastify, opts) {
	const worldsController = new WorldsController(fastify)
	const worldStatsController = new WorldStatsController(fastify)

	fastify.get("/", { schema: SchemaGetWorldList }, worldsController.listWorlds);
	fastify.get("/random", { schema: SchemaGetRandomWorld }, worldsController.randomWorld);
	fastify.get("/search", { schema: SchemaSearchWorld }, worldsController.searchWorld);
	fastify.get("/:world_uuid", { schema: SchemaGetWorld }, worldsController.getWorld);

	fastify.get("/stats", { schema: SchemaGetWorldListStats }, worldStatsController.getWorldListStats);
	fastify.get("/:world_uuid/stats", { schema: SchemaGetWorldStats }, worldStatsController.getWorldStats);

	fastify.get("/players", { schema: SchemaGetPlayersInWorldList }, worldsController.getPlayersInWorldList);
	fastify.get("/:world_uuid/players", { schema: SchemaGetPlayersInWorld }, worldsController.getPlayersInWorld);
}

export default plugin