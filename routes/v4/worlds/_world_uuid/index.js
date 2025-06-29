"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { NotFoundError } from "../../../../util/errors.js";
import { WorldGetParamSchema, WorldPatchBodySchema } from "../../../../schemas/worlds.js";
import { StringifiedJsonSchema } from "../../../../schemas/generic.js";
import { WorldSchema } from "../../../../schemas/responses.js";
import { z } from "zod/v4";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function (fastify, opts) {
    fastify.get("/", {
        schema: {
            params: WorldGetParamSchema,
            response: {
                200: WorldSchema
            }
        }
    }, async function (request, reply) {
        const { success, data, error } = WorldGetParamSchema.safeParse(request.params)
        if (!success) return reply.send(error)

        const world = await worlds.findOne({ world_uuid: data.world_uuid });
        if (!world) reply.send(new NotFoundError(`World '${data.world_uuid}'`));
        return world;
    });

    fastify.patch("/", async function (request, reply) {
        const bodyValidation = StringifiedJsonSchema.safeParse(request.body);
        if (!bodyValidation.success) return reply.send(bodyValidation.error)

        const { success, data, error } = WorldPatchBodySchema.safeParse(bodyValidation.data)
        if (!success) return reply.send(error)

        return data
    })
}
