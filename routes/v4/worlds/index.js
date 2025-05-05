"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { defaultFilter, parseSortDirection, parseSortingMethod } from "../../../util/utils.js";
import { CONFIG } from "../../../util/config.js";
import { NotFoundError, WrongTypeError } from "../../../util/errors.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function (fastify, opts) {
	fastify.get("/", async function (request, reply) {
		const page = request.query.page ?? null;
		const sortMethod = request.query.sortMethod ?? "default";
		const sortDirection = request.query.sortDirection ?? "ascending";
		const max = request.query.max ?? null;

		const parsedSortMethod = parseSortingMethod(sortMethod, sortDirection);

		// PAGINATION
		if (page !== null) {
			const parsedPageInt = parseInt(page);
			if (isNaN(parsedPageInt))
				return reply.send(new WrongTypeError("request.query.page", "number"));

			const parsedPageSizeInt = max
				? parseInt(max)
				: CONFIG.V4.WORLDS.DEFAULT_PAGE_SIZE;
			if (isNaN(parsedPageSizeInt))
				return reply.send(new WrongTypeError("request.query.max", "number"));

			const worldsInPage = await worlds
				.find(defaultFilter)
				.sort(parsedSortMethod)
				.skip(parsedPageInt * parsedPageSizeInt)
				.limit(parsedPageSizeInt)
				.toArray();

			return worldsInPage;
		}

		// LIMIT WORLDS
		if (max !== null) {
			const parsedMaxInt = parseInt(max);
			if (isNaN(parsedMaxInt))
				return reply.send(new WrongTypeError("request.query.max", "number"));

			const worldsInLimit = await worlds
				.find(defaultFilter)
				.sort(parsedSortMethod)
				.limit(parsedMaxInt)
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
		const uuid = request.params.uuid;
		const world = await worlds.findOne({ world_uuid: uuid });
        if (!world) reply.send(new NotFoundError(`World '${uuid}'`));
		return world;
	});

    fastify.get("/:world_uuid/comments", async function (request, reply) {
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
			const parsedPageInt = parseInt(page);
			if (isNaN(parsedPageInt))
				return reply.send(new WrongTypeError("request.query.page", "number"));
			if (parsedPageInt < 0) return reply.code(400).send(new RangeError("request.query.page must be zero or a positive number."))

			const parsedPageSizeInt = max
				? parseInt(max)
				: CONFIG.V4.WORLDS.COMMENTS.DEFAULT_PAGE_SIZE;
			if (isNaN(parsedPageSizeInt))
				return reply.send(new WrongTypeError("request.query.max", "number"));
			if (parsedPageSizeInt <= 0) return reply.code(400).send(new RangeError("request.query.max must be above zero"))

			const resultsInPage = await worlds
				.aggregate([
					{ $match: { world_uuid } },
					sortAggregateStage,
					{
						$project: {
							"legitidevs.comments": {
								$slice: [
									"$legitidevs.comments",
									parsedPageInt * parsedPageSizeInt,
									parsedPageSizeInt,
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
			const parsedMaxInt = parseInt(max)
			if (isNaN(parsedMaxInt))
				return reply.send(new WrongTypeError("request.query.max", "number"));
			if (parsedMaxInt <= 0) return reply.code(400).send(new RangeError("request.query.max must be above zero"))

			const resultsInPage = await worlds
				.aggregate([
					{ $match: { world_uuid } },
					sortAggregateStage,
					{
						$project: {
							"legitidevs.comments": {
								$slice: ["$legitidevs.comments", parsedMaxInt],
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
		if (result.length === 0) reply.send(new NotFoundError(`Comment '${comment_uuid}' not found in world '${world_uuid}'`));
		const { name, raw_name, comment } = result[0];
		return { ...comment, from: { world_uuid, name, raw_name } };
	});
}
