export const getProfileData = async (access_token) => {
	const profile_res = await fetch("https://mc-auth.com/api/v2/profile", {
		headers: {
			Authorization: `Bearer ${access_token}`,
		},
	});
	const profile_data = await profile_res.json();
	return profile_data;
};
