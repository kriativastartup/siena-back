import express from 'express';
import { createEncarregado, getEncarregadoById, getEncarregados } from '../controllers/encarregado';

const router = express.Router();

router.post('/create', createEncarregado);
router.get('/all/:escola_id', getEncarregados);
router.get('/each/:encarregadoId', getEncarregadoById);


export default router;