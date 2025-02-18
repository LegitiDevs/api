export const CONFIG = {
    LEGITIDEVS: {
        DESCRIPTION_LENGTH: 600
    }
}

export const RESPONSE_MESSAGES = {
	parse: (error_message, value) => error_message.replace("%s", value),
    200: {
        WORLD_EDIT_SUCCESS: "Edited world."
    },
	400: {
		DENIED_WORLD_ACCESS: `You don't have access to edit this world.`,
		WORLD_NOT_FOUND: `World '%s' does not exist.`,
		BODY_CONTENT_WRONG_TYPE: "Content is not a %s.",
		BODY_CONTENT_NOT_FOUND: "No content.",
		BODY_CONTENT_TOO_LONG: "Content length is above %s.",
	},
};

export const HEADERS = {
    CONTENT_TYPE: {
        NAME: "Content-Type",
        JSON: "application/json; charset=utf-8"
    }
}