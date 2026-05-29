import { Format, TSchema } from "@fastify/type-provider-typebox"
import { Value } from "typebox/value"
import { CommentSortMethodsEnum, WorldSortMethodsEnum } from "#schemas/worlds.js";

function checkSortByParameter(schema: TSchema, value: string): boolean {
    if (value.startsWith("+") || value.startsWith("-")) {
        return Value.Check(schema, value.slice(1));
    }
    return Value.Check(schema, value);
}

Format.Set('world-sort-by-parameter', value => {
    return checkSortByParameter(WorldSortMethodsEnum, value)
})

Format.Set('comment-sort-by-parameter', value => {
    return checkSortByParameter(CommentSortMethodsEnum, value)
})