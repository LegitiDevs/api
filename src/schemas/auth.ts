import { Type } from "@fastify/type-provider-typebox"
import { CONFIG } from "#util/config.js";

export const SessionTokenSchema = Type.String({ min: CONFIG.SESSION_TOKEN_LENGTH, max: CONFIG.MAX_SESSION_TOKEN_LENGTH })
export const RefreshTokenSchema = Type.String({ min: CONFIG.REFRESH_TOKEN_LENGTH, max: CONFIG.MAX_REFRESH_TOKEN_LENGTH })