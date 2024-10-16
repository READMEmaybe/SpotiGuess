import { getLyricAcessToken, getLyric } from "../services/lyricServices.js";

const getLyrics = async (req, res) => {
	const trackId = req.query.trackId;
	console.log('TrackId: ', trackId);
	try {
		const tokenData = await getLyricAcessToken();
		console.log('Token Data: ', tokenData);
		const lyrics = await getLyric(tokenData.accessToken, trackId);
		console.log('Lyrics: ', lyrics);
		res.json({ lyrics });
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'failed to get lyrics: ' + error.message,
		});
	}
}

export {
	getLyrics,
};