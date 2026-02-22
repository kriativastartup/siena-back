import express from 'express';

const router = express.Router();

import * as controller from '../controllers/escolas';
import * as autho from '../middleware/authorized';
import { validate } from '../middleware/zod_validate';
import * as dto from "../services/escolas/dto/escola.dto";

router.post('/create', autho.verifyAuthenticationSuperAdmin, validate(dto.CreateEscolaSchema), controller.createEscola);
router.get('/all', autho.verifyAuthenticationSuperAdmin, controller.getEscolas);
router.get('/each/:schoolId', autho.verifyAuthenticationAdmin, controller.getEscolaById);
router.put('/update/:schoolId', autho.verifyAuthenticationAdmin, controller.updateEscola);
router.delete('/delete/:schoolId', autho.verifyAuthenticationSuperAdmin, controller.deleteEscola);

export default router;