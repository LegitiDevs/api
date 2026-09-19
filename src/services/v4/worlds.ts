import { Collection, Document } from "mongodb";
import { World } from "#schemas/worlds.js";
import { GetWorldOptions, ListWorldsOptions, RandomWorldOptions, SearchWorldOptions } from "#schemas/services/worlds.js";

export const WORLDS_DEFAULT_FILTER = {
  "legitidevs.deleted": { $ne: true },
};

export async function listWorlds(collection: Collection<World>, { project, sort_by, limit, offset }: ListWorldsOptions) {
    const stages: Document[] = [{ $match: WORLDS_DEFAULT_FILTER }];

    if (offset !== undefined) stages.push({ $skip: offset })
	if (limit !== undefined) stages.push({ $limit: limit })

	stages.push({ $sort: sort_by }, { $project: project });
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
		{ $match: { $text: { $search: sanitized_query }, ...WORLDS_DEFAULT_FILTER } }
	];  

	if (offset !== undefined) stages.push({ $skip: offset });
	if (limit !== undefined) stages.push({ $limit: limit });

	stages.push(
        { $sort: sort_by }, 
        { $project: project }
    );

	return await collection.aggregate(stages).toArray();
}

export async function getWorld(collection: Collection<World>, { world_uuid, project }: GetWorldOptions) {
    return await collection.findOne({ world_uuid }, { projection: project });
}