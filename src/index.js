import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';
import { checkAuth } from './middlewares/authMiddleware.js';
import path from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.get('/', checkAuth, (req, res) => {
	if (req.isAuthenticated) {
		res.sendFile(path.join(process.cwd(), 'public', 'logged.html'));
	} else {
		res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
	}
});

app.listen(PORT, () => {
	  console.log(`Server is running on PORT ${PORT}`);
});
