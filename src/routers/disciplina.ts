import express from 'express';
import * as controllers from '../controllers/disciplina';
import * as dto from '../services/disciplinas/dto/disciplina.dto';
import { validate } from '../middleware/zod_validate';
import * as authorization from '../middleware/authorized';

const router = express.Router();

router.post('/add', authorization.verifyAuthenticationMasterSchool, validate(dto.criarDisciplinaSchema), controllers.criarDisciplina);
router.get('/each/:disciplina_id', authorization.verifyAuthentication, controllers.getDisciplinaById);
router.put('/update/:disciplina_id', authorization.verifyAuthenticationMasterSchool, validate(dto.atualizarDisciplinaSchema), controllers.updateDisciplina);
router.get('/all/:escola_id', authorization.verifyAuthentication, controllers.getAllDisciplinasDeUmaEscola);

export default router;