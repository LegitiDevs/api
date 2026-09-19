

import * as PlayersService from "#services/v4/players.js"
import * as WorldsService from "#services/v4/worlds.js"
import { ApiError } from "#util/errors.js"
import { FastifyInstance } from "fastify"
import { Collection } from "mongodb"
import { FastifyReplyTypeBox, FastifyRequestTypeBox } from "./types.ts"
import { SchemaGetPlayer, SchemaGetPlayerList } from "#schemas/routes/players.js"
import { World } from "#schemas/worlds.js"
import { SchemaGetWorldsFromPlayer } from "#schemas/routes/worlds.js"
import { parsePlayerSortBy, parseProject, parseWorldSortBy } from "#util/query.js"


export class PlayersController {
    worldsCollection: Collection<World>
    fastify: FastifyInstance

    constructor(fastify: FastifyInstance) {
        if (fastify.mongo.db == null) throw new ApiError("DB not found", 500) 
        this.worldsCollection = fastify.mongo.db.collection("worlds")
        this.fastify = fastify
    }

    listPlayers = async (
        request: FastifyRequestTypeBox<typeof SchemaGetPlayerList>,
        reply: FastifyReplyTypeBox<typeof SchemaGetPlayerList>
    ) => {
        const project = parseProject(request.query["project"])
        const sort_by = parsePlayerSortBy(request.query["sort_by"])
        const limit = request.query["limit"] ?? undefined
        const offset = request.query["offset"] ?? undefined
        
        try {
            const playerList = await PlayersService.listPlayers(this.fastify, { project, sort_by, limit, offset })
            return playerList
        } catch (error) {
            throw new ApiError('Scraper is unavailable', 503)
        }
    }

    getPlayer = async (
        request: FastifyRequestTypeBox<typeof SchemaGetPlayer>,
        reply: FastifyReplyTypeBox<typeof SchemaGetPlayer>
    ) => {
        const player_uuid = request.params["player_uuid"];
        const project = parseProject(request.query["project"])

        const player = await PlayersService.getPlayer(this.fastify, { player_uuid, project })
        if (player.length == 0) throw new ApiError(`Player ${player_uuid} not found`, 404);

        return player[0]
    }

    getWorldsFromPlayer = async (
        request: FastifyRequestTypeBox<typeof SchemaGetWorldsFromPlayer>,
        reply: FastifyReplyTypeBox<typeof SchemaGetWorldsFromPlayer>
    ) => {
        const project = parseProject(request.query["project"])
        const sort_by = parseWorldSortBy(request.query["sort_by"])
        const limit = request.query["limit"] ?? undefined
        const offset = request.query["offset"] ?? undefined
        const player_uuid = request.params.player_uuid

        return await WorldsService.getWorldsFromPlayer(this.worldsCollection, { player_uuid, project, sort_by, limit, offset })
    }
}