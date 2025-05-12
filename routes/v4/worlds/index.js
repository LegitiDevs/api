"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { defaultFilter, deRegexifyTheRegexSoTheUserDoesntDoMaliciousThings, parseSortingMethod } from "../../../util/utils.js";
import { CONFIG } from "../../../util/config.js";
import { WorldListGetQuerySchema, WorldListSearchGetQuerySchema, WorldListSearchGetParamSchema } from "../../../schemas/worlds.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function (fastify, opts) {
	fastify.get("/", async function (request, reply) {
		const { success, data, error } = WorldListGetQuerySchema.safeParse(request.query);
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

	fastify.get("/random", async function (request, reply) {
		const world = worlds.aggregate([
			{ $sample: { size: 1 } },
			{ $match: { ...defaultFilter } },
		]);
		for await (const doc of world) {
			return doc;
		}
	});

	fastify.get("/search/:query", async function (request, reply) {
		const paramValidation = WorldListSearchGetParamSchema.safeParse(request.params)
		const queryValidation = WorldListSearchGetQuerySchema.safeParse(request.query)

		if (!paramValidation.success) return reply.send(paramValidation.error)
		if (!queryValidation.success) return reply.send(queryValidation.error)

		const query = deRegexifyTheRegexSoTheUserDoesntDoMaliciousThings(
			paramValidation.data.query
		);

		const sortMethod = queryValidation.data.sortMethod ?? "default";
		const sortDirection = queryValidation.data.sortDirection ?? "ascending";

		const sortingMethod = parseSortingMethod(sortMethod, sortDirection);
		if (!query) return [];

		const matched_worlds = await worlds
			.find({ name: { $regex: query, $options: "i" }, ...defaultFilter })
			.sort(sortingMethod)
			.toArray();
		return matched_worlds;
	});
}
