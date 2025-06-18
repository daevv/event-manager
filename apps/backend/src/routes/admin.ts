import { Router } from 'express';
import { adminRoutes } from '@/controllers/adminController';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.get('/users', authenticate, adminRoutes.getUsers);
router.post('/users/block/:id', authenticate, adminRoutes.blockUser);
router.get('/comments', authenticate, adminRoutes.getComments);
router.delete('/comments/:id', authenticate, adminRoutes.removeComment);
router.get('/events', authenticate, adminRoutes.getEvents);
router.post('/events/:id', authenticate, adminRoutes.cancelEvent);
router.get('/logs', authenticate, adminRoutes.getLogs);

export default router;
