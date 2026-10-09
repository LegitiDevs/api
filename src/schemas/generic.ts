import { Format, Type } from "@fastify/type-provider-typebox";

Format.Set('uuid-flexible', v => {
	return /^[0-9a-f]{8}(-?)(?:[0-9a-f]{4}\1){3}[0-9a-f]{12}$/i.test(v)
})

export const WholeNumberSchema = Type.Integer({ minimum: 0, examples: [0, 1, 2] })
export const NaturalNumberSchema = Type.Integer({ minimum: 1, examples: [1, 2, 3] })
export const DateTimeSchema = Type.String({ format: 'date-time', examples: ["2026-09-30T00:00:00+08:00"] })
export const URLSchema = Type.String({ format: 'url', examples: ["https://legiti.dev/"] })
export const UuidSchema = Type.String({ format: 'uuid-flexible', examples: ["00000000-1111-2222-3333-444444444444", "00000000111122223333444444444444"] })

export const UnixTimestampSchema = Type.Integer({ minimum: 0, description: "Unix Timestamp in seconds", examples: [1790726400] })
export const NumberIdSchema = Type.Integer({ minimum: 0, description: "Number-based identifier" })

// Accepts [{any}, ...] or {any}
export const TextComponentSchema = Type.Union(
	[
		Type.String(),
		Type.Array(Type.Record(Type.String(), Type.Any())),
		Type.Record(Type.String(), Type.Any()),
	],
	{
		description:
			"A JSON serialized Minecraft text component. See [Text component format (Minecraft Wiki)](https://minecraft.wiki/w/Text_component_format)",
		examples: [
			{ text: "foo", color: "aqua" },
			'{"text": "bar", "color": "aqua"}',
			'{"text": "baz", "bold": true, "extra": [{...}]}',
			'[{"text": "my text"}, {"text": " another one"}]',
		],
	},
);