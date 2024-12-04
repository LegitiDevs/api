'use strict'

module.exports = async function (fastify, opts) {
  fastify.get('/top/:max', async function (request, reply) {
    const max = request.params.max;
    // TODO connect to db and get x amount of top worlds, then return these
  })
}
