"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const status = mongoclient.db(DB).collection("status");

export default async function (fastify, opts) {
  fastify.get("/uptime", async function (request, reply) {
    const uptime = await status.findOne({})
    return uptime
  });
}
