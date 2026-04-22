import { parseProject, parseSortBy } from "#util/query.js"
import * as WorldsService from "#services/v4/worlds.js"
import { isValidSession } from "#util/utils.js"
import { ApiError } from "#util/errors.js"

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

        return await WorldsService.listWorlds(this.worldsCollection, { project, sortBy, limit, offset })
    }

    randomWorld = async (request, reply) => {
        const project = parseProject(request.query["project"]);
        const sortBy = parseSortBy(request.query["sort_by"]);
        const limit = request.query["limit"] ?? 1;

        return await WorldsService.randomWorld(this.worldsCollection, { project, sortBy, limit })
    }

    searchWorld = async (request, reply) => {
        const query = request.query["query"]
		const project = parseProject(request.query["project"]);
		const sortBy = parseSortBy(request.query["sort_by"]);
		const limit = request.query["limit"] ?? null;
		const offset = request.query["offset"] ?? null;

        return await WorldsService.searchWorld(this.worldsCollection, { query, project, sortBy, limit, offset })
    }

    getWorld = async (request, reply) => {
        const world_uuid = request.params["world_uuid"];
        const project = parseProject(request.query["project"])

        const world = await WorldsService.getWorld(this.worldsCollection, { world_uuid, project })
        if (!world) throw new ApiError(`World ${world_uuid} not found`, 404);

        return world
    }

    editWorld = async (request, reply) => {
        const world_uuid = request.params["world_uuid"];
        const edits = request.body["edits"];

        const world = await this.getWorld(request, reply)

        if (!(await isValidSession(request.headers["session-token"], world.owner_uuid)))
            throw new ApiError("Unauthorized", 401);

        await WorldsService.editWorld(this.worlds, { world_uuid, edits });

        return { edits, world_uuid };
    }

    getComments = async (request, reply) => {
        const project = parseProject(request.query["project"])
        const sortBy = parseSortBy(request.query["sort_by"])
        const limit = request.query["limit"] ?? null
        const offset = request.query["offset"] ?? null

        const world_uuid = request.params["world_uuid"];

        return await WorldsService.getComments(this.worldsCollection, { world_uuid, project, sortBy, limit, offset })
    }

    getComment = async (request, reply) => {
        const comment_uuid = request.params["comment_uuid"];
        const project = parseProject(request.query["project"]);

        const comment = await this.getComment(request, reply);

        return comment
    }

    postComment = async (request, reply) => {
        const world_uuid = request.params["world_uuid"]
        const profile_uuid = request.body["profile_uuid"]
        const content = request.body["content"]

        const world = await WorldsService.getWorld(this.worldsCollection, { world_uuid });
        
        if (!world) throw new ApiError(`World ${world_uuid}`, 404);
        if (!(await isValidSession(request.headers["session-token"], profile_uuid))) throw new ApiError("Unauthorized", 401)

        return await WorldsService.postComment(this.worldsCollection, { world_uuid, profile_uuid, content })
    }

    deleteComment = async (request, reply) => {
        const comment_uuid = request.params["comment_uuid"]

        const comment = await this.getComment(request, reply)

        if (!(await isValidSession(request.headers["session-token"], comment.profile_uuid))) throw new ApiError("Unauthorized", 401)

        return await WorldsService.deleteComment(this.worldsCollection, { comment_uuid })
    }
}