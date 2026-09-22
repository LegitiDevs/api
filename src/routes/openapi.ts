import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const plugin: FastifyPluginAsyncTypebox = async function (fastify, opts) {
  fastify.get(
    "/openapi", 
    { schema: { hide: true } }, 
    async function (request, reply) {
        return fastify.swagger()
    });
}

export default plugin