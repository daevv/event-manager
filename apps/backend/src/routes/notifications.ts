// routes/notification.routes.ts
import { Router } from 'express';
import {
  getUnreadCount,
  getUserNotifications,
  markAllAsRead,
  markAsRead
} from '@/controllers/notifications';
import { authenticate } from '@/middleware/auth';

const router = Router();

router.get('/', authenticate, getUserNotifications);
router.get('/unread-count', authenticate, getUnreadCount);
router.patch('/:id/read', authenticate, markAsRead);
router.patch('/mark-all-read', authenticate, markAllAsRead);

export default router;
