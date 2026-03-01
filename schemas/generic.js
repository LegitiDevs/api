import { z } from "zod/v4";
import { CONFIG } from "../util/config.js";

export const NoRegexString = z
	.string()
	.transform((str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

export const nonEmptyObject = (shape) => z.object(shape).refine((obj) => Object.keys(obj).length > 0, { message: "Required at least one field" })