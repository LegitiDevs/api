import { z } from "zod";
import { CONFIG } from "../util/config.js";

export const SessionTokenSchema = z.string().length(CONFIG.SESSION_TOKEN_LENGTH)
export const RefreshTokenSchema = z.string().length(CONFIG.REFRESH_TOKEN_LENGTH)