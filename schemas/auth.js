import { z } from "zod/v4";
import { CONFIG } from "../util/config.js";

export const SessionTokenSchema = z.string().min(CONFIG.SESSION_TOKEN_LENGTH).max(CONFIG.MAX_SESSION_TOKEN_LENGTH)
export const RefreshTokenSchema = z.string().min(CONFIG.REFRESH_TOKEN_LENGTH).max(CONFIG.MAX_REFRESH_TOKEN_LENGTH)