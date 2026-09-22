import { ServerStats } from "#schemas/stats.js";
import { ApiError } from "#util/errors.js";
import { FastifyInstance } from "fastify";
import { Collection } from "mongodb";
import {
	FastifyReplyTypeBox,
	FastifyRequestTypeBox,
} from "#controllers/v4/types.js";
import { SchemaGetServerStats } from "#schemas/routes/stats.js";
import { parseProject } from "#util/query.js";
import * as ServerStatsService from "#services/v4/stats.js";

export class StatsController {
	statsCollection: Collection<ServerStats>;

	constructor(fastify: FastifyInstance) {
		if (fastify.mongo.db == null) throw new ApiError("DB not found", 500);
		this.statsCollection = fastify.mongo.db.collection("stats");
	}

	getServerStats = async (
		request: FastifyRequestTypeBox<typeof SchemaGetServerStats>,
		reply: FastifyReplyTypeBox<typeof SchemaGetServerStats>,
	) => {
		const project = parseProject(request.query["project"]);
		return await ServerStatsService.getServerStats(this.statsCollection, {
			project,
		});
	};
}
