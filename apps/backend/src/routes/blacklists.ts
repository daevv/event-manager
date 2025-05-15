import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import * as blacklistController from '../controllers/blacklistController';

const router = Router();

router.post('/add', authenticate, blacklistController.addToBlacklist);
router.get('/', authenticate, blacklistController.getBlockedUsers);
router.delete('/:id', authenticate, blacklistController.removeFromBlacklist);

export default router;
