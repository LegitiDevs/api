"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { isValidSession, validateProperty } from "../../../util/utils.js";
import { CONFIG } from "../../../util/config.js";
import { TooLongError, WorldNotFoundError, FormatError, UnauthorizedError, NotFoundError } from "../../../util/errors.js";
import { randomUUID } from "crypto"

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const worlds = mongoclient.db(DB).collection("worlds");

/**
 * 
 * @param {import("fastify").FastifyInstance} fastify  
 */
export default async function (fastify, opts) {
    // Anyone can run this.
    fastify.get("/:uuid", async function (request, reply) {
        const uuid = request.params.uuid;
        const world = await worlds.findOne({ "legitidevs.comments.uuid": uuid });
        if (!world) return reply.send(new NotFoundError(`Comment ${uuid}`));

        const comment = world.legitidevs.comments.find((comment) => comment.uuid === uuid)
        return { ...comment, from: { world_uuid: world.world_uuid, name: world.name, raw_name: world.raw_name } };
    })

    // Anyone can run this as long as they have a valid account.
    fastify.post("/", async function (request, reply) {
        if (!validateProperty(request.headers, "session-token", "string", { maxLength: CONFIG.MAX_SESSION_TOKEN_LENGTH })) return reply.send(new FormatError("Request header 'Session-Token'"))
        if (request.body >= CONFIG.MAX_REQUEST_BODY_LENGTH) return reply.send(new TooLongError("Request body", CONFIG.MAX_REQUEST_BODY_LENGTH))
        const body = JSON.parse(request.body);
        if (!validateProperty(body, "world_uuid", "string", { maxLength: CONFIG.MAX_UUID_LENGTH })) return reply.send(new FormatError("body.world_uuid"))
        if (!validateProperty(body, "profile_uuid", "string", { maxLength: CONFIG.MAX_UUID_LENGTH })) return reply.send(new FormatError("body.profile_uuid"))
        if (!validateProperty(body, "content", "string", { minLength: 1, maxLength: CONFIG.LEGITIDEVS.MAX_WORLD_COMMENT_LENGTH })) return reply.send(new FormatError("body.content"))

        if (!(await isValidSession(request.headers["session-token"], body.profile_uuid))) return reply.send(new UnauthorizedError())
        
        // Passed authorization checks.

        const world = await worlds.findOne({ world_uuid: body.world_uuid });
        if (!world) return reply.send(new WorldNotFoundError(body.world_uuid));

        // Passed data checks.
        const edit = { profile_uuid: body.profile_uuid, content: body.content, date: Math.floor(Date.now() / 1000), uuid: randomUUID() }

        await worlds.updateOne(
            { world_uuid: body.world_uuid },
            { $push: { "legitidevs.comments": { ...edit } } }
        );

        return { edit }
    })

    // Only the comment author can run this
    fastify.post("/delete", async function (request, reply) {
        if (!validateProperty(request.headers, "session-token", "string", { maxLength: CONFIG.MAX_SESSION_TOKEN_LENGTH })) return reply.send(new FormatError("Request header 'Session-Token'"))
        if (request.body >= CONFIG.MAX_REQUEST_BODY_LENGTH) return reply.send(new TooLongError("Request body", CONFIG.MAX_REQUEST_BODY_LENGTH))
        const body = JSON.parse(request.body);
        if (!validateProperty(body, "uuid", "string", { minLength: 1, maxLength: CONFIG.MAX_UUID_LENGTH })) return reply.send(new FormatError("body.uuid"))     

        const world = await worlds.findOne({ "legitidevs.comments.uuid": body.uuid });
        if (!world) return reply.send(new NotFoundError(`Comment ${body.uuid}`));

        const comment = world.legitidevs.comments.find((comment) => comment.uuid === body.uuid)
        if (!(await isValidSession(request.headers["session-token"], comment.profile_uuid))) return reply.send(new UnauthorizedError())
        // Passed authorization checks.
        // Passed data checks.
        await worlds.updateOne(
            { "legitidevs.comments": { $elemMatch: { uuid: body.uuid } } },
            { $pull: { "legitidevs.comments": { uuid: body.uuid } } }
        );

        return { edit: { removed_uuid: body.uuid } }
    })
}
