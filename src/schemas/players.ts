import Type from "typebox";
import { UuidSchema, WholeNumberSchema } from "./generic.ts";
import { WorldUuidSchema } from "./worlds.ts";


export const PlayerSchema = Type.Object({
    streak: WholeNumberSchema,
    legiticoins: Type.Integer(), // Can be negative in rare cases
    uuid: UuidSchema,
    name: Type.String(),
    rank: Type.String(),
    world: WorldUuidSchema
})