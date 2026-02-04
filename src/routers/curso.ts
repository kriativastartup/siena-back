import express from 'express';

import { createCurso, getCursoById, updateCurso, deleteCurso, getCursosByEscola, getCursosByProfessor } from '../controllers/curso';
const router = express.Router();

router.post('/create', createCurso);
router.get('/all', getCursosByEscola);
router.get('/each/:cursoId', getCursoById);
router.put('/update/:cursoId', updateCurso);
router.delete('/delete/:cursoId', deleteCurso);

router.get('/by_teacher/:teacherId', getCursosByProfessor);

export default router;