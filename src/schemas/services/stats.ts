import Type, { Static } from "typebox"
import { ProjectSchema } from "./generic.ts"

export const GetServerStatsOptionsSchema = Type.Object({
    project: Type.Optional(ProjectSchema),
})

export type GetServerStatsOptions = Static<typeof GetServerStatsOptionsSchema>