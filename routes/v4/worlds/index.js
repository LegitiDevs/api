"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { defaultFilter, deRegexifyTheRegexSoTheUserDoesntDoMaliciousThings, parseProject, parseSortingMethod } from "#util/utils.js";
import { CONFIG } from "#util/config.js";
import { WorldListGetQuerySchema, WorldListSearchGetQuerySchema, WorldListSearchGetParamSchema } from "#schemas/worlds.js";
import { WorldSchema } from "#schemas/responses.js";
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
			querystring: WorldListGetQuerySchema,
			response: {
				200: WorldSchema.array()
			}
		}
	}, async function (request, reply) {
		// "!field,field,!field"
		const project = parseProject(request.query.project)
		const sortBy = request.query.sort_by
		const limit = request.query.limit
		const offset = request.query.offset
		// +votes, -votes

		const page = request.query.page ?? null;
		const sortMethod = request.query.sortMethod ?? "default";
		const sortDirection = request.query.sortDirection ?? "ascending";
		const max = request.query.max ?? null;

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

	// DONE
	fastify.get("/random", {
		schema: { 
			response: { 200: WorldSchema } 
		}
	}, async function (request, reply) {
		const world = worlds.aggregate([
			{ $sample: { size: 1 } },
			{ $match: { ...defaultFilter } },
		]);
		for await (const doc of world) {
			return doc;
		}
	});

	// DONE
	fastify.get("/search/:query", {
		schema: {
			params: WorldListSearchGetParamSchema,
			querystring: WorldListSearchGetQuerySchema,
			response: {
				200: WorldSchema.array()
			}
		}
	}, async function (request, reply) {
		const query = deRegexifyTheRegexSoTheUserDoesntDoMaliciousThings(
			request.params.query
		);

		const sortMethod = request.query.sortMethod ?? "default";
		const sortDirection = request.query.sortDirection ?? "ascending";

		const sortingMethod = parseSortingMethod(sortMethod, sortDirection);
		if (!query) return [];

		const matched_worlds = await worlds
			.find({ name: { $regex: query, $options: "i" }, ...defaultFilter })
			.sort(sortingMethod)
			.toArray();
		return matched_worlds;
	});
}
