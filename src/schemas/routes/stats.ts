import { FastifySchema } from "fastify";
import Type from "typebox";
import { ProjectQueryStringSchema } from "./generic.ts";
import { ServerStatsSchema } from "#schemas/stats.js";

export const SchemaGetServerStats = {
    querystring: Type.Object({
        project: Type.Optional(ProjectQueryStringSchema)
    }),
    response: {
        200: Type.Array(Type.Partial(ServerStatsSchema))
    },

    summary: "Get server stats",
    description: "Get the stats of legitimoose.com itself.",
    tags: ["misc"],
    operationId: "getServerStats"
} satisfies FastifySchema