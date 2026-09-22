import { Format, Type } from "@fastify/type-provider-typebox"
import { GetPlayersInWorldListOptionsSchema, GetPlayersInWorldOptionsSchema, GetWorldOptionsSchema, ListWorldsOptionsSchema, RandomWorldOptionsSchema, SearchWorldOptionsSchema } from "#schemas/services/worlds.js";
import { WorldListPlayersSchema, WorldPlayersSchema, WorldSchema, WorldStatsSchema } from "#schemas/worlds.js";
import { FastifySchema } from "fastify";
import { ProjectQueryStringSchema } from "./generic.ts";
import { checkSortByParameter } from "#schemas/formats.js";

// TODO: move regex checking logic to the controller, not the schema

export const WorldSortMethodsEnum = Type.Union([
    Type.Literal("default"),
    Type.Literal("votes"),
    Type.Literal("visits"),
    Type.Literal("recently_scraped"),
    Type.Literal("recently_created")
])

export const WorldSortBySchema = Type.String({ 
    format: 'world-sort-by-parameter', 
    
    description:
`World sorting method to use for querying.

Sorting method may start with \`+\` (ascending) or \`-\` (descending). 

Defaults to \`+\` if not specified.

**World sorting methods:**
- \`default\`
- \`votes\`
- \`visits\`
- \`recently_scraped\`
- \`recently_created\`

Throws HTTP 400 Bad Request if the format is not followed correctly.`,

    examples: [
        "default",
        "+votes",
        "-visits",
        "recently_scraped",
    ],
})

Format.Set('world-sort-by-parameter', value => {
    return checkSortByParameter(WorldSortMethodsEnum, value)
})

export const SchemaGetWorld = { 
    params: Type.Pick(GetWorldOptionsSchema, ['world_uuid']), 
    querystring: Type.Object({
        project: Type.Optional(ProjectQueryStringSchema)
    }),
    response: {
        200: Type.Partial(WorldSchema)
    },

    summary: "Get a single world",
    description: "Returns the world specified. You can get multiple worlds by using the [](/operations/listWorlds) endpoint.",
    tags: ["worlds"],
    operationId: "getWorld"
} satisfies FastifySchema

export const SchemaGetWorldList = { 
    querystring: Type.Intersect([
        Type.Omit(ListWorldsOptionsSchema, ['sort_by', 'project']),
        Type.Partial(Type.Object({
            sort_by: WorldSortBySchema,
            project: ProjectQueryStringSchema,
        }))
    ]),
    response: {
        200: Type.Array(Type.Partial(WorldSchema))
    },

    summary: "Get multiple worlds",
    description: "Returns a list of worlds. This can be narrowed down to specific entries via the querystrings. You can get a single world by using the [](/operations/getWorld) endpoint.",
    tags: ["worlds"],
    operationId: "listWorlds"
} satisfies FastifySchema

export const SchemaGetRandomWorld = {
    querystring: Type.Intersect([
        Type.Omit(RandomWorldOptionsSchema, ['sort_by', 'project']),
        Type.Partial(Type.Object({
            sort_by: WorldSortBySchema,
            project: ProjectQueryStringSchema,
        }))
    ]),
    response: {
        200: Type.Array(Type.Partial(WorldSchema))
    },

    summary: "Get random worlds",
    description: "Returns a list of randomly picked worlds. By default, this only returns a list with a single world. The amount of worlds can be adjusted via the querystrings.",
    tags: ["worlds"],
    operationId: "randomWorld"
} satisfies FastifySchema

export const SchemaSearchWorld = {
    querystring: Type.Intersect([
        Type.Omit(SearchWorldOptionsSchema, ['sort_by', 'project']),
        Type.Partial(Type.Object({
            sort_by: WorldSortBySchema,
            project: ProjectQueryStringSchema,
        }))
    ]),
    response: {
        200: Type.Array(Type.Partial(WorldSchema))
    },

    summary: "Search for worlds",
    description: "Returns a list of worlds that is relevant to the search query. This searches the `normalized_name` field which makes this able to find worlds even if they have unicode variants of alphanumeric characters.",
    tags: ["worlds"],
    operationId: "searchWorld"
} satisfies FastifySchema

export const SchemaGetWorldListStats = {
    querystring: Type.Object({
        project: Type.Optional(ProjectQueryStringSchema)
    }),
    response: {
        200: Type.Array(Type.Partial(WorldStatsSchema))
    },

    summary: "Get the stats of all worlds",
    description: "Returns the stats of all worlds. You can get the stats of a single world by using the [](/operations/getWorldStats) endpoint.",
    tags: ["worlds"],
    operationId: "getWorldListStats"
} satisfies FastifySchema

export const SchemaGetWorldStats = {
    params: Type.Pick(GetWorldOptionsSchema, ['world_uuid']), 
    querystring: Type.Object({
        project: Type.Optional(ProjectQueryStringSchema)
    }),
    response: {
        200: Type.Partial(WorldStatsSchema)
    },

    summary: "Get the stats of a single world",
    description: "Returns the stats of a single world. You can get the stats of all worlds by using the [](/operations/getWorldListStats)",
    tags: ["worlds"],
    operationId: "getWorldStats"
} satisfies FastifySchema

export const SchemaGetPlayersInWorldList = {
    querystring: GetPlayersInWorldListOptionsSchema,
    response: {
        200: Type.Array(WorldListPlayersSchema)
    },

    summary: "Get the players inside multiple worlds",
    description: "Returns the players currently inside of each world. The list of worlds can be shrunk down via the querystrings. You can get the players currently inside a single world by using the [](/operations/getPlayersInWorld) endpoint.",
    tags: ["worlds"],
    operationId: "getPlayersInWorldList"
} satisfies FastifySchema

export const SchemaGetPlayersInWorld = {
    params: GetPlayersInWorldOptionsSchema,
    response: {
        200: WorldPlayersSchema
    },

    summary: "Get the players inside a single world",
    description: "Returns the players currently inside of a single world. You can get the players currently inside of each world by using the [](/operations/getPlayersInWorldList) endpoint.",
    tags: ["worlds"],
    operationId: "getPlayersInWorld"
} satisfies FastifySchema