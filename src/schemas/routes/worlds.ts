import { Type } from "@fastify/type-provider-typebox"
import { GetPlayersInWorldListOptionsSchema, GetPlayersInWorldOptionsSchema, GetWorldOptionsSchema, GetWorldsFromPlayerOptionsSchema, ListWorldsOptionsSchema, RandomWorldOptionsSchema, SearchWorldOptionsSchema } from "#schemas/services/worlds.js";
import { WorldSortBySchema } from "#schemas/worlds.js";
import { FastifySchema } from "fastify";

// TODO: move regex checking logic to the controller, not the schema

export const SchemaGetWorld = { 
    params: Type.Pick(GetWorldOptionsSchema, Type.Literal('world_uuid')), 
    querystring: Type.Object({
        project: Type.Optional(Type.String())
    }),
} satisfies FastifySchema

export const SchemaGetWorldList = { 
    querystring: Type.Intersect([
        Type.Omit(ListWorldsOptionsSchema, ['sort_by', 'project']),
        Type.Partial(Type.Object({
            sort_by: WorldSortBySchema,
            project: Type.String(),
        }))
    ])
} satisfies FastifySchema

export const SchemaGetRandomWorld = {
    querystring: Type.Intersect([
        Type.Omit(RandomWorldOptionsSchema, ['sort_by', 'project']),
        Type.Partial(Type.Object({
            sort_by: WorldSortBySchema,
            project: Type.String(),
        }))
    ])
} satisfies FastifySchema

export const SchemaSearchWorld = {
    querystring: Type.Intersect([
        Type.Omit(SearchWorldOptionsSchema, ['sort_by', 'project']),
        Type.Partial(Type.Object({
            sort_by: WorldSortBySchema,
            project: Type.String(),
        }))
    ])
} satisfies FastifySchema

export const SchemaGetWorldListStats = {
    querystring: Type.Object({
        project: Type.Optional(Type.String())
    })
} satisfies FastifySchema

export const SchemaGetWorldStats = {
    params: Type.Pick(GetWorldOptionsSchema, Type.Literal('world_uuid')), 
    querystring: Type.Object({
        project: Type.Optional(Type.String())
    })
} satisfies FastifySchema

export const SchemaGetWorldsFromPlayer = {
    params: Type.Pick(GetWorldsFromPlayerOptionsSchema, Type.Literal('player_uuid')),
    querystring: SchemaGetWorldList.querystring
} satisfies FastifySchema

export const SchemaGetPlayersInWorldList = {
    querystring: GetPlayersInWorldListOptionsSchema
} satisfies FastifySchema

export const SchemaGetPlayersInWorld = {
    params: GetPlayersInWorldOptionsSchema
} satisfies FastifySchema