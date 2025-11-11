import express from 'express';
import { createTurma } from '../controllers/turma';

const router = express.Router();

router.post('/create', createTurma);

export default router;