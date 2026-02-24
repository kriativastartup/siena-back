import express from 'express';
import * as controller from '../controllers/ano_letivo';
import { get } from 'node:https';

const router = express.Router();
router.post('/add', controller.createAnoLetivo);
router.get('/all/:escola_id', controller.getAnosLetivos);
router.get('/each/:ano_id', controller.getAnoLetivoById);
router.put('/edit/:ano_id', controller.updateAnoLetivo);
//router.delete('/delete/:ano_id', controller.deleteAnoLetivo);
export default router;