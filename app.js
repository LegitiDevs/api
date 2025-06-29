"use strict";

import "dotenv/config";
import path from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as checkStatus from "./misc/checkStatus.js";

// Plugins
import { serializerCompiler, validatorCompiler, jsonSchemaTransform, jsonSchemaTransformObject, hasZodFastifySchemaValidationErrors, isResponseSerializationError } from "fastify-type-provider-zod";
import Swagger from "@fastify/swagger";
import SwaggerUI from "@fastify/swagger-ui";
import cors from "@fastify/cors";
import RateLimit from "@fastify/rate-limit";
import AutoLoad from "@fastify/autoload";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Pass --options via CLI arguments in command to enable these options.
const options = {};

export default async function (fastify, opts) {
	// Place here your custom code!
	checkStatus.main();

	fastify.setValidatorCompiler(validatorCompiler)
	fastify.setSerializerCompiler(serializerCompiler)

	fastify.setErrorHandler((err, req, reply) => {
	    if (hasZodFastifySchemaValidationErrors(err)) {
	        return reply.code(400).send({
	            error: 'Response Validation Error',
	            message: "Request doesn't match the schema",
	            statusCode: 400,
	            details: {
	                issues: err.validation,
	                method: req.method,
	                url: req.url,
	            },
	        })
	    }

	    if (isResponseSerializationError(err)) {
	        return reply.code(500).send({
	            error: 'Internal Server Error',
	            message: "Response doesn't match the schema",
	            statusCode: 500,
	            details: {
	                issues: err.cause.issues,
	                method: err.method,
	                url: err.url,
	            },
	        })
	    }
	
	    // the rest of the error handler
	})

	await fastify.register(Swagger, {
		openapi: {
			info: {
				title: "LegitiDevs API",
				version: "1.0.0"
			}
		},
		transform: jsonSchemaTransform,
		transformObject: jsonSchemaTransformObject
	})

	await fastify.register(SwaggerUI, {
		routePrefix: '/docs'
	})

	await fastify.register(cors, {});
	await fastify.register(RateLimit, {
		max: 20,
		timeWindow: 1000,
	});
	fastify.setNotFoundHandler({
		preHandler: fastify.rateLimit({
			max: 10,
			timeWindow: 1000,
		}),
	});
	// This loads all plugins defined in routes
	// define your routes in one of these
	await fastify.register(AutoLoad, {
		dir: path.join(__dirname, "routes"),
		routeParams: true,
		options: Object.assign({}, opts),
	});
}

export { options };
