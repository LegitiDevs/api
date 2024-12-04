"use strict";

module.exports = async function (fastify, opts) {
  fastify.get("/:world", async function (request, reply) {
    const world = request.params.world;
    return world;
    // TODO connect to db and world, then return it
  });
};
