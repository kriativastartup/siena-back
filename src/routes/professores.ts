import express from 'express';

const router = express.Router();

import { getProfessores, createProfessor } from '../controllers/professores';

router.get('/all', getProfessores);
router.post('/create', createProfessor);

export default router;