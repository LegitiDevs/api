import Type, { Static } from "typebox";
import { UuidSchema, WholeNumberSchema } from "#schemas/generic.js";
import { WorldUuidSchema } from "#schemas/worlds.js";

export const PlayerSchema = Type.Object({
    streak: WholeNumberSchema,
    legiticoins: Type.Integer({ description: "The amount of LegitiCoins a player has. This value can overflow and be negative." }), // Can be negative in rare cases
    uuid: UuidSchema,
    name: Type.String(),
    rank: Type.String({ description: "The in-game rank of a player. This value is `Non` if this player does not have a rank." }),
    online: Type.Boolean(),
    world: {...WorldUuidSchema, description: "The UUID of the world this player is in."},
})

export type Player = Static<typeof PlayerSchema>