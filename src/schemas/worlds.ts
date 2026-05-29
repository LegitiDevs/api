import { Type } from "@fastify/type-provider-typebox"
import { CONFIG } from "#util/config.js";
import { SessionTokenSchema } from "#schemas/auth.js";
import "#schemas/formats.js"

// TODO: refactor names
// TODO: build the entire schema without making individual variables for querystrings, params, etc...
// TODO: make a types.ts schema file that the service uses and make that the source of truth

//[Resource][Subresource][Operation][Type]Schema

// GET REQUESTS

export const OffsetSchema = Type.Number({minimum: 0})
export const LimitSchema = Type.Number({minimum: 1})

// + or - is optional
export const WorldSortMethodsEnum = Type.Union([
    Type.Literal("default"),
    Type.Literal("votes"),
    Type.Literal("visits"),
    Type.Literal("recently_scraped"),
    Type.Literal("recently_created")
])
export const CommentSortMethodsEnum = Type.Union([
	Type.Literal("default"),
]);
export const WorldSortBySchema = Type.String({ format: 'world-sort-by-parameter' })
export const CommentSortBySchema = Type.String({ format: 'comment-sort-by-parameter' })

export const SortMethodSchema = Type.Union([
    Type.Literal("default"), 
    Type.Literal("votes"),
    Type.Literal("visits"),
    Type.Literal("recently_scraped"),
    Type.Literal("recently_created"),
])
export const SortDirectionSchema = Type.Union([
    Type.Literal("ascending"),
    Type.Literal("descending"),
])

export const WorldListGetQuerySchema = Type.Object({
    sort_by: Type.Optional(WorldSortBySchema),
    project: Type.Optional(Type.String()),
    offset: Type.Optional(OffsetSchema),
    limit: Type.Optional(LimitSchema),
})

export const WorldRandomGetQuerySchema = Type.Omit(WorldListGetQuerySchema, Type.Union([
    Type.Literal("offset")
]))

export const WorldGetParamSchema = Type.Object({
    world_uuid: Type.String({ format: "uuid" })
})

export const WorldGetQuerySchema = Type.Object({
	project: Type.Optional(Type.String()),
});

// TODO: move regex checking logic to the controller, not the schema
export const WorldSearchGetQuerySchema = Type.Intersect([
    WorldListGetQuerySchema,
    Type.Object({
        query: Type.String()
    })
])

export const WorldCommentListGetParamSchema = Type.Object({
    world_uuid: Type.String({ format: "uuid" })
})

export const WorldCommentListGetQuerySchema = Type.Object({
	sort_by: Type.Optional(CommentSortBySchema),
	project: Type.Optional(Type.String()),
	offset: Type.Optional(OffsetSchema),
	limit: Type.Optional(LimitSchema),
});

export const WorldCommentGetParamSchema = Type.Object({
    comment_uuid: Type.String({ format: "uuid" })
})

export const WorldCommentGetQuerySchema = Type.Object({
	project: Type.Optional(Type.String())
});

export const WorldCommentPostParamSchema = Type.Object({
	world_uuid: Type.String({ format: "uuid" })
});

export const WorldCommentPostBodySchema = Type.Object({
	profile_uuid: Type.String({ format: "uuid" }),
    content: Type.String({ minLength: 1, maxLength: CONFIG.V4.WORLDS.MAX_COMMENT_LENGTH })
});

export const WorldCommentDeleteParamSchema = Type.Object({
	comment_uuid: Type.String({ format: "uuid" }),
});

export const SchemaGetWorld = { params: WorldGetParamSchema, querystring: WorldGetQuerySchema }
export const SchemaGetWorldList = { querystring: WorldListGetQuerySchema }
export const SchemaGetRandomWorld = { querystring: WorldRandomGetQuerySchema }
export const SchemaSearchWorld = { querystring: WorldSearchGetQuerySchema }

export const SchemaGetWorldCommentList = { params: WorldCommentListGetParamSchema, querystring: WorldCommentListGetQuerySchema }
export const SchemaGetWorldComment = { params: WorldCommentGetParamSchema, querystring: WorldCommentGetQuerySchema }
export const SchemaPostComment = { params: WorldCommentPostParamSchema, body: WorldCommentPostBodySchema }
export const SchemaDeleteComment = { params: WorldCommentDeleteParamSchema }

// PATCH REQUESTS

export const WorldDescriptionSchema = Type.String({ maxLength: CONFIG.LEGITIDEVS.MAX_WORLD_DESCRIPTION_LENGTH })
export const WorldUnlistedSchema = Type.Boolean();

export const WorldEditsSchema = Type.Object({
	description: Type.Optional(WorldDescriptionSchema),
	unlisted: Type.Optional(WorldUnlistedSchema),
}, { minProperties: 1 })

export const WorldPatchHeaderSchema = Type.Object({
    "session-token": SessionTokenSchema
})

export const WorldPatchParamSchema = Type.Object({
    world_uuid: Type.String({ format: "uuid" })
})

export const WorldPatchBodySchema = Type.Object({
    edits: WorldEditsSchema
})

export const SchemaEditWorld = { headers: WorldPatchHeaderSchema, params: WorldPatchParamSchema, body: WorldPatchBodySchema }