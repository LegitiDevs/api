import Type from "typebox"
import Format from "typebox/format"
import { FastifySchema } from "fastify"

import { checkSortByParameter } from "#schemas/formats.js"
import { PlayerSchema } from "#schemas/players.js"

import { GetPlayerOptionsSchema } from "#schemas/services/players.js"
import { 
    GetWorldsFromPlayerOptionsSchema, 
    ListWorldsOptionsSchema 
} from "#schemas/services/worlds.js"

import { ProjectQueryStringSchema } from "#schemas/routes/generic.js"
import { SchemaGetWorldList } from "#schemas/routes/worlds.js"

export const PlayerSortMethodsEnum = Type.Union([
    Type.Literal("default"),
    Type.Literal("streak"),
    Type.Literal("legiticoins"),
    Type.Literal("online")
])

export const PlayerSortBySchema = Type.String({ 
    format: 'player-sort-by-parameter',

    description:
`Player sorting method to use for querying.

Sorting method may start with \`+\` (ascending) or \`-\` (descending). 

Defaults to \`+\` if not specified.

**Player sorting methods:**
- \`default\`
- \`streak\`
- \`legiticoins\`
- \`online\`

Throws HTTP 400 Bad Request if the format is not followed correctly.`,

    examples: [
        "default",
        "+streak",
        "-legiticoins",
        "online",
    ],
})

Format.Set('player-sort-by-parameter', value => {
    return checkSortByParameter(PlayerSortMethodsEnum, value)
})

export const SchemaGetPlayer = { 
    params: Type.Pick(GetPlayerOptionsSchema, ['player_uuid']), 
    querystring: Type.Object({
        project: Type.Optional(ProjectQueryStringSchema)
    }),
    response: {
        200: Type.Partial(PlayerSchema)
    },

    summary: "Get a single player",
    description: "Returns the player specified. You can get multiple players by using the [](/operations/listPlayers) endpoint.",
    tags: ["players"],
    operationId: "getPlayer"
} satisfies FastifySchema

export const SchemaGetPlayerList = { 
    querystring: Type.Intersect([
        Type.Omit(ListWorldsOptionsSchema, ['sort_by', 'project']),
        Type.Partial(Type.Object({
            sort_by: PlayerSortBySchema,
            project: ProjectQueryStringSchema,
        }))
    ]),
    response: {
        200: Type.Array(Type.Partial(PlayerSchema))
    },

    summary: "Get multiple players",
    description: "Returns a list of players. This can be narrowed down to specific entries via the querystring. You can get a single player by using the [](/operations/getPlayer) endpoint.",
    tags: ["players"],
    operationId: "listPlayers"
} satisfies FastifySchema

export const SchemaGetWorldsFromPlayer = {
    params: Type.Pick(GetWorldsFromPlayerOptionsSchema, ['player_uuid']),
    querystring: SchemaGetWorldList.querystring,
    response: {
        200: SchemaGetWorldList.response['200']
    },

    summary: "Get worlds by a player",
    description: "Returns the worlds owned by the player specified. This can be narrowed down to specific entries via the querystrings.",
    tags: ["players"],
    operationId: "getWorldsFromPlayer"
} satisfies FastifySchema