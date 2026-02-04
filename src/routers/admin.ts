import express from 'express';
import { criarAdministracao, criarDisciplina, deleteAdministracao, deleteDisciplina, getAdministracoes, getDisciplinaById, getDisciplinas, updateAdministracao, updateDisciplina } from '../controllers/admin';
import { getAdmiById } from '../controllers/escolas';
import { create_anep_user } from '../controllers/anep';
import { verifyAuthenticationAdmin, verifyAuthenticationSuperAdmin } from '../middleware/authorized';

create_anep_user();
const router = express.Router();


router.post('/administration/create', verifyAuthenticationSuperAdmin, criarAdministracao); // apenas o super admin
router.get('/administration/all', verifyAuthenticationSuperAdmin, getAdministracoes); // apenas o super admin
router.get('/administration/each/:admin_id', verifyAuthenticationAdmin, getAdmiById);
router.put('/administration/update/:admin_id', verifyAuthenticationAdmin, updateAdministracao);
router.delete('/administration/delete/:admin_id', verifyAuthenticationSuperAdmin, deleteAdministracao); // apenas o super admin

router.post('/discipline/create', verifyAuthenticationAdmin, criarDisciplina);
router.get('/discipline/all/:escola_id', verifyAuthenticationAdmin, getDisciplinas);
router.get("/discipline/each/:disciplina_id", verifyAuthenticationAdmin, getDisciplinaById);
router.put('/discipline/update/:disciplina_id', verifyAuthenticationAdmin, updateDisciplina);
router.delete('/discipline/delete/:disciplina_id', verifyAuthenticationAdmin, deleteDisciplina);

export default router;