import { Router } from 'express';
import { login, register, verifyEmail } from '@/controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify', verifyEmail);

export default router;
