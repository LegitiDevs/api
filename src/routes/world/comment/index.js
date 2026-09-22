// @ts-nocheck

"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { isValidSession, validateProperty } from "#util/utils.js";
import { CONFIG } from "#util/config.js";
import { TooLongError, WorldNotFoundError, FormatError, UnauthorizedError, NotFoundError } from "#util/errors.js";
import { randomUUID } from "crypto"

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

/**
 * 
 * @param {import("fastify").FastifyInstance} fastify  
 */
export default async function (fastify, opts) {
    // Anyone can run this.
    fastify.get("/:uuid", async function (request, reply) {
        return reply
			.code(410)
			.send({
				_message: "Profiles are now disabled and being phased out.",
			});
    })

    // Anyone can run this as long as they have a valid account.
    fastify.post("/", async function (request, reply) {
        return reply
			.code(410)
			.send({
				_message: "Profiles are now disabled and being phased out.",
			});
    })

    // Only the comment author can run this
    fastify.post("/delete", async function (request, reply) {
        return reply
		    .code(410)
		    .send({
		    	_message: "Profiles are now disabled and being phased out.",
		    });
    })
}
