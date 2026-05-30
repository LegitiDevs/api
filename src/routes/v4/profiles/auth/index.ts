"use strict";
import { ApiError } from "#util/errors.js";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import "dotenv/config";

const plugin: FastifyPluginAsyncTypebox = async function (fastify, opts) {
  // TODO: move to a profiles controller
  if (fastify.mongo.db == null) throw new ApiError("DB not found", 500) 
  // @ts-ignore
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

export default plugin