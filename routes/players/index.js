"use strict";
import "dotenv/config";
import { standardizeUUID } from "../../util/utils.js";
import { UnavailableError } from "../../util/errors.js";

const SCRAPER_URI = process.env.SCRAPER_URI;

export default async function (fastify, opts) {
    fastify.get("/", async function (request, reply) {
        var response;
        try {
            response = await fetch(SCRAPER_URI + `/players`);
        } catch (e) {
            return reply.send(new UnavailableError())
        }
        return response;
    });

    fastify.get("/:uuid", async function (request, reply) {
        const uuid = request.params.uuid;
        const uuidHyphenated = standardizeUUID(uuid);
        var response;
        try {
            response = await fetch(SCRAPER_URI + `/players/${uuidHyphenated}`);
        } catch (e) {
            return reply.send(new UnavailableError())
        }
        return response;
    });
}
