import { z } from "zod/v4";
import { CONFIG } from "../util/config.js";

export const SessionTokenSchema = z.string().length(CONFIG.SESSION_TOKEN_LENGTH).meta({ id: "SessionTokenSchema" })
export const RefreshTokenSchema = z.string().length(CONFIG.REFRESH_TOKEN_LENGTH).meta({ id: "RefreshTokenSchema" })