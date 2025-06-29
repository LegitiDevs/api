"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

/**
 * @param {import("fastify").FastifyInstance} fastify  
 */
export default async function (fastify, opts) {
  fastify.get("/:uuid", async function (request, reply) {
    const uuid = request.params.uuid;
    const world = await worlds.findOne({ world_uuid: uuid });
    return world;
  });
}
