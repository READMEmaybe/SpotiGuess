// import { v4 as uuidv4 } from 'uuid';

const games = new Map();
const userSocketMap = new Map();

function handleSocketConnection(io) {
	io.on('connection', (socket) => {
		console.log('a user connected, socket id:', socket.id);

		socket.on('disconnect', () => {
			console.log('user disconnected, socket id:', socket.id);
		});

		socket.on('auth', (userData) => {
			userSocketMap.set(userData.id, { 'socket': socket.id,
				'name': userData.display_name,
				'profile_image': userData.images[0].url });
			socket.userId = userData.id;
		});

		socket.on('create-game', () => {
			if (!socket.userId) {
				return;
			}
			// const gameId = uuidv4(); 
			// const gameCode = Math.random().toString(36).substring(2, 8).toUpperCase();
			// console.log('GameId:', gameId);
			const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
			games.set(gameId, {
			//	'gameCode': gameCode,
				'players': { [socket.userId]: {
					'name': userSocketMap.get(socket.userId).name,
					'profile_image': userSocketMap.get(socket.userId).profile_image,
					'moderator': true,
					'score': 0,
					'hints': { 'snippet': 2, 'artists': 2, 'quarterName': 2 }
				}},
				'currentRound': 0,
				'gameStatus': 'waiting',
			})
			console.log('Games:', games);
			console.log('Players:', games.get(gameId).players);
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
			if (Object.keys(game.players).length >= 10) {
				socket.emit('game-full');
				return;
			}

			if (game.gameStatus !== 'waiting') {
				socket.emit('game-started');
				return;
			}

			if (game.players[socket.userId]) {
				socket.emit('already-joined');
				return;
			}
			game.players[socket.userId] = {
				'name': userSocketMap.get(socket.userId).name,
				'profile_image': userSocketMap.get(socket.userId).profile_image,
				'moderator': false,
				'score': 0,
				'hints': { 'snippet': 2, 'artists': 2, 'quarterName': 2 }
			};
			socket.join(gameId);
			io.to(gameId).emit('game-joined', { gameId });
			console.log('Players:', games.get(gameId).players);
		});
	});
}

export {
	handleSocketConnection,
};
