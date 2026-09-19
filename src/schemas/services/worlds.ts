import { NaturalNumberSchema, UuidSchema, WholeNumberSchema } from "#schemas/generic.js"
import { Static, Type } from "@fastify/type-provider-typebox"
import { ProjectSchema, SortBySchema } from "./generic.ts"

export const GetWorldOptionsSchema = Type.Object({
    world_uuid: UuidSchema,
    project: Type.Optional(ProjectSchema),
})

export const ListWorldsOptionsSchema = Type.Partial(
    Type.Object({
        sort_by: SortBySchema,
        project: ProjectSchema,
        offset: WholeNumberSchema,
        limit: NaturalNumberSchema,
    })
)

export const RandomWorldOptionsSchema = Type.Omit(ListWorldsOptionsSchema, Type.Union([
    Type.Literal("offset")
]))

export const SearchWorldOptionsSchema = Type.Intersect([
    ListWorldsOptionsSchema,
    Type.Object({
        query: Type.String()
    })
])

export type GetWorldOptions = Static<typeof GetWorldOptionsSchema>
export type ListWorldsOptions = Static<typeof ListWorldsOptionsSchema>
export type RandomWorldOptions = Static<typeof RandomWorldOptionsSchema>
export type SearchWorldOptions = Static<typeof SearchWorldOptionsSchema>