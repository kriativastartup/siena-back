import express from 'express';

const router = express.Router();

import { getEscolas, createEscola, getEscolaById, updateEscola, deleteEscola } from '../controllers/escolas';

router.post('/create', createEscola);
router.get('/all', getEscolas);
router.get('/each/:schoolId', getEscolaById);
router.put('/update/:schoolId', updateEscola);
router.delete('/delete/:schoolId', deleteEscola);

export default router;