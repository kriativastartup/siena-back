import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import escolaRouter from './routes/escola';
import professoresRouter from './routes/professores';
import authRouter from './routes/auth';
import studentRouter from './routes/alunos';
import matriculaRouter from './routes/matricula';
import turmaRouter from './routes/turma';
import anoLetivoRouter from './routes/ano_letivo';
import encarregadoRouter from './routes/encarregado';
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
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/registration', matriculaRouter);
app.use('/api/v1/class', turmaRouter);
app.use('/api/v1/year', anoLetivoRouter);
app.use('/api/v1/guardian', encarregadoRouter);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
