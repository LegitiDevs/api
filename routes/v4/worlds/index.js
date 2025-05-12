"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { defaultFilter, parseSortDirection, parseSortingMethod } from "../../../util/utils.js";
import { CONFIG } from "../../../util/config.js";
import { NotFoundError, WrongTypeError } from "../../../util/errors.js";
import { WorldsQuerySchema, WorldGetParamSchema, WorldCommentListGetParamSchema, WorldCommentListGetQuerySchema, WorldCommentGetParamSchema } from "../../../schemas/worlds.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function (fastify, opts) {
	fastify.get("/", async function (request, reply) {
		const { success, data, error } = WorldsQuerySchema.safeParse(request.query);
		if (!success) return reply.send(error)

		const page = data.page ?? null;
		const sortMethod = data.sortMethod ?? "default";
		const sortDirection = data.sortDirection ?? "ascending";
		const max = data.max ?? null;

		const parsedSortMethod = parseSortingMethod(sortMethod, sortDirection);

		// PAGINATION
		if (page !== null) {
			const pageSize = max ?? CONFIG.V4.WORLDS.DEFAULT_PAGE_SIZE;

			const worldsInPage = await worlds
				.find(defaultFilter)
				.sort(parsedSortMethod)
				.skip(page * pageSize)
				.limit(pageSize)
				.toArray();

			return worldsInPage;
		}

		// LIMIT WORLDS
		if (max !== null) {
			const worldsInLimit = await worlds
				.find(defaultFilter)
				.sort(parsedSortMethod)
				.limit(max)
				.toArray();

			return worldsInLimit;
		}

		const worldsFound = await worlds
			.find(defaultFilter)
			.sort(parsedSortMethod)
			.toArray();
		return worldsFound;
	});

	fastify.get("/:uuid", async function (request, reply) {
		const { success, data, error } = WorldGetParamSchema.safeParse(request.params)
		if (!success) return reply.send(error)

		const uuid = data.uuid;
		const world = await worlds.findOne({ world_uuid: uuid });
        if (!world) reply.send(new NotFoundError(`World '${uuid}'`));
		return world;
	});

    fastify.get("/:world_uuid/comments", async function (request, reply) {
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

    fastify.get("/:world_uuid/comments/:comment_uuid", async function (request, reply) {
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

	fastify.patch("/:uuid", async function (request, reply) {
		return { _message: "wip" }
	})
}
