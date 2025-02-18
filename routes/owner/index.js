"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { getSortingMethod } from "../../util/utils.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

export default async function (fastify, opts) {
  fastify.get("/:owner", async function (request, reply) {
    const sortingMethod = getSortingMethod(
      request.query.sort,
      request.query.sortDirection
    );
    const ownerUUID = request.params.owner
    if (!ownerUUID) return []

    const worldsOwnedByOwner = await worlds.find({ owner_uuid: ownerUUID }).sort(sortingMethod).toArray();
    return worldsOwnedByOwner;
  });
}
