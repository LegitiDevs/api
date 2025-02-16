"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { canEditWorld } from "../../../util/canEditWorld.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

export default async function (fastify, opts) {
	fastify.post("/", async function (request, reply) {
    const body = JSON.parse(request.body);
		const world = await worlds.findOne({ world_uuid: body.world_uuid });

		if (!world)
			return reply
				.code(404)
				.header("Content-Type", "application/json; charset=utf-8")
				.send({ message: `World '${body.world_uuid}' does not exist.` });

    if (!await canEditWorld(request.headers.authorization, world.owner_uuid)) {
      return reply
				.code(401)
				.header("Content-Type", "application/json; charset=utf-8")
				.send({ message: `You don't have access to edit this world.` });
    }

    return reply.code(200).header("Content-Type", "application/json; charset=utf-8")
				.send({ message: `go ahead` });
	});
}
