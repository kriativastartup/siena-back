import express from 'express';
import { createEncarregado, getEncarregadoById, getEncarregadoByME, getEncarregados, updateEncarregadoById } from '../controllers/encarregado';
import { verifyAuthentication } from '../middleware/authorized';
const router = express.Router();

router.post('/create', createEncarregado);
router.get('/all/:escola_id', verifyAuthentication, getEncarregados);
router.get('/each/:usuarioId', verifyAuthentication, getEncarregadoByME);
router.get('/me', verifyAuthentication, getEncarregadoById);
router.put('/update/:usuarioId', verifyAuthentication, updateEncarregadoById);

export default router;