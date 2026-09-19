import { WorldStats } from "#schemas/worlds.js";
import { ApiError } from "#util/errors.js";
import { FastifyInstance } from "fastify";
import { Collection } from "mongodb";
import { FastifyReplyTypeBox, FastifyRequestTypeBox } from "./types.ts";
import { SchemaGetWorldListStats, SchemaGetWorldStats } from "#schemas/routes/worlds.js";
import { parseProject } from "#util/query.js";
import * as WorldsStatsService from "#services/v4/world_stats.js"

export class WorldStatsController {
    worldStatsCollection: Collection<WorldStats>

    constructor(fastify: FastifyInstance) {
        if (fastify.mongo.db == null) throw new ApiError("DB not found", 500) 
        this.worldStatsCollection = fastify.mongo.db.collection("world_stats")
    }

    getWorldListStats = async (
        request: FastifyRequestTypeBox<typeof SchemaGetWorldListStats>,
        reply: FastifyReplyTypeBox<typeof SchemaGetWorldListStats>
    ) => {
        const project = parseProject(request.query["project"])
        return await WorldsStatsService.getWorldListStats(this.worldStatsCollection, { project })
    }

    getWorldStats = async (
        request: FastifyRequestTypeBox<typeof SchemaGetWorldStats>,
        reply: FastifyReplyTypeBox<typeof SchemaGetWorldStats>
    ) => {
        const world_uuid = request.params["world_uuid"];
        const project = parseProject(request.query["project"])
        
        const worldStats = await WorldsStatsService.getWorldStats(this.worldStatsCollection, { world_uuid, project })
        if (!worldStats) throw new ApiError(`World stats for world ${world_uuid} not found`, 404);
        
        return worldStats
    }
}