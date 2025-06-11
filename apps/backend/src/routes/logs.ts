import { authenticate } from '@/middleware/auth';
import { Router } from 'express';
import { getLogs } from '@/controllers/logController';

const router = Router();

router.get('/', authenticate, getLogs);

export default router;
