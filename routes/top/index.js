"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

export default async function (fastify, opts) {
  fastify.get("/:max", async function (request, reply) {
    const max = request.params.max;
    const top_worlds = await worlds
      .find({})
      .sort({ votes: -1 })
      .limit(Number.parseInt(max))
      .toArray();
    return top_worlds;
  });
}
