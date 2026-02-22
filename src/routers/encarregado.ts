import express from 'express';
import * as controller from '../controllers/encarregado';
import { verifyAuthentication } from '../middleware/authorized';
const router = express.Router();

router.post('/create', controller.createEncarregado);
router.get('/each/:encarregado_id', verifyAuthentication, controller.getEncarregadoById);
router.get('/me', verifyAuthentication, controller.getEncarregadoMe);
router.put('/update/:encarregado_id', verifyAuthentication, controller.updateEncarregado);

export default router;