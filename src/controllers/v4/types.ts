import { type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import type {
	ContextConfigDefault,
	FastifyBaseLogger,
	FastifyInstance,
	FastifyReply,
	FastifyRequest,
	RawReplyDefaultExpression,
	RawRequestDefaultExpression,
	RawServerDefault,
} from "fastify";
import type { RouteGenericInterface } from "fastify/types/route.d.ts";
import type { FastifySchema } from "fastify/types/schema.d.ts";

export type FastifyTypeBox = FastifyInstance<
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	FastifyBaseLogger,
	TypeBoxTypeProvider
>;

export type FastifyRequestTypeBox<TSchema extends FastifySchema> =
	FastifyRequest<
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
