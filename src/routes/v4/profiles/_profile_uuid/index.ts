"use strict";
import "dotenv/config";
import { ProfileGetParamSchema, ProfileWorldListGetParamSchema, ProfileWorldListGetQuerySchema } from "#schemas/profiles.js";
import { defaultFilter, parseSortingMethod } from "#util/utils.js";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { ApiError } from "#util/errors.js";

const plugin: FastifyPluginAsyncTypebox = async function (fastify, opts) {
  if (fastify.mongo.db == null) throw new ApiError("DB not found", 500) 
	const worlds = fastify.mongo.db.collection("worlds");
  // @ts-ignore
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

export default plugin