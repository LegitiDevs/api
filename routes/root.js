"use strict";

const VERSION = "4.0.0"

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    return { version: VERSION };
  });
}
