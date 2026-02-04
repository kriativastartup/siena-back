import express from 'express';
import { createTurma, deleteTurmaId, getTurmaById, getTurmas, updateTurmaId } from '../controllers/turma';

const router = express.Router();

router.post('/create', createTurma);
router.get('/all/:escola_id', getTurmas);
router.get('/each/:turmaId', getTurmaById);
router.put('/update/:turmaId', updateTurmaId);
router.delete('/delete/:turmaId', deleteTurmaId);

export default router;