import { Collection } from "mongodb";
import { defaultFilter } from "#util/utils.js";
import { randomUUID } from "crypto"

// TODO: move these inline types to types.ts schema

export async function listWorlds(collection: Collection, { project, sortBy, limit, offset }) {
    const stages = [{ $match: defaultFilter }];

    if (offset !== null) stages.push({ $skip: offset })
	if (limit !== null) stages.push({ $limit: limit })

	stages.push({ $sort: sortBy }, { $project: project });
	return await collection.aggregate(stages).toArray();
}

export async function randomWorld(collection: Collection, { project, sortBy, limit }) {
    return await collection.aggregate([
        { $match: defaultFilter },
        { $sample: { size: limit } },
        { $sort: sortBy },
        { $project: project },
    ]).toArray()
}

export async function searchWorld(collection: Collection, { query, project, sortBy, limit, offset }) {
    if (!query) return [];
	
	const stages = [
		{ $match: { $text: { $search: `"${query}"` }, ...defaultFilter } }
	];  

	if (offset !== null) stages.push({ $skip: offset });
	if (limit !== null) stages.push({ $limit: limit });

	stages.push(
        { $sort: sortBy }, 
        { $project: project }
    );

    console.log(JSON.stringify(stages, null, 2))

	return await collection.aggregate(stages).toArray();
}

export async function getWorld(collection: Collection, { world_uuid, project = undefined }: { world_uuid: string, project?: Record<string, number> }) {
    return await collection.findOne({ world_uuid }, { projection: project });
}

export async function editWorld(collection: Collection, { world_uuid, edits }) {
    const updateObject = {
        $set: Object.fromEntries(
            Object.entries(edits).map(([key, value]) => [`legitidevs.${key}`, value])
        )
    };
    return await collection.updateOne({ world_uuid }, updateObject);
}

export async function getComments(collection: Collection, { world_uuid, project, sortBy, limit, offset }) {
	const stages = [
		{ $match: { world_uuid } },
		{ $unwind: "$legitidevs.comments" },
		{ $replaceRoot: { newRoot: "$legitidevs.comments" } },
	];

	if (offset !== null) stages.push({ $skip: offset });
	if (limit !== null) stages.push({ $limit: limit });

	stages.push({ $sort: sortBy }, { $project: project });

	return await collection.aggregate(stages).toArray();
}

export async function getComment(collection: Collection, { comment_uuid, project = undefined }: { comment_uuid: string, project?: Record<string, number> }) {
    const comments = await collection
        .aggregate([
            { $match: { "legitidevs.comments.uuid": comment_uuid } },
            { $unwind: "$legitidevs.comments" },
            {
              $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        { 
                            from: {
                                name: "$name", 
                                raw_name: "$raw_name", 
                                world_uuid: "$world_uuid" 
                            }
                        },
                        "$legitidevs.comments"
                    ]
                }
              }
            },
            { $project: project }
        ])
        .toArray();

    return comments[0];
}

export async function postComment(collection: Collection, { world_uuid, profile_uuid, content }) {
    const comment = {
		profile_uuid: profile_uuid,
		content: content,
		date: Math.floor(Date.now() / 1000),
		uuid: randomUUID(),
	};

	await collection.updateOne(
		{ world_uuid },
		{ $push: { "legitidevs.comments": { ...comment } } },
	);

	return { ...comment };
}

export async function deleteComment(collection: Collection, { comment_uuid }) {
    await collection.updateOne(
		{ "legitidevs.comments": { $elemMatch: { uuid: comment_uuid } } },
		{ $pull: { "legitidevs.comments": { uuid: comment_uuid } } },
	);

	return { removed_uuid: comment_uuid };
}
