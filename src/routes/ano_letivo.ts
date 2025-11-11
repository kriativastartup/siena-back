import express from 'express';
import { createAnoLetivo, deleteAnoLetivo, getAlunoLetivoById, getAnosLetivos, updateAnoLetivo } from '../controllers/ano_letivo';
import { get } from 'node:https';

const router = express.Router();
router.post('/add', createAnoLetivo);
router.get('/all/:escola_id', getAnosLetivos);
router.get('/each/:anoId', getAlunoLetivoById);
router.put('/edit/:anoId', updateAnoLetivo);
router.delete('/delete/:anoId', deleteAnoLetivo);
export default router;