import { Collection, Document } from "mongodb";
import { World, WorldPlayers } from "#schemas/worlds.js";
import { GetPlayersInWorldListOptions, GetPlayersInWorldOptions, GetWorldOptions, GetWorldsFromPlayerOptions, ListWorldsOptions, RandomWorldOptions, SearchWorldOptions } from "#schemas/services/worlds.js";
import { FastifyInstance } from "fastify";
import { standardizeUUID } from "#util/utils.js";

export const WORLDS_DEFAULT_FILTER = {
  "legitidevs.deleted": { $ne: true },
};

export async function listWorlds(collection: Collection<World>, { project, sort_by, limit, offset }: ListWorldsOptions) {
    const stages: Document[] = [
        { $match: WORLDS_DEFAULT_FILTER }, 
        { $sort: sort_by }
    ];

    if (offset !== undefined) stages.push({ $skip: offset })
	if (limit !== undefined) stages.push({ $limit: limit })

	stages.push({ $project: project });
	return await collection.aggregate(stages).toArray();
}

export async function randomWorld(collection: Collection<World>, { project, sort_by, limit }: RandomWorldOptions) {
    return await collection.aggregate([
        { $match: WORLDS_DEFAULT_FILTER },
        { $sample: { size: limit } },
        { $sort: sort_by },
        { $project: project },
    ]).toArray()
}

export async function searchWorld(collection: Collection<World>, { query, project, sort_by, limit, offset }: SearchWorldOptions) {
    if (!query) return [];

    const sanitized_query = query.replaceAll(/[-"]/g,'')
	
	const stages: Document[] = [
		{ $match: { $text: { $search: sanitized_query }, ...WORLDS_DEFAULT_FILTER } },
        { $sort: sort_by }
	];  

	if (offset !== undefined) stages.push({ $skip: offset });
	if (limit !== undefined) stages.push({ $limit: limit });

	stages.push(
        { $project: project }
    );

	return await collection.aggregate(stages).toArray();
}

export async function getWorld(collection: Collection<World>, { world_uuid, project }: GetWorldOptions) {
    return await collection.findOne({ world_uuid }, { projection: project });
}

export async function getWorldsFromPlayer(collection: Collection<World>, { player_uuid, project, sort_by, limit, offset }: GetWorldsFromPlayerOptions) {
    const stages: Document[] = [
        { $match: {...WORLDS_DEFAULT_FILTER, owner_uuid: player_uuid} }, 
        { $sort: sort_by }
    ];

    if (offset !== undefined) stages.push({ $skip: offset })
	if (limit !== undefined) stages.push({ $limit: limit })

	stages.push({ $project: project });
	return await collection.aggregate(stages).toArray();
}

export async function getPlayersInWorldList(fastify: FastifyInstance, { offset, limit }: GetPlayersInWorldListOptions) {
    if (fastify.mongo.db == null) throw new Error(`DB does not exist`)

    const response = await fastify.legitidevs_scraper.fetch('/players')
    if (!response.ok) throw new Error(`Failed to fetch players in world list.`)

    const players = await response.json()

    const stages: Document[] = [
        { $documents: players }
    ];  

    if (offset !== undefined) stages.push({ $skip: offset })
	if (limit !== undefined) stages.push({ $limit: limit })
    
    return await fastify.mongo.db.aggregate(stages).toArray();
}

export async function getPlayersInWorld(fastify: FastifyInstance, { world_uuid }: GetPlayersInWorldOptions) {
    if (fastify.mongo.db == null) throw new Error(`DB does not exist`)

    const hyphenated_world_uuid = standardizeUUID(world_uuid);
    const response = await fastify.legitidevs_scraper.fetch(`/players/${hyphenated_world_uuid}`)
    if (!response.ok) throw new Error(`Failed to fetch players in world list.`)

    const playersInWorld = await response.json() as WorldPlayers

    return { players: [playersInWorld.players] }
}