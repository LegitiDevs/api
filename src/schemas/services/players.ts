import Type, { Static } from "typebox"
import { ProjectSchema, SortBySchema } from "#schemas/services/generic.js"
import { NaturalNumberSchema, UuidSchema, WholeNumberSchema } from "#schemas/generic.js"

export const GetPlayerOptionsSchema = Type.Object({
    player_uuid: UuidSchema,
    project: Type.Optional(ProjectSchema),
})

export const ListPlayersOptionsSchema = Type.Partial(
    Type.Object({
        sort_by: SortBySchema,
        project: ProjectSchema,
        offset: WholeNumberSchema,
        limit: NaturalNumberSchema,
    })
)

export type GetPlayerOptions = Static<typeof GetPlayerOptionsSchema>
export type ListPlayersOptions = Static<typeof ListPlayersOptionsSchema>