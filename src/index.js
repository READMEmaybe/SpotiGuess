import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';
import { checkAuth } from './middlewares/authMiddleware.js';
import http from 'http';
import { Server } from 'socket.io';
import { handleSocketConnection } from './services/socketServices.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));
// app.use(express.static(join(__dirname, 'public')));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.get('/', checkAuth, (req, res) => {
	if (req.isAuthenticated) {
		res.sendFile(join(__dirname, 'public', 'logged.html'));
	} else {
		res.sendFile(join(__dirname, 'public', 'index.html'));
	}
});

handleSocketConnection(io);

server.listen(PORT, () => {
	  console.log(`Server is running on PORT ${PORT}`);
});
