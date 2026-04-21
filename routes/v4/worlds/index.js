"use strict";
import "dotenv/config";

import { 
	defaultFilter, 
	parseProject, 
	parseSortBy 
} from "#util/utils.js";

import { 
	WorldListGetQuerySchema,
	WorldRandomGetQuerySchema, 
	WorldSearchGetQuerySchema 
} from "#schemas/worlds.js";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function (fastify, opts) {
	const worlds = fastify.mongo.db.collection("worlds");

	// DONE
	fastify.get("/", {
		schema: {
			querystring: WorldListGetQuerySchema
		}
	}, async function (request, reply) {
		const project = parseProject(request.query["project"])
		const sortBy = parseSortBy(request.query["sort_by"])
		const limit = request.query["limit"] ?? null
		const offset = request.query["offset"] ?? null

		const aggregateStages = [{ $match: defaultFilter }]
		
		if (offset !== null) aggregateStages.push({ $skip: offset })
		if (limit !== null) aggregateStages.push({ $limit: limit })

		aggregateStages.push({ $sort: sortBy }, { $project: project });

		return await worlds.aggregate(aggregateStages).toArray();
	});

	// DONE
	fastify.get("/random", {
		schema: { querystring: WorldRandomGetQuerySchema }
	}, async function (request, reply) {
		const project = parseProject(request.query["project"]);
		const sortBy = parseSortBy(request.query["sort_by"]);
		const limit = request.query["limit"] ?? 1;

		return await worlds.aggregate([
			{ $match: defaultFilter },
			{ $sample: { size: limit } },
			{ $sort: sortBy },
			{ $project: project },
		]).toArray()
	});

	// DONE
	fastify.get("/search", {
		schema: { querystring: WorldSearchGetQuerySchema }
	}, async function (request, reply) {
		const query = request.query["query"]
		const project = parseProject(request.query["project"]);
		const sortBy = parseSortBy(request.query["sort_by"]);
		const limit = request.query["limit"] ?? null;
		const offset = request.query["offset"] ?? null;

		if (!query) return [];
		
		const aggregateStages = [
			{ $match: { "normalized_name": { $regex: query, $options: "i" }, ...defaultFilter } }
		];

		if (offset !== null) aggregateStages.push({ $skip: offset });
		if (limit !== null) aggregateStages.push({ $limit: limit });

		aggregateStages.push({ $sort: sortBy }, { $project: project });
		return await worlds.aggregate(aggregateStages).toArray();
	});
}
