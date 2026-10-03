import { Type } from "@fastify/type-provider-typebox";

export const WholeNumberSchema = Type.Integer({ minimum: 0, examples: [0, 1, 2] })
export const NaturalNumberSchema = Type.Integer({ minimum: 1, examples: [1, 2, 3] })
export const UuidSchema = Type.String({ format: 'uuid', examples: ["00000000-1111-2222-3333-444444444444"] })
export const DateTimeSchema = Type.String({ format: 'date-time', examples: ["2026-09-30T00:00:00+08:00"] })
export const URLSchema = Type.String({ format: 'url', examples: ["https://legiti.dev/"] })

export const UnixTimestampSchema = Type.Integer({ minimum: 0, description: "Unix Timestamp in seconds", examples: [1790726400] })
export const NumberIdSchema = Type.Integer({ minimum: 0, description: "Number-based identifier" })

// Accepts [{any}, ...] or {any}
export const TextComponentSchema = Type.Union([
    Type.String(),
    Type.Array(Type.Record(Type.String(), Type.Any())), 
    Type.Record(Type.String(), Type.Any())
], { 
    description: "A JSON serialized Minecraft text component. See [Text component format (Minecraft Wiki)](https://minecraft.wiki/w/Text_component_format)",
    examples: ['"foo"', '{"text": "bar", "color": "aqua"}', '{"text": "baz", "bold": true, "extra": [{...}]}', '[{"text": "my text"}, {"text": " another one"}]'] 
})