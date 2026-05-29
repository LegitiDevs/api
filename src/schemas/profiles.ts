import { Type } from "@fastify/type-provider-typebox"
import { SortDirectionSchema, SortMethodSchema } from "#schemas/worlds.js";

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