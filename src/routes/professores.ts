import express from 'express';

const router = express.Router();

import { getProfessores, createProfessor, getProfessorById, updateProfessor, deleteProfessor, InserirProfessorNaTurma } from '../controllers/professores';

router.get('/all/:escola_id', getProfessores);
router.get('/each/:usuarioId', getProfessorById);
router.post('/create', createProfessor);
router.put('/update/:usuarioId', updateProfessor);
router.delete('/delete/:usuarioId', deleteProfessor);
router.post('/class/insert', InserirProfessorNaTurma);

export default router;