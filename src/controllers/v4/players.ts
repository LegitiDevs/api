

import * as PlayersService from "#services/v4/players.js"
import { ApiError } from "#util/errors.js"
import { FastifyInstance } from "fastify"
import { Collection } from "mongodb"
import { FastifyReplyTypeBox, FastifyRequestTypeBox } from "./types.ts"


export class StatsController {
    statsCollection: Collection<Player>

    constructor(fastify: FastifyInstance) {
        if (fastify.mongo.db == null) throw new ApiError("DB not found", 500) 
        this.statsCollection = fastify.mongo.db.collection("stats")
    }

    listPlayers = async (
        request: FastifyRequestTypeBox<typeof >,
        reply: FastifyReplyTypeBox<typeof >
    ) => {
        
    }
}