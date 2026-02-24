import express from 'express';

import * as controller from '../controllers/curso';
const router = express.Router();

router.post('/create', controller.createCurso);
router.get('/all/:escola_id', controller.getCursosByEscola);
router.get('/each/:curso_id', controller.getCursoById);
router.put('/update/:curso_id', controller.updateCurso);
router.delete('/delete/:curso_id', controller.deleteCurso);

export default router;