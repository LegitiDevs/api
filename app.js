"use strict";

import "dotenv/config";
import path from "node:path";
import AutoLoad from "@fastify/autoload";
import cors from "@fastify/cors";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import * as checkStatus from "./misc/checkStatus.js";
import RateLimit from "@fastify/rate-limit";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Pass --options via CLI arguments in command to enable these options.
const options = {};

export default async function (fastify, opts) {
	// Place here your custom code!
	checkStatus.main();

	fastify.setErrorHandler((error, request, reply) => {
		if (error instanceof ZodError) {
			const validationError = fromError(error)
			reply.status(400).send(validationError);
			return;
		}

		reply.send(error);
	});
	// Do not touch the following lines

	// This loads all plugins defined in plugins
	// those should be support plugins that are reused
	// through your application
	/*fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })*/

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
		options: Object.assign({}, opts),
	});
}

export { options };
