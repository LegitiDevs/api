import Type from "typebox"

export const ProjectSchema = Type.Record(Type.String(), Type.Integer())
export const SortBySchema = Type.Record(Type.String(), Type.Integer())