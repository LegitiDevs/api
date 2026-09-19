import { UuidSchema } from "#schemas/generic.js";
import Type, { Static } from "typebox";
import { ProjectSchema } from "./generic.ts";


export const GetWorldListStatsOptionsSchema = Type.Object({
    project: Type.Optional(ProjectSchema),
})

export const GetWorldStatsOptionsSchema = Type.Object({
    world_uuid: UuidSchema,
    project: Type.Optional(ProjectSchema),
})

export type GetWorldListStatsOptions = Static<typeof GetWorldListStatsOptionsSchema>
export type GetWorldStatsOptions = Static<typeof GetWorldStatsOptionsSchema>