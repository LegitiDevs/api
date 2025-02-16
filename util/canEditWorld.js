import { getProfileData } from "./getProfileData.js";
import { rehyphenateUUID } from "./rehyphenateUUID.js";

export const canEditWorld = async (authorization_header, world_owner_uuid) => {
	if (!authorization_header) return false
    const access_token = authorization_header.split(" ")[1];

	const profile_data = await getProfileData(access_token);

	if (profile_data.error) return false
    return world_owner_uuid == rehyphenateUUID(profile_data.id);
};
