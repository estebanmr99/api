import { Router } from 'express';
import { login, register, loginRequired } from '../controllers/userController.js';

const router = Router();

// registration route
router.post('/auth/register', register);

// login route
router.post('/login', login);

export default router;