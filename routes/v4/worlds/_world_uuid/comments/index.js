"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { parseSortDirection } from "#util/utils.js";
import { CONFIG } from "#util/config.js";
import { ApiError } from "#util/errors.js";
import { WorldCommentListGetParamSchema, WorldCommentListGetQuerySchema, WorldCommentGetParamSchema } from "#schemas/worlds.js";
import { CommentSchema } from "#schemas/responses.js";
import { z } from "zod/v4";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function (fastify, opts) {
    // DONE
    fastify.get("/", {
        schema: {
            params: WorldCommentListGetParamSchema,
            querystring: WorldCommentListGetQuerySchema,
            response: {
                200: z.array(CommentSchema)
            }
        }
    }, async function (request, reply) {
        const world_uuid = request.params.world_uuid;
        const page = request.query.page ?? null;
        const max = request.query.max ?? null;
        const sortDirection = request.query.sortDirection ?? "ascending";
        
        const parsedSortDirection = parseSortDirection(sortDirection);
        const sortAggregateStage = {
            $project: {
                _id: 0,
                "legitidevs.comments": {
                    $sortArray: {
                        input: "$legitidevs.comments",
                        sortBy: { date: parsedSortDirection },
                    },
                },
            },
        };
    
        // Gets all the comments
        const result = await worlds
            .aggregate([
                { $match: { world_uuid } },
                sortAggregateStage
            ])
            .toArray();
        if (result.length === 0) reply.send(new ApiError(`World ${world_uuid}`, 404));
        
        const comments = result[0]?.legitidevs?.comments;
        if (!comments) return [];
        
        if (page !== null) {
            const pageSize = max ?? CONFIG.V4.WORLDS.COMMENTS.DEFAULT_PAGE_SIZE;
            
            // pagination
            const resultsInPage = await worlds
                .aggregate([
                    { $match: { world_uuid } },
                    sortAggregateStage,
                    {
                        $project: {
                            "legitidevs.comments": {
                                $slice: [
                                    "$legitidevs.comments",
                                    page * pageSize,
                                    pageSize,
                                ]
                            },
                        },
                    },
                ])
                .toArray();
    
            const comments = resultsInPage[0]?.legitidevs?.comments
            return comments
        }
    
        if (max !== null) {
            // limits to max
            const resultsInPage = await worlds
                .aggregate([
                    { $match: { world_uuid } },
                    sortAggregateStage,
                    {
                        $project: {
                            "legitidevs.comments": {
                                $slice: ["$legitidevs.comments", max],
                            },
                        },
                    },
                ])
                .toArray();
    
            const comments = resultsInPage[0]?.legitidevs?.comments;
            return comments;
        }
         
        return comments;
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
                { $project: {
                    _id: 0,
                    name: 1,
                    raw_name: 1,
                    comment: {
                        $arrayElemAt: [{
                            $filter: {
                                input: "$legitidevs.comments",
                                as: "comment",
                                cond: { $eq: ["$$comment.uuid", comment_uuid] },
                            }
                        }, 0]
                    }
                }}
            ])
            .toArray();
        if (result.length === 0) reply.send(new ApiError(`Comment '${comment_uuid}' not found in world '${world_uuid}'`, 404));
        const { name, raw_name, comment } = result[0];
        return { ...comment, from: { world_uuid, name, raw_name } };
    });
    
    fastify.post("/", async function (request, reply) {
        return { _message: "wip" }
    })
    fastify.delete("/:comment_uuid", async function (request, reply) {
        return { _message: "wip" }
    })
}