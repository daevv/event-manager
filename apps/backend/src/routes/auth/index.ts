import { Router } from 'express';
import { confirmEmail, login, register } from '@/controllers/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Ограничение на подтверждение email (5 попыток за 15 минут)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 5,
  message: 'Too many requests, please try again later.'
});

router.post('/register', register);
router.post('/confirm-email', limiter, confirmEmail); // Подтверждение email
router.post('/login', login);

export default router;
