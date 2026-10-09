import { GetWorldListStatsOptions, GetWorldStatsOptions } from "#schemas/services/world_stats.js";
import { WorldStats } from "#schemas/worlds.js";
import { standardizeUUID } from "#util/utils.js";
import { Collection } from "mongodb";


export async function getWorldListStats(collection: Collection<WorldStats>, { project }: GetWorldListStatsOptions) {
    return await collection.find({}, { projection: project }).toArray()
}

export async function getWorldStats(collection: Collection<WorldStats>, { world_uuid, project }: GetWorldStatsOptions) {
    const hyphenated_world_uuid = standardizeUUID(world_uuid);
    return await collection.findOne({ world_uuid: hyphenated_world_uuid }, { projection: project })
}