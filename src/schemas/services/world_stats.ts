import Type, { Static } from "typebox";
import { ProjectSchema } from "./generic.ts";
import { WorldUuidSchema } from "#schemas/worlds.js";


export const GetWorldListStatsOptionsSchema = Type.Object({
    project: Type.Optional(ProjectSchema),
})

export const GetWorldStatsOptionsSchema = Type.Object({
    world_uuid: WorldUuidSchema,
    project: Type.Optional(ProjectSchema),
})

export type GetWorldListStatsOptions = Static<typeof GetWorldListStatsOptionsSchema>
export type GetWorldStatsOptions = Static<typeof GetWorldStatsOptionsSchema>