import express from 'express';

const router = express.Router();

import { getEscolas, createEscola, getEscolaById, updateEscola, deleteEscola, createAdminForEscola, getAdminByEscola, updateAdmin, deleteAdmin } from '../controllers/escolas';
import { getAdminById } from '../controllers/admin';

router.post('/create', createEscola);
router.get('/all', getEscolas);
router.get('/each/:schoolId', getEscolaById);
router.put('/update/:schoolId', updateEscola);
router.delete('/delete/:schoolId', deleteEscola);

// admin
router.post('/admin/create', createAdminForEscola);
router.get('/admin/all', getAdminByEscola);
router.get('/admin/each/:adminId', getAdminById);
router.put('/admin/update/:adminId', updateAdmin);
router.delete('/admin/delete/:adminId', deleteAdmin);



export default router;