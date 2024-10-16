const getLyricAcessToken = async () => {
	const response = await fetch('https://open.spotify.com/get_access_token?reason=transport&productType=web_player', {
		method: 'GET',
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36',
			'App-Platform': 'WebPlayer',
			'content-type': 'text/html; charset=utf-8',
			'cookie': 'sp_dc=' + process.env.SP_DC + '; sp_key=' + process.env.SP_KEY,
		}
	});
	return response.json();
}

const getLyric = async (accessToken, trackId) => {
	const response = await fetch(`https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&market=from_token`, {
		method: 'GET',
		headers: {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36',
			'App-Platform': 'WebPlayer',
			'Authorization': `Bearer ${accessToken}`,
		},
	});
	return response.json();
}
	

export { 
	getLyricAcessToken,
	getLyric,
};