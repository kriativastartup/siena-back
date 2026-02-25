import express from 'express';

const router = express.Router();

import * as controller from '../controllers/professores';
import * as Authorization from '../middleware/authorized';
import { validate } from '../middleware/zod_validate';
import * as Schema from '../services/professores/dto/professor.dto';


router.get('/all/:escola_id', Authorization.verifyAuthenticationAdminSchool, controller.getProfessoresByEscola);
router.get('/each/:professor_id', Authorization.verifyAuthentication, controller.getProfessorById);
router.get('/me', Authorization.verifyAuthentication, controller.getMeProfessor);
router.post('/create', Authorization.verifyAuthenticationAdminSchool, validate(Schema.CreateProfessorSchema), controller.createProfessor);
router.put('/update', Authorization.verifyAuthenticationAdminSchool, validate(Schema.UpdateProfessorSchema), controller.updateProfessor);
//router.delete('/delete/:usuarioId', verifyAuthenticationAdminSchool, controller.deleteProfessor);

// Rotas para gerenciar a associação de professores às turmas
//router.post('/class/insert', verifyAuthenticationAdminSchool, controller.InserirProfessorNaTurma);
//router.delete('/class/remove/:professorTurmaId', verifyAuthenticationAdminSchool, controller.deleteProfessor);
// Rotas para avalicoes e provas
//router.post("/evaluation/create", createAvaliacao);

export default router;