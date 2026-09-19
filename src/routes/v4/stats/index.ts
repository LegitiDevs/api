"use strict";
import "dotenv/config";

import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { StatsController } from "#controllers/v4/stats.js";
import { SchemaGetServerStats } from "#schemas/routes/stats.js";

const plugin: FastifyPluginAsyncTypebox = async function (fastify, opts) {
    const statsController = new StatsController(fastify)

    fastify.get("/", { schema: SchemaGetServerStats }, statsController.getServerStats);
}

export default plugin