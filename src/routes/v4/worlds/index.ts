"use strict";
import "dotenv/config";

import { 
	SchemaGetWorldList, 
	SchemaGetRandomWorld,
	SchemaGetWorld,
	SchemaSearchWorld,
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
}

export default plugin