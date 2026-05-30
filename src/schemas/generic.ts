import { Static, Type } from "@fastify/type-provider-typebox";

export const WholeNumberSchema = Type.Integer({ minimum: 0 })
export const NaturalNumberSchema = Type.Integer({ minimum: 1 })
export const UuidSchema = Type.String({ format: 'uuid' })
export const DateTimeSchema = Type.String({ format: 'date-time' })
export const URLSchema = Type.String({ format: 'url' })

export const UnixTimestampSchema = Type.Integer({ minimum: 0, description: "Unix Timestamp in seconds" })
export const NumberIdSchema = Type.Integer({ minimum: 0, description: "Number-based identifier" })

// Accepts [{any}, ...] or {any}
export const TextComponentSchema = Type.Union([
    Type.Array(Type.Record(Type.String(), Type.Any())), 
    Type.Record(Type.String(), Type.Any())]
)

// Filters
export const NumberFilterOperatorsSchema = Type.Object({
    eq: Type.Number(),
    gt: Type.Number(),
    lt: Type.Number(),
    gte: Type.Number(),
    lte: Type.Number(),
})

export const StringFilterOperatorsSchema = Type.Object({
    eq: Type.String(),
    starts: Type.String(),
    ends: Type.String(),
})

export const ObjectFilterOperatorsSchema = Type.Object({
    has: Type.String()
})

export const ArrayFilterOperatorsSchema = Type.Object({
    eq: WholeNumberSchema,
    gt: WholeNumberSchema,
    lt: WholeNumberSchema,
    gte: WholeNumberSchema,
    lte: WholeNumberSchema,
})

export const NumberFilterOptionsSchema = Type.Partial(
    Type.Intersect([
        NumberFilterOperatorsSchema,
        Type.Object({
            not: Type.Partial(NumberFilterOperatorsSchema)
        })
    ])
)

export const StringFilterOptionsSchema = Type.Partial(
    Type.Intersect([
        StringFilterOperatorsSchema,
        Type.Object({
            not: Type.Partial(StringFilterOperatorsSchema)
        })
    ])
)

export const ObjectFilterOptionsSchema = Type.Partial(
    Type.Intersect([
        ObjectFilterOperatorsSchema,
        Type.Object({
            not: Type.Partial(ObjectFilterOperatorsSchema)
        })
    ])
)

export const ArrayFilterOptionsSchema = Type.Partial(
    Type.Intersect([
        ArrayFilterOperatorsSchema,
        Type.Object({
            not: Type.Partial(ArrayFilterOperatorsSchema)
        })
    ])
)

export const BooleanFilterOptionsSchema = Type.Optional(Type.Boolean())