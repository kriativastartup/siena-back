import express from 'express';

const router = express.Router();

import { getEscolas, createEscola, getEscolaById, updateEscola, deleteEscola, createAdminForEscola, getAdminByEscola, updateAdmin, deleteAdmin } from '../controllers/escolas';
import { getAdminById } from '../controllers/admin';
import { verifyAuthenticationAdmin, verifyAuthenticationSuperAdmin } from '../middleware/authorized';

router.post('/create', verifyAuthenticationSuperAdmin, createEscola);
router.get('/all', verifyAuthenticationSuperAdmin, getEscolas);
router.get('/each/:schoolId', verifyAuthenticationAdmin, getEscolaById);
router.put('/update/:schoolId', verifyAuthenticationAdmin, updateEscola);
router.delete('/delete/:schoolId', verifyAuthenticationSuperAdmin, deleteEscola);

// admin para escola como secretario da escola e tal
router.post('/admin/create', verifyAuthenticationAdmin, createAdminForEscola);
router.get('/admin/all', verifyAuthenticationAdmin, getAdminByEscola);
router.get('/admin/each/:adminId', verifyAuthenticationAdmin, getAdminById);
router.put('/admin/update/:adminId', verifyAuthenticationAdmin, updateAdmin);
router.delete('/admin/delete/:adminId', verifyAuthenticationAdmin, deleteAdmin);


export default router;