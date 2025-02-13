"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    const world = worlds.aggregate([{ $sample: { size: 1 } }]);
    for await (const doc of world) {
        return doc
    }
  });
}
