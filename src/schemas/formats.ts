import { Format, TSchema } from "@fastify/type-provider-typebox"
import { Value } from "typebox/value"

export function checkSortByParameter(schema: TSchema, value: string): boolean {
    if (value.startsWith("+") || value.startsWith("-")) {
        return Value.Check(schema, value.slice(1));
    }
    return Value.Check(schema, value);
}

Format.Set('uuid-flexible', v => {
	return /^[0-9a-f]{8}(-?)(?:[0-9a-f]{4}\1){3}[0-9a-f]{12}$/i.test(v)
})