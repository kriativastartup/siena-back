import express from 'express';
const router = express.Router();

import * as controller from '../controllers/escolas';
import * as autho from '../middleware/authorized';
import { validate } from '../middleware/zod_validate';
import * as dto from "../services/escolas/dto/escola.dto";

router.post('/create', autho.verifyAuthenticationSuperAdmin, validate(dto.CreateEscolaSchema), controller.createEscola);
router.get('/all', autho.verifyAuthentication, controller.getEscolas);
router.get('/each/:escola_id', autho.verifyAuthentication, controller.getEscolaById);
router.put('/update/:escola_id', autho.verifyAuthenticationSuperAdmin, controller.updateEscola);
router.delete('/delete/:escola_id', autho.verifyAuthenticationSuperAdmin, controller.deleteEscola);
router.put("/update/infra/:escola_id", autho.verifyAuthenticationMasterSchool, validate(dto.CreateInfraEscolaSchema), controller.updateInfra);

export default router;