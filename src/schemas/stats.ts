import Type, { Static } from "typebox";
import { WorldSchema } from "#schemas/worlds.js";
import { DateTimeSchema } from "#schemas/generic.js";


export const ServerStatsSchema = Type.Object({
    player_count: Type.Index(WorldSchema, ["player_count"]),
    timestamp: DateTimeSchema
})

export type ServerStats = Static<typeof ServerStatsSchema>