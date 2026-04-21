import { parseProject, parseSortBy } from "#util/query.js"
import * as WorldsService from "#services/v4/worlds.js"
import { isValidSession } from "#util/utils.js"

export class WorldsController {
    /** @param {import("fastify").FastifyInstance} fastify */
    constructor(fastify) {
        this.worldsCollection = fastify.mongo.db.collection("worlds")
    }

    listWorlds = async (request, reply) => {
        const project = parseProject(request.query["project"])
        const sortBy = parseSortBy(request.query["sort_by"])
        const limit = request.query["limit"] ?? null
        const offset = request.query["offset"] ?? null

        return WorldsService.listWorlds(this.worldsCollection, { project, sortBy, limit, offset })
    }

    randomWorld = async (request, reply) => {
        const project = parseProject(request.query["project"]);
        const sortBy = parseSortBy(request.query["sort_by"]);
        const limit = request.query["limit"] ?? 1;

        return WorldsService.randomWorld(this.worldsCollection, { project, sortBy, limit })
    }

    searchWorld = async (request, reply) => {
        const query = request.query["query"]
		const project = parseProject(request.query["project"]);
		const sortBy = parseSortBy(request.query["sort_by"]);
		const limit = request.query["limit"] ?? null;
		const offset = request.query["offset"] ?? null;

        return WorldsService.searchWorld(this.worldsCollection, { query, project, sortBy, limit, offset })
    }

    getWorld = async (request, reply) => {
        const world_uuid = request.params["world_uuid"];
        const project = parseProject(request.query["project"])

        return WorldsService.getWorld(this.worldsCollection, { world_uuid, project })
    }

    patchWorld = async (request, reply) => {
        const { world_uuid } = request.params;
        const { edits } = request.body;

        const world = await WorldsService.getWorld(this.worlds, world_uuid);
        if (!world) throw new ApiError(`World ${world_uuid} not found`, 404);

        if (!(await isValidSession(request.headers["session-token"], world.owner_uuid)))
            throw new ApiError("Unauthorized", 401);

        await WorldsService.patchWorld(this.worlds, world_uuid, edits);

        return { edits, world_uuid };
    }
}