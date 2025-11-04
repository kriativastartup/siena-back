import express from 'express';

const router = express.Router();

import { getEscolas, createEscola } from '../controllers/escolas';

router.get('/all', getEscolas);
router.post('/create', createEscola);

export default router;