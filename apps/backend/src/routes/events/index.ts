import { Router } from 'express';
import { createEvent, deleteEvent, getEvent, updateEvent } from '@/controllers/events';

const router = Router();

router.post('/create', createEvent); // Создание мероприятия
router.put('/update/:id', updateEvent); // Редактирование мероприятия
router.get('/:id', getEvent); // Получение одного мероприятия по ID
router.delete('/events/:id', deleteEvent); // Удаление мероприятия и комментариев

export default router;
