import express from 'express';
import { deleteMatricula, getAllMatriculas, getMatriculaById, MatricularALuno } from '../controllers/matricula';

const router = express.Router();

router.post('/create', MatricularALuno);
router.get('/all/:escola_id/:ano_letivo', getAllMatriculas);
router.get('/each/:matricula_id', getMatriculaById);
router.delete('/delete/:matricula_id', deleteMatricula);

export default router;