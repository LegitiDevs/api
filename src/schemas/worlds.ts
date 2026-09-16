import { ObjectId } from "mongodb";
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
    upgraded: Type.Boolean(),
    rating_count: WholeNumberSchema,
    scores: Type.Object({
        overall: JamScoreSchema,
        originality: JamScoreSchema,
        aesthetics: JamScoreSchema,
        fun: JamScoreSchema,
        theme: JamScoreSchema
    })
}))

export const LegitiDevsSchema = Type.Partial(Type.Object({}))

export const WorldSchema = Type.Object({
    _id: Type.Optional(ObjectId),
    // Main info
    name: Type.String(),
    icon: Type.String(),
    description: Type.String(),

    normalized_name: Type.String(),
    raw_name: TextComponentSchema,
    raw_description: TextComponentSchema,

    owner_name: Type.String(),
    owner_uuid: UuidSchema,

    // World metadata
    world_uuid: UuidSchema,
    creation_date: Type.String(),
    creation_date_unix_seconds: UnixTimestampSchema,
    enforce_whitelist: Type.Boolean(),
    featured_instant: Type.Union([Type.Literal(-1), UnixTimestampSchema]),

    // Jam info
    jam: JamSchema,
    jam_id: NumberIdSchema,
    jam_world: Type.Boolean(),

    // Numbers
    player_count: WholeNumberSchema,
    visits: WholeNumberSchema,
    votes: WholeNumberSchema,

    // Misc.
    locked: Type.Boolean(),
    max_datapack_size: WholeNumberSchema,
    max_players: NaturalNumberSchema,
    resource_pack_url: Type.Union([Type.Literal(""), URLSchema]),
    version: Type.String(), // do not trust minecraft versioning at all
    whitelist_on_version_change: Type.Boolean(),

    // LegitiDevs info
    last_scraped: UnixTimestampSchema,
    last_scraped_ms: DateTimeSchema,
    legitidevs: LegitiDevsSchema,
})
export type World = Static<typeof WorldSchema>

export const WorldSortMethodsEnum = Type.Union([
    Type.Literal("default"),
    Type.Literal("votes"),
    Type.Literal("visits"),
    Type.Literal("recently_scraped"),
    Type.Literal("recently_created")
])
export const WorldSortBySchema = Type.String({ format: 'world-sort-by-parameter' })