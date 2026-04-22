"use strict";
import "dotenv/config";

import { 
	defaultFilter, 
	parseProject, 
	parseSortBy 
} from "#util/utils.js";

import { 
	WorldCommentDeleteParamSchema,
	WorldCommentGetParamSchema,
	WorldCommentListGetParamSchema,
	WorldCommentListGetQuerySchema,
	WorldCommentPostBodySchema,
	WorldCommentPostParamSchema,
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

	// NEEDS TESTING
	fastify.get("/search", {schema: { querystring: WorldSearchGetQuerySchema }}, worldsController.searchWorld);
	fastify.get("/:world_uuid", { schema: { params: WorldGetParamSchema, querystring: WorldGetQuerySchema } }, worldsController.getWorld);
	// NEEDS TESTING
	fastify.patch("/:world_uuid", { schema: { params: WorldPatchParamSchema, headers: WorldPatchHeaderSchema, body: WorldPatchBodySchema } }, worldsController.editWorld);

	// COMMENTS
	fastify.get("/:world_uuid/comments", { schema: { params: WorldCommentListGetParamSchema, querystring: WorldCommentListGetQuerySchema } }, worldsController.getComments)
	fastify.get("/comments/:comment_uuid", { schema: { params: WorldCommentGetParamSchema } }, worldsController.getComment)
	fastify.post("/:world_uuid/comments", { schema: { params: WorldCommentPostParamSchema, body: WorldCommentPostBodySchema } }, worldsController.postComment)
	fastify.delete("/comments/:comment_uuid", { schema: { params: WorldCommentDeleteParamSchema } }, worldsController.deleteComment)
}
