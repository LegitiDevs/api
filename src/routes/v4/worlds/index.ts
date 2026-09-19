"use strict";
import "dotenv/config";

import { 
	SchemaGetWorldList, 
	SchemaGetRandomWorld,
	SchemaGetWorld,
	SchemaSearchWorld,
	SchemaGetWorldListStats,
	SchemaGetWorldStats,
} from "#schemas/routes/worlds.js";
import { WorldsController } from "../../../controllers/v4/worlds.ts";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { WorldStatsController } from "#controllers/v4/world_stats.js";

const plugin: FastifyPluginAsyncTypebox = async function (fastify, opts) {
	const worldsController = new WorldsController(fastify)
	const worldStatsController = new WorldStatsController(fastify)

	// DONE
	fastify.get("/", { schema: SchemaGetWorldList }, worldsController.listWorlds);
	fastify.get("/random", { schema: SchemaGetRandomWorld }, worldsController.randomWorld);
	fastify.get("/search", { schema: SchemaSearchWorld }, worldsController.searchWorld);
	fastify.get("/:world_uuid", { schema: SchemaGetWorld }, worldsController.getWorld);

	// WIP
	fastify.get("/stats", { schema: SchemaGetWorldListStats }, worldStatsController.getWorldListStats);
	fastify.get("/:world_uuid/stats", { schema: SchemaGetWorldStats }, worldStatsController.getWorldStats);

}

export default plugin