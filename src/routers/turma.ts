import express from 'express';
import * as Controller from '../controllers/turma';
import * as dto from '../services/turmas/dto/turma.dto';
import { validate } from '../middleware/zod_validate';
import * as Authorizarion from '../middleware/authorized';

const router = express.Router();

router.post('/create', Authorizarion.verifyAuthenticationSchool, validate(dto.createTurmaSchema),  Controller.createTurma);
router.get('/all/:escola_id', Authorizarion.verifyAuthentication, Controller.getTurmas);
router.get('/each/:turma_id', Authorizarion.verifyAuthentication, Controller.getTurmaById);
router.put('/update/:turma_id', Authorizarion.verifyAuthenticationSchool, validate(dto.updateTurmaSchema), Controller.updateTurmaId);
//router.delete('/delete/:turma_id', Controller.deleteTurmaId);

export default router;