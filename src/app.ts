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
import FastifySwagger from "@fastify/swagger";
import LegitiDevsScraperPlugin from "./plugins/legitidevs_scraper_plugin.ts"
import packageJson from "../package.json" with {type: "json"}
import openApiConfig from "./openapi_config.json" with {type: "json"}
openApiConfig.openapi.info.version = packageJson.version

// Types
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";

const __dirname = dirname(fileURLToPath(import.meta.url));

const options = {};

export default async function (fastify: FastifyInstance, opts: FastifyPluginOptions) {
	fastify.setValidatorCompiler(TypeBoxValidatorCompiler);

	// ingore serializing response schemas while still keeping openapi spec
	fastify.setSerializerCompiler(({ schema, method, url, httpStatus }) => {
	  	return (data) => JSON.stringify(data);
	});
	
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
	await fastify.register(LegitiDevsScraperPlugin, {
		scraper_uri: process.env.SCRAPER_URI
	})
	await fastify.register(FastifySwagger, openApiConfig)

	fastify.addHook('onRoute', (routeOptions) => {
	  if (!routeOptions.url.startsWith("/v4")) {
	    routeOptions.schema ??= {};
	    routeOptions.schema.hide = true;
	  }
	});


	await fastify.register(FastifyAutoLoad, {
		dir: path.join(__dirname, "routes"),
		routeParams: true,
		options: {
			apiVersion: packageJson.version
		},
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
