"use strict";
import "dotenv/config";

const SCRAPER_URI = process.env.SCRAPER_URI;

export default async function (fastify, opts) {
    fastify.get("/", async function (request, reply) {
        return await fetch(SCRAPER_URI + `/players`);
    });

    fastify.get("/:uuid", async function (request, reply) {
        const uuid = request.params.uuid;
        return await fetch(SCRAPER_URI + `/players/${uuid}`);
    });
}
