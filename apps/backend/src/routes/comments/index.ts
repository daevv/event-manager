import { Router } from 'express';
import { addComment, deleteComment, getCommentsByEvent } from '@/controllers/comments';

const router = Router();

// Маршруты для работы с комментариями
router.post('/comments', addComment); // Создание комментария
router.delete('/comments/:id', deleteComment); // Удаление комментария
router.get('/comments/event/:eventId', getCommentsByEvent); // Получение комментариев по ID мероприятия

export default router;
