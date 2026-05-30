import { Collection, Document } from "mongodb";
import { defaultFilter } from "#util/utils.js";
import { randomUUID } from "crypto"
import { World } from "#schemas/worlds.js";
import { DeleteCommentOptions, EditWorldOptions, GetCommentOptions, GetCommentsOptions, GetWorldOptions, ListWorldsOptions, PostCommentOptions, RandomWorldOptions, SearchWorldOptions } from "#schemas/services/worlds.js";

export async function listWorlds(collection: Collection<World>, { project, sort_by, limit, offset }: ListWorldsOptions) {
    const stages: Document[] = [{ $match: defaultFilter }];

    if (offset !== undefined) stages.push({ $skip: offset })
	if (limit !== undefined) stages.push({ $limit: limit })

	stages.push({ $sort: sort_by }, { $project: project });
	return await collection.aggregate(stages).toArray();
}

export async function randomWorld(collection: Collection<World>, { project, sort_by, limit }: RandomWorldOptions) {
    return await collection.aggregate([
        { $match: defaultFilter },
        { $sample: { size: limit } },
        { $sort: sort_by },
        { $project: project },
    ]).toArray()
}

export async function searchWorld(collection: Collection<World>, { query, project, sort_by, limit, offset }: SearchWorldOptions) {
    if (!query) return [];
	
	const stages: Document[] = [
		{ $match: { $text: { $search: `"${query}"` }, ...defaultFilter } }
	];  

	if (offset !== undefined) stages.push({ $skip: offset });
	if (limit !== undefined) stages.push({ $limit: limit });

	stages.push(
        { $sort: sort_by }, 
        { $project: project }
    );

    console.log(JSON.stringify(stages, null, 2))

	return await collection.aggregate(stages).toArray();
}

export async function getWorld(collection: Collection<World>, { world_uuid, project }: GetWorldOptions) {
    return await collection.findOne({ world_uuid }, { projection: project });
}

export async function editWorld(collection: Collection<World>, { world_uuid, edits }: EditWorldOptions) {
    const updateObject = {
        $set: Object.fromEntries(
            Object.entries(edits).map(([key, value]) => [`legitidevs.${key}`, value])
        )
    };
    return await collection.updateOne({ world_uuid }, updateObject);
}

export async function getComments(collection: Collection<World>, { world_uuid, project, sort_by, limit, offset }: GetCommentsOptions) {
	const stages: Document[] = [
		{ $match: { world_uuid } },
		{ $unwind: "$legitidevs.comments" },
		{ $replaceRoot: { newRoot: "$legitidevs.comments" } },
	];

	if (offset !== undefined) stages.push({ $skip: offset });
	if (limit !== undefined) stages.push({ $limit: limit });

	stages.push({ $sort: sort_by }, { $project: project });

	return await collection.aggregate(stages).toArray();
}

export async function getComment(collection: Collection<World>, { comment_uuid, project }: GetCommentOptions) {
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

export async function postComment(collection: Collection<World>, { world_uuid, profile_uuid, content }: PostCommentOptions) {
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

export async function deleteComment(collection: Collection<World>, { comment_uuid }: DeleteCommentOptions) {
    await collection.updateOne(
		{ "legitidevs.comments": { $elemMatch: { uuid: comment_uuid } } },
		{ $pull: { "legitidevs.comments": { uuid: comment_uuid } } },
	);

	return { removed_uuid: comment_uuid };
}
