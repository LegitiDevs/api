import { z } from "zod/v4";
import { nonEmptyObject, NoRegexString } from "./generic.js";
import { CONFIG } from "../util/config.js";
import { SessionTokenSchema } from "./auth.js";

//[Resource][Subresource][Operation][Type]Schema

// GET REQUESTS

export const OffsetSchema = z.coerce.number().nonnegative();
export const LimitSchema = z.coerce.number().gt(0);

// + or - is optional
export const WorldSortMethodsEnum = z.enum([
    "default",
    "votes",
    "visits",
    "recently_scraped",
    "recently_created"
])
export const CommentSortMethodsEnum = z.enum([
	"default",
]);
export const WorldSortBySchema = z.stringFormat("sort_by", str => {
    if (str.startsWith("+") || str.startsWith("-")) {
        return WorldSortMethodsEnum.parse(str.slice(1))
    }
    return WorldSortMethodsEnum.parse(str)
})
export const CommentSortBySchema = z.stringFormat("sort_by", (str) => {
	if (str.startsWith("+") || str.startsWith("-")) {
		return WorldSortMethodsEnum.parse(str.slice(1));
	}
	return WorldSortMethodsEnum.parse(str);
});

export const SortMethodSchema = z.union([
    z.literal("default"), 
    z.literal("votes"),
    z.literal("visits"),
    z.literal("recently_scraped"),
    z.literal("recently_created"),
])
export const SortDirectionSchema = z.union([
    z.literal("ascending"),
    z.literal("descending"),
])

export const WorldListGetQuerySchema = z.object({
    sort_by: WorldSortBySchema.optional(),
    project: z.string().optional(),
    offset: OffsetSchema.optional(),
    limit: LimitSchema.optional(),
})

export const WorldRandomGetQuerySchema = WorldListGetQuerySchema.omit({ offset: true })

export const WorldGetParamSchema = z.object({
    world_uuid: z.uuid()
})

export const WorldGetQuerySchema = z.object({
	project: z.string().optional()
});

export const WorldCommentListGetParamSchema = z.object({
    world_uuid: z.uuid()
})

export const WorldCommentListGetQuerySchema = z.object({
	sort_by: CommentSortBySchema.optional(),
	project: z.string().optional(),
	offset: OffsetSchema.optional(),
	limit: LimitSchema.optional(),
});

export const WorldCommentGetParamSchema = z.object({
	world_uuid: z.uuid(),
    comment_uuid: z.uuid()
})

export const WorldCommentPostParamSchema = z.object({
	world_uuid: z.uuid()
});

export const WorldCommentPostBodySchema = z.object({
	profile_uuid: z.uuid(),
    content: z.string().min(0).max(CONFIG.V4.WORLDS.MAX_COMMENT_LENGTH)
});

export const WorldCommentDeleteParamSchema = z.object({
	world_uuid: z.uuid(),
	comment_uuid: z.uuid(),
});

export const WorldListSearchGetParamSchema = z.object({
    query: z.string()
})

export const WorldListSearchGetQuerySchema = z.object({
    sortMethod: SortMethodSchema.optional(),
    sortDirection: SortDirectionSchema.optional()
})

export const WorldSearchGetQuerySchema = WorldListGetQuerySchema.extend({
    query: NoRegexString
})

// PATCH REQUESTS

export const WorldDescriptionSchema = z.string().max(CONFIG.LEGITIDEVS.MAX_WORLD_DESCRIPTION_LENGTH);
export const WorldUnlistedSchema = z.boolean();

export const WorldEditsSchema = nonEmptyObject({
	description: WorldDescriptionSchema.optional(),
	unlisted: WorldUnlistedSchema.optional(),
})

export const WorldPatchHeaderSchema = z.object({
    "session-token": SessionTokenSchema
})

export const WorldPatchParamSchema = z.object({
    world_uuid: z.uuid()
})

export const WorldPatchBodySchema = z.object({
    edits: WorldEditsSchema
})