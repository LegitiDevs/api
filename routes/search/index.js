"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { deRegexifyTheRegexSoTheUserDoesntDoMaliciousThings, getSortingMethod } from "../../util/getSortingMethod.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

export default async function (fastify, opts) {
  fastify.get("/:query", async function (request, reply) {
    const query = deRegexifyTheRegexSoTheUserDoesntDoMaliciousThings(request.params.query);
    const sortingMethod = getSortingMethod(
      request.query.sort,
      request.query.sortDirection
    );
    if (!query) return [];

    const matched_worlds = await worlds
      .find({ name: { $regex: query, $options: "i" } })
      .sort(sortingMethod)
      .toArray();
    return matched_worlds;
  });
}
