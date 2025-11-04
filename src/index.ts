import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import escolaRouter from './routes/escola';
import professoresRouter from './routes/professores';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Middleware
app.use(bodyParser.json());
app.use(cors());

// Sample route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});


app.use('/api/v1/school', escolaRouter);
app.use('/api/v1/teacher', professoresRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
