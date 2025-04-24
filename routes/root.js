"use strict";

const VERSION = "3.2.0"

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    return { version: VERSION };
  });
}
