"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { canEditWorld } from "../../../util/utils.js";
import { CONFIG } from "../../../util/config.js";
import { BodyContentNotFoundError, BodyContentTooLongError, BodyContentWrongTypeError, DeniedWorldAccessError, WorldNotFoundError } from "../../../util/errors.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

export default async function (fastify, opts) {
	fastify.post("/description", async function (request, reply) {
		const body = JSON.parse(request.body);
		const world = await worlds.findOne({ world_uuid: body.world_uuid });

		if (body.content == null)
			return reply.send(new BodyContentNotFoundError())
		if (typeof body.content !== "string")
			return reply.send(new BodyContentWrongTypeError("string"))
		if (body.content.length >= CONFIG.LEGITIDEVS.DESCRIPTION_LENGTH)
			return reply.send(new BodyContentTooLongError(CONFIG.LEGITIDEVS.DESCRIPTION_LENGTH))
		if (!world)
			return reply.send(new WorldNotFoundError(body.world_uuid))
		if (!(await canEditWorld(request.headers.authorization, world.owner_uuid))) 
			return reply.send(new DeniedWorldAccessError(body.world_uuid))

		// Passed security checks!

		worlds.updateOne({ world_uuid: body.world_uuid }, { $set: { "legitidevs.description": body.content } })

		return reply.code(200).send({ message: "Success." })
	});

	fastify.post("/unlist", async function (request, reply) {
		const body = JSON.parse(request.body);
		const world = await worlds.findOne({ world_uuid: body.world_uuid });

		if (!world) 
			return reply.send(new WorldNotFoundError(body.world_uuid));
		if (!(await canEditWorld(request.headers.authorization, world.owner_uuid))) 
			return reply.send(new DeniedWorldAccessError(body.world_uuid));

		// Passed security checks!

		worlds.updateOne(
			{ world_uuid: body.world_uuid },
			{ $set: { "legitidevs.unlisted": !world?.legitidevs?.unlisted } }
		);

		return reply.code(200).send({ message: "Success." });
	});
}
