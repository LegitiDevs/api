import { z } from "zod/v4";
import { SortDirectionSchema, SortMethodSchema } from "./worlds.js";

export const ProfileGetParamSchema = z.object({
    profile_uuid: z.uuid()
}).meta({ id: "ProfileGetParamSchema" })

export const ProfileWorldListGetParamSchema = z.object({
    profile_uuid: z.uuid(),
}).meta({ id: "ProfileWorldListGetParamSchema" })

export const ProfileWorldListGetQuerySchema = z.object({
    sortMethod: SortMethodSchema.optional(),
    sortDirection: SortDirectionSchema.optional()
}).meta({ id: "ProfileWorldListGetQuerySchema" })