"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { isValidSession, validateProperty, wrapper } from "../../../util/utils.js";
import { CONFIG } from "../../../util/config.js";
import { TooLongError, WorldNotFoundError, JSONSyntaxError, FormatError, UnauthorizedError } from "../../../util/errors.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

export default async function (fastify, opts) {
	// Only the owner can run this
	fastify.post("/description", async function (request, reply) {
		if (!validateProperty(request.headers, "session-token", "string", { maxLength: CONFIG.MAX_SESSION_TOKEN_LENGTH })) return reply.send(new FormatError("Request header 'Session-Token'"))
						
		if (request.body >= CONFIG.MAX_REQUEST_BODY_LENGTH) return reply.send(new TooLongError("Request body", CONFIG.MAX_REQUEST_BODY_LENGTH))
		const body = JSON.parse(request.body);
		
		// Passed authorization checks.
		
		if (!validateProperty(body, "world_uuid", "string", { maxLength: CONFIG.MAX_UUID_LENGTH })) return reply.send(new FormatError("body.world_uuid"))
		if (!validateProperty(body, "content", "string", { maxLength: CONFIG.LEGITIDEVS.MAX_WORLD_DESCRIPTION_LENGTH })) return reply.send(new FormatError("body.content"))
		
		let isJSONTextComponent = false
		if (body.content[0] == "{" || body.content[0] == "[") {
			isJSONTextComponent = true
			try { JSON.parse(body.content) } catch (err) {
				return reply.send(new JSONSyntaxError(err.message))
			}
		}

		const world = await worlds.findOne({ world_uuid: body.world_uuid });

		if (!world) return reply.send(new WorldNotFoundError(body.world_uuid))
		if (!(await isValidSession(request.headers["session-token"], world.owner_uuid))) return reply.send(new UnauthorizedError())

		// Passed data checks.
		const edit = isJSONTextComponent ? body.content : JSON.stringify({text: body.content})
		await worlds.updateOne({ world_uuid: body.world_uuid }, { $set: { "legitidevs.description": edit } })

		return { edit }
	});

	// Only the owner can run this
	fastify.post("/unlist", async function (request, reply) {
		if (!validateProperty(request.headers, "session-token", "string", { maxLength: CONFIG.MAX_SESSION_TOKEN_LENGTH })) return reply.send(new FormatError("Request header 'Session-Token'"))
						
		if (request.body >= CONFIG.MAX_REQUEST_BODY_LENGTH) return reply.send(new TooLongError("Request body", CONFIG.MAX_REQUEST_BODY_LENGTH))
		const body = JSON.parse(request.body);
		if (!validateProperty(body, "world_uuid", "string", { maxLength: CONFIG.MAX_UUID_LENGTH })) return reply.send(new FormatError("body.world_uuid"))

		const world = await worlds.findOne({ world_uuid: body.world_uuid });

		if (!world) return reply.send(new WorldNotFoundError(body.world_uuid));
		if (!(await isValidSession(request.headers["session-token"], world.owner_uuid))) return reply.send(new UnauthorizedError())

		// Passed authorization checks.

		await worlds.updateOne(
			{ world_uuid: body.world_uuid },
			{ $set: { "legitidevs.unlisted": !world?.legitidevs?.unlisted } }
		);

		return { edit: !world?.legitidevs?.unlisted };
	});

	// Anyone can run this as long as they have a valid account.
	fastify.post("/comment", async function (request, reply) {
		if (!validateProperty(request.headers, "session-token", "string", { maxLength: CONFIG.MAX_SESSION_TOKEN_LENGTH })) return reply.send(new FormatError("Request header 'Session-Token'"))
		if (request.body >= CONFIG.MAX_REQUEST_BODY_LENGTH) return reply.send(new TooLongError("Request body", CONFIG.MAX_REQUEST_BODY_LENGTH))
		const body = JSON.parse(request.body);
		if (!validateProperty(body, "world_uuid", "string", { maxLength: CONFIG.MAX_UUID_LENGTH })) return reply.send(new FormatError("body.world_uuid"))
		if (!validateProperty(body, "profile_uuid", "string", { maxLength: CONFIG.MAX_UUID_LENGTH })) return reply.send(new FormatError("body.profile_uuid"))
		if (!validateProperty(body, "content", "string", { minLength: 1, maxLength: CONFIG.LEGITIDEVS.MAX_WORLD_COMMENT_LENGTH })) return reply.send(new FormatError("body.content"))

		if (!(await isValidSession(request.headers["session-token"], body.profile_uuid))) return reply.send(new UnauthorizedError())
		
		// Passed authorization checks.

		const world = await worlds.findOne({ world_uuid: body.world_uuid });
		if (!world) return reply.send(new WorldNotFoundError(body.world_uuid));

		// Passed data checks.
		const edit = { profile_uuid: body.profile_uuid, content: body.content, date: Math.floor(Date.now() / 1000) }

		await worlds.updateOne(
			{ world_uuid: body.world_uuid },
			{ $push: { "legitidevs.comments": { ...edit } } }
		);

		return { edit }
	})
}
