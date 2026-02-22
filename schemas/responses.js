import { z } from "zod/v4";
import { CONFIG } from "../util/config.js"; 

export const CommentSchema = z.object({
    profile_uuid: z.uuid(),
    content: z.string().max(CONFIG.LEGITIDEVS.MAX_WORLD_COMMENT_LENGTH),
    date: z.int().min(0),
    uuid: z.uuid()
}).meta({ id: "CommentSchema" })

export const WorldSchema = z.object({
    //_id: z.instanceof(ObjectId).describe("The MongoDB ObjectId of this document. Do not use this, use `world_uuid` instead."),
    creation_date: z.string().optional(),
    creation_date_unix_seconds: z.int().min(0).optional(),
    enforce_whitelist: z.boolean().optional(),
    locked: z.boolean().optional(),
    owner_uuid: z.uuid().optional(),
    player_count: z.int().min(0).optional(),
    resource_pack_url: z.union([z.literal(""), z.url()]).optional(),
    world_uuid: z.uuid().optional(),
    version: z.string().describe("The minecraft version this world is compatible with").optional(), // Mojang does goofy stuff for mc versions so I'm not gonna enforce semver syntax.
    visits: z.int().min(0).optional(),
    votes: z.int().min(0).optional(),
    whitelist_on_version_change: z.boolean().optional(),
    name: z.string().describe("Plaintext representation of the name").optional(),
    description: z.string().describe("Plaintext representation of the description").optional(),
    raw_name: z.object().describe("Raw JSON representation of the name").optional(),
    raw_description: z.array().describe("Raw JSON representation of the description").optional(),
    icon: z.string().optional(),
    last_scraped: z.int().min(0).optional(),
    max_players: z.int().min(0).optional(),
    jam_id: z.int().optional(),
    jam_world: z.boolean().optional(),
    jam: z.object().optional(),
    legitidevs: z.object({
        description: z.string().max(CONFIG.LEGITIDEVS.MAX_WORLD_DESCRIPTION_LENGTH).optional(),
        unlisted: z.boolean().optional(),
        comments: z.array(CommentSchema).optional()
    }).optional()
}).meta({ id: "WorldSchema" })