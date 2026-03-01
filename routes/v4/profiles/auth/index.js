"use strict";
import "dotenv/config";

/**
 * 
 * @param {import("fastify").FastifyInstance} fastify 
 */
export default async function (fastify, opts) {
	const profiles = fastify.mongo.db.collection("profiles");

  fastify.post("/login", async function (request, reply) {
    return { _message: "WIP" }
  });

  fastify.post("/check-session", async function (request, reply) {
		return { _message: "WIP" };
	});

  fastify.post("/refresh", async function (request, reply) {
		return { _message: "WIP" };
	});
}
