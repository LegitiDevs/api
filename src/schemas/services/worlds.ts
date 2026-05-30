import { NaturalNumberSchema, UuidSchema, WholeNumberSchema } from "#schemas/generic.js"
import { CONFIG } from "#util/config.js"
import { Static, Type } from "@fastify/type-provider-typebox"

const ProjectSchema = Type.Record(Type.String(), Type.Integer())
const SortBySchema = Type.Record(Type.String(), Type.Integer())

export const GetWorldOptionsSchema = Type.Object({
    world_uuid: UuidSchema,
    project: Type.Optional(ProjectSchema),
})

export const ListOptionsSchema = Type.Partial(
    Type.Object({
        sort_by: SortBySchema,
        project: ProjectSchema,
        offset: WholeNumberSchema,
        limit: NaturalNumberSchema,
    })
)

export const RandomWorldOptionsSchema = Type.Omit(ListOptionsSchema, Type.Union([
    Type.Literal("offset")
]))

export const SearchWorldOptionsSchema = Type.Intersect([
    ListOptionsSchema,
    Type.Object({
        query: Type.String()
    })
])

export const WorldDescriptionSchema = Type.String({ maxLength: CONFIG.LEGITIDEVS.MAX_WORLD_DESCRIPTION_LENGTH })
export const WorldEditsSchema = Type.Partial(
    Type.Object({
	    description: WorldDescriptionSchema,
	    unlisted: Type.Boolean(),
    }, { minProperties: 1 })
)

export const EditWorldOptionsSchema = Type.Object({
    world_uuid: UuidSchema,
    edits: WorldEditsSchema
})

export type GetWorldOptions = Static<typeof GetWorldOptionsSchema>
export type ListWorldsOptions = Static<typeof ListOptionsSchema>
export type RandomWorldOptions = Static<typeof RandomWorldOptionsSchema>
export type SearchWorldOptions = Static<typeof SearchWorldOptionsSchema>
export type EditWorldOptions = Static<typeof EditWorldOptionsSchema>

export const GetCommentsOptionsSchema = Type.Intersect([
    ListOptionsSchema,
    Type.Object({
        world_uuid: UuidSchema
    })
])

export const GetCommentOptionsSchema = Type.Object({
    comment_uuid: UuidSchema,
    project: Type.Optional(ProjectSchema),
})

export const PostCommentOptionsSchema = Type.Object({
    world_uuid: UuidSchema,
	profile_uuid: UuidSchema,
    content: Type.String({ minLength: 1, maxLength: CONFIG.V4.WORLDS.MAX_COMMENT_LENGTH })
});

export const DeleteCommentOptionsSchema = Type.Object({
	comment_uuid: UuidSchema,
});

export type GetCommentsOptions = Static<typeof GetCommentsOptionsSchema>
export type GetCommentOptions = Static<typeof GetCommentOptionsSchema>
export type PostCommentOptions = Static<typeof PostCommentOptionsSchema>
export type DeleteCommentOptions = Static<typeof DeleteCommentOptionsSchema>
