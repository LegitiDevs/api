"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { canEditWorld } from "../../../../util/utils.js";
import { CONFIG, HEADERS, RESPONSE_MESSAGES } from "../../../../util/config.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

export default async function (fastify, opts) {
	fastify.post("/", async function (request, reply) {
		const body = JSON.parse(request.body);
		const world = await worlds.findOne({ world_uuid: body.world_uuid });

		if (body.content == null)
			return reply
				.code(400)
				.header(HEADERS.CONTENT_TYPE.NAME, HEADERS.CONTENT_TYPE.JSON)
				.send({ message: RESPONSE_MESSAGES[400].BODY_CONTENT_NOT_FOUND })
		if (typeof body.content !== "string")
			return reply
				.code(400)
				.header(HEADERS.CONTENT_TYPE.NAME, HEADERS.CONTENT_TYPE.JSON)
				.send({ message: RESPONSE_MESSAGES.parse(RESPONSE_MESSAGES[400].BODY_CONTENT_WRONG_TYPE, "string") });
		if (body.content.length >= CONFIG.LEGITIDEVS.DESCRIPTION_LENGTH)
			return reply
				.code(400)
				.header(HEADERS.CONTENT_TYPE.NAME, HEADERS.CONTENT_TYPE.JSON)
				.send({ message: RESPONSE_MESSAGES.parse(RESPONSE_MESSAGES[400].BODY_CONTENT_TOO_LONG, CONFIG.LEGITIDEVS.DESCRIPTION_LENGTH) })
		if (!world)
			return reply
				.code(404)
				.header(HEADERS.CONTENT_TYPE.NAME, HEADERS.CONTENT_TYPE.JSON)
				.send({ message: RESPONSE_MESSAGES.parse(RESPONSE_MESSAGES[400].WORLD_NOT_FOUND, body) });

		if (!(await canEditWorld(request.headers.authorization, world.owner_uuid))) {
			return reply
				.code(401)
				.header(HEADERS.CONTENT_TYPE.NAME, HEADERS.CONTENT_TYPE.JSON)
				.send({ message: RESPONSE_MESSAGES[400].DENIED_WORLD_ACCESS });
		}

		// Passed security checks!

		worlds.updateOne({ world_uuid: body.world_uuid }, { $set: { "legitidevs.description": body.content } })

		return reply
			.code(200)
			.header(HEADERS.CONTENT_TYPE.NAME, HEADERS.CONTENT_TYPE.JSON)
			.send({ message: RESPONSE_MESSAGES[200].WORLD_EDIT_SUCCESS });
	});
}
