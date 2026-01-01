"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { ApiError, NotFoundError } from "#util/errors.js";
import { WorldGetParamSchema, WorldPatchBodySchema, WorldPatchHeaderSchema, WorldPatchParamSchema } from "#schemas/worlds.js";
import { WorldSchema } from "#schemas/responses.js";
import { z } from "zod/v4";
import { isValidSession } from "#util/utils.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function (fastify, opts) {
    // DONE
    fastify.get(
        "/", 
        {
            schema: {
                params: WorldGetParamSchema,
                response: {
                    200: WorldSchema
                }
            }
        }, 
        async function (request, reply) {
            const world = await worlds.findOne({ world_uuid: request.params.world_uuid });
            if (!world) reply.send(new ApiError(`World '${request.params.world_uuid}'`, 404));
            return world;
        }
    );

    fastify.patch("/", {
        schema: {
            params: WorldPatchParamSchema,
            headers: WorldPatchHeaderSchema,
            body: WorldPatchBodySchema,
            response: {
                200: WorldPatchBodySchema
            }
        }
    }, async function (request, reply) {
        /**
         * expects:
         * edit description
         * edit unlist
         */
        
        const world = await worlds.findOne({ world_uuid: request.params.world_uuid });

		if (!world) return reply.send(new NotFoundError(`World ${request.params.world_uuid}`));
		if (!(await isValidSession(request.headers["session-token"], world.owner_uuid))) return reply.send(new ApiError("Unauthorized", 401))

        const edits = request.body.edits

        /*
            keep the data put by the user as is.
            only do basic zod validation checks like checking length and stuff,
            but dont parse the data whatsoever.
            zod may do basic checks to see if its a real link or smth,
            but thats as simple as it can get.

            the client must do the parsing themselves.
            for example, the description can be a plain string or an snbt text component.
            the api will not bother to parse it and itll keep it as a string.
            the client must handle the data themselves to display the correct text.
        */

        return { _message: "WIP: This doesn't actually edit the data yet. Only checks for authorization.", edits }
    })
}
