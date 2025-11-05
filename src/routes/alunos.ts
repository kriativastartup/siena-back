import express from 'express';

const router = express.Router();

import { getAlunos, createAluno } from '../controllers/alunos';

router.get('/all', getAlunos);
router.post('/create', createAluno);

export default router;