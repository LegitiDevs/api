"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const stats = mongoclient.db(DB).collection("world_stats");

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    const all = await stats.find({}, { projection: { _id: 0 }}).toArray();
    return all;
  });
  fastify.get("/:uuid", async function (request, reply) {
    const all = await stats.findOne({ "world_uuid": request.params.uuid }, { projection: { _id: 0 }});
    return all;
 });
}
