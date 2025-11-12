import express from 'express';
import { createEncarregado, getEncarregados } from '../controllers/encarregado';

const router = express.Router();

router.post('/create', createEncarregado);
router.get('/all/:escola_id', getEncarregados);

export default router;