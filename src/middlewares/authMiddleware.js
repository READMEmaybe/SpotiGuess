import jwt from 'jsonwebtoken';
import { createToken, login } from '../controllers/authController.js';
import { getUserData, refreshAccessToken } from '../services/spotifyServices.js';


const checkAuth = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.isAuthenticated = false;
    return next();
  }

  try {
    console.log('URL: ', `${req.protocol}://${req.get('host')}${req.originalUrl}`);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('decoded: ', decoded);
    if (!decoded) {
      req.isAuthenticated = false;
      return next();
    }
    const currentTime = Math.floor(Date.now() / 1000);
    // check if token is expired
    if (decoded.iat + 3600 < currentTime) {
    // if expired, refresh token
      try {
          // if refresh token succeeds, create new jwt and replace the cookie and set req.isAuthenticated to true
          const tokenData = await refreshAccessToken(decoded.refreshToken);
          console.log('refresh tokenData: ', tokenData);
          if (tokenData.error) {
            // try to login and redirect back to client
            process.env.CLIENT_URL = `${req.protocol}://${req.get('host')}${req.originalUrl}`
            print('process.env.CLIENT_URL: ', process.env.CLIENT_URL);
            login(req, res);
          }
          const userData = await getUserData(tokenData.access_token);
          const newToken = createToken(userData, tokenData);
          res.cookie('token', newToken, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
          });
          req.user = {
            id: userData.id,
            displayName: userData.display_name,
            email: userData.email,
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
          };
          req.isAuthenticated = true;
          return next();
      } catch (error) {
        // if refresh token fails, return as not authenticated
        console.log('error: ', error);
        req.isAuthenticated = false;
        return next();
      }
    }
    req.user = decoded;
    req.isAuthenticated = true;
    next();
	// eslint-disable-next-line no-unused-vars
  } catch (error) {
    req.isAuthenticated = false;
    next();
  }
};


export {
	  checkAuth,
};
