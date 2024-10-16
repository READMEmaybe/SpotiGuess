import { v4 as uuidv4 } from 'uuid';

const games = new Map();
const userSocketMap = new Map();

function handleSocketConnection(io) {
	io.on('connection', (socket) => {
		console.log('a user connected, socket id:', socket.id);

		socket.on('disconnect', () => {
			console.log('user disconnected, socket id:', socket.id);
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
}

export {
	handleSocketConnection,
};
