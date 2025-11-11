import express from 'express';
import { MatricularALuno } from '../controllers/matricula';

const router = express.Router();

router.post('/create', MatricularALuno);

export default router;