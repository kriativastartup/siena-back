import express from 'express';
import * as controller from '../controllers/admin';
import { create_super_user } from '../controllers/admin';
import { verifyAuthenticationMasterSchool, verifyAuthenticationSuperAdmin } from '../middleware/authorized';

const router = express.Router();

create_super_user();


/*router.post('/administration/create', verifyAuthenticationSuperAdmin, controller.criarAdministracao); // apenas o super admin
router.get('/administration/all', verifyAuthenticationSuperAdmin, controller.getAdministracoes); // apenas o super admin
router.put('/administration/update/:admin_id', verifyAuthenticationMasterSchool, controller.updateAdministracao);
router.delete('/administration/delete/:admin_id', verifyAuthenticationSuperAdmin, controller.deleteAdministracao); // apenas o super admin

router.post('/discipline/create', verifyAuthenticationMasterSchool, controller.criarDisciplina);
router.get('/discipline/all/:escola_id', verifyAuthenticationMasterSchool, controller.getDisciplinas);
router.get("/discipline/each/:disciplina_id", verifyAuthenticationMasterSchool, controller.getDisciplinaById);
router.put('/discipline/update/:disciplina_id', verifyAuthenticationMasterSchool, controller.updateDisciplina);
router.delete('/discipline/delete/:disciplina_id', verifyAuthenticationMasterSchool, controller.deleteDisciplina);
*/
export default router;
