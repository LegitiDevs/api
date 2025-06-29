import { z } from "zod/v4";
import { CONFIG } from "../util/config.js";
import { ObjectId } from "mongodb";

export const CommentSchema = z.object({
    profile_uuid: z.uuid(),
    content: z.string().max(CONFIG.LEGITIDEVS.MAX_WORLD_COMMENT_LENGTH),
    date: z.int().min(0),
    uuid: z.uuid()
}).meta({ id: "CommentSchema" })

export const WorldSchema = z.object({
    _id: z.instanceof(ObjectId).describe("The MongoDB ObjectId of this document. Do not use this, use `world_uuid` instead."),
    creation_date: z.string(),
    creation_date_unix_seconds: z.int().min(0),
    enforce_whitelist: z.boolean(),
    locked: z.boolean(),
    owner_uuid: z.uuid(),
    player_count: z.int().min(0),
    resource_pack_url: z.union([z.literal(""), z.url()]),
    world_uuid: z.uuid(),
    version: z.string().describe("The minecraft version this world is compatible with"), // Mojang does goofy stuff for mc versions so I'm not gonna enforce semver syntax.
    visits: z.int().min(0),
    votes: z.int().min(0),
    whitelist_on_version_change: z.boolean(),
    name: z.string().describe("Plaintext representation of the name"),
    description: z.string().describe("Plaintext representation of the description"),
    raw_name: z.string().describe("JSON Text representation of the name"),
    raw_description: z.string().describe("JSON Text representation of the description"),
    icon: z.string(),
    last_scraped: z.int().min(0),
    legitidevs: z.object({
        description: z.string().max(CONFIG.LEGITIDEVS.MAX_WORLD_DESCRIPTION_LENGTH).optional(),
        unlisted: z.boolean().optional(),
        comments: z.array(CommentSchema).optional()
    }).optional()
}).meta({ id: "WorldSchema" })