import { Router } from 'express';
import { changePassword, login, register, verifyEmail } from '@/controllers/authController';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/changePassword', authenticate, changePassword);

router.get('/verify', verifyEmail);

export default router;
