const getSpotifyAuthUrl = () => {
	const scopes = process.env.SPOTIFY_SCOPES;
	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
	const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
	return url;
}

const getAccessToken = async(code) => {
	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
	const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
	const response = await fetch({
		method: 'POST',
		url: 'https://accounts.spotify.com/api/token',
		params: {
			grant_type: 'authorization_code',
			code,
			redirect_uri: redirectUri,
		},
		headers: {
			Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
		}
	});
	return response.data;
}

const getUserData = async(accessToken) => {
	const response = await fetch({
		method: 'GET',
		url: 'https://api.spotify.com/v1/me',
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});

	return response.data;
}

export { 
	getSpotifyAuthUrl,
	getAccessToken,
	getUserData,
};