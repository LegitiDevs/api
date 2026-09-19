import Type from "typebox";

export const SchemaGetServerStats = {
    querystring: Type.Object({
        project: Type.Optional(Type.String())
    })
}