import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import cookieParser from 'cookie-parser';
import { checkAuth } from './middlewares/authMiddleware.js';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server);

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

const games = new Map();
const userSocketMap = new Map();

io.on('connection', (socket) => {
	console.log('a user connected');

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});

	socket.on('auth', (userId) => {
		userSocketMap.set(userId, socket.id);
		socket.userId = userId;
	});

	socket.on('create-game', () => {
		if (!socket.userId) {
			return;
		}
		const gameId = uuidv4(); 
		games.set(gameId, { players: [socket.userId] });
		socket.join(gameId);
		socket.emit('game-created', { gameId });
	});

	socket.on('join-game', (gameId) => {
		if (!socket.userId) {
			return;
		}
		const game = games.get(gameId);
		if (!game) {
			socket.emit('game-not-found');
			return;
		}
		game.players.push(socket.userId);
		socket.join(gameId);
		io.to(gameId).emit('game-joined', { gameId });
	});
});

server.listen(PORT, () => {
	  console.log(`Server is running on PORT ${PORT}`);
});
