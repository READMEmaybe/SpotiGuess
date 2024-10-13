import express from 'express';
import { login, callback, logout, getUserInfo } from '../controllers/authController.js';
import { checkAuth } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/logout', checkAuth, logout);
router.get('/user', checkAuth, getUserInfo);

export default router;
