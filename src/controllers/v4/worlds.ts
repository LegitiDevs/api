import { parseProject, parseSortBy } from "#util/query.js"
import * as WorldsService from "#services/v4/worlds.js"
import { ApiError } from "#util/errors.js"
import { Collection } from "mongodb"

import { type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type {
  ContextConfigDefault,
  FastifyBaseLogger,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
} from 'fastify';
import type { RouteGenericInterface } from 'fastify/types/route.d.ts';
import type { FastifySchema } from 'fastify/types/schema.d.ts';
import { SchemaGetRandomWorld, SchemaSearchWorld, SchemaGetWorld, SchemaGetWorldList } from "#schemas/routes/worlds.js"
import { World } from "#schemas/worlds.js"

export type FastifyTypeBox = FastifyInstance<
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  FastifyBaseLogger,
  TypeBoxTypeProvider
>;

export type FastifyRequestTypeBox<TSchema extends FastifySchema> = FastifyRequest<
  RouteGenericInterface,
  RawServerDefault,
  RawRequestDefaultExpression,
  TSchema,
  TypeBoxTypeProvider
>;

export type FastifyReplyTypeBox<TSchema extends FastifySchema> = FastifyReply<
  RouteGenericInterface,
  RawServerDefault,
  RawRequestDefaultExpression,
  RawReplyDefaultExpression,
  ContextConfigDefault,
  TSchema,
  TypeBoxTypeProvider
>;

export class WorldsController {
    worldsCollection: Collection<World>

    constructor(fastify: FastifyInstance) {
        if (fastify.mongo.db == null) throw new ApiError("DB not found", 500) 
        this.worldsCollection = fastify.mongo.db.collection("worlds")
    }

    listWorlds = async (
        request: FastifyRequestTypeBox<typeof SchemaGetWorldList>,
        reply: FastifyReplyTypeBox<typeof SchemaGetWorldList>
    ) => {
        const project = parseProject(request.query["project"])
        const sort_by = parseSortBy(request.query["sort_by"])
        const limit = request.query["limit"] ?? undefined
        const offset = request.query["offset"] ?? undefined

        return await WorldsService.listWorlds(this.worldsCollection, { project, sort_by, limit, offset })
    }

    randomWorld = async (
        request: FastifyRequestTypeBox<typeof SchemaGetRandomWorld>,
        reply: FastifyReplyTypeBox<typeof SchemaGetRandomWorld>
    ) => {
        const project = parseProject(request.query["project"]);
        const sort_by = parseSortBy(request.query["sort_by"]);
        const limit = request.query["limit"] ?? 1;

        return await WorldsService.randomWorld(this.worldsCollection, { project, sort_by, limit })
    }

    searchWorld = async (
        request: FastifyRequestTypeBox<typeof SchemaSearchWorld>, 
        reply: FastifyReplyTypeBox<typeof SchemaSearchWorld>
    ) => {
        const query = request.query["query"]
		const project = parseProject(request.query["project"]);
		const sort_by = parseSortBy(request.query["sort_by"]);
		const limit = request.query["limit"] ?? undefined;
		const offset = request.query["offset"] ?? undefined;

        return await WorldsService.searchWorld(this.worldsCollection, { query, project, sort_by, limit, offset })
    }

    getWorld = async (
        request: FastifyRequestTypeBox<typeof SchemaGetWorld>, 
        reply: FastifyReplyTypeBox<typeof SchemaGetWorld>
    ) => {
        const world_uuid = request.params["world_uuid"];
        const project = parseProject(request.query["project"])

        const world = await WorldsService.getWorld(this.worldsCollection, { world_uuid, project })
        if (!world) throw new ApiError(`World ${world_uuid} not found`, 404);

        return world
    }
}