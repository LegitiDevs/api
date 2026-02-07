"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { defaultFilter, deRegexifyTheRegexSoTheUserDoesntDoMaliciousThings, parseProject, parseSortBy, parseSortingMethod } from "#util/utils.js";
import { WorldListGetQuerySchema, WorldListSearchGetQuerySchema, WorldListSearchGetParamSchema, WorldRandomGetQuerySchema as WorldRandomGetQuerySchema, WorldSearchGetQuerySchema } from "#schemas/worlds.js";
import { WorldSchema } from "#schemas/responses.js";

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
			querystring: WorldListGetQuerySchema,
			response: { 200: WorldSchema.array() }
		}
	}, async function (request, reply) {
		// "!field,field,!field"
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
		schema: {
			querystring: WorldRandomGetQuerySchema,
			response: { 200: WorldSchema.array() } 
		}
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
		schema: {
			querystring: WorldSearchGetQuerySchema,
			response: {
				200: WorldSchema.array()
			}
		}
	}, async function (request, reply) {
		// TODO: use zod and another tool to sanitize input after validation
		const query = deRegexifyTheRegexSoTheUserDoesntDoMaliciousThings(request.query["query"]);
		console.log(query)
		const project = parseProject(request.query["project"]);
		const sortBy = parseSortBy(request.query["sort_by"]);
		const limit = request.query["limit"] ?? null;
		const offset = request.query["offset"] ?? null;

		if (!query) return [];

		const aggregateStages = [
			{ $match: { name: { $regex: query, $options: "i" }, ...defaultFilter } }
		];

		if (offset !== null) aggregateStages.push({ $skip: offset });
		if (limit !== null) aggregateStages.push({ $limit: limit });

		aggregateStages.push({ $sort: sortBy }, { $project: project });
		console.log(await worlds.aggregate(aggregateStages).toArray());
		return await worlds.aggregate(aggregateStages).toArray();
	});
}
