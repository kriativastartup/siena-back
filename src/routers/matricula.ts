import express from 'express';
import * as controller from '../controllers/matricula';
import * as Authorizarion from '../middleware/authorized';
import { validate } from '../middleware/zod_validate';
import * as dto from '../services/matriculas/dto/matricula.dto';

const router = express.Router();

router.post('/create', Authorizarion.verifyAuthenticationSchool, validate(dto.createMatriculaSchema), controller.MatricularALuno);
router.get('/all/:escola_id/:ano_letivo', Authorizarion.verifyAuthentication, controller.getAllMatriculas);
router.get('/each/:matricula_id', Authorizarion.verifyAuthentication, controller.getMatriculaById);
router.put('/update/:matricula_id', Authorizarion.verifyAuthenticationSchool, validate(dto.updateMatriculaSchema), controller.updateMatricula);
router.delete('/delete/:matricula_id', Authorizarion.verifyAuthenticationMasterSchool, controller.deleteMatricula);

export default router;