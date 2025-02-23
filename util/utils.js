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

export const getSortingMethod = (sortMethod, direction) => {
	const { ascending } = SORTING_METHOD_LOOKUP;
	const directionLookup = SORTING_METHOD_LOOKUP[direction] || ascending;
	return directionLookup[sortMethod] || directionLookup.default;
};

export const deRegexifyTheRegexSoTheUserDoesntDoMaliciousThings = (input) =>
	input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

export const canEditUserContent = async (authorization_header, profile_uuid) => {
	if (!authorization_header) return false;
	const access_token = authorization_header.split(" ")[1];

	const profile_data = await getProfileData(access_token);

	if (profile_data.error) return false;
	return profile_uuid == rehyphenateUUID(profile_data.id);
};