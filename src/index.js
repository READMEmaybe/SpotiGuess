import express from 'express';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/auth', authRouter);
app.get('/', (req, res) => {
	 res.send('Welcome to SpotiGuess');
});

app.listen(PORT, () => {
	  console.log(`Server is running on PORT ${PORT}`);
});
