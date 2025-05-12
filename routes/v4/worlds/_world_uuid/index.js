"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { NotFoundError } from "../../../util/errors.js";
import { WorldGetParamSchema } from "../../../schemas/worlds.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export default async function (fastify, opts) {
    fastify.get("/", async function (request, reply) {
        const { success, data, error } = WorldGetParamSchema.safeParse(request.params)
        if (!success) return reply.send(error)

        const world = await worlds.findOne({ world_uuid: data.world_uuid });
        if (!world) reply.send(new NotFoundError(`World '${data.world_uuid}'`));
        return world;
    });

    fastify.patch("/", async function (request, reply) {
        return { _message: "wip" }
    })
}
