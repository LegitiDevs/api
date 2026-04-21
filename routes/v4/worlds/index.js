"use strict";
import "dotenv/config";

import { 
	defaultFilter, 
	parseProject, 
	parseSortBy 
} from "#util/utils.js";

import { 
	WorldGetParamSchema,
	WorldGetQuerySchema,
	WorldListGetQuerySchema,
	WorldPatchBodySchema,
	WorldPatchHeaderSchema,
	WorldPatchParamSchema,
	WorldRandomGetQuerySchema, 
	WorldSearchGetQuerySchema 
} from "#schemas/worlds.js";
import { WorldsController } from "#controllers/v4/worlds.js";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function (fastify, opts) {
	const worlds = fastify.mongo.db.collection("worlds");
	const worldsController = new WorldsController(fastify)

	// DONE
	fastify.get("/", { schema: { querystring: WorldListGetQuerySchema } }, worldsController.listWorlds);
	fastify.get("/random", { schema: { querystring: WorldRandomGetQuerySchema } }, worldsController.randomWorld);
	// DONE
	fastify.get("/search", {schema: { querystring: WorldSearchGetQuerySchema }}, worldsController.searchWorld);
	fastify.get("/:world_uuid", { schema: { params: WorldGetParamSchema, querystring: WorldGetQuerySchema } }, worldsController.getWorld);
	fastify.patch("/:world_uuid", { schema: { params: WorldPatchParamSchema, headers: WorldPatchHeaderSchema, body: WorldPatchBodySchema } }, worldsController.patchWorld);
}
