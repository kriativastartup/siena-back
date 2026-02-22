import express from 'express';
import * as controller from '../controllers/admin';
import { create_super_user } from '../controllers/admin';
import { verifyAuthenticationAdmin, verifyAuthenticationSuperAdmin } from '../middleware/authorized';

const router = express.Router();

create_super_user();


/*router.post('/administration/create', verifyAuthenticationSuperAdmin, controller.criarAdministracao); // apenas o super admin
router.get('/administration/all', verifyAuthenticationSuperAdmin, controller.getAdministracoes); // apenas o super admin
router.put('/administration/update/:admin_id', verifyAuthenticationAdmin, controller.updateAdministracao);
router.delete('/administration/delete/:admin_id', verifyAuthenticationSuperAdmin, controller.deleteAdministracao); // apenas o super admin

router.post('/discipline/create', verifyAuthenticationAdmin, controller.criarDisciplina);
router.get('/discipline/all/:escola_id', verifyAuthenticationAdmin, controller.getDisciplinas);
router.get("/discipline/each/:disciplina_id", verifyAuthenticationAdmin, controller.getDisciplinaById);
router.put('/discipline/update/:disciplina_id', verifyAuthenticationAdmin, controller.updateDisciplina);
router.delete('/discipline/delete/:disciplina_id', verifyAuthenticationAdmin, controller.deleteDisciplina);
*/
export default router;
