import Type, { Static } from "typebox"
import { ProjectSchema } from "#schemas/services/generic.js"

export const GetServerStatsOptionsSchema = Type.Object({
    project: Type.Optional(ProjectSchema),
})

export type GetServerStatsOptions = Static<typeof GetServerStatsOptionsSchema>