import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
	  res.send('Welcome to SpotiGuess');
});

app.listen(PORT, () => {
	  console.log(`Server is running on PORT ${PORT}`);
});