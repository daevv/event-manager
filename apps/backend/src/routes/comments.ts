import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import * as commentController from '../controllers/commentController';

const router = Router();

// Все методы требуют авторизации, так как комментарии связаны с пользователем
router.post('/', authenticate, commentController.createComment);
router.put('/:id', authenticate, commentController.updateComment);
router.delete('/:id', authenticate, commentController.deleteComment);
router.get('/:event_id', commentController.getCommentsByEvent); // Открыт для всех

export default router;
