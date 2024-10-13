import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    req.isAuthenticated = false;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
