"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { CONFIG } from "../../util/config.js";
import { TooLongError, WrongTypeError, DeniedWorldAccessError, WorldNotFoundError, MissingPropertyError, JSONSyntaxError, UnauthorizedError, FormatError } from "../../util/errors.js";
import { generateRefreshToken, generateSessionToken, getProfileData, hashToken, isValidRefreshToken, isValidSession, rehyphenateUUID, shortenUUID, timeFromNow, validateProperty, wrapper } from "../../util/utils.js";

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const profiles = mongoclient.db(DB).collection("profiles");

/**
 * 
 * @param {import("fastify").FastifyInstance} fastify  
 */
export default async function (fastify, opts) {
    fastify.post("/login", async function (request, reply) {
        if (request.body >= CONFIG.MAX_REQUEST_BODY_LENGTH) return reply.send(new TooLongError("Request body", CONFIG.MAX_REQUEST_BODY_LENGTH))

        const body = JSON.parse(request.body);

        if (!validateProperty(body, "access_token", "string", { maxLength: CONFIG.MAX_ACCESS_TOKEN_LENGTH })) return reply.send(new FormatError("body.access_token"))

        const profile_data = await getProfileData(body.access_token);

        if (profile_data.error) return reply.send(new FormatError("body.access_token"))

        // Passed checks.

        const sessionToken = generateSessionToken();
        const refreshToken = generateRefreshToken();

        await profiles.updateOne(
					{ uuid: profile_data.id },
					{
						$set: {
							"authorization.sessionToken": {
								token: hashToken(sessionToken),
								expires_at: timeFromNow(CONFIG.SESSION_TOKEN_VALID_TIME),
							},
							"authorization.refreshToken": {
								token: hashToken(refreshToken),
								expires_at: timeFromNow(CONFIG.REFRESH_TOKEN_VALID_TIME),
							}
						},
					},
					{ upsert: true }
				);

        return { sessionToken: sessionToken, refreshToken: refreshToken, profile_uuid: rehyphenateUUID(profile_data.id), refreshTokenExpiresAt: timeFromNow(CONFIG.REFRESH_TOKEN_VALID_TIME) }
    });

    fastify.post("/check-session", async function (request, reply) {
        if (!validateProperty(request.headers, "session-token", "string", { maxLength: CONFIG.MAX_SESSION_TOKEN_LENGTH })) return reply.send(new FormatError("Request header 'Session-Token'"))
        if (request.body >= CONFIG.MAX_REQUEST_BODY_LENGTH) return reply.send(new TooLongError("Request body", CONFIG.MAX_REQUEST_BODY_LENGTH))

        const body = JSON.parse(request.body);
        if (!validateProperty(body, "profile_uuid", "string", { maxLength: CONFIG.MAX_UUID_LENGTH })) return reply.send(new FormatError("body.profile_uuid"))
        
        // Passed checks.

        const success = await isValidSession(request.headers["session-token"], body.profile_uuid)
        return wrapper.boolean(success)
    })

    fastify.post("/refresh", async function (request, reply) {
        if (!validateProperty(request.headers, "refresh-token", "string", { maxLength: CONFIG.MAX_REFRESH_TOKEN_LENGTH })) return reply.send(new FormatError("Request header 'Refresh-Token'"))
        if (request.body >= CONFIG.MAX_REQUEST_BODY_LENGTH) return reply.send(new TooLongError("Request body", CONFIG.MAX_REQUEST_BODY_LENGTH))

        const body = JSON.parse(request.body);
        if (!validateProperty(body, "profile_uuid", "string", { maxLength: CONFIG.MAX_UUID_LENGTH })) return reply.send(new FormatError("body.profile_uuid"))
        if (!(await isValidRefreshToken(request.headers["refresh-token"], body.profile_uuid))) return reply.send(new UnauthorizedError())
        
        // Passed checks.

        const sessionToken = generateSessionToken();
        const refreshToken = generateRefreshToken();

        await profiles.updateOne(
					{ uuid: shortenUUID(body.profile_uuid) },
					{
						$set: {
							"authorization.sessionToken": {
								token: hashToken(sessionToken),
								expires_at: timeFromNow(CONFIG.SESSION_TOKEN_VALID_TIME),
							},
							"authorization.refreshToken": {
								token: hashToken(refreshToken),
								expires_at: timeFromNow(CONFIG.REFRESH_TOKEN_VALID_TIME),
							}
						},
					},
					{ upsert: true }
				);

        return { sessionToken: sessionToken, refreshToken: refreshToken }
    })
}
