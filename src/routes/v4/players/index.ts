"use strict";
import "dotenv/config";

import { PlayersController } from "#controllers/v4/players.js";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SchemaGetPlayer, SchemaGetPlayerList, SchemaGetWorldsFromPlayer } from "#schemas/routes/players.js";

const plugin: FastifyPluginAsyncTypebox = async function (fastify, opts) {
    const playersController = new PlayersController(fastify)

    fastify.get("/", { schema: SchemaGetPlayerList }, playersController.listPlayers);
    fastify.get("/:player_uuid", { schema: SchemaGetPlayer }, playersController.getPlayer);
    fastify.get("/:player_uuid/worlds", { schema: SchemaGetWorldsFromPlayer }, playersController.getWorldsFromPlayer);

}

export default plugin