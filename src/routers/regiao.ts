import express from 'express';


const router = express.Router();

import { criarRegiao, deleteRegiao, getRegioes, getRegiaoById, updateRegiao, assignRegiaoToEscola,unassignRegiaoFromEscola } from '../controllers/regiao';
import { verifyAuthenticationSuperAdmin } from '../middleware/authorized';


router.post('/create', verifyAuthenticationSuperAdmin, criarRegiao);
router.get('/all',  getRegioes);
router.get('/each/:regiao_id', getRegiaoById);
router.put('/update/:regiao_id', verifyAuthenticationSuperAdmin, updateRegiao);
router.delete('/delete/:regiao_id', verifyAuthenticationSuperAdmin, deleteRegiao);

router.post('/assign', verifyAuthenticationSuperAdmin, assignRegiaoToEscola);
router.post('/unassign', verifyAuthenticationSuperAdmin, unassignRegiaoFromEscola);

export default router;