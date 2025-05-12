import { z } from "zod";
import { UUIDSchema } from "./generic.js";

//[Resource][Subresource][Operation][Type]Schema

const PageSchema = z.coerce.number().int().gte(0);
const MaxSchema = z.coerce.number().int().gt(0);
const SortMethodSchema = z.union([
    z.literal("default"), 
    z.literal("votes"),
    z.literal("visits"),
    z.literal("recently_scraped"),
    z.literal("recently_created"),
])
const SortDirectionSchema = z.union([
    z.literal("ascending"),
    z.literal("descending"),
]);
const SearchQuerySchema = z.string();

export const WorldListGetQuerySchema = z.object({
    page: z.optional(PageSchema),
    max: z.optional(MaxSchema),
    sortMethod: z.optional(SortMethodSchema),
    sortDirection: z.optional(SortDirectionSchema)
})

export const WorldGetParamSchema = z.object({
    world_uuid: UUIDSchema
})

export const WorldCommentListGetParamSchema = z.object({
    world_uuid: UUIDSchema
})

export const WorldCommentListGetQuerySchema = z.object({
	page: z.optional(PageSchema),
    max: z.optional(MaxSchema),
    sortDirection: z.optional(SortDirectionSchema)
});

export const WorldCommentGetParamSchema = z.object({
	world_uuid: UUIDSchema,
    comment_uuid: UUIDSchema
});

export const WorldListSearchGetParamSchema = z.object({
    query: SearchQuerySchema
})

export const WorldListSearchGetQuerySchema = z.object({
    sortMethod: z.optional(SortMethodSchema),
    sortDirection: z.optional(SortDirectionSchema)
})