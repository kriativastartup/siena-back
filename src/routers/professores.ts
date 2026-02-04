import express from 'express';

const router = express.Router();

import { getProfessores, createProfessor, getProfessorById, updateProfessor, deleteProfessor, InserirProfessorNaTurma, createAvaliacao } from '../controllers/professores';
import { verifyAuthentication, verifyAuthenticationAdmin, verifyAuthenticationAdminSchool } from '../middleware/authorized';


router.get('/all/:escola_id', verifyAuthentication, getProfessores);
router.get('/each/:usuarioId', verifyAuthentication, getProfessorById);
router.post('/create', verifyAuthenticationAdminSchool, createProfessor);
router.put('/update/:usuarioId', verifyAuthenticationAdminSchool, updateProfessor);
router.delete('/delete/:usuarioId', verifyAuthenticationAdminSchool, deleteProfessor);

// Rotas para gerenciar a associação de professores às turmas
router.post('/class/insert', verifyAuthenticationAdminSchool, InserirProfessorNaTurma);
router.delete('/class/remove/:professorTurmaId', verifyAuthenticationAdminSchool, deleteProfessor);

// Rotas para avalicoes e provas
router.post("/evaluation/create", createAvaliacao);

export default router;