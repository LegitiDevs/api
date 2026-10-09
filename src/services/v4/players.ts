import { Player } from "#schemas/players.js";
import { GetPlayerOptions, ListPlayersOptions, SearchPlayersOptions } from "#schemas/services/players.js";
import { standardizeUUID } from "#util/utils.js";
import { FastifyInstance } from "fastify";
import { Document } from "mongodb";

export async function listPlayers(fastify: FastifyInstance, { project, sort_by, limit, offset }: ListPlayersOptions) {
    if (fastify.mongo.db == null) throw new Error(`DB does not exist`)

    let response: Response | undefined
    try {
        response = await fastify.legitidevs_scraper.fetch(`/player`)
    } catch  {
        return []
    }

    const players = await response.json() as Player[]

    const stages: Document[] = [
        { $documents: players }, 
        { $sort: sort_by }
    ];
    
    if (offset !== undefined) stages.push({ $skip: offset })
    if (limit !== undefined) stages.push({ $limit: limit })

    stages.push({ $project: project });
    return await fastify.mongo.db.aggregate(stages).toArray() as Player[];
}

export async function getPlayer(fastify: FastifyInstance, { player_uuid, project }: GetPlayerOptions) {
    if (fastify.mongo.db == null) throw new Error(`DB does not exist`)
    
    const hyphenated_player_uuid = standardizeUUID(player_uuid)
    let response: Response | undefined
    try {
        response = await fastify.legitidevs_scraper.fetch(`/player/${hyphenated_player_uuid}`)
    } catch  {
        return {}
    }

    if (!response.ok) return {}

    const player = await response.json() as Player;

    const projected = await fastify.mongo.db.aggregate([
        { $documents: [player] },
        { $project: project }
    ]).toArray()

    return projected[0] as Partial<Player>
}

export async function searchPlayer(fastify: FastifyInstance, { query, project, sort_by, limit, offset }: SearchPlayersOptions) {
    if (fastify.mongo.db == null) throw new Error(`DB does not exist`)

    let response: Response | undefined
    try {
        response = await fastify.legitidevs_scraper.fetch(`/player`)
    } catch  {
        return []
    }
    if (!response.ok || !query) return [];

    const players = await response.json() as Player;
    const sanitized_query = query.replaceAll(/[-"]/g,'')
    
    const stages: Document[] = [
        { $documents: players },
        { $match: { $text: { $search: sanitized_query } } },
        { $sort: sort_by }
    ];  

    if (offset !== undefined) stages.push({ $skip: offset });
    if (limit !== undefined) stages.push({ $limit: limit });

    stages.push({ $project: project });

    return await fastify.mongo.db.aggregate(stages).toArray() as Player[];
}