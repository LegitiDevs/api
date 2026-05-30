import { Type } from "@fastify/type-provider-typebox"

const SortMethodSchema = Type.Union([
    Type.Literal("default"), 
    Type.Literal("votes"),
    Type.Literal("visits"),
    Type.Literal("recently_scraped"),
    Type.Literal("recently_created"),
])
const SortDirectionSchema = Type.Union([
    Type.Literal("ascending"),
    Type.Literal("descending"),
])

export const ProfileGetParamSchema = Type.Object({
    profile_uuid: Type.String({ format: "uuid" })
})

export const ProfileWorldListGetParamSchema = Type.Object({
    profile_uuid: Type.String({ format: "uuid" }),
})

export const ProfileWorldListGetQuerySchema = Type.Object({
    sortMethod: Type.Optional(SortMethodSchema),
    sortDirection: Type.Optional(SortDirectionSchema)
})