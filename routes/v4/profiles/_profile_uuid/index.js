"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { ProfileGetParamSchema, ProfileWorldListGetParamSchema, ProfileWorldListGetQuerySchema } from "#schemas/profiles.js";
import { z } from "zod/v4";
import { WorldSchema } from "#schemas/responses.js";
import { defaultFilter, parseSortingMethod } from "#util/utils.js";

/**
 * 
 * @param {import("fastify").FastifyInstance} fastify 
 */
export default async function (fastify, opts) {
	const worlds = fastify.mongo.db.collection("worlds");
	const profiles = fastify.mongo.db.collection("profiles");

  fastify.get("/", {
    schema: {
      params: ProfileGetParamSchema
    }
  }, async function (request, reply) {
    return { _message: "wip", profile_uuid: request.params.profile_uuid }
  });

  fastify.get("/worlds", {
    schema: {
      params: ProfileWorldListGetParamSchema,
      querystring: ProfileWorldListGetQuerySchema
    }
  }, async function (request, reply) {
    const sortingMethod = parseSortingMethod(
      request.query.sortMethod,
      request.query.sortDirection
    );

    return await worlds.find({ owner_uuid: request.params.profile_uuid, ...defaultFilter }).sort(sortingMethod).toArray();
  });

  fastify.patch("/", async function (request, reply) {
    return { _message: "wip" }
  });
}
