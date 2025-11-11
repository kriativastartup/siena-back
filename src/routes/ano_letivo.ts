import express from 'express';
import { createAnoLetivo, getAlunoLetivoById, getAnosLetivos } from '../controllers/ano_letivo';
import { get } from 'node:https';

const router = express.Router();
router.post('/add', createAnoLetivo);
router.get('/all/:escola_id', getAnosLetivos);
router.get('/each/:anoId', getAlunoLetivoById);
export default router;