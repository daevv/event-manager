import { Router } from 'express';
import { confirmEmail, login, register } from '@/controllers/auth';

const router = Router();

router.post('/register', register);
router.post('/confirm-email', confirmEmail); // Подтверждение email
router.post('/login', login);

export default router;
