"use strict";

import "dotenv/config";
import path from "node:path";
import AutoLoad from "@fastify/autoload";
import cors from '@fastify/cors'
import { MongoClient } from "mongodb";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");
if (!worlds.indexExists("name")) worlds.createIndex({ name: "text" })

// Pass --options via CLI arguments in command to enable these options.
const options = {};

export default async function (fastify, opts) {
  // Place here your custom code!

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  /*fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })*/

  fastify.register(cors, {})
  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });
}

export { options };
