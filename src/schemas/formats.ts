import { TSchema } from "@fastify/type-provider-typebox"
import { Value } from "typebox/value"

export function checkSortByParameter(schema: TSchema, value: string): boolean {
    if (value.startsWith("+") || value.startsWith("-")) {
        return Value.Check(schema, value.slice(1));
    }
    return Value.Check(schema, value);
}