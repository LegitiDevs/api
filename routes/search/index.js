"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

export default async function (fastify, opts) {
  fastify.get("/:query", async function (request, reply) {
    const query = request.params.query;
    if (!query) return [];

    const matched_worlds = await worlds.find({ $text: { $search: query } }).toArray();
    return matched_worlds;
  });
}
