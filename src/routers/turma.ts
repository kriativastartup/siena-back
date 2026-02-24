import express from 'express';
import * as Controller from '../controllers/turma';

const router = express.Router();

router.post('/create', Controller.createTurma);
router.get('/all/:escola_id', Controller.getTurmas);
router.get('/each/:turma_id', Controller.getTurmaById);
router.put('/update/:turma_id', Controller.updateTurmaId);
//router.delete('/delete/:turma_id', Controller.deleteTurmaId);

export default router;