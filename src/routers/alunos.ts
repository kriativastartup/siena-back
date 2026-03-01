import express from 'express';
const router = express.Router();
import { validate } from "../middleware/zod_validate";

import * as controller from '../controllers/alunos';
import * as dto from '../services/alunos/dto/alunos.dto';
import * as authorization from '../middleware/authorized';

router.get('/all/:turma_id', authorization.verifyAuthentication, controller.getAlunosTurma);
router.post('/create', authorization.verifyAuthenticationSchool, validate(dto.CreateAlunoSchema), controller.createAluno);
router.get('/each/:aluno_id', authorization.verifyAuthentication, controller.getAlunoById);
router.get('/me', authorization.verifyAuthentication, controller.getAlunoByMe);
router.put('/update/:aluno_id', authorization.verifyAuthenticationSchool, validate(dto.UpdateAlunoSchema), controller.updateAluno);
router.delete('/delete/:aluno_id', authorization.verifyAuthenticationSchool, controller.deleteAluno);

export default router;