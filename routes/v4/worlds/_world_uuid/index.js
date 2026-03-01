"use strict";
import "dotenv/config";
import { ApiError } from "#util/errors.js";
import { WorldGetParamSchema, WorldGetQuerySchema, WorldPatchBodySchema, WorldPatchHeaderSchema, WorldPatchParamSchema } from "#schemas/worlds.js";
import { isValidSession, parseProject } from "#util/utils.js";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function (fastify, opts) {
	const worlds = fastify.mongo.db.collection("worlds");
    // DONE
    fastify.get("/", {
        schema: { 
            params: WorldGetParamSchema,
            querystring: WorldGetQuerySchema
        }
    }, async function (request, reply) {
            const project = parseProject(request.query["project"])

            const world = await worlds
                .find({ world_uuid: request.params.world_uuid })
                .project(project)
                .toArray();

            if (!world[0]) return reply.send(new ApiError(`World ${request.params.world_uuid}`, 404));

            return world[0];
        }
    );

    // DONE
    fastify.patch("/", {
        schema: {
            params: WorldPatchParamSchema,
            headers: WorldPatchHeaderSchema,
            body: WorldPatchBodySchema
        }
    }, async function (request, reply) {
        const world = await worlds.findOne({ world_uuid: request.params.world_uuid });

		if (!world) return reply.send(new ApiError(`World ${request.params.world_uuid}`, 404));
		if (!(await isValidSession(request.headers["session-token"], world.owner_uuid))) return reply.send(new ApiError("Unauthorized", 401))

        const edits = request.body.edits
        const updateObject = { $set: {} }

        for (const key in edits) {
            updateObject.$set[`legitidevs.${key}`] = edits[key]
        }

        worlds.updateOne({ world_uuid: request.params.world_uuid }, updateObject);

        return { edits, world_uuid: world.world_uuid }
    })
}
