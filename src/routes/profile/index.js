// @ts-nocheck

"use strict";
import "dotenv/config";
import { MongoClient } from "mongodb";
import { CONFIG } from "#util/config.js";
import { TooLongError, UnauthorizedError, FormatError } from "#util/errors.js";
import { generateRefreshToken, generateSessionToken, getProfileData, hashToken, isValidRefreshToken, isValidSession, rehyphenateUUID, shortenUUID, timeFromNow, validateProperty, wrapper } from "#util/utils.js";

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
        return reply.code(410).send({'_message': 'Profiles are now disabled and being phased out.'});
    });

    fastify.post("/check-session", async function (request, reply) {
        return reply.code(410).send({'_message': 'Profiles are now disabled and being phased out.'});
    })

    fastify.post("/refresh", async function (request, reply) {
        return reply.code(410).send({'_message': 'Profiles are now disabled and being phased out.'});
    })
}
