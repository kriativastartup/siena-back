import express from 'express';
import { criarAdministracao, criarDisciplina, deleteAdministracao, deleteDisciplina, getAdministracoes, getDisciplinaById, getDisciplinas, updateAdministracao, updateDisciplina } from '../controllers/admin';
import { getAdmiById } from '../controllers/escolas';


const router = express.Router();


router.post('/administration/create', criarAdministracao);
router.get('/administration/all', getAdministracoes);
router.get('/administration/each/:admin_id', getAdmiById);
router.put('/administration/update/:admin_id', updateAdministracao);
router.delete('/administration/delete/:admin_id', deleteAdministracao);

router.post('/discipline/create', criarDisciplina);
router.get('/discipline/all/:escola_id', getDisciplinas);
router.get("/discipline/each/:disciplina_id", getDisciplinaById);
router.put('/discipline/update/:disciplina_id', updateDisciplina);
router.delete('/discipline/delete/:disciplina_id', deleteDisciplina);

export default router;