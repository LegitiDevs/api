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

export const WorldSchema = Type.Object({
    _id: Type.Optional(ObjectId),
    world_uuid: UuidSchema,
    creation_date: Type.String(),
    creation_date_unix_seconds: UnixTimestampSchema,
    description: Type.String(),
    enforce_whitelist: Type.Boolean(),
    featured_instant: Type.Union([Type.Literal(-1), UnixTimestampSchema]),
    icon: Type.String(),
    jam: JamSchema,
    jam_id: NumberIdSchema,
    jam_world: Type.Boolean(),
    last_scraped: UnixTimestampSchema,
    last_scraped_ms: DateTimeSchema,
    locked: Type.Boolean(),
    max_datapack_size: WholeNumberSchema,
    max_players: NaturalNumberSchema,
    name: Type.String(),
    owner_name: Type.String(),
    owner_uuid: UuidSchema,
    player_count: WholeNumberSchema,
    raw_description: TextComponentSchema,
    raw_name: TextComponentSchema,
    resource_pack_url: Type.Union([Type.Literal(""), URLSchema]),
    version: Type.String(), // do not trust minecraft versioning at all
    visits: WholeNumberSchema,
    votes: WholeNumberSchema,
    whitelist_on_version_change: Type.Boolean()
})
export type World = Static<typeof WorldSchema>

export const WorldSortMethodsEnum = Type.Union([
    Type.Literal("default"),
    Type.Literal("votes"),
    Type.Literal("visits"),
    Type.Literal("recently_scraped"),
    Type.Literal("recently_created")
])
export const CommentSortMethodsEnum = Type.Union([
	Type.Literal("default"),
]);
export const WorldSortBySchema = Type.String({ format: 'world-sort-by-parameter' })
export const CommentSortBySchema = Type.String({ format: 'comment-sort-by-parameter' })