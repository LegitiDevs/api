"use strict";

import "dotenv/config";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

// Plugins
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import FastifyCors from "@fastify/cors";
import FastifyRateLimit from "@fastify/rate-limit";
import FastifyAutoLoad from "@fastify/autoload";
import FastifyMongoDB from "@fastify/mongodb";

const __dirname = dirname(fileURLToPath(import.meta.url));

const options = {};

export default async function (fastify, opts) {
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

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

	fastify.setNotFoundHandler({
		preHandler: fastify.rateLimit({
			max: 10,
			timeWindow: 1000,
		}),
	});

	// DEPRECATED, SUNSETS AFTER 1 WEEK OF API v4 RELEASE
	fastify.addHook("onSend", (request, reply, payload, done) => {
		if (!request.url.startsWith("/v4")) {
			reply.header("Deprecation", "@1745875320");
			console.log("ae???????????????")
		}
		done();
	});

	await fastify.register(FastifyAutoLoad, {
		dir: path.join(__dirname, "routes"),
		routeParams: true,
		options: Object.assign({}, opts),
	});
}

export { options };
