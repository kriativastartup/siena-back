import express from 'express';

import * as controller from '../controllers/curso';
import * as Schema from '../services/cursos/dto/curso.dto';
import * as  Authorizarion from '../middleware/authorized';
import { validate } from '../middleware/zod_validate';
const router = express.Router();

router.post('/create', Authorizarion.verifyAuthenticationMasterSchool, validate(Schema.createCursoSchema), controller.createCurso);
router.get('/all/:escola_id', Authorizarion.verifyAuthentication, controller.getCursosByEscola);
router.get('/each/:curso_id', Authorizarion.verifyAuthentication, controller.getCursoById);
router.put('/update/:curso_id', Authorizarion.verifyAuthenticationMasterSchool, validate(Schema.updateCursoSchema), controller.updateCurso);
router.delete('/delete/:curso_id', Authorizarion.verifyAuthenticationMasterSchool, controller.deleteCurso);

export default router;