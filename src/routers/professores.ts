import express from 'express';

const router = express.Router();

import * as controller from '../controllers/professores';
import { verifyAuthentication, verifyAuthenticationAdmin, verifyAuthenticationAdminSchool } from '../middleware/authorized';


router.get('/all/:escola_id', verifyAuthentication, controller.createProfessor);
router.get('/each/:usuarioId', verifyAuthentication, controller.getProfessorById);
router.post('/create', verifyAuthenticationAdminSchool, controller.createProfessor);
router.put('/update/:professor_id', verifyAuthenticationAdminSchool, controller.updateProfessor);
//router.delete('/delete/:usuarioId', verifyAuthenticationAdminSchool, controller.deleteProfessor);

// Rotas para gerenciar a associação de professores às turmas
//router.post('/class/insert', verifyAuthenticationAdminSchool, controller.InserirProfessorNaTurma);
//router.delete('/class/remove/:professorTurmaId', verifyAuthenticationAdminSchool, controller.deleteProfessor);
// Rotas para avalicoes e provas
//router.post("/evaluation/create", createAvaliacao);

export default router;