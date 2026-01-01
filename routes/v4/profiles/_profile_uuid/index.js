"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { ProfileGetParamSchema, ProfileWorldListGetParamSchema, ProfileWorldListGetQuerySchema } from "#schemas/profiles.js";
import { z } from "zod/v4";
import { WorldSchema } from "#schemas/responses.js";
import { defaultFilter, parseSortingMethod } from "#util/utils.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");
const profiles = mongoclient.db(DB).collection("profiles");

/**
 * 
 * @param {import("fastify").FastifyInstance} fastify 
 */
export default async function (fastify, opts) {
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
      querystring: ProfileWorldListGetQuerySchema,
      response: {
        200: z.array(WorldSchema)
      }
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
