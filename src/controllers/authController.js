import jwt from 'jsonwebtoken';
import { getAccessToken, getSpotifyAuthUrl, getUserData } from '../services/spotifyServices.js';

const login = (req, res) => {
	const authUrl = getSpotifyAuthUrl();
	res.redirect(authUrl);
}

const callback = async(req, res) => {
	const code = req.query.code;
	try {
		const tokenData = await getAccessToken(code);
		const userData = await getUserData(tokenData.access_token);
		const token = jwt.sign({
			id: userData.id,
			displayName: userData.display_name,
			email: userData.email,
			accessToken: tokenData.access_token,
			refreshToken: tokenData.refresh_token,
		}, process.env.JWT_SECRET, { expiresIn: '7d' });

		res.cookie('token', token, { httpOnly: true });

		res.json({
			status: 'success',
			message: 'User logged in successfully',
			data: {
				token,
				user: {
					id: userData.id,
					displayName: userData.display_name,
					email: userData.email,
					profileImage: userData.images[0].url,
				},
			},
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'failed to log in with Spotify: ' + error.message,
		});
	}
}

export {
	login,
	callback,
}