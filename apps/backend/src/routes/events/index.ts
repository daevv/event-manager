import { Router } from 'express';
import { createEvent, deleteEvent, getEvent, updateEvent } from '@/controllers/events';
import upload from '@/controllers/events/lib/fileUpload';

const router = Router();

router.post('/create', upload.single('image'), createEvent); // Создание мероприятия
router.put('/update/:id', updateEvent); // Редактирование мероприятия
router.get('/:id', getEvent); // Получение одного мероприятия по ID
router.delete('/events/:id', deleteEvent); // Удаление мероприятия и комментариев

export default router;
