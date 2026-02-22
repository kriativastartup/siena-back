import express from 'express';
import { verifyAuthentication } from '../middleware/authorized';
const router = express.Router();
import { validate } from "../middleware/zod_validate";

import * as controller from '../controllers/alunos';
import * as dto from '../services/alunos/dto/alunos.dto';

router.get('/all/:turma_id',  controller.getAlunosTurma);
router.post('/create', validate(dto.CreateAlunoSchema), controller.createAluno);
router.get('/each/:aluno_id', controller.getAlunoById);
router.get('/me', verifyAuthentication, controller.getAlunoByMe);
router.put('/update/:aluno_id', validate(dto.UpdateAlunoSchema), controller.updateAluno);
router.delete('/delete/:aluno_id', controller.deleteAluno);

export default router;