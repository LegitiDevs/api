import { GetPlayerOptions, ListPlayersOptions } from "#schemas/services/players.js";
import { standardizeUUID } from "#util/utils.js";
import { FastifyInstance } from "fastify";
import { Document } from "mongodb";

export async function listPlayers(fastify: FastifyInstance, { project, sort_by, limit, offset }: ListPlayersOptions) {
    if (fastify.mongo.db == null) throw new Error(`DB does not exist`)

    const response = await fastify.legitidevs_scraper.fetch('/player')
    if (!response.ok) throw new Error(`Failed to fetch players`)

    const players = await response.json()

    const stages: Document[] = [
        { $documents: players }, 
        { $sort: sort_by }
    ];
    
    if (offset !== undefined) stages.push({ $skip: offset })
    if (limit !== undefined) stages.push({ $limit: limit })

    stages.push({ $project: project });
    return await fastify.mongo.db.aggregate(stages).toArray();
}

export async function getPlayer(fastify: FastifyInstance, { player_uuid, project }: GetPlayerOptions) {
    if (fastify.mongo.db == null) throw new Error(`DB does not exist`)
    
    const hyphenated_player_uuid = standardizeUUID(player_uuid)
    const response = await fastify.legitidevs_scraper.fetch(`/player/${hyphenated_player_uuid}`)
    if (!response.ok) throw new Error(`Failed to fetch player`)

    const player = await response.json()

    return await fastify.mongo.db.aggregate([
        { $documents: [player] },
        { $match: { 'uuid': player_uuid } },
        { $project: project }
    ]).toArray()
}