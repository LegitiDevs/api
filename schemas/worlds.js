import { z } from "zod/v4";
import { nonEmptyObject } from "./generic.js";
import { CONFIG } from "../util/config.js";
import { SessionTokenSchema } from "./auth.js";

//[Resource][Subresource][Operation][Type]Schema

// GET REQUESTS

export const PageSchema = z.coerce.number().nonnegative();
export const MaxSchema = z.coerce.number().gt(0);
export const SortMethodSchema = z.union([
    z.literal("default"), 
    z.literal("votes"),
    z.literal("visits"),
    z.literal("recently_scraped"),
    z.literal("recently_created"),
]).meta({ id: "SortMethodSchema" })
export const SortDirectionSchema = z.union([
    z.literal("ascending"),
    z.literal("descending"),
]).meta({ id: "SortDirectionSchema" });
const SearchQuerySchema = z.string();

export const WorldListGetQuerySchema = z.object({
    page: PageSchema.optional(),
    max: MaxSchema.optional(),
    sortMethod: SortMethodSchema.optional(),
    sortDirection: SortDirectionSchema.optional()
}).meta({ id: "WorldListGetQuerySchema" })

export const WorldGetParamSchema = z.object({
    world_uuid: z.uuid()
}).meta({ id: "WorldGetParamSchema" })

export const WorldCommentListGetParamSchema = z.object({
    world_uuid: z.uuid()
}).meta({ id: "WorldCommentListGetParamSchema" })

export const WorldCommentListGetQuerySchema = z.object({
	page: PageSchema.optional(),
    max: MaxSchema.optional(),
    sortDirection: SortDirectionSchema.optional()
}).meta({ id: "WorldCommentListGetQuerySchema" });

export const WorldCommentGetParamSchema = z.object({
	world_uuid: z.uuid(),
    comment_uuid: z.uuid()
}).meta({ id: "WorldCommentGetParamSchema" });

export const WorldListSearchGetParamSchema = z.object({
    query: SearchQuerySchema
}).meta({ id: "WorldListSearchGetParamSchema" })

export const WorldListSearchGetQuerySchema = z.object({
    sortMethod: SortMethodSchema.optional(),
    sortDirection: SortDirectionSchema.optional()
}).meta({ id: "WorldListSearchGetQuerySchema" })

// PATCH REQUESTS

export const WorldDescriptionSchema = z.string().max(CONFIG.LEGITIDEVS.MAX_WORLD_DESCRIPTION_LENGTH);
export const WorldUnlistedSchema = z.boolean();
export const WorldEditsSchema = nonEmptyObject({
	description: WorldDescriptionSchema.optional(),
	unlisted: WorldUnlistedSchema.optional(),
}).meta({ id: "WorldEditsSchema" });

export const WorldPatchHeaderSchema = z.object({
    "session-token": SessionTokenSchema
}).meta({ id: "WorldPatchHeaderSchema" });
export const WorldPatchBodySchema = z.object({
    world_uuid: z.uuid(),
    edits: WorldEditsSchema
}).meta({ id: "WorldPatchBodySchema" });