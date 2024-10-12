import express from 'express';
import { login, callback, logout, getUserInfo } from '../controllers/authController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/logout', verifyToken, logout);
router.get('/user', verifyToken, getUserInfo);

export default router;
