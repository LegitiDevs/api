"use strict";
import "dotenv/config";

import { 
	SchemaGetWorldList, 
	SchemaGetRandomWorld,
	SchemaGetWorld,
	SchemaSearchWorld,
	SchemaEditWorld,
	SchemaGetWorldCommentList,
	SchemaGetWorldComment,
	SchemaPostComment,
	SchemaDeleteComment
} from "#schemas/routes/worlds.js";
import { WorldsController } from "../../../controllers/v4/worlds.ts";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const plugin: FastifyPluginAsyncTypebox = async function (fastify, opts) {
	const worldsController = new WorldsController(fastify)

	// DONE
	fastify.get("/", { schema: SchemaGetWorldList }, worldsController.listWorlds);
	fastify.get("/random", { schema: SchemaGetRandomWorld }, worldsController.randomWorld);
	fastify.get("/search", { schema: SchemaSearchWorld }, worldsController.searchWorld);
	fastify.get("/:world_uuid", { schema: SchemaGetWorld }, worldsController.getWorld);

	// WARNING: NEEDS TESTING - UNSTABLE FOR RELEASE
	fastify.patch("/:world_uuid", { schema: SchemaEditWorld }, worldsController.editWorld);

	// COMMENTS
	fastify.get("/:world_uuid/comments", { schema: SchemaGetWorldCommentList }, worldsController.getComments)
	fastify.get("/comments/:comment_uuid", { schema: SchemaGetWorldComment }, worldsController.getComment)

	// WARNING: NEEDS TESTING - UNSTABLE FOR RELEASE
	fastify.post("/:world_uuid/comments", { schema: SchemaPostComment }, worldsController.postComment)
	fastify.delete("/comments/:comment_uuid", { schema: SchemaDeleteComment }, worldsController.deleteComment)
}

export default plugin