import { randomBytes,createHash } from 'crypto'
import { CONFIG } from './config.js';
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI;
const DB = process.env.DB;
const mongoclient = new MongoClient(MONGO_URI);

const profiles = mongoclient.db(DB).collection("profiles");

// ----------------------------------------------------------------------
// ---------- GET REQUESTS FOR WORLD DATA UTILITY FUNCTIONS -------------
// ----------------------------------------------------------------------

const SORTING_METHOD_LOOKUP = {
	ascending: {
		default: { locked: -1, player_count: -1, votes: -1 }, // Online worlds first sorted by player count, then votes
		votes: { votes: -1 },
		visits: { visits: -1 },
		recently_scraped: { last_scraped: -1 },
		recently_created: { creation_date_unix_seconds: -1 },
	},
	descending: {
		default: { locked: 1, player_count: 1, votes: 1 }, // Online worlds first sorted by player count, then votes
		votes: { votes: 1 },
		visits: { visits: 1 },
		recently_scraped: { last_scraped: 1 },
		recently_created: { creation_date_unix_seconds: 1 },
	},
};

export const defaultFilter = {
	$or: [
		{ "legitidevs.unlisted": false },
		{ "legitidevs.unlisted": { $exists: false } },
	],
};

export const parseSortDirection = (sortDirection) => {
	if (sortDirection !== "ascending" && sortDirection !== "descending") return -1
	return sortDirection === "ascending" ? -1 : 1
}

export const parseSortingMethod = (sortMethod, direction) => {
	const { ascending } = SORTING_METHOD_LOOKUP;
	const directionLookup = SORTING_METHOD_LOOKUP[direction] || ascending;
	return directionLookup[sortMethod] || directionLookup.default;
};

export const deRegexifyTheRegexSoTheUserDoesntDoMaliciousThings = (input) =>
	input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ---------------------------------------------------------------------
// ---------- PROFILES AND AUTHORIZATION UTILITY FUNCTIONS -------------
// ---------------------------------------------------------------------

export const generateSessionToken = () => randomBytes(CONFIG.SESSION_TOKEN_LENGTH).toString("hex");
export const generateRefreshToken = () => randomBytes(CONFIG.REFRESH_TOKEN_LENGTH).toString("hex");
export const hashToken = (token) => createHash("sha256").update(token).digest('hex')

export const getProfileData = async (access_token) => {
	const profile_res = await fetch("https://mc-auth.com/api/v2/profile", {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
	const profile_data = await profile_res.json();
	return profile_data;
};

export const rehyphenateUUID = (uuid) => {
	return uuid.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");
};

export const shortenUUID = (uuid) => uuid.replaceAll("-","");

/**
 * Checks if the session token of the provided profile is expired.
 * @returns {Promise<boolean>}
 */
export const isSessionTokenExpired = async (profile_uuid) => {
	const profile = await profiles.findOne({ uuid: shortenUUID(profile_uuid) });
	if (!profile) return true;
	if (!profile.authorization.sessionToken) return true;
	if (Date.now() / 1000 > profile.authorization.sessionToken.expires_at) return true;
	return false; 
}

/**
 * Checks if the refresh token of the provided profile is expired.
 * @returns {Promise<boolean>}
 */
export const isRefreshTokenExpired = async (profile_uuid) => {
	const profile = await profiles.findOne({ uuid: shortenUUID(profile_uuid) });
	if (!profile) return true;
	if (!profile.authorization.refreshToken) return true;
	if (Date.now() / 1000 > profile.authorization.refreshToken.expires_at) return true;
	return false;
};

/**
 * Compares the session tokens of the provided profile uuid and the provided session token to check if the user has a valid session.
 * @param {string} sessionToken The session token provided by the client.
 * @param {string} profile_uuid The profile uuid provided by the client. 
 * @returns {Promise<boolean>}
 */
export const isValidSession = async (sessionToken, profile_uuid) => {
	const profile = await profiles.findOne({ uuid: shortenUUID(profile_uuid) })
	if (!profile) return false
	if (!profile.authorization.sessionToken) return false
	if (Date.now() / 1000 > profile.authorization.sessionToken.expires_at) return false;
	return hashToken(sessionToken) === profile.authorization.sessionToken.token
}

/**
 * Compares the refresh tokens of the provided profile uuid and the provided refresh token to check if the user has a valid refresh token.
 * @param {string} sessionToken The refresh token provided by the client.
 * @param {string} profile_uuid The profile uuid provided by the client. 
 * @returns {Promise<boolean>}
 */
export const isValidRefreshToken = async (refreshToken, profile_uuid) => {
	const profile = await profiles.findOne({ uuid: shortenUUID(profile_uuid) });
	if (!profile) return false;
	if (!profile.authorization.refreshToken.token) return false;
	if (Date.now() / 1000 > profile.authorization.refreshToken.expires_at) return true;
	return hashToken(refreshToken) === profile.authorization.refreshToken.token;
};
// -------------------------------------------------------
// ---------- DATA SENDING UTILITY FUNCTIONS -------------
// -------------------------------------------------------

export const wrapper = {
	boolean: (boolean) => ({ success: boolean })
}

// ------------------------------------------------
// ---------- MISC. UTILITY FUNCTIONS -------------
// ------------------------------------------------

export const timeFromNow = (seconds) => Math.floor(Date.now() / 1000 + seconds)

export const validateProperty = (object, name, type, opts = {}) => {
	if (object?.[name] === null) return false
	if (typeof object[name] !== type) return false
	
	switch (typeof object[name]) {
		case "string":
			if (!opts?.maxLength) break;
			if (object[name].length > opts.maxLength) return false
			if (!opts?.minLength) break;
			if (object[name].length < opts.minLength) return false
			break;
	}

	return true
}