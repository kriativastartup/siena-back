import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import escolaRouter from './routers/escola';
import professoresRouter from './routers/professores';
import authRouter from './routers/auth';
import studentRouter from './routers/alunos';
import matriculaRouter from './routers/matricula';
import turmaRouter from './routers/turma';
import anoLetivoRouter from './routers/ano_letivo';
import encarregadoRouter from './routers/encarregado';
import adminRouter from './routers/admin';
import regiaoRouter from './routers/regiao';
import feedbackRouter from './routers/feedback';
import  funcionario  from './routers/funcionario';
import curso from './routers/curso';

import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi/document";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: ['http://localhost:3000', 'https://siena-xi.vercel.app', 'http://192.168.0.113:3000', '*'],
    methods: ["GET", "POST", "DELETE", "PUT"]
}));

// Sample route
app.get('/', (req: any, res: any) => {
    res.send('Hello, World!');
});

app.use('/api/v1/school', escolaRouter);
app.use('/api/v1/teacher', professoresRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/registration', matriculaRouter);
app.use('/api/v1/course', curso);
app.use('/api/v1/class', turmaRouter);
//app.use('/api/v1/year', anoLetivoRouter);
app.use('/api/v1/guardian', encarregadoRouter);
//app.use('/api/v1/admin', adminRouter);
//app.use('/api/v1/region', regiaoRouter);
app.use('/api/v1/feedback', feedbackRouter);
app.use('/api/v1/employee', funcionario);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
