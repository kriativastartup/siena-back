import express from 'express';
import { deleteMatricula, getAllMatriculas, getMatriculaById, MatricularALuno } from '../controllers/matricula';

const router = express.Router();

router.post('/create', MatricularALuno);
router.get('/all', getAllMatriculas);
router.get('/each/:matriculaId', getMatriculaById);
router.delete('/delete/:matriculaId', deleteMatricula);

export default router;