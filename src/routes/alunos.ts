import express from 'express';

const router = express.Router();

import { getAlunosTurma, createAluno, getAlunoById, updateAluno, deleteAluno } from '../controllers/alunos';

router.get('/all/:turmaId', getAlunosTurma);
router.post('/create', createAluno);
router.get('/each/:usuarioId', getAlunoById);
router.put('/update/:alunoId', updateAluno);
router.delete('/delete/:alunoId', deleteAluno);

export default router;