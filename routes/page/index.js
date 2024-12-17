"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { getSortingMethod } from "../../util/getSortingMethod";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");
const PAGE_SIZE = 27; // How many worlds per page to return

export default async function (fastify, opts) {
  fastify.get("/:index", async function (request, reply) {
    console.log(request.query.sort, getSortingMethod(request.query.sort)) 
    const index = request.params.index;
    const skip = Number.parseInt(index) * PAGE_SIZE;
    const sortingMethod = getSortingMethod(request.query.sort)

    const matched_worlds = await worlds.find().sort(sortingMethod).skip(skip).limit(PAGE_SIZE).toArray();
    return matched_worlds;
  });
}
