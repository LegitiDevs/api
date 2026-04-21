import { defaultFilter } from "#util/utils.js";

export async function listWorlds(collection, { project, sortBy, limit, offset }) {
    const stages = [{ $match: defaultFilter }];

    if (offset !== null) stages.push({ $skip: offset })
	if (limit !== null) stages.push({ $limit: limit })

	stages.push({ $sort: sortBy }, { $project: project });
	return await collection.aggregate(stages).toArray();
}

export async function randomWorld(collection, { project, sortBy, limit }) {
    return await collection.aggregate([
        { $match: defaultFilter },
        { $sample: { size: limit } },
        { $sort: sortBy },
        { $project: project },
    ]).toArray()
}

export async function searchWorld(collection, { query, project, sortBy, limit, offset }) {
    if (!query) return [];
	
	const stages = [
		{ $match: { "name": { $regex: query, $options: "i" }, ...defaultFilter } }
	];

	if (offset !== null) stages.push({ $skip: offset });
	if (limit !== null) stages.push({ $limit: limit });

	stages.push({ $sort: sortBy }, { $project: project });

	return await collection.aggregate(stages).toArray();
}

export async function getWorld(collection, { world_uuid, project }) {
    return collection.findOne({ world_uuid }, { projection: project });
}

export async function patchWorld(collection, world_uuid, edits) {
    const updateObject = {
        $set: Object.fromEntries(
            Object.entries(edits).map(([key, value]) => [`legitidevs.${key}`, value])
        )
    };
    return collection.updateOne({ world_uuid }, updateObject);
}