"use strict";

import { version } from '../package.json'

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    return { status: "ok", version: version };
  });
}
