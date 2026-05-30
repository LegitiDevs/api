import { ObjectId } from "mongodb";
import { Static, Type } from "@fastify/type-provider-typebox";
import "#schemas/formats.js"

import { 
    BooleanFilterOptionsSchema,
    DateTimeSchema,
    NaturalNumberSchema,
    NumberFilterOptionsSchema,
    NumberIdSchema,
    StringFilterOptionsSchema,
    TextComponentSchema,
    URLSchema,
    UnixTimestampSchema,
    UuidSchema,
    WholeNumberSchema
} from "#schemas/generic.js";
import { CONFIG } from "#util/config.js";

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

export const CommentSchema = Type.Object({
    profile_uuid: UuidSchema,
    content: Type.String({ maxLength: CONFIG.LEGITIDEVS.MAX_WORLD_COMMENT_LENGTH }),
    date: UnixTimestampSchema,
    uuid: UuidSchema
})

export const LegitiDevsSchema = Type.Partial(Type.Object({
    description: Type.String({ maxLength: CONFIG.LEGITIDEVS.MAX_WORLD_DESCRIPTION_LENGTH }),
    unlisted: Type.Boolean(),
    comments: Type.Array(CommentSchema)
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
    whitelist_on_version_change: Type.Boolean(),
    legitidevs: LegitiDevsSchema
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

export const WorldFilterSchema = Type.Partial(
    Type.Object({
        world_uuid: StringFilterOptionsSchema,
        creation_date: StringFilterOptionsSchema,
        creation_date_unix_seconds: NumberFilterOptionsSchema,
        description: StringFilterOptionsSchema,
        enforce_whitelist: BooleanFilterOptionsSchema,
        featured_instant: NumberFilterOptionsSchema,
        icon: StringFilterOptionsSchema,
        // jam: JamSchema, // expand the whole thing, not supported for now
        jam_id: NumberIdSchema,
        jam_world: BooleanFilterOptionsSchema,
        last_scraped: NumberFilterOptionsSchema,
        last_scraped_ms: StringFilterOptionsSchema,
        locked: BooleanFilterOptionsSchema,
        max_datapack_size: NumberFilterOptionsSchema,
        max_players: NumberFilterOptionsSchema,
        name: StringFilterOptionsSchema,
        owner_name: StringFilterOptionsSchema,
        owner_uuid: StringFilterOptionsSchema,
        player_count: NumberFilterOptionsSchema,
        // raw_description: Type.Union, // not supported for now
        // raw_name: Type.Union, // not supported for now
        resource_pack_url: StringFilterOptionsSchema,
        version: StringFilterOptionsSchema,
        visits: NumberFilterOptionsSchema,
        votes: NumberFilterOptionsSchema,
        whitelist_on_version_change: BooleanFilterOptionsSchema,
        // legitidevs: LegitiDevsSchema // not supported for now
    })
)