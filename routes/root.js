"use strict";

const VERSION = "1.4.1"

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    return { status: "ok", version: VERSION };
  });
}
