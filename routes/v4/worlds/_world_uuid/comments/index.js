"use strict";
import "dotenv/config";
import { ApiError } from "#util/errors.js";
import { WorldCommentListGetParamSchema, WorldCommentListGetQuerySchema, WorldCommentGetParamSchema, WorldCommentPostBodySchema, WorldCommentPostParamSchema, WorldCommentDeleteParamSchema } from "#schemas/worlds.js";
import { isValidSession, parseProject } from "#util/utils.js";
import { randomUUID } from "crypto";

function parseSortBy(sortByString = "") {
	// Expects `+-sort_method`
	const hasDirection = sortByString[0] != "+" && sortByString[0] != "-";

	const sortDirection = hasDirection ? "+" : sortByString[0];
	const order = sortDirection == "+" ? -1 : 1;

	const sortMethod = hasDirection ? sortByString : sortByString.slice(1);

	const sortMethods = {
		default: { date: order },
	};

	return sortMethods[sortMethod] ?? sortMethods.default;
}

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function (fastify, opts) {
	const worlds = fastify.mongo.db.collection("worlds");
    // DONE
    fastify.get("/", {
        schema: {
            params: WorldCommentListGetParamSchema,
            querystring: WorldCommentListGetQuerySchema
        }
    }, async function (request, reply) {
        const project = parseProject(request.query["project"])
        const sortBy = parseSortBy(request.query["sort_by"])
        const limit = request.query["limit"] ?? null
        const offset = request.query["offset"] ?? null

        const world_uuid = request.params.world_uuid;
        
        const aggregateStages = [
            { $match: { world_uuid } },
            { $unwind: "$legitidevs.comments" }, 
            { $replaceRoot: { newRoot: "$legitidevs.comments" } },
        ]
        
        if (offset !== null) aggregateStages.push({ $skip: offset })
		if (limit !== null) aggregateStages.push({ $limit: limit })

        aggregateStages.push({ $sort: sortBy }, { $project: project })

        return await worlds
            .aggregate(aggregateStages)
            .toArray();
    });
    
    // DONE
    fastify.get("/:comment_uuid", {
        schema: {
            params: WorldCommentGetParamSchema
        }
    }, async function (request, reply) {
        const world_uuid = request.params.world_uuid;
        const comment_uuid = request.params.comment_uuid;
        const result = await worlds
            .aggregate([
                { $match: { world_uuid, "legitidevs.comments.uuid": comment_uuid } },
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
                }
            ])
            .toArray();

        if (result.length === 0) reply.send(new ApiError(`Comment '${comment_uuid}' not found in world '${world_uuid}'`, 404));

        return result[0];
    });
    
    // Done
    fastify.post("/", {
        schema: {
            params: WorldCommentPostParamSchema,
            body: WorldCommentPostBodySchema
        }
    }, async function (request, reply) {
        const world_uuid = request.params.world_uuid
        const profile_uuid = request.body.profile_uuid
        const content = request.body.content

        const world = await worlds.findOne({ world_uuid });
        
        if (!world) return reply.send(new ApiError(`World ${world_uuid}`, 404));
        if (!(await isValidSession(request.headers["session-token"], profile_uuid))) return reply.send(new ApiError("Unauthorized", 401))

        const comment = { 
            profile_uuid: profile_uuid, 
            content: content, 
            date: Math.floor(Date.now() / 1000), 
            uuid: randomUUID() 
        }
        
        await worlds.updateOne(
            { world_uuid },
            { $push: { "legitidevs.comments": { ...comment } } }
        );
        
        return { ...comment }
    })

    // Done
    fastify.delete("/:comment_uuid", {
        schema: {
            params: WorldCommentDeleteParamSchema
        }
    }, async function (request, reply) {
        const world_uuid = request.params.world_uuid
        const comment_uuid = request.params.comment_uuid

        const comment = await worlds.aggregate([
            { $match: { world_uuid } },
            { $unwind: "$legitidevs.comments" }, 
            { $replaceRoot: { newRoot: "$legitidevs.comments" } },
            { $match: { uuid: comment_uuid } }
        ]).toArray();
        
        if (!comment[0]) return reply.send(new ApiError(`Comment ${comment_uuid} in World ${world_uuid}`, 404));
        if (!(await isValidSession(request.headers["session-token"], comment[0].profile_uuid))) return reply.send(new ApiError("Unauthorized", 401))

        await worlds.updateOne(
            { "legitidevs.comments": { $elemMatch: { uuid: comment_uuid } } },
            { $pull: { "legitidevs.comments": { uuid: comment_uuid } } }
        );

        return { removed_uuid: comment_uuid }
    })
}