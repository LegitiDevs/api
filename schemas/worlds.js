import { z } from "zod";
import { nonEmptyObject, UUIDSchema } from "./generic.js";
import { CONFIG } from "../util/config.js";
import { SessionTokenSchema } from "./auth.js";

//[Resource][Subresource][Operation][Type]Schema

// GET REQUESTS

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

// PATCH REQUESTS

export const WorldDescriptionSchema = z.string().max(CONFIG.LEGITIDEVS.MAX_WORLD_DESCRIPTION_LENGTH);
export const WorldUnlistedSchema = z.boolean();
export const WorldEditsSchema = nonEmptyObject({
	description: z.optional(WorldDescriptionSchema),
	unlisted: z.optional(WorldUnlistedSchema),
});

export const WorldPatchHeaderSchema = z.object({
    "session-token": SessionTokenSchema
})
export const WorldPatchBodySchema = z.object({
    world_uuid: UUIDSchema,
    edits: WorldEditsSchema
})