"use strict";

const VERSION = "3.0.0"

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    return { status: "ok", version: VERSION };
  });
}
