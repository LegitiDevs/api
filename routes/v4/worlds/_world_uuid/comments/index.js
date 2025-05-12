"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { parseSortDirection } from "../../../../../util/utils.js";
import { CONFIG } from "../../../../../util/config.js";
import { NotFoundError } from "../../../../../util/errors.js";
import { WorldCommentListGetParamSchema, WorldCommentListGetQuerySchema, WorldCommentGetParamSchema } from "../../../../../schemas/worlds.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function (fastify, opts) {
    fastify.get("/", async function (request, reply) {
        const paramValidation = WorldCommentListGetParamSchema.safeParse(request.params)
        const queryValidation = WorldCommentListGetQuerySchema.safeParse(request.query)
    
        if (!paramValidation.success) return reply.send(paramValidation.error) 
        if (!queryValidation.success) return reply.send(queryValidation.error) 
    
        const world_uuid = paramValidation.data.world_uuid;
        const page = queryValidation.data.page ?? null;
        const max = queryValidation.data.max ?? null;
        const sortDirection = queryValidation.data.sortDirection ?? "ascending";
        
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
        if (result.length === 0) reply.send(new NotFoundError(`World '${world_uuid}'`));
        
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
    
    fastify.get("/:comment_uuid", async function (request, reply) {
        const { success, data, error } = WorldCommentGetParamSchema.safeParse(request.params)
        if (!success) return reply.send(error)
        
        const world_uuid = data.world_uuid;
        const comment_uuid = data.comment_uuid;
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
        if (result.length === 0) reply.send(new NotFoundError(`Comment '${comment_uuid}' not found in world '${world_uuid}'`));
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