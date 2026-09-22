import { Static, Type } from "@fastify/type-provider-typebox";
import "#schemas/formats.js"

import { 
    DateTimeSchema,
    NaturalNumberSchema,
    NumberIdSchema,
    TextComponentSchema,
    URLSchema,
    UnixTimestampSchema,
    UuidSchema,
    WholeNumberSchema
} from "#schemas/generic.js";

export const JamScoreSchema = Type.Object({
    rank: Type.Integer({ minimum: 1 }),
    score: Type.Number({ minimum: 0 }),
})

export const JamSchema = Type.Partial(Type.Object({
    id: NumberIdSchema,
    upgraded: Type.Boolean({ description: "Whether this jam world has been upgraded to a normal world." }),
    rating_count: WholeNumberSchema,
    scores: Type.Object({
        overall: JamScoreSchema,
        originality: JamScoreSchema,
        aesthetics: JamScoreSchema,
        fun: JamScoreSchema,
        theme: JamScoreSchema
    })
}), { description: "Jam info for jam worlds." })

export const LegitiDevsSchema = Type.Partial(Type.Object({}), { description: "Extra metadata for LegitiDevs services" })

export const WorldUuidSchema = Type.Union([UuidSchema, Type.Literal("lobby")], { description: "A world UUID or `lobby`" })

export const WorldSchema = Type.Object({
    // Main info
    name: Type.String(),
    icon: Type.String({ description: "A Minecraft item ID." }),
    description: Type.String(),

    normalized_name: Type.String({ description: "NFKC normalized name." }),
    raw_name: TextComponentSchema,
    raw_description: TextComponentSchema,

    owner_name: Type.String(),
    owner_uuid: UuidSchema,

    // World metadata
    world_uuid: WorldUuidSchema,
    creation_date: Type.String(),
    creation_date_unix_seconds: UnixTimestampSchema,
    enforce_whitelist: Type.Boolean(),
    featured_instant: Type.Union([Type.Literal(-1), UnixTimestampSchema], { description: "Timestamp when this world was featured. This world is not featured if the value matches `-1`." }),

    // Jam info
    jam: JamSchema,
    jam_id: NumberIdSchema,
    jam_world: Type.Boolean(),

    // Numbers
    player_count: WholeNumberSchema,
    visits: WholeNumberSchema,
    votes: WholeNumberSchema,

    // Misc.
    locked: Type.Boolean({ description: "Whether this world is currently active." }),
    max_datapack_size: WholeNumberSchema,
    max_players: NaturalNumberSchema,
    resource_pack_url: Type.Union([Type.Literal(""), URLSchema]),
    version: Type.String({ description: "The minecraft version of this world." }), // do not trust minecraft versioning at all
    whitelist_on_version_change: Type.Boolean(),

    // LegitiDevs info
    last_scraped: UnixTimestampSchema,
    last_scraped_ms: DateTimeSchema,
    legitidevs: LegitiDevsSchema,
}, { description: "Properties of a legitimoose.com world." })
export type World = Static<typeof WorldSchema>

export const WorldStatsEntrySchema = Type.Object({
    timestamp: UnixTimestampSchema,
    visits: Type.Index(WorldSchema, ['visits']),
    votes: Type.Index(WorldSchema, ['votes'])
}, { description: "A snapshot of the stats of a world." })

export const WorldStatsSchema = Type.Object({
    world_uuid: WorldUuidSchema,
    stats: Type.Array(WorldStatsEntrySchema)
}, { description: "Stats of a world tracked over time." })
export type WorldStats = Static<typeof WorldStatsSchema>

export const WorldPlayersSchema = Type.Object({
    players: Type.Array(Type.String())
}, { description: "Players inside of a world." })

export const WorldListPlayersSchema = Type.Object({
    world: WorldUuidSchema,
    players: Type.Index(WorldPlayersSchema, ['players'])
}, { description: "Players inside of all worlds." })

export type WorldPlayers = Static<typeof WorldPlayersSchema>
export type WorldListPlayers = Static<typeof WorldListPlayersSchema>