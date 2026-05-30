import { Type } from "@fastify/type-provider-typebox"
import { SessionTokenSchema } from "#schemas/auth.js";
import { DeleteCommentOptionsSchema, EditWorldOptionsSchema, GetCommentOptionsSchema, GetCommentsOptionsSchema, GetWorldOptionsSchema, ListOptionsSchema, PostCommentOptionsSchema, RandomWorldOptionsSchema, SearchWorldOptionsSchema } from "#schemas/services/worlds.js";
import { WorldSortBySchema } from "#schemas/worlds.js";

// TODO: move regex checking logic to the controller, not the schema

export const SchemaGetWorld = { 
    params: Type.Pick(GetWorldOptionsSchema, Type.Literal('world_uuid')), 
    querystring: Type.Object({
        project: Type.Optional(Type.String())
    })
}

export const SchemaGetWorldList = { 
    querystring: Type.Intersect([
        Type.Omit(ListOptionsSchema, ['sort_by', 'project']),
        Type.Partial(Type.Object({
            sort_by: WorldSortBySchema,
            project: Type.String(),
        }))
    ])
}

export const SchemaGetRandomWorld = {
    querystring: Type.Intersect([
        Type.Omit(RandomWorldOptionsSchema, ['sort_by', 'project']),
        Type.Partial(Type.Object({
            sort_by: WorldSortBySchema,
            project: Type.String(),
        }))
    ])
}

export const SchemaSearchWorld = {
    querystring: Type.Intersect([
        Type.Omit(SearchWorldOptionsSchema, ['sort_by', 'project']),
        Type.Partial(Type.Object({
            sort_by: WorldSortBySchema,
            project: Type.String(),
        }))
    ])
}

export const SchemaGetWorldCommentList = { 
    params: Type.Pick(GetCommentsOptionsSchema, Type.Literal('world_uuid')), 
    querystring: Type.Intersect([
        Type.Omit(GetCommentsOptionsSchema, ['sort_by', 'project', 'world_uuid']),
        Type.Partial(Type.Object({
            sort_by: WorldSortBySchema,
            project: Type.String(),
        }))
    ])
}

export const SchemaGetWorldComment = { 
    params: Type.Pick(GetCommentOptionsSchema, Type.Literal('comment_uuid')), 
    querystring: Type.Object({
        project: Type.Optional(Type.String())
    })
}

export const SchemaPostComment = { 
    params: Type.Pick(PostCommentOptionsSchema, Type.Literal('world_uuid')), 
    body: Type.Omit(PostCommentOptionsSchema, Type.Literal('world_uuid')) 
}

export const SchemaDeleteComment = { params: DeleteCommentOptionsSchema }

// PATCH REQUESTS
export const SchemaEditWorld = { 
    headers: Type.Object({
        "session-token": SessionTokenSchema,
    }), 
    params: Type.Pick(EditWorldOptionsSchema, Type.Literal('world_uuid')), 
    body: Type.Pick(EditWorldOptionsSchema, Type.Literal('edits')) 
}
