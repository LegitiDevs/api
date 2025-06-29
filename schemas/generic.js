import { z } from "zod/v4";
import { CONFIG } from "../util/config.js";

export const StringifiedJsonSchema = z.string().max(CONFIG.MAX_REQUEST_BODY_LENGTH).transform((str, ctx) => {
	try {
		return JSON.parse(str);
	} catch (err) {
		ctx.addIssue({
			code: "custom",
			message: err.message,
		});
		return z.NEVER;
	}
});

export const nonEmptyObject = (shape) => z.object(shape).refine((obj) => Object.keys(obj).length > 0, { message: "Required at least one field" })