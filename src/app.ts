"use strict";

import "dotenv/config";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Plugins
import FastifyCors from "@fastify/cors";
import FastifyRateLimit from "@fastify/rate-limit";
import FastifyAutoLoad from "@fastify/autoload";
import FastifyMongoDB from "@fastify/mongodb";

// Types
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";

const __dirname = dirname(fileURLToPath(import.meta.url));

const options = {};

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
	fastify.setValidatorCompiler(TypeBoxValidatorCompiler);
	
	await fastify.register(FastifyCors, {});
	await fastify.register(FastifyRateLimit, {
		max: 20,
		timeWindow: 1000,
	});
	await fastify.register(FastifyMongoDB, {
		forceClose: true,
		url: process.env.MONGO_URI,
		database: process.env.DB,
	});

	await fastify.register(FastifyAutoLoad, {
		dir: path.join(__dirname, "routes"),
		routeParams: true,
		options: Object.assign({}, opts),
	});

	fastify.setNotFoundHandler({
		// @ts-ignore
		preHandler: fastify.rateLimit({
			max: 10,
			timeWindow: 1000,
		}),
	});
}

export { options };
