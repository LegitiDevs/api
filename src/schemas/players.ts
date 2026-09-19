import Type, { Static } from "typebox";
import { UuidSchema, WholeNumberSchema } from "./generic.ts";
import { WorldUuidSchema } from "./worlds.ts";

export const PlayerSortMethodsEnum = Type.Union([
    Type.Literal("streak"),
    Type.Literal("legiticoins"),
    Type.Literal("online")
])

export const PlayerSortBySchema = Type.String({ format: 'player-sort-by-parameter' })

export const PlayerSchema = Type.Object({
    streak: WholeNumberSchema,
    legiticoins: Type.Integer(), // Can be negative in rare cases
    uuid: UuidSchema,
    name: Type.String(),
    rank: Type.String(),
    online: Type.Boolean(),
    world: WorldUuidSchema,
})

export type Player = Static<typeof PlayerSchema>