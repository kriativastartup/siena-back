import express from 'express';
import { criarDisciplina, deleteDisciplina, getDisciplinaById, getDisciplinas, updateDisciplina } from '../controllers/admin';


const router = express.Router();

router.post('/discipline/create', criarDisciplina);
router.get('/discipline/all/:escola_id', getDisciplinas);
router.get("/discipline/each/:disciplina_id", getDisciplinaById);
router.put('/discipline/update/:disciplina_id', updateDisciplina);
router.delete('/discipline/delete/:disciplina_id', deleteDisciplina);

export default router;