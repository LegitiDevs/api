"use strict";
import "dotenv/config";

import { PlayersController } from "#controllers/v4/players.js";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const plugin: FastifyPluginAsyncTypebox = async function (fastify, opts) {
    const playersController = new PlayersController(fastify)

    fastify.get("/", { schema: SchemaListPlayers }, playersController.listPlayers);
    fastify.get("/:player_uuid", { schema: SchemaGetPlayer }, playersController.getPlayer);
    fastify.get("/:player_uuid/worlds", { schema: SchemaGetPlayerWorlds }, playersController.getPlayerWorlds);

}

export default plugin