import { Type } from "@fastify/type-provider-typebox";

export const WholeNumberSchema = Type.Integer({ minimum: 0 })
export const NaturalNumberSchema = Type.Integer({ minimum: 1 })
export const UuidSchema = Type.String({ format: 'uuid' })
export const DateTimeSchema = Type.String({ format: 'date-time' })
export const URLSchema = Type.String({ format: 'url' })

export const UnixTimestampSchema = Type.Integer({ minimum: 0, description: "Unix Timestamp in seconds" })
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