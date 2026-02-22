import express from 'express';

const router = express.Router();

import * as auth from '../controllers/auth';

router.post('/login', auth.login);

export default router;