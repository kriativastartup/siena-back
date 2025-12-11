import express from 'express';
import { verifyAuthentication } from '../middleware/authorized';
const router = express.Router();

import { getAlunosTurma, createAluno, getAlunoById, updateAluno, deleteAluno, getAlunoByMe, getAlunoByMe } from '../controllers/alunos';

router.get('/all/:turmaId', getAlunosTurma);
router.post('/create', createAluno);
router.get('/each/:usuarioId', getAlunoById);
router.get('/me', verifyAuthentication, getAlunoByMe);
router.put('/update/:usuarioId', updateAluno);
router.delete('/delete/:usuarioId', deleteAluno);

export default router;