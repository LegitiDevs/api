// @ts-nocheck

"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { isValidSession, validateProperty, wrapper } from "#util/utils.js";
import { CONFIG } from "#util/config.js";
import { TooLongError, WorldNotFoundError, JSONSyntaxError, FormatError, UnauthorizedError } from "#util/errors.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

export default async function (fastify, opts) {
	// Only the owner can run this
	fastify.post("/description", async function (request, reply) {
		return reply
			.code(410)
			.send({ _message: "Profiles are now disabled and being phased out." });
	});

	// Only the owner can run this
	fastify.post("/unlist", async function (request, reply) {
		return reply
			.code(410)
			.send({ _message: "Profiles are now disabled and being phased out." });
	});

	// Anyone can run this as long as they have a valid account.
	fastify.post("/comment", async function (request, reply) {
		return reply
			.code(410)
			.send({ _message: "Profiles are now disabled and being phased out." });
	})
}
