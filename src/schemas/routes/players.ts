import { PlayerSortBySchema } from "#schemas/players.js"
import { GetPlayerOptionsSchema } from "#schemas/services/players.js"
import { ListWorldsOptionsSchema } from "#schemas/services/worlds.js"
import Type from "typebox"

export const SchemaGetPlayer = { 
    params: Type.Pick(GetPlayerOptionsSchema, Type.Literal('player_uuid')), 
    querystring: Type.Object({
        project: Type.Optional(Type.String())
    })
}

export const SchemaGetPlayerList = { 
    querystring: Type.Intersect([
        Type.Omit(ListWorldsOptionsSchema, ['sort_by', 'project']),
        Type.Partial(Type.Object({
            sort_by: PlayerSortBySchema,
            project: Type.String(),
        }))
    ])
}