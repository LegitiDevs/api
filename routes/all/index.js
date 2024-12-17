"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { getSortingMethod } from "../../util/getSortingMethod.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    console.log(request.query.sort, getSortingMethod(request.query.sort))
    const sortingMethod = getSortingMethod(request.query.sort)
    const all = await worlds.find({}).sort(sortingMethod).toArray();
    return all;
  });
}
