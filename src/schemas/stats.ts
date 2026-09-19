import Type, { Static } from "typebox";
import { WorldSchema } from "./worlds.ts";
import { DateTimeSchema } from "./generic.ts";


export const ServerStatsSchema = Type.Object({
    player_count: Type.Index(WorldSchema, ["player_count"]),
    timestamp: DateTimeSchema
})

export type ServerStats = Static<typeof ServerStatsSchema>