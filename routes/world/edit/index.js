"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { canEditUserContent } from "../../../util/utils.js";
import { CONFIG } from "../../../util/config.js";
import { TooLongError, BodyContentWrongTypeError, DeniedWorldAccessError, WorldNotFoundError, MissingPropertyError, JSONSyntaxError } from "../../../util/errors.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

export default async function (fastify, opts) {
	fastify.post("/description", async function (request, reply) {
		if (request.body >= CONFIG.LEGITIDEVS.MAX_BODY_LENGTH)
			return reply.send(new TooLongError("Request body", CONFIG.LEGITIDEVS.MAX_BODY_LENGTH))

		const body = JSON.parse(request.body);

		if (body?.world_uuid == null) return reply.send(new MissingPropertyError("Request body", "world_uuid"))
		if (request.headers?.authorization == null) return reply.send(new MissingPropertyError("Headers", "Authorization"))
		if (request.headers.authorization > CONFIG.MAX_AUTH_CODE_LENGTH) return reply.send(new TooLongError("Authorization code", CONFIG.MAX_AUTH_CODE_LENGTH))

		if (body.content == null) return reply.send(new MissingPropertyError("content"));
		if (body.content > CONFIG.LEGITIDEVS.MAX_WORLD_DESCRIPTION_LENGTH) return reply.send(new TooLongError("Content",CONFIG.LEGITIDEVS.MAX_WORLD_DESCRIPTION_LENGTH))
		if (typeof body.content !== "string")
			return reply.send(new BodyContentWrongTypeError("string"));
		if (body.content[0] == "{" || body.content[0] == "[") {
			try { JSON.parse(body.content) } catch (err) {
				return reply.send(new JSONSyntaxError(err.message))
			}
		}

		const world = await worlds.findOne({ world_uuid: body.world_uuid });

		if (!world)
			return reply.send(new WorldNotFoundError(body.world_uuid))
		if (!(await canEditUserContent(request.headers.authorization, world.owner_uuid))) 
			return reply.send(new DeniedWorldAccessError(body.world_uuid))

		// Passed security checks!

		worlds.updateOne({ world_uuid: body.world_uuid }, { $set: { "legitidevs.description": body.content } })

		return reply.code(200).send({ message: "Success." })
	});

	fastify.post("/unlist", async function (request, reply) {
		if (request.body >= CONFIG.LEGITIDEVS.MAX_BODY_LENGTH)
			return reply.send(new TooLongError(CONFIG.LEGITIDEVS.MAX_BODY_LENGTH))

		const body = JSON.parse(request.body);

		if (body?.world_uuid == null)
			return reply.send(new MissingPropertyError("Request body", "world_uuid"));
		if (request.headers?.authorization == null)
			return reply.send(new MissingPropertyError("Headers", "Authorization"));

		const world = await worlds.findOne({ world_uuid: body.world_uuid });

		if (!world) 
			return reply.send(new WorldNotFoundError(body.world_uuid));
		if (!(await canEditUserContent(request.headers.authorization, world.owner_uuid))) 
			return reply.send(new DeniedWorldAccessError(body.world_uuid));

		// Passed security checks!

		worlds.updateOne(
			{ world_uuid: body.world_uuid },
			{ $set: { "legitidevs.unlisted": !world?.legitidevs?.unlisted } }
		);

		return reply.code(200).send({ message: "Success." });
	});
}
