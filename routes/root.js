"use strict";

const VERSION = "4.0.0-alpha2"

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    return { version: VERSION, _message: "v3 is deprecated! Please try migrating to v4 immediately. v3 will be removed soon." };
  });
}
